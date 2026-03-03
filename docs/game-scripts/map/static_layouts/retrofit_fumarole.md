---
id: retrofit_fumarole
title: Retrofit Fumarole
description: Defines a static map layout for a fumarole region in the Caves, using Tiled map format with tile layers and object groups to place props and spawners.
tags: [map, worldgen, props, spawner]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: eedf6680
system_scope: world
---

# Retrofit Fumarole

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout definition for a fumarole-themed area in the Caves. It is not an ECS component, but a standalone Lua table conforming to the Tiled JSON-exported format (v1.1), used by the world generation system to place visual and functional objects. It contains:
- A single tile layer (`BG_TILES`) for background floor tiles (tile ID 52 used consistently).
- An object group (`FG_OBJECTS`) listing prefabs to instantiate, including:
  - `cave_vent_rock` — decorative vent rocks.
  - `tree_rock` — large rock formations.
  - `cave_fern_withered`, `flower_cave_withered`, `flower_cave_double_withered`, `flower_cave_triple_withered` — withered flora.
  - `cave_vent_mite_spawner`, `shadowthrall_centipede_spawner` — entity spawners for fauna.
  - `retrofit_fumaroleteleporter` — a teleporter anchor.

It serves as a blueprint consumed during worldgen to populate the fumarole biomes in the Caves.

## Usage example
This file is loaded by the engine during world generation and not directly instantiated by modders.

```lua
-- Internally used like this (simplified pseudocode):
local layout = require("map/static_layouts/retrofit_fumarole")
-- layout.version, layout.width, layout.height, layout.layers[]
-- The game's map builder parses 'layers' and spawns prefabs from 'FG_OBJECTS'.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified — this file is data-only and does not manipulate tags.

## Properties
No public properties in the ECS sense — this is a data structure.

| Field | Type | Default Value | Description |
|-------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `30` | Map width in tiles. |
| `height` | number | `30` | Map height in tiles. |
| `tilewidth` | number | `64` | Tile width in pixels. |
| `tileheight` | number | `64` | Tile height in pixels. |
| `tilesets` | table | — | Array of tileset definitions. |
| `layers` | table | — | Array of map layers (tile and object groups). |

## Main functions
Not applicable — this is a pure data module returning a static table.

## Events & listeners
Not applicable — this module does not listen to or push events.