---
id: sculptures_3
title: Sculptures 3
description: A Tiled map file defining static layout data for sculptural decorations in the game world.
tags: [map, decoration, static-layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 38dcaaca
system_scope: environment
---

# Sculptures 3

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a Tiled map JSON export used as a static layout definition for placing decorative sculptural entities in the game world. It is not an ECS component but rather a data structure that specifies tile layer layout and object placements for "sculptures" themed locations—specifically, it includes background tiles (ID `11`) and references to two specific prefabs (`statue_marble_pawn` and `sculpture_rook`) as placed objects. Such files are loaded by the world generation system to populate static environments like ruins or arenas.

## Usage example
```lua
-- This file is automatically loaded by the level generator.
-- It is referenced in static layout task/room definitions, e.g.:
-- static_layouts = { "sculptures_3" },
-- The layout is consumed internally by the map loader; no direct modder interaction is required.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version used. |
| `luaversion` | string | `"5.1"` | Lua version target (for compatibility). |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` / `height` | number | `12` | Map grid dimensions in tiles. |
| `tilewidth` / `tileheight` | number | `16` | Size of each tile in pixels. |
| `tilesets` | table | — | Array of tileset definitions (e.g., ground tiles). |
| `layers` | table | — | Array of layers: `"BG_TILES"` (tile layer), `"FG_OBJECTS"` (object group with prefabs). |

## Main functions
This file is a pure data module returning a table—no executable functions are defined.

## Events & listeners
Not applicable.