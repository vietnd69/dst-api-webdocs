---
id: warzone_1
title: Warzone 1
description: Defines a static battle arena layout for special events, containing spawn positions for enemy units such as pigmen and mermen.
tags: [event, layout, spawn]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: c9d7eae5
system_scope: world
---
# Warzone 1

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`warzone_1` is a static layout definition for a battle arena used in DST events. It specifies a 16×16 tile grid with a background tile layer (`BG_TILES`) and an object group (`FG_OBJECTS`) containing placement markers for enemy units (pigmen and mermen). This file is part of the map/static_layouts directory and is consumed by the worldgen/event system to instantiate arena elements during gameplay.

## Usage example
```lua
-- This file is not a component or logic script; it is a Tiled Map Editor JSON/Lua export.
-- It is loaded and parsed by the map loader (e.g., via `Map.BuildStaticLayout()` or similar).
-- Modders typically do not interact with it directly — it defines event arena geometry.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version. |
| `luaversion` | string | `"5.1"` | Lua version target for export. |
| `orientation` | string | `"orthogonal"` | Map projection type. |
| `width` | number | `16` | Map width in tiles. |
| `height` | number | `16` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets[1].name` | string | `"tiles"` | Name of the tileset image. |
| `layers[1].name` | string | `"BG_TILES"` | Background tile layer name. |
| `layers[2].name` | string | `"FG_OBJECTS"` | Object layer with entity spawn markers. |
| `layers[2].objects` | table | — | Array of spawn objects, each with `type`, `x`, `y`. |

## Main functions
Not applicable — this file returns static configuration data only.

## Events & listeners
Not applicable — no event interaction defined.

