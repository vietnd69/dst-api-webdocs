---
id: long
title: Long
description: Static map layout definition for the Hallway Armoury's long corridor in Don't Starve Together.
tags: [map, layout, static]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 73a6a3a3
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static Tiled-based map layout used for the long corridor variant of the Hallway Armoury room in Don't Starve Together. It specifies the grid dimensions, tile layer data, and object placement (including spawners) required to render the room in the game world. As a static layout, it is loaded directly during world generation to place pre-defined room geometry.

## Usage example
```lua
-- This file is not instantiated as a component or entity. It is consumed by the world generation system.
-- The game engine loads it via static layout loading code, typically referenced in tasksets or room definitions.
-- No direct modder usage is required or expected.
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
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Map-level custom properties (empty here). |
| `tilesets` | table | — | Array of tileset definitions including image path and tile metadata. |
| `layers` | table | — | Array of layers: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
This file is a pure data return table; it does not define any executable functions or methods.

## Events & listeners
This file does not define event listeners or push any events.

## Layers
### `BG_TILES`
- **Type:** tilelayer
- **Size:** 32×32 tiles
- **Data:** A flat array of 1024 tile IDs (indexed row-wise), where non-zero values (e.g., `21`, `25`) represent tile placements. Zeros indicate empty space.
- **Usage:** Provides the background/foreground visual floor pattern.

### `FG_OBJECTS`
- **Type:** objectgroup
- **Objects:**
  - **Name:** `knight_nightmare_spawner`  
    - **Shape:** rectangle  
    - **Position:** (x=192, y=160)  
    - **Dimensions:** 0×0  
  - **Purpose:** Indicates a spawner point for the Knight Nightmare entity during room deployment in the Nightmarish scenario. The coordinates are in pixels (64-pixel grid: 192/64 = 3, 160/64 = 2.5 → tile-based coordinates (3, 2.5)).

## Tileset
- **Name:** `tiles`
- **Image path:** `../../../../../../tools/tiled/dont_starve/tiles.png`
- **Dimensions:** 512×384 pixels
- **Tile size:** 64×64 pixels
- **GID:** First tile has global ID 1.

## Notes for Modders
- This is a *static layout definition* and not a script component—do not attempt to attach it as a component or instantiate it like a prefab.
- To customize or create similar layouts, use the Tiled map editor with the Don’t Starve Together tileset and export as Lua.
- Object names (e.g., `knight_nightmare_spawner`) are interpreted by the world generation engine to place specific entities at runtime. Ensure any custom object types are handled by appropriate spawner logic elsewhere in the codebase.