---
id: redmush
title: Redmush
description: Defines and registers five distinct cave mushroom-themed room templates with varying prop distributions for world generation in DST.
tags: [world, room, generation]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: d003d233
---

# Redmush

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file registers five permanent cave room templates and two background variants for the red mushroom biome in DST. It uses the `AddRoom` API to define world generation layouts (named rooms) by specifying visual color, tile type, tags, and prefab distribution data. These rooms are intended for use in the cave layer, particularly during summer season and for spider-themed encounters. This file contributes to the procedural world generation system by providing curated, fixed-layout room definitions.

## Usage example
This component does not provide a reusable component class or entity logic. Instead, it declares room definitions at startup using the global `AddRoom` function. To use these rooms, world generation tasks must reference their names (e.g., `"RedMushForest"`) in task sets or room pools. Example reference in a taskset or room pool configuration:
```lua
-- Example of referencing a room in a room pool (external usage)
room_pools.cave_summer = {
    rooms = {
        "RedMushForest",
        "RedSpiderForest",
        -- ... other rooms
    },
    -- ... other pool config
}
```

## Dependencies & tags
**Components used:** None — this file contains only static world generation data and does not use or reference any `inst.components.X` access patterns.  
**Tags:** All rooms are tagged with `"Hutch_Fishbowl"`, which appears to be a legacy/internal tag related to lighting and spawn boundaries for the Hutch area.

## Properties
No public properties exist in this file — it is a pure data definition script that populates room metadata via `AddRoom` calls.

## Main functions
No public functions are defined in this file. It solely invokes the global `AddRoom` function (imported via `require "map/room_functions"`) to register room definitions.

## Events & listeners
This file does not listen to or push any events.