---
id: bullkelpfarmsmall
title: Bullkelpfarmsmall
description: Static map layout file defining the Tiled map structure for a small bullkelp farm instance, containing object-group metadata for kelp spawn zones.
tags: [map, static_layout, kelp, environment]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: b0418957
system_scope: world
---

# Bullkelpfarmsmall

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

`bullkelpfarmsmall.lua` is a static map layout definition file written in the Tiled JSON-compatible format. It specifies the arrangement of background tiles and foreground object zones for a small bullkelp farm. The layout uses a 4x4 tile grid (each tile 64x64 pixels) and contains one background tile layer and one object group layer. This file is not a component in the Entity Component System; rather, it serves as a level design asset used by the world generation system to place predefined environmental structures.

The `FG_OBJECTS` layer includes multiple rectangular regions tagged with type `"kelp_area"`, which act as metadata hints for kelp-related gameplay logic during world generation (e.g., bullkelp spawning or harvest zones). These are not functional components but symbolic region definitions consumed by other systems during map instantiation.

## Usage example

This file is not instantiated as a component and is not directly used in Lua code. It is loaded as a static layout asset by the worldgen system, typically via `static_layouts.lua` or similar level-building utilities.

For reference, a typical usage pattern in the codebase involves loading static layouts like this:
```lua
local static_layout = require("map/static_layouts/bullkelpfarmsmall")
-- Internally, the worldgen framework processes `static_layout.layers.FG_OBJECTS` to extract `kelp_area` regions
```

## Dependencies & tags
**Components used:** None — this file is a static data file, not a Lua component class.
**Tags:** None identified.

## Properties
No public properties are exposed as a Lua component would be. The exported table contains only map metadata fields used by Tiled-compatible loaders:

| Property         | Type     | Default Value | Description |
|------------------|----------|---------------|-------------|
| `version`        | string   | `"1.1"`       | Tiled format version |
| `luaversion`     | string   | `"5.1"`       | Lua version compatibility |
| `orientation`    | string   | `"orthogonal"`| Tile orientation |
| `width`          | integer  | `4`           | Map width in tiles |
| `height`         | integer  | `4`           | Map height in tiles |
| `tilewidth`      | integer  | `64`          | Width of each tile in pixels |
| `tileheight`     | integer  | `64`          | Height of each tile in pixels |
| `properties`     | table    | `{}`          | Global map properties (empty in this case) |
| `tilesets`       | table    | see source    | Tileset definitions |
| `layers`         | table    | see source    | Layer definitions (tile and object groups) |

## Main functions
No functions — this file exports only static configuration data.

## Events & listeners
No event handling — this is a passive data file, not an ECS component.