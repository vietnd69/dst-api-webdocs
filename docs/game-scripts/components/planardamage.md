---
id: planardamage
title: Planardamage
description: Calculates the final damage value for an entity by combining base damage with source-based multipliers and additive bonuses.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: 48c68e02
---

# Planardamage

## Overview
The `Planardamage` component calculates the final damage value for an entity using the formula:  
`Final Damage = BaseDamage × Multiplier + Bonus`.  
It manages modular, source-specific modifiers—both multiplicative (multipliers) and additive (bonuses)—via helper utilities (`SourceModifierList`), enabling flexible and reusable damage computation across game systems (e.g., environmental hazards, abilities, or planar effects).

## Dependencies & Tags
- **Dependencies**:  
  - Uses `SourceModifierList` from `util/sourcemodifierlist`.  
  - Relies on the entity (`inst`) supporting the `SourceModifierList` pattern (e.g.,具备 `:AddComponent("health")` may be required to receive damage, but `PlanarDamage` itself does not *add* components or tags).  
- **Tags**: None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owning entity instance. |
| `basedamage` | `number` | `0` | Base damage value before modifiers are applied. |
| `externalmultipliers` | `SourceModifierList` | Instance with default settings (multiplicative aggregation) | Stores multiplicative modifiers applied to base damage. |
| `externalbonuses` | `SourceModifierList` | Instance with default settings (additive aggregation) | Stores additive modifiers applied after multiplication. |

## Main Functions
### `SetBaseDamage(damage)`
* **Description:** Sets the base damage value used in final damage calculations.  
* **Parameters:**  
  - `damage` (`number`): The new base damage value.

### `GetBaseDamage()`
* **Description:** Returns the current base damage value.  
* **Parameters:** None.

### `GetDamage()`
* **Description:** Computes and returns the final damage value using the formula: `BaseDamage × Multiplier + Bonus`.  
* **Parameters:** None.

### `AddMultiplier(src, mult, key)`
* **Description:** Adds or updates a multiplicative modifier (multiplier) from a specific source. Multipliers are applied multiplicatively to the base damage.  
* **Parameters:**  
  - `src` (`any`): Source identifier (e.g., `"lava"`, `"spell_fire"`).  
  - `mult` (`number`): The multiplicative factor (e.g., `1.5`).  
  - `key` (`any`): Optional key for distinguishing multiple modifiers from the same source.

### `RemoveMultiplier(src, key)`
* **Description:** Removes a specific multiplicative modifier by source and key.  
* **Parameters:**  
  - `src` (`any`): Source identifier.  
  - `key` (`any`): Optional key matching the added modifier.

### `GetMultiplier()`
* **Description:** Returns the aggregate multiplicative modifier (product of all active multipliers).  
* **Parameters:** None.

### `AddBonus(src, bonus, key)`
* **Description:** Adds or updates an additive bonus from a specific source. Bonuses are added directly to the multiplied base damage.  
* **Parameters:**  
  - `src` (`any`): Source identifier.  
  - `bonus` (`number`): The additive amount (e.g., `5`).  
  - `key` (`any`): Optional key for distinguishing modifiers.

### `RemoveBonus(src, key)`
* **Description:** Removes a specific additive bonus by source and key.  
* **Parameters:**  
  - `src` (`any`): Source identifier.  
  - `key` (`any`): Optional key matching the added bonus.

### `GetBonus()`
* **Description:** Returns the aggregate additive bonus (sum of all active bonuses).  
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string summarizing the full damage calculation (final damage, base, multiplier, bonus).  
* **Parameters:** None.

## Events & Listeners
None.