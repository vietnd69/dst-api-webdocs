---
id: bullkelpfarmmedium
title: Bullkelpfarmmedium
description: Defines a Tiled map layout for a medium-sized bull kelp farm static map, containing tile layer data and object group definitions for kelp placement and a driftwood log.
tags: [map, static_layout, kelp, environment]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 00388f29
system_scope: world
---

# Bullkelpfarmmedium

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout for a medium-sized bull kelp farm in DST's map generation system. It is a Tiled JSON-serialized map configuration (stored in Lua format) used to generate recurring environmental features in the game world. The layout consists of a 4x4 tile grid (with 64x64 px tiles) and an object group (`FG_OBJECTS`) that specifies rectangular zones marked as `kelp_area` (representing bull kelp growth zones) and one `driftwood_log`. These objects are likely used during world generation to place in-game assets (e.g., `bullkelp` or related prefabs) and provide environmental context for gameplay or aesthetics.

## Usage example
Static layouts like this one are consumed by DST's map/task systems and are not directly instantiated as components. However, when integrated into world generation, typical usage occurs via `map/tasks/caves.lua` or similar task definitions:

```lua
-- Example of how static_layouts/bullkelpfarmmedium.lua is consumed (not from this file)
MapRoom.Add("bullkelpfarmmedium", {
    width = 4,
    height = 4,
    -- ... other setup
})
```
Developers working on custom static layouts should ensure proper structure matching the Tiled export format (tile layer, object groups with named types), but this file itself is a data definition, not a runtime component.

## Dependencies & tags
**Components used:** None (this file contains only map data and does not define or access any Lua components).  
**Tags:** None identified.

## Properties
The file is a plain Lua table representing a Tiled map structure. Public fields are as follows:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled version used for the export. |
| `luaversion` | `string` | `"5.1"` | Lua version target (for backwards compatibility). |
| `orientation` | `string` | `"orthogonal"` | Tile orientation used (standard rectangular grid). |
| `width` | `number` | `4` | Map width in tiles. |
| `height` | `number` | `4` | Map height in tiles. |
| `tilewidth` | `number` | `64` | Width of each tile in pixels. |
| `tileheight` | `number` | `64` | Height of each tile in pixels. |
| `properties` | `table` | `{}` | Map-level custom properties (empty in this layout). |
| `tilesets` | `table` | (see source) | Array of tileset definitions, including `ground` tileset and image reference. |
| `layers` | `table` | (see source) | Array of layers: `BG_TILES` (background tile layer) and `FG_OBJECTS` (foreground object group). |

## Main functions
This file contains no Lua functions. It is a static data definition.

## Events & listeners
This file does not define or interact with any events or listeners.