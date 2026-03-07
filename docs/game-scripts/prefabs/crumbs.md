---
id: crumbs
title: Crumbs
description: A small consumable item used as bait or pet food, which spoils over time and has minimal nutritional value.
tags: [food, bait, perishable, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e5bd7a6c
system_scope: inventory
---

# Crumbs

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`crumbs` is a lightweight inventory item prefab representing food crumbs—typically used as bait for pets (e.g., beefalos) or as a minimal food source. It inherits from standard food mechanics via the `edible` component, supports stacking, and features full perish behavior via `perishable`. It is automatically removed upon spoiling.

The prefab integrates with multiple core systems: `inventoryitem` (for carrying), `stackable` (for stacking limit), `bait` (for pet attraction), and `tradable`/`inspectable` (for trade UI and inspection). It also implements burn and propagation properties and supports haunt mechanics.

## Usage example
```lua
-- Example of spawning and configuring crumbs programmatically
local inst = SpawnPrefab("crumbs")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM
inst.components.edible.foodtype = FOODTYPE.GOODIES
inst.components.edible.healthvalue = 0
inst.components.edible.hungervalue = 1
inst.components.perishable:SetPerishTime(TUNING.PERISH_ONE_DAY)
inst.components.perishable:StartPerishing()
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `edible`, `bait`, `tradable`, `inspectable`, `perishable`  
**Tags:** `catfood`, `crumbs`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `edible.foodtype` | FOODTYPE | `FOODTYPE.GOODIES` | Indicates the type of food (goodies). |
| `edible.healthvalue` | number | `0` | Health restored per consumption. |
| `edible.hungervalue` | number | `1` | Hunger restored per consumption. |
| `perishable.perishtime` | number | `TUNING.PERISH_ONE_DAY` | Time (in seconds) until item spoils. |
| `perishable.perishremainingtime` | number | — | Time remaining until spoilage (updated automatically). |

## Main functions
### `inst.Remove()`
*   **Description:** Removes the item instance from the world. Called automatically when the item perishes (via `SetOnPerishFn`).  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** None—safe to call directly or via perish callback.

## Events & listeners
*   **Pushes:** `onperish` — implicitly via the `perishable` component’s internal handling (though not directly referenced in this file, the perish flow triggers component events).
*   **Listens to:** None explicitly in `crumbs.lua`; event handling is delegated to components like `perishable`.