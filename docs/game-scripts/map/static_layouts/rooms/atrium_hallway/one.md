---
id: one
title: One
description: Defines the static layout data for an atrium hallway room in the game world using Tiled map format.
tags: [map, layout, room, static]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: fb0b3c41
system_scope: environment
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`one.lua` is a static room layout definition used by the DST world generation system to place an atrium hallway in the game world. It specifies tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) containing placement positions for interactive and decorative entities like lights, furniture, fences, and loot chests. This file does not implement a functional ECS component; it serves as declarative data consumed by map generation systems to instantiate prefabs during world construction.

## Usage example
This file is not instantiated directly by modders. Instead, it is referenced by the world generation task system and used to build room instances during level layout. A typical usage pattern inside the game engine might be:
```lua
-- Internally used by the map generator — NOT for direct modder use
local room_data = require("map/static_layouts/rooms/atrium_hallway/one")
WorldBuilder:AddStaticRoom(room_data, position)
```
Modders should modify or extend room layouts only through worldgen overrides or custom scenarios, not by altering core source files.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map file format version. |
| `luaversion` | string | `"5.1"` | Lua version used for embedded scripts (none present). |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` / `height` | number | `32` | Map dimensions in tiles. |
| `tilewidth` / `tileheight` | number | `16` | Tile size in pixels. |
| `tilesets` | table | (see source) | Array of tileset definitions. |
| `layers` | table | (see source) | Array of tile layers and object groups. |

## Main functions
Not applicable — This file returns a plain data table with no executable functions.

## Events & listeners
Not applicable — No event handling is present in this file.