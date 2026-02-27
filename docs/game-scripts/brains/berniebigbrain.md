---
id: berniebigbrain
title: Berniebigbrain
description: Manages AI behavior for Bernie entities by coordinating movement, combat, and leader-following logic based on sanity, proximity, and combat state.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 23be2eca
---

# Berniebigbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `BernieBigBrain` component implements the behavior tree logic for Bernie entities (big bernie followers), determining how they track, follow, and fight alongside a designated leader. It dynamically selects between aggressive combat behavior and passive following (walk/run), adapts based on the leader's sanity and "hotheaded" state, and manages leader assignment via a priority-based decision process. It integrates closely with the `Combat` component for target tracking and the `Sanity` component to evaluate leader suitability. The component uses behavior tree nodes (`ChaseAndAttack`, `Follow`, `FaceEntity`, `Wander`) defined in external behavior files.

## Dependencies & Tags

- **Components used:**
  - `combat`: Accessed via `inst.components.combat` for `GetLastAttackedTime()`, `lastdoattacktime`, and `target`.
  - `sanity`: Accessed via `inst.components.sanity:GetPercent()` to check leader sanity levels.
- **Tags:**None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_leader` | `Entity` or `nil` | `nil` | Reference to the currently assigned leader entity. Used for following and context-aware behavior switching. |
| `_isincombat` | `boolean` | `false` | Tracks whether the Bernie is currently engaged in combat, influencing follow behavior thresholds. |

## Main Functions

### `ShouldDeactivate(self)`
* **Description:** Evaluates whether the Bernie should deactivate (shrink). It first attempts to retain or reassign a valid leader based on tags, sanity, visibility, and "hotheaded"/crazy conditions. Deactivation is prevented if the entity is in a "busy" state, recently attacked, recently attacked, or if a leader is flagged as "crazy"/"hotheaded". Returns `true` when deactivation conditions are met.
* **Parameters:**
  - `self`: The BernieBigBrain component instance.
* **Returns:** `boolean` — `true` if the Bernie should shrink/deactivate.

### `SetLeader(self, leader)`
* **Description:** Assigns a new leader, updating internal `_leader` and registering/deregistering this Bernie in the leader's `bigbernies` table. Fires `onLeaderChanged` event on the entity if the leader changes.
* **Parameters:**
  - `self`: The BernieBigBrain component instance.
  - `leader`: `Entity` or `nil` — The new leader to assign.
* **Returns:** `nil`.

### `GetLeader(self)`
* **Description:** Returns the current `_leader` if still valid according to `KeepLeaderFn`; otherwise clears it via `SetLeader` and returns `nil`.
* **Parameters:**
  - `self`: The BernieBigBrain component instance.
* **Returns:** `Entity` or `nil`.

### `ShouldWalkToLeader(self)`
* **Description:** Determines if the Bernie should walk toward its leader (instead of running). Returns `true` if the Bernie is not currently running, a leader exists, and is within walking distance threshold (`WALK_FOLLOW_THRESHOLD = 11`).
* **Parameters:**
  - `self`: The BernieBigBrain component instance.
* **Returns:** `boolean`.

### `ShouldRunToLeader(self)`
* **Description:** Determines if the Bernie should run toward its leader. Returns `true` if a leader exists and either is not close enough or the leader is not in a "moving" state.
* **Parameters:**
  - `self`: The BernieBigBrain component instance.
* **Returns:** `boolean`.

### `KeepLeaderFn(inst, leader)`
* **Description:** Helper function used to validate whether a leader should remain assigned. Checks if the leader is valid, visible or teleported, and satisfies either low sanity (`< 0.5`) or "hotheaded" condition.
* **Parameters:**
  - `inst`: The Bernie entity instance.
  - `leader`: The candidate leader entity.
* **Returns:** `boolean` — `true` if the leader should be retained.

### `OnStart()`
* **Description:** Initializes the behavior tree root with priority nodes: deactivate check, combat (`ChaseAndAttack`), running/walking follow via `Follow` (with different flags for speed), `FaceEntity` to orient toward leader, and fallback `Wander`. Registers an `onremove` event listener to clear the leader reference.
* **Parameters:** None.
* **Returns:** `nil`.

### `OnStop()`
* **Description:** Cleans up resources: removes the `onremove` event listener, and clears the current leader via `SetLeader`.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners

- **Listens to:**
  - `onremove`: Listens via `inst:ListenForEvent("onremove", ...)` to ensure `_leader` is cleared when the Bernie entity is removed.
- **Pushes:** None identified.

## Constants (Relevant Behavior Thresholds)

| Constant | Value | Purpose |
|----------|-------|---------|
| `MIN_FOLLOW_DIST` | `1` | Minimum distance to maintain while following. |
| `MAX_FOLLOW_DIST` | `8` | Distance at which following behavior ends. |
| `TARGET_FOLLOW_DIST` | `5` | Target distance during following. |
| `WALK_FOLLOW_THRESHOLD` | `11` | Distance beyond which Bernie begins running instead of walking. |
| `RUN_FOLLOW_THRESHOLD` | `6` | (`TARGET_FOLLOW_DIST + 1`) — run until within this distance of leader. |
| `MIN_COMBAT_TARGET_DIST` | `11` | Minimum distance threshold for entering combat mode when not already in combat. |
| `MAX_COMBAT_TARGET_DIST` | `14` | Maximum distance threshold to remain in combat mode when already in combat. |
| `FIND_LEADER_DIST_SQ` | `484` | (`22 * 22`) — Max squared distance to search for a new leader. |
| `LOSE_LEADER_DIST` | `30` | Used conceptually; distance checks use `LOSE_LEADER_DIST_SQ = 900`. |
| `MIN_ACTIVE_TIME` | `4` | Minimum time alive before deactivation is considered. |
| `DEACTIVATE_DELAY` | `16` | Delay after last combat activity before deactivation is allowed. |
| `FOLLOWER_SANITY_THRESHOLD` | `0.5` | Sanity below which a player becomes a viable leader candidate. |