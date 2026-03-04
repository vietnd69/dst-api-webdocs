---
id: skeleton_warrior
title: Skeleton Warrior
description: Defines the static layout and object placement for the skeleton warrior encounter in the caves.
tags: [world, layout, boss]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 0710b1f8
system_scope: world
---
# Skeleton Warrior

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`static_layouts/skeleton_warrior.lua` is a Tiled map data file that specifies the static geometry and object placement for the Skeleton Warrior encounter. It is not a component in the ECS sense, but rather a data structure defining tile layers and object groups used by the world generator to instantiate the encounter room. The layout includes a 16×16 tile grid for background tiles and an object group (`FG_OBJECTS`) that defines entity spawn points with associated prefabs (e.g., `skeleton`, `houndbone`, `armorwood`, `spear`, `footballhat`, `spear`). This file is consumed by the map/taskroom system to spawn physical entities at design-time coordinates.

## Usage example
This file is not instantiated directly by modders. It is referenced internally by the world generation system, for example, via:
```lua
-- Internal usage (modders do not directly use this)
local layout = require "map/static_layouts/skeleton_warrior"
-- Used in static room instantiation: e.g., ROOMS.skeleton_warrior = { layout = layout, ... }
```

## Dependencies & tags
**Components used:** None — this file is pure data and does not reference components.
**Tags:** None identified.

## Properties
Not applicable.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
