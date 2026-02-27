---
id: knightbrain
title: Knightbrain
description: Implements the behavior tree logic for the Knight entity, governing movement, combat, formation tactics, and conditional actions like jousting and stage seating based on game state and entity roles.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 550c4dab
---

# Knightbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`Knightbrain` implements the behavior tree (`BT`) for the Knight entity in DST, specifically handling group coordination (for "Gilded" variants), combat engagement (including dodging and jousting), and environment-aware navigation. It extends `Brain` and constructs a hierarchical priority-based behavior tree in `OnStart`, integrating with components like `combat`, `follower`, `stageactor`, and `entitytracker` to support context-sensitive actions such as formation positioning, stage seat detection, and leader-based movement.

## Dependencies & Tags
- **Components used:**
  - `combat` (via `inst.components.combat:HasTarget()`, `InCooldown()`, and `target` property)
  - `entitytracker` (via `inst.components.entitytracker:GetEntity(name)`)
  - `follower` (via `inst.components.follower:GetLeader()`)
  - `locomotor` (via `inst.components.locomotor.allow_platform_hopping`)
  - `stageactor` (via `inst.components.stageactor:GetStage()`)
- **Tags:**
  - `gilded_knight`: Checked to enable gilded-specific logic (formation, seating, extended chase distance).
  - `notarget`: Checked to filter potential face targets and leader tracking.
  - `charlie_seat`: Used in seat searching logic.
  - `NOCLICK`, `DECOR`, `FX`: Exclusion tags for seat blocker detection.
- **Behaviors used:** `standstill`, `runaway`, `doaction`, `follow`, `chaseandattack`, `wander`

## Properties
The constructor initializes no explicit instance properties beyond the base `Brain` class. All configuration is done via local constants (e.g., `START_FACE_DIST`, `GILDED_FORMATION_RANGE`) and nested function closures.

## Main Functions
### `KnightBrain:OnStart()`
* **Description:** Constructs the behavior tree root and assigns it to `self.bt`. Initializes gilded-specific node subgraphs and tunes chase/follow distances, formation ranges, and seat detection logic based on the `gilded_knight` tag. This is the primary initialization method called when the brain is attached.
* **Parameters:** None.
* **Returns:** None. Sets `self.bt` internally.

### `GoHomeAction(inst)`
* **Description:** Returns a `BufferedAction` to walk to the entity's home position (obtained via `clockwork_common.GetHomePosition(inst)`) only if the entity has no combat target and is not at home. Used by the `ShouldGoHome` condition node.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** A `BufferedAction` instance or `nil`.

