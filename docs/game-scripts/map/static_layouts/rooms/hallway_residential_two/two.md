---
id: two
title: Two
description: Defines a static 32x32 tilemap layout for a residential hallway used in world generation, containing background tile data and an empty foreground object layer.
tags: [world, map, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: f644ab13
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static map layout (`two.lua`) used in the game's world generation system for `Don't Starve Together`. Specifically, it describes a 32×32 tile-based room layout for a residential hallway, stored in Tiled Map Editor format. It includes a background tile layer (`BG_TILES`) with numeric tile IDs and an empty foreground object layer (`FG_OBJECTS`). The layout is part of the `static_layouts` module, which is consumed by the worldgen system to construct deterministic room layouts.

## Usage example
This file is not instantiated as an entity component; instead, it is returned as a data structure by the worldgen system when constructing a hallway room. Modders would reference this format when creating custom static room layouts.

```lua
-- Example of loading and inspecting the layout (not executable in mod context without worldgen internals)
local hallway_layout = require("map/static_layouts/rooms/hallway_residential_two/two")
print(hallway_layout.width, hallway_layout.height) -- 32, 32
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Lua engine version target |
| `orientation` | string | `"orthogonal"` | Tilemap orientation |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets` | table | (see source) | Array of tileset definitions |
| `layers` | table | (see source) | Array of map layers (tile and object groups) |
| `properties` | table | `{}` | Global properties (empty) |

## Main functions
Not applicable — this is a data-only module returning a static table.

## Events & listeners
Not applicable — this module does not define or respond to events.