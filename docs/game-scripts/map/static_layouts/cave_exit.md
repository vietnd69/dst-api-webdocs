---
id: cave_exit
title: Cave Exit
description: This component defines a static map layout for the cave exit region, specifying tile data, object placement (such as cave lights, spawn points, and flora), and structural metadata for world generation.
tags: [map, worldgen, static_layout, environment]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 2642d189
system_scope: world
---

# Cave Exit

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file (`cave_exit.lua`) is a static layout definition used by Don't Starve Together's world generation system. It describes the tile and object configuration for the cave exit region using Tiled Map Editor format (JSON-compatible Lua table structure). It is not an ECS component — rather, it is a data asset consumed by the map generation pipeline to construct physical and environmental features in the Caves biome. The layout includes background tile data, foreground object placement (e.g., spawn points, lighting, flora), and metadata such as tile dimensions and layer ordering.

## Usage example
Static layouts like this are not instantiated manually by modders. They are referenced in worldgen tasksets (e.g., in `map/tasksets/caves.lua`) and loaded automatically during world generation.

## Dependencies & tags
**Components used:** None (this is a pure data structure).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled map format version. |
| `luaversion` | `string` | `"5.1"` | Lua compatibility version. |
| `orientation` | `string` | `"orthogonal"` | Map rendering orientation. |
| `width` | `integer` | `24` | Map width in tiles. |
| `height` | `integer` | `24` | Map height in tiles. |
| `tilewidth` | `integer` | `16` | Width of each tile in pixels. |
| `tileheight` | `integer` | `16` | Height of each tile in pixels. |
| `properties` | `table` | `{}` | Global map properties (currently empty). |
| `tilesets` | `array of tables` | See code | Array of tileset definitions (contains 1 tileset named `"tiles"`). |
| `layers` | `array of tables` | See code | Array of layer definitions: `"BG_TILES"` (tile layer) and `"FG_OBJECTS"` (object group). |

### Tileset details (`tilesets[1]`)
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | `string` | `"tiles"` | Tileset name. |
| `firstgid` | `integer` | `1` | First global tile ID. |
| `tilewidth`/`tileheight` | `integer` | `64` | Tile dimensions in the tileset image. |
| `image` | `string` | `"../../../../tools/tiled/dont_starve/tiles.png"` | Relative path to tileset image. |

### Layer details
- **Layer `"BG_TILES"` (tilelayer)**  
  - `data`: Flat array of 576 (`24x24`) integer tile IDs (mostly `0`, with some `14`).
- **Layer `"FG_OBJECTS"` (objectgroup)**  
  - Contains 20 named objects with `type`, position (`x`, `y`), and optional `shape`/`properties`. Notable object types include:
    - `"spawnpoint_multiplayer"` (player spawn point)
    - `"cave_exit"` (exit marker)
    - `"cavelight"` / `"cavelight_small"` (lighting fixtures)
    - `"evergreen"` / `"grass"` / `"sapling"` (decorative flora)

## Main functions
This file returns a table and does not define any functions or logic. It is consumed by the map generation system to instantiate in-game geometry and objects.

## Events & listeners
No events or listeners are defined — this is a static data definition.