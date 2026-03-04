---
id: caves_retrofit_land
title: Caves Retrofit Land
description: Provides utility functions to retroactively inject specific biome layouts and maze structures into generated cave maps during world loading for the Return of Them and From Beyond updates.
tags: [world, map, biome, retrofit, worldgen]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d7a90749
system_scope: world
---

# Caves Retrofit Land

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`caves_retrofit_land.lua` is a world generation utility module that contains two retrofit functions—`ReturnOfThemRetrofitting_AcientArchives` and `FromBeyondRetrofitting_Fumarole`. These functions modify an already-generated cave map by inserting predefined biome layouts (e.g., the Ancient Archives and Fumarole biomes) using tile-based object placement and topology graph updates. They are invoked during world initialization for legacy saves that need to support new content.

## Usage example
This module is not used directly by prefabs or components. Instead, its functions are called internally during world loading. A typical usage pattern (as seen in the source) is:
```lua
local caves_retrofit_land = require "map/caves_retrofit_land"

-- Called after world generation completes, with savedata and world_map
caves_retrofit_land.ReturnOfThemRetrofitting_AcientArchives(world_map, savedata)
caves_retrofit_land.FromBeyondRetrofitting_Fumarole(world_map, savedata)
```

## Dependencies & tags
**Components used:** None.  
**Tags:** Uses and adds topology node tags such as `"archive_hallway"`, `"archive_hallway_two"`, `"archive_keyroom"`, `"archive_start"`, `"archive_end"`, `"fumarolearea"`, `"lunacyarea"`, `"GrottoWarEntrance"`. These tags are stored in topology node metadata for gameplay rule processing (e.g., Lunacy logic).

## Properties
No public properties. This module exports only functions.

## Main functions
### `FindOpenArea(map, map_width, map_height, tiles_wide, tiles_high)`
* **Description:** Scans the world map grid to find a rectangular area large enough to fit a given structure (e.g., a maze) without overlapping impassable terrain. It checks grid points in steps of 5 tiles, with a padding offset from world edges.
* **Parameters:**  
  `map` (WorldMap) — The generated map object used to query tile passability.  
  `map_width` (number) — Total width of the map in tiles.  
  `map_height` (number) — Total height of the map in tiles.  
  `tiles_wide` (number) — Required width of the candidate area (in tiles).  
  `tiles_high` (number) — Required height of the candidate area (in tiles).  
* **Returns:**  
  `found` (boolean) — `true` if a valid area is found, otherwise `false`.  
  `top` (number, optional) — Y-coordinate (grid index) of the top edge of the found area.  
  `left` (number, optional) — X-coordinate (grid index) of the left edge of the found area.  
* **Error states:** Returns `(false)` if no suitable area is found after full scan.

### `AddTopologyData(topology, left, top, width, height, room_id, tags)`
* **Description:** Creates and appends a new node to the map’s topology graph (used by pathfinding and world logic), representing a defined region such as a biome or maze. It populates node metadata including geometry, neighbours (initially empty), and custom tags.
* **Parameters:**  
  `topology` (table) — The `savedata.map.topology` table to modify.  
  `left` (number) — X-coordinate (world space, scaled) of the top-left corner.  
  `top` (number) — Y-coordinate (world space, scaled) of the top-left corner.  
  `width` (number) — Width of the node region (world space).  
  `height` (number) — Height of the node region (world space).  
  `room_id` (string) — Unique identifier string for the node (e.g., `"AncientArchivesRetrofit:0:Archives"`).  
  `tags` (table) — Array of string tags to associate with this node (e.g., `{ "lunacyarea" }`).  
* **Returns:** `index` (number) — The 1-based index in `topology.nodes` where the new node was inserted.

### `AddTileNodeIdsForArea(world_map, node_index, left, top, width, height)`
* **Description:** Assigns a topology node ID to every tile within a rectangular region, enabling tile-based map lookups to link positions to topology regions.
* **Parameters:**  
  `world_map` (WorldMap) — The map object.  
  `node_index` (number) — Index of the topology node to assign to all tiles in the area.  
  `left`, `top`, `width`, `height` (numbers) — Define the rectangular region in tile coordinates (inclusive bounds).  
* **Returns:** Nothing.

### `add_fn_fn(prefab, points_x, points_y, current_pos_idx, entitiesOut, width, height, prefab_list, prefab_data, rand_offset)`
* **Description:** Internal helper used by `obj_layout.Place` to record placement data for prefabs (e.g., rooms or biome assets). Saves entity position (scaled world space) and optional metadata (`data`, `id`, `scenario`).
* **Parameters:**  
  `prefab` (string) — Name of the prefab being placed.  
  `points_x`, `points_y` (tables) — arrays of tile-space coordinates.  
  `current_pos_idx` (number) — Index into `points_x`/`points_y` to use.  
  `entitiesOut` (table) — Output table where entries are keyed by prefab name.  
  `width`, `height` (numbers) — Used to compute center coordinates.  
  `prefab_data` (table or nil) — Optional metadata to include in the saved data.  
  Remaining arguments (`prefab_list`, `rand_offset`, `debug_prefab_list`) are unused in this context.  
* **Returns:** Nothing. Appends a `save_data` entry to `entitiesOut[prefab]`.

### `ReturnOfThemRetrofitting_AcientArchives(world_map, savedata)`
* **Description:** Retrofits the “Ancient Archives” biome—comprising a 4×4 maze of hallway segments, a Moon Mushroom patch, and a bridge—into an existing world. It uses `FindOpenArea` to locate space, places rooms via `obj_layout.Place`, and registers corresponding topology nodes.
* **Parameters:**  
  `world_map` (WorldMap) — The current world map instance.  
  `savedata` (table) — Contains `savedata.map.topology`, `savedata.map.width/height`, `savedata.ents`, `savedata.map.generated`.  
* **Returns:** Nothing. Prints success/failure to console.

### `FromBeyondRetrofitting_Fumarole(world_map, savedata)`
* **Description:** Retrofits the “Fumarole” biome—a 30×30 tile circle of fumarole terrain—into the world. Similar to `ReturnOfThemRetrofitting_AcientArchives`, it locates space, places the biome asset via `obj_layout.PlaceAndPopulatePrefabDensities`, and adds a topology node marked with `"fumarolearea"`.
* **Parameters:**  
  `world_map` (WorldMap) — The current world map instance.  
  `savedata` (table) — Same structure as above.  
* **Returns:** Nothing. Prints success/failure to console.

## Events & listeners
None. This is a pure utility module with no event listeners or event firing.
