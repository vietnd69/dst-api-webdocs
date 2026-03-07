---
id: one
title: One
description: Defines a static hallway room layout for world generation using Tiled map format.
tags: [map, room, procedural_generation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 7ce712c8
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout for the game's world generation system. It is not an ECS component but a data structure conforming to the Tiled map format, used to represent the visual and spatial configuration of a hallway room in the game's procedurally generated environments. The layout consists of background tile data and an object group for placing interactive entities (e.g., lights) within the room.

## Usage example
This file is loaded and processed by the world generation system (e.g., `map/archive_worldgen.lua`), which interprets the tile layer and object group to instantiate tiles and prefabs in the game world. Modders typically reference it indirectly when building custom static layouts, but do not directly instantiate it.

```lua
-- Not directly used by mod code; consumed by the worldgen system.
-- Example usage in worldgen context:
-- local hallway_layout = require("map/static_layouts/rooms/hallway/one")
-- -- The generator uses hallway_layout.layers to populate the map
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled version used to export this layout. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Map-level custom properties (unused here). |
| `tilesets` | table | — | Tileset definitions (reference to tile image). |
| `layers` | table | — | Array of layers: tile layer (`BG_TILES`) and object group (`FG_OBJECTS`). |

## Main functions
Not applicable.

## Events & listeners
Not applicable.