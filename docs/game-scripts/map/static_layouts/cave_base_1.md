---
id: cave_base_1
title: Cave Base 1
description: Defines the static layout of the initial cave base room using Tiled map format, including background tile layers and object placement for starting game infrastructure.
tags: [map, worldgen, static_layout]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 9ee843d9
system_scope: world
---

# Cave Base 1

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
`cave_base_1.lua` is a static layout file that defines the pre-designed room layout for the initial cave entrance area in Don't Starve Together. It specifies the room's tile-based background layer (`BG_TILES`) and a set of placed game objects (e.g., firepits, chests, research labs) via an object group (`FG_OBJECTS`). This file is consumed by the world generation system to instantiate the physical layout and contents of the cave base during map initialization. It is not an ECS component and does not contain executable logic.

## Usage example
Static layouts like this one are not used directly by modders in normal gameplay or mod development. They are loaded internally by the world generation system. For reference, the framework loads such layouts via:
```lua
-- Example of how worldgen system consumes static layouts (not a user-facing pattern)
local layout = require("map/static_layouts/cave_base_1")
inst:AddFromStaticLayout(layout)
```

## Dependencies & tags
**Components used:** None — this is a data-only layout definition.
**Tags:** None identified.

## Properties
This file returns a Lua table with fixed static structure, not an ECS component, so public instance properties do not apply.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map version format |
| `luaversion` | string | `"5.1"` | Lua version used for encoding |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `24` | Room width in tiles |
| `height` | number | `24` | Room height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Global map properties (empty) |
| `tilesets` | array | Non-empty | Tileset definition with image path and metadata |
| `layers` | array | Non-empty | Array of layers: `BG_TILES` (tilelayer) and `FG_OBJECTS` (objectgroup) |

## Main functions
This file is a pure data container (a Lua table literal) and contains no functions.

## Events & listeners
Not applicable — this file provides static layout data and does not participate in the event system.