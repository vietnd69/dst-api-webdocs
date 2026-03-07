---
id: goatmilk
title: Goatmilk
description: A consumable food item that restores health, hunger, and sanity, but spoils quickly and can be fed to cats.
tags: [food, consumable, perishable,宠物]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 728796fc
system_scope: inventory
---

# Goatmilk

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`goatmilk` is a food prefab representing fresh goat milk. It functions as a small-item consumable with moderate nutritional benefits and fast spoilage. It is tagged for use as cat food and integrates with the `edible`, `perishable`, `stackable`, `tradable`, and `inventoryitem` components. When it spoils, it transforms into `spoiled_food`.

## Usage example
```lua
-- Create an instance of goatmilk
local inst = Prefab("goatmilk", fn, assets, prefabs)()

-- Access nutritional values (on master simulation)
if inst.components.edible then
    local heal = inst.components.edible.healthvalue   -- TUNING.HEALING_SMALL
    local hunger = inst.components.edible.hungervalue -- TUNING.CALORIES_SMALL
    local sanity = inst.components.edible.sanityvalue -- TUNING.SANITY_SMALL
end

-- Check spoilage status
if inst.components.perishable then
    local time_left = inst.components.perishable.perishremainingtime
end
```

## Dependencies & tags
**Components used:** `edible`, `perishable`, `stackable`, `tradable`, `inspectable`, `inventoryitem`  
**Tags:** `catfood`, `fooddrink`  
**Spawns replacement:** `spoiled_food`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthvalue` | number | `TUNING.HEALING_SMALL` | Health restored when consumed. |
| `hungervalue` | number | `TUNING.CALORIES_SMALL` | Hunger restored when consumed. |
| `sanityvalue` | number | `TUNING.SANITY_SMALL` | Sanity restored when consumed. |
| `perishtime` | number | `TUNING.PERISH_FAST` | Duration (in seconds) before spoilage occurs. |
| `perishremainingtime` | number | — | Current time remaining until spoilage. |
| `onperishreplacement` | string | `"spoiled_food"` | Prefab name used to replace this item upon spoiling. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |

## Main functions
*This prefab does not define custom methods. It relies entirely on component APIs.*

## Events & listeners
*This prefab does not define event listeners or push events directly. It depends on component-level event handling (e.g., `perishable` manages its own update task and triggers replacement on spoilage).*