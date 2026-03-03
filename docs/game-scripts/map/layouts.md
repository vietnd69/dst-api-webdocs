---
id: layouts
title: Layouts
description: Defines reusable static layouts for world generation, supporting pre-defined shapes, static layouts from files, and dynamic prefab placement via area functions.
tags: [world, generation, layout]
sidebar_position: 100

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: d1b50b1f
---

# Layouts

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This module (`map/layouts.lua`) defines a collection of reusable static layouts used by the world generation system to populate map locations with specific prefab arrangements. Layouts are organized as key-value entries in a global table (`ExampleLayout`), each describing how prefabs should be placed relative to a grid or geometric pattern (e.g., `LAYOUT.STATIC`, `LAYOUT.CIRCLE_EDGE`, `LAYOUT.GRID`). Layouts may reference external static layout files via `StaticLayout.Get()` (from `map/static_layout.lua`) or define inline placement rules via the `layout`, `count`, `ground`, and `areas` fields. Area functions allow dynamic prefab selection based on area size and spatial context (`area`, `data` arguments). The module is not a component but a data definition layer consumed by the worldgen system (e.g., `StaticLayout` and level/task logic) during maproom and island generation.

## Usage example

```lua
local layouts = require("map/layouts").Layouts

-- Use a predefined static layout (e.g., DefaultStart)
local layout = layouts.DefaultStart

-- Use a custom layout with inline definition (e.g., Farmplot)
local farm = layouts.Farmplot

-- Access area functions (e.g., for monkey island generation)
local monkey_hut_layout = monkeyhut_area() -- returns {"monkeyhut", "monkeyhut"}
local monkey_prefabs = monkeyisland_prefabs_area(10, {x=0, y=0, width=10, height=10})
```

## Dependencies & tags
**Components used:** None. This module is a pure data layer. It requires `constants.lua` and `map/static_layout.lua`, and uses functions from `util/math.lua` (`PickSome`, `PickSomeWithDups`) and `events.lua` (`IsSpecialEventActive`, `SPECIAL_EVENTS`).
**Tags:** The `add_topology` entries in some layouts (e.g., `monkey_island_add_data`) define topology tags such as `"RoadPoison"`, `"nohunt"`, `"nohasslers"`, `"not_mainland"`, but these are configuration metadata—not tags applied to entities or components.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `grass_area()` | `function(area, data) -> table` | — | Returns a table with 1–4 `"grass"` entries and optionally up to 3 `"evergreen_stump"` entries based on random chance. |
| `waterlogged_tree_area()` | `function(area, data) -> table` | — | Returns a randomized table of ocean-related prefabs (e.g., `"oceantree"`, `"oceanvine"`, `"watertree_root"`, `"fireflies"`, `"oceanvine_cocoon"`) for waterlogged islands. |
| `monkeyisland_prefabs_area(area, data)` | `function(area, data) -> table` | — | Returns a randomized list of prefabs for monkey island decorations, ensuring at least one each of `"bananabush"`, `"palmconetree_normal"`, and `"monkeytail"`, plus 1–2 `"lightcrab"` entries. |
| `monkeyhut_area()` | `function(area, data) -> table` | — | Returns a fixed list of two `"monkeyhut"` prefabs. |
| `monkey_island_add_data` | `table` | — | Topology and area function overrides for monkey island layouts, specifying `add_topology` and area functions (`monkeyisland_prefabs`, `monkeyhut_area`, `monkeyisland_docksafearea`). |
| `monkey_island_retrofit_topology_data` | `table` | — | Shared topology definition for monkey island retrofit layouts. |

## Main functions

This module does not export functions—only data structures. However, it defines the following utility functions used internally in layout definitions.

### `grass_area()`
* **Description:** Generates a randomized list of `"grass"` and `"evergreen_stump"` prefabs for use in island/room area definitions. Typically called within area functions passed to `StaticLayout.Get`.
* **Parameters:** None.
* **Returns:** `table` — A list of prefab names (e.g., `{"grass", "grass", "evergreen_stump"}`).
* **Error states:** None.

### `waterlogged_tree_area()`
* **Description:** Generates a randomized list of waterlogged (ocean-themed) prefabs, including `"oceantree"`, `"oceanvine"`, `"watertree_root"`, `"fireflies"`, and `"oceanvine_cocoon"`.
* **Parameters:** None.
* **Returns:** `table` — A list of prefab names.
* **Error states:** None.

### `monkeyisland_prefabs_area(area, data)`
* **Description:** Generates a curated list of monkey island decorative prefabs, guaranteeing diversity and ensuring a minimum set is always present. Uses `PickSomeWithDups`.
* **Parameters:**
  * `area` (`number`) — Approximate area of the region (used to compute base count).
  * `data` (`table`) — Spatial context (e.g., `{x=0, y=0, width=10, height=10}`).
* **Returns:** `table` — A list of prefab names including guaranteed entries plus random additions.
* **Error states:** None.

### `monkeyhut_area()`
* **Description:** Returns a fixed list of two `"monkeyhut"` prefabs.
* **Parameters:** None.
* **Returns:** `table` — Always `{"monkeyhut", "monkeyhut"}`.
* **Error states:** None.

## Events & listeners
None. This module is data-only and does not define event listeners or push events.