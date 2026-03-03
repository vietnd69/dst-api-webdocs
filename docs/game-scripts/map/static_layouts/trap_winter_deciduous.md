---
id: trap_winter_deciduous
title: Trap Winter Deciduous
description: A static map layout used for winter-themed deciduous forests, containing predefined scenery objects and placement data.
tags: [map, static_layout, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 0831af36
system_scope: environment
---

# Trap Winter Deciduous

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`trap_winter_deciduous` is a static map layout file defining a 32x32 tile (16x16 pixels each) terrain configuration used in the game's world generation. It includes a background tile layer (`BG_TILES`) filled with empty data (all `0`) and an object group (`FG_OBJECTS`) specifying placements of in-game objects such as trees, saplings, grass, and key static items like the treasure chest, winterometer, and icebox. This file is consumed by the map loader to instantiate static world elements during world initialization.

## Usage example
This file is not instantiated as a component in the ECS. Instead, it is loaded as a Tiled JSON map during world generation. Typical usage occurs internally when the game engine processes static layouts:

```lua
-- Not applicable: this file is a data resource, not a component.
-- It is referenced and loaded by map/task/room systems, e.g.:
-- map.static_layouts.trap_winter_deciduous
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this is a data-only file returning a Lua table.

## Main functions
Not applicable — this file returns a static data structure, not a component with functions.

## Events & listeners
Not applicable.