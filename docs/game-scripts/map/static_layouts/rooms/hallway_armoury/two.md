---
id: two
title: Two
description: A static room layout used in world generation for the Hallway Armoury region, containing background tile data and an object spawner.
tags: [map, static_layout, generation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 7c1904e9
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static map layout for the "hallway_armoury" zone in DST's world generation system. It specifies a 32×32 tile grid with orthographic orientation, using tile IDs (e.g., `21`, `25`) to render background terrain and an object group that defines a spawner for the "knight_nightmare" entity. As a static layout, it is consumed by the map generation system and does not define an entity component — it contains no Lua logic, components, or runtime behavior.

## Usage example
Static layouts like this are not instantiated directly by modders. They are referenced internally by the worldgen system, typically via tasksets or static layout assignments in room definitions (e.g., in `map/tasksets/caves.lua`). Example internal usage:
```lua
-- Internal engine usage only — modders do not call this directly
worldbuilder.AddStaticLayout("hallway_armoury_two", "map/static_layouts/rooms/hallway_armoury/two.lua")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file returns a plain Lua table describing a Tiled map structure and is not an ECS component.

## Main functions
Not applicable. This file is data-only and contains no executable functions.

## Events & listeners
None identified