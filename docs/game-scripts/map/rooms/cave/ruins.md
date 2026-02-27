---
id: ruins
title: Ruins
description: Defines procedural cave room templates for the Ruins biome, including layouts and distribution rules for flora, structures, and spawners.
tags: [world, map, rooms, procedural]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 0f113deb
---

# Ruins

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines the procedural room templates used to generate the Ruins biome in the Caves world layer. Each room is registered via the `AddRoom` function (imported from `map/room_functions`) and specifies visual properties (color, tile type), gameplay tags, and content generation rules (static layouts, distributed prefabs). These templates are consumed by the world generation system to populate cave levels with thematic areas such as Residential, Military, Sacred, Altar, and Labyrinth zones.

## Usage example
The Ruins component is not instantiated as a traditional entity component; instead, it declares rooms at load time for use in world generation. A modder would typically reference or extend these room definitions in custom worldgen logic.

```lua
-- Example: Add a new Ruins-style room using existing infrastructure
local myRuinsRoom = {
    colour = { r=0.4, g=0.3, b=0.2, a=0.3 },
    value = WORLD_TILES.MUD,
    tags = { "Nightmare", "CustomRuins" },
    contents = {
        distributepercent = 0.1,
        distributeprefabs = {
            lichen = 1.0,
            cave_fern = 0.5,
            custom_ruins_debris = 0.2,
        },
    },
}
AddRoom("MyRuinsRoom", myRuinsRoom)
```

## Dependencies & tags
**Components used:** None — this file is procedural and does not use entity components.

**Tags:** Tags are applied per room definition and include:
- `Hutch_Fishbowl`: Used for rooms compatible with fishbowl Hutch configurations.
- `ForceConnected`: Ensures the room is always connected to adjacent rooms.
- `MazeEntrance`: Marks rooms as maze entry points.
- `Nightmare`: Indicates this room can appear in Nightmare difficulty.
- `Maze`: Denotes rooms used as maze segments.
- `ForceDisconnected`: Used for rooms inside mazes that should not connect to non-maze paths.
- `LabyrinthEntrance`: Marks entry points to labyrinth structures.
- `RoadPoison`: Applies special pathfinding constraints (poisoning roads).
- `lunacyarea`: Used for moon-related areas in the Archive maze.

## Properties
No public properties — this file contains only procedural room definitions.

## Main functions
No functions are defined in this file.

## Events & listeners
No events or listeners — this file executes at load time to register room templates and does not participate in runtime event handling.