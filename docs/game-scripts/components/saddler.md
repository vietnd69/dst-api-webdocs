---
id: saddler
title: Saddler
description: A combat utility component that modifies incoming damage through absorption, applies bonus damage, and manages movement speed adjustments via inventory item synchronization.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: 4e1db4ff
---

# Saddler

## Overview
The `Saddler` component provides damage absorption and modification logic for an entity's incoming physical and special damage. It also supports optional bonus damage and speed multiplier adjustments, and integrates with the `inventoryitem_replica` to propagate walk speed changes over the network. It does not manage health directly but works in conjunction with damage-related components like `damagetyperesist`.

## Dependencies & Tags
- Relies on: `spdamageutil` module for special damage defense calculations.
- Interacts with: `damagetyperesist` component (if present) for damage type resistance multipliers.
- Interacts with: `inventoryitem_replica` (if present) to sync walk speed adjustments.
- Does not add or remove entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *none* (assigned in `_ctor`) | The entity instance this component is attached to. |
| `swapsymbol` | `string?` | `nil` | Symbol to use when swapping items visually. |
| `swapbuild` | `string?` | `nil` | Build identifier used for item swapping. |
| `skin_guid` | `string?` | `nil` | GUID for the skin used during swaps. |
| `bonusdamage` | `number?` | `nil` | Additional flat damage added when this entity deals damage. |
| `speedmult` | `number?` | `nil` | Multiplier applied to the entity's walk speed. |
| `absorbpercent` | `number?` | `nil` | Percentage of damage absorbed (0.0 = 0%, 1.0 = 100%). |
| `discardedcb` | `function?` | `nil` | Callback invoked when the item is discarded (if applicable). |

## Main Functions

### `SetSwaps(build, symbol, skin_guid)`
* **Description:** Configures visual swap parameters for use during item swapping (e.g., skin or appearance changes).
* **Parameters:**
  - `build`: Build identifier string used for networking or prefabs.
  - `symbol`: Render symbol string used to swap visual appearance.
  - `skin_guid`: Unique identifier for the associated skin asset.

### `SetBonusDamage(damage)`
* **Description:** Sets a flat bonus damage value added to this entity’s outgoing damage.
* **Parameters:**
  - `damage`: Non-negative number representing additional damage.

### `SetBonusSpeedMult(mult)`
* **Description:** Sets the movement speed multiplier applied to the entity. Propagates via `onspeedmult` callback to the `inventoryitem_replica` if present.
* **Parameters:**
  - `mult`: Positive number; e.g., `1.0` = normal speed, `1.5` = 50% faster.

### `SetAbsorption(percent)`
* **Description:** Sets the percentage of damage absorbed (as a value between `0` and `1`).
* **Parameters:**
  - `percent`: Float in range `[0, 1]`; `0` = no absorption, `1` = full absorption.

### `GetBonusDamage(target)`
* **Description:** Returns the currently set bonus damage (defaulting to `0` if unset).
* **Parameters:**
  - `target`: Not used in current implementation; included for signature consistency.

### `GetBonusSpeedMult()`
* **Description:** Returns the currently set speed multiplier (defaulting to `1` if unset).
* **Parameters:** None.

### `GetAbsorption()`
* **Description:** Returns the currently set absorption percentage (defaulting to `0` if unset).
* **Parameters:** None.

### `SetDiscardedCallback(cb)`
* **Description:** Registers a callback function to be invoked when the associated item is discarded.
* **Parameters:**
  - `cb`: A function accepting no arguments.

### `ApplyDamage(damage, attacker, weapon, spdamage)`
* **Description:** Processes incoming damage using resistance multipliers, absorption, and special damage defense. Returns the final physical damage and updated special damage table.
* **Parameters:**
  - `damage`: Base physical damage value.
  - `attacker`: Entity dealing the damage (used by `damagetyperesist` and `SpDamageUtil`).
  - `weapon`: Item or entity used as the weapon (used by `damagetyperesist`).
  - `spdamage`: Optional table mapping special damage types to numeric values.
* **Returns:**
  - `leftover_damage`: Physical damage after absorption and resistance.
  - `spdamage`: Modified special damage table (entries ≤ 0 are removed or set to `nil`).

## Events & Listeners
- `self.inst:ListenForEvent("speedmult", onspeedmult)` — Internal listener (via the `Class` constructor’s third argument); invokes `onspeedmult` when the `"speedmult"` event is pushed on the entity, updating `inventoryitem_replica` walk speed.