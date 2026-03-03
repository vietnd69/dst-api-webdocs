---
id: long
title: Long
description: Provides layout data for a static map room named 'long', defining tile layers and object placements using TMX format.
tags: [map, room, static, layout, tilemap]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 09f506b4
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`long.lua` defines the static layout data for a rectangular map room used in the game world generation system. It specifies the structure of the room using the Tiled Map Editor (TMX) format, including a background tile layer (`BG_TILES`) and an object group (`FG_OBJECTS`) containing one `pigtorch` placement. This file is consumed by the world generation system to instantiate the room geometry and assets during world loading.

## Usage example
This file is not intended for direct component use in Lua code; it is loaded and parsed by the world generation system. It is referenced indirectly via room placement logic (e.g., in `tasksets/` or `levels/`). Example consumption by engine code:
```lua
-- Internal usage: worldgen loads and parses TMX data like this
local roomdata = require("map/static_layouts/rooms/room/long")
local bg_tiles = roomdata.layers[1].data
-- ... pass data to room instantiation logic
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | TMX format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility tag. |
| `orientation` | string | `"orthogonal"` | Tilemap orientation type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Room-level custom properties (empty). |
| `tilesets` | array | — | Tileset definition with external image reference. |
| `layers` | array | — | Contains `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
Not applicable.

## Events & listeners
Not applicable.