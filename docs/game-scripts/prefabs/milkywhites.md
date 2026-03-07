---
id: milkywhites
title: Milkywhites
description: A consumable cat food item that restores health and hunger but reduces sanity, and spoil over time.
tags: [consumable, inventory, food, spoil]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e64f1499
system_scope: inventory
---

# Milkywhites

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `milkywhites` prefab represents a consumable item in the inventory system used as cat food. It is a stackable, perishable food item that grants small health and hunger restoration but causes a moderate sanity loss when consumed. It is intended for use by cat-like characters (e.g., Webber) to avoid sanity penalties or to gain food benefits. It is created using the `Prefab` system and sets up default components including `edible`, `perishable`, `stackable`, `inventoryitem`, `tradable`, and `inspectable`.

## Usage example
```lua
local inst = SpawnPrefab("milkywhites")
inst.components.edible.healthvalue = TUNING.HEALING_MEDSMALL
inst.components.edible.hungervalue = TUNING.CALORIES_SMALL
inst.components.edible.sanityvalue = -TUNING.SANITY_MEDLARGE
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM
inst.components.perishable:SetPerishTime(TUNING.PERISH_MED)
```

## Dependencies & tags
**Components used:** `edible`, `perishable`, `stackable`, `inventoryitem`, `inspectable`, `tradable`  
**Tags:** Adds `catfood`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthvalue` | number | `TUNING.HEALING_MEDSMALL` | Health restored on consumption. |
| `hungervalue` | number | `TUNING.CALORIES_SMALL` | Hunger restored on consumption. |
| `sanityvalue` | number | `-TUNING.SANITY_MEDLARGE` | Sanity change on consumption (negative value indicates loss). |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `onperishreplacement` | string | `"spoiled_food"` | Prefab name to replace this item when it spoils. |
| `perishtime` | number | `TUNING.PERISH_MED` | Time in seconds before the item spoils. |

## Main functions
None (the component logic is purely declarative setup in the constructor; no custom methods are defined in this file beyond standard component usage.)

## Events & listeners
None identified.