---
id: pigguard_grass
title: Pigguard Grass
description: Defines static decorative layout data for a pigguard environment, including background tile patterns and foreground object placement.
tags: [environment, layout, static, decoration]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 2863a2bf
system_scope: environment
---
# Pigguard Grass

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout definition (in Tiled JSON format) used to define the visual and structural setup of a pigguard environment area. It specifies background tiles, foreground objects (including `perma_grass` and `pigtorch` entities), and their coordinates within a 16x16 grid. The layout is intended to be applied during world generation or room placement and does not constitute a runtime component with logic or behavior.

## Usage example
Static layouts like this one are typically consumed by map/room systems and are not instantiated directly as components. A usage example is internal to the worldgen system, but conceptually:

```lua
-- This file is referenced during room generation, e.g.:
-- worldgen/tasksets/caves.lua or room加载系统
-- loads "pigguard_grass.lua" as a static layout.
-- No direct modder usage is required or typical.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled JSON version |
| `luaversion` | string | `"5.1"` | Lua version reported in metadata |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `16` | Map width in tiles |
| `height` | number | `16` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets` | array | See source | Tileset definitions (used for background layer) |
| `layers` | array | See source | Array of layers (`BG_TILES`, `FG_OBJECTS`) |
| `properties` | table | `{}` | Global map properties (unused) |

## Main functions
This file is a pure data definition and exports a static table. It does not define any functions or methods.

## Events & listeners
None identified

