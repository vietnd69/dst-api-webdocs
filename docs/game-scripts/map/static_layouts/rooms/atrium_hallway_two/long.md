---
id: long
title: Long
description: Defines the Atrium Hallway layout as a static map tile layer and object group configuration for dungeon generation.
tags: [map, dungeon, layout, room]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 66e943f8
system_scope: environment
---
# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file describes a static map layout used for generating the "Atrium Hallway" section in the Labyrinth. It defines a 32x32 tile layer (`BG_TILES`) with specific tile placements and an object group (`FG_OBJECTS`) containing placement data for entities like sanity rocks, insanity rocks, Pandora's Chest, nightmare spawners, and overgrowth triggers. It is consumed by the world generation system to instantiate physical room layouts in the game world.

## Usage example
This file is not used directly in player-facing code. It is loaded by the world generation system when constructing the Labyrinth level:

```lua
-- Internally referenced via:
-- include("map/static_layouts/rooms/atrium_hallway_two/long.lua")
-- The generator reads `layers` and `objects` to spawn entities and tiles.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used for embedded data. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width (in pixels) of each tile. |
| `tileheight` | number | `16` | Height (in pixels) of each tile. |
| `properties` | table | `{}` | Map-level custom properties (empty here). |
| `tilesets` | table | *(see source)* | Array of tileset definitions. |
| `layers` | table | *(see source)* | Array of layer definitions (`BG_TILES`, `FG_OBJECTS`). |

## Main functions
Not applicable.

## Events & listeners
Not applicable.
