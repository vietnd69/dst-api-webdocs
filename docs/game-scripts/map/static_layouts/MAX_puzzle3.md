---
id: MAX_puzzle3
title: Max Puzzle3
description: A static map layout definition for a puzzle chamber used in the MAX encounter sequence, containing background tiles and foreground object placements.
tags: [map, puzzle, max, static_layout]
sidebar_position: 10
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: bf964189
---
# Max Puzzle3

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
`MAX_puzzle3.lua` is a static map layout definition used within the Don't Starve Together world generation system. It defines a 40x40 tile grid (each tile 16x16 pixels) in orthogonal orientation for a dedicated puzzle chamber area. This file specifies background tile layer data and foreground object placements (e.g., `rock1`, `rock2`, `wall_stone`, `wall_wood`) via a Tiled Map Editor-compatible structure. It is part of the `map/static_layouts/` directory and is likely consumed by world generation tasks or event triggers related to the MAX boss encounter sequence.

The component does not implement a traditional ECS component with methods or event logic. Instead, it is a declarative data structure describing pre-designed terrain and object placements.

## Usage example
This file is not instantiated as a component but loaded as a map layout definition. It is referenced internally by the game's map generation system during world initialization, typically via task or room loading logic:

```lua
-- Example conceptual usage by the engine (not user-facing)
local layout = require "map/static_layouts/MAX_puzzle3"
-- The engine processes 'layers' and 'objects' to spawn tiles and prefabs
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No properties are defined in the traditional ECS component sense. The file exports a Lua table with static layout metadata.

| Field | Type | Value | Description |
|-------|------|-------|-------------|
| `version` | `string` | `"1.1"` | Tiled map format version |
| `luaversion` | `string` | `"5.1"` | Target Lua version |
| `orientation` | `string` | `"orthogonal"` | Tilemap orientation mode |
| `width` | `number` | `40` | Map width in tiles |
| `height` | `number` | `40` | Map height in tiles |
| `tilewidth` | `number` | `16` | Tile width in pixels |
| `tileheight` | `number` | `16` | Tile height in pixels |
| `properties` | `table` | `{}` | Unused map-level properties |
| `tilesets` | `table` | (see source) | Tileset definitions including texture paths |
| `layers` | `table` | (see source) | Array of `"BG_TILES"` (tile layer) and `"FG_OBJECTS"` (object group) |

## Main functions
This file contains no functional methods. It is a pure data export and does not expose any callable functions.

## Events & listeners
This file does not register or emit any events. It is a passive layout definition.

