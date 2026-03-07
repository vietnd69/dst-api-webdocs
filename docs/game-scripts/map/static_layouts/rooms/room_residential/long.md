---
id: long
title: Long
description: Defines a static residential room layout for cave map generation, including tile placement and object spawners.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 857200e1
system_scope: environment
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout named `long` used in the game's cave world generation system. It specifies the visual and structural layout of a residential-style cave room, including background tile placement and foreground object spawners. It is not a component in the ECS sense but a data structure (a Lua table) describing a Tiled map format used by DST's procedural generation system.

## Usage example
This file is used internally by DST's world generation system. It is not instantiated directly in mod code. The layout is applied when a task set includes this room type in a generated world.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility target. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | *(see source)* | Array of tileset definitions (e.g., path to tile texture). |
| `layers` | table | *(see source)* | Array of layer objects: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
Not applicable. This is a static data definition, not a behavior-driven component.

## Events & listeners
Not applicable. This file contains no runtime logic or event handling.