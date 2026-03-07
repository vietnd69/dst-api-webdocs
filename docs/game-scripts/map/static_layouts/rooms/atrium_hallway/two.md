---
id: two
title: Two
description: A Tiled map data structure for the Atrium Hallway (two) room layout, containing background tile information and foreground object placement definitions.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 56cdeff7
system_scope: environment
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`two` is a static map layout definition for the "Atrium Hallway" room in the game's world generation system. It uses Tiled JSON-like format to define a 32×32 grid of background tiles (`BG_TILES` layer) and a set of foreground objects (`FG_OBJECTS` group), including lights and web droppers. This file is used by the game's worldgen system to procedurally place and render this specific room type during map generation.

## Usage example
```lua
-- This file is loaded automatically by the worldgen system when the Atrium Hallway room layout is selected.
-- It is referenced in a task or taskset via a room template, e.g.:
-- { type = "atrium_hallway", variant = "two" }
-- The game engine uses the returned table to construct the room geometry and object instances.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This is a static data module returning a Tiled map table.

## Main functions
Not applicable.

## Events & listeners
Not applicable.