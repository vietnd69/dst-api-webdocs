---
id: goatmilk
title: Goatmilk
description: Spawnable inventory item prefab representing milk from a domesticated beefalo, with edible, perishable, and stackable components.
tags: [prefab, food, inventory]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: a8b1073f
system_scope: inventory
---

# Goatmilk

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`goatmilk.lua` registers a spawnable food item entity that players can obtain from domesticated beefalo. The prefab's `fn()` constructor builds the physics body, attaches animation state, and adds client-side components. Server-side gameplay components (edible, perishable, stackable, tradable, inventoryitem, inspectable) are attached only on the master simulation. The prefab is referenced by its name `"goatmilk"` and instantiated with `SpawnPrefab("goatmilk")`.

## Usage example
```lua
-- Spawn goatmilk at world origin:
local inst = SpawnPrefab("goatmilk")
inst.Transform:SetPosition(0, 0, 0)

-- Access edible component values:
local health = inst.components.edible.healthvalue
local hunger = inst.components.edible.hungervalue

-- Check perishable state:
local perish_pct = inst.components.perishable:GetPerishPercent()

-- Stack with other goatmilk items:
inst.components.stackable:Add(5)
```

## Dependencies & tags
**External dependencies:**
- `MakeInventoryPhysics` -- applies physics and floatable behavior for inventory items
- `MakeInventoryFloatable` -- enables water floating with specified buoyancy parameters
- `MakeHauntableLaunch` -- makes item react to ghost haunt actions

**Components used:**
- `edible` -- provides health, hunger, sanity, and charge values when consumed
- `perishable` -- handles spoilage over time with replacement on perish
- `stackable` -- allows stacking up to TUNING.STACK_SIZE_SMALLITEM
- `tradable` -- enables trading with other players
- `inspectable` -- allows player inspection
- `inventoryitem` -- enables pickup and inventory storage

**Tags:**
- `catfood` -- added in fn(); marks item as valid food for cats
- `fooddrink` -- added in fn(); categorizes item as drinkable food

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | `{Asset("ANIM", "anim/goatmilk.zip")}` | Array of asset entries listing animation files loaded with this prefab. |
| `prefabs` | table | `{"spoiled_food"}` | Array of dependent prefab names that must be loaded; spawned when this item perishes. |

## Main functions
### `fn()`
* **Description:** Prefab constructor function. Creates the entity, builds transform and anim state, sets default animation to "idle", applies inventory physics, adds tags, and makes the item floatable. On master simulation, attaches gameplay components (edible, perishable, stackable, tradable, inspectable, inventoryitem) and configures their properties from TUNING constants. Returns `inst` for framework processing.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host with master-side logic guarded by `TheWorld.ismastersim` check.

## Events & listeners
None identified.