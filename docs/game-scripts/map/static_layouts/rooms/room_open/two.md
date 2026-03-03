---
id: two
title: Two
description: Defines a static map layout for a specific room in DST's world generation system.
tags: [world, map, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 98db83fa
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout using Tiled map format. It is used in DST's world generation system to place pre-designed room sections in the game world. The layout consists of a 32×32 tile grid with a background tile layer (`BG_TILES`) containing decorative floor elements and an empty object layer (`FG_OBJECTS`). This file is part of the `static_layouts/rooms/room_open/` directory, indicating it belongs to a set of open-area room templates used for procedural world generation.

## Usage example
```lua
-- This file is loaded by the world generation system as a data definition.
-- It is not instantiated as a component or added to an entity directly.
-- Usage occurs internally via the map/level generation system.
-- Example internal usage (not shown here):
-- local layout = require("map/static_layouts/rooms/room_open/two")
-- layout.data -- contains the tile data
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Map-level custom properties (empty here). |
| `tilesets` | table | See source | Array of tileset definitions (contains one tileset named `"tiles"`). |
| `layers` | table | See source | Array of layer definitions (contains `BG_TILES` tile layer and `FG_OBJECTS` object group). |

## Main functions
Not applicable. This file returns static data only.

## Events & listeners
None identified.