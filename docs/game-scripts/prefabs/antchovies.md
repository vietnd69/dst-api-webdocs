---
id: antchovies
title: Antchovies
description: A prefabricated food item representing a tiny, shelf-stable fish snack with negligible nutritional value.
tags: [food, consumable, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9cbf3047
system_scope: inventory
---

# Antchovies

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`antchovies` is a lightweight, consumable item prefab used as a minimal food source in the game. Though shipped in the codebase, it is marked as unused in comments. It implements core functionality via the `edible` and `stackable` components to define its consumption properties and inventory stack size. The prefab includes standard visual, audio, and network infrastructure via transforms, animstates, sound emitters, and dynamic shadows.

## Usage example
```lua
-- Example of spawning an antchovies instance and inspecting its edible properties
local inst = Prefab("antchovies", nil, nil)
inst:AddComponent("edible")
inst:AddComponent("stackable")

print(inst.components.edible.healthvalue)     -- 0
print(inst.components.edible.hungervalue)     -- TUNING.CALORIES_TINY
print(inst.components.stackable.maxsize)      -- TUNING.STACK_SIZE_SMALLITEM
```

## Dependencies & tags
**Components used:** `inventoryitem`, `edible`, `stackable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthvalue` | number | `0` | Health restored on consumption. |
| `hungervalue` | number | `TUNING.CALORIES_TINY` | Hunger restored on consumption. |
| `sanityvalue` | number | `0` | Sanity restored (or lost if negative) on consumption. |
| `foodtype` | FOODTYPE | `FOODTYPE.MEAT` | Category of food, used for crafting and dietary rules. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item in inventories. |

## Main functions
No custom methods are defined in this prefab. All functionality is delegated to the `edible` and `stackable` components.

## Events & listeners
None identified.