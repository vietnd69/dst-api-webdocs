---
id: small_boon
title: Small Boon
description: A static map layout file defining the layout and object placement for a small boon chamber in the world generation system.
tags: [world, map, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 38272f06
system_scope: world
---

# Small Boon

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`small_boon.lua` is a static layout definition for a small boon chamber in the DST world generation system. It specifies the tile layout, object placement, and metadata (e.g., dimensions, orientation) for a compact map area. Unlike typical ECS components, this file is a data structure used by the map/room generation system to instantiate pre-defined chamber layouts.

## Usage example
This file is not added as a component to an entity. Instead, it is loaded by the world generation system (e.g., via `map/tasks/caves.lua`) to construct instances of small boon chambers. Example of how it may be referenced internally:
```lua
-- Pseudocode illustration — actual loading handled by map/task systems
local layout = require("map/static_layouts/small_boon")
local inst = CreateEntity()
inst:AddTag("small_boon_chamber")
-- Layout data is used by room spawner logic to position tiles/objects
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `small_boon_chamber` to the generated entity via room spawner logic (not in this file itself).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used for encoding. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `8` | Map width in tiles. |
| `height` | number | `8` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | `...` | Tileset definitions (e.g., tile texture, size). |
| `layers` | table | `...` | Layer definitions: tile layers (`BG_TILES`) and object groups (`FG_OBJECTS`). |
| `properties` | table | `{}` | Map-level properties (empty here). |

## Main functions
This file defines only a data structure (a Lua table) and exports it as the return value. It contains no executable functions.

## Events & listeners
None identified.