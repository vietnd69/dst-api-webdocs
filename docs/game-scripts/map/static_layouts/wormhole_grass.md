---
id: wormhole_grass
title: Wormhole Grass
description: Defines a static map layout containing no procedural content—used purely as a visual placeholder for wormhole-related areas in the game world.
tags: [map, layout, placeholder]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 06f1ec9c
system_scope: environment
---

# Wormhole Grass

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static map layout definition for use in DST's world generation system. It specifies an 8×8 tile grid with a background layer (`BG_TILES`) filled entirely with empty tiles (value `0`) and a foreground object group (`FG_OBJECTS`) containing a single marker object named `wormhole_MARKER`. It serves as a non-interactive, decorative or spatial placeholder—likely used during testing or as a minimal seed layout for wormhole-related map regions. It is not an Entity Component System component and does not define any runtime logic or entity behavior.

## Usage example
This file is not used directly in Lua code as a component. Instead, it is loaded by DST's map generation system via the `static_layouts` loader (e.g., in `tasksets/caves.lua` or similar). To reference it programmatically in worldgen code:
```lua
local layout = require("map/static_layouts/wormhole_grass")
-- layout.version, layout.width, etc., are accessible for metadata inspection
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | TMX map format version. |
| `luaversion` | string | `"5.1"` | Lua version specified for tile data encoding. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `8` | Width of the map in tiles. |
| `height` | number | `8` | Height of the map in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | `[{...}]` | Array of tileset definitions. |
| `layers` | table | `[{...}, {...}]` | Array of map layers (background tile layer and foreground object group). |

## Main functions
*Not applicable* — this file is a static data structure, not a component with executable methods.

## Events & listeners
*Not applicable* — no events or listeners are involved.

## Layers and objects
### Layer: `BG_TILES`
- **Type:** `tilelayer`
- **Size:** 8×8 tiles
- **Encoding:** Lua (inline array)
- **Content:** All tile IDs are `0` (indicating empty space/no tile rendered).

### Layer: `FG_OBJECTS`
- **Type:** `objectgroup`
- **Objects:**
  - `wormhole_MARKER`: A rectangle-shaped object at position `(64, 64)` with zero width/height, likely used as a positional anchor or debug marker. No custom properties are defined.

This file is typically used to define empty or minimal-layout map regions where structure or gameplay assets are intended to be injected procedurally by higher-level worldgen tasks, but a baseline layout is needed for Tiled/WorldGen consistency.