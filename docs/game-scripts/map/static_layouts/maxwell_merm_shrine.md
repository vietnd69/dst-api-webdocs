---
id: maxwell_merm_shrine
title: Maxwell Merm Shrine
description: Defines the Tiled map layout for the Maxwell Merm Shrine level, specifying tile layers and object placements for tentacles, merm houses, statues, and evil flowers.
tags: [level, map, static_layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 338ad1a7
system_scope: world
---

# Maxwell Merm Shrine

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`maxwell_merm_shrine.lua` is a static layout definition file used to construct the Maxwell Merm Shrine level in Don't Starve Together. It is not a component in the Entity Component System, but rather a Tiled-compatible data structure returned as a Lua table. It describes the visual and spatial layout of the level using tile layers and object groups, including placements for environmental props like tentacles, merm houses, statues, and evil flowers.

The file conforms to the Tiled JSON export format (though stored as Lua), with metadata such as map orientation, tile dimensions, and custom object properties used during world generation.

## Usage example
This file is not instantiated or used directly in mod code. It is consumed by the game's map generation system via `map/worldgen.lua` and related infrastructure to build the level instance. No direct usage in mods is required or supported.

```lua
-- The file is loaded internally during level setup.
-- Modders do not interact with this file directly.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version used |
| `luaversion` | string | `"5.1"` | Lua version target |
| `orientation` | string | `"orthogonal"` | Map rendering orientation |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets` | table | See source | Tileset definitions |
| `layers` | table | See source | Layer definitions (tile layers, object groups) |

## Main functions
This file returns a static configuration table and contains no functions.

## Events & listeners
None identified