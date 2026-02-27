---
id: cookiecutterbrain
title: Cookiecutterbrain
description: Controls the behavior tree logic for the Cookiecutter creature, orchestrating fleeing, wandering, boarding boats, and returning to home location.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: e575b068
---

# Cookiecutterbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This component implements the behavior tree for the Cookiecutter entity, a creature in DST that actively flees from threats, wanders within a defined area, attempts to board boats when nearby, and returns to its remembered "home" location when it strays too far. It extends the base `Brain` class and uses a hierarchical priority-based behavior tree (`BT`) to sequence actions such as `RunAway`, `Wander`, `DoAction`, `Leash`, and `StandStill`. Interaction with external systems includes checking the burning state of nearby objects via `Burnable` and managing known locations via `KnownLocations`.

## Dependencies & Tags

- **Components used:**
  - `burnable`: Accessed via `target.components.burnable:IsBurning()` and `target.components.burnable:IsSmoldering()`.
  - `knownlocations`: Accessed via `inst.components.knownlocations:GetLocation("home")` and `inst.components.knownlocations:RememberLocation("home", ...)`.
- **Tags:** Checks for tags `edible_WOOD`, `INLIMBO`, `boat`, and state tags `busy`, `jumping`, `drilling`; also interacts with `"scarytocookiecutters"` and `"scarytoprey"` in `RunAway` calls.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `BOARD_BOAT_TIMEOUT` | `number` | `5` | Maximum wait time (in seconds) after initiating boat boarding attempt. |
| `SCATTER_DIST` | `number` | `3` | Distance threshold (squared) at which the Cookiecutter starts fleeing from scary entities. |
| `SCATTER_STOP` | `number` | `5` | Distance threshold (squared) at which fleeing stops. |
| `FLEE_DIST` | `number` | `15.5` | Distance threshold at which the Cookiecutter flees from entities tagged `"scarytoprey"`. |
| `FLEE_STOP` | `number` | `14.5` | Distance threshold at which prey fleeing stops. |
| `WANDER_DIST` | `number` | `TUNING.COOKIECUTTER.WANDER_DIST` | Radius (squared) within which the Cookiecutter wanders. |
| `WANDER_TIMES` | `table` | `{minwalktime=2.0, randwalktime=4.0, minwaittime=3.0, randwaittime=6.0}` | Parameters controlling wander timing intervals. |
| `inst` | `Entity` | — | The entity instance this brain controls. |
| `bt` | `BT` | — | The behavior tree instance, initialized in `OnStart`. |

## Main Functions

### `CookieCutterBrain:OnStart()`
* **Description:** Initializes and assigns the root node of the behavior tree. This function constructs a `PriorityNode`-based structure that evaluates behaviors in order of priority, including fleeing, drilling pause, wandering, and boat boarding.
* **Parameters:** None.
* **Returns:** None. Modifies `self.bt` with the constructed behavior tree.

### `CookieCutterBrain:OnInitializationComplete()`
* **Description:** Records the Cookiecutter's current position as its "home" location. This location is used by the `Leash` and `Wander` behaviors as a reference point.
* **Parameters:** None.
* **Returns:** None. Calls `RememberLocation("home", ...)` on the `knownlocations` component.

### `EatFoodAction(inst)`
* **Description:** A helper function used by `DoAction` to determine whether the Cookiecutter can eat floating edible wood items. Checks proximity, validity, tag conditions, and absence of burning/smoldering states.
* **Parameters:**
  - `inst` (`Entity`): The Cookiecutter instance evaluating the action.
* **Returns:** A `BufferedAction` if valid, otherwise `nil`.

### `GetTargetPosition(inst)`
* **Description:** Returns the position of `inst.target_wood` if it is valid; otherwise returns `nil`. Used by `Leash`.
* **Parameters:**
  - `inst` (`Entity`): The Cookiecutter instance.
* **Returns:** `Vector` or `nil`.

### `GetWanderPoint(inst)`
* **Description:** Returns the remembered "home" location (as a `Vector` via `GetLocation("home")`), used as the target point for wandering.
* **Parameters:**
  - `inst` (`Entity`): The Cookiecutter instance.
* **Returns:** `Vector` or `nil`.

### `IsTooFarFromHome(inst)`
* **Description:** Determines whether the Cookiecutter has moved too far from its home location (more than `2 * WANDER_DIST` in Euclidean distance).
* **Parameters:**
  - `inst` (`Entity`): The Cookiecutter instance.
* **Returns:** `true` if distance exceeds threshold, otherwise `false`.

### `CalcWanderDir(inst)`
* **Description:** Computes a randomized wander direction based on current rotation and a cubic random variation (scaled to 60 degrees).
* **Parameters:**
  - `inst` (`Entity`): The Cookiecutter instance.
* **Returns:** `number` (angle in radians).

### `BoatInRange(inst)`
* **Description:** Checks whether a valid boat is nearby (`< 6 units`) and the Cookiecutter is not in a busy or jumping state.
* **Parameters:**
  - `inst` (`Entity`): The Cookiecutter instance.
* **Returns:** `true` if boat is in range and conditions are met, otherwise `false`.

### `TryToBoardBoat(inst)`
* **Description:** Instructs the behavior tree to transition to the `"jump_pre"` state with the boat's position, initiating the boarding animation.
* **Parameters:**
  - `inst` (`Entity`): The Cookiecutter instance.
* **Returns:** None. Calls `inst.sg:GoToState("jump_pre", boat_pos)`.

## Events & Listeners

- **Listens to:** None identified (no `inst:ListenForEvent` calls observed).
- **Pushes:** 
  - `"gohome"`: Pushed when `IsTooFarFromHome` becomes true, to trigger return-to-home logic in the behavior tree.