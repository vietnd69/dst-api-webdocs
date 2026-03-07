---
id: cutreeds
title: Cutreeds
description: A stackable, edible inventory item that serves as lightweight fuel and raw vegetation food.
tags: [inventory, food, fuel, vegetation]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cb803c59
system_scope: inventory
---

# Cutreeds

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `cutreeds` prefab represents a common plant-based resource collected from the environment, primarily used as animal food (especially for Beefalo), fuel, and minor healing when consumed raw. It is implemented as a standard inventory item with attached `stackable`, `edible`, and `fuel` components. It integrates with the game's burning, floatable, and hauntable systems to support gameplay mechanics like fire maintenance and沼泽 hazard mitigation.

## Usage example
```lua
local inst = SpawnPrefab("cutreeds")
inst.components.stackable:DoRefill() -- Ensures stack is full
inst.components.edible:GiveFood("player")
inst.components.fuel:Ignite(2) -- Ignites with duration modifier
```

## Dependencies & tags
**Components used:** `stackable`, `edible`, `fuel`, `inspectable`, `inventoryitem`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pickupsound` | string | `"vegetation_grassy"` | Sound played when the item is picked up. |
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |
| `edible.foodtype` | FOODTYPE | `FOODTYPE.ROUGHAGE` | Classification for consumption by specific creatures. |
| `edible.healthvalue` | number | `TUNING.HEALING_TINY` | Health restored per consumption. |
| `edible.hungervalue` | number | `TUNING.CALORIES_TINY / 2` | Hunger restored per consumption. |
| `fuel.fuelvalue` | number | `TUNING.SMALL_FUEL` | Base duration the item burns in fireplaces/forges. |

## Main functions
*Not applicable* — No custom methods are defined; behavior is delegated entirely to attached components (`edible`, `fuel`, `stackable`, etc.) and utility functions (`MakeSmallBurnable`, `MakeSmallPropagator`, etc.).

## Events & listeners
*Not applicable* — No direct event listening or pushing is implemented in this prefab's constructor.