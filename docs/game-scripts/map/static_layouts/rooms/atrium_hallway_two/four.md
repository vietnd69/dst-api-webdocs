---
id: four
title: Four
description: Static layout data for an Atrium hallway segment in DST's map system.
tags: [map, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 693f76a3
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static map layout data for the "four" variant of an Atrium hallway room segment. It is part of DST's world generation system and specifies tile placement and object spawn positions using TMX-style JSON data. This layout includes background tiles (BG_TILES layer) and foreground objects (FG_OBJECTS layer), such as Nightmare creature spawners and Atrium fences. As a static layout, it is consumed by map-related systems during world generation and does not define runtime behavior components.

## Usage example
This file is not intended for direct instantiation by modders. It is loaded and processed by the game's map generation infrastructure (e.g., via `map/archive_worldgen.lua` and room/task systems). Modders typically reference such layouts indirectly when overriding or extending room generation rules.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | TMX format version used. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | array | (see source) | Tileset definitions used for rendering. |
| `layers` | array | (see source) | Layer definitions (e.g., tile layers, object groups). |

## Main functions
Not applicable — this file returns static data, not a component class or functional interface.

## Events & listeners
Not applicable — this file does not define any event listeners or event publishers.