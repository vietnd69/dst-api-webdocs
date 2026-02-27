---
id: deerbrain
title: Deerbrain
description: Controls the decision-making and behavioral logic for deer entities, including herd movement, grazing, fleeing from threats, and solo wandering.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 8454f523
---

# Deerbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `deerbrain` component defines the behavior tree logic for deer entities. It dynamically selects between two modes: herd-based behavior (e.g., staying near the herd location, grazing, responding to herd-wide alerts) and solo behavior (e.g., wandering, facing players, fleeing from attackers). The brain prioritizes threat responses (panic, combat threats) over movement and idle behaviors, and integrates with the global `deerherding` system to synchronize herd-wide alert states and movement goals.

## Dependencies & Tags
- **Components used:**
  - `combat`: Checks `HasTarget()` and accesses `target`.
  - `deerherding`: Queries `IsActiveInHerd()`, `IsGrazing()`, `SetHerdAlertTarget()`, `GetClosestHerdAlertTarget()`, `HerdHasAlertTarget()`, and reads `herdlocation`.
  - `hauntable`: Reads `panic` property.
  - `knownlocations`: Calls `GetLocation("herdoffset")` to compute herd-relative positions.
- **Tags:** None explicitly added/removed by this component.

## Properties
No public properties are defined in the constructor. The component operates solely through behavior node logic and external component interactions.

## Main Functions
The `deerbrain` does not define any public methods beyond the constructor. Its behavior is entirely driven by behavior tree nodes initialized in `OnStart()`. Helper functions used internally include:

### `ResetData(inst)`
* **Description:** Initializes or updates the deer's herd alert target by finding the closest player within `START_ALERT_DIST` and registers it via `deerherding:SetHerdAlertTarget()`. Called once per behavior tree loop at the root level.
* **Parameters:**
  - `inst`: The deer entity instance.
* **Returns:** `nil`

### `GetAlertTargetFn(inst)`
* **Description:** Returns the closest herd alert target (e.g., a player or predator flagged as a threat) as determined by `deerherding:GetClosestHerdAlertTarget()`.
* **Parameters:**
  - `inst`: The deer entity instance.
* **Returns:** `Inst` or `nil`

### `KeepAlertTargetFn(inst, target)`
* **Description:** Returns `true` if the herd has any active alert targets, allowing the `FaceEntity` node to continue facing toward threats.
* **Parameters:**
  - `inst`: The deer entity instance.
  - `target`: The current alert target (unused).
* **Returns:** `boolean`

### `GetNonHerdingFaceTargetFn(inst)`
* **Description:** Locates the closest player within `SOLO_START_FACE_DIST` for solo-mode face behavior.
* **Parameters:**
  - `inst`: The deer entity instance.
* **Returns:** `Inst` or `nil`

### `KeepNonHerdingFaceTargetFn(inst, target)`
* **Description:** Continues facing a player unless the target has the `"notarget"` tag or is beyond `SOLO_KEEP_FACE_DIST`.
* **Parameters:**
  - `inst`: The deer entity instance.
  - `target`: The entity currently being faced.
* **Returns:** `boolean`

### `GetWanderDistFn(inst)`
* **Description:** Returns the constant wandering distance `WANDER_DIST_DAY` (`10`).
* **Parameters:**
  - `inst`: The deer entity instance (unused).
* **Returns:** `number`

### `GetLocationInHerd(inst)`
* **Description:** Computes the herd's target position by summing the global `deerherding.herdlocation` vector and the `herdoffset` location stored in `knownlocations`.
* **Parameters:**
  - `inst`: The deer entity instance.
* **Returns:** `Vector3` or `nil` if either location is unavailable.

### `GetGrazingLocation(inst)`
* **Description:** Computes a grazing position offset farther from the herd center (`herdlocation + herdoffset * 2`) used during grazing sequences.
* **Parameters:**
  - `inst`: The deer entity instance.
* **Returns:** `Vector3` or `nil` if locations are missing.

### `GetGrazingAngle(inst)`
* **Description:** Computes a random facing angle centered on the herd offset's direction, with a variance of `66 * DEGREES`.
* **Parameters:**
  - `inst`: The deer entity instance.
* **Returns:** `number` (angle in radians)

### `IsHerdGrazing(self)`
* **Description:** Returns `true` if the global `deerherding` component is currently in a grazing state (uses `IsGrazing()`).
* **Parameters:**
  - `self`: The behavior tree context table (contains `self.inst`).
* **Returns:** `boolean`

### `GetRunAwayTarget(inst)`
* **Description:** Returns the current combat target only if it is a valid player entity.
* **Parameters:**
  - `inst`: The deer entity instance.
* **Returns:** `Inst` or `nil`

### `ShouldMoveAsHerd(self)`
* **Description:** Checks whether the deer should move toward the herd center: returns `true` if its squared distance to `GetLocationInHerd()` exceeds half of `TUNING.DEER_HERD_MOVE_DIST`.
* **Parameters:**
  - `self`: The behavior tree context table (contains `self.inst`).
* **Returns:** `boolean`

## Events & Listeners
The component does not register any event listeners or push events directly. It relies entirely on the behavior tree infrastructure to react to state changes and component updates (e.g., via `WhileNode` and `FailIfSuccessDecorator`).