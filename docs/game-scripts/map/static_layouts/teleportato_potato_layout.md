---
id: teleportato_potato_layout
title: Teleportato Potato Layout
description: Defines a static world layout for the Teleportato potato teleporter structure using Tiled map format data.
tags: [worldgen, map, static_layout]
sidebar_position: 1
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: fd4ee6b5
system_scope: world
---
# Teleportato Potato Layout

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static layout (as a Tiled `.json`-style Lua table) for placing prefabs and tile elements in the world, specifically associated with the Teleportato potato teleporter structure. It includes a background tile layer (`BG_TILES`) with placeholder data and an object layer (`FG_OBJECTS`) listing entity placements such as `teleportato_potato`, `farmplot`, `carrot_planted`, `grass`, `shovel`, `sapling`, and `twiggy_tall`. This is not a runtime component but a static configuration used during world generation or map preview.

## Usage example
This file is not intended for direct use as an entity component. It is consumed by world generation logic, typically via `map.static_layouts.loader` or similar systems, to instantiate prefabs and place tiles when building a static layout instance:

```lua
-- Conceptual usage in worldgen code (not direct instantiation)
local layout_data = require("map.static_layouts.teleportato_potato_layout")
for _, obj in ipairs(layout_data.layers.FG_OBJECTS.objects) do
    if obj.type and obj.x and obj.y then
        -- Instantiate prefab at (obj.x, obj.y)
    end
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a plain Lua table (static layout definition) with no `Class` constructor or component logic.

## Main functions
No functions are defined — this file returns a static data structure.

## Events & listeners
None identified

