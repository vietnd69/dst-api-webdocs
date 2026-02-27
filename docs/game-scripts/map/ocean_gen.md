---
id: ocean_gen
title: Ocean Gen
description: Provides procedural generation functions for ocean tile placement, terrain smoothing, set piece placement, and entity population within ocean world regions.
tags: [world, generation, ocean, terrain, setpiece]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 6d3b7e49
---

# Ocean Gen

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`ocean_gen.lua` is a module-level utility for generating ocean terrain during world generation. It does not define an ECS component but rather exposes global functions that manipulate the global `world` instance (set via `Ocean_SetWorldForOceanGen`). Its responsibilities include converting impassable tiles into ocean tiles, applying smoothing/falloff logic, placing set pieces, and populating ocean tiles with entities.

The module interacts with `map/object_layout.lua` (for layout placement) and `prefabswaps.lua` (to check inactive prefabs). It depends heavily on terrain tile definitions (`WORLD_TILES.*`) and global utilities (`mathutil`, `constants`).

## Usage example
```lua
require "map/ocean_gen"

-- Initialize world reference
local world_instance = ... -- World object from map generation
Ocean_SetWorldForOceanGen(world_instance)

-- Convert an initial impassable block to ocean with blending
Ocean_ConvertImpassibleToWater(width, height, {
    noise_octave_water = 6,
    noise_octave_coral = 4,
    final_level_shallow = 0.7,
    final_level_medium = 0.004,
    final_level_coral = 0.2,
    final_level_grave = 0.3,
})

-- Add shorelines
AddShoreline(width, height)

-- Place ocean set pieces
local set_pieces = { "shipwreck", "driftwood" }
Ocean_PlaceSetPieces(set_pieces, add_entity_fn, obj_layout, WORLD_TILES.IMPASSABLE, 5, encoded_topology, map_width, map_height)

-- Populate ocean with entities
PopulateOcean(spawn_fn, entitiesOut, width, height, ocean_contents, world_gen_choices, min_dist_from_land, encoded_topology)
```

## Dependencies & tags
**Components used:** None (module-level utilities only; operates on a globally assigned `world` instance).

**Tags:** None identified.

## Properties
No persistent state or class-based properties are defined in this module. All data is passed as function arguments or stored in local variables.

## Main functions
### `Ocean_SetWorldForOceanGen(w)`
* **Description:** Sets the global `world` instance used by all subsequent ocean generation functions.
* **Parameters:**
  * `w`: World object — reference to the active world generator instance.
* **Returns:** None.

### `Ocean_ConvertImpassibleToWater(width, height, data)`
* **Description:** Transforms impassable tiles into ocean tiles using a sequence of operations: square filling, ground filling, procedural noise, and blending. Applies edge falloff and void outlining to shape the ocean region.
* **Parameters:**
  * `width`, `height`: Integers — dimensions of the world grid.
  * `data`: Optional table — configuration overrides for ocean generation (e.g., noise parameters, thresholds). Supported keys: `noise_octave_water`, `noise_octave_coral`, `noise_octave_grave`, `noise_persistence_*`, `noise_scale_*`, `init_level_*`, `final_level_*`, `kernelSize`, `sigma`, `ellevels`, `depthShallow`, `depthMed`, `fillDepth`, `fillOffset`, `shallowRadius`.
* **Returns:** None.
* **Error states:** Fails silently if `world` is not initialized.

### `AddShoreline(width, height)`
* **Description:** Scans the world grid and sets ocean tiles adjacent to land to `OCEAN_COASTAL_SHORE`, unless they are `OCEAN_BRINEPOOL`.
* **Parameters:**
  * `width`, `height`: Integers — world grid dimensions.
* **Returns:** None.

### `GetRandomWaterPoints(populating_tile, width, height, edge_dist, needed)`
* **Description:** Collects up to `needed` tile coordinates that match `populating_tile` and lie within the interior region (excluding `edge_dist` border). Uses a multi-step sampling strategy with varying strides to avoid clustering.
* **Parameters:**
  * `populating_tile`: Tile ID — target tile type to sample.
  * `width`, `height`: Integers — world grid dimensions.
  * `edge_dist`: Integer — border margin to exclude.
  * `needed`: Integer — maximum number of points to return.
* **Returns:**
  * `points_x`: Array of integers — x coordinates.
  * `points_y`: Array of integers — y coordinates.

### `Ocean_PlaceSetPieces(set_pieces, add_entity, obj_layout, populating_tile, min_dist_from_land, encoded_topology, map_width, map_height)`
* **Description:** Places predefined ocean set pieces (e.g., shipwrecks, sunken ruins) by sampling valid locations in tiles matching `populating_tile`, reserving tiles, and invoking `ReserveAndPlaceLayoutFn`.
* **Parameters:**
  * `set_pieces`: Table — names and counts/tables of set pieces to place.
  * `add_entity`: Function — callback to add entities (signature: `fn(layout, prefabs, position, area_size)`).
  * `obj_layout`: Module reference — from `map/object_layout.lua`.
  * `populating_tile`: Tile ID — tile type in which to place set pieces.
  * `min_dist_from_land`: Integer — minimum distance to land.
  * `encoded_topology`: Table — populated with topology nodes if `layout.add_topology` is defined.
  * `map_width`, `map_height`: Integers — world dimensions.
* **Returns:** Total number of set pieces attempted.

### `PopulateOcean(spawnFn, entitiesOut, width, height, ocean_contents, world_gen_choices, min_dist_from_land, encoded_topology)`
* **Description:** Populates ocean regions (defined by `ocean_contents`) with prefabs and set pieces. Iterates over ocean rooms, delegates to `PopulateWaterType`, and handles both static layouts and random distribution.
* **Parameters:**
  * `spawnFn`: Table — spawn functions (e.g., `pickspawnprefab`).
  * `entitiesOut`: Table — output list to append new entities.
  * `width`, `height`: Integers — world grid dimensions.
  * `ocean_contents`: Array of tables — ocean room definitions (each with `data.value`, `data.contents`).
  * `world_gen_choices`: Table — world-gen overrides for prefab counts.
  * `min_dist_from_land`: Integer — minimum distance to land.
  * `encoded_topology`: Table — topology data structure.
* **Returns:** None.

### Helper functions (not intended for external use)
- `placeWaterline`, `placeWaterlineFilled`, `squareFill`, `getEdgeFalloff`, `simplexnoise2d`, `IsSurroundedByWaterOrInvalid`, `IsCloseToWater`, `IsCloseToLand`, `IsCloseToImpassable`, `fillGroundType`, `placeGroundType`, `placeFilledGroundType`, `findLayoutPositions`, `GetLayoutSize`, `PlaceOceanLayout`, `AddSquareTopology`, `PopulateWaterType`, `PopulateWaterPrefabWorldGenCustomizations`, `checkTile`, `checkAllTiles`, `GetRandomWaterPoints`, and `shuffleArray` (used internally via `mathutil`).

## Events & listeners
None. This module does not listen to or emit events; it is called directly during world generation.