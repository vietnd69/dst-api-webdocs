---
id: two
title: Two
description: Defines a static hallway map layout using Tiled map format, containing background tile data and foreground object placements for in-game level generation.
tags: [map, static_layout, room]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: dd4d93e6
system_scope: environment
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static map layout (`rooms/hallway/two.lua`) for use in DST's world generation system. It specifies a 32x32 tile layout using orthogonal orientation and 16x16 tile dimensions. The layout includes a tile layer (`BG_TILES`) with background tile IDs and an object group (`FG_OBJECTS`) containing one `pigtorch` object positioned in the foreground. Static layouts like this are used by room-based world generators to assemble consistent, reusable map sections.

## Usage example
Static layouts are typically loaded and used internally by the world generation system. Example usage in a mod context:

```lua
-- Example: manually loading and inspecting a static layout
local layout = require("map/static_layouts/rooms/hallway/two")
print("Layout width:", layout.width)     -- 32
print("Layout height:", layout.height)   -- 32
print("Tile data size:", #layout.layers[1].data) -- 1024 (32*32)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (empty here). |
| `tilesets` | array | `{{...}}` | Tileset definitions. |
| `layers` | array | `{{...}, {...}}` | Layer definitions (tile and object groups). |

## Main functions
Not applicable — this file is a pure data definition with no runtime logic or functional methods.

## Events & listeners
None identified.