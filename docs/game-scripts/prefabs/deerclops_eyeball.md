---
id: deerclops_eyeball
title: Deerclops Eyeball
description: A consumable boss loot item dropped by Deerclops that restores health, hunger, and sanity when eaten.
tags: [item, consumable, boss_loot, food, sanity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b9b064ea
system_scope: inventory
---

# Deerclops Eyeball

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `deerclops_eyeball` prefab represents a rare, high-value consumable item obtained as boss loot from defeating Deerclops. It functions as a nutritious food source with significant restorative effects: large health and hunger restoration, but with a moderate sanity penalty. As a prefabricated entity, it is built with core visual, network, and physics components, and extended with gameplay components including `edible`, `stackable`, `inspectable`, `tradable`, `inventoryitem`, and `snowmandecor`.

## Usage example
```lua
local inst = SpawnPrefab("deerclops_eyeball")
inst.components.edible.healthvalue = TUNING.HEALING_HUGE
inst.components.edible.sanityvalue = -TUNING.SANITY_MED
inst.components.stackable.maxsize = TUNING.STACK_SIZE_LARGEITEM
```

## Dependencies & tags
**Components used:** `edible`, `stackable`, `inspectable`, `tradable`, `inventoryitem`, `snowmandecor`  
**Tags:** `deerclops_eyeball`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foodtype` | `FOODTYPE` enum | `FOODTYPE.MEAT` | Classification of the item as meat, used by food metabolism systems. |
| `healthvalue` | number | `TUNING.HEALING_HUGE` | Amount of health restored when consumed. |
| `hungervalue` | number | `TUNING.CALORIES_HUGE` | Amount of hunger restored when consumed. |
| `sanityvalue` | number | `-TUNING.SANITY_MED` | Sanity effect (negative = loss) when consumed. |
| `maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum stack size for inventory grouping. |

## Main functions
Not applicable — this is a prefab definition, not a component class. It initializes an instance via its `fn()` factory and sets up properties on added components directly.

## Events & listeners
Not applicable — this prefab definition does not register or fire custom events. It relies on component-level events (e.g., from `edible.oneat`) inherited from standard behavior.
