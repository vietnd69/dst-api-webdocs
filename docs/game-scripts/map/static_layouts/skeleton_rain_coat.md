---
id: skeleton_rain_coat
title: Skeleton Rain Coat
description: A static map layout defining the placement of loot and environmental objects in the Skeleton Rain Coat area of the Caves.
tags: [map, loot, layout]
sidebar_position: 1
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 1dac3747
system_scope: world
---
# Skeleton Rain Coat

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`./map/static_layouts/skeleton_rain_coat.lua` defines a static map layout used in the Caves to place specific loot items (e.g., `skeleton`, `raincoat`, `rainhat`, `cutgrass`, `pigskin`) at fixed world coordinates. It is a JSON-compatible Tiled map file serialized as Lua, describing tile layers and object groups with no runtime logic or ECS components.

## Usage example
This layout is not used directly as an ECS component. It is referenced and loaded by the worldgen system (e.g., via `rooms/` or `tasksets/` logic) to spawn pre-defined arrangements of prefabs in the game world.

```lua
-- Internally, this file is loaded as data during world generation:
local layout = require("map/static_layouts/skeleton_rain_coat")
-- The layout is parsed by the engine to spawn objects like:
-- spawnprefab("raincoat", x, y, z)
-- at the coordinates defined in the FG_OBJECTS group.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `12` | Map width in tiles. |
| `height` | number | `12` | Map height in tiles. |
| `tilewidth` | number | `16` | Width per tile in pixels. |
| `tileheight` | number | `16` | Height per tile in pixels. |
| `properties` | table | `{}` | Map-level properties (unused here). |
| `tilesets` | array | see source | Tileset definitions (unused in practice). |
| `layers` | array | see source | Layer data: `BG_TILES` (empty) and `FG_OBJECTS` (object placements). |

## Main functions
Not applicable — this file defines a static data structure only.

## Events & listeners
Not applicable — no runtime logic or event interaction.

