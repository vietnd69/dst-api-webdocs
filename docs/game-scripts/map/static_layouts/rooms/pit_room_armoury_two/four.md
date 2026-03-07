---
id: four
title: Four
description: Represents a static map layout file for a specific room (pit_room_armoury_two) using Tiled map format, containing tile layers and object groups for level geometry and entity spawners.
tags: [map, static_layout, room]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 789c0875
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static layout definition for a dungeon room (`pit_room_armoury_two`), serialized in Tiled map format. It defines the room's geometry via a tile layer (`BG_TILES`) and placed in-world entities (spawners) via an object group (`FG_OBJECTS`). These layouts are loaded by the world generation system to construct stable room layouts for procedural cave environments.

## Usage example
This file is not instantiated as a component; it is consumed by the world generation system during level setup. Typical usage occurs internally in DST's mapgen and room systems, for example:

```lua
-- Not a direct usage example; this file is loaded as data, not as a component.
-- It defines layout metadata used by scripts in map/tasksets/ and map/levels/.
-- Example reference in worldgen:
-- local room_data = require("map/static_layouts/rooms/pit_room_armoury_two/four")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export version |
| `luaversion` | string | `"5.1"` | Lua version targeted by data encoding |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets` | table | `...` | Contains one tileset definition with image path and dimensions |
| `layers` | table | `...` | Contains layer definitions (`BG_TILES`, `FG_OBJECTS`) |

## Main functions
Not applicable — this file is a data table, not a component with methods.

## Events & listeners
Not applicable — this file is static data and does not interact with the event system.