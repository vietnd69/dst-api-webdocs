---
id: three
title: Three
description: Defines the static layout data for a specific map room (pit_hallway_armoury/three) used in world generation.
tags: [map, worldgen, room]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: f84c72c8
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a Tiled map JSON export defining the static layout of a specific segment of the `pit_hallway_armoury` room in DST's world generation system. It contains tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) for placing runtime objects like `nightmarelight` entities. It is not a component in the ECS sense; rather, it is metadata consumed by the world generation and room placement systems to instantiate environment assets in caves and overworld maps.

## Usage example
This file is not used directly by modders. It is automatically loaded by the engine during world generation when the `pit_hallway_armoury` room template is selected. Modders may reference it to understand expected layout dimensions or object placements, but direct manipulation is discouraged.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used (for internal tooling). |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width`, `height` | number | `32` | Map dimensions in tiles. |
| `tilewidth`, `tileheight` | number | `16` | Tile size in pixels. |
| `tilesets[1]` | table | — | Tileset metadata (path, dimensions, etc.). |
| `layers[1]` | table | — | Background tile layer data (`data` is a flat array of tile GIDs). |
| `layers[2]` | table | — | Object group containing runtime-placed objects (e.g., `nightmarelight`). |

## Main functions
Not applicable. This file is a data-only export and contains no executable functions.

## Events & listeners
Not applicable.