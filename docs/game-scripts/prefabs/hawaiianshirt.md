---
id: hawaiianshirt
title: Hawaiianshirt
description: A wearable clothing item that provides summer insulation, spoils over time, and handles skinned item rendering on equip/unequip.
tags: [clothing, inventory, perishable, insulation]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b0a2977e
system_scope: inventory
---

# Hawaiianshirt

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hawaiianshirt` prefab represents a summer-appropriate clothing item that can be equipped in the BODY slot. It uses the `equippable`, `perishable`, and `insulator` components to provide seasonal insulation benefits, spoil over time, and correctly render over the player’s body when equipped—including support for skinned variants via override animations.

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("hawaiianshirt")
inst.components.equippable.equipslot = EQUIPSLOTS.BODY
inst.components.equippable.dapperness = TUNING.DAPPERNESS_MED
inst.components.perishable:SetPerishTime(TUNING.HAWAIIANSHIRT_PERISHTIME)
inst.components.perishable:StartPerishing()
inst:AddComponent("insulator")
inst.components.insulator:SetInsulation(TUNING.INSULATION_LARGE)
inst.components.insulator:SetSummer()
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inspectable`, `inventoryitem`, `equippable`, `perishable`, `insulator`, `hauntable`  
**Tags:** Adds `show_spoilage`  
**Anim-related:** Uses bank `"hawaiian_shirt"` and build `"torso_hawaiian"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `equipslot` | `EQUIPSLOTS` | `EQUIPSLOTS.BODY` | Slot in which the item can be equipped (BODY). |
| `dapperness` | number | `TUNING.DAPPERNESS_MED` | Determines bonus sanity from wearing this item. |
| `perishtime` | number | `TUNING.HAWAIIANSHIRT_PERISHTIME` | Time in seconds before the item spoils. |

## Main functions
Not applicable — this is a prefab definition, not a custom component class with user-facing methods.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls in this file).
- **Pushes:** None directly, but the equip/unequip callbacks (defined locally) push `"equipskinneditem"` or `"unequipskinneditem"` events when a skin build is present.

The `onequip` and `onunequip` functions (not part of a public API, but core to the prefab’s behavior) handle:
- Overriding `swap_body` symbol with `"torso_hawaiian"` on equip.
- Clearing the override on unequip.
- Triggering skinned-item events if `GetSkinBuild()` returns a non-`nil` skin build.