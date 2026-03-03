---
id: four
title: Four
description: Defines the Tiled map layout for the archive hallway two four room, specifying tile layers and object placements for indoor ruins environment.
tags: [map, room, layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d106b6a9
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`four` is a static room layout definition for the archive hallway corridor in DST's underground ruins. It specifies a 32x32 tile grid with orthogonal orientation, containing a background tile layer (`BG_TILES`) and a foreground object layer (`FG_OBJECTS`) that places props such as pillars, chandeliers, statues, vases, walls, and creature areas. This file is used by the world generation system to construct consistent indoor architecture in the Ruins region.

## Usage example
This component is not used as an entity component; it is a standalone map layout data structure returned by a Lua module. It is consumed by the level and room generation systems (e.g., via `map/rooms/cave/archivehallway_two.lua` or similar) when spawning the room in the world. No direct modder interaction is expected.

```lua
-- Not directly instantiated or used by modders.
-- The layout is referenced internally as part of the room/level generation pipeline.
local layout = require("map/static_layouts/rooms/archive_hallway_two/four")
-- layout.width, layout.height, layout.layers, etc., are used by generation scripts
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua interpreter version used. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Room-level custom properties (empty in this layout). |
| `tilesets` | table | See source | Tileset definitions (contains one tileset `tiles`). |
| `layers` | table | See source | Array of layers (`BG_TILES` tile layer, `FG_OBJECTS` object layer). |

## Main functions
None identified — this is a pure data structure with no executable logic.

## Events & listeners
Not applicable.