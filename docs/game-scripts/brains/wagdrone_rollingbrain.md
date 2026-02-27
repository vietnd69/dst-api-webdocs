---
id: wagdrone_rollingbrain
title: Wagdrone Rollingbrain
description: Manages AI behavior and movement for the rolling variant of the Wagdrone, handling target validation, destination calculation, recoil mechanics, and speed adjustment via locomotor integration.
tags: [ai, movement, boss, combat, physics]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: entity
source_hash: 5fd7562f
---

# Wagdrone Rollingbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component controls the AI logic for the rolling variant of the Wagdrone entity. It manages target acquisition, movement destination calculation, and dynamic speed modification during recoil events using the `locomotor` component. The brain prioritizes selecting valid workable entities (e.g., CHOP_workable, MINE_workable) or other compatible wagdrones within a specified radius, and integrates with the `leash` and `standstill` behavior framework to coordinate movement and state transitions.

The component interacts with several core systems:
- `health.lua`: To verify targets are alive via `IsDead()`.
- `knowndynamiclocations.lua`: To locate the deploy point for radius-based targeting.
- `locomotor.lua`: To apply and remove external speed multipliers during recoil.
- `playercontroller.lua`: To detect remote player interactions (e.g., pickup attempts).
- `workable.lua`: To verify if targets are currently workable and match required actions.

## Usage example

The brain is typically attached to an entity during its initialization in a prefab definition. Here is a minimal example:

```lua
inst:AddComponent("brain")
inst.components.brain:SetBrainClass(require("brains/wagdrone_rollingbrain"))
```

Once attached, the brain automatically starts when the entity enters its corresponding stategraph. No further manual calls are required under normal circumstances.

## Dependencies & tags

**Components used:**
- `health` (via `IsDead()`)
- `knowndynamiclocations` (via `GetDynamicLocation("deploypoint")`)
- `locomotor` (via `SetExternalSpeedMultiplier`, `RemoveExternalSpeedMultiplier`)
- `playercontroller` (via `GetRemoteInteraction()`)
- `workable` (via `CanBeWorked()`, `GetWorkAction()`)

**Tags checked/used:**
- Target validation uses tag filters: `"wagdrone_rolling"`, `"INLIMBO"`, `"NOCLICK"`, `"CHOP_workable"`, `"MINE_workable"`, `"usesdepleted"`, `"waxedplant"`, `"event_trigger"`, `"HAMMER_workable"`.
- Internal tag groupings: `DRONE_TAGS = { "wagdrone_rolling" }`, `DRONE_NO_TAGS = { "INLIMBO", "NOCLICK", "HAMMER_workable", "usesdepleted" }`, `WORK_TAGS = { "CHOP_workable", "MINE_workable" }`, `WORK_NO_TAGS = { "INLIMBO", "NOCLICK", "waxedplant", "event_trigger" }`.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `EntityScript?` | `nil` | Currently selected movement/interaction target. May be an entity or a position vector. |
| `dest` | `Vector3` | `Vector3()` | Calculated destination position for the entity to move toward. |
| `recoildest` | `Vector3` | `Vector3()` | Adjusted destination used during the recoil phase of spinning. |
| `recoilangleoffset` | `number?` | `nil` | Angle (in radians) to offset movement direction during recoil. |
| `recoiltime` | `number?` | `nil` | Timestamp (via `GetTime()`) when the current recoil event started. |
| `recoilspeedmult` | `number` | `1` | Cached speed multiplier applied during the deceleration phase of recoil. |
| `recoilacceltime` | `number?` | `nil` | Timestamp marking when the acceleration phase after recoil began. |

## Main functions

### `UpdateTargetDest()`
* **Description:** Determines and sets the movement destination (`self.dest` or `self.recoildest`) based on the current target and recoil state. Validates targets, recalculates destinations dynamically, and applies speed multipliers via the `locomotor` during recoil phases.
* **Parameters:** None.
* **Returns:** `Vector3?` — The target destination (either `self.dest` or `self.recoildest`) if valid; `nil` if no target or target invalid.
* **Error states:** Returns `nil` if:
  - `GetDeployPoint()` returns `nil` and no fallback target is found.
  - Target validation (`ValidateExistingTarget`) fails (e.g., dead, limbo, wrong platform).
  - Target is outside allowed range and `ignorerange` is not set.

### `AccelAfterRecoil()`
* **Description:** Applies a quadratic acceleration easing curve to smoothly restore movement speed after the deceleration phase of a recoil event. Removes the external speed multiplier once full speed is restored.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** No known failure conditions. Only active when `self.recoilacceltime` is non-`nil`.

### `SetRecoilAngle(recoilangle)`
* **Description:** Initiates or updates a recoil event by computing an angular offset between the current movement direction and a new `recoilangle`. Triggers recalculation of `recoildest`, sets the recoil start timestamp, and clears any previous speed multiplier.
* **Parameters:**
  - `recoilangle` (`number`): Target angle (in radians) to which the entity is recoiling. Must be reduced via `ReduceAngleRad` externally if needed; this function calls `ReduceAngleRad` internally to compute offset.
* **Returns:** `nil`.
* **Error states:** No effect if `self.target` is `nil` or if current destination direction vector is zero.

### `ResetTargets()`
* **Description:** Clears all tracked targets and resets recoil-related state, including stopping any active speed multiplier.
* **Parameters:** None.
* **Returns:** `nil`.

### `OnStart()`
* **Description:** Initializes the behavior tree with a root node that checks for persistence and state guards, then handles pickup interrupts via `StandStill`, leash-based movement via `Leash`, and fallback idle behavior.
* **Parameters:** None.
* **Returns:** `nil`.
* **Details:** Registers a listener for the `"spinning_recoil"` event, which calls `SetRecoilAngle`.

### `OnStop()`
* **Description:** Cleans up the brain state: unregisters `"spinning_recoil"` listener, clears `target`, resets recoil time/acceleration fields, and removes the recoil speed multiplier.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & listeners

- **Listens to:**
  - `"spinning_recoil"`: Fires on the entity (`self.inst`) when the wagdrone enters a recoil state; invokes `SetRecoilAngle` with the provided angle data.

- **Pushes:**
  - None. This component does not directly push any events.

---