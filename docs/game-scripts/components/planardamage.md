---
id: planardamage
title: Planardamage
description: Calculates and manages planar damage by combining a base value with additive bonuses and multiplicative multipliers.
tags: [combat, damage, modifier]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 48c68e02
system_scope: entity
---

# Planardamage

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlanarDamage` is a utility component that computes total damage using a formula:  
`(BaseDamage × Multiplier) + Bonus`.  
It uses two `SourceModifierList` instances—one for multiplicative modifiers and one for additive bonuses—to support multiple modifier sources (e.g., from equipment, abilities, or status effects). This component is typically added to entities that deal planar damage (e.g., boss attacks or special abilities in specific game zones), and provides methods to dynamically adjust and query damage contributions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("planardamage")
inst.components.planardamage:SetBaseDamage(50)
inst.components.planardamage:AddMultiplier("player_equipment", 1.2, "combat_boots")
inst.components.planardamage:AddBonus("perk_active", 10, "warrior_passive")
print(inst.components.planardamage:GetDebugString())
-- Output: "Damage=75.00 [50.00x1.20+10.00]"
```

## Dependencies & tags
**Components used:** `SourceModifierList` (via `require("util/sourcemodifierlist")`)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `basedamage` | number | `0` | Base damage value, set via `SetBaseDamage()`. |
| `externalmultipliers` | `SourceModifierList` | New instance | Handles multiplicative modifiers (default operation: multiplication). |
| `externalbonuses` | `SourceModifierList` | New instance | Handles additive bonuses (explicitly configured as additive). |

## Main functions
### `SetBaseDamage(damage)`
* **Description:** Sets the base damage value used in the damage calculation.
* **Parameters:** `damage` (number) – the new base damage.
* **Returns:** Nothing.

### `GetBaseDamage()`
* **Description:** Returns the currently set base damage value.
* **Parameters:** None.
* **Returns:** number – the base damage.

### `GetDamage()`
* **Description:** Computes the total planar damage using the formula `(basedamage × multiplier) + bonus`.
* **Parameters:** None.
* **Returns:** number – the computed total damage.

### `AddMultiplier(src, mult, key)`
* **Description:** Adds a multiplicative modifier to the external multiplier list.
* **Parameters:**  
  - `src` (string) – source identifier (e.g., `"perk"` or `"item_name"`).  
  - `mult` (number) – the multiplicative factor (e.g., `1.5` for +50%).  
  - `key` (string) – unique key within the source to allow replacing or removing this modifier.
* **Returns:** Nothing.

### `RemoveMultiplier(src, key)`
* **Description:** Removes a previously added multiplicative modifier.
* **Parameters:**  
  - `src` (string) – source of the modifier.  
  - `key` (string) – key used when adding the modifier.
* **Returns:** Nothing.

### `GetMultiplier()`
* **Description:** Returns the cumulative multiplicative factor from all registered modifiers.
* **Parameters:** None.
* **Returns:** number – the combined multiplier.

### `AddBonus(src, bonus, key)`
* **Description:** Adds an additive bonus to the external bonus list.
* **Parameters:**  
  - `src` (string) – source identifier.  
  - `bonus` (number) – the additive amount (e.g., `10`).  
  - `key` (string) – unique key for the bonus.
* **Returns:** Nothing.

### `RemoveBonus(src, key)`
* **Description:** Removes a previously added additive bonus.
* **Parameters:**  
  - `src` (string) – source of the bonus.  
  - `key` (string) – key used when adding the bonus.
* **Returns:** Nothing.

### `GetBonus()`
* **Description:** Returns the cumulative additive bonus from all registered bonuses.
* **Parameters:** None.
* **Returns:** number – the combined bonus.

### `GetDebugString()`
* **Description:** Returns a human-readable string summarizing the damage breakdown for debugging or UI display.
* **Parameters:** None.
* **Returns:** string – formatted as `"Damage=X.XX [Y.YYxZ.ZZ+A.AA]"` where `X` is total damage, `Y` is base damage, `Z` is multiplier, and `A` is bonus.

## Events & listeners
None identified.
