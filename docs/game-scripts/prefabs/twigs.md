---
id: twigs
title: Twigs
description: A multi-functional small item that serves as fuel, food, repair material, and ocean fishing tackle in Don't Starve Together.
tags: [crafting, fuel, food, repair, fishing]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3f7ca83f
system_scope: inventory
---

# Twigs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `twigs` prefab is a versatile utility item that functions as fuel, food, boat repair material, and ocean fishing tackle. It is designed for early-game resource management and is renewable, stackable, and floatable. The component logic is embedded in the prefab definition itself (via function `fn`), which attaches multiple components to the entity to enable its diverse behaviors.

## Usage example
```lua
-- Typical usage in a game context: items are created by the prefab system
-- but this demonstrates the component interactions programmatically:
local inst = Prefab("twigs")
inst.components.fuel.fuelvalue = TUNING.SMALL_FUEL
inst.components.edible.healthvalue = TUNING.HEALING_TINY/2
inst.components.edible.foodtype = FOODTYPE.ROUGHAGE
inst.components.repairer.healthrepairvalue = TUNING.REPAIR_STICK_HEALTH
inst.components.oceanfishingtackle:SetCastingData(
    TUNING.OCEANFISHING_TACKLE.BOBBER_TWIG, 
    "oceanfishingbobber_twig_projectile"
)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `tradable`, `fuel`, `edible`, `inspectable`, `repairer`, `oceanfishingtackle`, `snowmandecor`  
**Tags:** `cattoy`, `renewable`, `oceanfishing_bobber`, `twigs`

## Properties
No public properties are defined directly in the `twigs` file; properties are set on attached components via their own APIs:
| Component | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `stackable` | `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `fuel` | `fuelvalue` | number | `TUNING.SMALL_FUEL` | Energy yield when used as fuel. |
| `edible` | `foodtype` | `FOODTYPE` | `FOODTYPE.ROUGHAGE` | Food classification for消化 mechanics. |
| `edible` | `secondaryfoodtype` | `FOODTYPE` | `FOODTYPE.WOOD` | Secondary classification. |
| `edible` | `healthvalue` | number | `TUNING.HEALING_TINY/2` | Health restored per consumption. |
| `edible` | `hungervalue` | number | `TUNING.CALORIES_TINY` | Hunger restored per consumption. |
| `repairer` | `repairmaterial` | `MATERIALS` | `MATERIALS.WOOD` | Material type used for repair UI/filtering. |
| `repairer` | `healthrepairvalue` | number | `TUNING.REPAIR_STICK_HEALTH` | Hull points repaired per use on boats. |
| `oceanfishingtackle` | `casting_data` | table | `TUNING.OCEANFISHING_TACKLE.BOBBER_TWIG` | Data config for bobber casting behavior. |

## Main functions
No standalone functions are defined in the `twigs` prefab itself. All logic is implemented via attached components and their methods. Direct usage is through component API calls.

## Events & listeners
- **Pushes:** No events are explicitly pushed by this prefab.
- **Listens to:** No event listeners are registered on the instance in this file.

> **Note:** The `master_postinit` branch for `quagmire` game mode implies server-side initialization, but no direct event handling or firing is present in this file.