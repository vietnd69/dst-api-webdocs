---
id: periodicspawner
title: Periodicspawner
description: Manages periodic spawning of prefabs at or near a spawn-point entity, with configurable timing, density constraints, and spawn conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 76f960c5
---

# Periodicspawner

## Overview
The `Periodicspawner` component enables an entity to automatically spawn other prefabs at intervals determined by base and random timing values. It supports spatial constraints (range/density and minimum spacing), offscreen-only spawning, custom spawn position logic, conditional spawning via a test function, and optional callbacks on spawn success. It integrates with DST's save/load system and handles both ground and floating (flotsam) spawning contexts.

## Dependencies & Tags
- **Internal constants**: Uses `PERIODICSPAWNER_CANTTAGS = { "INLIMBO" }` to exclude limbo entities during density checks.
- **Method references**: Uses `FunctionOrValue()` and `TheWorld.components.flotsamgenerator` when available.
- **No external component requirements** on the host entity—however, if the `OnRemoveFromEntity` sentinel is attached to the host entity, stopping the spawner is handled automatically.
- **No tags added or removed** on the host entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `basetime` | `number` | `40` | Base time (in seconds) between spawns before randomization. |
| `randtime` | `number` | `60` | Random variance (added to `basetime`) to determine actual interval (`basetime + random * randtime`). |
| `prefab` | `function or string` | `nil` | Prefab to spawn; can be a string (prefab name) or a function returning a prefab name. |
| `range` | `number or nil` | `nil` | Maximum radius to search for existing entities of same prefab for density checks. |
| `density` | `number or nil` | `nil` | Maximum number of existing same-prefab entities allowed within `range` (prevents over-spawning). |
| `spacing` | `number or nil` | `nil` | Minimum distance from the spawn position to any existing same-prefab entity. |
| `onspawn` | `function or nil` | `nil` | Optional callback invoked after successful spawn: `fn(spawner_inst, spawned_ent)`. |
| `spawntest` | `function or nil` | `nil` | Optional predicate: `fn(spawner_inst)` must return `true` for spawn to proceed. |
| `getspawnpointfn` | `function or nil` | `nil` | Optional function providing custom spawn position: `fn(spawner_inst) → Vector3 or nil`. |
| `spawnoffscreen` | `boolean` | `false` | If `true`, only spawn when the spawner entity is *not* asleep (i.e., offscreen). |
| `ignoreflotsamgenerator` | `boolean` | `nil` (treated as `false` if unset) | If `true`, skip flotsam spawning logic and always use `SpawnPrefab`. |
| `task` | `Task or nil` | `nil` | Internal reference to the scheduled spawn task; not a user-facing property. |
| `target_time` | `number or nil` | `nil` | Epoch time at which the next spawn is scheduled. |

## Main Functions

### `SetPrefab(prefab)`
* **Description:** Sets the prefab to spawn. Validates the prefab exists in the `Prefabs` table (or is a function).  
* **Parameters:**  
  - `prefab`: A string (prefab name) or a function returning a string.

### `SetRandomTimes(basetime, variance, no_reset)`
* **Description:** Configures spawn timing: total interval = `basetime + random() * variance`. Automatically restarts the spawner unless `no_reset` is `true`.  
* **Parameters:**  
  - `basetime`: Base time in seconds (must be numeric).  
  - `variance`: Random time offset in seconds (must be numeric).  
  - `no_reset`: If `true`, do not restart an already-running task.

### `SetDensityInRange(range, density)`
* **Description:** Enables density-based limiting: if the number of existing prefabs within `range` reaches or exceeds `density`, spawning is blocked. Requires `range` and `density` > 0.  
* **Parameters:**  
  - `range`: Search radius in world units (must be numeric).  
  - `density`: Maximum allowed count of same-prefab entities within `range`.

