---
id: brinepool3
title: Brinepool3
description: Static map layout for a brine pool area, defining background tile placement and foreground object zones for saltstacks and cookiecutter spawners.
tags: [world, map, layout, spawn]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: c3070d0d
system_scope: world
---

# Brinepool3

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static layout for the Brine Pool environment in DST, represented as a Tiled map exported to Lua format. It contains tile data for background terrain layers (`BG_TILES`) and a set of rectangular object zones (`FG_OBJECTS`) used to define spawn areas for `saltstack_area` zones and `cookiecutter_spawner` entities. The layout is used by the world generation system to place pre-defined terrain and functional zones during map creation. It does not implement any component logic itself but serves as static data for world building.

## Usage example
This file is consumed by the world generation system as a Lua module and is not instantiated directly as a component. Typical usage occurs internally when loading static room layouts:

```lua
local brinepool3_layout = require "map/static_layouts/brinepool3"
-- Layout metadata (e.g., dimensions, tile data) is accessed via:
-- brinepool3_layout.width, brinepool3_layout.height, brinepool3_layout.layers
-- Worldgen scripts parse layers and spawn objects based on object types (e.g., "saltstack_area", "cookiecutter_spawner")
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export version. |
| `luaversion` | string | `"5.1"` | Lua version target for export. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `20` | Map width in tiles. |
| `height` | number | `20` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `properties` | table | `{}` | Map-level custom properties (unused). |
| `tilesets` | table | see source | Array of tileset definitions, includes ground tileset reference. |
| `layers` | table | see source | Array of layers: one tile layer (`BG_TILES`) and one object group (`FG_OBJECTS`). |

## Main functions
None — this file returns static data and contains no functions.

## Events & listeners
None — this file provides only static map data and does not interact with the event system.