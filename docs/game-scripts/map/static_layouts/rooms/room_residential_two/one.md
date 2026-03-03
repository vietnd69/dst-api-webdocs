---
id: one
title: One
description: Defines static layout data for a residential room tilemap used in world generation.
tags: [map, worldgen, room]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: b24586f5
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file exports a table defining the static layout of a residential room (`room_residential_two/one.lua`) using Tiled map format. It specifies tile layer data (`BG_TILES`), object placements (`FG_OBJECTS`), and rendering properties (dimensions, tile size) for procedural world generation. The data is consumed by the game's map generation systems to place room layouts in the world.

## Usage example
This file is not instantiated as an ECS component; it is a data module returning a Tiled-compatible layout table. It is loaded and consumed internally by the map generation system:

```lua
-- Internally used by map/task system, e.g.:
-- local room_layout = require "map/static_layouts/rooms/room_residential_two/one"
-- (No manual instantiation required)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target for embedded code. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | see source | List of tileset definitions (includes path to `tiles.png`). |
| `layers` | table | see source | Array of map layers (tile layer + object group). |

## Main functions
This module returns a data table and does not define or expose any functional methods.

## Events & listeners
Not applicable.