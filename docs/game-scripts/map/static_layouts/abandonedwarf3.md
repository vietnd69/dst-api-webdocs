---
id: abandonedwarf3
title: Abandonedwarf3
description: Defines a static map layout used in DST for placing environmental objects like bullkelp plants and miniflares within a cave environment.
tags: [map, static_layout, cave, environment]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: 24d61e59
---

# Abandonedwarf3

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file is a static map layout script (Tiled format, exported as Lua) used to define a fixed arrangement of background tiles and foreground objects for placement in the game world. It specifies a 12x12 tile grid with tile-based background layer (`BG_TILES`) and an object group layer (`FG_OBJECTS`) containing spawn points for entities such as `miniflare` and `bullkelp_plant`. These layouts are consumed by the world generation system during map room setup, particularly in the Caves world level. It does not function as an ECS component itself, but serves as a data source for procedural map generation logic.

## Usage example
This file is not instantiated directly in mod code. It is referenced indirectly via the map generation system. Example usage is handled internally by DST's `static_layouts` loader:

```lua
-- Not intended for direct use. Loaded by worldgen systems:
local layout = require("map/static_layouts/abandonedwarf3")
-- The layout table contains tile and object data used by房间/room generation scripts
```

## Dependencies & tags
**Components used:** None — this file contains only static layout data and does not reference any component APIs.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map orientation. |
| `width` | number | `12` | Map width in tiles. |
| `height` | number | `12` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (unused). |
| `tilesets` | table | `[table]` | Tileset definitions (contains one tileset: `ground`). |
| `layers` | table | `[table]` | Array of map layers (`BG_TILES` and `FG_OBJECTS`). |

### Layer Details
- `layers[1]` (`BG_TILES`): Tile layer with 144 integer tile IDs (row-major order).
- `layers[2]` (`FG_OBJECTS`): Object group containing 11 objects: 3 `miniflare` and 8 `bullkelp_plant`, each with `type`, `x`, `y` (pixel coordinates), and empty `properties`.

## Main functions
This file does not define any runtime functions. It returns a static data table on `require()`. No methods or callable functions exist.

## Events & listeners
None — this file is pure data and does not participate in the event system.