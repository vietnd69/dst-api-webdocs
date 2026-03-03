---
id: bargain_start
title: Bargain Start
description: Defines the initial world layout for the Bargain mode, specifying tile layers and object placements used to seed the forest world with starter resources.
tags: [world, map, spawn, resources]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: d51c601f
system_scope: world
---

# Bargain Start

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file is a static layout definition for the Bargain world generation mode in DST. It specifies the initial terrain layout and pre-placed objects (e.g., firepits, tents, trees, crops, and decor) that constitute the starting area for players. It is not a component in the ECS sense but rather a Tiled map export (JSON-like table) used by the worldgen system to instantiate the game world. The layout includes background tile layer data and foreground object placements, with no ECS component logic or runtime behavior.

## Usage example

This file is loaded by the world generation system via `worldgen.lua` or related task files and is not instantiated manually by modders. It is consumed as raw static data.

```lua
-- Example of how worldgen may consume such layouts (not to be used directly by modders)
local layout = require("map/static_layouts/bargain_start")
print("Layout size:", layout.width, "x", layout.height)  -- 32 x 32
print("Number of object layers:", #layout.layers)       -- 2 layers: tiles and objects
```

## Dependencies & tags
**Components used:** None — this is static data, not an ECS component.
**Tags:** None — this file does not manipulate entity tags or runtime systems.

## Properties
This is a static Lua table describing a Tiled map export, not an ECS component class.

The top-level table keys are:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version target |
| `orientation` | string | `"orthogonal"` | Tilemap orientation |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Map-level metadata (empty here) |
| `tilesets` | array | see source | Array of tileset definitions |
| `layers` | array | see source | Array of layers (`tilelayer` or `objectgroup`) |

### Tileset Properties

Each tileset entry contains:

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Tileset identifier (e.g., `"tiles"`) |
| `firstgid` | number | Global ID of first tile |
| `tilewidth`, `tileheight` | number | Tile dimensions |
| `image` | string | Path to tileset image |
| `imagewidth`, `imageheight` | number | Pixel dimensions of tileset image |

### Layer Types

Two layers are defined:

1. `BG_TILES` (type `"tilelayer"`):
   - Contains a flattened array of tile IDs (32x32 = 1024 entries).
   - Non-zero values correspond to tile IDs in the `"tiles"` tileset.
2. `FG_OBJECTS` (type `"objectgroup"`):
   - Contains a list of objects with `type`, `x`, `y`, `width`, `height`, and optional properties.
   - `type` maps to prefab names (e.g., `"tent"`, `"firepit"`, `"carrot_planted"`, `"evergreen_normal"`, `"berrybush"`, `"flower"`, `"grass"`, `"diviningrodstart"`, `"spawnpoint"`).
   - All objects have `shape = "rectangle"` and `width`/`height` of `0` (indicating point placement).

## Main functions

This file defines no functions — it is a data-only Lua module.

## Events & listeners

This file does not define or listen to any events — it is static configuration data used during world initialization.