---
id: chessy_3
title: Chessy 3
description: Static layout map definition for a chess-themed room used in the game's world generation system.
tags: [map, layout, static]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 74becd6d
system_scope: world
---

# Chessy 3

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
`chessy_3.lua` is a static layout definition for a room used in the game's world generation system. It is a 16x16 grid-based layout with tile data (background layer) and object placements (foreground objects). The room uses custom tileset `tiles.png` and includes placeholder objects (e.g., `rook`, `skeleton`, `backpack`, `spoiled_food`, `bandage`) identified by `type` in an object group. Static layouts like this are typically consumed by the worldgen system to instantiate map rooms procedurally, not used as runtime components attached to entities.

## Usage example
Static layouts are not instantiated at runtime like components. They are referenced by map generation code. A typical workflow inside world generation would look like this:

```lua
-- Example pseudo-code (not from this file)
local room = require("map/static_layouts/chessy_3")
worldgen:AddRoom(room, x, y)
```

This file returns a Tiled format table with tile data and object placements; no component is instantiated from it directly.

## Dependencies & tags
**Components used:** None — this file is a data-only layout definition and does not interact with any components or add tags.
**Tags:** None identified.

## Properties
The file returns a single table with predefined properties. These are static configuration values, not runtime entity properties.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled file format version. |
| `luaversion` | string | `"5.1"` | Lua version targeted by the data encoding. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `16` | Map width in tiles. |
| `height` | number | `16` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels (note: actual tileset uses 64x64 tiles, but this is the logical grid unit). |
| `tileheight` | number | `16` | Height of each tile in pixels (logical grid unit). |
| `properties` | table | `{}` | Optional room-level metadata (empty in this case). |
| `tilesets` | table | (see source) | List of tilesets used; contains one entry referencing `tiles.png`. |
| `layers` | table | (see source) | List of layers: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
This file has no functions. It is a pure data definition that returns a single Lua table. All logic and interpretation are performed by the consuming world generation system.

## Events & listeners
None — this file does not define or interact with any events.