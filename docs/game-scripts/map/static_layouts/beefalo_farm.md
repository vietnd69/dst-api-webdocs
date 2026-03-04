---
id: beefalo_farm
title: Beefalo Farm
description: A static map layout defining the arrangement of tiles, walls, objects, and entities in the Beefalo Farm location.
tags: [map, layout, static, environment]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 64a001ef
system_scope: world
---

# Beefalo Farm

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout for the Beefalo Farm location using the Tiled Map Editor format. It specifies the tile grid (32x32, 16x16 tiles), background tile layer (`BG_TILES`), and an object layer (`FG_OBJECTS`) that encodes placement metadata for game entities like walls, perma grass, hound bones, treasure chests, beefalo wool, and pig heads. It is used during world generation to instantiate the actual entities and terrain in the game world. This is not an ECS component, but rather a data definition file consumed by the map generation system.

## Usage example
Static layout files like this one are typically loaded and applied via the world generation system, not directly instantiated by modders. A representative usage would be inside a task or level definition (e.g., in `map/tasks/caves.lua` or `map/levels/forest.lua`) calling a static layout loader function that consumes this `.lua` file and spawns the corresponding entities at the specified coordinates.

## Dependencies & tags
**Components used:** None — this file is pure data and does not interact with ECS components directly. It is processed by engine-level map generation utilities.
**Tags:** None — this file does not manipulate entity tags.

## Properties
The file exports a single Lua table with the following top-level fields:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled format version used. |
| `luaversion` | `string` | `"5.1"` | Target Lua version for encoding. |
| `orientation` | `string` | `"orthogonal"` | Tilemap orientation. |
| `width` | `number` | `32` | Map width in tiles. |
| `height` | `number` | `32` | Map height in tiles. |
| `tilewidth` | `number` | `16` | Width of each tile in pixels. |
| `tileheight` | `number` | `16` | Height of each tile in pixels. |
| `properties` | `table` | `{}` | Global properties (empty in this case). |
| `tilesets` | `table` | See source | Array of tileset definitions (contains one `tiles` tileset). |
| `layers` | `table` | See source | Array of layers: one tile layer (`BG_TILES`) and one object group (`FG_OBJECTS`). |

The `layers` array contains:
- `BG_TILES`: A tile layer containing `32*32 = 1024` integers representing tile IDs (mostly `0`, occasionally `5`).
- `FG_OBJECTS`: An object group with a list of `objects`, each defining:
  - `name`: Empty string in all entries.
  - `type`: Entity type string (`"perma_grass"`, `"wall_wood"`, `"houndbone"`, `"treasurechest"`, `"beefalowool"`, `"pighead"`).
  - `shape`: Always `"rectangle"`.
  - `x`, `y`: Float coordinates in pixels.
  - `width`, `height`: Dimensions in pixels (often `16x16` for structured objects, `0x0` for point entities).
  - `visible`: Boolean.
  - `properties`: Additional key-value pairs (e.g., `["scenario"] = "chest_explosion"` for the treasure chest).

## Main functions
This file contains no functions and does not define any methods. It is a static data payload.

## Events & listeners
None — this file does not register or dispatch events. It is purely declarative layout data.