---
id: long
title: Long
description: Defines the tilemap layout for the "Long" static room in the Pit Room Armoury, specifying tile data and object placement for level generation.
tags: [world, map, room, static]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 3ebd60f2
system_scope: world
---
# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout for the "Long" room variant used in the Pit Room Armoury level generation. It is a Tiled map export in Lua format, containing tile layer data and an object group with spawner entities. The layout is consumed by the game’s world generation system to procedurally place this room in the caves.

## Usage example
This file is not used directly in mod code — it is loaded automatically by the map system during world generation. However, modders may reference its structure when creating custom static layouts:
```lua
-- Not applicable: This is a data file for the level generator, not a moddable component.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target for map export. |
| `orientation` | string | `"orthogonal"` | Tile orientation type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets[1].image` | string | `"../../../../../../tools/tiled/dont_starve/tiles.png"` | Path to tileset image. |
| `layers[1].data` | array | 1024 integers | Tile IDs for the `BG_TILES` layer (row-major). |
| `layers[2].objects` | array | 2 objects | Spawner positions for `FG_OBJECTS` layer. |

## Main functions
Not applicable

## Events & listeners
Not applicable
