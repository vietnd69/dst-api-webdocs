---
id: four
title: Four
description: A static map layout definition for a room in the Don't Starve Together world generation system, containing tile data for the background layer.
tags: [world, map, room, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 83b7c55d
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout named `four` used by the world generation system. It specifies a 32x32 grid map (in tiles) with 16x16 pixel tile dimensions, and contains only a background tile layer (`BG_TILES`) and an empty object layer (`FG_OBJECTS`). The layout uses tile ID `27` and `3` in specific patterns to render floor/wall visuals in the forest biome's open rooms. As a static layout, it is loaded once during world generation and does not change at runtime.

## Usage example
Static room layouts like this one are not instantiated directly in mod code. They are referenced by the world generation system when assigning room templates to procedural map structures. For documentation purposes, here is how such a layout might be processed internally:

```lua
-- This is illustrative of how the engine consumes the layout file
local room_template = require "map.static_layouts.rooms.room_open.four"
-- room_template.layers[1].data contains the flattened tile array for BG_TILES
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua interpreter version. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Tile width in pixels. |
| `tileheight` | number | `16` | Tile height in pixels. |
| `properties` | table | `{}` | Map-level properties (empty in this layout). |
| `tilesets` | table | (see source) | Tileset definitions, referencing external image assets. |
| `layers` | table | (see source) | Layer definitions: `BG_TILES` and `FG_OBJECTS`. |

## Main functions
None identified. This file returns a static data table and does not define any functions.

## Events & listeners
None identified. This file does not interact with the event system.