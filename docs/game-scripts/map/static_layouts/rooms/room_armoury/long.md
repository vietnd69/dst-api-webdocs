---
id: long
title: Long
description: Defines the static layout data for the Armory room's long variant using Tiled map format for DST world generation.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e892bcf8
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the layout configuration for the "long" variant of the Armory room in Don't Starve Together. It is used by the world generation system to place static architectural elements and spawn points within the room. The layout is expressed in Tiled JSON-compatible format and includes background tile layers and an object group containing entity spawn markers. It is consumed by the game's map and room placement systems—not a runtime component attached to entities.

## Usage example
This file is not instantiated as a component. Instead, it is referenced by the world generation task system (e.g., via `map/tasksets/caves.lua` or similar) to populate a room instance during world generation:

```lua
-- Inside map generation logic (e.g., in room loaders or prefabs)
local layout = require("map/static_layouts/rooms/room_armoury/long")
-- The layout data is used to render tiles and instantiate spawn prefabs
-- This file itself is not added to an entity; it is data, not a component.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file is a pure data definition (a Lua table return value) and not a component class. It exposes the following top-level map metadata properties (per Tiled format):
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used for encoding. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | See source | Tileset definitions (one tileset: "tiles"). |
| `layers` | table | See source | Layer definitions: `"BG_TILES"` (tile layer) and `"FG_OBJECTS"` (object group). |

## Main functions
Not applicable — this file does not define a component and contains no executable functions or methods.

## Events & listeners
Not applicable.