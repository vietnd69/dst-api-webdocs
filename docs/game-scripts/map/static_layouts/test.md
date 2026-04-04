---
id: test
title: Test
description: Static layout test data for map room generation, containing Tiled map metadata for a 32x32 grid with background tiles and foreground object placements.
tags: [world, map, static_layout, testing]
sidebar_position: 10

last_updated: 2026-03-15
build_version: 714014
change_status: stable
category_type: root
source_hash: 3b8cfdd6
system_scope: world
---

# Test

> Based on game build **714014** | Last updated: 2026-03-15

## Overview
This file defines static layout test data conforming to the Tiled map format, used for previewing or validating map room layouts in development. It specifies a 32x32 orthogonal grid with 16x16 tiles and includes two layers: a tile layer (`BG_TILES`) containing static tile IDs, and an object group (`FG_OBJECTS`) listing placement markers for game entities like firepits, areas, and spawn points.

## Usage example
```lua
-- This file is not instantiated as a component; it is referenced directly as static layout data.
-- It is typically loaded via worldgen or level builder tools to verify room layouts.
-- Example (conceptual, not executable in-game):
-- local layout = require("map/static_layouts/test")
-- assert(layout.width == 32)
-- assert(#layout.layers == 2)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility flag. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | See source | Tileset definitions. |
| `layers` | table | See source | Layer definitions including tiles and objects. |

## Main functions
Not applicable — this file exports a static data structure (a Lua table) and contains no functional methods.

## Events & listeners
Not applicable