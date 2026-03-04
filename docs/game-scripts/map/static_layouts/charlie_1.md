---
id: charlie_1
title: Charlie 1
description: Static map layout definition for Charlie's first phase encounter using Tiled map format, specifying background tiles and a stage post object.
tags: [map, static_layout, charlie, boss]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 9f10b9aa
system_scope: world
---

# Charlie 1

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout in Tiled JSON-compatible format for Charlie's first phase encounter. It specifies a 20x20 tile grid with 16x16 pixel tiles, using a single tileset (`tiles.png`). The layout contains a background tile layer (`BG_TILES`) with specific tile IDs placed at fixed coordinates and an object group (`FG_OBJECTS`) containing a single object marked as type `charlie_stage_post`, likely used as a positional anchor for boss mechanics or visual effects. As a static layout file, it is consumed during world generation to instantiate a predefined geometry without dynamic runtime behavior.

## Usage example
Static layout files like this one are loaded automatically by the world generation system and are not directly instantiated as components in Lua code. However, the game engine references such files via static layout loaders (e.g., `static_layouts.lua` or `archive_worldgen.lua`). The structure conforming to this file might be referenced in a task or level configuration as:

```lua
local layout = require "map/static_layouts/charlie_1"
-- The layout data is processed internally by the map loader to spawn tiles and objects
-- No direct Lua component interaction is performed on this file at runtime
```

## Dependencies & tags
**Components used:** None — this is a pure data file, not a Lua component.

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Target Lua version (for compatibility notes) |
| `orientation` | string | `"orthogonal"` | Map rendering orientation |
| `width` | integer | `20` | Map width in tiles |
| `height` | integer | `20` | Map height in tiles |
| `tilewidth` | integer | `16` | Pixel width of each tile |
| `tileheight` | integer | `16` | Pixel height of each tile |
| `properties` | table | `{}` | Map-level custom properties (unused here) |
| `tilesets` | table | (see source) | Tileset definitions, including image path and tile dimensions |
| `layers` | table | (see source) | Layer definitions (`BG_TILES` and `FG_OBJECTS`) |

## Main functions
No functional code exists in this file. It is a data structure only.

## Events & listeners
No events or listeners are associated with this file.