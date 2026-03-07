---
id: honey
title: Honey
description: A consumable food item that restores health and hunger, with slow perish rate and stackability.
tags: [food, consumable, inventory, perishable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f0544f47
system_scope: inventory
---

# Honey

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`honey` is a prefab representing a stackable food item in the game. It provides small health and hunger restoration and is designed to be consumed directly by players. The item slowly perishes over time and transforms into `spoiled_food` upon spoiling. It integrates with multiple systems including inventory, perishability, tradability, and inspectability.

## Usage example
```lua
local inst = SpawnPrefab("honey")
inst.components.edible.healthvalue = TUNING.HEALING_MEDIUM
inst.components.stackable:SetSize(10)
```

## Dependencies & tags
**Components used:** `edible`, `stackable`, `tradable`, `inspectable`, `perishable`, `inventoryitem`  
**Tags:** Adds `honeyed`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthvalue` | number | `TUNING.HEALING_SMALL` | Health restored upon consumption. |
| `hungervalue` | number | `TUNING.CALORIES_TINY` | Hunger restored upon consumption. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum number of items allowed in a stack. |
| `onperishreplacement` | string | `"spoiled_food"` | Prefab name to spawn when this item perishes. |
| `perishtime` | number | `TUNING.PERISH_SUPERSLOW` | Duration (in seconds) before the item spoils. |

## Main functions
Not applicable. The component itself is a prefab, not a standalone component class. All component usage occurs through `inst.components.*` after the prefab is spawned.

## Events & listeners
Not applicable. The prefab does not define custom event listeners or events. Perishing behavior and replacements are handled internally by the `perishable` and `edible` components.