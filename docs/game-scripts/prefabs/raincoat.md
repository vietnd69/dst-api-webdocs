---
id: raincoat
title: Raincoat
description: A wearable item that provides waterproofer protection and insulation while slowly consuming fuel over time.
tags: [clothing, inventory, weather]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: be437155
system_scope: inventory
---

# Raincoat

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `raincoat` prefab is a wearable inventory item that grants waterproofer and insulation properties to the wearer. It consumes fuel over time while equipped to maintain its protective effect, and stops consuming when unequipped or when attached to a character model (e.g., during preview). The component integrates closely with the `equippable`, `fueled`, and `insulator` systems to manage wear state, fuel consumption, and insulation level.

## Usage example
```lua
local raincoat = SpawnPrefab("raincoat")
if raincoat then
    raincoat.components.fueled:InitializeFuelLevel(600) -- Set custom fuel level (seconds)
    raincoat.components.equippable:SetOnEquip(function(inst, owner) 
        print("Raincoat equipped!") 
    end)
end
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `insulator`, `inspectable`, `inventoryitem`, `tradable`, `waterproofer`  
**Tags:** Adds `waterproofer` (used for optimization and identification)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `equipslot` | `EQUIPSLOTS` | `EQUIPSLOTS.BODY` | Slot where the item is equipped (body armor slot). |
| `insulated` | boolean | `true` | Indicates whether the item provides insulation (true). |
| `fueltype` | `FUELTYPE` | `FUELTYPE.USAGE` | Type of fuel consumed; in this case, a usage-based consumable. |
| `insulation` | number | `TUNING.INSULATION_SMALL` | Insulation value provided by the item. |

## Main functions
Not applicable — this file defines a prefab factory (`fn`) that constructs and configures the entity. No standalone functions are exposed as public API beyond what is provided by the added components.

## Events & listeners
- **Pushes (on equip):**  
  - `equipskinneditem` with `{ skin_build_name }` — fired when equipping a skinned variant of the item.  
- **Pushes (on unequip):**  
  - `unequipskinneditem` with `{ skin_build_name }` — fired when unequipping a skinned variant.  
- **Listens to (via `fueled` component):**  
  - Internal `onfueldsectionchanged` events to handle fuel level transitions (not directly handled in this file, but observed by `fueled`).