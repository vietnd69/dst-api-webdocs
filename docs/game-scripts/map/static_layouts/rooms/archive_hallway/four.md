---
id: four
title: Four
description: A Tiled map static layout defining the architecture and object placement for a hallway room in the archive worldgen.
tags: [map, room, worldgen, layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a52f209f
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`four.lua` defines a static map layout for a hallway room within the archive world generation system. It is a Tiled map export (v1.1, orthogonal, 32×32 tiles at 16×16 px) containing background tile data and an object layer with architectural elements such as walls, pillars, chandeliers, statues, security desks, vases, and sound areas. This layout contributes to procedural room placement in the game's caves or ruin-based biomes, specifically in archive-themed environments.

## Usage example
Static layout files like this are not directly instantiated as components. Instead, the worldgen system loads and applies them during level construction:

```lua
-- The layout is referenced internally by the worldgen system as part of room templates
-- No direct instantiation is required for modders; it is consumed by tools such as archive_worldgen.lua
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties are exposed by this file. It returns raw Tiled map data used exclusively by the world generation system.

## Main functions
This file does not define any functional methods. It returns a table describing map metadata and layer contents.

## Events & listeners
Not applicable