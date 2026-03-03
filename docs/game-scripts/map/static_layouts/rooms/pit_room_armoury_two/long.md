---
id: long
title: Long
description: A static room layout definition for the Pit Room Armoury map section, containing background tile data and object placement metadata.
tags: [map, layout, worldgen]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 2be3863c
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`long` defines a static map layout for the "Pit Room Armoury" area. It specifies a 32x32 tile grid (using 16x16 pixel tiles) with two layers: a background tile layer (`BG_TILES`) and an object layer (`FG_OBJECTS`) that describes spawn points for in-game entities. This file is consumed by the world generation system to place the room layout in the game world. It contains no ECS components, logic, or runtime behavior — it is a declarative data structure.

## Usage example
This file is not instantiated or used directly in mod code. It is loaded by the map generation system during world initialization when the corresponding room layout is selected. No manual usage is expected.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | TMX format version |
| `luaversion` | string | `"5.1"` | Lua version target (for TMX parsing compatibility) |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets` | table | *(see source)* | Array of tileset definitions (tile source, dimensions, image path) |
| `layers` | table | *(see source)* | Array of layers: `"BG_TILES"` (tilelayer) and `"FG_OBJECTS"` (objectgroup) |
| `properties` | table | `{}` | Global layer-level properties (empty in this layout) |

## Main functions
None identified — this file returns a static data table and does not define any functions.

## Events & listeners
Not applicable — this is a data file, not a component or runtime module.