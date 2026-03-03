---
id: three
title: Three
description: A static map layout definition for a residential room in the caves, containing tile data and object placements.
tags: [map, room, static]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: c1212f4d
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout named `three`, used for generating residential-style rooms in the game's cave world. It specifies tiling data for background layers (`BG_TILES`) and object placements (`FG_OBJECTS`) using Tiled map format metadata. It does not define a runtime component or entity — it is a data file consumed by the world generation system to instantiate room content.

## Usage example
This file is not instantiated directly in gameplay code. Instead, it is referenced by room generation logic, for example:
```lua
-- Internal usage by map/task system; not used by modders directly
local room = require("map/static_layouts/rooms/room_residential_two/three")
-- The table returned contains map metadata used by the room spawner.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version. |
| `luaversion` | string | `"5.1"` | Lua version target for map encoding. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of a single tile in pixels. |
| `tileheight` | number | `16` | Height of a single tile in pixels. |
| `tilesets` | table | — | Array of tileset definitions (used for rendering background tiles). |
| `layers` | table | — | Array of layers: one tile layer (`BG_TILES`) and one object group (`FG_OBJECTS`). |
| `properties` | table | `{}` | Global room properties (currently empty). |

## Main functions
Not applicable.

## Events & listeners
Not applicable.