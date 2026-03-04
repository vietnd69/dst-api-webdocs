---
id: balatro
title: Balatro
description: Static map layout file defining the layout and static entities for the Balatro arena stage in Don't Starve Together.
tags: [map, layout, static, arena]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: eb89e069
---

# Balatro

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file is a Tiled map JSON export (version 1.1) representing the static layout of the Balatro arena stage. It defines the background tile grid (`BG_TILES`), foreground object placements (`FG_OBJECTS`), and associated properties (e.g., pickable berry bushes, fixed interactive areas like `balatro_machine` and `balatro_card_area`). It is used during world generation to instantiate the arena environment with pre-defined static geometry and assets.

## Usage example
This file is not a component and is not instantiated via `inst:AddComponent()`. It is consumed by the world generation system during map loading. A typical usage path in the engine would be:
```lua
-- Not a component, so direct instantiation does not apply.
-- The engine loads this JSON via map loading utilities (e.g., `WorldGen:LoadStaticLayout(...)`),
-- which converts it into in-game entities and tile data.
```

## Dependencies & tags
**Components used:** None — this is a static map definition and not an ECS component. It is processed by the world generation engine to spawn prefabs and tiles.

**Tags:** None identified.

## Properties
This file is a top-level JSON map structure, not a component. It does not define properties on an entity or component instance. The table below summarizes the top-level map attributes present in the file:

| Property       | Type     | Default Value | Description                                                  |
|----------------|----------|---------------|--------------------------------------------------------------|
| `version`      | string   | `"1.1"`       | Tiled map format version.                                    |
| `luaversion`   | string   | `"5.1"`       | Lua version metadata embedded by Tiled export.               |
| `orientation`  | string   | `"orthogonal"`| Tile orientation type.                                       |
| `width`        | integer  | `12`          | Map width in tiles.                                          |
| `height`       | integer  | `12`          | Map height in tiles.                                         |
| `tilewidth`    | integer  | `16`          | Width of each tile in pixels.                                |
| `tileheight`   | integer  | `16`          | Height of each tile in pixels.                               |
| `properties`   | table    | `{}`          | Global map properties (empty in this layout).                |
| `tilesets`     | table    | `[...]`       | List of tileset definitions (contains one tileset: `"tiles"`). |
| `layers`       | table    | `[...]`       | List of layers: background tile layer `BG_TILES` and object group `FG_OBJECTS`. |

## Main functions
This file contains no Lua code — it is a static data file in JSON format. It defines layout data only, and does not implement any functional logic.

## Events & listeners
This file defines no events or listeners, as it is not a runtime component and contains no executable Lua logic.