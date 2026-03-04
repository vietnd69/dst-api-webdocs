---
id: waterlogged3
title: Waterlogged3
description: Defines the static layout configuration for a water-themed zone using Tiled map data, including background tile layers and foreground object placements.
tags: [map, layout, worldgen]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 0f1779ce
system_scope: world
---

# Waterlogged3

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`waterlogged3.lua` is a static map layout definition file used in DST's world generation system. It specifies the visual and structural layout of a region using Tiled JSON-like format, including tile layer data (for background terrain), and an object group defining locations and areas for in-game elements like water trees and tree clusters. This file is consumed by the map generation system to place level geometry and spatial triggers during world initialization.

## Usage example
```lua
-- Not a typical use case for this file — it is loaded by the map system internally.
-- Example of how the generated layout might be referenced in worldgen logic:
local layout = require("map/static_layouts/waterlogged3")
-- The `layout` table contains map metadata, layers, and objects for spawning.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version used. |
| `luaversion` | string | `"5.1"` | Target Lua version. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `20` | Map width in tiles. |
| `height` | number | `20` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `properties` | table | `{}` | Map-level custom properties (empty here). |
| `tilesets` | array | — | Tileset definitions used in the map. |
| `layers` | array | — | Layer definitions: tile layers and object groups. |

## Main functions
This file is a static data definition and contains no runtime functions or methods.

## Events & listeners
None identified