---
id: retrofit_moonmush
title: Retrofit Moonmush
description: Static map layout definition for the Moonmush Retrofit area, containing tile data and placed game objects such as mushtrees, lighting, spawners, and decorative elements.
tags: [map, static_layout, environment, moonmush]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 780f68b8
system_scope: environment
---

# Retrofit Moonmush

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`retrofit_moonmush.lua` defines a static map layout for a retrofitted region in the Caves world, specifically themed around the Moon Mushrooms. It is not a component in the Entity Component System; rather, it is a data structure loaded by the world generation system to populate a section of the cave with pre-defined geometry, objects, and entities. The layout includes background tiles, foreground object groups for decorations (mushtrees, pools, lighting), structural elements (bridges, stalactites), and gameplay-relevant spawners (Grotterwar points, teleporter).

## Usage example
This file is not instantiated or used directly by modders. It is referenced internally by DST's map generation infrastructure when loading a world that includes the Moonmush Retrofit room. Modders may inspect or reference it when designing custom layouts or debugging room placement.

```lua
-- Not applicable: this is a static layout definition, not a component
-- It is consumed by the level/room generation system, e.g., via static_layouts.lua or room loaders
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties exist in the conventional ECS component sense, as this file returns a plain Lua table defining a static Tiled map structure.

## Main functions
Not applicable — this file is a pure data definition and contains no executable functions or methods.

## Events & listeners
Not applicable — no event listeners or event pushes are present in this file.