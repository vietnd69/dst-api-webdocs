---
id: planardefense
title: PlanarDefense
description: Calculates a composite defense value for an entity by combining a base defense with multiplicative and additive modifiers from external sources.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 37f39ae4
---

# PlanarDefense

## Overview
This component computes an entity's defense value by combining a base defense with external multiplicative modifiers and additive bonuses. It provides methods to set, retrieve, and modify the base defense and its various modifiers, supporting modular contribution from multiple gameplay systems (e.g., armor, abilities, perks).

## Dependencies & Tags
- Uses the `SourceModifierList` utility from `util/sourcemodifierlist`.
- Does not add or remove any entity tags.
- Does not declare or require any other components.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `basedefense` | `number` | `0` | Base defense value applied before modifiers. |
| `externalmultipliers` | `SourceModifierList` | Instance created with additive=false (multiplicative) | Handles multiplicative modifiers (e.g., percentage increases). |
| `externalbonuses` | `SourceModifierList` | Instance created with additive=true | Handles additive bonuses (e.g., flat defense additions). |

## Main Functions
### `SetBaseDefense(defense)`
* **Description:** Sets the base defense value, overriding any previous value.  
* **Parameters:**  
  - `defense` (`number`): The new base defense value.

### `GetBaseDefense()`
* **Description:** Returns the current base defense value.  
* **Parameters:** None.

### `GetDefense()`
* **Description:** Computes and returns the final defense value using the formula: `base × multipliers + bonuses`.  
* **Parameters:** None.

### `AddMultiplier(src, mult, key)`
* **Description:** Adds a multiplicative modifier from a given source. If a modifier with the same `src` and `key` already exists, it is overwritten.  
* **Parameters:**  
  - `src` (`string` or `any`): Source identifier (e.g., "armor_hide", "warrior_stance").  
  - `mult` (`number`): Multiplicative factor (e.g., `1.25` for +25%).  
  - `key` (`string`): Unique identifier for the modifier within the source.

### `RemoveMultiplier(src, key)`
* **Description:** Removes a specific multiplicative modifier by its `src` and `key`.  
* **Parameters:**  
  - `src` (`string` or `any`): Source identifier of the modifier.  
  - `key` (`string`): Key of the modifier.

### `GetMultiplier()`
* **Description:** Returns the cumulative multiplicative factor (product of all active multipliers).  
* **Parameters:** None.

### `AddBonus(src, bonus, key)`
* **Description:** Adds an additive bonus from a given source. Overwrites existing bonuses with matching `src` and `key`.  
* **Parameters:**  
  - `src` (`string` or `any`): Source identifier.  
  - `bonus` (`number`): Additive value (e.g., `5` for +5 defense).  
  - `key` (`string`): Unique identifier within the source.

### `RemoveBonus(src, key)`
* **Description:** Removes a specific additive bonus by its `src` and `key`.  
* **Parameters:**  
  - `src` (`string` or `any`): Source identifier.  
  - `key` (`string`): Key of the bonus.

### `GetBonus()`
* **Description:** Returns the sum of all active additive bonuses.  
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string containing the final defense value and its breakdown (base, multiplier, bonus).  
* **Parameters:** None.

## Events & Listeners
None. This component does not listen to or push any events.