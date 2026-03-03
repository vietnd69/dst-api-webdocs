---
id: chess_spot3
title: Chess Spot3
description: Static map layout definition for a chess-themed area containing embedded game objects and tile data.
tags: [map, static, layout, environment]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: a19a9516
system_scope: environment
---

# Chess Spot3

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout (`chess_spot3.lua`) used in the world generation system for Don't Starve Together. It specifies a 16x16 tile grid (`16` tiles wide/high, `64x64` px per tile) with orthogonal orientation and includes:
- A background tile layer (`BG_TILES`) containing a small number of non-zero tiles (tile ID `11` at four locations),
- An object group (`FG_OBJECTS`) with six named object entries: three `flower_evil`, two `marbletree`, and one `evil_thing`, positioned relative to the layout coordinate system.

This file does not implement a runtime component in the ECS; rather, it is a data definition consumed by the worldgen system to place prefabs during map generation. It serves as a template or layout asset referenced by room/task systems.

## Usage example
This file is not used directly in gameplay entities. It is typically loaded and interpreted by the world generation system when placing pre-defined layouts (e.g., via `static_layouts` task logic). Example usage in worldgen context:

```lua
-- In a task or room generation script (not in component code):
local layout = require("map/static_layouts/chess_spot3")
-- The layout is later applied to world coordinates by the engine's Tiled loader.
-- No direct instantiation or component usage is performed here.
```

## Dependencies & tags
**Components used:** None  
**Tags:** None

## Properties
This file is a plain Lua table (map layout data), not an ECS component. It does not define class properties, methods, or runtime behavior. All fields are static configuration values:

| Property       | Type     | Default Value | Description                                                                 |
|----------------|----------|---------------|-----------------------------------------------------------------------------|
| `version`      | string   | `"1.1"`       | Tiled file format version.                                                  |
| `luaversion`   | string   | `"5.1"`       | Lua interpreter version expected.                                           |
| `orientation`  | string   | `"orthogonal"`| Tile layout orientation.                                                    |
| `width`        | number   | `16`          | Layout width in tiles.                                                      |
| `height`       | number   | `16`          | Layout height in tiles.                                                     |
| `tilewidth`    | number   | `16`          | Logical tile width in pixels (used for coordinate mapping, not rendering).  |
| `tileheight`   | number   | `16`          | Logical tile height in pixels.                                              |
| `properties`   | table    | `{}`          | Global layout properties (empty).                                           |
| `tilesets`     | table    | *(see data)*  | Tileset definitions (here, one ground tileset).                            |
| `layers`       | table    | *(see data)*  | Layer definitions: tile layer and object group.                            |

### Layer Details
- **`BG_TILES`**: Tile layer (`type = "tilelayer"`) with `16x16` grid; `data` field is a flat array of `256` tile IDs. Only four entries (indices ~76, ~93, ~180, ~197 in 1-based indexing) have non-zero value `11`.
- **`FG_OBJECTS`**: Object group (`type = "objectgroup"`) containing six objects with type metadata: `flower_evil`, `marbletree`, and `evil_thing`. All have zero width/height and absolute `x,y` coordinates in pixels relative to the layout origin (top-left at `0,0`). Coordinates are in Tiled's pixel coordinate system (not tile units).

## Main functions
This file contains no functions. It returns a static Lua table representing layout metadata only.

## Events & listeners
This file contains no event logic.