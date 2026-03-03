---
id: one
title: One
description: Defines a static rectangular room layout for the Archive Hallway in Don't Starve Together, including tile data and object placements.
tags: [map, room, static, layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 56817158
system_scope: environment
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout (`one.lua`) for the Archive Hallway in Don't Starve Together. It specifies a 32×32 tile grid with 16×16 tile dimensions, using an orthogonal map orientation. The layout includes a background tile layer (`BG_TILES`) and a foreground object group (`FG_OBJECTS`) that contains placed objects such as walls, furniture, chandeliers, statues, and special areas (e.g., `creature_area`, `archive_security_waypoint`). This file is consumed by the world generation system to instantiate physical and functional room elements during map generation.

## Usage example
This file is not used directly by modders. It is loaded automatically by the game’s map generation system as part of the `archive_hallway` room template set. No manual instantiation or component attachment is required.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used for the data encoding. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | — | List of tileset definitions (contains one entry for `tiles.png`). |
| `layers` | table | — | Array of map layers: tile layer (`BG_TILES`) and object group (`FG_OBJECTS`). |
| `properties` | table | `{}` | Room-level custom properties (empty in this layout). |

## Main functions
Not applicable — this is a pure data-returning module that defines map layout metadata, not a component with functional methods.

## Events & listeners
Not applicable — no events are defined or emitted by this module.