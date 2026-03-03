---
id: maxwell_2
title: Maxwell 2
description: Static layout definition for the Maxwell arena map in Don't Starve Together, containing tile layer data and object placements.
tags: [map, static_layout, arena, boss]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 27e0fbae
system_scope: environment
---

# Maxwell 2

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines the static layout for the Maxwell arena, used in boss encounters. It specifies the map dimensions (36x36 tiles at 16x16 pixels per tile), background tile layer data (`BG_TILES`), and an object group (`FG_OBJECTS`) containing placements of static assets such as the Maxwell statue and chess-piece-themed structures (knight, rook) and marble trees. It is not a runtime component but a preprocessed map data structure used during world generation to instantiate arena environments.

## Usage example
This file is returned as a Lua table and consumed by the map loader during world generation. It is not meant to be instantiated as a component. A typical usage pattern in the engine would be:

```lua
-- Loaded via require() or asset system, then passed to map generator:
local arena_layout = require "map.static_layouts.maxwell_2"
worldgen.AddStaticLayout("maxwell_arena", arena_layout)
```

## Dependencies & tags
**Components used:** None (static data file, no runtime component logic).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Target Lua version for encoding. |
| `orientation` | string | `"orthogonal"` | Map tile orientation. |
| `width` | number | `36` | Map width in tiles. |
| `height` | number | `36` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (empty here). |
| `tilesets` | table | See source | Array of tileset definitions (contains one default tileset `tiles`). |
| `layers` | table | See source | Array of map layers — includes `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
This file does not define any functions or methods. It is a pure data definition returning a table.

## Events & listeners
This file does not define any events or listeners.