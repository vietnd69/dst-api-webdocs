---
id: chess_spot2
title: Chess Spot2
description: A static map layout used in the game world, containing background tiles and object placements for a specific map area.
tags: [map, layout, static]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 1dce236d
system_scope: environment
---
# Chess Spot2

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout in Tiled JSON format (Lua syntax) for use in Don't Starve Together's world generation. It specifies a 12x12 tile grid (`width=12`, `height=12`, `tilewidth=16`, `tileheight=16`) and includes:
- A background tile layer (`BG_TILES`) with sparse tile data.
- An object layer (`FG_OBJECTS`) that specifies placements for specific prefab instances (`flower_evil` and `evil_thing`), used to populate the game world with decorative or functional entities.

This layout is part of the `map/static_layouts/` directory and is likely applied during world generation or level setup, where static layouts define fixed environmental content.

## Usage example
Static layouts like this are not instantiated as components but loaded and processed by the world generation system. They are typically referenced or injected via worldgen tasksets. A conceptual example of how such a layout might be used internally (not direct usage) is:

```lua
-- Example: Internal worldgen usage (not user-modifiable)
local layout = require("map/static_layouts/chess_spot2")
worldgen:AddStaticLayout(layout, x, y, z)
```

## Dependencies & tags
**Components used:** None — this is a data-only file defining static world content.
**Tags:** None — this file does not interact with entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled export version. |
| `luaversion` | `string` | `"5.1"` | Lua version target for encoded data. |
| `orientation` | `string` | `"orthogonal"` | Map rendering orientation. |
| `width` | `number` | `12` | Map width in tiles. |
| `height` | `number` | `12` | Map height in tiles. |
| `tilewidth` | `number` | `16` | Width of each tile in pixels. |
| `tileheight` | `number` | `16` | Height of each tile in pixels. |
| `properties` | `table` | `{}` | Map-level custom properties (empty here). |
| `tilesets` | `table[]` | See source | List of tileset definitions (e.g., ground texture). |
| `layers` | `table[]` | See source | Layers in the map: tile layers (e.g., `BG_TILES`) and object groups (e.g., `FG_OBJECTS`). |

## Main functions
No functional methods — this file is a data definition and returns a static table.

## Events & listeners
No events or listeners — this is a passive data file with no runtime behavior.

