---
id: two
title: Two
description: A static map layout definition for the "armoury" room in DST, specifying background tile patterns and spawn positions for special in-game entities.
tags: [map, room, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 137d823d
system_scope: environment
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static tile-based room layout named `two`, used as part of the "armoury" room set in the game's world generation system. It declares the background tile configuration (32x32 grid, 16x16 tiles), and an object group containing named spawn points for dynamic entities such as `chessjunk_spawner`, `knight_nightmare_spawner`, and `ruins_statue_head_spawner`. It is not a runtime component but rather a serialized map definition consumed by the worldgen system to instantiate room layouts.

## Usage example
This file is not intended for direct component usage in mod code. Instead, it is automatically loaded by the game during world generation to populate static geometry and spawn triggers within specific rooms. Example integration is internal to DST's map/room generation system.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target (for internal compatibility). |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width`, `height` | number | `32` | Grid dimensions (in tiles). |
| `tilewidth`, `tileheight` | number | `16` | Size of each tile in pixels. |
| `tilesets[1]` | table | — | Tileset definition (path, image size, etc.). |
| `layers[1]` | table | — | Background tile layer (`BG_TILES`) with encoded tile IDs. |
| `layers[2]` | table | — | Object layer (`FG_OBJECTS`) with spawn points for entities. |

## Main functions
Not applicable — this is a pure data structure, not a runtime component with methods.

## Events & listeners
None identified — no event interaction occurs in this static layout definition file.