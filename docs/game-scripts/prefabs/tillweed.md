---
id: tillweed
title: Tillweed
description: A perishable vegetable item that can be dried on a meat rack to produce tillweed_dried.
tags: [inventory, food, crafting, drying]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a5d5330e
system_scope: inventory
---

# Tillweed

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Tillweed` is a player-held inventory item representing a raw vegetable that spoils quickly over time. It is edible (providing minor healing) and can be dried using the `dryable` component, which transforms it into `tillweed_dried`. As part of DST’s crafting system, it supports stacking, fuel usage, and hauntable conversion.

## Usage example
```lua
local inst = SpawnPrefab("tillweed")
inst.components.edible.healthvalue = 10
inst.components.perishable:SetPerishTime(TUNING.PERISH_FAST)
inst.components.perishable:StartPerishing()
inst.components.perishable.onperishreplacement = "spoiled_food"
inst.components.dryable:SetProduct("tillweed_dried")
inst.components.dryable:SetDryTime(TUNING.DRY_FAST)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `edible`, `inspectable`, `tradable`, `fuel`, `perishable`, `dryable`, `smallburnable`, `smallpropagator`  
**Tags:** Adds `cattoy`, `dryable`, `vegetable` (via `edible.foodtype = FOODTYPE.VEGGIE`), `hauntable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animbank` | string | `"tillweed"` | Animation bank used for rendering. |
| `animbuild` | string | `"tillweed"` | Build file name for the idle animation. |
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |
| `edible.foodtype` | FOODTYPE | `FOODTYPE.VEGGIE` | Food classification used by the game. |
| `edible.healthvalue` | number | `TUNING.HEALING_TINY` | Health restored when eaten. |
| `edible.hungervalue` | number | `0` | Hunger restored when eaten (none). |
| `fuel.fuelvalue` | number | `TUNING.TINY_FUEL` | Fuel value when burned. |
| `perishable.perishtime` | number | `TUNING.PERISH_FAST` | Time (in seconds) before the item spoils. |
| `perishable.onperishreplacement` | string | `"spoiled_food"` | Prefab name to spawn on spoilage. |
| `dryable.product` | string | `"tillweed_dried"` | Name of the dried item. |
| `dryable.drytime` | number | `TUNING.DRY_FAST` | Time (in seconds) required to dry. |
| `dryable.buildfile` | string | `"meat_rack_food_petals"` | Animation build for dried state. |

## Main functions
*Not applicable.*

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.