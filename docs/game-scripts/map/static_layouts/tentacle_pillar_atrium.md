---
id: tentacle_pillar_atrium
title: Tentacle Pillar Atrium
description: Static layout data for the tentacle pillar atrium map room, defining tile layers and object placements for dungeon generation.
tags: [map, level-design, dungeon]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 49c46140
system_scope: world
---

# Tentacle Pillar Atrium

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines the Tiled map data (`tentacle_pillar_atrium.lua`) for the tentacle pillar atrium room used in cave world generation. It specifies the grid-based layout including background tiles (`BG_TILES` layer) and placement of static objects (`FG_OBJECTS` group), such as tentacle pillar spawn points, fences, rubble, lights, and creatures like `bishop_nightmare`. It is consumed by the worldgen system to procedurally build parts of the Caves.

## Usage example
This file is not intended for direct component usage. It is loaded by the level generation system and typically referenced via the static layout loader. Example integration is internal to DST's map generation infrastructure.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled file format version. |
| `luaversion` | string | `"5.1"` | Lua engine version compatibility. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `24` | Map width in tiles. |
| `height` | number | `24` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels (map grid). |
| `tileheight` | number | `16` | Height of each tile in pixels (map grid). |
| `properties` | table | `{}` | Map-level properties (empty here). |
| `tilesets` | table | *(see source)* | Tileset definitions, including source image path and tile properties. |
| `layers` | table | *(see source)* | Array of map layers (`tilelayer`, `objectgroup`). |

## Main functions
None identified — this file is a static data table, not a component class.

## Events & listeners
None identified.