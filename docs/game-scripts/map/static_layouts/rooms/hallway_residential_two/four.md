---
id: four
title: Four
description: A static layout room definition for residential-style hallways in the Caves, using tile layer data to define background patterns.
tags: [map, room, tile, static]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 22ca0cef
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static layout for a room variant named `four` within the `hallway_residential_two` category, used in map generation for the Caves biome. It is a Tiled Map Format (TMX)–style data structure encoded in Lua, containing configuration for tile layers and object groups. It does not implement logic beyond descriptive room data and is consumed by the world generation system to place architectural features in procedurally generated caves.

This component has no ECS-style behavior: it is a data file only, returned directly as a Lua table by the map loader. It is not a component class and does not define methods, properties, or event handlers.

## Usage example
Static layouts like this one are not instantiated directly by modders. Instead, they are referenced indirectly through tasksets or room definitions in map generation. For example, a map task might include this layout in its list of allowed room variants:

```lua
-- Conceptual usage (this file itself is *not* added as a component)
room_def = {
    name = "hallway_residential_two_four",
    layout = require("map/static_layouts/rooms/hallway_residential_two/four"),
    ...
}
```

Modders should modify the level or room definitions in `map/tasksets/` or `map/rooms/` to use custom static layouts.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | TMX format version |
| `luaversion` | string | `"5.1"` | Lua version compatibility indicator |
| `orientation` | string | `"orthogonal"` | Map rendering orientation |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Custom room properties (empty in this case) |
| `tilesets` | table | *(see structure)* | Tileset definitions for decoding tile IDs |
| `layers` | table | *(see structure)* | Array of layers: tile layers and object groups |

## Main functions
Not applicable — this is a pure data file with no executable functions.

## Events & listeners
Not applicable — this file defines no event logic or listeners.