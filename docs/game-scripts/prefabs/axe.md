---
id: axe
title: Axe
description: Provides a multiplayer-synced chopping tool with durability, weapon damage, and skin-aware equip animations for characters.
tags: [inventory, combat, tool]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 43ffbff0
system_scope: inventory
---

# Axe

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `axe` prefab implements a reusable chopping tool with durability tracking and weapon functionality (damage and wear-on-attack). It supports three variants—standard, golden, and moonglass—each with unique tuning parameters for durability, damage, and attack wear. The component integrates with the `equippable`, `tool`, `weapon`, and `finiteuses` systems to handle equipped animations, action effectiveness, and resource consumption. It also manages skin-aware animation overrides for equipped state and supports network replication via `entity:AddNetwork()`.

## Usage example
```lua
local inst = SpawnPrefab("axe")
inst.components.tool:SetAction(ACTIONS.CHOP, 1)
inst.components.weapon:SetDamage(TUNING.AXE_DAMAGE)
inst.components.equippable:SetOnEquip(function(inst, owner)
    print("Axe equipped by", owner:GetDescription())
end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `tool`, `finiteuses`, `weapon`, `inspectable`, `equippable`, `floater`, `damagetypebonus` (moonglass only)  
**Tags added:** `sharp`, `possessable_axe`, `tool`, `weapon` (non-Quagmire), `usesdepleted` (via `finiteuses` when depleted)

## Properties
No public properties are defined directly in this file.

## Main functions
### `common_fn(bank, build)`
*   **Description:** Shared prefab constructor for all axe variants. Sets up transform, anim state, sound, network, physics, tags, and core components (tool, finiteuses, weapon, equippable, floater, inspectable). Does *not* variant-specific tuning (handled in wrapper functions).
*   **Parameters:** `bank` (string) - animation bank name; `build` (string) - animation build name.
*   **Returns:** The constructed entity instance.
*   **Error states:** Returns early on clients (when `TheWorld.ismastersim` is false) after basic entity setup.

### `onequip(inst, owner)`
*   **Description:** Called when the axe is equipped. Sets swap animation symbol and shows/hides appropriate limbs. Handles skin overrides if present.
*   **Parameters:** `inst` (Entity) - the axe instance; `owner` (Entity) - the character equipping the axe.
*   **Returns:** Nothing.
*   **Error states:** If no skin is present, `owner.AnimState:OverrideItemSkinSymbol` is skipped.

### `onunequip(inst, owner)`
*   **Description:** Called when the axe is unequipped. Restores default arm animations and clears skin overrides.
*   **Parameters:** `inst` (Entity); `owner` (Entity).
*   **Returns:** Nothing.

### `onequipgold(inst, owner)`
*   **Description:** Variant-specific equip handler for golden axes. Plays golden item sound and uses golden animation symbol.
*   **Parameters:** `inst` (Entity); `owner` (Entity).
*   **Returns:** Nothing.

### `onequip_moonglass(inst, owner)`
*   **Description:** Variant-specific equip handler for moonglass axes. Uses glass axe swap animation (no sound override).
*   **Parameters:** `inst` (Entity); `owner` (Entity).
*   **Returns:** Nothing.

### `onattack_moonglass(inst, attacker, target)`
*   **Description:** Sets `attackwear` dynamically for moonglass axes based on target tags (higher wear on shadow-type targets).
*   **Parameters:** `inst` (Entity); `attacker` (Entity); `target` (Entity or `nil`).
*   **Returns:** Nothing.
*   **Error states:** Uses `target ~= nil and target:IsValid()` guard to avoid nil errors.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** `equipskinneditem`, `unequipskinneditem`, `percentusedchange` (via `finiteuses`).
  - Note: The component itself does *not* register listeners; these events are emitted by `equippable` and `finiteuses` components during their internal lifecycle.