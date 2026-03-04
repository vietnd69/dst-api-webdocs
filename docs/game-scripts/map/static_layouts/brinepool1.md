---
id: brinepool1
title: Brinepool1
description: A static map layout definition for the Brinepool biome, specifying tile placement and game object spawn regions such as saltstacks and cookiecutter spawners.
tags: [map, layout, worldgen, environment, spawner]
sidebar_position: 10
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 6f42aa58
system_scope: world
---
# Brinepool1

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
`brinepool1.lua` is a static layout definition file used by the game's world generation system. It defines a fixed 14x14 tile grid layout for a specific Brinepool environment section, including background tile layers and foreground object groups. It specifies where features like saltstack areas (ground zones where saltstacks may generate) and cookiecutter spawners (points that trigger procedural object placement) are located. This file is not a component in the ECS sense but rather a data structure returned as a Lua table describing a static world region for use in map generation tasks and room placement.

## Usage example
This file is loaded by the game's worldgen system during map assembly, not directly instantiated by modders. However, a typical usage within the engine would resemble:

```lua
local layout = require("map/static_layouts/brinepool1")
-- layout contains tile data and object definitions used by task/room systems
-- Example: a room placement system reads layout.layers[2].objects to locate spawners
```

## Dependencies & tags
**Components used:** None — this is a data-only layout file with no runtime component logic.
**Tags:** None identified.

## Properties
The table returned by this file contains layout metadata defined at load time. The following are its top-level and nested fields:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version used. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `14` | Width of the map in tiles. |
| `height` | number | `14` | Height of the map in tiles. |
| `tilewidth` | number | `64` | Width of a single tile in pixels. |
| `tileheight` | number | `64` | Height of a single tile in pixels. |
| `properties` | table | `{}` | Global map properties (empty here). |
| `tilesets` | table | — | Array of tileset definitions; includes ground tileset. |
| `layers` | table | — | Array of layers: `BG_TILES` (tile layer), `FG_OBJECTS` (object group). |

### `layers` structure
| Layer property | Type | Description |
|----------------|------|-------------|
| `type` | string | Layer type (`"tilelayer"` or `"objectgroup"`). |
| `name` | string | Human-readable layer name (e.g., `"BG_TILES"`). |
| `data` | table (tilelayer only) | Row-major tile ID array (length = `width * height`). `0` means empty. |
| `objects` | table (objectgroup only) | List of objects with `type`, `shape`, `x`, `y`, `width`, `height`. |

### `objects` fields
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Object instance name (empty here). |
| `type` | string | Semantically meaningful category (`"saltstack_area"` or `"cookiecutter_spawner"`). |
| `shape` | string | Geometry type (`"rectangle"`). |
| `x`, `y` | number | Top-left position in pixels (relative to map origin). |
| `width`, `height` | number | Dimensions in pixels. |
| `properties` | table | Optional metadata (empty here). |

## Main functions
No functional methods are defined — this file exports only data. No runtime logic or functions are present.

## Events & listeners
None — this file is data-only and has no event interaction.

## Notes
- Tile IDs (e.g., `20` in `data`) refer to indices in the associated tileset (`ground.tsx`).
- `saltstack_area` rectangles define spawn regions for saltstacks; spawners likely activate procedurally placed objects within those bounds.
- `cookiecutter_spawner` objects (with zero size) denote spawn points for procedural objects — likely used by the `cookiecutter` system to instantiate features (e.g., small rocks or flora).
- Layouts like this are typically composed into larger maps via `map/tasksets/`, `map/levels/`, or `map/rooms/` systems.

