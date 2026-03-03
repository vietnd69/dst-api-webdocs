---
id: pigguard_berries_easy
title: Pigguard Berries Easy
description: Defines a static map layout for a "pigguard berries easy" scenario containing decorative torches and berry bushes.
tags: [map, layout, static, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 687cded6
system_scope: environment
---

# Pigguard Berries Easy

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout for a specific game scenario named "pigguard_berries_easy". It is a JSON-compatible Lua table describing a Tiled map format (16×16 grid, 64×64 tile size), containing background tile layers and foreground object placement. The layout includes pig torches and berry bushes (both standard and "juicy" variants), likely used to set up a low-difficulty encounter or resource point associated with pig guards. This is not an ECS component but a map definition used during world generation.

## Usage example
This file is not instantiated as an entity or component. Instead, it is imported by the worldgen system to place objects and tiles in a level. A typical usage pattern in worldgen code would be:

```lua
local layout = require("map/static_layouts/pigguard_berries_easy")
-- The returned table is passed directly to a layout loader or renderer
-- to instantiate prefabs (e.g., "pigtorch", "berrybush") at specified coordinates.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility (legacy artifact). |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `16` | Map width in tiles. |
| `height` | number | `16` | Map height in tiles. |
| `tilewidth` | number | `16` | Logical tile width. |
| `tileheight` | number | `16` | Logical tile height. |
| `tilesets` | table | — | Tileset definitions (currently one entry for `tiles.png`). |
| `layers` | table | — | Array of layers (`BG_TILES` and `FG_OBJECTS`). |

## Main functions
Not applicable.

## Events & listeners
Not applicable.