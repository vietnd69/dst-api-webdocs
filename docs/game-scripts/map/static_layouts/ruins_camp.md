---
id: ruins_camp
title: Ruins Camp
description: Static layout definition for the Ruins Camp map room, specifying tile data and object placements using Tiled map format.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: ed8c97dc
system_scope: world
---

# Ruins Camp

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`ruins_camp.lua` is a static layout definition for the Ruins Camp map room in Don't Starve Together. It uses the Tiled map format (version 1.1) to encode terrain tiles and static object placements (e.g., structures, items, creatures) that appear in the Ruins Camp room. This file contributes to world generation by describing how the physical environment of this specific room should be constructed.

## Usage example
This file is not used directly by modders via component instantiation. It is loaded by the world generation system when building the Ruins Camp room. Modders typically interact with it indirectly via worldgen overrides or custom room placement logic.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version used for encoding |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `28` | Map width in tiles |
| `height` | number | `28` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets` | table | — | Tileset definitions (e.g., `tiles.png`) |
| `layers` | table | — | List of layers (`BG_TILES`, `FG_OBJECTS`) |

## Main functions
*This file does not define or expose any functional methods. It is a pure data structure representing static room layout.*

## Events & listeners
Not applicable.