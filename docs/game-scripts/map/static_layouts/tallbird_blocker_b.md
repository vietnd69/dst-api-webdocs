---
id: tallbird_blocker_b
title: Tallbird Blocker B
description: Defines a static map layout containing background tiles and foreground objects (tallbird nests and rocks) used to block or partition terrain in DST world generation.
tags: [map, worldgen, environment]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 4af90d5c
system_scope: environment
---

# Tallbird Blocker B

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`Tallbird Blocker B` is a static map layout file (JSON-based Tiled map format) used in world generation to define environmental obstacles. It specifies a 40×40 tile grid with background tile placements and an object group containing tallbird nests and rock prefabs. This layout acts as a physical barrier or decorative zone separator in the game world, primarily in outdoor biome regions where tallbirds spawn.

The file does not define any functional Lua component logic — it is purely a data template consumed by the engine's world generator to instantiate tile layers and spawn prefabs at specified coordinates during world creation.

## Usage example
This file is not used directly in mod code. It is loaded by the world generator and applied automatically when its associated zone or room template is used.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version used for exports |
| `orientation` | string | `"orthogonal"` | Tilemap rendering orientation |
| `width` / `height` | number | `40` | Dimensions of the tile grid in tiles |
| `tilewidth` / `tileheight` | number | `16` | Size of each tile in pixels |
| `tilesets` | array | — | List of tileset definitions (e.g., ground tiles) |
| `layers` | array | — | Array of tile layers and object groups defining placements |
| `properties` | table | `{}` | Map-level custom properties (empty in this file) |

## Main functions
Not applicable — this file is a static data structure, not a functional component.

## Events & listeners
None identified