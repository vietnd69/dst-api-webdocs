---
id: butterflywings
title: Butterflywings
description: A consumable inventory item that heals health and hunger but perishes quickly; used as a food source or cat toy.
tags: [food, inventory, perishable, pet]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 549cda76
system_scope: inventory
---

# Butterflywings

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`butterflywings` is a lightweight, perishable food item that restores a small amount of health and hunger. It is primarily used as a quick snack, a crafting ingredient, or a toy for cats (e.g., Wurt's character). The prefab combines the `edible`, `perishable`, `stackable`, and `inventoryitem` components to define its behavior as a standard consumable with limited shelf life and stack capacity. It is pristined on clients and becomes fully functional only on the master simulation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("edible")
inst.components.edible.healthvalue = TUNING.HEALING_MEDSMALL
inst.components.edible.hungervalue = TUNING.CALORIES_TINY
inst.components.edible.foodtype = FOODTYPE.VEGGIE

inst:AddComponent("perishable")
inst.components.perishable:SetPerishTime(TUNING.PERISH_FAST)
inst.components.perishable:StartPerishing()
inst.components.perishable.onperishreplacement = "spoiled_food"

inst:AddComponent("stackable")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM

inst:AddTag("cattoy")
MakeInventoryPhysics(inst)
```

## Dependencies & tags
**Components used:** `edible`, `perishable`, `stackable`, `inspectable`, `inventoryitem`, `tradable`  
**Tags:** Adds `cattoy`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthvalue` | number | `TUNING.HEALING_MEDSMALL` | Health restored upon consumption. |
| `hungervalue` | number | `TUNING.CALORIES_TINY` | Hunger restored upon consumption. |
| `foodtype` | FOODTYPE | `FOODTYPE.VEGGIE` | Category of food for gameplay logic (e.g., Perpetual Haste compatibility). |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size when placed in an inventory or container. |
| `perishtime` | number | `TUNING.PERISH_FAST` | Time in seconds before the item spoils. |
| `onperishreplacement` | string | `"spoiled_food"` | Prefab name spawned when this item perishes. |

## Main functions
### `SetPerishTime(time)`
*   **Description:** Sets the total perish duration and resets the remaining perish timer. If a periodic update task already exists, it restarts the perishing schedule.
*   **Parameters:** `time` (number) - the duration in seconds before the item spoils.
*   **Returns:** Nothing.
*   **Error states:** None; safe to call multiple times.

### `StartPerishing()`
*   **Description:** Begins the perish timer by scheduling a periodic check (every ~10–18 seconds) to determine if the item should spoil.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** `onperish` - fires when the item spoils (handled by `perishable` component); the `onperishreplacement` logic spawns the replacement item and removes the original.
- **Listens to:** None directly—relies on the `perishable` component's internal task and event propagation via `inst:PushEvent("onperish")`.