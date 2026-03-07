---
id: carnival_food
title: Carnival Food
description: Generates a set of carnival-themed food prefabs with configurable nutritional values, perishability, and floating behavior.
tags: [food, inventory, prefabs]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 91284a3a
system_scope: inventory
---

# Carnival Food

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines a factory pattern for creating carnival-themed food prefabs in DST. It uses a shared `MakeFood` function to instantiate multiple food items with varying properties (e.g., hunger, health, sanity, perish time). Each generated prefab includes components for inventory interaction, floating behavior, perishability, tradability, and burnability. The prefabs are registered via `Prefab()` and returned as unpacked values for use elsewhere in the codebase.

## Usage example
```lua
local carnivalfood_corntea = require("prefabs/carnival_food")

-- The function returns unpacked prefabs; use one directly:
local food_entity = carnivalfood_corntea()

-- Then spawn it in the world:
food_entity.Transform:SetPosition(x, y, z)
TheWorld:SpawnEntity(food_entity)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`, `physics`, `inventoryfloatable`, `floater`, `edible`, `perishable`, `stackable`, `tradable`, `inspectable`, `inventoryitem`, `smallburnable`, `smallpropagator`, `hauntablelaunch`  
**Tags:** Adds `fooddrink`, `pre-preparedfood` (and any custom tags from `def.tags`)

## Properties
No public properties are defined for this file itself — it is a generator of prefabs. The generated prefabs expose properties via attached components:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.edible.foodtype` | `FOODTYPE` enum | `def.food` | Food category (e.g., `VEGGIE`). |
| `inst.components.edible.hungervalue` | number | `def.hunger` | Hunger restored on consumption. |
| `inst.components.edible.healthvalue` | number | `def.health` | Health restored on consumption. |
| `inst.components.edible.sanityvalue` | number | `def.sanity` | Sanity change on consumption. |
| `inst.components.perishable.perishtime` | number | `def.perishtime` | Time in seconds until the item spoils. |
| `inst.components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |
| `inst.components.floater.size` | string | `def.floater[1]` | Floating physics size (e.g., `"small"`). |
| `inst.components.floater.xscale/yscale/zscale` | number | `def.floater[2]` | Scale applied to floating FX. |

## Main functions
### `MakeFood(def)`
*   **Description:** Factory function that constructs and configures a food prefab based on the input definition table `def`.
*   **Parameters:** `def` (table) - A table containing keys like `name`, `anim`, `art`, `tags`, `food`, `hunger`, `health`, `sanity`, `perishtime`, `temperature`, `temperatureduration`, and `floater`.
*   **Returns:** `Prefab` — A fully configured prefab definition ready for world spawning.
*   **Error states:** Returns early on clients (when `TheWorld.ismastersim == false`) before adding server-only components like `edible` and `perishable`; no error occurs, but components are only present on the master sim.

## Events & listeners
None identified. This file does not register or fire any custom events.