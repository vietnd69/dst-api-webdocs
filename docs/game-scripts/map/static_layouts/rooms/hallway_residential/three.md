---
id: three
title: Three
description: Static layout data for a residential hallway room used in world generation.
tags: [world, room, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 67f9ba21
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout data for a residential hallway room (`hallway_residential/three.lua`) in DST's world generation system. It is a Tiled map format export used to represent the visual and spatial configuration of a specific room variant. The layout includes background tile layers and object groups but contains no game logic components or entities — it is purely a data blueprint for constructing parts of the world.

## Usage example
This file is not intended for direct runtime usage. It is consumed by the world generation engine when building rooms from `tasksets` or `static_layouts` definitions.

Example of how it integrates with the engine (non-modder-facing pseudo-code):
```lua
-- Inside the worldgen system:
local room_data = require("map/static_layouts/rooms/hallway_residential/three")
worldbuilder:AddStaticLayout(room_data, x, y, rotation)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target for encoded data. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global room properties (currently empty). |
| `tilesets` | table | *see source* | Tileset definitions (references external image). |
| `layers` | table | *see source* | Layer definitions (contains background tile data and empty object group). |

## Main functions
None identified — this file is a data-only module returning static configuration.

## Events & listeners
Not applicable.

## Data structure notes
The layout consists of a single tile layer (`BG_TILES`) of size 32×32 tiles (16×16 px per tile), where non-zero values indicate tile IDs placed in the background. The current tile data shows a repeating pattern of tiles `22` and `29` in vertical columns — likely representing structural elements (e.g., wall segments, flooring, or decor) in a hallway. An `FG_OBJECTS` object group is present but empty.

This layout is intended to be used with DST's `WorldBuilder` or `RoomBuilder` systems during map generation to place pre-designed room geometry.