---
id: spear
title: Spear
description: A consumable spear weapon with limited durability that deals fixed damage and supports skin overrides on equip/unequip.
tags: [combat, consumable, item, equipment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f679d3fa
system_scope: inventory
---

# Spear

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spear` prefab represents a basic melee weapon item in DST that can be equipped by the player. It uses the `equippable`, `weapon`, and `finiteuses` components to manage durability, damage, and visual skin handling. It is designed as a consumable item that is automatically removed after all uses are depleted.

## Usage example
```lua
-- Typical use in a prefab definition
local spear = CreateEntity()
spear:AddTag("spear")  -- ensures compatibility with existing systems
spear:AddComponent("weapon")
spear.components.weapon:SetDamage(TUNING.SPEAR_DAMAGE)
spear:AddComponent("finiteuses")
spear.components.finiteuses:SetMaxUses(TUNING.SPEAR_USES)
spear.components.finiteuses:SetUses(TUNING.SPEAR_USES)
spear:AddComponent("equippable")
-- Set equip/unequip callbacks as needed
```

## Dependencies & tags
**Components used:** `weapon`, `finiteuses`, `equippable`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`
**Tags:** Adds `sharp`, `pointy`, `weapon`

## Properties
No public properties

## Main functions
### `onequip(inst, owner)`
*   **Description:** Handles visual changes when the spear is equipped, including overriding the swap animation symbol (with or without skin support) and adjusting ARM animations.
*   **Parameters:** `inst` (Entity) - the spear instance; `owner` (Entity) - the entity equipping the item.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Restores normal ARM animations and removes skin overrides when unequipped.
*   **Parameters:** `inst` (Entity) - the spear instance; `owner` (Entity) - the entity unequipping the item.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** `equipskinneditem` with `{skin = inst:GetSkinName()}` when a skinned spear is equipped; `unequipskinneditem` when unequipped; `percentusedchange` (via `finiteuses`); `onfinished` triggers `inst.Remove`.