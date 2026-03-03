---
id: cave_start
title: Cave Start
description: Static layout definition for the starting cave map used in Don't Starve Together, specifying tile layers and object placements for initial player spawn area.
tags: [world, map, spawn]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: e7ee921a
system_scope: world
---

# Cave Start

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines the static layout configuration for the starting cave in Don't Starve Together. It is not a Lua component but a Tiled map export (`cave_start.lua`) used by the world generation system. It specifies the tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) containing entities like spawn points, portal locations, lighting, vegetation (grass, saplings, evergreens), and cave lights. This layout serves as the foundational layout for the Cave starting world area, ensuring consistent initial conditions for players entering the cave dimension.

## Usage example
This file is loaded and processed by the world generation system as part of `map/tasksets/caves.lua` and is not instantiated directly by modders. It is referenced internally during map generation via the `static_layouts` loader. No direct code usage is expected by modders outside of the core engine.

## Dependencies & tags
**Components used:** None (this is a data-only map layout file, not an ECS component)
**Tags:** None identified.

## Properties
The table returned by this module contains map metadata rather than component properties:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Map file format version |
| `luaversion` | string | `"5.1"` | Lua version compatibility target |
| `orientation` | string | `"orthogonal"` | Tile orientation type |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Map-level custom properties (currently empty) |
| `tilesets` | array | See source | Tileset definitions with texture reference and tile mappings |
| `layers` | array | See source | Layer definitions: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group) |

## Main functions
This file exports only a data table; no functions are defined.

## Events & listeners
Not applicable. This file is a static data definition and does not register or emit events.