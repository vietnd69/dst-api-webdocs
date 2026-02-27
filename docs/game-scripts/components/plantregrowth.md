---
id: plantregrowth
title: Plantregrowth
description: Manages periodic regrowth of plants (e.g., trees, mushrooms) by tracking growth progress, spawning nearby offspring, and adjusting regrowth rates based on seasonal and biome conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 3cfb3a65
---

# Plantregrowth

## Overview
The `plantregrowth` component implements a shared, world-scoped regrowth system for flora (trees, mushrooms, etc.). Entities with this component track cumulative growth time against global internal timers, periodically attempt to spawn a new instance of themselves (or a configured product) within a radius, and support dynamic adjustment of regrowth rates and seasons via `TimeMultipliers`. It avoids frame contention by bucketed updates and handles serialization for world save/load.

## Dependencies & Tags
- Uses global utility `regrowthutil.lua` (not shown), specifically `GetFiveRadius`.
- Relies on `TheWorld`, `TheSim`, `TheCamera`, `RoadManager`, and `TUNING` constants.
- Adds no component or tags to the entity; instead, it *is* the component attached to flora entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `regrowthrate` | number | `nil` | Base time (in seconds) for a full regrowth cycle; used with variance. |
| `product` | string | `nil` | Prefab name to spawn during regrowth; defaults to the entity's own prefab if `nil`. |
| `searchtag` | string | `nil` | Tag used to count existing nearby entities (e.g., for spawn caps). |
| `nextregrowth` | number | `0` | Global internal time at which the next regrowth attempt is allowed. |
| `fiveradius` | number | `nil` | Radius used to determine spawn eligibility (computed on first `TrySpawnNearby` call). |
| `area` | any | `nil` | Reserved; currently unused (commented out as deferred). |
| `skip_plant_check` | boolean | `nil` | If true, bypasses `Map:CanPlantAtPoint` check during spawn. |
| `_bucket` | table | `nil` | Internal bucket index used for batched update scheduling. |

## Main Functions

### `ResetGrowthTime()`
* **Description:** Resets the `nextregrowth` timer by adding the current global time for the entity’s prefab (from `InternalTimes`) plus a random variance (±20%) of `regrowthrate`.
* **Parameters:** None.

### `SetRegrowthRate(rate)`
* **Description:** Sets the base `regrowthrate` and registers this entity into the global update buckets for periodic processing. If growth is already due, immediately triggers a reset.
* **Parameters:**  
  - `rate` (number): Base regrowth time in seconds.

### `SetProduct(product)`
* **Description:** Configures the prefab name to spawn during regrowth (instead of using the entity’s own prefab).
* **Parameters:**  
  - `product` (string): Prefab name of the spawned offspring.

### `SetSearchTag(tag)`
* **Description:** Sets the tag used when counting nearby entities to enforce the "5-per-cluster" rule.
* **Parameters:**  
  - `tag` (string): Tag used in `FindEntities` to identify同类 instances.

### `SetSkipCanPlantCheck(bool)`
* **Description:** If `true`, skips the `Map:CanPlantAtPoint` validation during spawn attempts (useful for non-plant terrain like rock trees).
* **Parameters:**  
  - `bool` (boolean): Whether to skip the plantability check.

### `OnRemoveFromEntity()` / `OnRemoveEntity()`
* **Description:** Removes this instance from the global update buckets; if the bucket becomes empty, cancels the global update task if no other entities remain.
* **Parameters:** None.

### `TrySpawnNearby()`
* **Description:** Checks if regrowth time has elapsed. If so, samples random nearby positions (within `fiveradius`), validates spawnability (using `GetSpawnPoint`), counts existing entities of the target type (max 5), and spawns one new instance if space is available.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns a compact table containing only the remaining regrowth time (relative to current global time) for serialization.
* **Parameters:** None.  
* **Returns:** `{ regrowthtime = <number> }` or `nil` if no data.

### `OnLoad(data)`
* **Description:** Restores the `nextregrowth` timer using saved relative time and current global time for the prefab.
* **Parameters:**  
  - `data` (table or nil): Data from `OnSave`.

### `GetDebugString()`
* **Description:** Returns a debug string with current `fiveradius` and remaining regrowth time (or `"NO GROWTH HERE"` if radius is invalid).
* **Parameters:** None.  
* **Returns:** string.

## Events & Listeners
None. This component does not register or dispatch any events via `ListenForEvent` or `PushEvent`. It operates via explicit periodic polling and method calls.

---