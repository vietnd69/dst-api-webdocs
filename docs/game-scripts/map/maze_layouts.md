---
id: maze_layouts
title: Maze Layouts
description: Factory module that pre-generates and caches static maze room layouts for the Archive and Ruins biomes with configurable area content and rotation variants.
tags: [map, worldgen, static_layout, biome]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 406285d3
---

# Maze Layouts

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`maze_layouts.lua` is a factory module that generates and caches map layouts for maze-like environments such as the Archive and Ruins. It centralizes layout generation logic by constructing standardized layout variants (`SINGLE_NORTH`, `L_EAST`, `THREE_WAY_S`, etc.) for different room types using the `StaticLayout.Get` utility. Layouts are grouped by biome (`default`, `hallway`, `archive_hallway`, `room_armoury`, etc.) and optionally parameterized with custom area generation functions (e.g., `ruins_areas`, `archive_areas`) that determine what Prefabs appear in specific layout zones. This module is not a component, but a utility returning pre-initialized layout structures used during world generation.

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
This module returns a single table with two top-level keys:

| Property     | Type     | Default Value | Description                                                                                       |
|--------------|----------|---------------|---------------------------------------------------------------------------------------------------|
| `Layouts`    | `table`  | `GetLayoutsForType("room")` | A table of layouts generated for the base `"room"` type.                                        |
| `AllLayouts` | `table`  | `default: GetLayoutsForType("room")`, plus biome-specific keys | A mapping from layout category name (e.g., `"archive_start"`, `"room_armoury"`) to layout tables. Each entry is the output of `GetLayoutsForType` or `GetSpecialLayoutsForType`. |

Each layout table inside `AllLayouts` contains keys like `"SINGLE_NORTH"`, `"L_EAST"`, `"FOUR_WAY"`, etc., whose values are `StaticLayout` objects.

## Main functions

### `GetLayoutsForType(name, sub_dir, params, areas, INVALID_FIELD)`
* **Description:** Generates and returns a table of standardized room layouts for a given layout type (e.g., `"room_armoury"`). This includes single rooms, turns (`L_*`), tunnels (`TUNNEL_*`), three-way intersections, and four-way intersections. Each layout is constructed with consistent rotation, `fill_mask`, and optional `areas` functions.  
* **Parameters:**
  * `name` (`string`): Base name of the layout folder under `"map/static_layouts/{sub_dir}/"`.
  * `sub_dir` (`string?`, optional): Subdirectory inside `"map/static_layouts/"` (defaults to `"rooms"`).
  * `params` (`table?`, optional): Table that may contain `fill_mask` to pass to `StaticLayout.Get`.
  * `areas` (`table?`, optional): Table of area-generating functions (e.g., `ruins_areas`, `archive_areas`) used by `StaticLayout` to populate layout zones.
  * `INVALID_FIELD` (`any?`): Dummy parameter used for debug detection (non-`nil` triggers a `print` warning).
* **Returns:** `table` — A layout table with keys: `"SINGLE_NORTH"`, `"SINGLE_EAST"`, `"L_NORTH"`, `"SINGLE_SOUTH"`, `"TUNNEL_NS"`, `"L_EAST"`, `"THREE_WAY_N"`, `"SINGLE_WEST"`, `"L_WEST"`, `"TUNNEL_EW"`, `"THREE_WAY_W"`, `"L_SOUTH"`, `"THREE_WAY_S"`, `"THREE_WAY_E"`, `"FOUR_WAY"`. Each value is a `StaticLayout` instance.
* **Error states:** If `INVALID_FIELD` is non-`nil`, prints a debug warning: `INVALID_FIELD defined in GetLayoutsForType! Fix this!`.

### `GetSpecialLayoutsForType(layout_dir, name, sub_dir, areas, INVALID_FIELD)`
* **Description:** Generates layout variants for a single fixed directory path, supporting only the four cardinal orientations (`SINGLE_*`). This is used for layouts where only simple entrance/exit types exist (e.g., `"atrium_start"`, `"archive_keyroom"`).  
* **Parameters:**
  * `layout_dir` (`string`): Directory path component used in constructing the full layout path (e.g., `"archive_start"`).
  * `name` (`string`): Layout file name (typically matches `layout_dir`).
  * `sub_dir` (`string?`, optional): Subdirectory (defaults to `"rooms"`).
  * `areas` (`table?`, optional): Area-generating functions (e.g., `ruins_areas`, `archive_areas`) passed to `StaticLayout.Get`.
  * `INVALID_FIELD` (`any?`): Dummy parameter for debug detection (non-`nil` triggers a `print` warning).
* **Returns:** `table` — A layout table with keys: `"SINGLE_NORTH"`, `"SINGLE_EAST"`, `"SINGLE_SOUTH"`, `"SINGLE_WEST"`, each mapping to a `StaticLayout` instance.
* **Error states:** If `INVALID_FIELD` is non-`nil`, prints a debug warning: `INVALID_FIELD defined in GetLayoutsForType! Fix this!`. Note: The error message incorrectly references `GetLayoutsForType` instead of `GetSpecialLayoutsForType`.

## Events & listeners
None identified.

## Usage example
```lua
local MazeLayouts = require("map/maze_layouts")
local layouts = MazeLayouts.AllLayouts["archive_start"]

-- Access the NORTH-oriented layout
local archive_start_north_layout = layouts["SINGLE_NORTH"]

-- The returned layout is a StaticLayout object, usable during worldgen
-- to place the layout at a target tile coordinate.