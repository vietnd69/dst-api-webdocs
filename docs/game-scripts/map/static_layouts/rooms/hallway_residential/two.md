---
id: two
title: Two
description: Defines a static tilemap layout for the residential hallway room in DST's world generation system.
tags: [world, map, room]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 57fc6e96
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static tilemap layout (`two.lua`) used for generating a residential hallway room in the game world. It is part of DST's map generation system and specifies background tile placement via a hardcoded grid. The layout is 32×32 tiles, uses orthogonal orientation, and references a shared tileset image (`tiles.png`) with 64×64 tiles. It contains no object layer data (`FG_OBJECTS` is present but empty) and does not define any game logic, components, or behavioral code.

## Usage example
Not applicable. This is a data file for world generation and is loaded by the engine’s room placement system—not directly instantiated or used in mod Lua scripts.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Map format version (Tiled JSON standard). |
| `luaversion` | string | `"5.1"` | Lua version compatibility marker. |
| `orientation` | string | `"orthogonal"` | Tilemap projection type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Logical tile width (pixels per tile in DST coordinate space). |
| `tileheight` | number | `16` | Logical tile height. |
| `properties` | table | `{}` | Room-level properties (unused in this file). |
| `tilesets` | table | — | Array of tileset definitions; references shared `tiles.png`. |
| `layers` | table | — | Array of layers (`BG_TILES` with data, empty `FG_OBJECTS`). |

## Main functions
Not applicable.

## Events & listeners
Not applicable.