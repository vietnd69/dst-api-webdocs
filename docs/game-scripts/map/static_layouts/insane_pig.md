---
id: insane_pig
title: Insane Pig
description: Defines a static map layout for a world region containing pig-related structures and environmental assets.
tags: [world, layout, static, environment]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: d9086a88
system_scope: world
---

# Insane Pig

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout named `insane_pig`, represented as a Tiled JSON-compatible Lua table structure. It specifies a 16x16 tile grid (with 16x16 pixel tiles) containing background tile data and an object layer with placement instructions for environmental assets such as basalt rocks, sanity rocks, and a pig house. Static layouts like this are used during world generation to embed fixed room layouts into the game world—commonly for biomes or special zones. This particular layout appears to be a Pig-themed environment with structured placement of decorative and functional entities.

The file is not a runtime component in the ECS sense; it is a data definition consumed by the world generation system to instantiate static content.

## Usage example
This file is typically loaded and used by the world generation system. While not used directly in modder code as a component, here is how such a layout would be referenced in worldgen logic (for illustrative purposes):

```lua
local InsanePigLayout = require("map/static_layouts/insane_pig")
-- Internally, the worldgen engine loads and applies this data to place assets on the grid.
-- Example internal usage (not modder-facing):
-- local layout = InsanePigLayout
-- local x, y = 100, 200
-- world:SpawnStaticLayout(layout, x, y)
```

## Dependencies & tags
**Components used:** None. This is a pure data file with no runtime components or method calls.
**Tags:** None identified.

## Properties
The file is a top-level Lua table with the following static properties (no constructor, no runtime behavior):

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled compatibility version. |
| `luaversion` | `string` | `"5.1"` | Lua version target. |
| `orientation` | `string` | `"orthogonal"` | Map orientation type. |
| `width` | `number` | `16` | Map width in tiles. |
| `height` | `number` | `16` | Map height in tiles. |
| `tilewidth` | `number` | `16` | Width of each tile in pixels. |
| `tileheight` | `number` | `16` | Height of each tile in pixels. |
| `properties` | `table` | `{}` | Global map properties (currently unused). |
| `tilesets` | `table` | (see source) | Tileset definitions, referencing a sprite image. |
| `layers` | `table` | (see source) | Array of layer definitions (tile layer + object group). |

## Main functions
None. This file only returns static data and contains no runtime logic or functions.

## Events & listeners
None. This file does not interact with DST’s event system.