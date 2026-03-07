---
id: two
title: Two
description: Tiled map data configuration for the archive hallway two room layout, defining tile layers and object placements for procedural dungeon generation.
tags: [map, generation, room]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: f2aef5e2
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`two` is a static layout definition file that specifies the structure and object placements for the "archive_hallway_two" room used in DST's procedural world generation. It is not a component in the Entity Component System but a Lua module returning Tiled map format data. This module is consumed by the map/room generation system to instantiate physical tiles, walls, statues, and interactive zones within the game world.

## Usage example
This module is not intended for direct instantiation or component use. It is referenced internally by the room generation system (e.g., via `map/rooms/archive/hallway_two.lua` or equivalent), which loads this file and parses its tile and object layer data to spawn entities and background tiles in the world.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file returns a single data table conforming to the Tiled JSON-compatible Lua table format used internally by DST's map generation pipeline.

## Main functions
Not applicable.

## Events & listeners
Not applicable.