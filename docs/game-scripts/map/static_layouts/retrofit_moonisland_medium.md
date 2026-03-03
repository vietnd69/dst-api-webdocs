---
id: retrofit_moonisland_medium
title: Retrofit Moonisland Medium
description: Defines the Tiled map layout for a medium-sized moon island environment, including tile layers and object groups for terrain, scenery, and gameplay elements.
tags: [world, map, level, static_layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: b31aff61
system_scope: world
---

# Retrofit Moonisland Medium

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`retrofit_moonisland_medium.lua` is a static layout definition for a medium-sized moon island map. It is a data-only file that conforms to the Tiled map format (version 1.1), specifying the map dimensions, tileset references, tile layer data, and multiple object groups containing placement information for in-game entities such as moon fissures, hotsprings, moon saplings, beach flora, boulders, and structural features. This file is not a component or entity system script; it serves as a blueprint for world generation tools to instantiate the island environment.

## Usage example
This file is loaded by world generation systems (e.g., `archive_worldgen.lua`) and parsed as a Lua table. Modders do not typically interact with it directly in gameplay code. However, when used as input to a map loader or builder, it may be consumed as follows:

```lua
local layout = require("map/static_layouts/retrofit_moonisland_medium")
-- layout.width = 48, layout.height = 48, layout.tilewidth = 64, tileheight = 64
-- Layout layers contain tile IDs and object definitions used to spawn entities and tiles
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties are defined in a component sense. The table returned is a static configuration with the following top-level keys:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled specification version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `48` | Map width in tiles. |
| `height` | number | `48` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `tilesets` | table | `{...}` | List of tileset definitions (ground tileset used). |
| `layers` | table | `{...}` | Array of layers (tile and object groups) defining layout content. |

## Main functions
This file contains no functional logic — it is a pure data structure. No functions are defined or exported.

## Events & listeners
Not applicable — no runtime logic or event interaction exists in this file.