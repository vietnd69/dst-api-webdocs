---
id: insane_eyebone
title: Insane Eyebone
description: A static layout file defining the visual structure and object placement for the Insane Eyebone stage in DST's boss arenas.
tags: [map, layout, boss, arena, static]
sidebar_position: 10
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 1ba85704
system_scope: map
---
# Insane Eyebone

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file is a static map layout definition for the `insane_eyebone` arena, used during boss encounters (specifically associated with Chester's Eyebone-themed boss events). Unlike components in the Entity Component System, this is a tile-based map configuration exported from Tiled, containing background tiles and foreground object placements. It specifies where structural elements like basalt, sanity rocks, and the eyebone portal appear on the arena floor.

## Usage example
Static layout files like this one are not used directly as components in entity logic. Instead, they are consumed by the world generation system during arena setup. An example of loading such a layout is handled internally via `map/static_layouts.lua` logic, but conceptually:

```lua
-- Internally handled; static layouts are applied via worldgen task system.
-- This file is referenced by `map/tasksets/caves.lua` or `map/levels/lavaarena.lua` during arena instantiation.
```

## Dependencies & tags
**Components used:** None — this file is a data definition, not a component.
**Tags:** None identified.

## Properties
This file does not define Lua component properties. It is a Tiled JSON-compatible static layout with the following top-level metadata:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Lua engine version |
| `orientation` | string | `"orthogonal"` | Tilemap orientation |
| `width` | number | `16` | Map width in tiles |
| `height` | number | `16` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |

## Main functions
This file is a data-only export and does not define any functions.

## Events & listeners
No events or listeners are associated with this static layout definition.