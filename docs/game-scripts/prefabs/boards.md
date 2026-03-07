---
id: boards
title: Boards
description: A stackable inventory item used for repairing boats and as fuel.
tags: [inventory, repair, fuel, crafting]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b4c8c7be
system_scope: inventory
---

# Boards

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`boards` is a prefab representing a stackable crafting material used primarily for boat repair. It acts as both a repair material (via the `repairer` component) and a fuel source (via the `fuel` component), with light value and burnability tuned for gameplay balance. As an inventory item, it supports floating on water and can be launched/ignited via haunt effects.

## Usage example
```lua
local inst = SpawnPrefab("boards")
inst.components.stackable:DoDecay(1)
inst.components.repairer:RepairTarget(target_boat, 1)
```

## Dependencies & tags
**Components used:** `edible`, `stackable`, `inspectable`, `repairer`, `fuel`, `inventoryitem`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foodtype` | `FOODTYPE` | `FOODTYPE.WOOD` | Specifies that this item is edible only as wood-type food (inedible in practice due to zero nutrition). |
| `healthvalue` | number | `0` | Health restored upon consumption (unused due to zero hunger value). |
| `hungervalue` | number | `0` | Hunger restored upon consumption (set to zero, making it non-nutritive). |
| `fuelvalue` | number | `TUNING.LARGE_FUEL` | Fuel units provided when used as fuel. |
| `healthrepairvalue` | number | `TUNING.REPAIR_BOARDS_HEALTH` | Health points restored to a boat per repair action. |
| `repairmaterial` | `MATERIALS` | `MATERIALS.WOOD` | Material type for repair recipes and compatibility checks. |
| `maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum stack size for this item. |

## Main functions
No public methods beyond component standard APIs are defined directly in the `boards` prefab constructor.

## Events & listeners
None identified.