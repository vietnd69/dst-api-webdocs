---
id: moonbaseone
title: Moonbaseone
description: A static map layout definition for the Moon Base one-room environment, containing tile data and object placement metadata for world generation.
tags: [world, map, static_layout]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: b531b6af
system_scope: world
---
# Moonbaseone

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines the `moonbaseone` static map layout — a preconfigured 28x28 tile room used in the game's world generation system for DST. It contains background tile layer data (`BG_TILES`) and an object group layer (`FG_OBJECTS`) specifying placements of decorative and functional game objects (e.g., trees, rocks, creatures) using Tiled map format metadata. It is not an Entity Component System component, but rather a static data structure consumed by the world generation system.

## Usage example
This file is not instantiated as a component or entity. Instead, it is referenced by the map/task system. In context, it is typically loaded and applied during static room generation via the room/task system, for example:

```lua
-- This file itself is consumed by higher-level systems (e.g., room/level builders)
-- It is included in the map/static_layouts directory and referenced in tasksets or levels.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties exist in the ECS sense — this file is a pure data module returning a table.

| Field | Type | Value | Description |
|-------|------|-------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target (documentation only). |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `28` | Map width in tiles. |
| `height` | number | `28` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets[1]` | table | — | Tileset definition referencing the game tile atlas. |
| `layers[1]` | table | — | Background tile layer (`BG_TILES`). |
| `layers[2]` | table | — | Foreground object layer (`FG_OBJECTS`). |

## Main functions
Not applicable — this is a static data file returning a table; no executable functions are defined.

## Events & listeners
Not applicable — no event system integration present in this file.

