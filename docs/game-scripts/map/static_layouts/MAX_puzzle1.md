---
id: MAX_puzzle1
title: Max Puzzle1
description: Static layout definition for a puzzle map area containing stone walls, wooden walls, and rocks arranged in a structured pattern.
tags: [map, static_layout, puzzle, environment]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: 97078757
---

# Max Puzzle1

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout (`static_layouts/MAX_puzzle1.lua`) used in the game's world generation system. It specifies a 40x40 tile grid with 16x16 pixel tiles, structured using two layers: a background tile layer (`BG_TILES`) and a foreground object layer (`FG_OBJECTS`). The layout is designed as part of a puzzle sequence—likely related to Max’s narrative or mechanics—and includes symmetrical placement of stone walls, wooden walls, and rocks (`rock2`). No runtime logic or component behavior is defined; it serves purely as a data-driven scene configuration for static environmental geometry.

## Usage example
Static layouts like this one are typically loaded by the world generation system via the `map/tasksets/` and `map/levels/` infrastructure. They are not instantiated manually by modders. However, the structure conforms to Tiled Map Editor’s Lua export format. A minimal reference example:

```lua
local layout = require("map/static_layouts/MAX_puzzle1")
print("Layout size: " .. layout.width .. "x" .. layout.height)
-- Access layers or objects via layout.layers[1], layout.layers[2], etc.
```

Modders wishing to customize or replace layouts should produce compatible Tiled `.lua` exports and register them in appropriate tasksets or level configurations.

## Dependencies & tags
**Components used:** None. This file is a pure data definition and does not reference any components directly.

**Tags:** None. No entity tags are applied via this layout.

## Properties
The table returned by the file conforms to the Tiled Lua export schema. Key top-level properties are:

| Property       | Type   | Default Value | Description |
|----------------|--------|---------------|-------------|
| `version`      | string | `"1.1"`       | Tiled version compatibility tag. |
| `luaversion`   | string | `"5.1"`       | Lua version used for export. |
| `orientation`  | string | `"orthogonal"`| Map rendering orientation. |
| `width`        | number | `40`          | Map width in tiles. |
| `height`       | number | `40`          | Map height in tiles. |
| `tilewidth`    | number | `16`          | Width of each tile in pixels. |
| `tileheight`   | number | `16`          | Height of each tile in pixels. |
| `properties`   | table  | `{}`          | Global map properties (empty here). |
| `tilesets`     | table  | See source   | Tileset definitions (contains `ground` tileset). |
| `layers`       | table  | See source   | Array of layers (`BG_TILES` tile layer and `FG_OBJECTS` object group). |

Layer-specific and object-specific properties (e.g., `x`, `y`, `width`, `height`, `type`) are populated per object in the `FG_OBJECTS` group.

## Main functions
This file does not define any functions. It is a data-only module returning a table of layout metadata.

## Events & listeners
This file does not define or use events or event listeners.

---