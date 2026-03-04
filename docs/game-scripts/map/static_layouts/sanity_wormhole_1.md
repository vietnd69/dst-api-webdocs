---
id: sanity_wormhole_1
title: Sanity Wormhole 1
description: Defines a static 16x16 tilemap layout containing sanity rocks and a central wormhole object for use in world generation.
tags: [map, static_layout, sanity]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: fb76a16a
system_scope: world
---

# Sanity Wormhole 1

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`sanity_wormhole_1.lua` is a static map layout file (in Tiled JSON-compatible Lua format) used to define a fixed visual and structural configuration for a map room or area. It contains a background tile layer (`BG_TILES`) with sparse placement of tile ID `8` (likely decorative or environmental) and an object layer (`FG_OBJECTS`) with 16 `sanityrock` objects arranged in a perimeter pattern and a single `wormhole` object placed at the center. This layout is typically referenced or loaded by higher-level map generation systems to populate rooms or scenarios requiring sanity-related mechanics.

## Usage example
This file is not used directly as a component but is consumed by world generation systems. Example of how such layouts are integrated (simplified):

```lua
-- In a static layout loader or worldgen context (e.g., inside a task/room loader):
local layout = require("map/static_layouts/sanity_wormhole_1")
-- Layout data is then passed to a renderer or spawner to instantiate entities:
for _, obj in ipairs(layout.layers[2].objects) do
    if obj.type == "sanityrock" then
        SpawnPrefab("sanityrock"):SetValue("x", obj.x):SetValue("y", obj.y)
    elseif obj.type == "wormhole" then
        SpawnPrefab("wormhole"):SetValue("x", obj.x):SetValue("y", obj.y)
    end
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  
This file contains only data definitions (tilemaps and object placements), not component logic.

## Properties
No public properties  
This file is a static data structure (a Lua table) and does not define any runtime component state.

## Main functions
None identified  
This file exports a single data table and does not define any functional methods.

## Events & listeners
None identified  
As a static layout data file, it has no event-handling logic.