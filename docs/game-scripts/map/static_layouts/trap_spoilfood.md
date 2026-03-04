---
id: trap_spoilfood
title: Trap Spoilfood
description: A static layout file defining the placement of world objects for the Spoiled Food trap event in DST.
tags: [event, map, static_layout, spawn]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 9d60083a
system_scope: world
---

# Trap Spoilfood

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a Tiled map export (`.lua` format) used for static world layout generation in DST. It defines the placement of environmental objects and interactables associated with the Spoiled Food trap event. It is not an ECS component or behavior — it is a data structure consumed by the worldgen system to populate the game world at runtime. The layout includes a treasure chest tagged for the `chest_foodspoil` scenario, multiple `spoiled_food` objects, `pond`, `marsh_tree`, `reeds`, `pighead`, and `skeleton` objects.

## Usage example
This file is loaded and processed by the engine's static layout system, not instantiated directly by modders. Example integration (engine internal only):

```lua
-- Example usage by engine (not modder-facing)
local layout = require("map/static_layouts/trap_spoilfood")
worldgen.AddStaticLayout("trap_spoilfood", layout)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export version. |
| `luaversion` | string | `"5.1"` | Lua interpreter version target. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width`, `height` | number | `32` | Map dimensions in tiles. |
| `tilewidth`, `tileheight` | number | `16` | Size of each tile in pixels. |
| `tilesets` | table | — | Tileset definitions (empty in this case). |
| `layers` | table | — | Array of layers (`BG_TILES` tile layer, `FG_OBJECTS` object group). |
| `properties` | table | `{}` | Global layer/level properties (empty here). |

## Main functions
Not applicable — this file exports static layout data only; no functions are defined.

## Events & listeners
Not applicable.