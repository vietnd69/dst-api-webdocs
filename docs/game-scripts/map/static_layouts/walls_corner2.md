---
id: walls_corner2
title: Walls Corner2
description: Defines a static map layout containing Ruined Walls and Broken Walls for dungeon generation.
tags: [map, environment, walls, ruins]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 2b7813be
system_scope: environment
---

# Walls Corner2

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`walls_corner2.lua` is a static map layout file used by the world generation system. It defines a 16×16 tile configuration containing background wall tiles (`BG_TILES` layer) and foreground wall object placements (`FG_OBJECTS` layer). The layer includes two types of decorative wall elements: `wall_ruins` (intact but damaged-looking walls) and `brokenwall_ruins` (completely collapsed walls), each optionally carrying a `data.health.percent` property to indicate structural integrity.

This file is consumed by the game's map system during level initialization and does not define an ECS component; it is purely static metadata.

## Usage example
Static layouts like this one are loaded automatically by the world generator when building cave or ruin levels. They are not instantiated via Lua code at runtime but referenced by name in `tasksets` and `levels` files:

```lua
-- This file is referenced internally, e.g. in a taskset or level definition:
-- room_task = { layout = "walls_corner2", ... }
```
No direct Lua instantiation or component interaction is required.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This is a top-level data table describing a Tiled map format layout, not a script-defined component.

## Main functions
Not applicable.

## Events & listeners
Not applicable.