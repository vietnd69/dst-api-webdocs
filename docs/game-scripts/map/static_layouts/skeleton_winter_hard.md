---
id: skeleton_winter_hard
title: Skeleton Winter Hard
description: Defines a static map layout for the Skeleton Winter boss arena, specifying tile configuration and placement of interactive objects.
tags: [world, environment, boss, level-design, map]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: e613048b
system_scope: world
---

# Skeleton Winter Hard

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file (`skeleton_winter_hard.lua`) defines a static map layout using the Tiled Map Editor format. It specifies the geometry and tile data for the *hard difficulty* version of the Skeleton Winter boss arena. It includes a background tile layer and an object group containing interactive placements (a skeleton, a winter armor piece, and a blueprint for the earmuffshat recipe). The layout is used by the world generation system to insert pre-designed arena layouts during map construction.

## Usage example
This file is not instantiated or used directly by modders at runtime. It is consumed automatically by the DST engine's world generation logic when the `skeleton_winter_hard` static layout is referenced in a map `task` or `taskset` configuration.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version requirement |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `8` | Map width in tiles |
| `height` | number | `8` | Map height in tiles |
| `tilewidth` | number | `16` | Tile width in pixels |
| `tileheight` | number | `16` | Tile height in pixels |
| `tilesets` | table | — | List of tileset definitions |
| `layers` | table | — | List of map layers (tile and object groups) |

## Main functions
Not applicable

## Events & listeners
None identified