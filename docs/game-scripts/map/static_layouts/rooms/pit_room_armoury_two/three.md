---
id: three
title: Three
description: Represents a static room layout (pit_room_armoury_two) for world generation, defining tilemap data and spawn points for dungeon objects.
tags: [map, room, procedural]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ee4df4db
system_scope: environment
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout used in the game’s world generation system for Don't Starve Together. Specifically, it corresponds to the `pit_room_armoury_two` room type. It encodes a 32×32 tile grid (`BG_TILES` layer) and an object layer (`FG_OBJECTS`) containing entity spawners for key dungeon elements, such as statues and nightmare knight/bishop variants. The data is in Tiled Map Editor format and is consumed by the game’s map generation system to place prefabs and tiles at runtime.

## Usage example
This file is not a component and is not instantiated directly by modders. Instead, it is referenced internally by the world generation system as part of the `map/static_layouts/` directory. It is loaded as a Lua table when a room of this type is selected during world generation.

```lua
-- Not applicable: this is static data, not a component
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version used |
| `orientation` | string | `"orthogonal"` | Tile orientation type |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets` | table | see source | Contains tileset definition (one tileset, 64×64 px tiles) |
| `layers` | table | see source | Contains two layers: `BG_TILES` (tile data) and `FG_OBJECTS` (object spawners) |

## Main functions
Not applicable — this file returns static data and defines no executable functions.

## Events & listeners
Not applicable — this file provides no runtime logic, event handling, or listeners.