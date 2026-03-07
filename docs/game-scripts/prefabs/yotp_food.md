---
id: yotp_food
title: Yotp Food
description: A factory function that generates prefabs for prepared food items with configurable edible, perishable, and floater properties.
tags: [inventory, food, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fdc2f336
system_scope: inventory
---

# Yotp Food

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yotp_food.lua` is a prefab factory module that dynamically creates food item prefabs based on internal food definitions. It supports multiple food variants (e.g., tribute roast, mud pie, fish head skewers) by iterating over `foodinfo` tables and calling `MakeFood()`. Each generated entity includes core components like `edible`, `perishable`, `floater`, `stackable`, and `tradable`, making them suitable for inventory use with appropriate spoilage, stacking, and floating behavior.

## Usage example
```lua
-- Generate the first food item (e.g., tribute roast)
local tribute_roast_prefab = require "prefabs/yotp_food"

-- Note: The module returns multiple prefabs (e.g., yotp_food1, yotp_food2, etc.)
-- Use the appropriate prefab name when spawning:
local inst = SpawnPrefab("yotp_food1")
```

## Dependencies & tags
**Components used:** `edible`, `perishable`, `floater`, `stackable`, `tradable`, `inspectable`, `inventoryitem`  
**Tags added:** `pre-preparedfood`, plus any `data.tags` defined per food entry

## Properties
No public properties are exposed by the `yotp_food.lua` module itself. All configuration is done via the local `foodinfo` table and internal prefab construction logic.

## Main functions
### `MakeFood(num)`
*   **Description:** Factory function that constructs and returns a `Prefab` for a specific food variant identified by `num`. Handles visual setup, component initialization, and event listening for floating animation overrides.
*   **Parameters:** `num` (number) — 1-based index into the `foodinfo` table.
*   **Returns:** `Prefab` — A callable prefab factory function.
*   **Error states:** If `num` exceeds `#foodinfo`, `data` will be `nil`, likely causing runtime errors when accessing `data.*` fields.

## Events & listeners
- **Listens to:**  
  - `floater_startfloating` — Triggers playback of the suffixed `"_float"` animation (e.g., `"food1_float"`) when the item starts floating.  
  - `floater_stopfloating` — Reverts to the base animation (e.g., `"food1"`) when floating stops.  
  *(Listeners only added if `data.floater[3] == true`)*