---
id: one
title: One
description: Defines the static layout data for the 'room_armoury_two' room using Tiled Map Editor format, including background tile layers and object spawner positions.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6cc54c60
system_scope: environment
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file provides the static map layout for the `room_armoury_two` room. It uses the Tiled Map Editor (`.tmx`) data format exported as Lua, specifying tile layers, object spawners, and room metadata (e.g., size, orientation). The layout includes:
- A `BG_TILES` tile layer defining floor decoration patterns via tile IDs.
- An `FG_OBJECTS` object group defining spawn points for decorative or interactive in-game entities like `chessjunk_spawner`, `knight_nightmare_spawner`, and others.

It is part of the world generation system's room templates and is consumed by map/room loaders during procedural world generation.

## Usage example
This file is not used directly by modders. It is loaded automatically by the room generation system when constructing instances of `room_armoury_two` during world generation:

```lua
-- Internally referenced as part of room generation:
-- map/tasksets/room_armoury_two.lua likely loads this file
-- Example conceptual usage (not actual modder-facing API):
local room_data = require("map/static_layouts/rooms/room_armoury_two/one")
-- room_data.layers[1] → BG_TILES
-- room_data.layers[2] → FG_OBJECTS
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Lua version targeted by export |
| `orientation` | string | `"orthogonal"` | Tile orientation type |
| `width` | number | `32` | Room width in tiles |
| `height` | number | `32` | Room height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets[1].name` | string | `"tiles"` | Name of the tileset used |
| `layers[1].name` | string | `"BG_TILES"` | Name of background tile layer |
| `layers[2].name` | string | `"FG_OBJECTS"` | Name of foreground object layer |
| `layers[2].objects[].type` | string | e.g., `"knight_nightmare_spawner"` | Spawn point type identifiers |

## Main functions
Not applicable — this file is a pure data structure and exports no functions.

## Events & listeners
None identified