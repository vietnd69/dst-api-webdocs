---
id: terrain_mazes
title: Terrain Mazes
description: Defines cave map room templates used for labyrinthine cave structures, specifying visual properties, tile types, tags, and content generation rules.
tags: [world, map, room, generation, cave]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 69edf3aa
---

# Terrain Mazes

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file registers three room templates for procedural cave world generation: `LabyrinthGuarden`, `BGLabyrinth`, and `BGMaze`. Each call to `AddRoom` defines a room type used during map generation in the Caves layer, specifying visual appearance (`colour`, `value`), structural tags (`tags`), and generation rules for room contents via static layouts or prefabs. These rooms are integrated into the larger worldgen system to create maze-like cave structures (e.g., for the "Beetles" biome or related mazes). The component itself is a declarative configuration script—not an ECS component—and is executed during world generation initialization.

## Usage example
This script does not define a reusable component or entity component class. Instead, it registers room definitions for the world generator. Typical usage occurs automatically during map generation when a taskset includes maze-related rooms. No manual instantiation is required.

```lua
-- The following definitions are registered at load time by this script:
-- LabyrinthGuarden: A walled garden room (static layout "WalledGarden")
-- BGLabyrinth: A labyrinthine room with occasional Nightmare Lights and Dropper Webs
-- BGMaze: A muddy maze room with sparse fauna (e.g., Lichen, Cave Ferns, Slurpers)
```

## Dependencies & tags
**Components used:** None (file is purely configuration; uses `AddRoom` global function defined elsewhere).  
**Tags:** The following tags are assigned to registered rooms:  
- `LabyrinthEntrance` (for `LabyrinthGuarden`)  
- `Labyrinth` (for `BGLabyrinth`)  
- `Maze` (for `BGMaze`)  

## Properties
This file does not declare properties or a class. It consists solely of three `AddRoom` calls with embedded configuration tables.

## Main functions
This file does not define any custom functions. It uses the global `AddRoom(roomname, roomdef)` function, which is implemented externally in the worldgen system.

## Events & listeners
This file does not define or reference any events or listeners.