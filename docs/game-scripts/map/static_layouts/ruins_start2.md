---
id: ruins_start2
title: Ruins Start2
description: Defines the static map layout for the Ruins starting area in DST, including tile layers and object placement for spawn points and cave exits.
tags: [map, layout, static]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: c9ffec01
system_scope: environment
---

# Ruins Start2

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`ruins_start2.lua` defines a static map layout used for the Ruins starting area in Don't Starve Together. It is not a gameplay component but rather a TMX-style tilemap configuration returned as a Lua table, containing layer definitions, tileset references, and object placement data. This file is consumed by the world generation system to construct the physical layout of the Ruins during cave or level initialization.

The file contains two layers: a background tile layer (`BG_TILES`) and an object group (`FG_OBJECTS`) specifying critical world entities like spawn points, cave exits, and environmental markers (e.g., skeleton). It does not implement any entity components or logic—its sole purpose is structural representation.

## Usage example
This file is not instantiated as a component. Instead, it is returned directly by the level layout loader to provide map geometry and object placements. Modders typically reference this layout via the static_layouts system during worldgen configuration, for example:

```lua
-- Within a custom level/taskset configuration
local ruins_layout = require("map/static_layouts/ruins_start2")
-- The layout table is used internally by DST's map loader to build the environment
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Map format version. |
| `luaversion` | string | `"5.1"` | Lua version used for encoding. |
| `orientation` | string | `"orthogonal"` | Tilemap orientation. |
| `width` / `height` | number | `16` | Dimensions in tiles. |
| `tilewidth` / `tileheight` | number | `16` | Size of each tile in pixels. |
| `tilesets` | table | (see source) | Tileset definitions, including image paths and tile metadata. |
| `layers` | table | (see source) | Layer definitions (tile layers and object groups). |

## Main functions
None identified — this file returns a static data structure and defines no functional methods.

## Events & listeners
None identified.