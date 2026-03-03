---
id: trap_summer
title: Trap Summer
description: A static layout file defining winter-oriented game elements for summer seasons in the caves layer.
tags: [map, environment, layout, winter, summer]
sidebar_position: 1
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 16b2093a
system_scope: world
---
# Trap Summer

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`trap_summer.lua` is a static map layout file used in the caves layer to place seasonal objects during the summer season. It defines tile-layer background data (empty) and an object group (`FG_OBJECTS`) containing entities like `treasurechest`, `icebox`, `winterometer`, rocks, cacti, and marsh bushes at fixed coordinates. Despite its name suggesting a "trap", this layout places environmental props relevant to summer-themed cave zones, likely for world variety and seasonal immersion rather than dynamic gameplay traps.

## Usage example
This file is not a Lua component used directly in prefabs. It is a Tiled map file loaded by the world generation system to populate the cave environment. No manual usage is required — it is referenced internally via the static layout system during map generation.

```lua
-- Internally referenced via map/levels/caves.lua and static_layouts system.
-- Modders typically do not interact with this file directly.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a static data file that returns a configuration table, not an entity component.

## Main functions
No functions — this file only defines and returns a static layout data structure.

## Events & listeners
Not applicable — this file contains no event logic.

