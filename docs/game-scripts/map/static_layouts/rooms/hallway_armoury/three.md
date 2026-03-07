---
id: three
title: Three
description: A static layout definition for the hallway_armoury room containing background tile data and foreground object placement.
tags: [world, map, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 08a4bd6e
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout for a specific variation (`three.lua`) of the `hallway_armoury` room type in DST. It is a Tiled Map Format (JSON-compatible Lua table) structure used by the world generation system to place architectural elements in the game world. It contains background tile layer data (`BG_TILES`) and a foreground object group (`FG_OBJECTS`) specifying placement of a `nightmarelight`.

## Usage example
```lua
-- This file is loaded by the world generation system and not used directly in prefab code.
-- Example of how the layout may be consumed internally (simplified):
local room_layout = require("map/static_layouts/rooms/hallway_armoury/three")
-- worldgen logic uses room_layout.layers and room_layout.tilesets to construct the room
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file is a pure data structure exported by Tiled and consumed by internal world generation tools.

## Main functions
Not applicable — this file returns a static Lua table and contains no executable logic or functions.

## Events & listeners
None identified