---
id: bunch_spawner
title: Bunch Spawner
description: Spawns groups of entities (bunches) around predefined spawner positions during world generation, enforcing placement rules and spacing constraints.
tags: [world-generation, spawner, grouping]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 32e5b024
---

# Bunch Spawner

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This module manages the procedural spawning of entity *bunches* — grouped collections of prefabs — during world generation. It processes predefined spawner locations (stored in the global `entities` table), retrieves spawning rules from `map/bunches.lua`, and places entities within specified ranges and tile constraints. It does not run as a component attached to entities; instead, it is invoked directly during map generation.

## Usage example
Typical usage occurs during world initialization, after the `entities` table has been populated with spawner positions:

```lua
require "map/bunch_spawner"

-- Initialize spawner state with global entities table and world dimensions
BunchSpawnerInit(my_entities_table, map_width, map_height)

-- Run the spawner over all configured bunch types
local updated_entities = BunchSpawnerRun(world)

-- Alternatively, manually trigger a single spawner at a known location
BunchSpawnerRunSingleBatchSpawner(world, "beebox_spawner", 10.5, -20.2)
```

## Dependencies & tags
**Components used:** None (this is a procedural helper module, not an ECS component).  
**Tags:** None identified.

## Properties
The following global variables are initialized in the module scope:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bunches` | Table | Imported from `map/bunches` | Contains spawner definitions (e.g., `min`, `max`, `range`, `min_spacing`, `valid_tile_types`) keyed by prefab name. |
| `entities` | Table | `{}` initially | Stores spawner instance positions grouped by spawner prefab name (e.g., `entities["beebox_spawner"] = { {x=..., z=...}, ... }`). |
| `WIDTH`, `HEIGHT` | Number | `0` initially | World grid dimensions in tiles, used for coordinate transformation and bounds checking. |

## Main functions

### `BunchSpawnerInit(ents, map_width, map_height)`
* **Description:** Initializes the module state by setting up the global `entities` table and world dimensions. Must be called before `BunchSpawnerRun`.
* **Parameters:**  
  * `ents` (Table): Global entities table mapping spawner prefab names to lists of `{x, z}` tables.  
  * `map_width` (Number): Width of the world in tiles.  
  * `map_height` (Number): Height of the world in tiles.
* **Returns:** None.

### `BunchSpawnerRunSingleBatchSpawner(world, spawner_prefab, x, z, add_entity_fn)`
* **Description:** Spawns a batch (a *bunch*) of entities around the given coordinates using the spawner's definition. Calls `add_entity_fn` for each spawned entity (defaults to internal `setEntity`).
* **Parameters:**  
  * `world` (Table): The world object, used for tile queries (`world:GetTile`).  
  * `spawner_prefab` (String): Name of the spawner prefab (e.g., `"beebox_spawner"`), used to look up rules in `bunches.Bunches`.  
  * `x` (Number): X-coordinate of the spawner center.  
  * `z` (Number): Z-coordinate of the spawner center.  
  * `add_entity_fn` (Function?, optional): Callback function `(prefab, x, z)` to record spawned entities. If `nil`, uses `setEntity`.
* **Returns:** None.
* **Error states:** If `spawner_prefab` is not found in `bunches.Bunches`, prints a warning and exits early.

### `BunchSpawnerRun(world, add_entity_fn)`
* **Description:** Iterates over all spawner prefabs defined in `entities`, invoking `BunchSpawnerRunSingleBatchSpawner` for each spawner instance. Finalizes and returns the updated `entities` table with newly spawned items.
* **Parameters:**  
  * `world` (Table): The world object, passed to per-spawner functions.  
  * `add_entity_fn` (Function?, optional): Callback for entity recording; passed through to subfunctions.
* **Returns:** (Table) The global `entities` table, now populated with all spawned entities.
* **Error states:** None.

### `IsBunchSpawner(prefab)`
* **Description:** Checks whether a given prefab is registered as a valid bunch spawner in `bunches.Bunches`.
* **Parameters:**  
  * `prefab` (String): Name of the prefab to test.
* **Returns:** (Boolean) `true` if `bunches.Bunches[prefab]` exists and is non-`nil`, otherwise `false`.

## Events & listeners
No events or listeners are defined or used by this module.

---