---
id: caves
title: Caves
description: Defines cave-level room task configurations for world generation, specifying locked paths, room pools, and visual properties.
tags: [worldgen, caves, task]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: 7e843df2
system_scope: world
---

# Caves

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file registers a set of `AddTask` calls that define cave-level world generation tasks. Each task represents a distinct cave branch or scenario (e.g., `CentipedeCaveTask`, `RedForest`, `RabbitTown`) and specifies requirements (`locks`), rewards (`keys_given`), available room types (`room_choices`), and visual properties (`room_bg`, `colour`, `background_room`). These tasks are used by the world generation system to build procedurally connected cave environments.

## Usage example
```lua
-- This file is a task definition module, not meant for direct component instantiation.
-- Example of how it integrates:
-- When the game generates the Caves world, it loads this file to access pre-defined tasks.
-- A task like "RedForest" can be selected during generation if its locks are satisfied.
AddTask("RedForest", {
    locks={ LOCKS.CAVE, LOCKS.TIER2 },
    keys_given={ KEYS.CAVE, KEYS.TIER3, KEYS.RED, KEYS.ENTRANCE_INNER },
    room_choices={ ["RedMushForest"] = 2, ["RedSpiderForest"] = 1 },
    background_room="BGRedMush",
    room_bg=WORLD_TILES.FUNGUSRED,
    colour={r=1.0,g=0.5,b=0.5,a=0.9},
})
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** This file defines `room_tags` for specific tasks (e.g., `"lunacyarea"` and `"MushGnomeSpawnArea"` for `MoonCaveForest`). No component-level tags are added.

## Properties
No public properties.

## Main functions
This file does not define a component class; it is a procedural configuration module.

## Events & listeners
Not applicable.