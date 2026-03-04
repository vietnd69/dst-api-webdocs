---
id: mactusk_village
title: Mactusk Village
description: A static layout definition file representing the Mactusk Village map section, containing tile data and object placements for world generation.
tags: [map, worldgen, static_layout]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 6c6ac1ae
system_scope: world
---

# Mactusk Village

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines the static layout for the Mactusk Village map section in Don't Starve Together. It specifies the tile-based background layer (`BG_TILES`) and object placements (`FG_OBJECTS`) using the Tiled Map Editor data format. The layout includes specific object types such as `walrus_camp` and `evergreen_tall` placed at precise grid coordinates within a 32x32 tile grid (each tile 16x16 pixels). This file is used during world generation to instantiate physical structures and props in the game world.

The component itself is a plain Lua table (not an ECS component class) — it does not implement any entity behavior, components, or event logic. Instead, it serves as raw data input for world generation systems that parse and render map content.

## Usage example
This file is typically referenced by the world generation system and not instantiated directly by modders. However, a conceptual example of how it might be used in world generation is:

```lua
local mactusk_village = require("map/static_layouts/mactusk_village")

-- Example: Iterate placement objects for custom spawning logic
for _, obj in ipairs(mactusk_village.layers[2].objects) do
    if obj.type == "walrus_camp" then
        -- Translate grid coordinates to world space and spawn entity
        local world_x = obj.x / 16  -- Convert from pixel to tile space
        local world_y = obj.y / 16
        print(string.format("Placing walrus camp at tile (%d, %d)", world_x, world_y))
    end
end
```

## Dependencies & tags
**Components used:** None — this file contains only static data and does not interact with game components.
**Tags:** None identified.

## Properties
This is a data-only file represented as a Lua table with fixed structure conforming to Tiled JSON exports (stored as Lua syntax). Key properties are listed below.

| Property        | Type   | Default Value | Description |
|-----------------|--------|---------------|-------------|
| `version`       | string | `"1.1"`       | Tiled map format version. |
| `luaversion`    | string | `"5.1"`       | Lua version used in export. |
| `orientation`   | string | `"orthogonal"`| Tile map orientation type. |
| `width`         | number | `32`          | Map width in tiles. |
| `height`        | number | `32`          | Map height in tiles. |
| `tilewidth`     | number | `16`          | Width of each tile in pixels. |
| `tileheight`    | number | `16`          | Height of each tile in pixels. |
| `properties`    | table  | `{}`          | Map-level custom properties (empty). |
| `tilesets`      | table  | See data      | Array of tileset definitions, including image path and tile specifications. |
| `layers`        | table  | See data      | Array of layers (`BG_TILES`, `FG_OBJECTS`). |

## Main functions
None — this file contains only static data with no executable logic or functional methods.

## Events & listeners
None — this file does not register or fire any events.