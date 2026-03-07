---
id: charcoal
title: Charcoal
description: A stackable consumable item that serves as fuel, food, bait, and a装饰 item in DST.
tags: [inventory, fuel, food, bait, decoration]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e4aae21c
system_scope: inventory
---

# Charcoal

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`charcoal` is a simple item prefab that functions as both fuel and low-nutrition food (classified as `BURNT`), and also serves as bait for moles and a decorative item for Snow Man. It uses the standard ECS components `stackable`, `fuel`, `edible`, `tradable`, `bait`, `inspectable`, `inventoryitem`, and `snowmandecor`. It also includes helper functions like `MakeMediumBurnable`, `MakeMediumPropagator`, and `MakeHauntableLaunchAndIgnite` to enable interaction with fire-based systems.

## Usage example
```lua
local inst = SpawnPrefab("charcoal")
-- Stackable: Add more charcoal to stack
inst.components.stackable:StackSize(1)
-- Fuel: Used in fire-based crafting
local fuel_value = inst.components.fuel.fuelvalue
-- Edible: Consume for small hunger/health restoration
inst.components.edible:OnEat(inst)
```

## Dependencies & tags
**Components used:** `stackable`, `fuel`, `edible`, `tradable`, `bait`, `inspectable`, `inventoryitem`, `snowmandecor`  
**Tags:** Adds `molebait` and `decorationsnowman`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pickupsound` | string | `"wood"` | Sound played when the item is picked up. |
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `components.fuel.fuelvalue` | number | `TUNING.MED_FUEL` | Fuel value used when burning the item. |
| `components.edible.foodtype` | FOODTYPE | `FOODTYPE.BURNT` | Food classification (affects hunger/health restoration). |
| `components.edible.hungervalue` | number | `20` | Amount of hunger restored on consumption. |
| `components.edible.healthvalue` | number | `20` | Amount of health restored on consumption. |

## Main functions
No custom public methods are defined in this prefab. It relies entirely on methods provided by its attached components and helper functions.

## Events & listeners
None identified.