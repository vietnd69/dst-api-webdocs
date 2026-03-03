---
id: cave_base_2
title: Cave Base 2
description: Static layout definition for a pre-designed cave chamber containing environmental objects, loot containers, and structural tiles.
tags: [map, layout, static, cave, environment]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 753a1046
system_scope: environment
---

# Cave Base 2

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
`cave_base_2` is a static layout definition used by the game's world generation system to place a predefined cave chamber. It specifies the tiling for the background layer (`BG_TILES`) and the placement of world objects (`FG_OBJECTS`) such as treasure chests, furniture, flora, tools, and structures. This file conforms to the Tiled Map Editor format (JSON-like structure serialized as Lua) and is consumed by DST's map loading and instance spawning systems—not an ECS component in the traditional sense.

## Usage example
This file is loaded procedurally by the worldgen system and is not typically instantiated manually. A representative usage pattern (simplified for illustration) would be:

```lua
local layout = require("map/static_layouts/cave_base_2")

-- The layout data is passed to a room instancer that interprets layers and objects:
-- inst:SpawnObjectsFromLayout(layout, "FG_OBJECTS")
-- or internally via map/task system:
-- world:SpawnStaticRoom("cave_base_2")
```

## Dependencies & tags
**Components used:** None directly (this is a data file, not an ECS component). The objects defined in `FG_OBJECTS` (e.g., `treasurechest`, `researchlab`) rely on their own prefabs and components at runtime.

**Tags:** None identified. Object types are declared as string metadata (e.g., `"type": "treasurechest"`), but no `AddTag`/`HasTag` calls occur within this file.

## Properties
This is a pure data structure; it has no instance properties or methods. However, the top-level table contains the following constant fields:

| Property        | Type   | Default Value | Description |
|-----------------|--------|---------------|-------------|
| `version`       | string | `"1.1"`       | Tiled format version |
| `luaversion`    | string | `"5.1"`       | Lua interpreter version used |
| `orientation`   | string | `"orthogonal"`| Map orientation type |
| `width`         | number | `24`          | Width in tiles |
| `height`        | number | `24`          | Height in tiles |
| `tilewidth`     | number | `16`          | Width of each tile (in pixels) |
| `tileheight`    | number | `16`          | Height of each tile (in pixels) |
| `properties`    | table  | `{}`          | Global properties (unused) |
| `tilesets`      | table  | See source    | Tileset definitions |
| `layers`        | table  | See source    | Map layers (tile and object layers) |

## Main functions
This file exports a static data table and contains no functions.

## Events & listeners
This file contains no event logic or listeners.