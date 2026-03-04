---
id: waterlog_worldgen
title: Waterlog Worldgen
description: Generates waterlog terrain features and marker entities in ocean regions during world generation.
tags: [worldgen, terrain, entity, ocean]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 43184cf5
---
# Waterlog Worldgen

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This script defines helper functions for waterlog terrain generation in DST's ocean regions. It is a procedural generation utility, not a component in the Entity Component System (ECS). It does not define or attach any components to entities. Instead, it operates during world initialization to populate entities table with waterlog-related spawn data (specifically for `watertree_pillar` markers) and optionally modify terrain tiles. The functions are intended to be called as part of the larger world generation pipeline.

## Usage example
```lua
require "map/waterlog_worldgen"

local entities = {}
WaterlogInit(entities, world_width, world_height)

-- Later in world generation
WaterlogRun(world, prefab_list, prefab_data)
-- `entities` now contains spawn positions for "watertree_pillar" entities
```

## Dependencies & tags
**Components used:** None (this script is not a component and does not interact with `inst.components.X`).
**Tags:** None identified.

## Properties
No properties are defined on a per-instance basis because this script is a module-level utility, not an ECS component.

## Main functions
### `WaterlogInit(ents, map_width, map_height)`
* **Description:** Initializes global state for waterlog generation by capturing the entities table and map dimensions.
* **Parameters:**
  * `ents` (table): The shared entities table used by the world generator to collect spawn positions.
  * `map_width` (number): Width of the generated world in tiles.
  * `map_height` (number): Height of the generated world in tiles.
* **Returns:** None (side effects only).
* **Error states:** None documented.

### `WaterlogRun(world, prefab_list, prefab_data)`
* **Description:** Performs the core waterlog generation logic: selects random ocean points, records marker entity spawn data for `watertree_pillar`, and placeholder calls to tile modification and spiral fill logic (currently unimplemented or commented out). Returns the updated entities table.
* **Parameters:**
  * `world` (table): The world generator context, providing access to `:GetTile(x, z)` and `:SetTile(x, z, tile_id)`.
  * `prefab_list` (table): Unused in current implementation (argument preserved for interface consistency).
  * `prefab_data` (table): Unused in current implementation (argument preserved for interface consistency).
* **Returns:** `table` — The input `ents` table, populated with entries for `MARKER_PREFAB` ("watertree_pillar").
* **Error states:** May print debug output via `print()` and `dumptable()`. The spiral fill and entity placement logic is currently non-functional (either empty or commented out).

## Events & listeners
None. This script does not register or dispatch any events.

