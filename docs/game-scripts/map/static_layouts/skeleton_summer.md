---
id: skeleton_summer
title: Skeleton Summer
description: Defines the static layout data for the Skeleton Summer map room using Tiled map format specifications.
tags: [map, room, static_layout]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: cfd3a277
system_scope: world
---
# Skeleton Summer

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`./map/static_layouts/skeleton_summer.lua` is a static layout file used to define the geometry and object placement for the "Skeleton Summer" room in DST's world generation system. It uses the Tiled map format (JSON-like Lua table representation) to describe tile layers and object groups. This file contributes to procedural room generation by specifying where environmental assets like the skeleton prop and inventory items (e.g., reflective vest, mole hat, pickaxe) should be placed.

The component itself is not a game component (i.e., it does not register or use ECS components like `components.X`); rather, it is a data definition consumed by the world generation pipeline (e.g., `map/rooms/...` handlers and `map/static_layouts.lua` loader).

## Usage example
This file is not instantiated as an entity component. It is loaded as a Lua module by the map/room system:

```lua
-- Example of how static layouts are loaded and used in room generation
local SkeletonSummerLayout = require "map/static_layouts/skeleton_summer"

-- The layout table is passed to room placement logic (e.g., via room templates)
-- The engine internally converts Tiled-style data into in-game entities.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file exports a top-level Lua table defining map metadata and layers.

## Main functions
Not applicable — this file contains no executable logic beyond data definitions.

## Events & listeners
Not applicable — this file does not interact with events.

