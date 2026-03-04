---
id: monkeyisland_retrofitlarge_02
title: Monkeyisland Retrofitlarge 02
description: A Tiled map layout defining static environmental assets for a monkey island zone, including ground tiles, dock infrastructure, pirate boats, cannons, monkey structures, and portal debris.
tags: [map, environment, static, dock, monkey]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: b3e28beb
system_scope: environment
---

# Monkeyisland Retrofitlarge 02

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static map layout in Tiled JSON format defining a large island zone in the Monkey Islands area. It specifies tile data for background layers and object groups for placing in-game assets such as docks, pirate ships, cannons, monkey huts, pillars, and portal debris. It is used by the world generation system to instantiate physical structures in the game world, typically loaded as part of a room or level configuration.

## Usage example
This file is not instantiated directly as an entity component but is consumed by the map loading system:
```lua
-- Internally loaded via worldgen/tasksets or static_layouts loader
local layout = require("map/static_layouts/monkeyisland_retrofitlarge_02")
-- The layout is then interpreted by the engine to spawn prefabs and tiles
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version compatibility |
| `orientation` | string | `"orthogonal"` | Map tile orientation |
| `width` | number | `36` | Map width in tiles |
| `height` | number | `36` | Map height in tiles |
| `tilewidth` | number | `64` | Width of each tile in pixels |
| `tileheight` | number | `64` | Height of each tile in pixels |
| `tilesets` | table | See source | List of tileset definitions used |
| `layers` | table | See source | List of tile and object layers |

## Main functions
None — this file returns static data and does not define functional methods.

## Events & listeners
None identified