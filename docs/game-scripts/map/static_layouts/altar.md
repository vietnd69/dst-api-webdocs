---
id: altar
title: Altar
description: Static map layout definition for the Altar environment in DST, containing tile data, object placements, and static structures.
tags: [map, environment, static_layout]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 72b1a1cc
---

# Altar

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines the static layout for the Altar map segment, used to generate structured areas in the game world (specifically in the Ruins). It is a Tiled map file exported as Lua, containing tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) that specifies where prefabs (e.g., `nightmarelight`, `ancient_altar_spawner`, `bishop_nightmare_spawner`, `sacred_chest`, `wall_ruins`) should be spawned. This component does not define a game entity or component in the ECS; rather, it is a data blueprint consumed by the world generation system to instantiate structural and gameplay elements in the game world.

## Usage example
This file is not instantiated directly as an ECS component. Instead, the world generation system loads and processes this layout during level construction:

```lua
-- Pseudo-example: How the game loads and uses the layout (not part of the file itself)
local layout = require("map/static_layouts/altar")
for _, obj in ipairs(layout.layers.FG_OBJECTS.objects) do
    if obj.type == "ancient_altar_spawner" then
        inst.world:SpawnPrefab("ancient_altar", {x = obj.x, y = obj.y})
    end
end
```

## Dependencies & tags
**Components used:** None — this is a pure data file with no runtime logic or component instantiation.

**Tags:** None — no tags are added or checked.

## Properties
This file exports a single Lua table with the following top-level properties:

| Property      | Type       | Default Value | Description |
|---------------|------------|---------------|-------------|
| `version`     | `string`   | `"1.1"`       | Tiled export version. |
| `luaversion`  | `string`   | `"5.1"`       | Lua version used for encoding. |
| `orientation` | `string`   | `"orthogonal"`| Map orientation type. |
| `width`       | `integer`  | `48`          | Map width in tiles. |
| `height`      | `integer`  | `48`          | Map height in tiles. |
| `tilewidth`   | `integer`  | `16`          | Width of each tile in pixels. |
| `tileheight`  | `integer`  | `16`          | Height of each tile in pixels. |
| `properties`  | `table`    | `{}`          | Map-level custom properties (empty here). |
| `tilesets`    | `table`    | —             | Array of tileset definitions (used for rendering background tiles). |
| `layers`      | `table`    | —             | Array of layers: one tile layer (`BG_TILES`) and one object group (`FG_OBJECTS`). |

The `layers` array contains:
- A `tilelayer` named `"BG_TILES"` with `encoding = "lua"` and a large numeric array representing tile IDs.
- An `objectgroup` named `"FG_OBJECTS"` with an array of object definitions.

### Object properties (in `FG_OBJECTS.objects`)
Each object in `FG_OBJECTS.objects` has:
| Property   | Type       | Description |
|------------|------------|-------------|
| `name`     | `string`   | Usually empty. |
| `type`     | `string`   | Prefab or spawner type (e.g., `"nightmarelight"`, `"ancient_altar_spawner"`, `"sacred_chest"`). |
| `shape`    | `string`   | `"rectangle"` (used for Tiled compatibility). |
| `x`, `y`   | `integer`  | Coordinates in pixels (note: values like 461 indicate sub-tile positioning). |
| `width`, `height` | `integer` | Typically `0` — not used for placement size. |
| `visible`  | `boolean`  | Always `true`. |
| `properties` | `table`  | Optional key-value pairs (e.g., `["data.health.percent"] = "1.0"` for wall health). |

## Main functions
This file contains no executable functions or methods — it is a static data structure.

## Events & listeners
No events or event listeners are defined in this file.