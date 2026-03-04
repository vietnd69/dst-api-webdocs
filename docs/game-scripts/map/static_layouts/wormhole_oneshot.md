---
id: wormhole_oneshot
title: Wormhole Oneshot
description: A static map layout for the wormhole one-shot event, defining tile placement and object regions.
tags: [map, layout, event, static]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 883c81b2
system_scope: world
---

# Wormhole Oneshot

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`wormhole_oneshot.lua` defines a static 16x16 tile layout used exclusively for the wormhole one-shot event in DST. It specifies background tile data, object regions, and coordinate mappings for in-game structures such as the wormhole entrance and bone piles. As a data-only module, it is not an ECS component but a JSON-like table returned during world generation or event setup to configure map room or event scene geometry.

## Usage example
This file is not instantiated as an entity or component. It is typically loaded by the worldgen system or event controller during map initialization:

```lua
-- Example usage in worldgen or event context (pseudocode)
local layout = require "map/static_layouts/wormhole_oneshot"
-- layout.width == 16
-- layout.height == 16
-- layout.layers[2].objects contains FG_OBJECTS definitions
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua interpreter version assumed. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `16` | Map width in tiles. |
| `height` | number | `16` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Map-level custom properties. |
| `tilesets` | table | see source | Array of tileset definitions (1 entry). |
| `layers` | table | see source | Array of map layers (2 entries: `BG_TILES`, `FG_OBJECTS`). |

## Main functions
Not applicable — this module exports a static configuration table and contains no runtime functions.

## Events & listeners
Not applicable — no event handling or listeners are present.

## Layer details
### `BG_TILES` (tilelayer)
- Name: `BG_TILES`
- Dimensions: 16×16 tiles
- Encoding: Lua array
- Data: Grid of tile IDs, all `0` except for tile `8` placed at coordinates `(4,7)`, `(8,7)`, `(4,11)`, and `(8,11)` (0-indexed: row `7`, column `7`; row `7`, column `11`; row `11`, column `7`; row `11`, column `11`).

### `FG_OBJECTS` (objectgroup)
- Name: `FG_OBJECTS`
- Contains 5 rectangular object regions:
  1. `wormhole_limited_1`: Positioned at `(128,128)` (pixel coords = `8*16, 8*16`).
  2. `bones_area`: Rectangle `(32,32,80,112)`
  3. `bones_area`: Rectangle `(144,112,80,112)`
  4. `bones_area`: Rectangle `(112,32,112,80)`
  5. `bones_area`: Rectangle `(32,144,112,80)`

These objects are likely used by event systems to spawn entities (e.g., bone piles) or define boundaries/interaction zones during the one-shot event.