---
id: long
title: Long
description: Defines a static hallway map layout for residential rooms using Tiled TMX format data.
tags: [map, layout, static, residential, hallway]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: fc0e4676
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static map layout definition for a hallway in the "hallway_residential_two" subdirectory. It conforms to the Tiled TMX JSON format and specifies a 32x32 tile grid for world rendering. The layout contains background tile data (`BG_TILES` layer) with repeating vertical patterns of tile IDs (e.g., `22`, `29`), suggesting wall segments or architectural features. Object layers are present but currently empty (`FG_OBJECTS`). It serves as a reusable map asset for room generation in the world builder.

## Usage example
This file is not a component, but a data definition file. It is loaded by the world generation system as part of static room layouts. When referenced in room generation scripts, it contributes tile data for rendering the hallway floor and walls.

No direct component usage applies. Example of how it might be referenced (outside this file):

```lua
-- Inside a room generation script:
local layout = require("map/static_layouts/rooms/hallway_residential_two/long")
-- layout.data is then used by the map loader to spawn tiles
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable