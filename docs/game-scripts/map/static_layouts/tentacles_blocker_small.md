---
id: tentacles_blocker_small
title: Tentacles Blocker Small
description: Defines a static map layout used to place tentacles and marshland flora in the Caves biome, serving as a template for world generation.
tags: [map, generation, layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: e114a3a3
system_scope: world
---

# Tentacles Blocker Small

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`tentacles_blocker_small` is a static map layout file in Tiled map format. It defines a `24×24` tile grid used by the game's world generation system to place decorative and functional elements—specifically tentacles and marshland flora (e.g., `tentacle`, `marsh_bush`, `marsh_tree`)—within cave environments. This file does not define an ECS component; it is a data asset loaded at runtime to populate entities (e.g., via `static_layouts.lua` systems). The layout contains two layers: a tile layer (`BG_TILES`) with zero-value placeholder data, and an object layer (`FG_OBJECTS`) that specifies positions of game objects by type.

## Usage example
This file is not used directly as a component. Instead, it is referenced by the world generation system when building cave levels. As a modder, you would not typically interact with it in Lua code. However, if you were to create a custom static layout, you would produce a `.lua` file with a similar Tiled-compatible table structure.

```lua
-- Example (conceptual) of how the engine may use this layout:
-- local layout = require "map/static_layouts/tentacles_blocker_small"
-- layout.objects.FG_OBJECTS:ForEach(function(obj)
--   if obj.type == "tentacle" then
--     SpawnTentacleAt(obj.x, obj.y)
--   end
-- end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this is a data-only file returning a Lua table describing a Tiled map.

## Main functions
Not applicable — this file returns a static data structure and contains no executable functions.

## Events & listeners
Not applicable — no event registration or dispatch occurs in this file.