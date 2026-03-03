---
id: armor
title: Armor
description: Manages damage resistance, durability, and breakdown behavior for wearable items like gear and clothing.
tags: [combat, durability, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ede55b01
system_scope: entity
---

# Armor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Armor` component tracks and modifies damage mitigation for an entity (typically wearable items such as clothing, armor, or accessories). It supports durability-based degradation, conditional resistance checks, weakness multipliers, and automatic breakdown notification. It integrates with `ForgeRepairable` to toggle repairability based on damage state and `InventoryItem` to notify the owner when the armor breaks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("armor")
inst.components.armor:InitCondition(100, 0.5) -- 50% damage absorption
inst.components.armor:AddWeakness("fire", 50)  -- Takes extra damage from fire sources
inst.components.armor:TakeDamage(20)
```

## Dependencies & tags
**Components used:** `forgerepairable`, `inventoryitem`
**Tags:** Reads tags from `self.tags` (used for resist/weakness matching). No tags are added/removed directly by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `condition` | number | `100` | Current durability value. |
| `maxcondition` | number | `100` | Maximum durability value (set during initialization). |
| `tags` | table or `nil` | `nil` | List of tags that this armor is resistant to (if non-`nil`). |
| `weakness` | table or `nil` | `nil` | Map of tag → bonus damage for entities/weapons that exploit weaknesses. |
| `absorb_percent` | number | `0` | Percentage of incoming damage reduced (e.g., `0.5` = 50% mitigation). |
| `conditionlossmultipliers` | `SourceModifierList` | instance | Modifies damage taken to durability via external modifiers. |
| `indestructible` | boolean | `false` | If `true`, prevents durability loss. |
| `onfinished` | function or `nil` | `nil` | Callback executed when armor breaks (`condition <= 0`). |
| `keeponfinished` | boolean | `true` | Whether the entity persists after breaking. |

## Main functions
### `SetOnFinished(fn)`
*   **Description:** Sets a callback function to run when the armor breaks.
*   **Parameters:** `fn` (function) - function taking one argument (`inst`), called when `condition <= 0`.
*   **Returns:** Nothing.

### `SetKeepOnFinished(keep)`
*   **Description:** Controls whether the entity is removed from the world after breaking.
*   **Parameters:** `keep` (boolean, default `true`) - if `false`, calls `inst:Remove()` when breaking.
*   **Returns:** Nothing.

### `InitCondition(amount, absorb_percent)`
*   **Description:** Initializes standard damageable armor with given durability and absorption.
*   **Parameters:**
    *   `amount` (number) - initial and maximum durability.
    *   `absorb_percent` (number) - damage reduction percentage (e.g., `0.5`).
*   **Returns:** Nothing.

### `InitIndestructible(absorb_percent)`
*   **Description:** Initializes indestructible armor (e.g., magical items that never degrade).
*   **Parameters:** `absorb_percent` (number) - damage reduction percentage.
*   **Returns:** Nothing.

### `IsIndestructible()`
*   **Description:** Returns whether the armor is indestructible.
*   **Parameters:** None.
*   **Returns:** `true` if `indestructible` is `true`, otherwise `false`.

### `IsDamaged()`
*   **Description:** Checks if the armor has taken any damage.
*   **Parameters:** None.
*   **Returns:** `true` if `condition < maxcondition`, otherwise `false`.

### `GetPercent()`
*   **Description:** Returns the remaining durability as a fraction between `0.0` and `1.0`.
*   **Parameters:** None.
*   **Returns:** `condition / maxcondition` (number).

### `SetTags(tags)`
*   **Description:** Sets the list of tags this armor resists.
*   **Parameters:** `tags` (table) - array of string tags; armor resists if *any* attacker or weapon tag matches.
*   **Returns:** Nothing.

### `AddWeakness(tag, bonus_damage)`
*   **Description:** Adds or updates a weakness to damage from specific tags. If `bonus_damage <= 0`, removes the weakness.
*   **Parameters:**
    *   `tag` (string) - tag of attacker/weapon that triggers extra damage.
    *   `bonus_damage` (number) - extra damage multiplier (applied multiplicatively).
*   **Returns:** Nothing.

### `RemoveWeakness(tag)`
*   **Description:** Removes a weakness entry for the specified tag.
*   **Parameters:** `tag` (string) - tag to remove from weaknesses.
*   **Returns:** Nothing.

### `SetAbsorption(absorb_percent)`
*   **Description:** Updates the damage reduction percentage.
*   **Parameters:** `absorb_percent` (number) - e.g., `0.5` = 50% mitigation.
*   **Returns:** Nothing.

### `SetPercent(amount)`
*   **Description:** Sets durability to a percentage of `maxcondition`.
*   **Parameters:** `amount` (number) - fraction (e.g., `0.75` for 75%).
*   **Returns:** Nothing.

### `SetCondition(amount)`
*   **Description:** Sets absolute durability value. Clamps to `[0, maxcondition]`. Fires `"percentusedchange"` and `"armorbroke"` events as needed.
*   **Parameters:** `amount` (number) - new durability value.
*   **Returns:** Nothing.
*   **Error states:** If `indestructible` is `true`, does nothing.

### `OnSave()`
*   **Description:** Returns serializable data if armor is damaged.
*   **Parameters:** None.
*   **Returns:** `{ condition = self.condition }` if damaged, otherwise `nil`.

### `OnLoad(data)`
*   **Description:** Loads saved durability value.
*   **Parameters:** `data` (table) - expected to contain `data.condition`.
*   **Returns:** Nothing.

### `CanResist(attacker, weapon)`
*   **Description:** Checks if this armor resists the attacker or weapon.
*   **Parameters:**
    *   `attacker` (entity or `nil`) - the attacking entity.
    *   `weapon` (entity or `nil`) - the weapon used.
*   **Returns:** `true` if `tags == nil` (resists all) or if any tag matches `attacker`/`weapon`; `false` otherwise.

### `GetAbsorption(attacker, weapon)`
*   **Description:** Returns the absorption percentage if the armor resists the attacker/weapon.
*   **Parameters:** Same as `CanResist`.
*   **Returns:** `absorb_percent` (number) if `CanResist(...) == true`, otherwise `nil`.

### `GetBonusDamage(attacker, weapon)`
*   **Description:** Returns the highest bonus damage from weaknesses if the attacker/weapon matches a weakness tag.
*   **Parameters:** Same as `CanResist`.
*   **Returns:** Maximum `bonus_damage` value (number, ≥ `0`), or `0` if no match or `weakness == nil`.

### `TakeDamage(damage_amount)`
*   **Description:** Reduces durability by a modified damage amount and fires `"armordamaged"` event.
*   **Parameters:** `damage_amount` (number) - raw damage applied to durability.
*   **Returns:** Nothing.
*   **Note:** Applies `conditionlossmultipliers` before reducing durability.

### `Repair(amount)`
*   **Description:** Increases durability by `amount`, up to `maxcondition`.
*   **Parameters:** `amount` (number) - durability to restore.
*   **Returns:** Nothing.
*   **Note:** Calls `onrepair` callback if set.

### `GetDebugString()`
*   **Description:** Returns a human-readable durability string for debugging.
*   **Parameters:** None.
*   **Returns:** `"condition/maxcondition"` (string).

## Events & listeners
- **Listens to:** `percentusedchange` — internal handler updates repairability and notifies owner on break.
- **Pushes:**
    *   `"percentusedchange"` — with `{ percent = ... }` when durability changes.
    *   `"armorbroke"` — with `{ armor = inst }` to owner when durability reaches `0`.
    *   `"armordamaged"` — with `damage_amount` after damage is applied.
