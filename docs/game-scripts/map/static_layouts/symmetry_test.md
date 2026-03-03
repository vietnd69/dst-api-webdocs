---
id: symmetry_test
title: Symmetry Test
description: A test map layout file used to validate symmetry in map rendering and object placement.
tags: [test, map, layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 9081c440
system_scope: environment
---

# Symmetry Test

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`symmetry_test.lua` is a static layout definition used internally for testing map rendering symmetry and object alignment. It defines a 20x20 tile grid (16x16 pixels per tile) with background tile data and foreground object placements. The file does not implement any ECS component logic — it is a pure data structure, typically loaded by world generation or testing tools to verify symmetric placement of entities and tiles.

## Usage example
This file is not intended for direct component usage. It is returned as a Lua table by map loading systems and consumed by the world generation pipeline. Example usage in a test context:

```lua
-- Simulate loading and inspecting the layout
local layout = require("map/static_layouts/symmetry_test")
print("Width:", layout.width, "Height:", layout.height)
-- Output: Width: 20 Height: 20
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility target. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `20` | Map width in tiles. |
| `height` | number | `20` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (empty in this layout). |
| `tilesets` | table | Non-empty array | Tileset definitions including ground tiles. |
| `layers` | table | Non-empty array | Layer definitions: `BG_TILES` and `FG_OBJECTS`. |

## Main functions
Not applicable.

## Events & listeners
Not applicable.