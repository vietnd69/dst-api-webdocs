---
id: three
title: Three
description: A static map layout definition for a residential room in the game world, specifying tile and object placement using Tiled format.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ee673780
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout named `three` used in the game's world generation system. It specifies the background tile configuration (`BG_TILES` layer) and foreground object placements (`FG_OBJECTS` layer) for a residential-style room in the Caves or other subworlds. The layout uses Tiled map format (v1.1, orthogonal, 32x32 grid of 16x16 tiles) and references a tileset image for background rendering. Object layer entries map to specific prefab types that will be spawned at given world coordinates.

## Usage example
```lua
-- This is a static map layout file and is loaded by the world generation system.
-- It is not instantiated manually in mod code. It contributes to room templates used in task sets.
-- Example of where it is referenced (not in source code):
-- map/tasksets/caves.lua may include "three" in the room pool for residential-style layouts.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This file is a plain Lua table returned directly — it does not define a component class.

## Main functions
Not applicable.

## Events & listeners
Not applicable.