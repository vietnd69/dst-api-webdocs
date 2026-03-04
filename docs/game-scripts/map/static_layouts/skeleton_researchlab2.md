---
id: skeleton_researchlab2
title: Skeleton Researchlab2
description: Defines the layout and static object placement for the Skeleton Researchlab2 map area using Tiled data format.
tags: [map, static_layout, worldgen]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 37b4acbe
system_scope: world
---

# Skeleton Researchlab2

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`Skeleton Researchlab2` is a static map layout definition in Tiled JSON format used to render a predefined area in the game world. It contains background tile data (`BG_TILES`) and a foreground object group (`FG_OBJECTS`) specifying placement and types of static world entities such as structures, flora, furniture, and props. This file is consumed during world generation to instantiate the physical environment at runtime.

## Usage example
This file is not directly instantiated or used as a component in the ECS. It is processed by the world generation system as a serialized map layout. Typical usage is internal to the game engine:
```lua
-- Not applicable: this is a data file, not a component
-- World generators load this via map loaders (e.g., in map/archive_worldgen.lua)
-- and spawn prefabs based on the 'type' field in objects.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file exports a plain Lua table conforming to the Tiled map format (version 1.1). All fields are data containers, not component logic.

## Main functions
Not applicable — this file contains no executable functions.

## Events & listeners
Not applicable — this file contains no event handling logic.