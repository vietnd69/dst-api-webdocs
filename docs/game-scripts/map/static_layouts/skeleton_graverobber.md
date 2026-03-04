---
id: skeleton_graverobber
title: Skeleton Graverobber
description: Static map layout definition for a skeleton grave robbing scene, containing predefined object placements for narrative and environmental context.
tags: [map, layout, static, scene]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 284bed9a
system_scope: environment
---

# Skeleton Graverobber

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static tile-based map layout (`skeleton_graverobber.lua`) used in the DST world generation system. It specifies a fixed 8×8 tile grid with orthogonal orientation, used to place decorative and narrative objects—such as a skeleton, backpack, shovel, amulet, gravestone, and trinkets—in a scene representing a grave robbing encounter. It is not a runtime entity component but a level design asset consumed by the map/room system.

## Usage example
This file is not meant for direct instantiation or manipulation by modders. It is loaded as part of the map data when generating rooms or scenes (e.g., via `static_layouts` in a `taskset` or `room` definition). Example usage in world generation context:

```lua
-- Internally referenced like this (not modder-facing):
room.task = {
    type = "static_layout",
    layout = "skeleton_graverobber",
    offset = {x=0, y=0},
}
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Tile orientation type. |
| `width` | number | `8` | Map width in tiles. |
| `height` | number | `8` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets[1].name` | string | `"tiles"` | Name of the tileset used. |
| `tilesets[1].image` | string | Path to tileset image | Image source for tile graphics. |
| `layers[1].name` | string | `"BG_TILES"` | Name of background tile layer. |
| `layers[2].name` | string | `"FG_OBJECTS"` | Name of foreground object layer. |

## Main functions
None identified — this is a static data file returning a Lua table, not a component with functional methods.

## Events & listeners
Not applicable.