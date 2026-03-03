---
id: sculptures_4
title: Sculptures 4
description: Defines a static map layout containing sculpture placement data for the game world.
tags: [map, layout, static, decoration]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 554348ec
system_scope: environment
---

# Sculptures 4

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static map layout definition written in Tiled JSON-compatible Lua format. It specifies the placement and configuration of decorative sculpture entities (`sculpture_knight`) in the game world using an object group named `FG_OBJECTS`. It includes background tile layer data (`BG_TILES`) with a single non-zero tile ID at specific coordinates, but the primary purpose is to define static object placements for in-game sculptural props. The layout is part of the `map/static_layouts` directory and is likely used by the world generation or room placement system.

## Usage example
This file is not used directly as a component. It is loaded and processed by the world generation system (e.g., via `MapRoom` or `RoomBuilder` logic) to instantiate entities at specified coordinates. Modders typically reference this file to understand where and how sculptures are placed for custom map scenarios.

```lua
-- Not a component used in Lua prefab code; loaded externally by the map system.
-- Typical integration (in map loading code) might look like:
-- local layout = require "map/static_layouts/sculptures_4"
-- for _, obj in ipairs(layout.layers.FG_OBJECTS.objects) do
--     if obj.type == "sculpture_knight" then
--         inst:AddChild(prefabs["sculpture_knight"]:Build())
--         inst.components.transform.pos = Vector3(obj.x, 0, obj.y)
--     end
-- end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file returns a raw table defining map layout metadata, not a class or component.

## Main functions
This file does not define any functions.

## Events & listeners
None identified