---
id: four
title: Four
description: Defines static tilemap layout data for the Pit Room Armoury area in DST's world generation system.
tags: [map, worldgen, layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 965d1f3f
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file provides static tilemap data for a specific room layout (`four.lua`) used in the Pit Room Armoury of Don't Starve Together. It conforms to the Tiled Map Editor format (version 1.1) and describes background tile layers (`BG_TILES`) and foreground object placements (`FG_OBJECTS`). It is consumed by the world generation system to procedurally build in-game environments.

## Usage example
This file is not instantiated as a component; instead, it is loaded and processed by the world generation system during map construction. No direct modder usage is required.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version used for embedded scripts (if any) |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets` | table | — | List of tileset definitions |
| `layers` | table | — | Layer definitions (tile layer + object group) |

## Main functions
None identified — this is a static data file.

## Events & listeners
None identified — this file does not define an ECS component.