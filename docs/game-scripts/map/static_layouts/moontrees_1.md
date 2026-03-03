---
id: moontrees_1
title: Moontrees 1
description: Map layout definition for the Moon Tree region using Tiled map data format; specifies tile layer backgrounds and object groups for moon tree placement and petal worldgen zones.
tags: [world, map, environment, worldgen]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: a820b0dc
system_scope: world
---

# Moontrees 1

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout for the Moon Tree region in DST using the Tiled map format. It is not a component attached to an entity but rather a configuration file used by the world generation system. The layout contains a background tile layer (`BG_TILES`) and an object group (`FG_OBJECTS`) marking areas where moon trees should be placed and zones designated for moon tree petal worldgen.

## Usage example
This file is loaded by the world generation system automatically during map loading. Modders should not directly instantiate or modify this file at runtime. To reference or extend this layout in a custom map, use the `map/static_layouts/` convention and reference its filename in task or worldgen scripts.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map file format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `5` | Map width in tiles. |
| `height` | number | `5` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `tilesets` | table | `(...)` | Array of tileset definitions (e.g., ground tiles). |
| `layers` | table | `(...)` | Array of map layers: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
Not applicable — this file is a static data structure returned by the module, not a component with functional methods.

## Events & listeners
Not applicable.