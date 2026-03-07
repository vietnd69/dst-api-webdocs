---
id: atrium_end
title: Atrium End
description: Defines the static layout data for the Atrium End map room, including tile layer and object placements.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 5ed10c7e
system_scope: environment
---

# Atrium End

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static room layout definition for the Atrium End room in DST's world generation system. It specifies a 36x36 grid with 16x16 tile dimensions using Tiled Map Editor format (Tiled JSON equivalent encoded as Lua table). It contains a background tile layer (`BG_TILES`) with tile IDs (mostly 0, with specific non-zero IDs for walls and corners), and an object layer (`FG_OBJECTS`) that declares named prefabs — such as `pillar_atrium`, `atrium_light`, `atrium_gate`, `cavelight_atrium`, `atrium_statue_facing`, `atrium_fence`, and `atrium_rubble` — with their positions, rotation metadata, and visibility settings. This file does not implement a game component or logic; it is pure layout data consumed by the world generation pipeline.

## Usage example
This file is not instantiated as a component; instead, it is returned directly by the map loader and processed by `map/archive_worldgen.lua` or related systems when spawning the Atrium End room:
```lua
-- Not used as a component; loaded as static data
local atrium_end_layout = require("map/static_layouts/rooms/atrium_end/atrium_end")
-- The layout table is processed internally by DST's room placer.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file returns a raw data table with map metadata.

## Main functions
Not applicable.

## Events & listeners
Not applicable.