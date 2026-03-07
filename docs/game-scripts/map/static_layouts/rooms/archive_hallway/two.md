---
id: two
title: Two
description: Defines a static map layout for an archive hallway room, containing tiled floor data and embedded game objects like statues, walls, and areas.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 040f3ba1
system_scope: environment
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout (`two.lua`) used in the Archive Hallway biome. It specifies a 32×32 tile grid (16×16 px per tile) with background tile layer data and an object layer (`FG_OBJECTS`) containing prefabs like statues, security desks, creature areas, and structural elements (e.g., `wall_stone_2`, `wall_ruins_2`). It does not implement any game logic — it is purely descriptive metadata for world generation.

## Usage example
This file is not instantiated as a component. Instead, it is consumed by the world generation system (e.g., `map/tasks/caves.lua`, `map/rooms/archive_hallway.lua`) to place the layout at runtime. Modders rarely interact with it directly; room layouts are referenced via room templates and tasksets.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Target Lua version for embedded scripts. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets[1].name` | string | `"tiles"` | Name of the tileset image. |
| `tilesets[1].image` | string | Path to tile image asset | Relative path to the tileset texture. |
| `layers[1].name` | string | `"BG_TILES"` | Layer containing background tile data. |
| `layers[2].name` | string | `"FG_OBJECTS"` | Layer containing object placements (prefabs). |

## Main functions
Not applicable — this file returns a plain Lua table with map metadata and does not define any functions.

## Events & listeners
Not applicable — this file contains no event-driven logic or runtime behavior.

## Notes
- The `data` array in `BG_TILES` layer uses 1D row-major indexing: rows of 32 values each, where non-zero values indicate tile IDs (e.g., `1`, `42`) to render.
- The `FG_OBJECTS` layer defines entity placements using `type` fields corresponding to prefab names (e.g., `archive_chandelier`, `creature_area`). Coordinates are in pixels relative to the room origin.
- Some wall objects include custom `properties` (e.g., `"data.health.percent" = "1"`, `"data.gridnudge" = "true"`), which are consumed by the game’s wall and placement systems.
- This file is auto-generated from a Tiled map editor and not intended for manual modification in most cases.