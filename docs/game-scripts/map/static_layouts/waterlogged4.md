---
id: waterlogged4
title: Waterlogged4
description: Defines a static map layout for the waterlogged environment using Tiled map format data.
tags: [map, static, environment]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 2bd8efe9
system_scope: world
---

# Waterlogged4

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file describes a static map layout used in the "waterlogged" theme (likely for the Swamp biome). It uses the Tiled map format (version 1.1) and specifies tile data, object placements, and layer configuration. It is not a runtime component but a map definition resource used during world generation to instantiate environment geometry and objects.

## Usage example
This file is not used directly in gameplay code. It is consumed by the world generation system (e.g., via `map/archive_worldgen.lua`) to build the layout at runtime.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version targeted by exported data |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `15` | Map width in tiles |
| `height` | number | `15` | Map height in tiles |
| `tilewidth` | number | `64` | Pixel width of each tile |
| `tileheight` | number | `64` | Pixel height of each tile |
| `tilesets` | table | — | List of tileset references (e.g., `"ground"` with `tiles.png`) |
| `layers` | table | — | Layer definitions: `"BG_TILES"` (tile layer) and `"FG_OBJECTS"` (object group) |

## Main functions
None — this file is a pure data structure, not a component with functional logic.

## Events & listeners
None identified