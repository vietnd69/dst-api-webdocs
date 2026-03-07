---
id: four
title: Four
description: Defines the tilemap layout and static objects for the 'residential_two' room variant in DST's world generation system.
tags: [map, worldgen, room]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: b01d0a85
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static layout definition used in DST's world generation system. It specifies the tilemap data and object placement for one variant (`four`) of the `room_residential_two` room type. It contains grid-based background tiles (`BG_TILES`) and object layer definitions (`FG_OBJECTS`) that are baked into the world at runtime for procedurally generated structures. It does not implement an ECS component and serves as declarative data for map construction.

## Usage example
This file is not used directly by modders. It is loaded automatically by the world generation system when the game instantiates a `room_residential_two` room of variant `four`.

```lua
-- Not applicable: This is a data file, not a component or scriptable module.
-- It is consumed internally by DST's map generators during world seeding.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties.

## Main functions
None identified.

## Events & listeners
None identified.