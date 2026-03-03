---
id: periodicspawner
title: Periodicspawner
description: Manages periodic spawning of prefabs at or around an entity with configurable timing, spatial density, and conditional logic.
tags: [spawning, world, environment, schedule]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 76f960c5
system_scope: world
---

# Periodicspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PeriodicSpawner` is an entity component that schedules and executes periodic spawning of prefabs near the entity to which it is attached. It supports dynamic timing (base time plus random variance), spatial constraints (range, density, and minimum spacing), offscreen spawning control, and custom validation or post-spawn callbacks. It integrates with the `flotsamgenerator` component when spawning occurs over water or non-platform terrain.

The component is typically added to dynamic entities (e.g., flying creatures or floating structures) that periodically emit objects like resources, minions, or effects. It manages its own scheduling loop via `DoTaskInTime`, and supports save/load synchronization through `OnSave`/`OnLoad`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("periodicspawner")
inst.components.periodicspawner:SetPrefab("glommerfuel")
inst.components.periodicspawner:SetRandomTimes(40, 60)
inst.components.periodicspawner:SetDensityInRange(10, 3)
inst.components.periodicspawner:SetMinimumSpacing(2)
inst.components.periodicspawner:Start()
```

## Dependencies & tags
**Components used:** `flotsamgenerator` (via `TheWorld.components.flotsamgenerator:SpawnFlotsam`)  
**Tags:** Checks for and respects `INLIMBO` tag during spawn proximity checks.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to. |
| `basetime` | number | `40` | Base interval in seconds between spawns. |
| `randtime` | number | `60` | Random variance added to `basetime` (uniformly `[0, randtime]`). |
| `prefab` | string or function | `nil` | Prefab name string or a function returning a prefab name. |
| `range` | number | `nil` | Radius around the spawner to check for existing spawnees (for density/spacing). |
| `density` | number | `nil` | Max number of same-prefab entities allowed within `range`. |
| `spacing` | number | `nil` | Minimum distance required between spawn point and any existing same-prefab entity. |
| `onspawn` | function | `nil` | Optional callback: `fn(spawner_inst, spawned_ent)` called after successful spawn. |
| `spawntest` | function | `nil` | Optional predicate: `fn(spawner_inst) → boolean`. Spawn only if `true`. |
| `getspawnpointfn` | function | `nil` | Optional callback: `fn(spawner_inst) → Vector3`. Overrides default spawn position. |
| `spawnoffscreen` | boolean | `false` | If `true`, only spawns when the entity is `IsAsleep()` (offscreen). |
| `ignoreflotsamgenerator` | boolean | `nil` | If truthy, bypasses `flotsamgenerator:SpawnFlotsam` and uses `SpawnPrefab` directly. |
| `task` | Task | `nil` | Internal scheduled task object (read-only, managed internally). |
| `target_time` | number | `nil` | Unix timestamp when next spawn is scheduled (read-only, managed internally). |

## Main functions
### `SetPrefab(prefab)`
* **Description:** Sets the prefab to spawn. Accepts a string name or a function returning a string.
* **Parameters:** `prefab` (string | function) — prefab identifier.
* **Returns:** Nothing.
* **Error states:** Raises `assert` if `prefab` is not a string (and not in `Prefabs`) and not a function.

### `SetRandomTimes(basetime, variance, no_reset)`
* **Description:** Configures base and random spawn intervals. Optionally resets or preserves the current schedule.
* **Parameters:**  
  - `basetime` (number) — base delay in seconds.  
  - `variance` (number) — maximum random extra delay (uniform `0`–`variance`).  
  - `no_reset` (boolean, optional) — if `true`, do *not* restart the spawn timer.
* **Returns:** Nothing.
* **Error states:** Raises `assert` if either argument is not a number.

### `SetDensityInRange(range, density)`
* **Description:** Enforces a maximum count of existing same-prefab entities within a given radius.
* **Parameters:**  
  - `range` (number) — radius around the spawner to search for existing entities.  
  - `density` (number) — max number of same-prefab entities allowed in `range`. Spawning fails if count ≥ `density`.
* **Returns:** Nothing.

### `SetMinimumSpacing(spacing)`
* **Description:** Ensures the spawn location is at least `spacing` units away from any existing same-prefab entity.
* **Parameters:** `spacing` (number) — minimum required distance (in world units) from any existing entity of the same prefab.
* **Returns:** Nothing.

### `SetOnlySpawnOffscreen(offscreen)`
* **Description:** Controls whether spawning occurs only when the entity is offscreen (`IsAsleep()`).
* **Parameters:** `offscreen` (boolean) — if `true`, spawn only when `inst:IsAsleep()` is `true`.
* **Returns:** Nothing.

### `SetOnSpawnFn(fn)`
* **Description:** Registers a callback invoked immediately after a successful spawn.
* **Parameters:** `fn` (function) — `fn(spawner_inst, spawned_ent)`; `spawned_ent` may be `nil` if spawn failed (handled internally).
* **Returns:** Nothing.

### `SetSpawnTestFn(fn)`
* **Description:** Registers a predicate that must return `true` for a spawn attempt to proceed.
* **Parameters:** `fn` (function) — `fn(spawner_inst) → boolean`.
* **Returns:** Nothing.

### `SetGetSpawnPointFn(fn)`
* **Description:** Overrides the default spawn position (center of the spawner) with a custom position generator.
* **Parameters:** `fn` (function) — `fn(spawner_inst) → Vector3 | nil`.
* **Returns:** Nothing.
* **Error states:** If `fn` returns `nil`, spawn is aborted with a short retry time (`MISSING_SPAWN_POS_RETRY_TIME`).

### `SetIgnoreFlotsamGenerator(ignores)`
* **Description:** Forces the spawner to skip the `flotsamgenerator`, using `SpawnPrefab` directly (even over water).
* **Parameters:** `ignores` (boolean) — if `true`, disable `flotsamgenerator` usage.
* **Returns:** Nothing.

### `Start(timeoverride)`
* **Description:** Starts or restarts the spawn timer. Cancels any existing scheduled spawn.
* **Parameters:** `timeoverride` (number, optional) — if provided, uses this as the delay instead of `basetime + random * randtime`.
* **Returns:** Nothing.

### `SafeStart(timeoverride)`
* **Description:** Starts the spawner *only* if no spawn is already scheduled.
* **Parameters:** `timeoverride` (number, optional) — same as `Start`.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Cancels any pending spawn and clears scheduled time.
* **Parameters:** None.
* **Returns:** Nothing.

### `TrySpawn(prefab)`
* **Description:** Executes a single spawn attempt. Checks validity, offscreen state, spawntest, density, and spacing before spawning.
* **Parameters:** `prefab` (string | function, optional) — overrides `self.prefab` for this attempt.
* **Returns:**  
  - `true` if spawn succeeded.  
  - `false, retry_time` on early abort (e.g., test failed, density exceeded, missing spawn point).  
* **Error states:** Aborts silently on invalid entity, offscreen-only mode + onscreen state, or `spawntest` returning `false`. Uses `PERIODICSPAWNER_CANTTAGS = { "INLIMBO" }` to skip invalid entities during proximity checks.

### `DoSpawn()`
* **Description:** Performs a full spawn cycle: calls `TrySpawn`, then reschedules the next spawn using returned retry time (if any).
* **Parameters:** None.
* **Returns:** Nothing.

### `LongUpdate(dt)`
* **Description:** Advanced scheduling method for sub-frame accuracy during world time adjustments (e.g., pause, fast-forward). Resets the timer based on elapsed `dt`.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Called during save serialization. Returns remaining time to next spawn, or `nil` if none scheduled.
* **Parameters:** None.
* **Returns:** `{ time = number }` (if scheduled), otherwise `nil`.

### `OnLoad(data)`
* **Description:** Called on load to resume pending spawn based on saved time.
* **Parameters:** `data` (table) — output from `OnSave()`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for diagnostics.
* **Parameters:** None.
* **Returns:** string — e.g., `"Next Spawn: 12.3 prefab: glommerfuel"`.

## Events & listeners
None identified.  
(`PeriodicSpawner` uses `DoTaskInTime` for scheduling, but does not register or push any game events.)
