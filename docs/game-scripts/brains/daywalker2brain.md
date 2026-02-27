---
id: daywalker2brain
title: Daywalker2Brain
description: Implements the behavioral logic for Daywalker 2 (a hostile mob) by dynamically selecting actions such as chasing, stalking, rummaging, or fleeing based on combat state, equipment, and environmental junk positions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: daca299e
---

# Daywalker2Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
Daywalker2Brain is a behavior tree (BT) component that controls the AI behavior of Daywalker 2 entities in DST. It determines how the entity engages in combat — including chasing, stalking, tackling, and rummaging for loot — by evaluating combat readiness, weapon availability, and the positions of nearby "junk" objects (which serve as cover and loot sources). The behavior tree dynamically prioritizes actions like rummaging when loot is available and nearby junk exists, switching to stalking during cooldowns, or chasing when ready to attack. It integrates with combat, entity tracking, and stuck detection systems to manage transitions and respond to dynamic gameplay conditions.

## Dependencies & Tags
- **Components used:**
  - `combat` (`inst.components.combat`): For target management, cooldowns, and attack attempts.
  - `entitytracker` (`inst.components.entitytracker`): To locate nearby "junk" entities.
  - `rooted` (`inst.components.rooted`): To check if the entity is immobilized (used in `TryStuckAttack`).
  - `stuckdetection` (`inst.components.stuckdetection`): To detect stalling and trigger stuck-based attacks.
