---
id: rabbittown
title: Rabbittown
description: Static layout definition for the Rabbit Town pre-built map room, specifying tile patterns and object placements.
tags: [map, static, room, rabbithouse]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 39727d22
system_scope: environment
---

# Rabbittown

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`rabbittown.lua` defines a static map layout used for Rabbit Town, a pre-designed room placed in the game world. It is not a component in the Entity Component System but a Lua table data structure conforming to the Tiled Map Editor JSON-compatible format (with `orientation = "orthogonal"` and embedded tile layer data). This file specifies background tiles (`BG_TILES`) and foreground object placements (`FG_OBJECTS`), including structures like rabbit houses, plants, and lighting.

## Usage example
This file is loaded by the world generation system when building Rabbit Town rooms. Modders typically do not instantiate it directly; instead, it is referenced in static layout task sets:

```lua
-- Example usage in a taskset (not from this file, but indicative)
tasksets.caves:Insert("rabbittown", {
    x = 0,
    y = 0,
    width = 32,
    height = 32,
})
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used for embedded scripts (none used here). |
| `orientation` | string | `"orthogonal"` | Map projection style. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | see source | Contains tileset metadata and reference image. |
| `layers` | table | see source | Array of layers (`BG_TILES` and `FG_OBJECTS`). |

## Main functions
None identified. This is a data-only definition file.

## Events & listeners
None identified.