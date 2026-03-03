---
id: pigguard_grass_easy
title: Pigguard Grass Easy
description: A static map layout definition for a pig guard area with easy difficulty, containing fixed tile layers and object placements for perma grass and pig torches.
tags: [world, environment, map, static_layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: efbd5d9c
system_scope: world
---

# Pigguard Grass Easy

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout (`pigguard_grass_easy.lua`) used in the DST world generation system. It specifies the geometry and placement of background tiles and foreground objects for a pig guard habitat variant. The layout uses Tiled map format (version 1.1), with an orthogonal orientation, 16x16 grid size, and 64x64 tiles. It contains two layers: `BG_TILES` (tile layer for background visuals) and `FG_OBJECTS` (object group containing placement markers for `perma_grass` and `pigtorch` entities).

This file is not an ECS component but rather a data structure consumed by world generation systems to instantiate physical entities in-game. It is typically loaded and processed by map-level tools or worldgen task modules.

## Usage example
This file is not meant to be loaded directly as a component. Instead, it is consumed by the map loader during world generation. An example workflow would look like:
```lua
-- Internally handled by DST's world generation pipeline:
-- The static layout is parsed and used to spawn prefabs at specified positions.
-- Example (conceptual, not direct usage):
local layout = require("map/static_layouts/pigguard_grass_easy")
for _, obj in ipairs(layout.layers[2].objects) do
    if obj.type == "perma_grass" then
        -- Spawn perma_grass prefab at (obj.x, obj.y)
    elseif obj.type == "pigtorch" then
        -- Spawn pigtorch prefab at (obj.x, obj.y)
    end
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties are exposed as this is a plain Lua table data file. It exposes only structural map metadata.

## Main functions
No functional methods are defined — the file returns a configuration table used for static layout placement.

## Events & listeners
None identified