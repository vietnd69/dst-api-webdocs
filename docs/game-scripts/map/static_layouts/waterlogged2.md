---
id: waterlogged2
title: Waterlogged2
description: Defines the layout and object placement for a water-themed map room in DST, including background tile patterns and object groups for tree areas and pillars.
tags: [map, room, layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: e267a73c
system_scope: world
---

# Waterlogged2

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`waterlogged2.lua` is a map layout definition file used for static room generation in DST's worldbuilding system. It specifies a 25x25 tile grid with tile-based background layer data and an object layer (`FG_OBJECTS`) containing positions and sizes for `watertree_pillar` and `treearea` elements. This layout is not an ECS component — it is a Tiled map export used by the worldgen system to place decorative or structural elements in caves or surface maps.

## Usage example
This file is not used directly as a component; it is referenced internally by the world generation system. It would be loaded and processed by tools like `archive_worldgen.lua` or `rooms/` loaders during level generation.

```lua
-- Not instantiated as a component; used as static map data
-- Example of how the system consumes this layout:
-- The engine parses the JSON-like Lua table to spawn prefabs at named object positions:
--   - "watertree_pillar" objects spawn water tree pillars
--   - "treearea" objects define spawn zones for trees
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export version |
| `luaversion` | string | `"5.1"` | Lua version targeted in export |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `25` | Map width in tiles |
| `height` | number | `25` | Map height in tiles |
| `tilewidth` | number | `64` | Width of each tile in pixels |
| `tileheight` | number | `64` | Height of each tile in pixels |
| `tilesets` | table | — | Array of tileset definitions (e.g., ground tiles) |
| `layers` | table | — | Array of layers (`BG_TILES`, `FG_OBJECTS`) |

## Main functions
Not applicable

## Events & listeners
Not applicable