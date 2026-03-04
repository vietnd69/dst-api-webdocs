---
id: trap_firestaff
title: Trap Firestaff
description: Defines a static world map layout for a trap event that spawns a firestaff and multiple fire hounds.
tags: [map, event, hound, trap, fire]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: fac46081
system_scope: world
---

# Trap Firestaff

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout (in Tiled JSON-compatible Lua format) used for spawning the "trap firestaff" event. It includes a tile layer with no active tiles (all zeroed) and an object group containing one `firestaff` entity and five `firehound` entities placed at specific coordinates. The layout is intended to be instantiated as part of a worldgen or event sequence, typically during a special trap phase.

## Usage example
The file is loaded as a data resource by the world generation system and is not instantiated directly as a component. It is referenced by worldgen tasksets or events to place the entities at runtime.

```lua
-- Not applicable — this is a static layout definition, not a component.
-- The game engine consumes this layout via worldgen systems such as:
-- world:SpawnStaticLayout("trap_firestaff", x, z)
-- which then instantiates prefabs based on the object names in FG_OBJECTS.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds the tag `firestaff` to the firestaff object (via `properties.scenario = "staff_hounds"`), and likely `hound`, `firehound`, `enemy`, `trap` to the hound objects (not specified here but inferred from game conventions).

## Properties
No public properties — this file is a static layout definition, not an ECS component.

## Main functions
Not applicable — this file exports raw layout data; it contains no functional methods.

## Events & listeners
Not applicable — this file defines only static placement data and does not contain event handlers.