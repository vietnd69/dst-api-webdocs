---
id: armor
title: Armor
description: Manages an entity's damage absorption, durability, and breaking behavior when used as armor.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
source_hash: ede55b01
---

# Armor

## Overview
The Armor component is attached to equippable items to allow them to absorb a percentage of incoming damage on behalf of the wearer. It tracks the item's `condition` (durability), which depletes as it absorbs damage. When the condition reaches zero, the armor is considered "broken," triggering events and potentially causing the item to be removed from the game. This component also supports indestructible armor, weaknesses to specific damage types, and resistance against certain attacker tags.

## Dependencies & Tags
**Dependencies:**
- `forgerepairable` (Optional): Used to set the item as repairable or not based on its condition.
- `inventoryitem` (Optional): Used to access the armor's owner to push events when it breaks.

**Tags:**
This component does not add any tags to its entity. However, it reads tags on attackers and their weapons to determine if the armor is effective (`tags` property) or has a vulnerability (`weakness` property).

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `condition` | number | `100` | The current durability of the armor. |
| `maxcondition` | number | `100` | The maximum durability of the armor. |
| `tags` | table | `nil` | A list of tags this armor is effective against. If `nil`, it resists all attacks. |
| `weakness` | table | `nil` | A map of tags to bonus damage values. If an attacker has a matching tag, the wearer takes extra damage. |
| `conditionlossmultipliers` | SourceModifierList | `SourceModifierList(self.inst)` | A list of multipliers that affect how much durability is lost when the armor takes damage. |
| `absorb_percent`| number | `nil` | The percentage of damage (0.0 to 1.0) this armor absorbs. Initialized via `InitCondition` or `InitIndestructible`. |
| `indestructible`| boolean | `nil` | If true, the armor does not lose condition from damage. Set via `InitIndestructible`. |
| `onfinished` | function | `nil` | A callback function executed when the armor's condition reaches zero. |
| `keeponfinished` | boolean | `true` | If false, the armor entity is removed from the game when its condition reaches zero. |

## Main Functions
### `InitCondition(amount, absorb_percent)`
* **Description:** Initializes the armor as a standard, destructible item. Sets its maximum and current condition, and its damage absorption percentage.
* **Parameters:**
    * `amount` (number): The maximum and starting condition of the armor.
    * `absorb_percent` (number): The percentage of damage to absorb (e.g., 0.8 for 80%).

### `InitIndestructible(absorb_percent)`
* **Description:** Initializes the armor as an indestructible item. It will absorb damage but its condition will not decrease.
* **Parameters:**
    * `absorb_percent` (number): The percentage of damage to absorb.

### `SetOnFinished(fn)`
* **Description:** Sets a callback function to be executed when the armor's condition drops to zero.
* **Parameters:**
    * `fn` (function): The function to call when the armor breaks. It receives the armor's entity instance as an argument.

### `SetKeepOnFinished(keep)`
* **Description:** Determines if the armor entity should be removed from the game when its condition reaches zero.
* **Parameters:**
    * `keep` (boolean): If `false`, the entity will be removed when it breaks. Defaults to `true`.

### `AddWeakness(tag, bonus_damage)`
* **Description:** Adds a weakness to the armor. When the wearer is attacked by an entity with the specified tag, they will take additional damage.
* **Parameters:**
    * `tag` (string): The tag that triggers this weakness.
    * `bonus_damage` (number): The amount of extra damage to apply.

### `TakeDamage(damage_amount)`
* **Description:** Reduces the armor's condition by a given amount, factoring in any `conditionlossmultipliers`. This is typically called by the combat system when the armor absorbs a hit.
* **Parameters:**
    * `damage_amount` (number): The amount of durability to subtract from the armor's condition.

### `Repair(amount)`
* **Description:** Increases the armor's condition by a given amount, up to its maximum condition.
* **Parameters:**
    * `amount` (number): The amount of durability to restore.

### `GetAbsorption(attacker, weapon)`
* **Description:** Returns the armor's absorption percentage if it can resist the incoming attack, based on attacker and weapon tags.
* **Parameters:**
    * `attacker` (Entity): The entity performing the attack.
    * `weapon` (Entity): The weapon being used for the attack (can be `nil`).

### `GetBonusDamage(attacker, weapon)`
* **Description:** Calculates any extra damage the wearer should take based on the armor's weaknesses and the attacker/weapon tags.
* **Parameters:**
    * `attacker` (Entity): The entity performing the attack.
    * `weapon` (Entity): The weapon being used for the attack (can be `nil`).

### `SetCondition(amount)`
* **Description:** Sets the armor's condition to a specific value. This function handles the logic for the armor breaking if the condition is set to 0 or less, including calling the `onfinished` callback and removing the item if `keeponfinished` is false.
* **Parameters:**
    * `amount` (number): The new condition value for the armor.

## Events & Listeners
**Listens For:**
- `percentusedchange` on **self**: When the armor's durability percentage changes, it updates its `forgerepairable` component and, if durability hits zero, pushes the `armorbroke` event on its owner.

**Pushes:**
- `percentusedchange` on **self**: Pushed when the armor's condition is changed via `SetCondition`. Passes `{ percent = new_percent }`.
- `armordamaged` on **self**: Pushed when the armor takes damage via `TakeDamage`. Passes the damage amount.
- `armorbroke` on **owner**: Pushed when the armor's condition reaches zero. The owner is determined via the `inventoryitem` component. Passes `{ armor = self.inst }`.