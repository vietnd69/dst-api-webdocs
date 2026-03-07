---
id: one
title: One
description: Defines the static layout for the Pit Room Armoury Two map room, including background tilemap data and object placement markers for in-game spawners.
tags: [map, layout, room]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 282a6f5d
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file describes the static Tiled map layout for the "Pit Room Armoury Two" room. It is not a game component but a data file that defines the visual and spatial configuration of a specific dungeon room. The layout includes a 32x32 grid of background tiles and an object group specifying spawn points for decorative or functional in-game objects like spawners (e.g., chessjunk, nightmare variants, ancient altar fragments). It is consumed by the world generation system to place and render the room during map generation.

## Usage example
This file is loaded by the worldgen system automatically during map generation when a room of type `"pit_room_armoury_two"` is selected. No direct modder interaction is required.

```lua
-- Internally used by the game's map loader:
-- The engine reads this Lua table and converts it into the room's tilemap and object placements.
-- Example usage is not applicable for modders; placement is handled via worldgen tasksets and static_layouts.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility target. |
| `orientation` | string | `"orthogonal"` | Map coordinate system type. |
| `width` | number | `32` | Room width in tiles (16×16 px each). |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Pixel width of each tile. |
| `tileheight` | number | `16` | Pixel height of each tile. |
| `tilesets[1].name` | string | `"tiles"` | Tileset name referenced from external image. |
| `tilesets[1].image` | string | Path to tiles.png | External image asset used for tile rendering. |
| `layers[1].data` | array of numbers | 1024 integers | Tile ID grid (0 = empty; non-zero = tile to render). |
| `layers[2].objects` | array of objects | 5 entries | Spawn point definitions for in-game entities. |

## Main functions
None identified.

## Events & listeners
None identified.