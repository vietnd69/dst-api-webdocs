---
id: waterplant1
title: Waterplant1
description: Provides static layout data for a waterplant room, including tilemap geometry and object placement.
tags: [map, environment, room]
sidebar_position: 1
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: c1f7e244
system_scope: environment
---
# Waterplant1

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static room layout for use in world generation. It is not a component in the Entity Component System (ECS), but a pure data structure describing tile placement and object positions for a room containing waterplants. It follows the Tiled map format (`.tmx` equivalent in Lua), specifying tile layers, object groups, and orientation metadata. This data is used by the map generation system to instantiate physical entities and terrain when spawning the waterplant room in the game world.

## Usage example
```lua
-- This file is loaded by the map generation system during worldgen.
-- A typical integration point is within a task or room system that references this layout:
local waterplant_layout = require("map/static_layouts/waterplant1")
-- The engine interprets the returned table to build the room:
-- • BG_TILES layer determines floor tile IDs
-- • FG_OBJECTS objects define where waterplant prefabs are placed
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Tilemap rendering orientation. |
| `width` | number | `10` | Map width in tiles. |
| `height` | number | `10` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `properties` | table | `{}` | Room-level metadata (empty here). |
| `tilesets` | array | `{{...}}` | List of tileset definitions; here one set named `"ground"`. |
| `layers` | array | `{{...},{...}}` | Contains `"BG_TILES"` (tile data) and `"FG_OBJECTS"` (entity placement). |

## Main functions
Not applicable. This file is a data-only module returning a static table; it contains no runtime functions.

## Events & listeners
Not applicable. This file does not interact with events.

End of documentation.