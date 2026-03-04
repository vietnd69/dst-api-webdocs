---
id: retrofit_moonisland_large
title: Retrofit Moonisland Large
description: Map layout data structure defining terrain tiles and static world object placements for a large moon island map segment.
tags: [world, map, environment, level_design]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 66fc8fcc
system_scope: environment
---

# Retrofit Moonisland Large

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is not an entity component but a static map layout definition in Tiled JSON format. It specifies the tile-based terrain (via `BG_TILES`) and spatial placements of non-interactive world objects (via multiple `objectgroup` layers) for a large moon island map segment. It is used by the world generation system to construct the physical environment of specific moon island areas in Don't Starve Together.

## Usage example
This file is not instantiated directly in mod code. It is loaded by the game's map generation system. As a reference, it would be consumed internally like:
```lua
-- Not applicable for mod usage
-- Map layouts are registered and applied via level/task/taskset definitions
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties exposed for mod use.

## Main functions
No mod-accessible functions defined.

## Events & listeners
Not applicable.