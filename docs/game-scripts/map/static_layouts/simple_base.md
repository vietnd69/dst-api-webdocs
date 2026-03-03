---
id: simple_base
title: Simple Base
description: A static map layout definition for a simple base structure used in world generation, containing tile data and object placements.
tags: [map, level-design, worldgen]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: ad328d8a
system_scope: world
---

# Simple Base

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`simple_base.lua` defines a static 24x24 grid-based map layout using Tiled Map Editor data. It specifies background tile configurations, foreground object placements (such as walls and construction areas), and associated metadata like tile size and orientation. This file is consumed during world generation to instantiate base-like structures in the game world.

This file is not an ECS component; it is a pure data definition for level geometry. It does not implement logic, attach components, or respond to events.

## Usage example
This file is loaded internally by the world generation system. Modders typically reference it as a template when creating custom static layouts.

```lua
-- Not used directly in mod code; loaded via worldgen/task system
-- Example conceptual usage:
-- local layout = require("map/static_layouts/simple_base")
-- -- layout.width, layout.height, layout.layers would be processed by the generator
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export version. |
| `luaversion` | string | `"5.1"` | Lua version used for the export. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `24` | Map width in tiles. |
| `height` | number | `24` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of a single tile in pixels. |
| `tileheight` | number | `16` | Height of a single tile in pixels. |
| `tilesets` | table | — | List of tileset definitions (e.g., `tiles.png`). |
| `layers` | table | — | List of layers (e.g., `BG_TILES`, `FG_OBJECTS`). |

## Main functions
Not applicable. This file returns a static table of map data and contains no functions.

## Events & listeners
Not applicable.