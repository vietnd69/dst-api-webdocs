---
id: caves_retrofit_land
title: Caves Retrofit Land
description: Adds and configures pre-designed retrofitted biomes (e.g., Archives and Fumarole) into existing cave world maps during world generation.
tags: [retrofit, world-generation, biome, caves, topology]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: d7a90749
---

# Caves Retrofit Land

This module provides top-level utility functions for injecting fixed-layout retrofitted content—specifically the *Archives* (Return of Them) and *Fumarole* (From Beyond) biomes—into an already-generated cave world. It operates at the map generation layer, manipulating `savedata` and the `world_map` to insert prefabs, register topology nodes, and update tile-node mappings. It does not define a component class; rather, it exports standalone functions used by world-generation pipelines.

## Usage example

These functions are called internally by the world generation system during cave map creation. A typical invocation occurs in a worldgen task or scenario that triggers retrofitting after the base world is generated:

```lua
local caves_retrofit_land = require("map/caves_retrofit_land")
caves_retrofit_land.ReturnOfThemRetrofitting_AcientArchives(world_map, savedata)
caves_retrofit_land.FromBeyondRetrofitting_Fumarole(world_map, savedata)
```

## Dependencies & tags
**Components used:** None. This file uses only utility modules: `constants`, `mathutil`, `map/terrain`, and `map/object_layout`. It does not interact with entity components.

**Tags:** Tags are added dynamically to topology nodes and include:
- `"archive_hallway"`, `"archive_hallway_two"` (for Archives mazes)
- `"archive_keyroom"`, `"archive_start"`, `"archive_end"`
- `"lunacyarea"`, `"GrottoWarEntrance"`
- `"fumarolearea"`

No static or persistent tags are applied to entities via this module.

## Properties
No top-level properties are defined in this module.

## Main functions

### `ReturnOfThemRetrofitting_AcientArchives(world_map, savedata)`
* **Description:** Generates and places the *Ancient Archives* retrofit—comprising an interconnected maze, keyroom, start/end rooms, and a Moon Mushroom patch with bridge—into a suitable open area of the cave map. Registers corresponding topology nodes for navigation and gameplay effects (e.g., lunacy).
* **Parameters:**
  - `world_map`: `Map` instance used for tile lookups and node id assignment.
  - `savedata`: Table containing `map.width`, `map.height`, `map.topology`, `ents`, `map.generated`, used to write layout data and new topology entries.
* **Returns:** `nil`
* **Error states:** If `FindOpenArea` fails to locate a clear 14×31 tile region, the function logs a failure message and exits early.

### `FromBeyondRetrofitting_Fumarole(world_map, savedata)`
* **Description:** Places the *Fumarole* retrofit biome (a self-contained chasm zone with associated terrain and density data) into a 30×30 tile area of the cave map, registering a topology node tagged for the `"fumarolearea"` effect.
* **Parameters:**
  - `world_map`: `Map` instance for tile operations.
  - `savedata`: Table containing generation metadata (`map`, `ents`, `generated.densities`) to update.
* **Returns:** `nil`
* **Error states:** If no valid 30×30 tile area is found, logs a failure and returns without modifying the map.

## Helper Functions (Internal Use)

### `FindOpenArea(map, map_width, map_height, tiles_wide, tiles_high)`
* **Description:** Scans the map grid in 5-tile steps (with 2-tile padding) to find a rectangular region where *all* tiles are impassable (e.g., rock or solid terrain). Used to locate safe insertion zones for large retrofit layouts.
* **Parameters:**
  - `map`: `Map` instance.
  - `map_width`, `map_height`: Integer dimensions of the map grid.
  - `tiles_wide`, `tiles_high`: Desired size (in grid tiles) of the open area.
* **Returns:** `found: boolean`, `top: integer`, `left: integer` — If `found` is `true`, the coordinates (`left`, `top`) specify the upper-left corner of a valid region.

### `AddTopologyData(topology, left, top, width, height, room_id, tags)`
* **Description:** Creates and appends a new node to the `topology.nodes` list, assigning navigation metadata and region tags for the game’s AI pathfinding and world effect systems. Converts tile-space coordinates to world-space (scaled by `TILE_SCALE`) and records node center, polygon, area, and neighbors.
* **Parameters:**
  - `topology`: Table containing `nodes` and `ids` arrays.
  - `left`, `top`: World-space coordinates (already converted, negative-offset for map centering).
  - `width`, `height`: Node dimensions in world-space units.
  - `room_id`: String identifier (e.g., `"AncientArchivesRetrofit:0:Archives"`).
  - `tags`: Array of strings (e.g., `{ "fumarolearea" }`).
* **Returns:** `index: integer` — The 1-based index of the newly inserted node in `topology.nodes`.

### `AddTileNodeIdsForArea(world_map, node_index, left, top, width, height)`
* **Description:** Assigns the given `node_index` to every tile in the specified rectangular tile region, linking them to the topology node for navigation.
* **Parameters:**
  - `world_map`: `Map` instance.
  - `node_index`: Node identifier (returned by `AddTopologyData`).
  - `left`, `top`: Tile-space upper-left corner.
  - `width`, `height`: Region size in tiles.
* **Returns:** `nil`

### `add_fn_fn(prefab, points_x, points_y, current_pos_idx, entitiesOut, width, height, prefab_list, prefab_data, rand_offset)`
* **Description:** Internal callback used by `obj_layout.Place` and `obj_layout.PlaceAndPopulatePrefabDensities` to record instance positions and metadata (e.g., `x`, `z`, `data`, `id`, `scenario`) into the `ents` table under `savedata.ents`.
* **Parameters:** Standard layout callback signature; only `entitiesOut`, `width`, and `height` are used from `args`.
* **Returns:** `nil`

## Events & listeners
This module does not define or use any events. It operates synchronously during world generation, outside the ECS event loop.