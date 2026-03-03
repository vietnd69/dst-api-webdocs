---
id: insane_rabbit_king
title: Insane Rabbit King
description: A static layout map definition used for the Insane Rabbit King arena, containing background tile data and foreground object placements for the boss encounter.
tags: [map, boss, arena, static_layout]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: fc37fa29
system_scope: world
---

# Insane Rabbit King

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This component defines a static map layout used for the Insane Rabbit King boss arena. It is a Tiled map data structure containing grid-based tile layers and object group layers that specify background tile placements and foreground object positions (e.g., sanity rocks, monkey barrels). It does not contain executable logic or entity components; it is purely a data definition file consumed by the world generation system to instantiate the arena environment during boss encounter setup.

## Usage example
This file is not meant to be used directly as a component in the ECS. Instead, it is imported and used by world generation or arena setup scripts (e.g., via `require("map.static_layouts.insane_rabbit_king")`). Example usage within a generator or task:

```lua
local INSANE_RABBIT_KING_LAYOUT = require("map.static_layouts.insane_rabbit_king")
-- The layout is processed by engine functions (e.g., TmxMapLoader) to spawn tiles and prefabs
-- The following is illustrative only; actual engine hooks are internal
SetupArenaFromStaticLayout(INSANE_RABBIT_KING_LAYOUT, arena_center_pos)
```

## Dependencies & tags
**Components used:** None. This file is a raw data table and does not instantiate or interact with any ECS components.

**Tags:** None identified.

## Properties
The following fields are present in the returned Lua table; they describe map metadata and content:

| Property      | Type     | Default Value | Description |
|---------------|----------|---------------|-------------|
| `version`     | string   | `"1.1"`       | Tiled map format version. |
| `luaversion`  | string   | `"5.1"`       | Lua version used to serialize the map. |
| `orientation` | string   | `"orthogonal"`| Map rendering orientation. |
| `width`       | number   | `32`          | Map width in tiles. |
| `height`      | number   | `32`          | Map height in tiles. |
| `tilewidth`   | number   | `16`          | Width of each tile in pixels. |
| `tileheight`  | number   | `16`          | Height of each tile in pixels. |
| `properties`  | table    | `{}`          | Global map properties (currently empty). |
| `tilesets`    | array    | `[...]`       | List of tileset definitions (one entry with custom tile data). |
| `layers`      | array    | `[...]`       | List of layers: one tile layer (`BG_TILES`) and one object group layer (`FG_OBJECTS`). |

## Main functions
This file is a data definition and contains no functions.

## Events & listeners
This file is a static data definition and contains no event handling or listeners.