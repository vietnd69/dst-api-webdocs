---
id: armor
title: Armor
description: Manages durability, damage absorption, and weakness modifiers for armor entities in combat.
tags: [combat, durability, equipment]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: ede55b01
system_scope: combat
---

# Armor

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `Armor` component manages durability and damage mitigation for wearable armor entities. It tracks condition values, calculates damage absorption percentages, handles weakness modifiers against specific attacker tags, and fires events when armor breaks or takes damage. This component integrates with `forgerepairable` for repair mechanics and `inventoryitem` for owner tracking when armor breaks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("armor")
inst.components.armor:InitCondition(100, 0.8)
inst.components.armor:SetTags({"monster"})
inst.components.armor:AddWeakness("fire", 1.5)
inst.components.armor:SetOnFinished(function(armor_inst) 
    print("Armor broke!") 
end)
inst.components.armor:TakeDamage(20)
```

## Dependencies & tags
**Components used:** `forgerepairable`, `inventoryitem`
**Tags:** None identified (tags are configurable via `SetTags` for resistance checking)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `condition` | number | `100` | Current durability value of the armor. |
| `maxcondition` | number | `100` | Maximum durability capacity. |
| `absorb_percent` | number | `nil` | Damage absorption percentage (0-1). |
| `tags` | table | `nil` | List of tags this armor resists against. |
| `weakness` | table | `nil` | Table mapping tags to bonus damage multipliers. |
| `indestructible` | boolean | `false` | Whether armor can be destroyed. |
| `conditionlossmultipliers` | SourceModifierList | N/A | Modifier list for damage calculation. |
| `onfinished` | function | `nil` | Callback fired when armor breaks. |
| `keeponfinished` | boolean | `true` | Whether to keep entity after breaking. |

## Main functions
### `SetOnFinished(fn)`
*   **Description:** Sets a callback function to execute when armor condition reaches zero.
*   **Parameters:** `fn` (function) - callback receiving the armor instance as argument.
*   **Returns:** Nothing.

### `SetKeepOnFinished(keep)`
*   **Description:** Configures whether the entity persists after armor breaks.
*   **Parameters:** `keep` (boolean) - if `false`, entity is removed when broken.
*   **Returns:** Nothing.

### `InitCondition(amount, absorb_percent)`
*   **Description:** Initializes armor with specific durability and absorption values.
*   **Parameters:** `amount` (number) - initial condition value; `absorb_percent` (number) - damage absorption rate.
*   **Returns:** Nothing.

### `InitIndestructible(absorb_percent)`
*   **Description:** Makes armor indestructible while setting absorption rate.
*   **Parameters:** `absorb_percent` (number) - damage absorption rate.
*   **Returns:** Nothing.

### `IsIndestructible()`
*   **Description:** Checks if armor cannot be destroyed.
*   **Parameters:** None.
*   **Returns:** Boolean `true` if indestructible, `false` otherwise.

### `IsDamaged()`
*   **Description:** Checks if current condition is below maximum.
*   **Parameters:** None.
*   **Returns:** Boolean `true` if damaged, `false` otherwise.

### `GetPercent()`
*   **Description:** Returns current durability as a percentage of maximum.
*   **Parameters:** None.
*   **Returns:** Number between `0` and `1`.

### `SetTags(tags)`
*   **Description:** Sets resistance tags for attack filtering.
*   **Parameters:** `tags` (table) - list of tag strings this armor resists.
*   **Returns:** Nothing.

### `AddWeakness(tag, bonus_damage)`
*   **Description:** Adds a weakness modifier against specific attacker tags.
*   **Parameters:** `tag` (string) - attacker tag to check; `bonus_damage` (number) - damage multiplier (removed if `<= 0`).
*   **Returns:** Nothing.

### `RemoveWeakness(tag)`
*   **Description:** Removes a specific weakness modifier.
*   **Parameters:** `tag` (string) - weakness tag to remove.
*   **Returns:** Nothing.

### `SetAbsorption(absorb_percent)`
*   **Description:** Updates the damage absorption percentage.
*   **Parameters:** `absorb_percent` (number) - new absorption rate (0-1).
*   **Returns:** Nothing.

### `SetPercent(amount)`
*   **Description:** Sets condition based on percentage of maximum.
*   **Parameters:** `amount` (number) - percentage value (0-1).
*   **Returns:** Nothing.

### `SetCondition(amount)`
*   **Description:** Sets the current durability value directly.
*   **Parameters:** `amount` (number) - new condition value.
*   **Returns:** Nothing.
*   **Error states:** Returns early without effect if `indestructible` is `true`. Pushes `percentusedchange` event and may trigger `onfinished` callback if condition `<= 0`.

### `CanResist(attacker, weapon)`
*   **Description:** Checks if armor can resist an attack based on tags.
*   **Parameters:** `attacker` (entity) - attacking entity; `weapon` (entity) - optional weapon entity.
*   **Returns:** Boolean `true` if attack can be resisted, `false` otherwise.

### `GetAbsorption(attacker, weapon)`
*   **Description:** Gets the effective absorption rate against specific attacker.
*   **Parameters:** `attacker` (entity) - attacking entity; `weapon` (entity) - optional weapon entity.
*   **Returns:** Number absorption percentage if can resist, `nil` otherwise.

### `GetBonusDamage(attacker, weapon)`
*   **Description:** Calculates bonus damage from weakness modifiers.
*   **Parameters:** `attacker` (entity) - attacking entity; `weapon` (entity) - optional weapon entity.
*   **Returns:** Number representing highest matching weakness multiplier, or `0` if none.

### `TakeDamage(damage_amount)`
*   **Description:** Applies damage to armor condition.
*   **Parameters:** `damage_amount` (number) - raw damage value before multipliers.
*   **Returns:** Nothing.
*   **Error states:** Applies `conditionlossmultipliers` before reducing condition. Pushes `armordamaged` event and calls `ontakedamage` callback if set.

### `Repair(amount)`
*   **Description:** Restores armor condition by specified amount.
*   **Parameters:** `amount` (number) - condition value to restore.
*   **Returns:** Nothing.
*   **Error states:** Calls `onrepair` callback if set.

### `GetDebugString()`
*   **Description:** Returns formatted condition string for debugging.
*   **Parameters:** None.
*   **Returns:** String in format `current/max`.

### `OnSave()`
*   **Description:** Serializes armor state for persistence.
*   **Parameters:** None.
*   **Returns:** Table with `condition` if damaged, `nil` if at full condition.

### `OnLoad(data)`
*   **Description:** Restores armor state from saved data.
*   **Parameters:** `data` (table) - saved data containing optional `condition` field.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `percentusedchange` - triggers internal handling when condition percentage changes, updates `forgerepairable` state and fires `armorbroke` event if condition reaches zero.
- **Pushes:** `percentusedchange` - fired when condition changes with `{ percent = value }` data; `armorbroke` - fired when condition reaches zero with `{ armor = inst }` data; `armordamaged` - fired when damage is taken with damage amount as data.