---
id: nightmarefuel
title: Nightmarefuel
description: Implements a consumable item used as high-value fuel, repair material, and waterproofer in DST, with networked animation state and stacking support.
tags: [inventory, crafting, fuel, repair, waterproofer]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1ebf6f93
system_scope: inventory
---

# Nightmarefuel

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`Nightmarefuel` defines the prefabricated item used in-game as Nightmare Fuel—a stackable, non-rotting inventory item. It serves as a high-efficiency fuel source (`FUELTYPE.NIGHTMARE`), a repair material (`MATERIALS.NIGHTMARE`), and is initialized with a waterproofer component set to zero effectiveness (used for pristine state optimization). The entity supports network synchronization, physics, floatability, and hauntable properties. This prefab is typically used as a component in item prefabs but is itself a full entity definition.

## Usage example
```lua
local item = Prefab("nightmarefuel")
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddNetwork()
-- ... (full setup as in source) ...
inst:AddComponent("fuel")
inst.components.fuel.fueltype = FUELTYPE.NIGHTMARE
inst.components.fuel.fuelvalue = TUNING.LARGE_FUEL
inst:AddComponent("repairer")
inst.components.repairer.repairmaterial = MATERIALS.NIGHTMARE
inst.components.repairer.finiteusesrepairvalue = TUNING.NIGHTMAREFUEL_FINITEUSESREPAIRVALUE
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `fuel`, `repairer`, `waterproofer`, `inventoryitem`, `transform`, `animstate`, `network`, `floatable`, `hauntablelaunch`, `physics`, `inventoryitem`  
**Tags:** Adds `waterproofer` in pristine state (for optimization), checked implicitly via tag usage.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fueltype` | `FUELTYPE` | `FUELTYPE.NIGHTMARE` | Type of fuel this item provides when burned. |
| `fuelvalue` | number | `TUNING.LARGE_FUEL` | Energy value contributed when used as fuel. |
| `repairmaterial` | `MATERIALS` | `MATERIALS.NIGHTMARE` | Material type used for repair operations. |
| `finiteusesrepairvalue` | number | `TUNING.NIGHTMAREFUEL_FINITEUSESREPAIRVALUE` | Repair points consumed per use from a finite stock. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |
| `effectiveness` | number | `0` | Waterproofer effectiveness; set to `0` here (pristine state only). |

## Main functions
None. This file defines a prefab factory function (`fn`) that instantiates and configures an entity, not a reusable component class with methods. The component properties (e.g., `fuel.fuelvalue`, `repairer.finiteusesrepairvalue`) are assigned directly during setup.

## Events & listeners
None identified. The prefab does not register or fire any custom events.

`<`!--  -->
End of documentation.