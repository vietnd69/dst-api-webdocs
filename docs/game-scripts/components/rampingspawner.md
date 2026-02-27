---
id: rampingspawner
title: Rampingspawner
description: Manages a wave-based spawner that incrementally increases the number of enemy units spawned over time, typically used for progressive boss encounters.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: brain
source_hash: 15081462
---

# Rampingspawner

## Overview
The `RampingSpawner` component orchestrates a wave-based spawning system where enemy entities are spawned in increasing quantities per wave over time. It tracks spawned entities, handles their lifecycle events (death/removal), and manages the progression of wave difficulty. To be functional, it must be integrated with an appropriate brain system that controls when spawning starts and stops.

## Dependencies & Tags
- **Component Usage:** Relies on `inst:DoTaskInTime(...)` for delayed wave transitions (uses the entity's task system).
- **Event Listeners (via ListenForEvent):** Listens to `"inevitabledeath"`, `"death"`, and `"onremove"` events on spawned entities.
- **Event Pusher:** Emits `"rampingspawner_death"` and `"rampingspawner_spawn"` events.
- **Tags:** None explicitly added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawn_prefab` | `string` | `"lavae"` | The prefab name of entities to spawn. |
| `spawns` | `table` | `{}` | Map of spawned entities (keys are entity instances, values are `true`). |
| `num_spawns` | `number` | `0` | Current count of active spawned entities. |
| `current_wave` | `number` | `0` | Number of spawns remaining in the current wave. |
| `wave_num` | `number` | `0` | Total wave index (0-based). Used for scaling difficulty. |
| `min_wave` | `number` | `4` | Minimum number of spawns per wave. |
| `max_wave` | `number` | `10` | Maximum number of spawns per wave. |
| `waves_to_max` | `number` | `6` | Number of waves needed to ramp from `min_wave` to `max_wave`. |
| `wave_time` | `number` | `30` | Delay (in seconds) between the end of one wave and the start of the next. |
| `spawning_on` | `boolean` | `false` | Whether spawning is currently active. |
| `SpawnTask` | `task` | `nil` | Reference to the scheduled task for next wave start (if any). |
| `_ondeathfn` | `function` | (internal) | Callback invoked when a spawned entity dies. |
| `_onremovefn` | `function` | (internal) | Callback invoked when a spawned entity is removed. |
| `getspawnposfn` | `function?` | `nil` | Optional custom function to override spawn position. |
| `getspawnrotfn` | `function?` | `nil` | Optional custom function to override spawn rotation. |
| `onstartfn` | `function?` | `nil` | Optional callback executed when spawning starts. |
| `onstopfn` | `function?` | `nil` | Optional callback executed when spawning stops. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up the component when removed from its entity—cancels any pending spawn task and resets state.
* **Parameters:** None.

### `StopTrackingSpawn(spawn)`
* **Description:** Removes all event listeners and internal tracking for a spawned entity, decrementing `num_spawns`.
* **Parameters:**
  * `spawn` (entity instance): The spawned entity to stop tracking.

### `OnSpawnDeath(spawn)`
* **Description:** Handles cleanup when a spawned entity dies—calls `StopTrackingSpawn`, then broadcasts a `"rampingspawner_death"` event with the remaining spawn count.
* **Parameters:**
  * `spawn` (entity instance): The entity that died.

### `TrackSpawn(spawn)`
* **Description:** Adds event listeners and tracks a newly spawned entity. Ensures it’s only tracked once.
* **Parameters:**
  * `spawn` (entity instance): The entity to begin tracking.

### `GetWaveSize()`
* **Description:** Computes the size of the next wave by linearly interpolating between `min_wave` and `max_wave` based on `wave_num / waves_to_max`.
* **Parameters:** None.
* **Returns:** `number` — The wave size (floored integer).

### `DoWave()`
* **Description:** Starts a new wave by incrementing `wave_num` and adding the computed wave size to `current_wave`.
* **Parameters:** None.

### `GetSpawnPos()`
* **Description:** Returns the spawn position—either from a custom `getspawnposfn` or the spawner entity’s current position.
* **Parameters:** None.
* **Returns:** `Vector3` — Spawn position.

### `GetSpawnRot()`
* **Description:** Returns the spawn rotation—either from a custom `getspawnrotfn` or the spawner entity’s current rotation.
* **Parameters:** None.
* **Returns:** `number` — Rotation angle in degrees.

### `SpawnEntity()`
* **Description:** Instantiates a new entity using `spawn_prefab`, places it at the correct position/rotation, tracks it, decrements `current_wave`, and triggers `"rampingspawner_spawn"`. If no spawns remain in the wave, schedules the next wave after `wave_time` seconds.
* **Parameters:** None.

### `IsActive()`
* **Description:** Returns whether spawning is currently active (`spawning_on`).
* **Parameters:** None.
* **Returns:** `boolean`.

### `Start()`
* **Description:** Begins spawning—calls `DoWave()`, sets `spawning_on = true`, and invokes `onstartfn` if defined. Has no effect if already active.
* **Parameters:** None.

### `Stop()`
* **Description:** Stops spawning—sets `spawning_on = false`, cancels `SpawnTask`, and invokes `onstopfn` if defined. Has no effect if already inactive.
* **Parameters:** None.

### `Reset()`
* **Description:** Clears all tracked spawns, sets `current_wave` and `wave_num` to 0, and stops any pending wave task.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes key state (`spawns`, `current_wave`, `wave_num`, `spawning_on`) for persistence. Returns GUIDs for saved spawns.
* **Parameters:** None.
* **Returns:** `data` (table), `refs` (table of GUIDs).

### `OnLoad(data)`
* **Description:** Restores state (`current_wave`, `wave_num`, `spawning_on`) from saved data. Automatically restarts spawning if `spawning_on` was true.
* **Parameters:**
  * `data` (table): Saved component state.

### `LoadPostPass(ents, data)`
* **Description:** After world loading, reattaches event listeners to previously spawned entities using their GUIDs.
* **Parameters:**
  * `ents` (table): Mapping of GUIDs to entities.
  * `data` (table): Saved data containing `spawns` list.

## Events & Listeners
- **Listens For:**
  - `"inevitabledeath"` (on spawned entities) → triggers `_ondeathfn`
  - `"death"` (on spawned entities) → triggers `_ondeathfn`
  - `"onremove"` (on spawned entities) → triggers `_onremovefn`
- **Triggers:**
  - `"rampingspawner_death"` — after a spawned entity dies (includes `remaining_spawns` in event data).
  - `"rampingspawner_spawn"` — after a new entity is spawned (includes `newent` in event data).