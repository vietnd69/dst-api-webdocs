---
id: skeleton_camper
title: Skeleton Camper
description: Defines a static map layout for a skeleton camper campsite with associated foreground objects.
tags: [world, map, layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: f56e8002
system_scope: world
---

# Skeleton Camper

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`./map/static_layouts/skeleton_camper.lua` defines a static map layout in Tiled JSON format for a skeleton camper campsite. It specifies the tile grid, background layer data, and a foreground object group containing named entity placements (e.g., "skeleton", "strawhat", "backpack", "bedroll_straw", "rope", "spoiled_food"). This file is used by the world generation system to instantiate static environmental assets at runtime.

## Usage example
This file is not intended for direct component instantiation or runtime manipulation in Lua. It is consumed by the world generation system via Tiled map loaders (e.g., `map/archive_worldgen.lua`) to place static prefabs and tiles. No Lua code snippet is applicable.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version used. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `12` | Map width in tiles. |
| `height` | number | `12` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Custom map-level properties (empty in this layout). |
| `tilesets` | array | *See source* | Tileset definitions, including source image and tile metadata. |
| `layers` | array | *See source* | Array of layer definitions (background tiles and object group). |

## Main functions
Not applicable — this file returns static data and does not define any functional methods.

## Events & listeners
Not applicable — this file does not interact with the entity event system.