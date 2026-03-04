---
id: chessy_5
title: Chessy 5
description: Static map layout definition for a 16x16 grid used in DST world generation, containing background tiles and foreground object placements for a decorative/chess-themed scene.
tags: [map, level-design, static-layout, worldgen]
sidebar_position: 10
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: ef9ea33d
system_scope: world
---
# Chessy 5

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

`chessy_5.lua` is a static map layout definition used by Don't Starve Together's world generation system. It defines a fixed 16x16 tile-based layout that includes background tile placement and object placements (such as flowers, statues, and chess pieces like knight and bishop) in a foreground object layer. This file is consumed by the map loading system (typically via `static_layouts.lua` consumers) to place decorative and thematic elements in the game world—specifically to evoke a chessboard-inspired aesthetic. It does not implement logic, nor is it an ECS component; rather, it is data that informs level construction.

## Usage example

This file is not instantiated as a component but is loaded as a data structure during world generation. A typical usage is when a task or room generator calls `STATIC_LAYOUTS["chessy_5"]` to fetch and apply this layout. For reference, the structure is loaded as plain Lua table data:

```lua
local layout = require "map/static_layouts/chessy_5"
-- layout.version, layout.layers, layout.width, etc. are available
-- The layout is applied by passing it to the appropriate room or task generation helper
```

Note: Do not manually call `require` during gameplay initialization unless you are within the worldgen context. The engine handles loading and parsing such layouts internally.

## Dependencies & tags
**Components used:** None (this is data-only, not an ECS component).
**Tags:** None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled format version |
| `luaversion` | `string` | `"5.1"` | Lua version requirement |
| `orientation` | `string` | `"orthogonal"` | Map rendering orientation |
| `width` | `number` | `16` | Map width in tiles |
| `height` | `number` | `16` | Map height in tiles |
| `tilewidth` | `number` | `16` | Width of each tile in pixels |
| `tileheight` | `number` | `16` | Height of each tile in pixels |
| `properties` | `table` | `{}` | Unused custom map properties |
| `tilesets` | `table` | See source | Tileset definition (single set: `tiles.png`) |
| `layers` | `table` | See source | Array of layers (2 layers: `BG_TILES`, `FG_OBJECTS`) |

## Main functions

This file defines no functions—only static data. It returns a Lua table literal and is intended for loading by the map/system code. No methods or callable functions exist within.

## Events & listeners

No events or listeners are associated with this file, as it is a static layout data definition and does not participate in runtime logic.

