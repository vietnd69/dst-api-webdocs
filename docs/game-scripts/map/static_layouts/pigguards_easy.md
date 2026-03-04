---
id: pigguards_easy
title: Pigguards Easy
description: Defines the static layout configuration for a pigguard-friendly map area, including background tiles and foreground objects such as torches and wooden walls.
tags: [map, layout, environment]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 6e9bb762
system_scope: environment
---

# Pigguards Easy

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout used in Don't Starve Together for a "pigguards_easy" area. It specifies the tile configuration via Tiled Map Format (JSON-compatible Lua table) — including a 24×24 tile background layer (`BG_TILES`) and an object layer (`FG_OBJECTS`) containing placements of `pigtorch` and `wall_wood` prefabs. This layout is intended to provide a safer or more accessible zone for pigguard-related gameplay, likely as part of a mission or event scenario.

The file is a data-only map descriptor; it does not implement logic, logic is handled by other systems (e.g., worldgen or scenario scripts) that consume this layout.

## Usage example
This file is typically loaded and processed by the world generation system. It is not directly instantiated as a component, but used as input to layout placement routines.

Example of how a worldgen task might apply this layout:

```lua
-- In a worldgen task or static_layouts loader (pseudocode)
local layout = require("map/static_layouts/pigguards_easy")
AddStaticLayout(inst, layout)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a Lua module returning static layout data.

## Main functions
Not applicable — this file exports only a static Lua table, not a class or component with executable functions.

## Events & listeners
Not applicable.