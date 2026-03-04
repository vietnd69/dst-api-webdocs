---
id: warzone_3
title: Warzone 3
description: Static layout definition for the Warzone 3 map room, specifying background tiles and object placements for NPCs and structures.
tags: [map, layout, static]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 20ee0ae5
system_scope: world
---

# Warzone 3

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`warzone_3.lua` defines a static map layout used for the Warzone 3 scene in DST. It specifies tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) containing entity placements (e.g., pigmen, merm, mermhouse) at specific grid-aligned coordinates. This is not an ECS component, but a data structure consumed by the world generation system to instantiate room contents.

## Usage example
This file is loaded as a static map definition and not used directly in mod code. The engine uses it during room placement in events or scenarios. Typical usage is internal to DST's worldgen tools:
```lua
-- Not used directly by modders. Engine consumes this file via Tiled map loader.
-- Example of how such layouts are referenced internally:
-- local room = require("map/static_layouts/warzone_3")
-- world:LoadStaticRoom(room, x, y)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Target Lua version |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `16` | Map width in tiles |
| `height` | number | `16` | Map height in tiles |
| `tilewidth` | number | `16` | Width per tile (in pixels) |
| `tileheight` | number | `16` | Height per tile (in pixels) |
| `tilesets` | table | — | List of tileset definitions |
| `layers` | table | — | Array of map layers (tile and object layers) |
| `properties` | table | `{}` | Map-level properties (empty) |

## Main functions
This file is a pure data return table; it contains no executable functions.

## Events & listeners
Not applicable.