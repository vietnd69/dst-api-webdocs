---
id: royal_jelly
title: Royal Jelly
description: A consumable food item that restores health, hunger, and sanity; has a moderate perish time and can be stacked.
tags: [food, inventory, consumable, perishable, sanity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 962ad21b
system_scope: inventory
---

# Royal Jelly

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`royal_jelly` is a food item prefab that functions as a high-value consumable providing significant healing, moderate sanity recovery, and small caloric value. It is implemented as a stackable, perishable inventory item with network synchronization and tradability. The prefab relies on core DST components—`edible`, `perishable`, `stackable`, `tradable`, `inventoryitem`, and `inspectable`—to define its gameplay behavior. It also receives the `honeyed` tag and supports being floated on water.

## Usage example
```lua
local inst = SpawnPrefab("royal_jelly")
-- The item is ready to use: it automatically perishes after TUNING.PERISH_MED
-- and has its edible, stackable, and perishable components configured
inst.components.edible.healthvalue -- yields TUNING.HEALING_LARGE (default 30)
```

## Dependencies & tags
**Components used:** `edible`, `perishable`, `stackable`, `tradable`, `inventoryitem`, `inspectable`
**Tags:** `honeyed` is added via `inst:AddTag("honeyed")`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthvalue` | number | `TUNING.HEALING_LARGE` | Health restored on consumption (30). |
| `hungervalue` | number | `TUNING.CALORIES_SMALL` | Hunger restored on consumption (15). |
| `sanityvalue` | number | `TUNING.SANITY_MED` | Sanity restored on consumption (25). |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size (typically 20). |
| `onperishreplacement` | string | `"spoiled_food"` | Prefab name to spawn when item spoils. |
| `perishtime` | number | `TUNING.PERISH_MED` | Time (in seconds) before the item spoils. |

## Main functions
Not applicable. This is a prefab definition, not a component. Its behavior is implemented via attached components (`edible`, `perishable`, etc.).

## Events & listeners
Not applicable. Event handling occurs in the attached component classes (`edible.lua`, `perishable.lua`, etc.), not in this prefab definition.