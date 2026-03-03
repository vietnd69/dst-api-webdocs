---
id: charlie_2
title: Charlie 2
description: A Tiled map layout defining static terrain tiles and object placement for the Charlie_2 boss arena.
tags: [boss, arena, layout]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: bc70ba47
system_scope: world
---

# Charlie 2

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file defines the static layout data for the Charlie_2 boss arena using Tiled map format (v1.1). It specifies an 8x8 orthogonal grid with 16x16 pixel tiles and includes background tile layer data and foreground object placements. Unlike typical ECS components, this is a pure data structure used for level design — not a runtime component attached to entities. It serves as input for world generation or arena initialization logic that constructs the physical environment of the boss fight.

## Usage example

This file is loaded and processed by the world generation system. It is not instantiated as a component. A typical usage pattern would be within a task or stategraph that references this layout to build the arena:

```lua
local charlie_2_layout = require "map/static_layouts/charlie_2"
-- The layout data is consumed by external systems (e.g. worldgen) to spawn tiles and objects.
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| version | string | "1.1" | Tiled format version |
| luaversion | string | "5.1" | Lua version compatibility |
| orientation | string | "orthogonal" | Map projection type |
| width | number | 8 | Map width in tiles |
| height | number | 8 | Map height in tiles |
| tilewidth | number | 16 | Tile width in pixels |
| tileheight | number | 16 | Tile height in pixels |
| properties | table | {} | Map-level custom properties (empty) |
| tilesets | table | (see source) | Array of tileset definitions |
| layers | table | (see source) | Array of map layers (background tiles and object group) |

## Main functions
This file exports a data table only; it contains no runtime functions.

## Events & listeners
None