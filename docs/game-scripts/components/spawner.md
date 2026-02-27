---
id: spawner
title: Spawner
description: Manages a single persistent entity (e.g., a named pigman) by spawning it after a delay, taking/returning ownership, and tracking spawn state—including queuing, offscreen spawning, and save/load compatibility.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: af2df356
---

# Spawner

## Overview
The `Spawner` component manages a *single persistent entity*—unlike `ChildSpawner`, which dynamically creates and destroys generic entities on demand. It controls when and where the entity is spawned, returned to or released from the spawner, and handles state such as occupancy, pending spawns, and persistence across saves. Entities managed by this component maintain their identity (e.g., named characters, unique items), and can be queued for respawn after vacating or death.

## Dependencies & Tags
- Adds component: `"homeseeker"` to managed child entities if missing (see `TakeOwnership`).
- Uses listeners on `"entitysleep"` event only when `spawnoffscreen` is enabled.
- No specific entity tags are set or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to (the spawner). |
| `child` | `Entity?` | `nil` | The currently owned/managed entity. May be `nil` if not occupied. |
| `delay` | `number` | `0` | Time (in seconds) to wait before respawning after the child is released or killed. |
| `onoccupied` | `function?` | `nil` | Callback invoked when the child enters the spawner (via `GoHome`). |
| `onvacate` | `function?` | `nil` | Callback invoked when the child leaves the spawner (in `ReleaseChild`). |
| `onspawnedfn` | `function?` | `nil` | Callback invoked after a new child is spawned and taken ownership of. |
| `onkilledfn` | `function?` | `nil` | Callback invoked when the child is killed. |
| `spawnoffscreen` | `boolean?` | `nil` | If `true`, spawning only occurs when the spawner is asleep (offscreen). |
| `useexternaltimer` | `boolean` | `false` | If `true`, external timing callbacks (`starttimerfn`, `stoptimerfn`, `timertestfn`) are used instead of internal `DoTaskInTime`. |
| `nextspawntime` | `number?` | `nil` | Timestamp (from `GetTime()`) for the next scheduled spawn. Used when `useexternaltimer` is `false`. |
| `queue_spawn` | `boolean?` | `nil` | If `true`, a new spawn is queued immediately after releasing the child. |
| `retryperiod` | `number?` | `nil` | Delay (in seconds) for queued spawns. Used only if `queue_spawn` is `true`. |
| `task` | `Task?` | `nil` | The internal timer task (`DoTaskInTime`), or `nil` if not active. |
| `childname` | `string?` | `nil` | Prefab name of the child to spawn. May be overridden by `childfn`. |
| `childfn` | `function?` | `nil` | Optional function `(inst) → string` returning a dynamic child prefab name. |

*Note: Optional fields like `spawn_in_water`, `spawn_on_boats`, `externaltimerfinished`, and various timer callbacks (`starttimerfn`, etc.) are declared but not initialized in `_ctor` and depend on external configuration.*

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleans up the component when removed from the spawner entity: removes event listeners, cancels pending spawns, and releases tracked child entity callbacks.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a string summarizing the spawner’s current state for debugging (e.g., child presence, occupancy, queued/spawn timers).
* **Parameters:** None.

### `SetOnSpawnedFn(fn)`
* **Description:** Registers a callback to run when a new child is successfully spawned.
* **Parameters:**  
  `fn` — A function `(spawner_inst, child)`.

### `SetOnKilledFn(fn)`
* **Description:** Registers a callback to run when the child entity is killed.
* **Parameters:**  
  `fn` — A function `(spawner_inst, child)`.

### `SetOnOccupiedFn(fn)`
* **Description:** Registers a callback to run when the child enters the spawner (becomes occupied).
* **Parameters:**  
  `fn` — A function `(spawner_inst, child)`.

### `SetOnVacateFn(fn)`
* **Description:** Registers a callback to run when the child leaves the spawner (is released).
* **Parameters:**  
  `fn` — A function `(spawner_inst, child)`.

### `SetWaterSpawning(spawn_in_water, spawn_on_boats)`
* **Description:** Configures whether the child can be spawned in water or on boats during release.
* **Parameters:**  
  `spawn_in_water` — `boolean` — Allow spawning in water.  
  `spawn_on_boats` — `boolean` — Allow spawning on boats.

