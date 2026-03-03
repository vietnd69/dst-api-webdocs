---
id: object_layout
title: Object Layout
description: Provides layout definition, conversion, and placement utilities for world generation, supporting static and procedural positioning of prefabs in maps.
tags: [world, map, layout, procedural]
sidebar_position: 100

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 90c67bd9
---

# Object Layout

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This module defines utilities for defining, converting, and placing object layouts during world generation. It is used to translate layout definitions (from sources such as `map/layouts.lua`, `map/traps.lua`, `map/pointsofinterest.lua`, etc.) into concrete lists of prefab instances with world coordinates, and then to reserve space and instantiate them in the world. It does not function as a component attached to an entity; rather, it provides procedural and deterministic layout APIs for map/task generation. Core responsibilities include:
- Selecting layout definitions by name (including random choice from mazes).
- Converting layout definitions into position lists using layout functions (static, grid, circle, edge).
- Handling layout transformations (scaling, rotation, flipping).
- Reserving space in the world and placing prefabs with terrain support.

Key relationships exist with `map/placement.lua` (for shape-based position generation), `map/layouts.lua` (main layout definitions), `map/traps.lua`, `map/pointsofinterest.lua`, `map/protected_resources.lua`, `map/boons.lua`, and `map/maze_layouts.lua` (for maze-specific layout variants).

## Usage example

```lua
local object_layout = require("map/object_layout")

-- Convert a layout definition into entity positions
local layout = object_layout.LayoutForDefinition("ruins_room_small")
local prefabs = object_layout.ConvertLayoutToEntitylist(layout)

-- Place the layout at a specific world position
local addEntity = {
    fn = AddPrefab,
    args = {
        entitiesOut = {},
        width = 1,
        height = 1,
        debug_prefab_list = {}
    }
}
object_layout.Place({x = 100, y = -50}, "ruins_room_small", addEntity)
```

## Dependencies & tags
**Components used:** None. This module is a pure utility library and does not use or add components to entities.
**Tags:** None identified.

## Properties
No public properties are exposed as module-level variables. All functionality is exposed as exported functions.

## Main functions

### `LayoutForDefinition(name, choices)`
* **Description:** Retrieves and returns a deep copy of a layout definition by name. Supports layouts from `map/layouts.lua`, `map/traps.lua`, `map/pointsofinterest.lua`, `map/protected_resources.lua`, `map/boons.lua`, and `map/maze_layouts.lua`. For mazes, allows random selection from choices or entirely random layout.
* **Parameters:**
  - `name` (`string`): The key identifying the layout in the layout libraries.
  - `choices` (`table|nil`): Optional list of maze layout group names to select from.
* **Returns:** `table` — A deep-copied layout definition table (e.g., with fields `layout`, `count`, `type`, `scale`, `defs`, `areas`, `ground`, etc.), or `nil` if layout not found.
* **Error states:** If the layout name is not found in any layout source, prints an error and returns `nil`.

### `ConvertLayoutToEntitylist(layout)`
* **Description:** Converts a parsed layout definition into a flat list of entity placement objects. Handles layout types (static or shape-based), layout `defs` (prefab substitution), `areas` (per-prefab region population), scaling, and area-based randomization. Result is an ordered list of items with `prefab`, `x`, `y`, and optional `properties`.
* **Parameters:**
  - `layout` (`table`): A layout definition table (must contain at least `layout` or `count` fields).
* **Returns:** `table` — A list of placement objects, each with keys `prefab`, `x`, `y`, and `properties`.
* **Error states:** Throws an assertion if `layout` is `nil`.

### `ReserveAndPlaceLayout(node_id, layout, prefabs, add_entity, position, world)`
* **Description:** Reserves space in the world for the layout and instantiates prefabs with optional terrain (ground) generation, rotation, scaling, and flipping. Coordinates are transformed based on layout orientation settings and provided world position.
* **Parameters:**
  - `node_id` (`string|number`): Identifier for the world region or node being generated.
  - `layout` (`table`): The full layout definition table (must include `scale`, `ground`, etc.).
  - `prefabs` (`table`): List of prefab placement objects, typically from `ConvertLayoutToEntitylist`.
  - `add_entity` (`table`): Container with `fn` (function) and `args` for the actual prefab spawning call. Expected: `{fn = function, args = {entitiesOut={}, width=..., height=..., debug_prefab_list={...}}}`.
  - `position` (`table|nil`): Optional `{x,y}` world position to force placement at. If `nil`, ReserveSpace computes the location.
  - `world` (`WorldSim|nil`): World simulation instance. Defaults to `WorldSim`.
* **Returns:** `nil`
* **Error states:** Throws assertions if required parameters (`node_id`, `layout`, `prefabs`, `add_entity`) are missing. Logs detailed diagnostic information (including dumps) if `position` is invalid during terrain generation.

### `Convert(node_id, item, addEntity)`
* **Description:** Convenience wrapper that combines `LayoutForDefinition`, `ConvertLayoutToEntitylist`, and `ReserveAndPlaceLayout`. Used for standard layout instantiation by node.
* **Parameters:**
  - `node_id` (`string|number`)
  - `item` (`string`): Layout name.
  - `addEntity` (`table`): As in `ReserveAndPlaceLayout`.
* **Returns:** `nil`
* **Error states:** Throws assertion if `item` is empty or invalid.

### `Place(position, item, addEntity, choices, world)`
* **Description:** Convenience wrapper that places a layout at an explicit world position, skipping ReserveSpace. Supports maze layout choice randomization.
* **Parameters:**
  - `position` (`table`): `{x,y}` world coordinates to place the layout.
  - `item` (`string`)
  - `addEntity` (`table`)
  - `choices` (`table|nil`): Optional random layout group selection.
  - `world` (`WorldSim|nil`)
* **Returns:** `nil`

### `PlaceAndPopulatePrefabDensities(position, item, addEntity, choices, world, id, prefab_densities)`
* **Description:** Performs `Place`, then computes and populates prefab density statistics (`prefab_count / land_tile_count`) into the `prefab_densities` table keyed by `id`.
* **Parameters:**
  - `position`, `item`, `addEntity`, `choices`, `world` — Same as `Place`.
  - `id` (`string|nil`): Key used in `prefab_densities`. Defaults to `layout.add_topology.room_id`.
  - `prefab_densities` (`table`): Table modified in-place to store density ratios.
* **Returns:** `nil`

### `GetLayoutLandCount(layout)`
* **Description:** Counts the number of land tiles in the layout's ground map (`layout.ground`) by checking `TileGroupManager:IsLandTile`.
* **Parameters:**
  - `layout` (`table`): Layout with optional `ground` and `ground_types`.
* **Returns:** `number` — Number of land tiles.

## Events & listeners
This module has no event listeners or event pushing behavior.