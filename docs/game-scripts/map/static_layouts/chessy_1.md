---
id: chessy_1
title: Chessy 1
description: Static map layout definition for a chess-themed environment containing background tiles and placed objects such as knight, skeleton, gears, and spear entities.
tags: [map, layout, static]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 3d1b520c
system_scope: world
---

# Chessy 1

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file defines a static map layout used in Don't Starve Together's world generation system. It specifies a 16x16 tile grid (`width = 16`, `height = 16`) with 64x64 pixel tiles (scaled from the 16x16 logical grid via `tilewidth = tileheight = 16`). The layout consists of two layers:
- A background tile layer (`BG_TILES`) that places visual tile ID `11` at specific coordinates to form decorative patterns (e.g., sparse placements suggesting chessboard motifs).
- A foreground object group (`FG_OBJECTS`) listing entity placements by type: `knight`, `skeleton`, `gears`, and `spear`. Each object is defined by its position (`x`, `y`) and type, without dimension data.

This layout does not contain executable Lua code, components, or ECS logic. Instead, it is a data file consumed by the game's tilemap loader (likely via Tiled map parsing utilities) to instantiate world geometry and spawn prefabs at runtime.

## Usage example

This file is not used directly as a component in the ECS. It is loaded during world generation (likely via `map/levels/...` or `map/rooms/...` configurations) to populate a room or area:

```lua
-- Example how such a layout file might be referenced (not actual API usage for this file):
-- In a room or level definition:
rooms.chessy_1 = require("map/static_layouts/chessy_1")
-- The engine uses `rooms.chessy_1` to parse tile data and spawn objects.
```

## Dependencies & tags

**Components used:** None identified.

**Tags:** None identified.

## Properties

No public variables or instance properties are defined within this file. It is a pure data structure returning a table with Tiled map format fields.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled format version |
| `luaversion` | `string` | `"5.1"` | Lua version compatibility |
| `orientation` | `string` | `"orthogonal"` | Map orientation type |
| `width`, `height` | `number` | `16` | Grid dimensions in tiles |
| `tilewidth`, `tileheight` | `number` | `16` | Logical tile size (pixels scaled via tilesets) |
| `properties` | `table` | `{}` | Custom map properties (unused here) |
| `tilesets` | `table[]` | See source | Tileset definitions including image path and firstgid |
| `layers` | `table[]` | See source | Layer definitions: `BG_TILES` (tile layer), `FG_OBJECTS` (object group) |

## Main functions

This file contains no functions — only static data.

## Events & listeners

This file contains no event listeners or event emitters.