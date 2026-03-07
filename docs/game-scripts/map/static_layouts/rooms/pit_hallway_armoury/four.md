---
id: four
title: Four
description: A static layout map configuration for a pit hallway armoury room variant in DST's world generation system.
tags: [map, worldgen, room]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 1204a38d
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a specific variant (`four.lua`) of a pit hallway armoury room used in DST's world generation. It is a Tiled map format configuration (version 1.1, orthogonal orientation) that specifies tile layout (`BG_TILES`) and object placement (`FG_OBJECTS`) for procedural room spawning. It contains no Lua logic components—purely declarative map data.

## Usage example
This file is not instantiated as a component; it is loaded by the world generation system via `map.static_layouts.rooms.pit_hallway_armoury` entrypoints. Modders typically do not interact with it directly. Example integration:

```lua
-- Internal usage (not for modder use)
local roomdef = require("map/static_layouts/rooms/pit_hallway_armoury/four")
-- Used by RoomGenerator/StaticRoomLoader to spawn the layout during worldgen
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. The table returned is a static Tiled map data structure, not a component instance.

## Main functions
Not applicable — this file exports raw map data only.

## Events & listeners
Not applicable — no event logic present.