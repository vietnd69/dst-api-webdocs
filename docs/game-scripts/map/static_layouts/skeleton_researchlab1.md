---
id: skeleton_researchlab1
title: Skeleton Researchlab1
description: Defines the layout data for a static map room containing skeleton-themed assets and gameplay objects.
tags: [world, environment, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: c0eb0598
system_scope: world
---

# Skeleton Researchlab1

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout for a skeleton-themed research lab room in DST. It is a Tiled map export containing tile layer data (background tiles) and an object group (`FG_OBJECTS`) specifying placements of in-game entities such as the `researchlab`, `skeleton`, trees, and items. It is used by the world generation system to instantiate the room during map generation.

## Usage example
This file is not used as a component; it is a data definition for the world generation system. A typical usage occurs internally when the map generator loads static layouts:
```lua
-- Internally invoked by the worldgen system:
local room_data = require "map/static_layouts/skeleton_researchlab1"
-- The engine uses `room_data.layers` to spawn tile layers and `room_data.layers.FG_OBJECTS.objects` to spawn prefabs.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Target Lua version for serialization. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | — | Array of tileset definitions. |
| `layers` | table | — | Array of layer definitions (`tilelayer` and `objectgroup`). |

## Main functions
Not applicable — this is a static data file and contains no executable functions.

## Events & listeners
Not applicable — this file defines only static layout data and does not interact with events.