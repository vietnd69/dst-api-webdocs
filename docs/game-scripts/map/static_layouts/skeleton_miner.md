---
id: skeleton_miner
title: Skeleton Miner
description: Tiled map layout file defining the placement of entities and decorative objects for the skeleton miner encounter in DST.
tags: [map, world, environment]
sidebar_position: 1
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 7e1aff5d
system_scope: world
---
# Skeleton Miner

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a Tiled map layout (`.lua` export) used to define the static placement of objects and entities in the game world for the skeleton miner encounter. It specifies tile layers (currently empty, as background tiles are unused) and an object layer (`FG_OBJECTS`) containing named positions for prefabs such as `skeleton`, `minerhat`, `pickaxe`, `rocks`, and `goldnugget`. It is not an ECS component but a map data asset consumed by the world generation system to instantiate dynamic content during dungeon or event generation.

## Usage example
This file is not used directly as a component. It is referenced internally by world generation tools and tasksets (e.g., in `map/tasksets/caves.lua` or event-specific layouts) to define where entities appear. Example pseudo-usage:
```lua
-- Internally, this layout may be loaded via TiledLuaLoader and processed like:
local layout = require "map/static_layouts/skeleton_miner"
for _, obj in ipairs(layout.layers.FG_OBJECTS.objects) do
    if obj.type == "skeleton" then
        -- Spawn skeleton prefab at obj.x, obj.y
    end
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties. This file is a pure data table exported by the Tiled editor and does not implement a Lua class or component.

## Main functions
This file defines no functions. It returns a static table describing the layout.

## Events & listeners
Not applicable.

