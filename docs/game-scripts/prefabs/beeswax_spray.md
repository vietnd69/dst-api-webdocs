---
id: beeswax_spray
title: Beeswax Spray
description: A consumable item that applies wax to plants and trees, temporarily protecting them from harvest damage or decay.
tags: [wax, plant, consumable, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ea4a1209
system_scope: inventory
---

# Beeswax Spray

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`beeswax_spray` is a consumable inventory item prefab that allows players to apply beeswax to plants, trees, and related entities. It is equipped like an item, consumes a fixed number of uses, and triggers network-synced visual effects (`beeswax_spray_fx`) when deployed. The prefab integrates with the `equippable`, `wax`, and `finiteuses` components to manage state, visual representation, and usage tracking.

Key relationships:
- Uses `equippable` to handle equip/unequip animations and skin support.
- Uses `wax` to signal that this item functions as a spray application tool.
- Uses `finiteuses` to manage charge consumption and self-destruction upon depletion.
- Requires several plant-related prefabs (e.g., `berrybush_waxed`, `sapling_waxed`) that are generated dynamically based on `PLANT_DEFS`, `WEED_DEFS`, and `TREE_DEFS`.

## Usage example
```lua
local spray = SpawnPrefab("beeswax_spray")
spray.components.finiteuses:SetUses(10) -- manually adjust remaining uses
spray.components.equippable:OnEquip(spray, player)
spray.components.equippable:OnUnequip(spray, player)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `equippable`, `wax`, `finiteuses`, `transform`, `animstate`, `network`, `floatable`, `hauntable_launch`  
**Tags:** None added or checked directly by this prefab; the `finiteuses` component adds the `usesdepleted` tag when `current <= 0`.

## Properties
No public properties are defined directly on the `beeswax_spray` prefab instance. Configuration is handled via component state and game tuning (`TUNING.BEESWAX_SPRAY_USES`).

## Main functions
### `OnEquip(inst, owner)`
*   **Description:** Handles equip logic, including applying skin overrides and animating arm states.
*   **Parameters:**  
    `inst` (Entity) — the beeswax spray instance.  
    `owner` (Entity) — the player equipping the item.  
*   **Returns:** Nothing.  
*   **Error states:** Skin-based override is skipped if `inst:GetSkinBuild()` returns `nil`.

### `OnUnequip(inst, owner)`
*   **Description:** Handles unequip logic, restoring default arm animations and reporting skin change events.
*   **Parameters:**  
    `inst` (Entity) — the beeswax spray instance.  
    `owner` (Entity) — the player unequipping the item.  
*   **Returns:** Nothing.

### `fn()`
*   **Description:** Constructor function that builds and configures the `beeswax_spray` entity.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — fully initialized prefab instance.
*   **Error states:** Returns early on clients (non-master sim) before adding server-side components.

## Events & listeners
- **Listens to:** None — this prefab does not register any event listeners.
- **Pushes:**  
  `equipskinneditem` — fired on equip when a skin build is present.  
  `unequipskinneditem` — fired on unequip when a skin build is present.  
  `percentusedchange` — pushed via `finiteuses:SetUses()` when remaining uses change (networked via replica).