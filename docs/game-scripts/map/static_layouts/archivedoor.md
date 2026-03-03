---
id: archivedoor
title: Archivedoor
description: A static layout configuration for the archived door area in DST caves, defining tilemap data, object placement, and map metadata for world generation.
tags: [map, worldgen, static_layout, door]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 185e61a4
---
# Archivedoor

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file defines a static layout for the archived door area in the Caves. It is a Tiled map data file (`.lua` format) used by DST's world generation system to instantiate the physical geometry and object placement of a specific room — the archived door chamber. It contains grid-based tile layers (e.g., floor tiles), an object group for placing entities like pillars, and metadata required by the engine to correctly reconstruct the layout during map generation. As a static layout, it is not a component in the ECS sense (i.e., not dynamically attached to entities), but rather a declarative configuration asset consumed by map/room generation scripts.

## Usage example

This file is not instantiated or used directly in mod code. Instead, it is referenced indirectly by world generation systems such as `map/tasksets/caves.lua` or `map/levels/caves.lua`. A typical internal usage pattern looks like:

```lua
local archivedoor_layout = require "map/static_layouts/archivedoor"
-- The engine or worldgen code loads this data, parses tile layers and object groups,
-- and places appropriate prefabs and tile layers in the world.
```

Modders should not instantiate this file manually. Instead, they should extend or override static layouts via the `WORLDGEN_OVERRIDES` or by adding new room/task definitions.

## Dependencies & tags
**Components used:** None (this is a data file, not an ECS component).
**Tags:** None identified.

## Properties

The following properties are defined in the layout data table. These are configuration values used by the world generation system, not entity properties:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export format version. |
| `luaversion` | string | `"5.1"` | Lua interpreter version expected for parsing. |
| `orientation` | string | `"orthogonal"` | Map projection type. DST only supports orthogonal. |
| `width` | integer | `36` | Width of the map in tiles. |
| `height` | integer | `36` | Height of the map in tiles. |
| `tilewidth` | integer | `16` | Width of each tile in pixels. |
| `tileheight` | integer | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Reserved for future metadata (currently unused). |
| `tilesets` | array of tables | — | Tileset definitions including image path, gid, dimensions. |
| `layers` | array of tables | — | Tile layers (e.g., `BG_TILES`) and object groups (e.g., `FG_OBJECTS`). |

## Main functions

This file exports a single data table and does not define any functions.

## Events & listeners

Not applicable — this is a static data file, not a runtime component. No events are registered or dispatched by this file.