### `SetMinimumSpacing(spacing)`
* **Description:** Ensures new spawns are at least `spacing` units away from any existing same-prefab entity. Implemented as a strict distance check on spawn position.  
* **Parameters:**  
  - `spacing`: Minimum Euclidean distance (must be numeric).

### `SetOnlySpawnOffscreen(offscreen)`
* **Description:** If `true`, only spawns when the spawner entity is asleep (i.e., offscreen).  
* **Parameters:**  
  - `offscreen`: Boolean flag.

### `SetOnSpawnFn(fn)`
* **Description:** Sets the callback invoked after successful spawn.  
* **Parameters:**  
  - `fn`: Function with signature `fn(spawner_inst, spawned_entity)`.

### `SetSpawnTestFn(fn)`
* **Description:** Sets a conditional test; spawn only occurs if `fn(spawner_inst)` returns `true`.  
* **Parameters:**  
  - `fn`: Predicate function.

### `SetGetSpawnPointFn(fn)`
* **Description:** Sets a custom position provider; if absent, the default is the spawner's current world position.  
* **Parameters:**  
  - `fn`: Function returning a `Vector3` (or `nil` to cancel spawn).

### `SetIgnoreFlotsamGenerator(ignores)`
* **Description:** If `true`, bypasses flotsam spawning logic and uses `SpawnPrefab` unconditionally—even for invalid-terrain positions.  
* **Parameters:**  
  - `ignores`: Boolean flag.

### `Start(timeoverride)`
* **Description:** Schedules the next spawn. Cancels any existing task first. Uses `timeoverride` if provided; otherwise uses randomized interval.  
* **Parameters:**  
  - `timeoverride` (optional): Number (seconds until spawn). Defaults to `basetime + random * randtime`.

### `SafeStart(timeoverride)`
* **Description:** Starts the spawner only if no spawn is already scheduled (`target_time == nil`).  
* **Parameters:**  
  - `timeoverride` (optional): Number (seconds until spawn).

### `Stop()`
* **Description:** Cancels the scheduled task and clears `target_time`. Called automatically on entity removal via `OnRemoveFromEntity`.  
* **Parameters:** None.

### `TrySpawn(prefab)`
* **Description:** Attempts to spawn one instance of the prefab, respecting all constraints (position, density, offscreen, test function, flotsam context). Returns `false` on failure (and retry delay) or `true` on success.  
* **Parameters:**  
  - `prefab` (optional): Prefab to spawn. Defaults to `self.prefab`.

### `DoSpawn()`
* **Description:** Performs a single spawn attempt and immediately schedules the next one using the retry delay (if any) returned by `TrySpawn`.  
* **Parameters:** None.

### `LongUpdate(dt)`
* **Description:** Handles periodic spawner progress in entities with `LongUpdate` capability (e.g., distant players). Updates `target_time` against real time and triggers `DoSpawn()` if overdue.  
* **Parameters:**  
  - `dt`: Delta time (seconds) since last update.

### `OnSave()`
* **Description:** Returns spawn timing state for saving. If a spawn is pending, returns `{ time = seconds_until_next_spawn }`.  
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the spawn timer from saved data. If `data.time` is present, schedules a spawn after that many seconds.  
* **Parameters:**  
  - `data`: Table with optional `time` key (seconds to next spawn).

### `GetDebugString()`
* **Description:** Returns a human-readable debug string showing remaining time until next spawn and current prefab.  
* **Parameters:** None.

## Events & Listeners
- Listens for none (no `inst:ListenForEvent` calls).
- Pushes none (no `inst:PushEvent` calls).
- Uses internal scheduled task callbacks (`DoSpawn`) rather than events.

## Sentinel Assignments
- `PeriodicSpawner.ForceNextSpawn = PeriodicSpawner.DoSpawn`: Allows external code to force an immediate spawn by calling `spawner:ForceNextSpawn()`.
- `PeriodicSpawner.OnRemoveFromEntity = PeriodicSpawner.Stop`: If assigned as a property on the host entity, this ensures the spawner stops when the entity is removed.