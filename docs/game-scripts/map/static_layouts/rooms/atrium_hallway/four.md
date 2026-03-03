---
id: four
title: Four
description: Defines the layout data for a specific Atrium hallway map room variant in DST's world generation system.
tags: [world, map, room]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a270a282
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a Tiled map JSON export representing the layout data for the `four` variant of the Atrium hallway room. It is used by the game's world generation system to construct specific instances of Atrium hallway segments. It defines tile placement for background layers (`BG_TILES`) and object placements (`FG_OBJECTS`) such as dropperwebs and atrium fences.

## Usage example
```lua
-- This file is loaded automatically by DST's worldgen system.
-- It is not manually instantiated or used directly in mod code.
-- The framework expects this file to return a table with keys:
-- version, luaversion, orientation, width, height, tilewidth, tileheight,
-- properties, tilesets, and layers — matching Tiled JSON format.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file is a pure data definition and does not implement any component class or Lua module logic.

## Main functions
Not applicable.

## Events & listeners
Not applicable.