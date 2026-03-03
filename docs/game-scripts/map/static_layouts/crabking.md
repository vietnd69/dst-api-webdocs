---
id: crabking
title: Crabking
description: Defines a static map layout for the Crab King boss arena, specifying tile data and spawn regions for game entities.
tags: [boss, map, layout, worldgen]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: a22e7297
system_scope: world
---
# Crabking

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This static layout file defines the Crab King boss arena map structure using Tiled Map Editor data format. It specifies a 10x10 tile grid with tile layers for background tiles and an object group containing `stack_area` placements and one `crabking_spawner` object used to position the boss spawn point. The layout is not an ECS component but a declarative data structure used during world generation to instantiate the arena.

## Usage example
This file is loaded and processed by the world generation system, not instantiated directly as a component. Usage within DST's worldgen pipeline is implicit:

```lua
-- Internally loaded and applied during world generation
-- No direct component usage; included for completeness
local layout = require("map/static_layouts/crabking")
-- The layout is consumed by game code that reads object types
-- (e.g., "crabking_spawner") to place relevant entities
```

## Dependencies & tags
**Components used:** None (data file only; does not access component APIs directly)  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Lua version target |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `10` | Map width in tiles |
| `height` | number | `10` | Map height in tiles |
| `tilewidth` | number | `64` | Width of each tile in pixels |
| `tileheight` | number | `64` | Height of each tile in pixels |
| `properties` | table | `{}` | Global map properties (empty) |
| `tilesets` | array | *see source* | Tileset definitions (ground tileset) |
| `layers` | array | *see source* | Layer definitions (`BG_TILES`, `FG_OBJECTS`) |

## Main functions
This is a data-only file. It exports a static Lua table and contains no executable functions.

## Events & listeners
None.