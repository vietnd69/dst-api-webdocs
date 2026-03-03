---
id: brinepool2
title: Brinepool2
description: Defines a static map layout for the Brine Pool biome with ground tile configuration and object placement data for saltstacks and cookiecutter spawners.
tags: [map, static_layout, environment]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 60cc2475
system_scope: world
---
# Brinepool2

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
`brinepool2.lua` is a static map layout file defining the visual and structural configuration for the Brine Pool biome in Don't Starve Together. It uses the Tiled Map Editor format (version 1.1, orthogonal orientation) and specifies tile layers for background visuals and an object group for placement markers. This file does not implement an ECS component; it is a data-driven layout definition used by the world generation system to populate the biome with terrain and spawn markers.

## Usage example
Static layouts like this are typically consumed by the world generation system and are not directly instantiated as components. They are referenced in map/task assignment logic and are not meant to be manually instantiated in mod code.

```lua
-- This file is not used as a component, but is loaded as raw data.
-- Example of how such layout data is consumed internally:
-- The engine reads this file as a JSON/TMX-compatible data structure
-- and uses it during map generation to render tiles and spawn entities.
-- No code snippet is provided for modder use, as this is an internal layout definition.
```

## Dependencies & tags
**Components used:** None — this file contains only static layout data and does not use or require any component instances.
**Tags:** None — this file does not manage or modify entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled version used to export the layout. |
| `luaversion` | `string` | `"5.1"` | Lua version compatibility declared in the export. |
| `orientation` | `string` | `"orthogonal"` | Map rendering orientation type. |
| `width` | `integer` | `22` | Width of the map in tiles. |
| `height` | `integer` | `22` | Height of the map in tiles. |
| `tilewidth` | `integer` | `64` | Width of a single tile in pixels. |
| `tileheight` | `integer` | `64` | Height of a single tile in pixels. |
| `properties` | `table` | `{}` | Map-level custom properties (empty in this layout). |
| `tilesets` | `table` | (see below) | Array of tileset definitions, including texture reference and tile metadata. |
| `layers` | `table` | (see below) | Array of layers: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
This file is a pure data definition and does not expose any functional methods or modules. No functions are defined.

## Events & listeners
This file does not register or emit any events. No event listeners or push operations are present.

