---
id: periodicspawner
title: Periodicspawner
description: Manages timed, density-controlled spawning of prefabs around an entity with configurable intervals and spatial constraints.
tags: [spawning, timing, density, entity]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: components
source_hash: b527515e
system_scope: entity
---

# Periodicspawner

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`PeriodicSpawner` is a component that spawns prefabs at regular intervals around an owning entity. It supports configurable timing with random variance, density limits within a range, minimum spacing between spawned entities, and custom spawn point functions. The component integrates with the world's `flotsamgenerator` for water spawns and includes save/load persistence for spawn timers. Commonly used for resource respawning, enemy waves, or environmental object generation. As an ECS component, it attaches to entity instances via AddComponent() and is accessed through inst.components.periodicspawner. It manages autonomous spawning behavior without requiring external state management.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("periodicspawner")

inst.components.periodicspawner:SetPrefab("blue_mushroom")
inst.components.periodicspawner:SetRandomTimes(30, 15)
inst.components.periodicspawner:SetDensityInRange(20, 3)
inst.components.periodicspawner:SetMinimumSpacing(5)
inst.components.periodicspawner:SetOnSpawnFn(function(owner, spawned)
    spawned.components.pickable:SetPickable(true)
end)
inst.components.periodicspawner:Start()
```

## Dependencies & tags
**Components used:**
- `Transform` -- accessed via `self.inst.Transform:GetWorldPosition()` for spawn location
- `flotsamgenerator` (world component) -- spawns entities on water surfaces when needed

**Tags:**
- `INLIMBO` -- checked in `PERIODICSPAWNER_CANTTAGS` to exclude entities with this tag from density calculations

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The owning entity instance. |
| `basetime` | number | `40` | Base time in seconds between spawn attempts. |
| `randtime` | number | `60` | Random variance added to basetime for each spawn interval. |
| `prefab` | string/function | `nil` | Prefab name or function returning prefab name to spawn. |
| `range` | number | `nil` | Maximum distance from owner to check for density limits. |
| `density` | number | `nil` | Maximum number of matching prefabs allowed within range. |
| `spacing` | number | `nil` | Minimum distance between spawned entities. |
| `onspawn` | function | `nil` | Callback function called after successful spawn with `(owner, spawned_ent)`. |
| `spawntest` | function | `nil` | Test function called before spawn; must return `true` to proceed. |
| `spawnoffscreen` | boolean | `false` | If `true`, only spawns when owner is asleep/offscreen. |
| `getspawnpointfn` | function | `nil` | Custom function to determine spawn position; returns `Vector3` or `nil`. |
| `ignoreflotsamgenerator` | boolean | `nil` | If `true`, bypasses flotsam generator even on water. |
| `densityfilterfn` | function | `nil` | Custom filter function for density counting with `(owner, nearby_ent)`. |
| `target_time` | number | `nil` | Absolute game time when next spawn is scheduled. |
| `task` | task | `nil` | Scheduled task handle for the next spawn. |

## Main functions
### `SetPrefab(prefab)`
* **Description:** Sets the prefab name or function to spawn. Validates that the prefab exists in `Prefabs` table or is a function.
* **Parameters:** `prefab` -- string prefab name or function returning prefab name.
* **Returns:** None.
* **Error states:** Errors via `assert()` if `prefab` is not a function and `Prefabs[prefab]` is `nil` (invalid prefab name).

### `SetRandomTimes(basetime, variance, no_reset)`
* **Description:** Configures the base spawn interval and random variance. Optionally restarts the timer if already running.
* **Parameters:**
  - `basetime` -- base time in seconds (must be a number)
  - `variance` -- random variance added to basetime (must be a number)
  - `no_reset` -- if `true`, does not restart the timer after updating values
* **Returns:** None.
* **Error states:** Errors via `assert()` if `basetime` or `variance` are not numbers.

### `SetDensityInRange(range, density)`
* **Description:** Sets the maximum range and entity density limit for spawn area control.
* **Parameters:**
  - `range` -- maximum distance from owner to check (must be a number)
  - `density` -- maximum number of matching prefabs allowed in range (must be a number)
* **Returns:** None.
* **Error states:** Errors via `assert()` if `range` or `density` are not numbers.

### `SetMinimumSpacing(spacing)`
* **Description:** Sets the minimum distance required between spawned entities.
* **Parameters:** `spacing` -- minimum spacing distance in world units (must be a number).
* **Returns:** None.
* **Error states:** Errors via `assert()` if `spacing` is not a number.

### `SetOnlySpawnOffscreen(offscreen)`
* **Description:** Configures whether spawning only occurs when the owner is asleep/offscreen.
* **Parameters:** `offscreen` -- boolean value.
* **Returns:** None.
* **Error states:** None.

### `SetOnSpawnFn(fn)`
* **Description:** Sets a callback function to execute after each successful spawn.
* **Parameters:** `fn` -- function with signature `(owner, spawned_ent)`.
* **Returns:** None.
* **Error states:** None.

### `SetSpawnTestFn(fn)`
* **Description:** Sets a test function that must return `true` for spawning to proceed.
* **Parameters:** `fn` -- function with signature `(owner)` returning boolean.
* **Returns:** None.
* **Error states:** None.

### `SetGetSpawnPointFn(fn)`
* **Description:** Sets a custom function to determine the spawn position instead of using owner position.
* **Parameters:** `fn` -- function with signature `(owner)` returning `Vector3` or `nil`.
* **Returns:** None.
* **Error states:** None.

### `SetIgnoreFlotsamGenerator(ignores)`
* **Description:** Configures whether to bypass the flotsam generator for water spawns.
* **Parameters:** `ignores` -- boolean value.
* **Returns:** None.
* **Error states:** None.

### `SetDensityFilterFn(fn)`
* **Description:** Sets a custom filter function for counting entities toward density limits.
* **Parameters:** `fn` -- function with signature `(owner, nearby_ent)` returning boolean.
* **Returns:** None.
* **Error states:** None.

### `Start(timeoverride)`
* **Description:** Starts the spawn timer. Cancels any existing timer before scheduling a new one.
* **Parameters:** `timeoverride` -- optional time in seconds; if `nil`, uses `basetime + random * randtime`.
* **Returns:** None.
* **Error states:** None.

### `SafeStart(timeoverride)`
* **Description:** Starts the spawn timer only if no timer is currently active.
* **Parameters:** `timeoverride` -- optional time in seconds.
* **Returns:** None.
* **Error states:** None.

### `Stop()`
* **Description:** Stops the spawn timer and cancels any pending spawn task.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `TrySpawn(prefab)`
* **Description:** Attempts to spawn an entity immediately, respecting all density, spacing, and test conditions.
* **Parameters:** `prefab` -- optional prefab name override; defaults to `self.prefab`.
* **Returns:** `true` on successful spawn, `false` on failure. On failure, second return value is retry time in seconds.
* **Error states:** None.

### `DoSpawn()`
* **Description:** Internal spawn handler that calls `TrySpawn()` and reschedules the next spawn timer.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `LongUpdate(dt)`
* **Description:** Called periodically to check if spawn time has been reached. Handles timer drift correction.
* **Parameters:** `dt` -- delta time since last update.
* **Returns:** None.
* **Error states:** None.

### `OnSave()`
* **Description:** Returns save data containing remaining time until next spawn.
* **Parameters:** None.
* **Returns:** Table with `time` field (seconds remaining) or `nil` if no timer active.
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Restores spawn timer from save data.
* **Parameters:** `data` -- table from `OnSave()` containing `time` field.
* **Returns:** None.
* **Error states:** None.

### `GetDebugString()`
* **Description:** Returns a debug string showing time until next spawn and current prefab.
* **Parameters:** None.
* **Returns:** Formatted string with spawn timing information.
* **Error states:** None.

## Events & listeners
None identified.