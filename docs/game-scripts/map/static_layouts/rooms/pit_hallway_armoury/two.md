---
id: two
title: Two
description: Defines the static layout data for the Pit Hallway Armoury room variant 'two' in DST's world generation system.
tags: [worldgen, map, room]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 38a5b583
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static room layout definition used by DST's world generation system. It specifies the tilemap and object placement for a specific variant (named `"two"`) of the Pit Hallway Armoury room type. It is loaded as raw JSON-like table data by the map generator and does not function as an entity component — it contains no `Class` constructor, components, or event logic.

## Usage example
This file is not directly instantiated as a component or entity. Instead, it is referenced internally by the world generation system via room templates:

```lua
-- Not applicable for modder use; used internally by DST's map generator
-- Example of internal usage pattern (pseudo-code):
local room = require("map.static_layouts.rooms.pit_hallway_armoury.two")
generator:AddRoomLayout(room)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua engine version targeted. |
| `orientation` | string | `"orthogonal"` | Map tile orientation type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of a single tile in pixels. |
| `tileheight` | number | `16` | Height of a single tile in pixels. |
| `tilesets[1].name` | string | `"tiles"` | Name of the tileset used. |
| `tilesets[1].firstgid` | number | `1` | First global tile ID in the set. |
| `layers[1].name` | string | `"BG_TILES"` | Name of the background tile layer. |
| `layers[1].data` | table | 1024-entry array | Tile IDs for the layer (row-major, row by row). |
| `layers[2].name` | string | `"FG_OBJECTS"` | Name of the foreground object layer. |
| `layers[2].objects[1].type` | string | `"knight_nightmare_spawner"` | Type of object placed (used to spawn entities). |
| `layers[2].objects[1].x` | number | `224` | X-position in pixels (relative to room origin). |
| `layers[2].objects[1].y` | number | `224` | Y-position in pixels (relative to room origin). |

## Main functions
Not applicable — this file returns static layout data only.

## Events & listeners
Not applicable — no event handling logic is present.