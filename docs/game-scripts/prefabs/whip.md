---
id: whip
title: Whip
description: A ranged combat item that attacks targets with a whip, triggering knockback effects and optional supersnap mechanics against enemies with active combat targets.
tags: [combat, inventory, weapon]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 57ceb2d7
system_scope: combat
---

# Whip

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `whip` prefab is a consumable ranged weapon item that deals damage and has a chance to trigger a "supersnap" effect. When used, it checks if the target has an active combat target; if the supersnap chance rolls successfully, it clears the target's current combat target and forces the target into the `hit` state, waking them up if they are sleeping. It integrates with the `weapon`, `finiteuses`, `equippable`, and `inventoryitem` components, and modifies the owner's animation and skin symbols on equip/unequip.

## Usage example
```lua
local inst = SpawnPrefabs("whip")
inst.components.weapon:SetDamage(30)
inst.components.finiteuses:SetMaxUses(15)
inst.components.finiteuses:SetUses(15)
inst:AddComponent("inspectable")
inst:AddComponent("inventoryitem")
inst:AddComponent("equippable")
inst.components.equippable:SetOnEquip(my_on_equip_fn)
inst.components.equippable:SetOnUnequip(my_on_unequip_fn)
```

## Dependencies & tags
**Components used:** `weapon`, `finiteuses`, `inventoryitem`, `equippable`, `inspectable`  
**Tags:** Adds `whip`, `weapon` (for optimization)

## Properties
No public properties.

## Main functions
### `onequip(inst, owner)`
*   **Description:** Called when the whip is equipped. Adjusts the owner's animation (shows `ARM_carry`, hides `ARM_normal`) and overrides animation symbols for skin support.
*   **Parameters:**  
    `inst` (Entity) - the whip entity.  
    `owner` (Entity) - the entity equipping the whip.  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Called when the whip is unequipped. Restores the owner's idle animation state (`ARM_normal` visible, `ARM_carry` hidden) and handles skin cleanup.
*   **Parameters:**  
    `inst` (Entity) - the whip entity.  
    `owner` (Entity) - the entity unequipping the whip.  
*   **Returns:** Nothing.

### `supercrack(inst)`
*   **Description:** Finds entities within `TUNING.WHIP_SUPERCRACK_RANGE` that must have the `_combat` tag and lack certain immunity tags, then drops their current combat target and forces them into the `hit` state if valid (not dead, not in an interrupt-immune state).
*   **Parameters:**  
    `inst` (Entity) - the whip entity performing the supersnap.  
*   **Returns:** Nothing.

### `whipsupersnapchanceadditive(inst, chance, luck)`
*   **Description:** A helper function used by `TryLuckRoll` to increase supersnap chance based on luck. Adds `luck * 0.5` to the base chance if `luck > 0`.
*   **Parameters:**  
    `chance` (number) - base supersnap chance.  
    `luck` (number) - current luck value of the attacker.  
*   **Returns:** (number) - adjusted chance if `luck > 0`, otherwise original `chance`.

### `onattack(inst, attacker, target)`
*   **Description:** Called when the whip attacks a target. Determines supersnap chance based on target tags, spawns an `impact` prefab at the target location, and either triggers `supercrack()` on success or plays a small snap sound on failure.
*   **Parameters:**  
    `inst` (Entity) - the whip entity.  
    `attacker` (Entity) - the entity wielding the whip.  
    `target` (Entity or `nil`) - the entity being attacked.  
*   **Returns:** Nothing.
*   **Error states:** Early exit if `target` is `nil` or invalid.

## Events & listeners
- **Listens to:** None directly (no `inst:ListenForEvent` calls in this file).
- **Pushes:**  
  - `equipskinneditem` / `unequipskinneditem` - via owner when skin is active.  
  - (Indirectly via other components) `percentusedchange`, `usesdepleted`, `droppedtarget`, `onwakeup`, `hit`, `hit_other`, etc., depending on component interactions.