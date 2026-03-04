---
id: chess_blocker_b
title: Chess Blocker B
description: Defines the layout and object configuration for a chess-themed static map zone, including background tiles and placed objects such as marble pillars, marble trees, and chess-piece prefabs.
tags: [map, worldgen, staticlayout]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: f4a69969
system_scope: world
---

# Chess Blocker B

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file is a static layout definition used in Don't Starve Together's world generation system. It specifies the layout of a zone named "chess_blocker_b" using Tiled Map Editor format. The layout includes:
- A 40x40 tile layer (`BG_TILES`) containing background tile IDs (mostly `0`, with selective non-zero entries at specific coordinates).
- An object layer (`FG_OBJECTS`) that defines placement positions for various prefabs, including `marblepillar`, `marbletree`, `bishop`, `knight`, `rook`, and `flower_area`.

The file is used during world generation to spawn static geometry (e.g., terrain features and decorative prefabs) in a predefined arrangement, likely as a visual or structural barrier or thematic zone (e.g., in a chess-based event or grotto).

Note: This is a *data-only* layout file — it does not define a component with logic or behavior. It does not attach to entities via `inst:AddComponent` nor implement any ECS logic. It is consumed by the engine's static layout loader to instantiate prefabs and place background tiles.

## Usage example
This file is loaded automatically by the engine during world generation via the static layout system and is not instantiated manually. Modders typically reference it indirectly by including it in a `taskset` or `level` definition.

For example, in a worldgen configuration or level/taskset script:

```lua
-- In a level or taskset script (e.g., map/levels/...)
local static_layouts = require "map/static_layouts/chess_blocker_b"
-- The engine will parse this file and instantiate background tiles and fg_objects as specified
```

There is no direct component usage or function calling.

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  
This file does not reference or modify any components, tags, or run any Lua logic. It is purely declarative map data.

## Properties
No properties are defined in a component sense. This file returns a Lua table representing a Tiled JSON-compatible structure with the following top-level keys:

| Key | Type | Value | Description |
|-----|------|-------|-------------|
| `version` | string | `"1.1"` | Tiled map version |
| `luaversion` | string | `"5.1"` | Lua version hint |
| `orientation` | string | `"orthogonal"` | Tilemap orientation |
| `width` | number | `40` | Map width in tiles |
| `height` | number | `40` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile |
| `tileheight` | number | `16` | Height of each tile |
| `properties` | table | `{}` | Global map properties (empty) |
| `tilesets` | table | See source | Array of tileset definitions |
| `layers` | table | See source | Array of layers: tile layer + object group |

The `tilesets` and `layers` arrays define render and placement metadata — not component properties.

## Main functions
No functions are defined in this file. It is a plain data table return and does not implement any methods.

## Events & listeners
None — this file does not implement event handling or registration.