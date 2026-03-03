---
id: walls_straight
title: Walls Straight
description: Defines a static map layout containing wall placement data and object metadata for ruin-style wall segments.
tags: [map, world, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: d5cb8cad
system_scope: world
---

# Walls Straight

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout used in the game world, specifically for generating wall structures in ruin-themed areas. It is a Tiled JSON-style Lua data structure that encodes tile and object placement — primarily for wall segments — using hardcoded tile IDs (`29`) and object properties indicating health percentages and types (e.g., `"wall_ruins"`, `"brokenwall_ruins"`). It does not contain any runtime logic or component behavior; it serves as declarative data consumed by world generation systems (e.g., `tasksets`, `levels`, or `rooms`).

## Usage example
This file is not used directly as a component; it is imported and processed by world generation utilities. A typical usage pattern in generation code would be:
```lua
local walls_straight = require "map/static_layouts/walls_straight"
-- The returned table is passed to a layout loader or worldgen helper:
-- worldgen_helper:AddStaticLayout(walls_straight, x, y)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map orientation. |
| `width`, `height` | number | `16` | Map dimensions in tiles. |
| `tilewidth`, `tileheight` | number | `16` | Tile size in pixels. |
| `tilesets` | table | — | Tileset metadata (image path, dimensions, tile size). |
| `layers` | table | — | Array of layers: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
None identified.

## Events & listeners
Not applicable.