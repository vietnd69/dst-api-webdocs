---
id: teleportato_crank_layout
title: Teleportato Crank Layout
description: Static tilemap layout for the Teleportato crank area, defining background tiles and object placements in the game world.
tags: [world, map, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 1202e5f4
system_scope: world
---

# Teleportato Crank Layout

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static layout for the Teleportato crank area in the game world. It is not a component in the ECS sense but rather a Tiled map data structure (JSON-compatible Lua table) used by the world generation system to place visual tiles and game objects (e.g., `teleportato_crank`, `flower_evil`, `pighouse`) at fixed coordinates during level construction. The layout includes a background tile layer (`BG_TILES`) and an object layer (`FG_OBJECTS`) specifying entity placements.

## Usage example
Static layouts like this are typically loaded and processed internally by the worldgen system during map construction. Modders do not manually instantiate them. Example usage in worldgen context:
```lua
-- Internally used by worldgen/levels/specific_world.lua
local layout = require "map/static_layouts/teleportato_crank_layout"
WorldGen.AddStaticLayout(layout)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version expected by the map. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `28` | Map width in tiles. |
| `height` | number | `28` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (empty). |
| `tilesets` | table | see source | Array of tileset definitions (e.g., ground tileset). |
| `layers` | table | see source | Array of layers: `BG_TILES` (tile layer), `FG_OBJECTS` (object group). |

## Main functions
Not applicable — this is a static data structure, not a component with functions.

## Events & listeners
Not applicable — no events are defined or referenced in this layout file.