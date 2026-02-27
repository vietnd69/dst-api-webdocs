---
id: static_layout
title: Static Layout
description: Converts static Tiled map files into runtime layout data structures for level generation, including ground tile arrays and object placements with prefab resolution and property parsing.
tags: [world, map, generation, layout]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 5ffb30ea
---

# Static Layout

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The Static Layout component provides a converter function `ConvertStaticLayoutToLayout` that processes Tiled map files (loaded as Lua modules) and transforms them into a standardized layout structure used during world generation. It handles ground tile layer parsing (supporting both 16x and 64x grid scaling), foreground object layer extraction, prefab resolution via `PrefabSwaps`, and nested property parsing. The component is not an Entity Component System (ECS) component; rather, it is a utility module returning a `Get` function that performs the conversion logic.

## Usage example
```lua
local StaticLayout = require("map/static_layout")
local layout = StaticLayout.Get("map/static_layouts/my_map", { additional = "prop" })
-- layout.type == LAYOUT.STATIC
-- layout.ground contains 2D tile array
-- layout.layout[prefab] contains array of object positions and properties
```

## Dependencies & tags
**Components used:** None (this is a utility module, not an ECS component).
**Tags:** None identified.

## Properties
No properties are defined on the returned module or its output — only runtime data fields are populated in the returned layout table.

## Main functions
### `ConvertStaticLayoutToLayout(layoutsrc, additionalProps)`
* **Description:** Parses a Tiled static layout file and returns a normalized layout table containing ground tile data (`layout.ground`) and object positions per prefab (`layout.layout[prefab]`). Supports 64x grid sampling from 16x source data and applies `PrefabSwaps` filtering.
* **Parameters:**
  * `layoutsrc` (string): Module path to the static layout file (e.g., `"map/static_layouts/forest"`).
  * `additionalProps` (table?): Optional table of extra fields to merge into the output layout.
* **Returns:** A layout table with the following keys:
  * `type` (string): Always `LAYOUT.STATIC`.
  * `scale` (number): Always `1`.
  * `layout_file` (string): The input `layoutsrc` path.
  * `ground_types` (array): Ordered list of `WORLD_TILES` constants.
  * `ground` (array of arrays): 2D array of tile indices.
  * `layout` (table): Map from prefab name to array of placement objects `{x, y, width, height, properties}`.
* **Error states:** If `staticlayout.layers` is missing or malformed, parsing may silently skip layers or produce incomplete data. No explicit error handling is implemented.

## Events & listeners
None. This module is stateless and does not register or dispatch events.

---