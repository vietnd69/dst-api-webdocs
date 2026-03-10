---
id: tilemanager
title: Tilemanager
description: Central registry and validation system for defining and configuring in-game ground tiles, minimap tiles, falloff textures, and ground creep assets.
tags: [world, tile, assets, configuration]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 918fe9b2
system_scope: world
---

# Tilemanager

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Tilemanager` is a configuration module that manages the registration, validation, and ordering of ground tiles (surface types), minimap tiles, falloff textures, and ground creep layers. It ensures tiles are correctly defined, assets are resolved and added, and metadata (like sounds, colors, and flags) is applied before the world is generated. It enforces immutability via `mod_protect_TileManager` to prevent mid-game definition changes, and it prevents conflicts in tile ID allocation by using named tile ranges.

## Usage example
```lua
-- In a mod's init or worldgen override file:
local TileManager = require("tilemanager")

-- Register a new tile range (if not already defined)
TileManager.RegisterTileRange("MYMOD_TILES", 2000, 2255)

-- Define and add a ground tile
TileManager.AddTile(
    "mymod_grass",
    "MYMOD_TILES",
    { ground_name = "mymod_grass" },
    {
        name = "my_mod_grass",
        noise_texture = "my_mod_grass_noise",
        atlas = "my_mod_grass_atlas",
        walksound = "dontstarve/movement/walk_grass",
        runsound = "dontstarve/movement/run_grass",
    },
    {
        name = "mymod_grass_minimap",
        noise_texture = "mymod_grass_minimap_noise",
        atlas = "mymod_grass_minimap_atlas",
    },
    nil -- no turf definition
)
```

## Dependencies & tags
**Components used:** None (uses global tables like `GROUND`, `WORLD_TILES`, `INVERTED_WORLD_TILES`, `GROUND_FLOORING`, `GROUND_HARD`, `GROUND_ROADWAYS`, `TERRAFORM_IMMUNE`, `GROUND_NOGROUNDOVERLAYS`, `GROUND_INVISIBLETILES`, `GROUND_ISTEMPTILE`, `GROUND_NAMES`, `GroundTiles.ground`, `GroundTiles.minimap`, `GroundTiles.falloff`, `GroundTiles.creep`, and asset tables).
**Tags:** Does not add or check entity tags; operates on tile ID metadata tables.

## Properties
No public properties. This module is a function-return-only API.

## Main functions
### `RegisterTileRange(range_name, range_start, range_end)`
* **Description:** Registers a contiguous ID range for tile definitions. Prevents tile ID collisions by reserving a block of IDs for modded tiles.
* **Parameters:**  
  `range_name` (string) – Unique uppercase name for the range (e.g., `"MYMOD_TILES"`).  
  `range_start` (number) – Starting tile ID (inclusive).  
  `range_end` (number) – Ending tile ID (inclusive); must satisfy `range_end - range_start >= 255`.
* **Returns:** Nothing.
* **Error states:** Throws an error if `mod_protect_TileManager == false` is not true, if the range is too small, or if the range name already exists.

### `AddTile(tile_name, tile_range, tile_data, ground_tile_def, minimap_tile_def, turf_def)`
* **Description:** Registers a new tile type with optional ground, minimap, and turf definitions. Assigns a unique tile ID within the given range, resolves assets, and populates related metadata tables.
* **Parameters:**  
  `tile_name` (string) – Unique lowercase tile name (converted to uppercase internally).  
  `tile_range` (string) – Registered range name (e.g., `"MYMOD_TILES"`).  
  `tile_data` (table or nil) – Metadata override (e.g., `old_static_id`).  
  `ground_tile_def` (table or nil) – Ground tile definition table (see `ValidateGroundTileDef` for required fields).  
  `minimap_tile_def` (table or nil) – Minimap tile definition table.  
  `turf_def` (table or nil) – Turf definition table.
* **Returns:** Nothing.
* **Error states:** Throws an error if `mod_protect_TileManager == false` is not true, if the range is invalid, if the tile name is already defined, or if ID allocation fails (range full).

### `SetTileProperty(tile_id, propertyname, value)`
* **Description:** Modifies a property on a ground tile definition after it has been added (e.g., changing `walksound` or `colors`).
* **Parameters:**  
  `tile_id` (number) – Tile ID returned during `AddTile`.  
  `propertyname` (string) – Property key to update.  
  `value` (any) – New value for the property.
* **Returns:** Nothing.

### `ChangeTileRenderOrder(tile_id, target_tile_id, moveafter)`
* **Description:** Repositions a ground tile in the render order relative to another tile.
* **Parameters:**  
  `tile_id` (number) – Tile to move.  
  `target_tile_id` (number) – Reference tile.  
  `moveafter` (boolean) – If true, inserts `tile_id` *after* `target_tile_id`; otherwise, before.
* **Returns:** Nothing.

### `SetMiniMapTileProperty(tile_id, propertyname, value)`
* **Description:** Modifies a minimap tile definition property.
* **Parameters:** Same as `SetTileProperty`.
* **Returns:** Nothing.

### `ChangeMiniMapTileRenderOrder(tile_id, target_tile_id, moveafter)`
* **Description:** Repositions a minimap tile in the render order relative to another minimap tile.
* **Parameters:** Same as `ChangeTileRenderOrder`.
* **Returns:** Nothing.

### `AddFalloffTexture(falloff_id, falloff_def)`
* **Description:** Registers a falloff texture (used for smooth transitions between different tile types).
* **Parameters:**  
  `falloff_id` (number) – Unique ID for the falloff.  
  `falloff_def` (table or nil) – Falloff definition table (see `ValidateFalloffDef`).
* **Returns:** Nothing.
* **Error states:** Throws an error if `mod_protect_TileManager == false` is not true.

### `SetFalloffProperty(falloff_id, propertyname, value)`
* **Description:** Modifies a falloff texture definition property.
* **Parameters:** Same as `SetTileProperty`.
* **Returns:** Nothing.

### `ChangeFalloffRenderOrder(falloff_id, target_falloff_id, moveafter)`
* **Description:** Repositions a falloff texture in the render order relative to another falloff.
* **Parameters:** Same as `ChangeTileRenderOrder`.
* **Returns:** Nothing.

### `AddGroundCreep(groundcreep_id, groundcreep_def)`
* **Description:** Registers a ground creep texture (e.g., grass overgrowth, mold, snow patches).
* **Parameters:**  
  `groundcreep_id` (number) – Unique ID for the creep.  
  `groundcreep_def` (table or nil) – Creep definition table.
* **Returns:** Nothing.

### `SetGroundCreepProperty(groundcreep_id, propertyname, value)`
* **Description:** Modifies a ground creep definition property.
* **Parameters:** Same as `SetTileProperty`.
* **Returns:** Nothing.

### `ChangeGroundCreepRenderOrder(groundcreep_id, target_groundcreep_id, moveafter)`
* **Description:** Repositions a ground creep in the render order relative to another creep.
* **Parameters:** Same as `ChangeTileRenderOrder`.
* **Returns:** Nothing.

## Events & listeners
None identified.

