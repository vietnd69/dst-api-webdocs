---
id: winter_start_hard
title: Winter Start Hard
description: Defines the static layout data for the winter_start_hard map scene, specifying tile configurations, background layers, and object placements for the hard-mode winter starting area.
tags: [map, environment, layout, static, worldgen]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 0cdff4a8
system_scope: world
---

# Winter Start Hard

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is not a component, but a static map layout definition written in Tiled JSON format (with Lua-based data encoding). It specifies the visual and spatial layout for the "hard" variant of the winter starting area, including background tile layers and foreground object placements. The layout is consumed by the world generation system to render the map at runtime. It contains no game logic or ECS components — it is purely declarative data used during map initialization.

## Usage example
This file is not intended for direct use in mod code. It is referenced internally by the world generation system (e.g., via `map/static_layouts.lua` loader) when initializing the winter hard-start scenario. Modders should not directly instantiate or modify this file; instead, use `static_layouts` loader APIs or define new layouts in custom scenario code.

```lua
-- Internal usage (not for modding):
-- map/static_layouts.lua loads this file during worldgen:
-- local layout = require("map/static_layouts/winter_start_hard")
-- WorldGenerator:ApplyStaticLayout(layout)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility for encoded data. |
| `orientation` | string | `"orthogonal"` | Tilemap rendering orientation. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | (see data) | Collection of tileset definitions used by the map. |
| `layers` | table | (see data) | Array of layers (tile and object groups) defining the layout. |

## Main functions
Not applicable — this file is a data-only module returning a static table. No functions are defined.

## Events & listeners
Not applicable — this module does not participate in event handling or runtime logic.