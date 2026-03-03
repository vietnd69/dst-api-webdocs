---
id: plantregrowth
title: Plantregrowth
description: Manages periodic regrowth of plants by tracking per-prefab timers and spawning nearby instances when growth conditions are met.
tags: [plant, regrowth, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 3cfb3a65
system_scope: world
---

# Plantregrowth

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlantRegrowth` implements a centralized, batched update system for plant regrowth mechanics across the world. It tracks per-prefab internal timers using `InternalTimes`, periodically checks entities that own this component during scheduled buckets, and spawns nearby instances of the configured product prefab if growth conditions (e.g., terrain, proximity, spacing) are satisfied. It supports seasonal and moon-phase modifiers via `TimeMultipliers`, and handles save/load state serialization to preserve timing across sessions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("plant")
inst:AddComponent("plantregrowth")
inst.components.plantregrowth:SetRegrowthRate(1800) -- 30 minutes base
inst.components.plantregrowth:SetProduct("pinecone")
inst.components.plantregrowth:SetSearchTag("tree")
inst.components.plantregrowth:ResetGrowthTime()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `plant` (via the `prefab` string in `TrySpawnNearby`), checks `structure` and `wall` as blockers; reads tags like `"tree"` and `"plant"` indirectly via `searchtag` and `prefab`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `regrowthrate` | number | `nil` | Base time (in seconds) required for regrowth; used with variance in `ResetGrowthTime`. |
| `product` | string | `nil` | Prefab name to spawn on successful regrowth; defaults to `self.inst.prefab` if `nil`. |
| `searchtag` | string | `nil` | Tag used when counting existing entities in the spawn area. |
| `nextregrowth` | number | `0` | Internal timestamp when regrowth is allowed. |
| `fiveradius` | number | `nil` | Cached radius around this plant for regrowth checks; computed lazily. |
| `skip_plant_check` | boolean | `nil` | If true, bypasses `Map:CanPlantAtPoint` check during spawn. |

## Main functions
### `ResetGrowthTime()`
* **Description:** Sets `nextregrowth` to the current internal time for this plant’s prefab plus a random variance (±20% of `regrowthrate`). Used to initialize or reset the regrowth window.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetRegrowthRate(rate)`
* **Description:** Sets the base `regrowthrate` and registers this instance into the global batched update system. If the current internal time has already exceeded `nextregrowth`, it immediately resets the timer.
* **Parameters:** `rate` (number) - base regrowth duration in seconds.
* **Returns:** Nothing.

### `SetProduct(product)`
* **Description:** Specifies the prefab to spawn during regrowth. If unset, the instance's own prefab is used.
* **Parameters:** `product` (string) - prefab name.
* **Returns:** Nothing.

### `SetSearchTag(tag)`
* **Description:** Specifies the tag used when counting nearby entities during regrowth (via `TheSim:FindEntities`).
* **Parameters:** `tag` (string) - tag to filter entities in spawn area.
* **Returns:** Nothing.

### `SetSkipCanPlantCheck(bool)`
* **Description:** If `true`, skips the `Map:CanPlantAtPoint` check during `GetSpawnPoint`, allowing regrowth on non-plantable terrain (e.g., some structures).
* **Parameters:** `bool` (boolean).
* **Returns:** Nothing.

### `OnRemoveFromEntity()` / `OnRemoveEntity()`
* **Description:** Removes this instance from the global batched update buckets and cancels the global update task if no instances remain.
* **Parameters:** None.
* **Returns:** Nothing.

### `TrySpawnNearby()`
* **Description:** Checks if regrowth is due; if so, attempts to find a valid nearby spawn location using `GetSpawnPoint`. If a location is found and the area is not overcrowded (fewer than 5 matching entities), spawns the `product` prefab at that location.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early without resetting the timer if `nextregrowth` has not been reached; resets the timer on failure even if spawn fails.

### `OnSave()`
* **Description:** Returns a table containing the remaining regrowth time (`nextregrowth - InternalTimes[prefab]`) for serialization.
* **Parameters:** None.
* **Returns:** Table with `regrowthtime` key, or `nil` if empty.

### `OnLoad(data)`
* **Description:** Restores `nextregrowth` using the loaded remaining time and current `InternalTimes[prefab]`.
* **Parameters:** `data` (table | nil) - data returned from `OnSave`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable string with current `fiveradius` and remaining regrowth time. If `fiveradius` is not yet computed, it is lazily initialized first.
* **Parameters:** None.
* **Returns:** string - formatted debug info (e.g., `"fiveradius: 6.42 regrowth time: 420.00"` or `"NO GROWTH HERE"`).

## Events & listeners
- **Listens to:** `onremovefromentity` — triggers `OnRemoveFromEntity`.
- **Listens to:** `onremoveentity` — triggers `OnRemoveEntity`.
- **Pushes:** None identified.
