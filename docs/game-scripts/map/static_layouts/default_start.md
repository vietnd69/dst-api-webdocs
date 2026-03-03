---
id: default_start
title: Default Start
description: Defines the default starting layout for new worlds in Don't Starve Together, including tile placement and object spawn points.
tags: [world, spawn, layout]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: d8d806e3
system_scope: world
---

# Default Start

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This component defines the static map layout for the default starting area of a new world. It specifies background tile placements and foreground object placements such as spawn points and welcome items using the Tiled Map Editor format. This file is used during world generation to populate the initial area with foundational environmental and gameplay elements, including multi-player portal and player spawn locations.

## Usage example
This file is not instantiated as an ECS component and is instead returned as a raw table structure. It is consumed internally by the world generation system, not directly by modders. However, modders may reference its structure when defining custom start layouts:

```lua
-- Example: Custom start layout structure matching the expected format
return {
  version = "1.1",
  luaversion = "5.1",
  orientation = "orthogonal",
  width = 16,
  height = 16,
  tilewidth = 16,
  tileheight = 16,
  properties = {},
  tilesets = {
    {
      name = "tiles",
      firstgid = 1,
      tilewidth = 64,
      tileheight = 64,
      image = "path/to/tileset.png",
      tiles = {}
    }
  },
  layers = {
    {
      type = "tilelayer",
      name = "BG_TILES",
      data = { ... }
    },
    {
      type = "objectgroup",
      name = "FG_OBJECTS",
      objects = {
        { name = "", type = "spawnpoint_master", x = 160, y = 160 },
        { name = "", type = "multiplayer_portal", x = 160, y = 160 }
      }
    }
  }
}
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled version compatibility |
| `luaversion` | string | `"5.1"` | Lua version used for encoding |
| `orientation` | string | `"orthogonal"` | Map projection type |
| `width` | number | `16` | Map width in tiles |
| `height` | number | `16` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Global map properties (unused in this file) |
| `tilesets` | table of tileset definitions | (see source) | Tileset metadata and references |
| `layers` | table of layer definitions | (see source) | Layer array containing tile and object layers |

## Main functions
This file is a data definition and contains no executable functions or methods.

## Events & listeners
No events or listeners are defined or used in this file.