---
id: planardefense
title: PlanarDefense
description: Manages planar defense values for an entity, combining base defense with external multiplicative and additive modifiers.
tags: [combat, defense, modifiers]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 37f39ae4
system_scope: combat
---

# PlanarDefense

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlanarDefense` calculates and maintains an entity’s planar defense value, which represents a derived defense stat used in gameplay calculations. It combines a base defense value with external multiplicative modifiers (e.g., from gear or abilities) and additive bonuses (e.g., from temporary effects), using the formula:  
`Defense = Base × Multiplicative + Additive`.  
This component is typically added to entities capable of taking damage and needing scalable defense tuning.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("planardefense")
inst.components.planardefense:SetBaseDefense(10)
inst.components.planardefense:AddMultiplier("gear_helmet", 1.2, "helmet_mod")
inst.components.planardefense:AddBonus("aoe_buff", 5, "aoe_key")
print(inst.components.planardefense:GetDefense()) -- Returns: 10 * 1.2 + 5 = 17
```

## Dependencies & tags
**Components used:** `SourceModifierList` (via `util/sourcemodifierlist.lua`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GoO` (entity instance) | `nil` | The entity that owns this component. |
| `basedefense` | number | `0` | The base defense value before modifiers. |
| `externalmultipliers` | `SourceModifierList` | Instance | Holds multiplicative modifiers applied to `basedefense`. |
| `externalbonuses` | `SourceModifierList` | Instance | Holds additive modifiers added after multiplication. |

## Main functions
### `SetBaseDefense(defense)`
* **Description:** Sets the base defense value. This is the foundational defense before applying modifiers.
* **Parameters:** `defense` (number) - The new base defense value.
* **Returns:** Nothing.

### `GetBaseDefense()`
* **Description:** Returns the current base defense value.
* **Parameters:** None.
* **Returns:** number — the base defense.

### `GetDefense()`
* **Description:** Computes and returns the total defense value using the formula: `basedefense * multiplicative + additive`.
* **Parameters:** None.
* **Returns:** number — the computed defense value.

### `AddMultiplier(src, mult, key)`
* **Description:** Adds a multiplicative modifier to `externalmultipliers`. Used for stacking effects that scale the base defense.
* **Parameters:**  
  - `src` (string) — identifier for the source of the modifier (e.g., `"gear_helmet"`).  
  - `mult` (number) — multiplicative factor (e.g., `1.2` for +20%).  
  - `key` (string) — unique key for this modifier instance to support override/overwrite.
* **Returns:** Nothing.

### `RemoveMultiplier(src, key)`
* **Description:** Removes a previously added multiplicative modifier.
* **Parameters:**  
  - `src` (string) — the source identifier passed to `AddMultiplier`.  
  - `key` (string) — the key used when adding the modifier.
* **Returns:** Nothing.

### `GetMultiplier()`
* **Description:** Returns the current aggregated multiplicative factor (product of all active multipliers).
* **Parameters:** None.
* **Returns:** number — the cumulative multiplier value.

### `AddBonus(src, bonus, key)`
* **Description:** Adds an additive bonus to `externalbonuses`. These are flat additions to the defense after scaling.
* **Parameters:**  
  - `src` (string) — identifier for the source.  
  - `bonus` (number) — flat bonus amount (e.g., `5`).  
  - `key` (string) — unique key for this bonus.
* **Returns:** Nothing.

### `RemoveBonus(src, key)`
* **Description:** Removes a previously added additive bonus.
* **Parameters:**  
  - `src` (string) — the source identifier.  
  - `key` (string) — the key used when adding the bonus.
* **Returns:** Nothing.

### `GetBonus()`
* **Description:** Returns the current aggregated additive bonus (sum of all active bonuses).
* **Parameters:** None.
* **Returns:** number — the cumulative additive bonus.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging or UI display, showing the full defense breakdown.
* **Parameters:** None.
* **Returns:** string — e.g., `"Defense=17.00 [10.00x1.20+5.00]"`.

## Events & listeners
None identified.
