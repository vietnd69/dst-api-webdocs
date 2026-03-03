---
id: three
title: Three
description: Defines the structure and tile data for a specific hallway room layout used in map generation.
tags: [map, level-design, room-layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 0a5603f3
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`three.lua` is a static map layout file that defines the geometry and object placements for a particular hallway segment in the Atrium region. It uses Tiled map format (version 1.1, Lua-encoded) to specify tile layer data (`BG_TILES`) and object placements (`FG_OBJECTS`) such as statues and lights. This file is not an ECS component but rather a declarative data structure used by the world generation system to instantiate room layouts.

## Usage example
```lua
-- This file is loaded by the map generation system, not instantiated directly by mods.
-- For reference, internal usage looks like:
-- local layout = require("map/static_layouts/rooms/atrium_hallway_three/three")
-- -- Layout is used as raw data to build room entities during worldgen
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file returns a plain Lua table conforming to the Tiled map format specification.

## Main functions
Not applicable — this is a static data file, not an executable component.

## Events & listeners
Not applicable — this file does not interact with events.