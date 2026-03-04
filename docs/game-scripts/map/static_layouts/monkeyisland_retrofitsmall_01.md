---
id: monkeyisland_retrofitsmall_01
title: Monkeyisland Retrofitsmall 01
description: Tiled map layout file defining static environmental assets for the Monkey Island static layout, including ground tiles, docks, pirates, monkey structures, and portal debris.
tags: [map, static, environment, tilelayer, objectgroup]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 968c76c0
system_scope: environment
---

# Monkeyisland Retrofitsmall 01

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`monkeyisland_retrofitsmall_01.lua` is a Tiled map JSON export embedded as a Lua module that defines a static layout for Monkey Island. It contains tile data (background tiles) and object groups that specify placements of entities such as `boat_pirate`, `pirate_flag_pole`, `dock_tile_registrator`, `monkeypillar`, `monkeyhut`, `boat_cannon`, and `monkeyisland_portal_debris`. This file is not an ECS component, but rather a data definition used by the world generation system to instantiate static assets during level loading.

## Usage example
```lua
-- The file is loaded via require() during world generation:
local layout = require("map/static_layouts/monkeyisland_retrofitsmall_01")

-- The engine uses its Tiled parser to interpret the layout:
-- - Layer 'BG_TILES' provides tile IDs for background rendering.
-- - Object groups define entity placements and optional parameters.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This module is a plain Lua table literal returning static Tiled map data.

## Main functions
This module does not define any functional methods; it returns raw layout data directly.

## Events & listeners
None identified.