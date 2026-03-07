---
id: pigskin
title: Pigskin
description: A consumable meat item that can be stacked, burned, and traded for gold, belonging to the "horrible" food category.
tags: [inventory, consumable, trading, fire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c2f7bd7a
system_scope: inventory
---

# Pigskin

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pigskin` is a lightweight, stackable inventory item representing raw pork that spawns naturally in the world (e.g., dropped by Pigs). It supports stacking, floating on water, burning, igniting, and being traded to Pig merchants for gold. It is classified as `FOODTYPE.HORRIBLE`, indicating it is unsuitable for consumption by most characters.

## Usage example
```lua
-- Example of creating and configuring a pigskin item programmatically
local inst = SpawnPrefab("pigskin")
inst.components.stackable:SetStackSize(5)  -- override default max stack
inst.components.tradable.goldvalue = 10    -- custom trade price
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `tradable`, `inventoryitem`, `edible`, and utility functions `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndIgnite`.
**Tags:** None explicitly added or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size (30 items). |
| `components.tradable.goldvalue` | number | `TUNING.GOLD_VALUES.MEAT` | Gold value when traded to pigs. |
| `components.edible.foodtype` | enum | `FOODTYPE.HORRIBLE` | Food category affecting eatability. |

## Main functions
No custom methods are defined on this prefab. Its behavior is entirely driven by attached components and prefabricated utility functions.

## Events & listeners
None identified.
