---
id: grasssinkhole
title: Grasssinkhole
description: Map layout definition for a grass-themed sinkhole environment, specifying tile layers and object group configurations used in world generation.
tags: [map, worldgen, static_layout]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: c73fec63
system_scope: world
---

# Grasssinkhole

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static layout for a grass-themed sinkhole room in Don't Starve Together. It is not a component in the Entity Component System but rather a Tiled map data file (JSON format) used by the world generation system to construct environment layouts. The layout includes a tile layer (`BG_TILES`) with specific tile IDs to define floor patterns, and an object group (`FG_OBJECTS`) that declares two rectangular regions: one for lighting coordinates and another marking the grassy area boundaries. This layout is consumed by higher-level world generation logic (e.g., `map/tasks`, `map/tasksets`) to instantiate physical and visual representations in-game.

## Usage example
This file is typically loaded internally during world generation and not instantiated directly via Lua code. Modders usually reference or extend static layouts via `map/tasksets` or custom room definitions, e.g.:

```lua
-- Example of referencing in a taskset (not direct usage of grasssinkhole.lua)
local GrassSinkholeLayout = require "map/static_layouts/grasssinkhole"
-- In a map task or room generator:
room:SetStaticLayout(GrassSinkholeLayout)
```

Note: Direct instantiation is discouraged. Use the worldgen framework (e.g., `AddRoom`, `SetLayout`) to integrate this layout.

## Dependencies & tags
**Components used:** None — this file is pure data and does not interact with any `inst.components.X`.

**Tags:** None — no entity tags are modified or checked.

## Properties
This file is a Lua-returning table (representing JSON), not a component, so it does not define instance-level properties. Its top-level structure corresponds to the Tiled map format:

| Field        | Type   | Description                                                                 |
|--------------|--------|-----------------------------------------------------------------------------|
| `version`    | string | Tiled version (`"1.1"`).                                                    |
| `luaversion` | string | Lua version used (`"5.1"`).                                                 |
| `orientation`| string | Map orientation (`"orthogonal"`).                                           |
| `width`      | number | Map width in tiles (`32`).                                                  |
| `height`     | number | Map height in tiles (`32`).                                                 |
| `tilewidth`  | number | Width of each tile in pixels (`16`).                                        |
| `tileheight` | number | Height of each tile in pixels (`16`).                                       |
| `properties` | table  | Unused map-level properties (empty).                                        |
| `tilesets`   | table  | Array of tileset definitions (contains one entry for `tiles.png`).         |
| `layers`     | table  | Array of layers (contains `BG_TILES` tile layer and `FG_OBJECTS` object group). |

## Main functions
No functions — this file is data-only and returns a static table.

## Events & listeners
No events or listeners — this file does not participate in event-driven logic.