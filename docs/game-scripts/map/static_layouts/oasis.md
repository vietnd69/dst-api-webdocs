---
id: oasis
title: Oasis
description: Defines the static layout for an oasis environment using Tiled map data, specifying background tiles and foreground object placements.
tags: [map, environment, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 95ed3603
system_scope: environment
---

# Oasis

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
The `oasis` file defines a static map layout for an in-game oasis area. It uses Tiled JSON-style data to specify tile layers (background tiles) and object groups (foreground entities like trees, lakes, and items). This layout is consumed by the world generation system to place consistent environmental features in specific map locations. It does not implement any ECS component logic — it is a pure data structure used at load time.

## Usage example
This file is not instantiated or used directly in mod code. Instead, it is referenced internally by the world generation system. A typical integration point is in a task or level definition, where it might be referenced as a static layout:

```lua
-- In a level or task definition file
local oasis_layout = require "map/static_layouts/oasis"
-- The layout data is then used by worldgen systems to spawn the oasis
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used by Tiled export. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `40` | Map width in tiles. |
| `height` | number | `40` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (unused). |
| `tilesets` | table | `{{...}}` | Array of tileset definitions (contains one entry for "ground"). |
| `layers` | table | `{{...}, {...}}` | Array of layers: `"BG_TILES"` (tile layer), `"FG_OBJECTS"` (object group). |

## Main functions
Not applicable — this file returns a static data structure and contains no executable functions.

## Events & listeners
Not applicable — this file is a passive data definition and does not listen to or push events.