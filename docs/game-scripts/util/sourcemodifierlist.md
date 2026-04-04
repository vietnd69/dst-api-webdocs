---
id: sourcemodifierlist
title: SourceModifierList
description: A utility class that manages and calculates modifiers applied by multiple external sources with optional key-based tracking.
tags: [utility, modifiers, calculation]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: util
source_hash: 3be43aba
system_scope: entity
---

# SourceModifierList

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`SourceModifierList` is a utility class that manages modifiers applied by external sources to a base value. It supports tracking multiple modifiers from the same source using optional keys, automatically cleans up when source entities are removed from the game, and recalculates the final modifier value when changes occur. This class is commonly used for stats that need dynamic modification from multiple sources, such as damage multipliers, speed bonuses, or resource yield adjustments.

## Usage example
```lua
local SourceModifierList = require "util/sourcemodifierlist"

-- Create a modifier list with base value 1.0 using multiplication
local modList = SourceModifierList(inst, 1.0, SourceModifierList.multiply)

-- Add a 50% damage bonus from a specific source
modList:SetModifier(damageBuffItem, 1.5, "damage_bonus")

-- Add another modifier from a different source
modList:SetModifier(playerSkill, 1.2, "skill_multiplier")

-- Get the final calculated modifier
local finalModifier = modList:Get() -- Returns 1.8 (1.0 * 1.5 * 1.2)

-- Remove a specific modifier
modList:RemoveModifier(damageBuffItem, "damage_bonus")
```

## Dependencies & tags
**Components used:** None identified
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | — | The entity instance that owns this modifier list; used for event listening. |
| `_modifiers` | table | `{}` | Internal table storing all active modifiers organized by source. |
| `_modifier` | number | `1` | The current calculated modifier value after all sources are applied. |
| `_base` | number | `1` | The base value before any modifiers are applied. |
| `_fn` | function | `multiply` | The function used to combine modifiers (multiply, additive, or boolean). |
| `_dirtycb` | function | `nil` | Optional callback fired when the modifier value changes; receives `(inst, newValue)`. |

## Main functions
### `SourceModifierList(inst, base_value, fn, dirtycb)`
*   **Description:** Constructor that creates a new SourceModifierList instance.
*   **Parameters:**
    *   `inst` (entity) — The entity instance that owns this modifier list.
    *   `base_value` (number, optional) — The base value before modifiers; defaults to `1` if nil.
    *   `fn` (function, optional) — The function used to combine modifiers; defaults to `SourceModifierList.multiply`.
    *   `dirtycb` (function, optional) — Callback fired when the modifier value changes.
*   **Returns:** A new `SourceModifierList` instance.
*   **Error states:** None.

### `Get()`
*   **Description:** Returns the current calculated modifier value after all sources are applied.
*   **Parameters:** None.
*   **Returns:** (number) The final modifier value.
*   **Error states:** None.

### `IsEmpty()`
*   **Description:** Checks if the modifier list has any active modifiers.
*   **Parameters:** None.
*   **Returns:** (boolean) `true` if no modifiers are present, `false` otherwise.
*   **Error states:** None.

### `RecalculateModifier()`
*   **Description:** Recalculates the final modifier value by applying all active modifiers to the base value using the combination function. Fires the dirty callback if one is registered.
*   **Parameters:** None.
*   **Returns:** None.
*   **Error states:** None.

### `SetModifier(source, m, key)`
*   **Description:** Sets or updates a modifier from a specific source. If the source is an entity, automatically registers cleanup when the entity is removed from the game.
*   **Parameters:**
    *   `source` (entity or string) — The source applying the modifier; can be an entity or identifier name.
    *   `m` (number or boolean) — The modifier value to apply.
    *   `key` (string, optional) — Optional key to distinguish multiple modifiers from the same source; defaults to `"key"`.
*   **Returns:** None.
*   **Error states:** If `source` is nil, the function returns early without making changes. If `m` is nil or equals the base value, the modifier is removed instead.

### `RemoveModifier(source, key)`
*   **Description:** Removes a modifier from a specific source. If key is provided, only removes that specific modifier; otherwise removes all modifiers from the source.
*   **Parameters:**
    *   `source` (entity or string) — The source to remove modifiers from.
    *   `key` (string, optional) — Specific modifier key to remove; if nil, removes all modifiers from the source.
*   **Returns:** None.
*   **Error states:** If the source has no modifiers, the function returns early without changes.

### `Reset()`
*   **Description:** Removes all modifiers from all sources and resets the modifier value to the base value. Cleans up all event listeners.
*   **Parameters:** None.
*   **Returns:** None.
*   **Error states:** None.

### `CalculateModifierFromSource(source, key)`
*   **Description:** Calculates the modifier value from a specific source without affecting the main modifier list state.
*   **Parameters:**
    *   `source` (entity or string) — The source to calculate modifiers from.
    *   `key` (string, optional) — Specific modifier key; if nil, calculates all modifiers from the source.
*   **Returns:** (number) The calculated modifier value from the source.
*   **Error states:** Returns the base value if the source has no modifiers.

### `CalculateModifierFromKey(key)`
*   **Description:** Calculates the combined modifier value from all sources that have a specific key.
*   **Parameters:**
    *   `key` (string) — The modifier key to search for across all sources.
*   **Returns:** (number) The combined modifier value from all sources with matching keys.
*   **Error states:** Returns the base value if no sources have the specified key.

### `HasModifier(source, key)`
*   **Description:** Checks if a specific source has a modifier with the given key.
*   **Parameters:**
    *   `source` (entity or string) — The source to check.
    *   `key` (string) — The modifier key to check for.
*   **Returns:** (boolean) `true` if the modifier exists, `false` otherwise.
*   **Error states:** None.

### `HasAnyModifiers()`
*   **Description:** Checks if the modifier list has any active modifiers from any source.
*   **Parameters:** None.
*   **Returns:** (boolean) `true` if any modifiers exist, `false` otherwise.
*   **Error states:** None.

### `SourceModifierList.multiply(a, b)`
*   **Description:** Static function that multiplies two values; used as the default combination function.
*   **Parameters:**
    *   `a` (number) — First value.
    *   `b` (number) — Second value.
*   **Returns:** (number) The product of `a` and `b`.
*   **Error states:** None.

### `SourceModifierList.additive(a, b)`
*   **Description:** Static function that adds two values; useful for additive modifier systems.
*   **Parameters:**
    *   `a` (number) — First value.
    *   `b` (number) — Second value.
*   **Returns:** (number) The sum of `a` and `b`.
*   **Error states:** None.

### `SourceModifierList.boolean(a, b)`
*   **Description:** Static function that performs logical OR on two boolean values; useful for flag-style modifiers.
*   **Parameters:**
    *   `a` (boolean) — First value.
    *   `b` (boolean) — Second value.
*   **Returns:** (boolean) `true` if either value is `true`.
*   **Error states:** None.

## Events & listeners
- **Listens to:** `onremove` — When a source entity is removed from the game, the modifier list automatically cleans up that source's modifiers and recalculates.
- **Pushes:** None identified (the `_dirtycb` callback is invoked directly, not via the event system).