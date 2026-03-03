---
id: three
title: Three
description: Static layout data structure for a 32x32 tile-based room using Tiled map format.
tags: [map, room, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 82d8ec2f
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static layout for a room in DST's world generation system. It is not a component but a data-only table returning Tiled-compatible map information (version `"1.1"`, `"orthogonal"` orientation, 32x32 grid). It specifies background tile layer data (`BG_TILES`) using integer tile IDs, an object group (`FG_OBJECTS`) containing one `pigtorch` placed at screen coordinates (252, 221), and basic map geometry (tile size `16x16`, tileset reference). It is used by worldgen/room placement systems to instantiate room prefabs.

## Usage example
This file is not meant to be used directly as a component. Instead, it is loaded and processed by world generation systems (e.g., via `static_layouts.lua` loaders) to build room instances. A typical usage pattern in a room generator script would be:

```lua
local room_data = require "map/static_layouts/rooms/room/three"
-- room_data is a plain table used to construct the room entity
inst:AddTag("room")
-- Further configuration using room_data.layers, room_data.objectgroup, etc.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version expected for parsing. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Room-level custom properties (empty here). |
| `tilesets` | table | `{{...}}` | Array of tileset definitions (contains one entry referencing `tiles.png`). |
| `layers` | table | `{{...}, {...}}` | Layer collection: `BG_TILES` (tile layer), `FG_OBJECTS` (object group). |

## Main functions
Not applicable.

## Events & listeners
Not applicable.