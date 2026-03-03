---
id: long
title: Long
description: Static map layout definition for a long hallway room in the Atrium level, specifying tilemap data and object placements for visual and environmental context.
tags: [map, layout, static, atrium]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: c2f3e25d
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`long` is a static map layout file defining the geometry and object placements for the "long" variant of the Atrium hallway. It does not implement a behavior or logic component for entities; instead, it is a data structure loaded by the world generation system to instantiate room geometry. The layout specifies a 32x32 grid of tiles and two named object groups: one for background tiles (`BG_TILES`) and one for foreground objects (`FG_OBJECTS`) containing light and statue placements.

## Usage example
This file is not intended for direct runtime use by modders. It is consumed internally by the worldgen system during map initialization. Standard use involves referencing it as part of a room definition in a taskset (e.g., `atrium_hallway_three`). Modders should not instantiate or modify it directly.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility tag. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (empty here). |
| `tilesets` | table | (see structure) | Tileset definitions, referencing a single shared tile image. |
| `layers` | table | (see structure) | Array of layers: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
Not applicable.

## Events & listeners
Not applicable.