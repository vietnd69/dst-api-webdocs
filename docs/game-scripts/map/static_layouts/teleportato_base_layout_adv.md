---
id: teleportato_base_layout_adv
title: Teleportato Base Layout Adv
description: Defines the static Tiled map layout for the Advanced Teleportato base, specifying tile layers, background tiles, and object placements for game world generation.
tags: [map, world, layout, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 2e0f889e
system_scope: world
---

# Teleportato Base Layout Adv

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`teleportato_base_layout_adv.lua` is a map layout definition file that describes the static geometry and object placements for the Advanced Teleportato base in DST. It is not a component in the Entity Component System sense (i.e., it does not define an ECS component class), but rather a pure data structure returned by a Lua module. This layout is consumed by the game’s world generation system to instantiate physical entities (e.g., `teleportato_base`, `bishop`, `flower_evil`, `marbletree`, etc.) and background tile layers during level loading.

## Usage example
This file is not used directly as a component, but is referenced internally by the world generation system. Modders typically do not load or manipulate this file manually. For reference, world layouts like this are loaded via the `map` system, for example:

```lua
-- Pseudo-code: How the engine may use such a layout
local layout = require("map/static_layouts/teleportato_base_layout_adv")
for _, obj in ipairs(layout.layers[2].objects) do
    if obj.type == "teleportato_base" then
        SpawnTeleportatoBase(obj.x, obj.y)
    end
    -- ... handle other object types similarly
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties in the ECS component sense. The module returns a flat Lua table with map metadata:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Lua version compatibility |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `40` | Map width in tiles |
| `height` | number | `40` | Map height in tiles |
| `tilewidth` | number | `16` | Tile width in pixels |
| `tileheight` | number | `16` | Tile height in pixels |
| `tilesets` | table | (see source) | Array of tileset definitions |
| `layers` | table | (see source) | Array of layers: tile layer `"BG_TILES"` and object group `"FG_OBJECTS"` |

## Main functions
None applicable — this is a data-only module returning a static layout structure. No functions are defined.

## Events & listeners
Not applicable.