---
id: nightmare_start_easy
title: Nightmare Start Easy
description: Static layout configuration for the Nightmare Start area with predefined objects, spawning points, and decorative tiles.
tags: [world, map, level_design]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 1c1f8d9b
system_scope: world
---

# Nightmare Start Easy

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`nightmare_start_easy.lua` is a static layout file defining the initial environment for the Nightmare Start scenario in DST. It specifies the map's grid dimensions, tile layers (including background decoration), and an object layer containing prefabs like `campfire`, `spawnpoint`, `grass`, `sapling`, `torch`, and `diviningrodstart`. This file is consumed by the world generation system to place static assets during map initialization.

## Usage example
This file is not intended for direct component instantiation. Instead, it is loaded and processed by the level generation system, for example via:
```lua
local layout = require "map/static_layouts/nightmare_start_easy"
-- The layout is then used internally by worldgen systems to instantiate prefabs and render tiles
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties accessible at runtime — this file returns a plain Lua table used for level serialization.

## Main functions
No main functions are defined — this module returns a data structure.

## Events & listeners
None identified