---
id: one
title: One
description: Defines a 32x32 tiled map layout for open rooms in the DST world generation system.
tags: [map, worldgen, layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 1dce6a29
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static tile-based map layout for the `room_open/one.lua` room configuration used in DST's world generation system. It specifies a 32×32 grid of 16×16 pixel tiles, with tile data encoded as a flat Lua array, and is part of the room templates used to populate open outdoor environments like the Forest and Cave entrances. The layout contains background tile information only (`BG_TILES`), with no foreground object placement defined.

## Usage example
```lua
-- This file is consumed by the world generation system automatically.
-- It is not directly instantiated by modders but is referenced by room tasksets and level generators.
-- Example of how the engine loads it:
local room = require("map/static_layouts/rooms/room_open/one")
-- room.width == 32, room.height == 32, room.layers[1].data == { ...tile IDs... }
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version compatibility |
| `orientation` | string | `"orthogonal"` | Map projection orientation |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Tile width in pixels |
| `tileheight` | number | `16` | Tile height in pixels |
| `properties` | table | `{}` | Custom map properties (empty in this file) |
| `tilesets` | array | See source | Array of tileset definitions used in the map |
| `layers` | array | See source | Array of layers: `BG_TILES` (tile data) and `FG_OBJECTS` (empty object group) |

## Main functions
Not applicable — this file is a pure data module returning a static Lua table. It contains no executable functions or methods.

## Events & listeners
None identified.