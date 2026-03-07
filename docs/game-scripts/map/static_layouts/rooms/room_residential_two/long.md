---
id: long
title: Long
description: Defines the static map layout data for a residential room variant using Tiled map format.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 90af0ae2
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`long.lua` is a static room layout definition file used by the map generation system. It specifies the tile layer (background tiles) and object layer (decorative/interactive objects) for a particular room variant named "room_residential_two", marked as "long". The file adheres to the Tiled map format (`orientation = "orthogonal"`) and provides serialized map data (tile IDs and object positions) used during world generation. It does not function as a game entity component but rather as a data asset consumed by the worldgen or room placement systems.

## Usage example
This file is not intended for direct component usage. Instead, it is referenced by the map generation system (e.g., via room templates or task sets) when placing residential-style rooms. Usage would occur internally like:

```lua
-- Example internal usage (not modder-facing code)
local room_data = require("map/static_layouts/rooms/room_residential_two/long")
-- System uses room_data.layers.BG_TILES.data and room_data.layers.FG_OBJECTS.objects
-- to instantiate the room in the game world.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export format version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map projection type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets[1]` | table | — | Tileset metadata (image path, dimensions, first gid). |
| `layers[1]` | table | — | Background tile layer with 1024 tile IDs. |
| `layers[2]` | table | — | Foreground object layer with decorative furniture objects. |

## Main functions
Not applicable

## Events & listeners
None identified