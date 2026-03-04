---
id: MAX_puzzle2
title: Max Puzzle2
description: Static map layout data for a puzzle-related zone, defining background tiles and foreground object placements using Tiled map format.
tags: [map, static_layout, puzzle]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 25952d33
---

# Max Puzzle2

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static world layout used in a Max-themed puzzle area. It is not a Lua component in the traditional ECS sense (i.e., it does not define a class or attach to an entity via `inst:AddComponent`), but rather a data-only Tiled map export (`MAX_puzzle2.lua`) that specifies tile-based environment geometry. The layout includes:
- A 40×40 tile background layer (`BG_TILES`) with repeating tile IDs to form ground patterns.
- An object layer (`FG_OBJECTS`) containing placed in-game assets like `rock1`, `rock2`, `wall_stone`, and `wall_wood`.

It serves as level data consumed by the world generation or level loading systems to instantiate prefabs and tiles, not as an active runtime component with behavior or logic.

## Usage example
This file is returned as a Lua table and loaded by the engine during world generation. Modders do not directly instantiate or call functions on it. An example of how such data may be loaded (not modder-facing, but for context) is:

```lua
local layout = require("map/static_layouts/MAX_puzzle2")
-- The layout table is passed to level-building systems, e.g.:
-- worldbuilder:AddStaticLayout(layout)
```

## Dependencies & tags
**Components used:** None identified — this is a pure data file with no component interactions.

**Tags:** None identified — no entity tags are added, removed, or checked.

## Properties
This file does not define any runtime properties or class variables. It is a static table export of a Tiled map. The structure is:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled export version. |
| `luaversion` | `string` | `"5.1"` | Lua version used for export. |
| `orientation` | `string` | `"orthogonal"` | Map orientation type. |
| `width` | `number` | `40` | Map width in tiles. |
| `height` | `number` | `40` | Map height in tiles. |
| `tilewidth` | `number` | `16` | Width of each tile in pixels. |
| `tileheight` | `number` | `16` | Height of each tile in pixels. |
| `properties` | `table` | `{}` | Map-level custom properties (empty here). |
| `tilesets` | `array` | see source | Array of Tiled tileset definitions (1 entry: ground). |
| `layers` | `array` | see source | Array of layers: `BG_TILES` (tile layer) and `FG_OBJECTS` (object layer). |

### `tilesets` structure
| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Tileset name (`"ground"`). |
| `firstgid` | `number` | First global tile ID (`1`). |
| `filename` | `string` | Relative path to `.tsx` file. |
| `image` | `string` | Relative path to tileset image. |
| `imagewidth`/`imageheight` | `number` | Dimensions of tileset image. |
| `tilewidth`/`tileheight` | `number` | Size of tiles in tileset (64×64 here). |

### `layers` structure
- `BG_TILES` (`type = "tilelayer"`):
  - `data`: 1600-element `array` of tile IDs (row-major order).
  - Tile IDs: `0` = empty, `2`, `3`, `9` = distinct ground tile types.
- `FG_OBJECTS` (`type = "objectgroup"`):
  - `objects`: `array` of placed prefabs.
  - Each object has `type` (prefab name), `x`/`y` (position in pixels), and `width`/`height` (0 = default size).
  - Includes single `rock2`, multiple `rock1`, `wall_stone`, and `wall_wood` placements.

## Main functions
This file defines no functions. It is a data structure only.

## Events & listeners
This file defines no event handlers or listeners.