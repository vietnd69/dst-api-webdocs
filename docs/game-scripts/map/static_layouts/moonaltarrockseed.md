---
id: moonaltarrockseed
title: Moonaltarrockseed
description: Defines the static layout data for the Moon Altar Rock seed in the game world, specifying its placement and metadata for map generation.
tags: [map, level-design, worldgen]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: e79221ec
system_scope: world
---

# Moonaltarrockseed

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`moonaltarrockseed.lua` is a static layout data file that defines the placement configuration for the Moon Altar Rock in the game world. It is not a component in the Entity Component System but rather a declarative map design artifact used by the world generation system. The file specifies a 2x2 tile area containing background tile data and an object marker (type `moon_altar_rock_seed`) to indicate where the Moon Altar Rock entity should be instantiated during world generation.

## Usage example
This file is not directly instantiated by modders. Instead, it is consumed internally by DST's world generation system (e.g., via `map/tasks/caves.lua` and room assignment logic). Modders typically reference or override it indirectly through worldgen customizations.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target (used for serialization compatibility). |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `2` | Map width in tiles. |
| `height` | number | `2` | Map height in tiles. |
| `tilewidth` | number | `64` | Pixel width per tile. |
| `tileheight` | number | `64` | Pixel height per tile. |
| `tilesets[1]` | table | — | Tileset metadata for ground tiles. |
| `layers[1]` | table | — | Background tile layer (`BG_TILES`) with tile ID data. |
| `layers[2]` | table | — | Object layer (`FG_OBJECTS`) containing placement markers. |
| `layers[2].objects[1].type` | string | `"moon_altar_rock_seed"` | Identifier for the object seed type, used by the generator to spawn the appropriate entity. |

## Main functions
Not applicable — this is a pure data file with no functional logic.

## Events & listeners
Not applicable.