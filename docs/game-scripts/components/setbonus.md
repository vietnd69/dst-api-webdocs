---
id: setbonus
title: Setbonus
description: Manages equipment set bonus logic for entities, enabling or disabling set-based effects when matching gear is equipped.
tags: [inventory, equipment, combat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 35948e2f
system_scope: inventory
---

# Setbonus

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SetBonus` is a component that tracks and controls whether an entity (typically an equipable item like a helmet or body armor) is part of a complete equipment set (e.g., spear + helmet). It is typically attached to equipable prefabs and works alongside the `inventory` component to activate or deactivate set-based bonuses when head and body pieces of the same set are equipped by the same owner. It also supports custom callback functions for when the bonus is enabled or disabled.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("setbonus")
inst.components.setbonus:SetSetName("Explorer")
inst.components.setbonus:SetOnEnabledFn(function(equip) print("Set bonus enabled for", equip.prefab) end)
inst.components.setbonus:SetOnDisabledFn(function(equip) print("Set bonus disabled for", equip.prefab) end)
```

## Dependencies & tags
**Components used:** `inventory`, `inventoryitem`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `setname` | string | `""` | Name of the equipment set this item belongs to (e.g., `"Explorer"`). Must match a key in `EQUIPMENTSETNAMES` in `constants.lua`. |
| `enabled` | boolean | `false` | Whether the set bonus is currently active for this item. |
| `onenabledfn` | function | `nil` | Optional callback executed when the set bonus is enabled. Receives the equipped item (`equip`) as argument. |
| `ondisabledfn` | function | `nil` | Optional callback executed when the set bonus is disabled. Receives the equipped item (`equip`) as argument. |
| `EnableBonusForEquip` | function | `EnableBonusForEquip` | Public method exposed for modding; enables the set bonus on a given equipment item. |
| `DisableBonusForEquip` | function | `DisableBonusForEquip` | Public method exposed for modding; disables the set bonus on a given equipment item. |

## Main functions
### `SetSetName(name)`
* **Description:** Assigns the equipment set name to this item. Validates the name against `EQUIPMENTSETNAMES` in `constants.lua`.
* **Parameters:** `name` (string) — the set name (case-insensitive).
* **Returns:** Nothing.
* **Error states:** Throws an assertion failure if `name` does not exist as a key in `EQUIPMENTSETNAMES`.

### `SetOnEnabledFn(fn)`
* **Description:** Sets the callback function to run when the set bonus is enabled.
* **Parameters:** `fn` (function) — a function taking a single argument (the equipped item entity).
* **Returns:** Nothing.

### `SetOnDisabledFn(fn)`
* **Description:** Sets the callback function to run when the set bonus is disabled.
* **Parameters:** `fn` (function) — a function taking a single argument (the equipped item entity).
* **Returns:** Nothing.

### `:UpdateSetBonus(inventory, isequipping)`
* **Description:** Called by the `inventory` component when items are equipped or unequipped. Evaluates whether the owner currently has both head and body pieces of the same set equipped, and updates all equipped items accordingly (enabling or disabling bonuses).
* **Parameters:**
  * `inventory` (InventoryComponent or `nil`) — the owner's inventory component.
  * `isequipping` (boolean) — `true` if the current action is equipping (otherwise, unequipping).
* **Returns:** Nothing.
* **Error states:** No-op if `inventory` is `nil`. During unequipping, this item itself is explicitly disabled via `DisableBonusForEquip`.

### `:IsEnabled(setname)`
* **Description:** Checks if the bonus is currently enabled. Optionally verifies it matches a specific set name.
* **Parameters:** `setname` (string or `nil`) — if provided, verifies the bonus belongs to this set.
* **Returns:** `true` if `enabled` is `true` and (if `setname` is given) matches `self.setname`; otherwise `false`.
* **Error states:** Throws an assertion if `setname` is provided but not found in `EQUIPMENTSETNAMES`.

### `:OnRemoveFromEntity()`
* **Description:** Ensures the set bonus is properly disabled when this item is removed from its owner. Updates the set bonus state for the owner’s inventory if applicable.
* **Parameters:** None.
* **Returns:** Nothing.

### `:GetDebugString()`
* **Description:** Returns a human-readable string for debugging, showing the set name and current enabled state.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"Set Name: \"X\"  -  Bonus: ON/OFF"`.

## Events & listeners
None identified.
