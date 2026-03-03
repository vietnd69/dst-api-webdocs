---
id: oceanwhirlbigportal
title: Oceanwhirlbigportal
description: A static map layout definition for the Ocean Whirl big portal structure, containing tile data and object groups used by the world generator.
tags: [map, worldgen, static_layout, ocean]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 8c885d63
system_scope: world
---

# Oceanwhirlbigportal

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`oceanwhirlbigportal.lua` is a static layout asset used by the DST world generation system. It defines the visual and spatial configuration for the Ocean Whirl big portal structure in the Ocean biome. As a `.lua` file in the `static_layouts/` directory, it is not a runtime component but rather a declarative tilemap description consumed by the worldgen engine to spawn pre-designed structures. The file uses the Tiled Map Editor format and contains tile layer data for background visuals (`BG_TILES`) and an object group (`FG_OBJECTS`) marking placement areas for dynamic entities like `oceanwhirlbigportal`, `stack_area`, and `mast_area` objects.

## Usage example
Static layout files like this one are not directly instantiated by modders. They are referenced by worldgen tasks and tasksets during map generation. Example referencing in a taskset (not part of this file):

```lua
-- In a taskset file (e.g., tasksets/ocean.lua)
{
  name = "oceanwhirlbigportal",
  min_count = 0,
  max_count = 1,
  static_layout = "oceanwhirlbigportal",
  -- other settings...
}
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `10` | Map width in tiles. |
| `height` | number | `10` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `tilesets` | table | *see source* | Tileset definitions (ground tiles). |
| `layers` | table | *see source* | Layer definitions: `BG_TILES` (tilelayer) and `FG_OBJECTS` (objectgroup). |

## Main functions
None identified. This file exports a static data table and does not define runtime functions or methods.

## Events & listeners
None identified. This file is a data asset with no event handling logic.