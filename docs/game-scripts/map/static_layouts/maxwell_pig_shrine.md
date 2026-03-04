---
id: maxwell_pig_shrine
title: Maxwell Pig Shrine
description: A static world layout file defining the tile-based map and object placement for the Maxwell Pig Shrine scene in DST.
tags: [world, environment, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 4616c777
system_scope: environment
---

# Maxwell Pig Shrine

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout for the Maxwell Pig Shrine using Tiled Map Editor format (TMX-style Lua dump). It specifies tile layer data (`BG_TILES`) and object placement (`FG_OBJECTS`) including structural elements like evergreen trees, pig torches, a Maxwell statue, and various flowers. It is used for rendering and world generation, not as an entity component in the ECS.

## Usage example
Static layout files like this one are loaded and parsed by the engine during world generation, typically via the `static_layouts` loader and `WORLDGEN` system. They are not directly instantiated by modders in Lua.

```lua
-- This file is consumed internally by DST's world generation pipeline.
-- It is referenced via name in worldgen task files (e.g., in `tasksets/caves.lua`).
-- Example internal usage (not modder-facing):
-- local layout = require("map/static_layouts/maxwell_pig_shrine")
-- The layout data is serialized and used to instantiate prefabs at given coordinates.
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties. This file returns a plain Lua table with static layout metadata (dimensions, tile data, object positions) — not an ECS component and not instantiated as such.

## Main functions
Not applicable.

## Events & listeners
Not applicable.