---
id: skeleton_researchlab3
title: Skeleton Researchlab3
description: Defines the static layout configuration for the Skeleton Research Lab scene in Tiled map format, including tile layers and object placements for world generation.
tags: [map, static_layout, world_generation]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 857835d4
system_scope: world
---

# Skeleton Researchlab3

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`Skeleton Researchlab3` is a map layout script in Tiled JSON-compatible Lua format that specifies the static architecture of the Skeleton Research Lab room. It contains a background tile layer (`BG_TILES`) and an object group (`FG_OBJECTS`) enumerating placed prefabs (e.g., walls, foliage, structures, entities) with their coordinates and types. This file is consumed by the world generation system to place the room deterministically in the forest or cave layers.

## Usage example
```lua
-- This file is typically loaded and used by the world generation engine via `Add Room` or `Add Prefab` calls.
-- It is not instantiated directly as an ECS component.
-- Example worldgen usage (conceptual):
-- local room = require "map/static_layouts/skeleton_researchlab3"
-- WorldGen.AddStaticRoom(room, "forest")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version. |
| `luaversion` | string | `"5.1"` | Target Lua interpreter version. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile (in pixels). |
| `tileheight` | number | `16` | Height of each tile (in pixels). |
| `tilesets` | table | — | Tileset definitions for rendering. |
| `layers` | table | — | Layers (`BG_TILES`, `FG_OBJECTS`) containing static and object data. |

## Main functions
Not applicable — This is a static data file, not a component with runtime methods.

## Events & listeners
Not applicable — No events or listeners are defined.