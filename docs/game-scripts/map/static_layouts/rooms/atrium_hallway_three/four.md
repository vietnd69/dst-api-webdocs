---
id: four
title: Four
description: Defines static layout data for the Atrium Hallway Three room in the DST world generation system.
tags: [map, rooms, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d13a85bb
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static layout definition for the "four" variant of the Atrium Hallway Three room in DST's world generation system. It specifies tile placement and object placements using Tiled map format data. It is used by the worldgen system to procedurally generate dungeon-style rooms during map creation. No Lua component logic is present — this file is purely declarative layout metadata.

## Usage example
This file is not instantiated as a component. It is consumed internally by the world generation system when building room instances:
```lua
-- Internally used by worldgen as:
-- require("map/static_layouts/rooms/atrium_hallway_three/four")
-- The return value is merged into the room's static layout data.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this module returns a plain Lua table containing Tiled JSON-compatible map metadata.

## Main functions
Not applicable.

## Events & listeners
Not applicable.