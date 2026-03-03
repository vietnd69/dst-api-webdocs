---
id: chessy_2
title: Chessy 2
description: Static tile-based map layout for a dungeon room, defining background tile patterns and object placements (e.g., statues, gears, bishops) using Tiled map format metadata.
tags: [map, static_layout, room]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 82b4a995
system_scope: world
---

# Chessy 2

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout for a room in Don't Starve Together, encoded in Tiled JSON-compatible format (Lua table structure). It specifies background tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) containing static entities such as bishops, gears, and a Maxwell statue. Unlike standard ECS components, this is a *data-only* file used during world generation to instantiate static layouts — it does not implement logic or behavior. It contributes static environmental context to rooms and is loaded by the world generation system to populate map rooms with predefined geometry and markers.

## Usage example
This file is not instantiated directly in mod code. Instead, it is referenced by the world generation task system (e.g., via `tasksets/caves.lua`) as a static layout resource. It is loaded by the engine’s Tiled loader and used to populate room instances. Example integration:
```lua
-- Not for direct use; referenced internally during room generation
-- In worldgen(tasksets/caves.lua): 
-- Add "chessy_2" to a taskset's layouts list to place this room configuration
```

## Dependencies & tags
**Components used:** None — this file is purely data; no component logic or behavior is defined.  
**Tags:** None — no tags are added or modified by this file.

## Properties
The file is a top-level table with fixed structure derived from Tiled map format. No modifiable instance properties exist.

| Property       | Type    | Default Value | Description |
|----------------|---------|---------------|-------------|
| `version`      | string  | `"1.1"`       | Tiled format version |
| `luaversion`   | string  | `"5.1"`       | Lua version target |
| `orientation`  | string  | `"orthogonal"`| Map orientation type |
| `width`        | integer | `16`          | Room width in tiles |
| `height`       | integer | `16`          | Room height in tiles |
| `tilewidth`    | integer | `16`          | Width of each tile in pixels |
| `tileheight`   | integer | `16`          | Height of each tile in pixels |
| `properties`   | table   | `{}`          | Optional room-level properties (empty here) |
| `tilesets`     | table   | —             | Tileset definitions; contains one entry for `tiles.png` |
| `layers`       | table   | —             | Array of map layers: background tile layer (`BG_TILES`) and object group (`FG_OBJECTS`) |

## Main functions
This file is a static data definition and does not contain or expose functional methods.

## Events & listeners
This file has no event listeners or events — it is not an ECS component and does not participate in runtime event flows.