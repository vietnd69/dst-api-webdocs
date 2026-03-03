---
id: skeleton_lumberjack
title: Skeleton Lumberjack
description: A static map layout containing loot and structural elements for the Lumberjack arena event.
tags: [world, layout, event]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 232dd78b
system_scope: world
---

# Skeleton Lumberjack

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`./map/static_layouts/skeleton_lumberjack.lua` defines a static Tiled-style map layout used for the Lumberjack arena event. It specifies grid-based background tiles, and an object layer (`FG_OBJECTS`) that places entities such as `skeleton`, `axe`, `strawhat`, `log`, `cutgrass`, and `twigs` at specific coordinates within a 12×12 tile grid. This file is consumed by the world generation system to instantiate static scene elements during arena setup.

## Usage example
This file is not used directly as a component. Instead, it is loaded and applied by the world generation system (e.g., via `static_layouts.lua` or `events/lava_arena.lua`). Modders typically reference or extend the layout by including it in a custom `taskset` or event configuration.

```lua
-- Example usage in a static layout loader (not the file itself):
-- This is illustrative — actual loading is done internally by DST's engine.
local layout = require("map/static_layouts/skeleton_lumberjack")
-- The engine processes layout.objects to spawn prefabs at (x, y) positions
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
No main functions

## Events & listeners
None identified