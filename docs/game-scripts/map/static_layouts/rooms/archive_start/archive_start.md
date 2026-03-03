---
id: archive_start
title: Archive Start
description: Defines the tilemap layout and static objects for the Archive Start room in DST's world generation system.
tags: [map, room, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 3f1c1524
system_scope: environment
---

# Archive Start

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout of the Archive Start room using a Tiled-compatible tilemap structure. It specifies background tiles, object placements, and entity spawn points for the Archive Start area. The room is part of the game's static layout system used during world generation to populate cave/ruin areas with pre-defined assets.

## Usage example
This is a data-only file used internally by the map loader. It is not instantiated as a component and is referenced indirectly via world generation systems (e.g., `map/tasksets/caves.lua` or `map/levels/caves.lua`). Typical usage involves including the room in a taskset and assigning it to a map level.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used for encoding. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (unused). |
| `tilesets` | table | — | Tileset definitions including image path and tile size. |
| `layers` | table | — | Array of map layers: `BG_TILES` (tile data) and `FG_OBJECTS` (object placements). |

## Main functions
Not applicable — this file exports static configuration data and does not define runtime functions or methods.

## Events & listeners
Not applicable — no event listeners or events are defined.