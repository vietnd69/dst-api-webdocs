---
id: damagereflect
title: Damagereflect
description: This component allows an entity to reflect damage back to an attacker, optionally using a custom damage calculation function.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
source_hash: 79afb2ef
---

# Damagereflect

## Overview
This component provides the functionality for an entity to reflect damage back to its attacker. It can be configured with a default amount of damage to reflect, or with a custom function that calculates the reflected damage based on the specifics of the incoming attack (attacker, damage amount, weapon, etc.).

## Dependencies & Tags
None identified.

## Properties
| Property         | Type       | Default Value | Description                                                                                                                                                                                                                                                                                                                                 |
| :--------------- | :--------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `reflectdamagefn`| `function` | `nil`         | A custom function used to calculate reflected damage. If set, this function will be called by `GetReflectedDamage`. It should accept `(inst, attacker, damage, weapon, stimuli, spdamage)` as arguments and return `(reflected_damage, sp_damage)`. If the function returns `nil` for `reflected_damage`, `defaultdamage` will be used instead. |
| `defaultdamage`  | `number`   | `10`          | The default damage value to reflect if `reflectdamagefn` is not set, or if `reflectdamagefn` returns `nil` for the reflected damage value.                                                                                                                                                                                                       |

## Main Functions
### `SetReflectDamageFn(fn)`
*   **Description:** Sets a custom function to be used for calculating reflected damage.
*   **Parameters:**
    *   `fn` (`function`): The function to set. It should accept `(self.inst, attacker, damage, weapon, stimuli, spdamage)` and return `(reflected_damage, sp_damage)`.

### `SetDefaultDamage(value)`
*   **Description:** Sets the default damage value that will be reflected if no custom damage function is specified or if the custom function returns `nil` for the damage value.
*   **Parameters:**
    *   `value` (`number`): The new default damage value.

### `GetReflectedDamage(attacker, damage, weapon, stimuli, spdamage)`
*   **Description:** Calculates and returns the damage to be reflected to an attacker. If a custom `reflectdamagefn` is set, it uses that function to determine the reflected damage. Otherwise, it returns the `defaultdamage`.
*   **Parameters:**
    *   `attacker` (`entity`): The entity that attacked the owner of this component.
    *   `damage` (`number`): The incoming damage value before any reflection calculation.
    *   `weapon` (`entity`): The weapon entity used by the attacker, if any.
    *   `stimuli` (`string`): A string describing the type of attack stimuli (e.g., "melee", "projectile").
    *   `spdamage` (`number`): Special damage value (e.g., sanity damage) that might also be reflected.
*   **Returns:** `(number, number)`: The calculated reflected damage and the special reflected damage, respectively.