---
id: cave_art_test_start
title: Cave Art Test Start
description: Static layout definition file for a cave test area containing spawn points, objects, and background tile data.
tags: [map, layout, static, cave, test]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: d34a6a36
system_scope: world
---
# Cave Art Test Start

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static layout for a cave test area in Don't Starve Together. It is a Tiled map format JSON/Lua data structure (version 1.1, orthogonal orientation) describing a 64x64 tile grid, including background tile layer data, object group placements (e.g., spawnpoints, chests, research labs), and metadata such as tileset references. Static layouts like this are typically used during development or testing to define known configurations of game elements for specific scenarios or debug areas.

The layout does not implement game logic directly. Instead, it serves as a data payload that the engine consumes to instantiate world entities (e.g., spawns, research labs, cookpots) in predetermined positions. This file is self-contained and has no external dependencies beyond the core engine's static layout processing system.

## Usage example
Static layout files are loaded by the game's map system at runtime. While modders typically do not instantiate them manually, here is an illustrative example of how such a layout might be referenced in worldgen or a level setup:

```lua
-- Pseudocode example of referencing a static layout
local layout = require "map/static_layouts/cave_art_test_start"
local worldentity = WorldEntity()
worldentity:LoadStaticLayout(layout)
-- The engine will parse the layout's objectgroup and tilelayer data to spawn entities
```

In practice, the engine calls internal functions to read this table, interpret `spawnpoint`, `cave_entrance`, `treasurechest`, `researchlab2`, and `cookpot` entries in `FG_OBJECTS`, and place corresponding prefabs in the world.

## Dependencies & tags
**Components used:** None identified. This file is a pure data structure and does not directly access or instantiate components via `inst.components.X`.

**Tags:** None identified. The layout file itself does not add, remove, or check entity tags.

## Properties
The table returned by this file contains all the top-level fields defined in the static layout. The properties are:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version. |
| `luaversion` | string | `"5.1"` | Lua version used for serialization. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `64` | Map width in tiles. |
| `height` | number | `64` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Map-level properties (empty here). |
| `tilesets` | table | (see source) | Array of tilesets used by the map, including references to image assets. |
| `layers` | table | (see source) | Array of map layers: background tile layers and object groups. |

The `layers` array contains two entries:
1. `BG_TILES`: A tile layer (`type = "tilelayer"`) holding tile IDs in row-major order.
2. `FG_OBJECTS`: An object group (`type = "objectgroup"`) listing entity placements.

## Main functions
No functions are defined in this file. It is a data-only module returning a static table. No methods or executable logic are present.

## Events & listeners
No events or event listeners are defined in this component. As a static data file, it does not participate in the entity event system.

