---
id: chess_spot
title: Chess Spot
description: Static layout file defining the structure and object placement for the Chess Spot map room in DST.
tags: [world, map, static_layout, room, level_design]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: d59e23a2
system_scope: world
---
# Chess Spot

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file is a Tiled map format (JSON-like Lua table) static layout definition for the "Chess Spot" map room. It is used by the world generation system to place and configure a specific room layout in the game world, primarily in the Forest or other applicable biomes. The layout contains background tile data, an object group specifying spawn positions for entities like `evil_thing` and `flower_evil`, and metadata such as dimensions and tileset references. It is consumed by the world generation task system to instantiate static geometry and populate entity instances during room generation.

## Usage example

This file is not instantiated as a component attached to an entity. Instead, it is loaded and processed by the world generation engine. A typical usage pattern in a task file or worldgen script would look like:

```lua
local ChessSpot = require("map/static_layouts/chess_spot")
-- Internally, the engine callsroom_loader.add_static_layout("chess_spot", ChessSpot)
-- or uses this table to instantiate the room in a task/room configuration.
```

No direct component addition is required — the generation system handles instantiation based on this definition.

## Dependencies & tags

**Components used:** None — this is a data-only file.

**Tags:** None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled format version. |
| `luaversion` | `string` | `"5.1"` | Lua version targeted (unused at runtime, for compatibility). |
| `orientation` | `string` | `"orthogonal"` | Map rendering orientation. |
| `width` | `number` | `12` | Width of the layout in tiles. |
| `height` | `number` | `12` | Height of the layout in tiles. |
| `tilewidth` | `number` | `16` | Width of each tile in pixels. |
| `tileheight` | `number` | `16` | Height of each tile in pixels. |
| `properties` | `table` | `{}` | User-defined properties (currently unused). |
| `tilesets` | `table` | See source | Tileset definitions used for rendering. |
| `layers` | `table` | See source | Layers containing tile data and object placements. |

## Main functions

This file is a pure data container and contains no executable functions or methods.

## Events & listeners

No events are processed or dispatched by this file. It is strictly a static definition consumed at world generation time.

