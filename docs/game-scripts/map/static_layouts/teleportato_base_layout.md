---
id: teleportato_base_layout
title: Teleportato Base Layout
description: Defines the static layout data for the Teleportato base area in the caves, including background tiles and placed objects.
tags: [world, level, map, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 555935e7
system_scope: world
---

# Teleportato Base Layout

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`teleportato_base_layout.lua` is a static layout file that describes the layout data for the Teleportato base area in the caves. It specifies the terrain using a tile layer (`BG_TILES`) and defines placements of decorative and gameplay objects (`FG_OBJECTS`) such as marbles, bishops, knights, rooks, and `flower_evil` entities. This file does not function as an ECS component — it is a data structure returned as a Lua table, used by the world generation system to instantiate layout-specific prefabs and tiles during world initialization.

## Usage example
Static layout files like this one are not instantiated directly by modders. Instead, they are referenced and loaded by the worldgen system (e.g., in `map/levels/caves.lua` and related task/taskset files). Modders can inspect or modify such layouts to customize cave room layouts, but cannot call functions on this file.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version for embedded data. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `40` | Map width in tiles. |
| `height` | number | `40` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | *(see source)* | Tileset definitions (e.g., ground tiles). |
| `layers` | table | *(see source)* | Layer definitions (`BG_TILES` and `FG_OBJECTS`). |

## Main functions
This file exports a single table literal and contains no functions.

## Events & listeners
Not applicable.