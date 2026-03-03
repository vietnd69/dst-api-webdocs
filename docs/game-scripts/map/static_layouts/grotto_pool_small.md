---
id: grotto_pool_small
title: Grotto Pool Small
description: A static map layout definition representing a small grotto pool region, used to define placement and structure for in-game environmental features in the Grotto biome.
tags: [map, environment, static_layout]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: e6d7f206
system_scope: environment
---

# Grotto Pool Small

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static layout for a small grotto pool area in the game world. It is used as a reusable template when generating or placing grotto-style pool structures in the caves. The layout follows the Tiled map format and contains tile data and object placement definitions for rendering and gameplay integration. It does not implement any runtime logic itself but serves as a blueprint consumed by the world generation and level loading systems.

## Usage example
This file is not used directly in Lua code as a component; instead, it is loaded by the engine's level generation system. However, it may be referenced indirectly through static layout loading utilities such as `StaticLayout` systems. A typical usage pattern in worldgen might look like:

```lua
local layout = require("map/static_layouts/grotto_pool_small")
-- The engine reads layout properties (e.g., width, height, layers) to place the structure in the world
-- No direct Lua instantiation or component attachment is performed for this file
```

## Dependencies & tags
**Components used:** None. This file is a static data definition and does not instantiate or interact with game components directly.  
**Tags:** None identified.

## Properties
The file exports a table with top-level static layout metadata. There are no runtime variables or instance properties initialized in a component sense.

| Property      | Type    | Default Value | Description |
|---------------|---------|---------------|-------------|
| `version`     | string  | `"1.1"`       | Tiled format version used. |
| `luaversion`  | string  | `"5.1"`       | Lua version compatibility. |
| `orientation` | string  | `"orthogonal"`| Map orientation type. |
| `width`       | number  | `2`           | Layout grid width in tiles. |
| `height`      | number  | `2`           | Layout grid height in tiles. |
| `tilewidth`   | number  | `64`          | Width (in pixels) of each tile. |
| `tileheight`  | number  | `64`          | Height (in pixels) of each tile. |
| `properties`  | table   | `{}`          | Global layout properties (currently empty). |
| `tilesets`    | table   | (see source)  | Tileset definitions used for rendering background layers. |
| `layers`      | table   | (see source)  | Layer definitions, including background tiles (`BG_TILES`) and object placement (`FG_OBJECTS`). |

## Main functions
No functional methods are defined. This file is a pure data export returning static configuration for layout placement.

## Events & listeners
No event handling or listeners are present in this file.