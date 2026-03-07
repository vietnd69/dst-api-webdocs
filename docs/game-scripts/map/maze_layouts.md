---
id: maze_layouts
title: Maze Layouts
description: Generates and caches static maze layouts for dungeon and archive environments by leveraging StaticLayout definitions.
tags: [world, environment, procedural]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: map
source_hash: 406285d3
system_scope: world
---

# Maze Layouts

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`maze_layouts.lua` defines reusable layout generation functions for procedural dungeon and archive environments. It provides standardized sets of room configurations (e.g., `SINGLE_NORTH`, `L_EAST`, `FOUR_WAY`) by wrapping `StaticLayout.Get()` calls with shared parameters such as rotation, fill mask, and area content generators. This module acts as a layout registry, returning a table of named layouts grouped by environment type (`Layouts`, `AllLayouts`), primarily used by the world generation system.

## Usage example
```lua
local MazeLayouts = require("map/maze_layouts")

-- Get default room layouts
local room_layouts = MazeLayouts.Layouts

-- Access a specific layout variant
local layout = room_layouts["SINGLE_NORTH"]

-- Use the layout in worldgen logic
-- layout:GetInstance(x, y, rotation) or equivalent would be called elsewhere
```

## Dependencies & tags
**Components used:** None (this is a module, not a component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `Layouts` | table | `GetLayoutsForType("room")` | Default room layout set for standard rooms (single, L, T, tunnel, etc.). |
| `AllLayouts` | table | `map` of named layout groups | Predefined sets of layouts for various environment types (e.g., `archive_hallway`, `room_armoury`, `atrium_end`). |

## Main functions
### `GetLayoutsForType(name, sub_dir, params, areas, INVALID_FIELD)`
* **Description:** Generates a standard set of directional layout variants (e.g., `SINGLE_*`, `L_*`, `THREE_WAY_*`, `FOUR_WAY`) for a given room type using `StaticLayout.Get()`. Each layout is configured with fixed rotation, mask settings, and optional area content rules.
* **Parameters:**  
  - `name` (string) – base name of the layout folder (e.g., `"room"`, `"hallway"`).  
  - `sub_dir` (string, optional) – subdirectory under `map/static_layouts/`; defaults to `"rooms"`.  
  - `params` (table, optional) – additional layout parameters such as `fill_mask`; defaults to `{}`.  
  - `areas` (table, optional) – area content generators (keyed by area name, function returning prefabs or `nil`); used to populate the layout's `areas` property.  
  - `INVALID_FIELD` (any, optional) – unused placeholder for debugging; triggers a console warning if truthy.
* **Returns:** `table` – a map of layout names (`SINGLE_NORTH`, `L_EAST`, etc.) to `StaticLayout` instances.
* **Error states:** Logs a warning if `INVALID_FIELD` is provided (indicating legacy or erroneous usage).

### `GetSpecialLayoutsForType(layout_dir, name, sub_dir, areas, INVALID_FIELD)`
* **Description:** Generates a minimal set of directional layouts (`SINGLE_*` only) for special or top-level layouts (e.g., `atrium_start`, `archive_keyroom`). It constructs a direct path and applies shared mask and area configurations.
* **Parameters:**  
  - `layout_dir` (string) – specific subdirectory containing the layout (e.g., `"atrium_end"`).  
  - `name` (string) – filename prefix within the directory (e.g., `"atrium_end"`).  
  - `sub_dir` (string, optional) – base subdirectory under `map/static_layouts/`; defaults to `"rooms"`.  
  - `areas` (table, optional) – same as in `GetLayoutsForType`.  
  - `INVALID_FIELD` (any, optional) – unused placeholder; triggers warning if truthy.
* **Returns:** `table` – a map of layout names (`SINGLE_NORTH`, `SINGLE_EAST`, `SINGLE_SOUTH`, `SINGLE_WEST`) to `StaticLayout` instances.
* **Error states:** Logs a warning if `INVALID_FIELD` is provided.

## Events & listeners
None identified.

`<`!-- No `Class()` constructor present; this is a pure module returning static layout definitions, not a component. -->
