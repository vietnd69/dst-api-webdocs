---
id: maxwell_3
title: Maxwell 3
description: A static map layout defining the visual tile layer and object placement for the Maxwell 3 challenge arena.
tags: [world, environment, static_layout, boss]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 0fdedd7b
system_scope: world
---

# Maxwell 3

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout for the "Maxwell 3" challenge arena. It is not a component in the Entity Component System (ECS), but rather a structured tilemap definition in Tiled JSON-compatible Lua table format. It specifies orthogonal-grid geometry (36x36 tiles of 16x16 pixels), a background tile layer (`BG_TILES`), and an object group (`FG_OBJECTS`) containing spawn points for specific entities—most notably the "statuemaxwell" and multiple "knight" placements. It serves as a world-generation asset consumed by the map/level loading system to instantiate static structures and entity spawns in-game.

## Usage example
This file is not instantiated or added as an ECS component; instead, it is returned as a Lua table and processed by the world generation system during level loading. An example of how such a layout is referenced (hypothetical usage by the map/level loader):
```lua
-- The layout is loaded and used internally by the level loader, e.g.:
local maxwell_3_layout = require("map/static_layouts/maxwell_3")
-- The loader uses the data to populate tile layers and spawn objects:
-- inst:AddTag("statue_maxwell_spawner") at position derived from "statuemaxwell" object
-- inst:AddTag("knight") at positions from "knight" objects
```

## Dependencies & tags
**Components used:** None. This is a data-only file; it does not access any component methods or modify entities directly at runtime.  
**Tags:** None. This file itself does not apply tags; it only defines object positions for tags to be applied during level instantiation.

## Properties
No ECS-style properties exist in this file. It is a pure data container for static map layout information. All fields are top-level Lua table keys defining map metadata and layer content.

### Key-top-level fields (non-ECS data structure):
| Field | Type | Default Value | Description |
|-------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map version |
| `luaversion` | string | `"5.1"` | Lua version compatibility |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `36` | Map width in tiles |
| `height` | number | `36` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Map-wide custom properties (empty here) |
| `tilesets` | table | populated | Array of tileset definitions (contains one tileset named `"tiles"`) |
| `layers` | table | populated | Array of layers: `"BG_TILES"` (tile layer), `"FG_OBJECTS"` (object group) |

### Layer-specific fields:
- **`layers[1]` (`BG_TILES`):**
  - `data`: array of 1296 integers (36x36), representing tile IDs (0 = empty). Non-zero values (e.g., `10`, `11`) indicate tile types at grid positions.
- **`layers[2]` (`FG_OBJECTS`):**
  - `objects`: array of 6 object entries. Each object defines:
    - `type`: string (e.g., `"statuemaxwell"`, `"knight"`)
    - `x`, `y`: number (pixel coordinates in world space)
    - `width`, `height`: number (unused, always `0` here, indicating point placement)

## Main functions
This file contains no functions. It is a static data definition returning a single Lua table.

## Events & listeners
This file does not define or interact with any events.