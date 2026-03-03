---
id: deciduous_pond
title: Deciduous Pond
description: Defines the static layout configuration for a deciduous forest pond area using Tiled map data, specifying floor tiles and placement of decorative and gameplay-relevant objects such as trees, statues, flowers, fireflies, and a chance-based panflute spawn.
tags: [map, static_layout, worldgen, props, environment]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 4557294d
system_scope: world
---
# Deciduous Pond

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout for the "Deciduous Pond" area in the forest biome of Don't Starve Together. It uses the Tiled map format (version 1.1, Lua encoding) to specify background tiles, foreground objects, and their precise world coordinates. The layout is used during world generation to instantiate the physical and environmental features of this region, including ambient decorations (e.g., fireflies, flowers), gameplay entities (e.g., `statueglommer`), and reusable props (e.g., `panflute` with conditional spawn chance). As a pure data file, it does not contain executable logic or components — it is consumed by the world generation system to place prefabs and tiles.

## Usage example
This file is not instantiated as a component; it is referenced and loaded by the world generation system. A typical invocation occurs internally via the map loading infrastructure (e.g., in `map/tasks/caves.lua` or `map/rooms/forest/` scripts), where a layout is applied like:

```lua
local layout = require "map/static_layouts/deciduous_pond"
-- Internally, the engine uses `layout.objects` and `layout.data` to place prefabs/tiles
```

No direct instantiation or API call is required by modders; to customize this layout, override or replicate this file and reference it in a custom `taskset` or `static_layout` loader.

## Dependencies & tags
**Components used:** None identified — this is a pure data file with no runtime component interaction.

**Tags:** None identified — the layout itself does not add or manage entity tags directly.

## Properties
This file is a Tiled JSON export converted to Lua format. It contains no Lua-side properties or instance variables.

| Key | Type | Default Value | Description |
|-----|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled map format version. |
| `luaversion` | `string` | `"5.1"` | Lua version compatibility target. |
| `orientation` | `string` | `"orthogonal"` | Tile orientation used for rendering. |
| `width` | `integer` | `16` | Map width in tiles. |
| `height` | `integer` | `16` | Map height in tiles. |
| `tilewidth` | `integer` | `16` | Width of a single tile in pixels. |
| `tileheight` | `integer` | `16` | Height of a single tile in pixels. |
| `tilesets[1]` | `table` | — | Tileset metadata: path, dimensions, and properties. |
| `layers` | `table` | — | Array of map layers: `"BG_TILES"` (tile layer) and `"FG_OBJECTS"` (object group). |

## Main functions
None — this is a static data definition, not a component class. It exposes no methods.

## Events & listeners
None — this file contains no event logic.

