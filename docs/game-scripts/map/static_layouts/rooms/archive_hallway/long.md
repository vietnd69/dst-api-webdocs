---
id: long
title: Long
description: Static layout data for a hallway room in the Archive world generation system, defining background tiles and foreground objects for map room placement.
tags: [map, level_design, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 15409a0f
system_scope: environment
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static map room layout named `long`, used by the Archive world generation system in DST. It specifies the arrangement of background tiles (via a grid of tile IDs) and foreground objects (placed as named entities with properties) within a 32x32 tile layer. It is consumed by the world generation system to instantiate the room during map construction and does not function as an ECS component or runtime entity.

## Usage example
This file is not instantiated directly by modders at runtime. It is loaded by the world generation system and used to build Archive-specific hallway rooms. Modders would reference this layout when designing custom rooms or overriding Archive layouts via `static_layouts` configuration.

```lua
-- This file is metadata for map generation, not a component to be used directly.
-- No runtime Lua code interacts with it via inst:AddComponent.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used in Tiled exports. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | — | Tileset definitions, including path to texture (`tiles.png`) and `firstgid`. |
| `layers` | table | — | Array of layers; includes `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
No functions are defined in this file. It returns a static Lua table containing map metadata.

## Events & listeners
None identified

## Data structure details
### Background tile layer (`BG_TILES`)
- **Type:** `tilelayer`
- **Size:** 32×32 tiles
- **Data:** A flat Lua array of 1024 tile IDs (row-major order), mostly `0` (empty), with repeating patterns of IDs `1` and `42` at specific row positions, suggesting wall or feature placement.

### Foreground object layer (`FG_OBJECTS`)
- **Type:** `objectgroup`
- **Contents:**
  - `archive_pillar` (2 instances) – placed at coordinates `(97,224)` and `(352,223)`
  - `archive_chandelier` (1 instance) – placed at `(222,257)`
  - `archive_moon_statue` (2 instances) – placed at `(151,321)` and `(293,127)`
  - `creature_area` (1 instance) – rectangular area `(170,150)` to `(304,317)`
  - `archive_security_waypoint` (1 instance) – placed at `(257,256)`
  - `mothden_area_low` (1 instance) – rectangular area `(137,105)` to `(174,235)`
  - `wall_stone_2` (11 instances) – small wall segments along top and bottom edges (y≈72 and y≈377), some with `data.gridnudge = "true"`
  - `wall_ruins_2` (2 instances) – damaged walls at top and bottom with `data.health.percent = "1"`
  - `archive_sound_area` (1 instance) – rectangular area `(138,116)` to `(314,398)`

All object coordinates are in pixels. Object sizes are typically zero (width/height = `0`) for point-like placements, with explicit dimensions for area types (e.g., `creature_area`).