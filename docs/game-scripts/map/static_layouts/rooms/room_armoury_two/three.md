---
id: three
title: Three
description: Tiled map data structure for the Armoury Two (room_armoury_two/three) static layout, defining tile layers and object placement for a dungeon room.
tags: [map, static_layout, room, dungeon]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 5615b81b
system_scope: environment
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout data for a specific variant (`three`) of the "Armoury Two" room in DST's world generation system. It uses the Tiled map format (version 1.1) to specify a 32×32 grid of tiles (each 16×16 pixels) and a set of object placements (spawners) in the foreground. The tile layer (`BG_TILES`) defines background flooring patterns using tile IDs, while the object group (`FG_OBJECTS`) contains four spawner object definitions for decorative statues and Nightmare-tier enemies.

## Usage example
This file is not instantiated as a component in-game. Instead, it is loaded by the map loader system during world generation to place the static room layout. A typical integration looks like:

```lua
-- Internally handled by the map loading system (e.g., worldgen.lua or room loaders)
-- No direct modder usage required.
-- The room layout is referenced via: map.static_layouts.rooms.room_armoury_two.three
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used in exported data. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | — | Array of tileset definitions (currently one). |
| `layers` | table | — | Array of map layers: tile layers and object groups. |

## Main functions
Not applicable — this is a data-only file, not a component or functional module.

## Events & listeners
Not applicable.