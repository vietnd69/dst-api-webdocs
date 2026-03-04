---
id: fissures_1
title: Fissures 1
description: A static map layout file defining the placement of three moon fissure entities in a 3x3 tile grid for world generation.
tags: [map, static_layout, worldgen]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 56953e83
system_scope: world
---

# Fissures 1

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file (`fissures_1.lua`) is a static map layout definition used by the DST world generation system. It specifies a 3x3 tile grid (`width = 3`, `height = 3`, `tilewidth = 64`, `tileheight = 64`) with an orthogonal orientation and includes background tiles (`BG_TILES`) and foreground objects (`FG_OBJECTS`). The foreground objects section contains three instances of `moon_fissure` type placed at specific coordinates relative to the layout grid. This file is consumed by the map generation pipeline (likely via `map/static_layouts/` loader) to embed fissure entities into the game world as part of pre-defined environmental layouts.

Note: This is a **data-only layout definition**, not a Lua component in the Entity Component System sense. It contains no logic, no constructors, no methods, and no component behavior — it is a JSON-compatible table structure used for level design.

## Usage example
This file is loaded automatically by the world generation system and not instantiated manually. As such, it does not have typical runtime usage. However, a conceptual usage in world generation might look like:

```lua
-- This is pseudo-code illustrating how such files are typically consumed:
local layout = require("map/static_layouts/fissures_1")
-- The engine processes layout.layers objects to spawn prefabs (e.g., moon_fissure)
-- based on the 'type' field in objectgroup objects.
```

## Dependencies & tags
**Components used:** None — this file contains no runtime code or component logic.  
**Tags:** None — this file does not manipulate tags, components, or entities directly.

## Properties
There are no instance properties or runtime variables, as this is a static data file exported from Tiled Map Editor.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled file format version |
| `luaversion` | string | `"5.1"` | Target Lua version (unused) |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `3` | Width in tiles |
| `height` | number | `3` | Height in tiles |
| `tilewidth` | number | `64` | Width of each tile in pixels |
| `tileheight` | number | `64` | Height of each tile in pixels |
| `properties` | table | `{}` | Global map properties (empty here) |
| `tilesets` | array | `...` | Tileset definitions used in the map |
| `layers` | array | `...` | Layer definitions (tile and object layers) |

## Main functions
No functions are defined in this file. It is a pure data table.

## Events & listeners
No events or listeners are defined. This file is consumed at load time and does not interact with the game's event system.