### `SetOnlySpawnOffscreen(offscreen)`
* **Description:** Enables/disables offscreen-only spawning: if `true`, spawning is deferred until the spawner is asleep (via `"entitysleep"` event).
* **Parameters:**  
  `offscreen` — `boolean`.

### `Configure(childname, delay, startdelay)`
* **Description:** Sets the child prefab name, respawn delay, and starts the initial spawn with optional delay.
* **Parameters:**  
  `childname` — `string` — Prefab name to spawn.  
  `delay` — `number` — Time between respawn attempts after release.  
  `startdelay` — `number?` — Optional initial delay before first spawn.

### `SpawnWithDelay(delay)`
* **Description:** Starts or restarts the spawn timer. If `useexternaltimer` is `false`, uses `DoTaskInTime`; otherwise, delegates to external timer callbacks.
* **Parameters:**  
  `delay` — `number` — Seconds to wait before spawning.

### `IsSpawnPending()`
* **Description:** Returns `true` if a spawn is pending (i.e., timer is active).
* **Parameters:** None.

### `SetQueueSpawning(queued, retryperiod)`
* **Description:** Enables or disables spawn queuing: when enabled, releasing the child triggers a new spawn after `retryperiod`.
* **Parameters:**  
  `queued` — `boolean` — Enable/disable queuing.  
  `retryperiod` — `number` — Delay before queued spawn (if `queued` is `true`).

### `CancelSpawning()`
* **Description:** Cancels any pending spawn timer and resets spawn-time tracking.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the spawner’s state (child presence, timers, queued flags) for persistence.
* **Parameters:** None.  
* **Returns:** `{ data: table, refs: table? }` — Save data and optional GUID references.

### `OnLoad(data, newents)`
* **Description:** Restores spawner state from save data, including loading a child prefab, rescheduling spawns, or handling external timers.
* **Parameters:**  
  `data` — `table` — Deserialized save data.  
  `newents` — `table` — Map of loaded entity GUIDs.

### `LoadPostPass(newents, savedata)`
* **Description:** Ensures post-load linking: retrieves the child entity by GUID and reassigns ownership if needed.
* **Parameters:**  
  `newents` — `table` — GUID-to-entity map.  
  `savedata` — `table` — Original save record for this spawner.

### `TakeOwnership(child)`
* **Description:** Establishes or updates ownership of a child entity: sets up callbacks, assigns home location, and adds `homeseeker` if missing.
* **Parameters:**  
  `child` — `Entity` — The child entity to manage.

### `ReleaseChild()`
* **Description:** Releases the child from the spawner: removes it as a child, teleports it to a nearby valid location (using obstacle-aware offset), and optionally queues a new spawn. Returns `true` if child was successfully released.
* **Parameters:** None.

### `GoHome(child)`
* **Description:** Moves the child *into* the spawner: adds as child, positions at origin, removes from scene, extinguishes fire, removes `homeseeker`, and triggers `onoccupied` callback. Returns `true` on success.
* **Parameters:**  
  `child` — `Entity` — The child entity to place at home.

### `OnChildKilled(child)`
* **Description:** Handles child death: triggers `onkilledfn` callback, clears child reference, and schedules a respawn after `delay`.
* **Parameters:**  
  `child` — `Entity` — The killed child entity.

## Events & Listeners
- **Listens for `"entitysleep"`**: Triggers `OnEntitySleep` when the spawner is offscreen and `spawnoffscreen` is enabled.  
- **Listens on child entity (via `TakeOwnership`):**  
  - `"ontrapped"` → triggers `self._onchildkilled`  
  - `"death"` → triggers `self._onchildkilled`  
  - `"detachchild"` → triggers `self._onchildkilled`  
  - `"onremove"` → triggers `self._onchildkilled`  
- **Pushes `"gohomefailed"`**: Sent to the child if `GoHome` fails (e.g., mismatched child reference).  
- **Triggers callbacks:**  
  - `onspawnedfn(self.inst, child)`  
  - `onvacate(self.inst, child)`  
  - `onoccupied(self.inst, child)`  
  - `onkilledfn(self.inst, child)`