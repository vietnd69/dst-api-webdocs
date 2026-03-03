---
id: skeleton_miner_dirt
title: Skeleton Miner Dirt
description: A static map layout definition for the Skeleton Miner dungeon, specifying background tile patterns, foreground objects (skeleton, miner hat, pickaxe, rocks, gold nuggets), and associated NPC Leif placements.
tags: [map, level_design, dungeon]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: cbf7395f
system_scope: world
---

# Skeleton Miner Dirt

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout (`skeleton_miner_dirt.lua`) used for the Skeleton Miner dungeon's underground environment. It is not a dynamic component but rather a static Tiled JSON-style map configuration serialized as Lua. It contains a 16x16 tile layer (`BG_TILES`) with a repeating tile pattern and an object group (`FG_OBJECTS`) that specifies placements for props, collectibles, and NPCs. The layout is consumed by world generation logic to instantiate the arena environment during dungeon events.

## Usage example
This file is not instantiated at runtime by modders; it is referenced by map generation systems. Example usage in worldgen:
```lua
-- This is pseudo-code illustrating how such a file might be loaded:
local layout = require "map.static_layouts.skeleton_miner_dirt"
-- Worldgen functions use `layout.layers` and `layout.objects` to spawn prefabs
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file is a pure data definition returning a Lua table conforming to the Tiled JSON format.

## Main functions
Not applicable

## Events & listeners
None identified