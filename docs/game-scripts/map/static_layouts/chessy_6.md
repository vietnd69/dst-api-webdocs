---
id: chessy_6
title: Chessy 6
description: A static map layout file defining tile-based background structures and object placements for a chess-themed arena.
tags: [map, layout, static]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 59ca08f1
system_scope: world
---

# Chessy 6

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
`chessy_6.lua` is a static map layout definition used to programmatically generate a predefined arena environment in Don't Starve Together. It specifies tile-based background geometry (`BG_TILES` layer) and named object placements (`FG_OBJECTS` group), such as pieces (e.g., `knight`, `bishop`) positioned at grid-aligned coordinates. This file is not an ECS component but a static data structure imported during world generation to instantiate visual and possibly gameplay-relevant terrain features.

## Usage example
This file is not used directly as a component. It is typically consumed by world generation systems that parse Tiled map format (`orientation = "orthogonal"`, `encoding = "lua"`) to populate rooms or events. A typical invocation in worldgen code would be:

```lua
local map = require "map/static_layouts/chessy_6"
-- The map table is passed to a layout loader, e.g.:
world:LoadStaticLayout(map, {x = 0, y = 0})
```

## Dependencies & tags
**Components used:** None — this file is a pure data table and does not interact with components directly.  
**Tags:** None identified.

## Properties
No public properties are defined within this file. It returns a single table containing metadata and structure for a Tiled map, as documented below.

| Key | Type | Default Value | Description |
|-----|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua runtime version targeted by the encoded data. |
| `orientation` | string | `"orthogonal"` | Tile arrangement orientation (only `orthogonal` supported). |
| `width` / `height` | number | `16` | Dimensions of the map in tiles. |
| `tilewidth` / `tileheight` | number | `16` | Size of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (unused here). |
| `tilesets` | array | (see source) | Tileset definitions (single tileset referencing a PNG image). |
| `layers` | array | (see source) | Layer definitions: `BG_TILES` (tile layer), `FG_OBJECTS` (object group). |

## Main functions
This file defines no functions. It returns a static data table.

## Events & listeners
None — this is a data-only file with no runtime behavior or event interaction.