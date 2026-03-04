---
id: dragonfly_arena
title: Dragonfly Arena
description: A static map layout file defining the environment for the Dragonfly Arena boss encounter, including terrain, lava ponds, scorched ground, and spawn points.
tags: [boss, arena, environment, map]
sidebar_position: 10
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 12ae69f4
system_scope: world
---
# Dragonfly Arena

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file is a Tiled map data file (`dragonfly_arena.lua`) that defines the static environmental layout for the Dragonfly Arena boss encounter. It specifies the arrangement of background tiles (`BG_TILES`), object placements (`FG_OBJECTS`), and associated properties such as lava ponds, scorched ground markers, burnt marsh trees, burnt marsh bushes, scorched skeletons, and the dragonfly spawner. The layout is not a Lua component in the ECS sense (no `Class` constructor or `inst:AddComponent` calls); rather, it is JSON-compatible Tiled map data exported to Lua format for consumption by the world generation system.

## Usage example
This file is loaded automatically during world generation as part of the dragonfly arena static layout. Modders do not instantiate it directly in typical modding workflows.

```lua
-- Example of referencing the layout in a scenario or event task (hypothetical)
-- The layout is defined at ./map/static_layouts/dragonfly_arena.lua
-- and included in worldgen via tasksets or event definitions.
```

## Dependencies & tags
**Components used:** None — this is a static data definition, not an ECS component.  
**Tags:** None identified.

## Properties
The file defines map-level Tiled properties, not Lua component properties. Key top-level fields:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export format version |
| `luaversion` | string | `"5.1"` | Target Lua version |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `64` | Map width in tiles |
| `height` | number | `64` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Map-wide custom properties (empty) |
| `tilesets` | array | See source | Tileset definitions |
| `layers` | array | See source | Map layers: `BG_TILES`, `FG_OBJECTS` |

No Lua component-level properties are defined in this file.

## Main functions
This file is a data return statement and contains no functional methods.

## Events & listeners
No events are defined or used in this static layout file.

