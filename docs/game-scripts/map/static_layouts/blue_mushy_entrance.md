---
id: blue_mushy_entrance
title: Blue Mushy Entrance
description: Defines the static layout data for the blue mushroom entrance room in the caves, including background tiles, spawn points, and object placements.
tags: [map, room, layout]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 53859542
system_scope: world
---
# Blue Mushy Entrance

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static room layout definition used by DST's world generation system to place the blue mushroom entrance room in the cave world. It is not a runtime component but a pre-built Tiled map data structure serialized to Lua. The layout includes a tile layer for background visuals and an object group defining spawn points, cave exits, skeleton objects, and cave lights.

Because it is a data file (not an entity component), it is used at world generation time to instantiate rooms and is loaded by the `map` and `rooms` systems during procedurally generated cave layouts.

## Usage example
This file is not instantiated directly at runtime; instead, the engine's room generation system consumes it. For modding reference:

```lua
-- Example of how this layout is *conceptually* referenced (not executable code)
local room = LoadStaticLayout("blue_mushy_entrance")
room:PlaceAt(x, y)
```

In practice, this layout is loaded internally by the `map/rooms/` loader (e.g., via `tasksets/caves.lua`) during world generation.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a pure data return table, not a component class.

## Main functions
Not applicable — this file defines only static data, not functional methods.

## Events & listeners
Not applicable — no runtime behavior or event handling is present.

