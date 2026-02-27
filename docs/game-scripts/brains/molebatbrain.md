---
id: molebatbrain
title: Molebatbrain
description: Brain component that controls the behavioral logic for molebat characters, managing state transitions for navigation, nesting, eating, combat, and sleep.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 7c611842
---

# Molebatbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`MolebatBrain` is a brain component that implements the decision-making logic for molebat entities. It uses a behavior tree (`BT`) with prioritized conditional nodes to govern state transitions between combat (chasing, dodging, summoning), nest building, nest cleanup, going home, sleeping, foraging/eating, face tracking, and wandering. It integrates with core systems such as combat, entity tracking, eater, and known locations to make context-aware decisions about behavior sequencing.

## Dependencies & Tags
- **Components used:**  
  `combat`, `eater`, `entitytracker`, `knownlocations`  
- **Tags:**  
  `"molebathill"` (used for finding existing molehills),  
  `"DECOR"`, `"FX"`, `"NOCLICK"`, `"INLIMBO"`, `"outofreach"`, `"notarget"` (excluded in entity filtering),  
  `"busy"` (state tag checked via `inst.sg:HasStateTag("busy")`).  
- No tags are added or removed by this component itself.

## Properties
The constructor initializes no custom properties; the component inherits from `Brain` and dynamically manages state via the behavior tree and event listeners (see "Events & Listeners").

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `Entity` | *from Brain._ctor* | Reference to the entity instance this brain controls. |
| `self.bt` | `BT` | *assigned in `OnStart`* | Behavior tree root node, created and set during brain initialization. |

## Main Functions

### `MoleBatBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree root for the molebat. Called automatically when the brain component starts (typically during entity spawn or after a stategraph reset). Constructs a priority-weighted behavior tree with conditional nodes handling panic, summoning, combat, nest management, navigation, and idle behaviors.
* **Parameters:** None.
* **Returns:** None. Sets `self.bt`.

## Internal Helper Functions
The following functions are defined locally and used as callbacks within the behavior tree. They are not exported methods but are critical to the brain's operation.

### `CleanUpNest(inst)`
* **Description:** Computes and returns an action to break the molebat's burrow (molehill) when the nest is flagged for cleaning. Used when `inst._nest_needs_cleaning` is true.
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
* **Returns:**  
  `BufferedAction` — An action to perform `ACTIONS.BREAK` on the burrow entity, or `nil` if cleanup is no longer needed.

### `ShouldBuildHome(inst)`
* **Description:** Determines whether the molebat should build a new molehill home. Returns `true` only if not busy, not already near an existing molehill, and not currently napping (if `WantsToNap` exists).
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
* **Returns:**  
  `boolean` — `true` if the molebat should build a home, otherwise `false`.

### `CreateBurrow(inst)`
* **Description:** Returns a buffered action to create a new molehill at a nearby walkable offset from the molebat’s current position. Uses `ACTIONS.MAKEMOLEHILL` and random offset search.
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
* **Returns:**  
  `BufferedAction` — An action to perform `ACTIONS.MAKEMOLEHILL` at a computed position, or `nil` if no valid offset is found.

### `ShouldGoSleepAtHome(inst)`
* **Description:** Checks if the molebat is ready to sleep at its burrow. Requires that the molebat is not busy, wants to nap (if `WantsToNap` is defined), and has a registered burrow entity.
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
* **Returns:**  
  `boolean` — `true` if the molebat should go to sleep at home.

### `GoSleepAtHomeAction(inst)`
* **Description:** Returns a buffered action to travel to the registered burrow for napping.
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
* **Returns:**  
  `BufferedAction` — An action to perform `ACTIONS.TRAVEL` to the burrow position.

### `ShouldGoHome(inst)`
* **Description:** Checks if the molebat is sufficiently far from the registered "home" location and should return. Uses squared distance comparison against `GO_HOME_DSQ = 900`.
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
* **Returns:**  
  `boolean` — `true` if the molebat is outside the home zone and not in combat.

### `GoHomeAction(inst)`
* **Description:** Returns a buffered action to walk to the registered "home" location, provided the molebat has no active combat target.
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
* **Returns:**  
  `BufferedAction` — An action to perform `ACTIONS.WALKTO` toward the home location, or `nil`.

### `EatFoodAction(inst)`
* **Description:** Searches for edible food items near the molebat (within `SEE_FOOD_DIST = 25`) and returns an action to eat the first valid candidate. Items must be alive ≥ 8 seconds, on passable terrain, edible, and within `GO_HOME_DSQ` of home.
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
* **Returns:**  
  `BufferedAction` — An action to perform `ACTIONS.EAT` on the target, or `nil`.

### `GetFaceTargetFn(inst)`
* **Description:** Returns the nearest player within `START_FACE_DIST = 6` that does not have the `"notarget"` tag.
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
* **Returns:**  
  `Entity` — The nearest eligible player, or `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Determines whether the molebat should keep facing the current face target (i.e., player). Returns `true` if the target does not have `"notarget"` and is within `KEEP_FACE_DIST = 8`.
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
  `target` (`Entity`) — The current face target.  
* **Returns:**  
  `boolean` — `true` if the face target should be maintained.

### `GetRunAwayTarget(inst)`
* **Description:** Returns the current combat target for the `RunAway` behavior.
* **Parameters:**  
  `inst` (`Entity`) — The molebat instance.  
* **Returns:**  
  `Entity` — The combat target stored in `inst.components.combat.target`.

## Events & Listeners
- **Listens to:**  
  None directly in this file. Entity removal listening for `"burrow"` is handled inside `CleanUpNest` via `EntityTracker`, which internally registers `inst:ListenForEvent("onremove", onremove, burrow)`.  
- **Pushes:**  
  `"summon"` — fired during the `"Summon Allies"` behavior tree branch when the molebat is in combat cooldown but eligible to summon allies (`ShouldSummonAllies()` returns `true`).