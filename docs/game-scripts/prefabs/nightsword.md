---
id: nightsword
title: Nightsword
description: A consumable weapon that deals shadow damage and loses one use each time it is swung.
tags: [combat, shadow, weapon, consumable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 484ce01d
system_scope: inventory
---

# Nightsword

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `nightsword` is a consumable inventory item and weapon prefab that deals shadow damage and has a limited number of uses. It is equipped as a held item and degrades permanently on use, eventually being removed from the game world when depleted. The item integrates with multiple core systems: `weapon` (combat), `finiteuses` (consumable tracking), `equippable` (visual and gameplay behavior on equip/unequip), `shadowlevel` (influences darkness exposure effects), and `inspectable`.

## Usage example
```lua
local inst = Prefab("nightsword", fn, assets)
-- The prefab is typically spawned in the world as a ground item or given to an inventory:
player.components.inventory:GiveItem(inst)
-- When equipped by a player, it modifies their animation and applies shadow dapperness.
-- Each swing consumes one use until exhaustion, after which the item is automatically removed.
```

## Dependencies & tags
**Components used:** `weapon`, `finiteuses`, `equippable`, `shadowlevel`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`
**Tags:** Adds `shadow_item`, `shadow`, `sharp`, `weapon`, `shadowlevel`

## Properties
No public properties are defined in the `nightsword` constructor.

## Main functions
The `nightsword` prefab does not define any standalone functions beyond `onequip` and `onunequip` (used as callbacks), and the main factory function `fn()`. The behavior is delegated to attached components; no custom methods are exposed on `inst.components`.

### `onequip(inst, owner)`
*   **Description:** Callback invoked when the item is equipped. Updates the owner’s animation to show “ARM_carry”, hides “ARM_normal”, and applies animation overrides for skinned variants. Also notifies the owner if a skin is active.
*   **Parameters:**
    *   `inst` (entity) – the nightsword instance.
    *   `owner` (entity) – the entity equipping the item (typically a player).
*   **Returns:** Nothing.
*   **Error states:** None identified; safe to call only on valid owner entities with `AnimState` and `entity`.

### `onunequip(inst, owner)`
*   **Description:** Callback invoked when the item is unequipped. Restores the owner’s default “ARM_normal” animation, hides “ARM_carry”, and notifies the owner of skin removal if applicable.
*   **Parameters:**
    *   `inst` (entity) – the nightsword instance.
    *   `owner` (entity) – the entity unequipping the item.
*   **Returns:** Nothing.
*   **Error states:** None identified.

## Events & listeners
- **Listens to:** None identified (no `inst:ListenForEvent` calls).
- **Pushes:** None identified (no `inst:PushEvent` calls from this prefab’s own code; though `equipskinneditem` and `unequipskinneditem` events are pushed *via* the owner in `onequip`/`onunequip`, they originate from the `owner`, not `inst` directly).