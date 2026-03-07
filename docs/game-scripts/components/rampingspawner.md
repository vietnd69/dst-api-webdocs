---
id: rampingspawner
title: Rampingspawner
description: Manages progressive spawning of entities in waves, ramping up spawn count over time based on wave progression.
tags: [spawning, boss, wave, ai]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 15081462
system_scope: entity
---

# Rampingspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Rampingspawner` is a component that handles wave-based spawning of entities with a progressively increasing number of spawns per wave. It is designed to be attached to a boss or control entity and must be integrated with a compatible `brain` (e.g., as referenced in the comment: *“Look @ Dragonfly.”*). It tracks spawned entities, handles their lifecycle (death/removal), and supports save/load serialization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("rampingspawner")

inst.components.rampingspawner.spawn_prefab = "lavae"
inst.components.rampingspawner.getspawnposfn = function(parent) return parent:GetPosition() + Vector3(5,0,0) end

inst.components.rampingspawner:Start()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `none`; does not manage tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawn_prefab` | string | `"lavae"` | Name of the prefab to spawn. |
| `spawns` | table | `{}` | Dictionary mapping spawned entity instances to `true` for tracking. |
| `num_spawns` | number | `0` | Current count of tracked spawned entities. |
| `current_wave` | number | `0` | Remaining spawns to execute for the current wave phase. |
| `wave_num` | number | `0` | Total waves completed (used for scaling difficulty). |
| `min_wave` | number | `4` | Minimum spawns per wave at start of ramp. |
| `max_wave` | number | `10` | Maximum spawns per wave at end of ramp. |
| `waves_to_max` | number | `6` | Number of waves over which spawn count ramps up. |
| `wave_time` | number | `30` | Delay (in seconds) between spawning individual entities once wave is nearly complete. |
| `spawning_on` | boolean | `false` | Whether spawning is currently active. |
| `SpawnTask` | Task? | `nil` | Pending delayed task for timed spawning. |
| `getspawnposfn` | function? | `nil` | Optional function `(parent) => Vector3` for custom spawn position. |
| `getspawnrotfn` | function? | `nil` | Optional function `(parent) => number` for custom spawn rotation. |
| `onstartfn` | function? | `nil` | Optional callback `(parent)` executed when starting. |
| `onstopfn` | function? | `nil` | Optional callback `(parent)` executed when stopping. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up the component when removed from its entity: cancels any pending spawn task and resets tracking state.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopTrackingSpawn(spawn)`
* **Description:** Stops listening to and removes an entity from the tracked spawns list.
* **Parameters:**  
  `spawn` (Entity) — The spawned entity to stop tracking.
* **Returns:** Nothing.

### `OnSpawnDeath(spawn)`
* **Description:** Handles a tracked spawn dying; removes it from tracking and fires a `rampingspawner_death` event.
* **Parameters:**  
  `spawn` (Entity) — The spawned entity that died.
* **Returns:** Nothing.

### `TrackSpawn(spawn)`
* **Description:** Begins tracking a newly spawned entity, registering death/remove callbacks.
* **Parameters:**  
  `spawn` (Entity) — The spawned entity to track.
* **Returns:** Nothing.

### `GetCurrentWave()`
* **Description:** Returns the current number of spawns remaining in the active wave.
* **Parameters:** None.
* **Returns:** number — Remaining spawns in the current wave.

### `GetWaveSize()`
* **Description:** Calculates how many spawns should be in the current wave using linear interpolation between `min_wave` and `max_wave`, based on `wave_num` and `waves_to_max`.
* **Parameters:** None.
* **Returns:** number — Scaled wave size (floored integer).

### `DoWave()`
* **Description:** Advances wave progression: increments `wave_num`, and increases `current_wave` by the calculated wave size.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetSpawnPos()`
* **Description:** Returns the spawn position: either via the optional `getspawnposfn`, or the owner entity’s position.
* **Parameters:** None.
* **Returns:** Vector3 — Position to spawn at.

### `GetSpawnRot()`
* **Description:** Returns the spawn rotation: either via the optional `getspawnrotfn`, or the owner entity’s rotation.
* **Parameters:** None.
* **Returns:** number — Rotation angle in degrees.

### `SpawnEntity()`
* **Description:** Spawns a new instance of `spawn_prefab`, positions and rotates it, tracks it, decrements `current_wave`, and fires a `rampingspawner_spawn` event. If `current_wave` reaches zero and spawner is active, schedules the next wave after `wave_time`.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsActive()`
* **Description:** Returns whether spawner is currently active (i.e., in `spawning_on` state).
* **Parameters:** None.
* **Returns:** boolean — `true` if spawning is active.

### `Start()`
* **Description:** Begins spawning: calls `DoWave()` once, sets `spawning_on` to `true`, and invokes `onstartfn` if defined.
* **Parameters:** None.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Halts spawning: sets `spawning_on` to `false`, cancels `SpawnTask`, and invokes `onstopfn` if defined.
* **Parameters:** None.
* **Returns:** Nothing.

### `Reset()`
* **Description:** Clears all tracking data and resets `current_wave` to zero; does not change `spawning_on`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes tracking state (including GUIDs of spawned entities), current wave info, and `spawning_on` flag.
* **Parameters:** None.
* **Returns:**  
  `data` (table) — Serializable state object.  
  `refs` (array of GUIDs) — List of entity GUIDs to persist separately.

### `OnLoad(data)`
* **Description:** Restores serialized state: wave counters and `spawning_on` flag. If `spawning_on` was true, automatically calls `Start()`.
* **Parameters:**  
  `data` (table) — Deserialized state data.
* **Returns:** Nothing.

### `LoadPostPass(ents, data)`
* **Description:** After world load completes, reattaches tracked spawns using GUID references.
* **Parameters:**  
  `ents` (table) — Map of GUID → entity.  
  `data` (table) — Contains array of spawn GUIDs in `data.spawns`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `inevitabledeath` (on spawned entity)  
  - `death` (on spawned entity)  
  - `onremove` (on spawned entity)  
- **Pushes:**  
  - `rampingspawner_death` — Fired when a tracked spawn dies. Data: `{ remaining_spawns = self.num_spawns }`.  
  - `rampingspawner_spawn` — Fired when a new entity is spawned. Data: `{ newent = spawn }`.