### `GetFaceTargetFn(inst)`
* **Description:** Locates the closest player within `START_FACE_DIST` that is not tagged `"notarget"`. Used for general face-target behavior.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** A target `Entity` instance or `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Continues face behavior if the provided target is within `KEEP_FACE_DIST` and not tagged `"notarget"`.
* **Parameters:**
  - `inst`: The entity instance.
  - `target`: The `Entity` being faced.
* **Returns:** `true` if the target remains valid for facing; otherwise `false`.

### `GetLeader(inst)`
* **Description:** Returns the leader entity using `follower:GetLeader()`.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** An `Entity` instance or `nil`.

### `GetFaceLeaderFn(inst)`
* **Description:** Returns `GetLeader(inst)` for face-on-leader logic.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** Leader `Entity` or `nil`.

### `KeepFaceLeaderFn(inst, target)`
* **Description:** Verifies the provided target is the current leader.
* **Parameters:**
  - `inst`: The entity instance.
  - `target`: The `Entity` to verify as leader.
* **Returns:** `true` if `GetLeader(inst) == target`; otherwise `false`.

### `ShouldGoHome(inst)`
* **Description:** Checks if the entity is farther than `GO_HOME_DIST_SQ` from its home position and if a home position exists.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `true` if the entity should return home; otherwise `false`.

### `ShouldDodge(inst)`
* **Description:** Returns `true` if the entity has a combat target, is in combat cooldown (`combat:InCooldown()`), and sets `inst.hit_recovery` to `TUNING.KNIGHT_DODGE_HIT_RECOVERY`. Otherwise, clears `hit_recovery`.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `true` if dodging should occur; otherwise `false`.

### `ShouldAttack(inst)`
* **Description:** Returns `true` if dodging should not occur (inverted `ShouldDodge`).
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `true` if attacking is allowed; otherwise `false`.

### `GetRunAwayTarget(inst)`
* **Description:** Returns `combat.target` for use by the `RunAway` behavior.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** The current combat target `Entity` or `nil`.

### `AreDifferentPlatforms(inst, target)`
* **Description:** Checks if `inst` and `target` occupy different platforms, respecting `locomotor.allow_platform_hopping`.
* **Parameters:**
  - `inst`: The entity instance.
  - `target`: The target `Entity`.
* **Returns:** `true` if platforms differ and platform hopping is disabled; otherwise `false`.

### `TryJoust(inst)`
* **Description:** If `inst.canjoust` is `true`, checks whether the combat target is within the configured joust range (`TUNING.YOTH_KNIGHT_JOUST_RANGE`) and on the same platform. If all conditions are met, fires the `"dojoust"` event with the target.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** None.

### `AnyHorsemenAllies(inst)`
* **Description:** Checks if any fellow horsemen allies (defined in `YOTH_HORSE_NAMES`) exist and are alive.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `true` if at least one ally exists and is alive; otherwise `false`.

### `GetFormationIndexAndCount(inst)`
* **Description:** Computes the 1-based index of `inst` within the formation (ordered by `YOTH_HORSE_NAMES`) and the total count of alive horsemen (including self). Used to assign positions relative to the leader.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `(index, count)` — `index` is the 1-based formation index, `count` is the total alive horsemen count.

### `GetKnightAtFormationIndex(inst, index)`
* **Description:** Returns the knight entity at a given formation index, using the same ordering logic as `GetFormationIndexAndCount`. Falls back to `inst` if the index is invalid.
* **Parameters:**
  - `inst`: The entity instance.
  - `index`: 1-based integer index.
* **Returns:** The `Entity` at the specified index or `inst`.

### `GetLocationInFormation(inst)`
* **Description:** Computes the ideal world position for `inst` based on the leader's position and its own formation index.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** A `Vector3` position or `nil` if no leader exists.

### `GetWanderFormationPos(inst)`
* **Description:** Calculates the target position during formation wandering based on a periodically rotated leader selection. Reverse-engineers the virtual leader position used by the current leader.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** A `Vector3` position or `nil`.

### `IsWanderFormationLeader(inst)`
* **Description:** Determines if `inst` is currently selected as the wandering leader for the current time slice (using deterministic PRNG seeding).
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `true` if `inst` is the wander leader; otherwise `false`.

### `GetStageSeatPosition(inst)`
* **Description:** For gilded knights, finds the seat assigned to `inst` based on its formation index. Filters out blocked seats and marks `inst.is_sitting = true` on success.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** A `Vector3` seat position or `nil`.

### `GetStageFollowMinDist(inst)`
* **Description:** Returns a minimal follow distance (0.1) if `inst.is_sitting`; otherwise, the default `FOLLOW_MIN_DIST`.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** A number.

### `_calc_formation_pos(leaderpt, formation_index, count)`
* **Description:** Calculates the ideal position around the leader using a circular formation formula with `GILDED_FORMATION_RANGE`. Attempts to offset to land if the computed point is not passable.
* **Parameters:**
  - `leaderpt`: A `Vector3` of the leader's position.
  - `formation_index`: The 1-based index of this entity in the formation.
  - `count`: Total number of entities in the formation.
* **Returns:** A `Vector3` passable position.

### `GetWanderFormationLeaderIndex(inst, count)`
* **Description:** Uses a deterministic seed (based on GUID of the first knight and current time) to pick a leader index for the current `WANDER_SWITCH_PERIOD` interval, ensuring synchronized leader rotation across knights.
* **Parameters:**
  - `inst`: The entity instance.
  - `count`: Total number of knights.
* **Returns:** An integer index between `1` and `count`.

### `MatchWanderLeaderFacing(inst)`
* **Description:** If `inst` is idle and not the current wander leader, aligns its facing direction with the current wander leader (to maintain visual consistency).
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** None.

## Events & Listeners
- **Listens to:** None explicitly defined in this component. Behavior tree execution drives state transitions.
- **Pushes:** `"dojoust", target` — Emitted via `inst:PushEvent` when joust conditions are met during combat.