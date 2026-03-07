---
id: long
title: Long
description: Defines the static layout data for a long hallway room using Tiled map format, including background tile layer and foreground object placement.
tags: [room, map, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: dff79c2a
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout named "long" for DST's procedural world generation system. It uses the Tiled map format to specify tile placement (via a 32×32 grid) and object placements (e.g., light sources like pigtorches). It serves as a reusable blueprint for constructing hallway segments during world generation and is consumed by the map/room generation infrastructure—*not* as an ECS component.

## Usage example
This file is not instantiated as a component. Instead, it is imported and referenced by the room generation system. Example of typical usage within DST's map generation:

```lua
local long_layout = require "map/static_layouts/rooms/hallway/long"
-- Used internally by room placement logic; not called directly by modders
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This is a pure data definition file returning a Lua table conforming to the Tiled JSON export schema (modified for Lua syntax). All values are constants defining room geometry and contents.

## Main functions
Not applicable. This file is a data payload, not a functional module.

## Events & listeners
Not applicable.