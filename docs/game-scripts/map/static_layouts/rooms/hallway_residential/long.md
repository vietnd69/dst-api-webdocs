---
id: long
title: Long
description: Defines the Tiled map data for a long residential hallway room layout in DST's world generation system.
tags: [map, worldgen, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 9f5704d7
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file contains the static map layout definition for a long residential hallway room in DST's world generation system. It uses Tiled JSON-compatible format (stored as Lua table) to specify tile positions for background tiles (`BG_TILES`) and references a tileset image for rendering. It is not an Entity Component System (ECS) component, but rather a static asset used by the world generation system to construct rooms.

## Usage example
This file is not instantiated or used directly in mod code. It is loaded by the worldgen system via `static_layouts.lua` and referenced in room/task definitions.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version compatibility |
| `orientation` | string | `"orthogonal"` | Map projection type |
| `width` | number | `32` | Room width in tiles |
| `height` | number | `32` | Room height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets` | table | see source | Tileset configuration referencing `tiles.png` |
| `layers` | table | see source | Layer definitions (`BG_TILES` and `FG_OBJECTS`) |

## Main functions
Not applicable — this file returns static map data only.

## Events & listeners
Not applicable — this file contains no event logic or listeners.