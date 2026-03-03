---
id: long
title: Long
description: Maps the layout data for the "Armoury Two" room in the Caves, including static tile backgrounds and object placement for gameplay elements like spawners and lights.
tags: [room, map, static_layout, caves]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ac64937f
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout data for the `room_armoury_two` map room using the Tiled Map Editor format. It specifies a 32×32 tile grid with orthogonal orientation, a background tile layer (`BG_TILES`), and an object layer (`FG_OBJECTS`) containing gameplay-relevant entities like nightmare lights and spawners for chess pieces and nightmare rooks. It is used to procedurally place room content during world generation.

## Usage example
This file is not intended for direct instantiation by modders; it is consumed by the world generation system. The returned table conforms to Tiled JSON-style layout specifications.

```lua
-- Used internally by DST's map generation system (e.g., via `map/archive_worldgen.lua`)
-- Example of how the system loads this:
local layout = require("map/static_layouts/rooms/room_armoury_two/long")
-- layout.width = 32, layout.height = 32, etc.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled version used to export the map. |
| `luaversion` | string | `"5.1"` | Lua version expected for data parsing. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | See source | Tileset definitions, referencing external image assets. |
| `layers` | table | See source | Array of layer objects (`BG_TILES`, `FG_OBJECTS`). |

## Main functions
None identified — this is a data-only module returning static configuration.

## Events & listeners
None identified — this module does not participate in event handling.