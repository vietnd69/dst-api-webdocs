---
id: reflectivevest
title: Reflectivevest
description: A wearable item that provides insulation, water resistance, and fuel-based active protection, worn on the body slot.
tags: [clothing, insulation, waterproofer, fuel]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d9d6a0fb
system_scope: inventory
---

# Reflectivevest

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `reflectivevest` is a wearable prefab that provides passive insulation and water resistance, while also consuming fuel over time to grant active defensive properties (e.g., reflecting or mitigating damage). It uses the `equippable`, `fueled`, `insulator`, and `waterproofer` components to achieve its functionality. When equipped, it overrides the player's body animation symbol and begins fuel consumption; when unequipped or applied to a model preview, fuel consumption stops.

## Usage example
```lua
local vest = SpawnPrefab("reflectivevest")
vest.Transform:SetPosition(x, y, z)
-- When equipped:
vest.components.equippable:OnEquip(player)
-- When unequipped:
vest.components.equippable:OnUnequip(player)
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `insulator`, `waterproofer`, `inspectable`, `inventoryitem`, `hauntable`
**Tags:** Adds `waterproofer`; checks for skins via `GetSkinBuild()`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animstate.bank` | string | `"reflective_vest"` | Animation bank name used for body animations. |
| `animstate.build` | string | `"torso_reflective"` | Build name for model/animation assets. |
| `dapperness` | number | `TUNING.DAPPERNESS_SMALL` | Dapperness value applied when equipped (affects sanity). |
| `equipslot` | EQUIPSLOT | `EQUIPSLOTS.BODY` | Slot where the item is worn. |
| `fueltype` | FUELTYPE | `FUELTYPE.USAGE` | Type of fuel this item consumes. |
| `insulation` | number | `TUNING.INSULATION_MED` | Level of insulation against cold/heat. |
| `effectiveness` | number | `TUNING.WATERPROOFNESS_SMALL` | Effectiveness of water resistance. |

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** None (no event listeners defined directly in this file).
- **Pushes:** None (no events pushed directly in this file).  
  *(Note: Events are triggered indirectly via components: e.g., `fueled` triggers `"onfueldsectionchanged"`, and skin-related events `"equipskinneditem"`/`"unequipskinneditem"` are pushed via the owner.)*