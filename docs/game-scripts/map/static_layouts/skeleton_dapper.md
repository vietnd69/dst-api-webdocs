---
id: skeleton_dapper
title: Skeleton Dapper
description: Defines a static map layout containing decorative skeleton and clothing loot items for use in DST world generation.
tags: [world, map, loot]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: f714bc52
system_scope: world
---

# Skeleton Dapper

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`static_layouts/skeleton_dapper.lua` is a static map layout definition used in Don't Starve Together's world generation. It specifies a 12×12 grid of tiles with two layers: a background tile layer (`BG_TILES`) and an object layer (`FG_OBJECTS`) containing placeholder positions for loot items. This layout is likely used to create themed ground-level loot场景s — such as a decorated skeleton wearing or surrounded by clothing and accessories — in caves or surface maps. The file uses Tiled Map Editor (`.tmx`-style JSON-like Lua table) structure.

## Usage example
This file is not a component or script meant for direct instantiation. It is a data asset loaded by the map generation system, typically referenced via `WORLDPREFAB` or level/task configurations. Example integration in world generation configuration (not shown in source):
```lua
-- In a level or task file (e.g., levels/caves.lua)
{ type = "layout", layout = "skeleton_dapper" }
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility marker. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `12` | Map width in tiles. |
| `height` | number | `12` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Unused map properties. |
| `tilesets` | table | `[...]` | Tileset definition with reference to `tiles.png`. |
| `layers` | table | `[...]` | Array of layers: `BG_TILES` (tile data), `FG_OBJECTS` (item positions). |

## Main functions
None identified.

## Events & listeners
Not applicable.