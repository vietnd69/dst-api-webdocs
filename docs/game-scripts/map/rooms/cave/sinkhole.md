---
id: sinkhole
title: Sinkhole
description: Defines procedural cave room templates for sinkhole biomes in the world generation system, specifying decoration rules, static layouts, and visual properties.
tags: [worldgen, room, cave, biome]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 8698633f
---

# Sinkhole

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines five distinct cave room templates (`SinkholeForest`, `SinkholeCopses`, `SparseSinkholes`, `SinkholeOasis`, `GrasslandSinkhole`) and their background variant (`BGSinkhole`) for use in the world generation system. Each room specifies visual appearance (colour and tile type), content distribution rules (prefab placement percentages), and optional static layouts. These rooms are part of the `Hutch_Fishbowl` room family and use `WORLD_TILES.SINKHOLE` as their base tile value. The definitions are registered via `AddRoom()` calls using `room_functions.lua` utilities.

## Usage example
```lua
-- Example: Accessing a registered sinkhole room definition
local room_def = GetRoom("SinkholeOasis")
if room_def then
    print("Room colour:", room_def.colour.r, room_def.colour.g, room_def.colour.b)
    print("Room tags:", table.concat(room_def.tags, ", "))
end
```

## Dependencies & tags
**Components used:** None — this file only uses the `map/room_functions` module and exposes room definitions for the world generator.
**Tags:** All defined rooms include the tag `Hutch_Fishbowl`.

## Properties
No component properties are defined — this is a room definition file, not a component.

## Main functions
This file does not define any public component functions. It calls `AddRoom()` (from `room_functions.lua`) to register room templates.

## Events & listeners
No events or listeners are used in this file.