---
id: hambat
title: Hambat
description: A perishable melee weapon whose damage decreases as it spoils over time.
tags: [combat, perishable, weapon, inventory,Equippable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8e6f196d
system_scope: inventory
---

# Hambat

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hambat` prefab represents a melee weapon that degrades in effectiveness as it spoils. It uses the `perishable` component to track freshness, and the `weapon` component to dynamically adjust damage output based on remaining freshness via the `UpdateDamage` callback. When equipped, it modifies the owner's animation and supports skinned variants.

## Usage example
```lua
local inst = SpawnPrefab("hambat")
-- Equipping the hambat on a player triggers UpdateDamage, which adjusts its damage based on spoilage
player.components.inventory:Equip(inst)
-- Manually updating damage (e.g., after restore) can be done by calling:
inst.components.weapon:SetDamage(inst.components.weapon.damage) -- though typically handled by UpdateDamage callback
```

## Dependencies & tags
**Components used:** `perishable`, `weapon`, `forcecompostable`, `equippable`, `inventoryitem`, `inspectable`
**Tags:** `show_spoilage`, `icebox_valid`, `weapon`, `equippable`, `food`, `meat`

## Properties
No public properties.

## Main functions
### `UpdateDamage(inst)`
*   **Description:** Recalculates and applies the weapon's current damage based on its freshness percentage. Called during initialization, load, equip, unequip, and on weapon attack.
*   **Parameters:** `inst` (Entity) - the hambat entity instance.
*   **Returns:** Nothing.
*   **Error states:** Early-exits silently if `perishable` or `weapon` components are missing or invalid.

### `OnLoad(inst, data)`
*   **Description:** Ensures damage is updated after the entity is loaded from save data.
*   **Parameters:** 
    * `inst` (Entity) - the entity instance.
    * `data` (table?) - serialized save data (unused directly).
*   **Returns:** Nothing.

### `onequip(inst, owner)`
*   **Description:** Handles logic when the hambat is equipped by a player: updates damage, overrides animation symbols for visuals and skin support, and adjusts the owner's arm animations.
*   **Parameters:** 
    * `inst` (Entity) - the hambat entity.
    * `owner` (Entity) - the player equipping the item.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Handles logic when the hambat is unequipped: updates damage and reverts owner animation states.
*   **Parameters:** 
    * `inst` (Entity) - the hambat entity.
    * `owner` (Entity) - the player unequipping the item.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `equipskinneditem`, `unequipskinneditem` — via `owner:PushEvent(...)` calls inside `onequip`/`onunequip`.
- **Pushes:** `equipskinneditem` (on equip if skinned), `unequipskinneditem` (on unequip if skinned), and `onattack` — indirectly via `weapon.onattack` callback.