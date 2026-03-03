---
id: military_entrance
title: Military Entrance
description: Defines a static map layout for a military-themed entrance area, including background tile data and placement of world objects such as ruins, statues, and cave holes.
tags: [map, static_layout, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 1cf30262
system_scope: world
---

# Military Entrance

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout in Tiled JSON-like format for a military-themed entrance zone. It specifies tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) containing placement markers for world elements like ruins, spawners, and cave hole areas. It is not an ECS component but a procedural map generation asset used during worldgen to position architectural and environmental features.

## Usage example
This file is not intended for direct instantiation by modders. It is loaded automatically by the worldgen system when a map layer references it as a static layout. Example internal use (not for modder-facing API):
```lua
-- Not applicable: this is a data file used by the worldgen task system.
-- It is referenced via the taskset/task system (e.g., in map/tasks/caves.lua).
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Tilemap orientation. |
| `width` | number | `40` | Map width in tiles. |
| `height` | number | `40` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | — | Array of tileset definitions (e.g., path to `tiles.png`, dimensions). |
| `layers` | table | — | Array of layers: tile layer (`BG_TILES`) and object group (`FG_OBJECTS`). |

## Main functions
Not applicable. This file is a pure data structure (a static layout asset), not a component with methods.

## Events & listeners
Not applicable.