---
id: chessy_4
title: Chessy 4
description: A static map layout definition for a custom game area, specifying background tiles and object placements using Tiled Map Editor format.
tags: [map, static, layout, level-design]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 13351f7c
system_scope: world
---

# Chessy 4

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

`chessy_4.lua` defines a static map layout used in Don't Starve Together, structured in the Tiled Map Editor format. It declares map metadata (dimensions, tile size), a single background tile layer with tile IDs, and an object group containing named entity placements. This file is used by the world generation system to instantiate static environments at runtime — it does not contain logic or behavior code, but rather serves as a declarative description of map geometry and object positions. It is self-contained with no component dependencies or runtime logic.

## Usage example

This file is not instantiated as a component; it is loaded by the engine as a map layout definition. Example usage within the game's world generation system would look like:

```lua
local layout = require "map.static_layouts.chessy_4"
-- The layout table is consumed by the level/room generator to place entities and tiles
-- No component attachment is required; the layout is referenced directly in level/room configs
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Lua version used (historical compatibility) |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `16` | Map width in tiles |
| `height` | number | `16` | Map height in tiles |
| `tilewidth` | number | `16` | Tile width in pixels (logical) |
| `tileheight` | number | `16` | Tile height in pixels (logical) |
| `properties` | table | `{}` | Map-level custom properties (unused here) |
| `tilesets` | table | — | Array of tileset definitions; contains one entry with path to `tiles.png` and tile metadata |
| `layers` | table | — | Array of map layers: one `tilelayer` (`BG_TILES`) and one `objectgroup` (`FG_OBJECTS`) |

## Main functions
No executable functions are present. This file returns a plain table representing static map data.

## Events & listeners
None — this is a static data file with no runtime event behavior.