- **Tags:** None explicitly added or removed by this component itself. It interacts with stategraph state tags (`"running"`, `"busy"`, `"jumping"`, `"stalking"`) and state memory (`statemem.thief`, `inst._thief`, `inst._thieflevel`).
- **Behaviors used:**
  - `chaseandattackandavoid`, `faceentity`, `leash`, `leashandavoid`, `standstill`, `wander`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lastjunk` | `Entity?` | `nil` | Stores the last junk entity the AI interacted with. Not actively used in current logic (not referenced beyond initialization). |
| `cachedrummage` | `boolean` | `nil` | Internal state tracking whether the AI has committed to a rummage action. Initialized and managed during behavior evaluation. |

## Main Functions
### `GetJunk(inst)`
* **Description:** Retrieves the "junk" entity tracked by the `entitytracker` component for the given instance.
* **Parameters:** `inst` (Entity): The entity instance requesting the junk.
* **Returns:** `Entity?` — The junk entity if found; otherwise `nil`.

### `GetJunkPos(inst)`
* **Description:** Returns the world position of the junk entity (if present), or `nil`.
* **Parameters:** `inst` (Entity).
* **Returns:** `Vector3?` — Position of the junk, or `nil`.

### `GetTarget(inst)`
* **Description:** Returns the current combat target of the entity (set by the `combat` component).
* **Parameters:** `inst` (Entity).
* **Returns:** `Entity?` — The combat target entity, or `nil`.

### `GetTargetPos(inst)`
* **Description:** Returns the world position of the combat target (if present), or `nil`.
* **Parameters:** `inst` (Entity).
* **Returns:** `Vector3?` — Position of the target, or `nil`.

### `IsTarget(inst, target)`
* **Description:** Checks whether the given `target` is the currently assigned combat target.
* **Parameters:** 
  - `inst` (Entity)
  - `target` (Entity?): The entity to compare against the stored combat target.
* **Returns:** `boolean` — `true` if `target` matches `combat.target`, otherwise `false`.

### `GetCurrentJunkLoot(inst, ignorerange)`
* **Description:** Determines if the entity has a valid junk/loot pair to rummage for, based on equipped items and target proximity (unless `ignorerange` is `true`). Loot includes `"ball"` (for throwing) or item references from `junk:GetNextItem()`.
* **Parameters:** 
  - `inst` (Entity)
  - `ignorerange` (boolean): If `true`, skips proximity checks against the combat target.
* **Returns:** `Entity? junk, string? loot` — Returns `junk`, `loot` if a valid loot type is available; otherwise `nil`.

### `MaxTargetLeashDist(inst)`
* **Description:** Calculates the maximum distance the entity will stray from its combat target before triggering a forced return-to-target behavior (leash pull).
* **Parameters:** `inst` (Entity).
* **Returns:** `number` — Distance in world units (based on target physics radius and tackle readiness).

### `MinTargetLeashDist(inst)`
* **Description:** Calculates the minimum distance the entity must maintain from its target (to ensure tackle or attack execution is possible).
* **Parameters:** `inst` (Entity).
* **Returns:** `number` — Minimum distance in world units (fixed base of `3` plus target radius).

### `LeashShouldRun(inst)`
* **Description:** Determines whether the entity should actively run (instead of walk) to close distance to its target during leash enforcement.
* **Parameters:** `inst` (Entity).
* **Returns:** `boolean` — `true` if running is needed (e.g., stuck, already running, cooldown soon, or target out of tackle range/positioning).

### `ShouldRummage(inst, self)`
* **Description:** Evaluates whether the entity should rummage for loot, considering current target presence, available loot, and equipment state. It caches the rummage decision to avoid premature switching.
* **Parameters:** 
  - `inst` (Entity)
  - `self` (Daywalker2Brain): The brain instance (provides `cachedrummage` state).
* **Returns:** `boolean` — `true` if rummaging is appropriate.

### `ShouldStalk(inst)`
* **Description:** Determines whether the entity should stalk (move slowly or idle while tracking the target), primarily when in combat cooldown or unable to attack with primary weapons.
* **Parameters:** `inst` (Entity).
* **Returns:** `boolean` — `true` if stalking is appropriate.

### `ShouldChase(inst)`
* **Description:** Determines whether the entity should actively chase the target with available weapons (swing or cannon), only when not in cooldown.
* **Parameters:** `inst` (Entity).
* **Returns:** `boolean` — `true` if chasing and attacking is appropriate.

### `ShouldTackle(inst)`
* **Description:** Checks if the entity can successfully tackle the current target within the configured tackle range (`TUNING.DAYWALKER2_TACKLE_RANGE`).
* **Parameters:** `inst` (Entity).
* **Returns:** `boolean` — `true` if tackle conditions are met.

### `TryStuckAttack(inst)`
* **Description:** Forces an attack attempt if the entity is stuck or rooted and not in cooldown, preventing inactivity.
* **Parameters:** `inst` (Entity).
* **Returns:** `nil`

### `GetThief(inst)`
* **Description:** Retrieves a "thief" entity associated with the current instance via state memory or internal properties, if the entity is non-hostile.
* **Parameters:** `inst` (Entity).
* **Returns:** `Entity?` — The thief entity if valid and applicable.

### `Daywalker2Brain:OnStart()`
* **Description:** Initializes the behavior tree (root node) for the entity. This method constructs a complex priority-based tree that evaluates:
  - Non-combat warnings for thieves,
  - Rummage actions for loot when junk is accessible,
  - Stalking during cooldowns or when only tackling is possible,
  - Chasing and attacking when weapons are ready,
  - Idle wandering when out of combat.
* **Parameters:** None.
* **Returns:** `nil`

## Events & Listeners
- **Listens to:** None (the component itself does not register listeners; it relies on the behavior tree calling functions that interact with stategraph and components).
- **Pushes:**
  - `"rummage"` — With `{ junk = junk, loot = loot }` when a rummage action is committed.
  - `"tackle"` — With the target entity when a tackle is triggered (either high or low priority).
  - `"doattack"` — Indirectly via `combat:TryAttack()` during `TryStuckAttack()` (handled by the `combat` component).

Note: Event events are fired via `inst:PushEvent(...)` within action nodes or conditions in the behavior tree, as documented above. No direct `inst:ListenForEvent()` registrations exist in this file.