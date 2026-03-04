---
id: grotto
title: Grotto
description: Defines static layout data for the Grotto map room using Tiled JSON structure, specifying tile placement and object instance configurations for procedural world generation.
tags: [world, map, layout, procedural-generation]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 0aeefb3c
system_scope: world
---

# Grotto

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines the static layout configuration for the Grotto room, used by the game's world generation system to place scenery elements and background tiles when generating cave environments. It follows the Tiled map format (JSON-based) and contains two layers: a tile layer (`BG_TILES`) for background decoration and an object group (`FG_OBJECTS`) for foreground entities such as plants, rocks, ponds, and ambient effects like fireflies. It does not implement any ECS component logic itself, but serves as a data asset consumed by the map generation pipeline.

## Usage example
This file is not used directly as a Lua component. Instead, it is loaded as raw data by the world generation system, typically via `include("map/static_layouts/grotto.lua")` in worldgen or room-related scripts. A typical usage context would be:

```lua
-- Example usage within a worldgen script (not component usage)
local grotto_layout = include("map/static_layouts/grotto.lua")
-- Layout data is then parsed to instantiate Prefabs at object positions
for _, obj in ipairs(grotto_layout.layers[2].objects) do
    local x, y = obj.x, obj.y
    local type = obj.type
    if type == "evergreen_short" then
        inst:SpawnPrefab("evergreen_short", x, y)
    end
end
```

## Dependencies & tags
**Components used:** None — this file is a pure data definition with no runtime logic or component interaction.  
**Tags:** None identified.

## Properties
No instance properties exist in the traditional ECS sense. This file defines static JSON-like map data with the following top-level fields:

| Property         | Type      | Default Value | Description                                                                 |
|------------------|-----------|---------------|-----------------------------------------------------------------------------|
| `version`        | `string`  | `"1.1"`       | Tiled format version.                                                       |
| `luaversion`     | `string`  | `"5.1"`       | Lua compatibility version.                                                  |
| `orientation`    | `string`  | `"orthogonal"`| Map rendering orientation.                                                  |
| `width`          | `integer` | `16`          | Map width in tiles.                                                         |
| `height`         | `integer` | `16`          | Map height in tiles.                                                        |
| `tilewidth`      | `integer` | `16`          | Width of each tile in pixels.                                               |
| `tileheight`     | `integer` | `16`          | Height of each tile in pixels.                                              |
| `tilesets`       | `table`   | `[table]`     | List of tileset definitions, referencing texture and tile metadata.        |
| `layers`         | `table`   | `[table]`     | List of layers (tile layers and object groups) defining layout content.    |

## Main functions
No functions are defined in this file — it is a data-return statement (`return { ... }`) containing static configuration.

## Events & listeners
No events or listeners — this file is data-only and has no runtime behavior.