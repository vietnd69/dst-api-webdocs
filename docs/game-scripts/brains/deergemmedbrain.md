---
id: deergemmedbrain
title: Deergemmedbrain
description: Brain component controlling the behavior of deer entities that are tethered to a keeper (e.g., enslaved or leashed), handling leash mechanics, combat reset logic, and transitions between formations, chasing, and unshackling states.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 89438802
---

# Deergemmedbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `DeerGemmedBrain` component implements the behavior tree logic for deer entities under the influence of a keeper (e.g., Gemmed Deer). It manages movement relative to a keeper position, combat engagement rules (including release conditions), and panic/avoidance states. This brain is used when the deer is *not* fully enslaved (i.e., not a permanent slave) and must be guided or recalled when too far from the keeper. It interacts with the `combat`, `entitytracker`, `health`, and `knownlocations` components to determine target status, keeper presence, and position offsets.

The behavior tree prioritizes panic/avoidance over formation following, then alternates between forming near the keeper, chasing a target if combat conditions are met, and eventually unshackling if the keeper is lost long enough.

## Dependencies & Tags
- **Components used:**
  - `entitytracker`: to retrieve the "keeper" entity (`GetKeeper`)
  - `health`: to check if the keeper is dead (`IsDead`)
  - `knownlocations`: to retrieve the "keeperoffset" position (`GetKeeperOffset`)
  - `combat`: to manage target (`SetTarget`, `TargetIs`)
- **Tags:** None explicitly added, removed, or checked in this file.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_farfromkeeper` | `boolean` | `false` | Tracks whether the entity is currently beyond the "far" distance threshold from its keeper position. |
| `_lostkeepertime` | `number?` | `nil` | Timestamp (game time) after which the entity should unshackle if the keeper remains missing. `nil` means not tracking loss yet. |

## Main Functions
### `DeerGemmedBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) for the entity. Constructs a priority-based behavior tree with multiple `WhileNode` conditions that define state transitions — such as panic, formation, chasing, far-from-keeper召回, combat reset, and unshackling. The root node has a priority threshold of `0.5`.
* **Parameters:** None.
* **Returns:** `nil`. Assigns `self.bt`.

## Helper Functions (Internal)
### `GetKeeper(inst)`
* **Description:** Retrieves the entity tagged as the "keeper" using `entitytracker:GetEntity`.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Entity?` — The keeper entity or `nil`.

### `GetKeeperPos(inst)`
* **Description:** Returns the current world position of the keeper.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Vector3?` — The keeper's position or `nil` if the keeper is absent.

### `GetKeeperOffset(inst)`
* **Description:** Retrieves the stored offset position for the keeper (used for formation alignment).
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Vector3?` — The offset vector or `nil`.

### `GetSlavePos(inst)`
* **Description:** Computes the target position for the entity (formation position) by adding the keeper offset to the keeper's position, if available.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Vector3?` — The target position or `nil`.

### `IsFarFromKeeper(self)`
* **Description:** Computes whether the entity is beyond `FAR_DIST_SQ` (`7 * 7 = 49`) units squared from the slave position. Updates `self._farfromkeeper` and returns the result.
* **Parameters:** `self` — The brain instance.
* **Returns:** `boolean` — `true` if far, `false` otherwise.

### `GetFaceTargetFn(inst)`
* **Description:** Returns the current combat target as the face target (used by `FaceEntity` behavior).
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Entity?` — The combat target.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Checks whether the given target is still the current combat target.
* **Parameters:**  
  - `inst` — The entity instance.  
  - `target` — The candidate target entity.
* **Returns:** `boolean` — `true` if the target matches the combat target.

### `ShouldPanic(self)`
* **Description:** Determines if the entity should panic due to magic avoidance or general panic triggers (via `BrainCommon.ShouldTriggerPanic`).
* **Parameters:** `self` — The brain instance.
* **Returns:** `boolean` — `true` if panic condition is met.

### `ShouldChase(self)`
* **Description:** Determines whether the entity should break formation and chase. Logic:
  - If no keeper exists (not enslaved), always returns `false` (handled separately by `ChaseAndAttack` with `MAX_CHASE_TIME`).
  - If the keeper is unchained and dead, returns `true`.
  - If a combat target exists and is within attack range (`TUNING.DEER_ATTACK_RANGE + target:GetPhysicsRadius(0)`), returns `true`.
  - Otherwise, clears the combat target and returns `false`.
* **Parameters:** `self` — The brain instance.
* **Returns:** `boolean` — Whether the entity should chase.

### `ShouldResetCombat(self)`
* **Description:** Resets the combat state when a keeper is present or starts tracking keeper loss timing. Returns `true` when the entity can safely disengage (e.g., after a delay if keeper lost).
* **Parameters:** `self` — The brain instance.
* **Returns:** `boolean` — `true` if combat should be reset.

### `ShouldUnshackle(self)`
* **Description:** Returns `true` if the keeper loss timer has expired (`_lostkeepertime < GetTime()`), indicating the entity is ready to unshackle.
* **Parameters:** `self` — The brain instance.
* **Returns:** `boolean` — Whether the entity should unshackle.

## Events & Listeners
- **Pushes:**  
  - `"unshackle"` — Pushed when the unshackle behavior triggers; signals the entity should detach from keeper control.

- **Listens to:** None explicitly registered in this file (inherited event handling from `Brain` base class or behaviors may exist but are not declared here).

---