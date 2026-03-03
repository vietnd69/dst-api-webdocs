---
id: thismeanswar_start
title: Thismeanswar Start
description: Defines the static map layout for the "This Means War" scenario starting area, including tile data and object placement for scenario initialization.
tags: [scenario, map, worldgen]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 64769892
system_scope: world
---

# Thismeanswar Start

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`thismeanswar_start.lua` is a Tiled map export file used to define the initial terrain and object layout for the "This Means War" scenario's starting zone. It is not a dynamic ECS component but rather a static data definition loaded during world generation to populate the initial environment. The file contains tile layer data for ground visuals and an object group specifying spawn points and prefabs (e.g., burnt trees, evil flowers, divining rod starter) to be instantiated in-game.

## Usage example
This file is not intended for direct component usage by modders. It is loaded and processed by DST's world generation system when initializing the scenario's map layout.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used for map encoding. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `24` | Map width in tiles. |
| `height` | number | `24` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | See source | Contains tileset definitions (e.g., "tiles"). |
| `layers` | table | See source | Contains tile layers (`BG_TILES`) and object groups (`FG_OBJECTS`). |

## Main functions
Not applicable — this file exports static map data and does not define executable logic or functional methods.

## Events & listeners
Not applicable — no event handling is present in this file.