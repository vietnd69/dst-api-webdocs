---
id: pigguards_b
title: Pigguards B
description: Defines a static map layout for the Pig Guards arena, containing tile data, decorative torches, and wooden walls for environmental structure.
tags: [map, environment, static_layout, combat]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 45f83ed8
system_scope: environment
---

# Pigguards B

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file (`pigguards_b.lua`) is a static map layout definition used by DST's world generation system. It is not a gameplay component or script that attaches to entities; rather, it is a Tiled Map Format (TMX) JSON/JSON-like structure that encodes visual and structural elements (tile layers and object groups) for an in-game arena — specifically, the Pig Guards combat zone. It contains background tile layers and foreground object definitions (like pigtorches and wooden walls) placed at specific grid coordinates.

## Usage example
This file is not intended for direct modder use. It is loaded automatically by the engine during world generation when the corresponding static layout is referenced in a room or level taskset.

The file returns a Lua table describing the map layout, consumed internally by `map/archive_worldgen.lua` and related tools. Modders typically interact with such layouts indirectly via `worldgen.lua` overrides or custom scenario/taskset configurations.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | TMX format version. |
| `luaversion` | string | `"5.1"` | Lua version target for serialized data. |
| `orientation` | string | `"orthogonal"` | Tilemap orientation mode. |
| `width` | number | `40` | Map width in tiles. |
| `height` | number | `40` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Map-level custom properties (empty here). |
| `tilesets` | array | non-empty | Tileset definition(s) including image path and tile metrics. |
| `layers` | array | non-empty | Array of layers (tile layer + object group) containing layout content. |

## Main functions
Not applicable — this file returns a static data structure, not executable functions.

## Events & listeners
Not applicable — no runtime behavior or event interaction is defined.