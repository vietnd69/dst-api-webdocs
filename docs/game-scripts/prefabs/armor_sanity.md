---
id: armor_sanity
title: Armor Sanity
description: Provides protective armor and applies a sanity penalty to the wearer when damage is blocked.
tags: [combat, sanity, equipment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 348c51a5
system_scope: inventory
---

# Armor Sanity

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `armor_sanity` prefab implements a piece of equipment that combines physical protection (via the `armor` component) with a unique mechanic: when damage is blocked, the wearer loses sanity equal to the blocked damage scaled by `TUNING.ARMOR_SANITY_DMG_AS_SANITY`. It is equipped in the `BODY` slot and modifies the entity’s visual appearance via `swap_body` animation overrides. The item also contributes to shadow-related progression via the `shadowlevel` component and is tagged as a `sanity` and `shadow_item` for game logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("equippable")
-- ... [other setup] ...

inst:AddComponent("armor")
inst.components.armor:InitCondition(TUNING.ARMOR_SANITY, TUNING.ARMOR_SANITY_ABSORPTION)

inst:AddComponent("shadowlevel")
inst.components.shadowlevel:SetDefaultLevel(TUNING.ARMOR_SANITY_SHADOW_LEVEL)
```

## Dependencies & tags
**Components used:** `armor`, `equippable`, `inventoryitem`, `shadowlevel`, `inspectable`
**Tags:** Adds `sanity`, `shadow_item`, `shadowlevel`

## Properties
No public properties are exposed or modified directly in the constructor. Property values (e.g., `absorb_percent`, `dapperness`) are set via component APIs during initialization.

## Main functions
### `onequip(inst, owner)`
*   **Description:** Handler called when the item is equipped. Applies animation overrides to the owner’s `swap_body` symbol (skin-aware), registers a `"blocked"` event listener on the owner to play sound feedback, and fires `"equipskinneditem"` if equipped with a skin.
*   **Parameters:**  
    - `inst` (Entity) – The armor item instance.  
    - `owner` (Entity) – The entity equipping the item.  
*   **Returns:** Nothing.
*   **Error states:** None.

### `onunequip(inst, owner)`
*   **Description:** Handler called when the item is unequipped. Clears animation overrides, removes the `"blocked"` event listener, and fires `"unequipskinneditem"` if a skin was applied.
*   **Parameters:**  
    - `inst` (Entity) – The armor item instance.  
    - `owner` (Entity) – The entity unequipping the item.  
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnTakeDamage(inst, damage_amount)`
*   **Description:** Callback assigned to `armor.ontakedamage`. Converts blocked damage into a sanity loss for the owner using `TUNING.ARMOR_SANITY_DMG_AS_SANITY`. Does nothing if the owner lacks a `sanity` component.
*   **Parameters:**  
    - `inst` (Entity) – The armor item instance.  
    - `damage_amount` (number) – The amount of damage blocked.  
*   **Returns:** Nothing.
*   **Error states:** Silent no-op if `owner` is `nil` or `owner.components.sanity` is missing.

## Events & listeners
- **Listens to:** `blocked` – registered on the owner when equipped to trigger sound playback (`OnBlocked`).
- **Pushes:** `equipskinneditem`, `unequipskinneditem` – fired via owner when skins are used; used by UI and tracking systems.

> **Note:** `blocked` events originate from the `owner` entity (typically during combat), not `inst` directly.

