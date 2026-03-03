---
id: one
title: One
description: Represents a static map layout configuration for a hallway residential room in the game world, defining tile data and object structure using Tiled map format.
tags: [map, layout, room, static]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 3a057b8d
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout (`hallway_residential_two/one.lua`) used in world generation. It specifies a 32x32 tile grid using Tiled-compatible JSON data structure with a background tile layer (`BG_TILES`) and an empty foreground object group (`FG_OBJECTS`). The layout contains only non-empty tiles at specific grid positions, forming a repeating vertical pattern suggesting wall segments.

This is not a component in the ECS sense; it is a data file returned as a table used by the world generation system to build room geometry during map creation.

## Usage example
```lua
-- Typically loaded internally by the worldgen system
local layout = require("map/static_layouts/rooms/hallway_residential_two/one")
-- layout.width, layout.height, layout.layers[1].data are used to construct the room
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version compatibility |
| `orientation` | string | `"orthogonal"` | Tilemap orientation type |
| `width` | number | `32` | Width of the map in tiles |
| `height` | number | `32` | Height of the map in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets[1].name` | string | `"tiles"` | Name of the tileset used |
| `tilesets[1].firstgid` | number | `1` | First global tile ID |
| `tilesets[1].image` | string | Path to tileset image | Relative file path to the tileset image asset |
| `layers[1].name` | string | `"BG_TILES"` | Name of the tile layer |
| `layers[1].data` | table | Array of 1024 numbers | Tile IDs row-wise (0 = empty tile) |

## Main functions
Not applicable.

## Events & listeners
Not applicable.