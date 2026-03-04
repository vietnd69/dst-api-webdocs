---
id: maxwell_7
title: Maxwell 7
description: Map layout definition for the Maxwell 7 world generation template, specifying background tiles and placed objects.
tags: [world, map, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 53cf2efc
system_scope: world
---

# Maxwell 7

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`maxwell_7` is a static map layout used by the world generation system to define the visual and structural layout of a specific pre-designed map section. It specifies tile-based background layers and object placements (such as marble trees, evil flowers, statues, and knights) using Tiled Map Editor format data. This file is consumed by the worldgen system to instantiate static content in the game world, not a runtime entity component.

## Usage example
Static layouts like this are typically referenced in worldgen task sets or scenarios and loaded automatically during world initialization:
```lua
-- Example usage within worldgen context (not direct instantiation)
local layout = require "map/static_layouts/maxwell_7"
-- The layout data is used internally by the worldgen system to spawn prefabs
-- based on the 'type' field of objects in the FG_OBJECTS group.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled Map Editor format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `28` | Map width in tiles. |
| `height` | number | `28` | Map height in tiles. |
| `tilewidth` | number | `16` | Tile width in pixels. |
| `tileheight` | number | `16` | Tile height in pixels. |
| `tilesets` | table | *see source* | Tileset definitions including image path and dimensions. |
| `layers` | table | *see source* | Layer definitions, including background tile layer and object group. |

## Main functions
Not applicable. This file returns a static data structure; it does not define executable functions.

## Events & listeners
Not applicable. This file contains no runtime logic or event handling.