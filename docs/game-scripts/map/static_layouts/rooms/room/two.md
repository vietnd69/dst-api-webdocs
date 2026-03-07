---
id: two
title: Two
description: Static room layout data for a 32x32 tile room used in DST's world generation system.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 502bd23b
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout used in DST's world generation. It is a 32x32 tile map layer (`BG_TILES`) with background tile patterns (tile ID 9 placed at specific coordinates) and a single foreground object layer (`FG_OBJECTS`) containing a `pigtorch` placed at coordinates (252, 221). The layout is consumed by the room generation system, likely as part of cave or forest room types, where tile data and object placements determine environmental lighting and decor.

## Usage example
This file is not a component added directly to entities. Instead, it is returned as a data table by the world generation system to define a room layout:
```lua
-- Example: Room generation script might load and use this layout
local room_layout = require("map/static_layouts/rooms/room/two")
local room = CreateEntity()
room:AddTag("room")
room:AddComponent("roomloader")
room.components.roomloader:LoadFromStaticLayout(room_layout)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file is a pure data container and does not define a component class.

## Main functions
Not applicable — this file returns raw layout data, not a functional class or component.

## Events & listeners
Not applicable.