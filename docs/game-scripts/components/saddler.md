---
id: saddler
title: Saddler
description: Manages item-saddle modifiers such as bonus damage, speed multiplier, and damage absorption, and applies modified damage calculations during combat.
tags: [combat, inventory, modifier, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4e1db4ff
system_scope: combat
---

# Saddler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Saddler` is a component that encapsulates configurable modifiers for an item (typically a saddle) used on mounts like Beefalo or Bears. It stores and provides access to bonus damage, walk speed multiplier, and damage absorption values. The component also implements a damage calculation pipeline that applies resistance multipliers (via `damagetyperesist`) and damage absorption, and handles special damage adjustments using `spdamageutil`. It integrates with `inventoryitem` replication to sync walk speed changes across the network.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("saddler")
inst.components.saddler:SetBonusDamage(5)
inst.components.saddler:SetBonusSpeedMult(1.2)
inst.components.saddler:SetAbsorption(0.25) -- 25% damage reduction
local leftover, spdamage = inst.components.saddler:ApplyDamage(10, attacker, weapon, spdamage_map)
```

## Dependencies & tags
**Components used:** `damagetyperesist`, `inventoryitem` (accessed via `replica`), `spdamageutil` (imported)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `swapsymbol` | string \| nil | `nil` | Symbol used for item swaps/skins. |
| `swapbuild` | string \| nil | `nil` | Build identifier for item swaps/skins. |
| `skin_guid` | string \| nil | `nil` | GUID for the skin asset. |
| `bonusdamage` | number \| nil | `nil` | Flat damage bonus applied during combat. |
| `speedmult` | number \| nil | `nil` | Walk speed multiplier (also synced to `inventoryitem` replica). |
| `absorbpercent` | number \| nil | `nil` | Fraction of damage absorbed (e.g., `0.25` = 25% reduction). |
| `discardedcb` | function \| nil | `nil` | Optional callback invoked when the item is discarded. |

## Main functions
### `SetSwaps(build, symbol, skin_guid)`
* **Description:** Sets metadata for item swap/skin support (e.g., skin overrides or build variants).
* **Parameters:**  
  - `build` (string) — Build identifier.  
  - `symbol` (string) — Symbol used in visual representation.  
  - `skin_guid` (string) — Unique identifier for the skin asset.
* **Returns:** Nothing.

### `SetBonusDamage(damage)`
* **Description:** Sets the flat bonus damage to be applied in combat calculations.
* **Parameters:** `damage` (number) — Additional damage value to add.
* **Returns:** Nothing.

### `SetBonusSpeedMult(mult)`
* **Description:** Sets the speed multiplier and pushes the updated value to the `inventoryitem` replica for network sync.
* **Parameters:** `mult` (number) — Multiplicative walk speed factor (e.g., `1.1` for +10% speed).
* **Returns:** Nothing.

### `SetAbsorption(percent)`
* **Description:** Sets the damage absorption fraction.
* **Parameters:** `percent` (number) — Fraction of damage absorbed (e.g., `0.3` means 30% reduction).
* **Returns:** Nothing.

### `GetBonusDamage(target)`
* **Description:** Returns the stored bonus damage value (defaults to `0` if unset).
* **Parameters:**  
  - `target` (Entity, ignored) — Retained for interface compatibility but unused.
* **Returns:** `number` — Bonus damage, or `0` if `nil`.
* **Error states:** Always returns a numeric value.

### `GetBonusSpeedMult()`
* **Description:** Returns the stored speed multiplier (defaults to `1` if unset).
* **Parameters:** None.
* **Returns:** `number` — Speed multiplier, or `1` if `nil`.

### `GetAbsorption()`
* **Description:** Returns the stored absorption fraction (defaults to `0` if unset).
* **Parameters:** None.
* **Returns:** `number` — Absorption fraction, or `0` if `nil`.

### `SetDiscardedCallback(cb)`
* **Description:** Registers a callback to be invoked when the item is discarded (e.g., removed from inventory or destroyed).
* **Parameters:** `cb` (function) — Function to call on discard; signature is implementation-dependent.
* **Returns:** Nothing.

### `ApplyDamage(damage, attacker, weapon, spdamage)`
* **Description:** Applies damage modifiers including resistances, absorption, and special damage reduction. Used to compute final outgoing damage after accounting for the entity’s defenses.
* **Parameters:**  
  - `damage` (number) — Base incoming damage amount.  
  - `attacker` (Entity \| nil) — Attacking entity (used for tag-based resistance checks).  
  - `weapon` (Entity \| nil) — Weapon entity (used for tag-based resistance checks).  
  - `spdamage` (table \| nil) — Map of special damage types (`sptype` → damage) to be reduced individually.  
* **Returns:**  
  - `leftover_damage` (number) — Physical damage after absorption and resistances.  
  - `spdamage` (table \| nil) — Modified special damage table, with entries removed (`nil`) if reduced to `<= 0`.  
* **Error states:**  
  - If `damagetyperesist` is absent, resistance multiplier defaults to `1`.  
  - If `spdamage` becomes empty after processing, it is set to `nil`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
