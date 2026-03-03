---
id: pondsinkhole
title: Pondsinkhole
description: Defines the static map layout data for a pond sinkhole room, including tile layers and object group metadata for placement in world generation.
tags: [map, room, layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 9839ffe1
system_scope: environment
---

# Pondsinkhole

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`pondsinkhole.lua` is a static map layout file that specifies the tile-based and object-based geometry for a pond sinkhole room. It is not an ECS component but a structured data definition used by the world generation system to instantiate rooms. The file conforms to Tiled Map Editor's JSON format (adapted for DST's Lua runtime), containing tile layer data and object groups that indicate regions for lighting and pond boundaries.

## Usage example
This file is loaded and consumed by the world generation system during room placement; modders do not typically instantiate it directly. For reference, a typical room loader script might process it as follows:
```lua
local layout = require("map/static_layouts/pondsinkhole")
local width = layout.width -- 32
local height = layout.height -- 32
local tiledata = layout.layers[1].data -- tile layer BG_TILES
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version used. |
| `luaversion` | string | `"5.1"` | Lua version targeted. |
| `orientation` | string | `"orthogonal"` | Tilemap orientation type. |
| `width` | number | `32` | Width of the map in tiles. |
| `height` | number | `32` | Height of the map in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | See source | Array of tileset definitions. |
| `layers` | table | See source | Array of layer definitions (tile layers and object groups). |

## Main functions
Not applicable — this is a static data file returning a table.

## Events & listeners
Not applicable — this file does not participate in the event system.