---
id: three
title: Three
description: Defines the static layout data for a hallway residential room variant in the game world.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e9acb996
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`three.lua` is a map layout file defining the static tile layout and structure for a specific variant of the "hallway_residential" room in Don't Starve Together. It uses the Tiled Map Editor format (version 1.1, orthogonal, 32×32 grid of 16×16 tiles) to specify background tile placement via tile IDs in a linear array. It includes no foreground object layers or dynamic behavior—its purpose is purely visual/layout for procedural world generation.

## Usage example
This file is not used as an entity component and is loaded by the world generation system automatically when selecting the `hallway_residential_two` room template. No direct usage by modders is expected.

```lua
-- Not applicable: this is a static data file consumed by the map generator.
-- See map/static_layouts/rooms/hallway_residential_two for related layout variants.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used by Tiled. |
| `orientation` | string | `"orthogonal"` | Map projection type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | array | — | Tileset definitions (only `tiles` used). |
| `layers` | array | — | Map layers (`BG_TILES`, `FG_OBJECTS`). |
| `properties` | table | `{}` | Global map properties (empty). |

## Main functions
Not applicable — this is a data module returning a plain Lua table of static map data.

## Events & listeners
Not applicable.