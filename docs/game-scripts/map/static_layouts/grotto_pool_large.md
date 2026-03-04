---
id: grotto_pool_large
title: Grotto Pool Large
description: A Tiled map layout file defining the static tile and object configuration for a large grotto pool environment in DST.
tags: [map, environment, static, grotto]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 4667b9ab
system_scope: environment
---

# Grotto Pool Large

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file is a static layout definition for the `grotto_pool_large` map layout in Don't Starve Together. It specifies the tile-based geometry and object placement for a large underground grotto pool area using the Tiled map format (version 1.1, Lua encoding). Unlike typical ECS components, this is a data-only layout definition used by the world generation system to instantiate the physical structure of a grotto pool room. It contains no runtime logic or behavior code; it is processed at world load time to populate the map with background tiles and foreground objects.

## Usage example
This file is not used directly by modders in runtime Lua code. It is referenced internally by the world generation system, specifically via `map/static_layouts/` loading and room/level placement utilities. As such, there is no typical runtime usage pattern. Modders who wish to customize this layout should edit the `.lua` file directly (e.g., change tile indices, object types, or positions) and re-encode the map data if using Tiled.

```lua
-- This layout is loaded and instantiated by the engine via map system utilities.
-- No direct Lua usage required from modders.
```

## Dependencies & tags
**Components used:** None — this is a data file, not a runtime component.  
**Tags:** None identified.

## Properties
The Tiled layout defines static map properties exposed as Lua table keys:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Target Lua interpreter version. |
| `orientation` | string | `"orthogonal"` | Tile orientation used in the map. |
| `width` | number | `2` | Map width in tiles. |
| `height` | number | `2` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `properties` | table | `{}` | Custom map-level properties (currently empty). |
| `tilesets` | table | — | Array of tileset definitions (contains ground tileset). |
| `layers` | table | — | Array of layer definitions (background tiles and object groups). |

## Main functions
No functions are defined in this file. It is a pure data structure.

## Events & listeners
No events or listeners are present. This is a static layout definition, not a runtime component.