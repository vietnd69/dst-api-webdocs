---
id: skeleton_farmer
title: Skeleton farmer
description: A static map layout file used to define the placement of skeleton-themed decorative objects and items in the world.
tags: [world, layout, environment, static]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 2b9d6ebb
system_scope: world
---

# Skeleton farmer

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`skeleton_farmer.lua` is a static layout file (in Tiled JSON format) that defines a fixed-world placement of decorative entities such as a skeleton, straw hat, pitchfork, seeds, and poop. It is part of the `map/static_layouts` directory and is used by the world generation system to instantiate predefined arrangements of objects in specific locations (e.g., inside structures or during events). This file does not define a component in the ECS; it is raw map data consumed by the engine during worldgen.

## Usage example
Static layout files like this are not instantiated directly in mod code. Instead, they are referenced in worldgen task or room definitions. Example reference in a taskset/room Lua file:
```lua
-- Inside a room definition (e.g., rooms/cave/fungusnoise.lua)
local layout = require "map.static_layouts.skeleton_farmer"
-- The layout is loaded automatically by the worldgen engine when this room/task is placed.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  
*Note: This file contains no Lua logic, ECS components, tags, or runtime behavior.*

## Properties
No public properties — this is a pure data file.

## Main functions
No functions defined — this is a data file returning a JSON-like Lua table.

## Events & listeners
None.