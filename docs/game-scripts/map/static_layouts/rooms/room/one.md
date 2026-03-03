---
id: one
title: One
description: Defines a static 32x32 tilemap room layout for DST's world generation system using Tiled JSON format.
tags: [room, worldgen, map]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e0c74faa
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout for the game's world generation system. It is a Tiled map export in Lua table format, used to embed fixed floor/ceiling tile patterns and object placements within generated rooms. It contains no logic code, no components, and no runtime behavior — it serves purely as data for the map-generation pipeline. It does not interact with entities, components, or game systems at runtime.

## Usage example
```lua
-- This file is loaded by the world generation system as a data table.
-- No direct usage in mod code is intended or required.
-- Example (internal usage only):
-- local room_data = require "map/static_layouts/rooms/room/one"
-- -- room_data contains map properties (e.g., width, height, layers)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Lua version targeted |
| `orientation` | string | `"orthogonal"` | Tilemap orientation |
| `width` | number | `32` | Room width in tiles |
| `height` | number | `32` | Room height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Room-level metadata properties (unused) |
| `tilesets` | array | `{{...}}` | Array of tileset definitions; contains one tileset named `"tiles"` |
| `layers` | array | `{{...}}` | Array of layers; contains `"BG_TILES"` (tile layer) and `"FG_OBJECTS"` (object group) |

## Main functions
Not applicable — this file exports only data, not functions.

## Events & listeners
Not applicable