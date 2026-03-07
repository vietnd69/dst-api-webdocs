---
id: long
title: Long
description: Defines the Tiled map layout data for a long hallway room in the Archive biome.
tags: [map, archive, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 833fdec2
system_scope: environment
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file contains the static map layout configuration for a long hallway room used in the Archive biome. It is not an ECS component but rather a data definition in Tiled JSON format, describing tile placement, object layers, and room-specific entities like pillars, statues, chandeliers, wall segments, and special areas (e.g., creature zones and sound areas). It is consumed by the world generation system to instantiate the physical room layout in-game.

## Usage example
This file is loaded automatically by the world generation system during room placement and does not need to be directly instantiated by modders. Example of how such data is referenced indirectly:
```lua
-- Inside a room template loader (e.g., in map/rooms/archive/)
local long_hallway = require("map.static_layouts.rooms.archive_hallway_two.long")
-- Used internally by the worldgen system to build the room
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties. This file returns raw Tiled map data structured as a Lua table.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
