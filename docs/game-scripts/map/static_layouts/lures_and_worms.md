---
id: lures_and_worms
title: Lures And Worms
description: Static map layout definition for the Lures and Worms level, specifying tile grid dimensions, layer structure, and object placement metadata.
tags: [map, static_layout, level]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 210725ac
system_scope: world
---

# Lures And Worms

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout used for the Lures and Worms level in Don't Starve Together. It is a Tiled Map Editor format (`.json`-style Lua table) describing the level geometry, tile layers, and object placement zones. Unlike typical ECS components, this is a data-only structure consumed by the world generation system to construct the level geometry during map initialization. It contains no executable logic or entity behaviors; its sole purpose is to encode layout metadata for the level designer's intended configuration.

## Usage example
This file is not instantiated as an entity component. Instead, it is referenced by the level/task generation system. A typical usage pattern in worldgen code would be:

```lua
local layout = require "map/static_layouts/lures_and_worms"
-- The layout table is consumed by level loading utilities (e.g., level.lua or level_loader.lua)
-- No direct entity interaction is needed; placement is handled by level initialization routines.
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Lua version compatibility |
| `orientation` | string | `"orthogonal"` | Tilemap rendering orientation |
| `width` | number | `12` | Map width in tiles |
| `height` | number | `12` | Map height in tiles |
| `tilewidth` | number | `16` | Width of a single tile in pixels |
| `tileheight` | number | `16` | Height of a single tile in pixels |
| `properties` | table | `{}` | Global map properties (unused) |
| `tilesets` | table | (see source) | Array of tileset definitions; includes tile texture reference and dimensions |
| `layers` | table | (see source) | Array of layer objects: `BG_TILES` (background tile layer) and `FG_OBJECTS` (foreground object group) |

### Layers detail
- `layers[1]` (`BG_TILES`):
  - Type: `"tilelayer"`
  - Data: 12x12 grid (144 entries), all values `0` (empty/no tiles)
- `layers[2]` (`FG_OBJECTS`):
  - Type: `"objectgroup"`
  - Contains one object named `""` of type `"lures"`: a rectangle positioned at `(18,19)` with size `151x156` pixels

## Main functions
This file is a static data structure and contains no functional methods.

## Events & listeners
None — this file is purely declarative data and does not register or emit any events.