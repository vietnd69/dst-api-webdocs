---
id: skeleton_trapper
title: Skeleton Trapper
description: A static layout configuration for a skeleton trapper scene, defining placement of entities like traps, birds, and food within a Tiled map structure.
tags: [map, layout, static]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 5ccc1c45
system_scope: environment
---

# Skeleton Trapper

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a Tiled JSON-style map layout used to define static placements of game entities (e.g., traps, spoiled food, a skeleton, blueprint) for a "skeleton trapper" scene. It is not an ECS component, but rather a data file that specifies object positions, types, and metadata for world generation or scene setup. The layout is embedded in Lua as a table and is likely consumed by map loading or procedural generation systems.

## Usage example
This file is not instantiated as a component. Instead, it is returned directly and used by the worldgen/map system:
```lua
-- Example usage by worldgen system (not modder-facing):
local layout = require("map/static_layouts/skeleton_trapper")
-- The layout data is used internally to place objects like traps and spoiled food
-- in the world during map generation.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `12` | Map width in tiles. |
| `height` | number | `12` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels (for layout rendering). |
| `tileheight` | number | `16` | Height of each tile in pixels (for layout rendering). |
| `tilesets` | table | See source | Tileset definitions for background tiles. |
| `layers` | table | See source | Layer definitions, including tile and object layers. |

## Main functions
Not applicable. This file only defines a static data structure.

## Events & listeners
Not applicable. This file does not define any runtime behavior, events, or listeners.

## Layers
### `BG_TILES`
A tile layer (`type = "tilelayer"`) named `"BG_TILES"` with 12x12 dimensions. All tile IDs are `0`, indicating empty background.

### `FG_OBJECTS`
An object group (`type = "objectgroup"`) named `"FG_OBJECTS"` containing placed entities:
- **skeleton**  
  Position: `x=122, y=118`  
  Used as a reference point or placeholder for skeleton entity placement.
- **trap** (2 instances)  
  Positions: `x=172, y=55` and `x=99, y=167`  
  Likely corresponds to in-game snare or deadfall traps.
- **birdtrap** (2 instances)  
  Positions: `x=89, y=82` and `x=111, y=16`  
  Likely corresponds to in-game bird traps.
- **bushhat**  
  Position: `x=156, y=146`  
  Represents a decorative or functional bush hat object.
- **rope** (2 instances)  
  Positions: `x=44, y=101` and `x=184, y=103`  
  Used for rope decoration or mechanics.
- **spoiled_food** (3 instances)  
  Positions: `x=61, y=155`, `x=32, y=145`, `x=36, y=177`  
  Placed as environmental clutter or loot.
- **blueprint**  
  Position: `x=64, y=48`  
  Metadata includes `data.recipetouse = "birdtrap"`, indicating this object allows crafting of bird traps.

## Notes
- This file is **not** a component and does not attach to entities via `AddComponent`.
- Positions (`x`, `y`) are in pixels relative to the map origin.
- The `shape = "rectangle"` and `width=height=0` for all objects suggest positional markers rather than collision areas.
- The file is imported directly via `require("map/static_layouts/skeleton_trapper")` and is likely parsed by map-related logic during world initialization.