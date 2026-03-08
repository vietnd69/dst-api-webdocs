---
id: sourcemodifierlist
title: Sourcemodifierlist
description: Manages and recalculates numerical or boolean modifiers from multiple external sources, supporting multiple modifiers per source via optional keys.
tags: [util, modifier, calculation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: util
source_hash: e6c208e8
system_scope: entity
---

# Sourcemodifierlist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SourceModifierList` is a utility component that stores and computes cumulative modifiers applied by external entities or logic. It maintains a base value (e.g., `1` for multiplicative or `0` for additive cases) and combines incoming modifier values using a configurable binary function (`fn`). It supports both single-modifier-per-source and multi-modifier-per-source (via optional `key`) use cases. It also automatically cleans up listeners when an external modifier source is removed from the game.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sourcemodifierlist")

-- Set up multiplicative modifiers (e.g., damage multiplier)
inst.components.sourcemodifierlist:SetModifier("buff1", 1.5)
inst.components.sourcemodifierlist:SetModifier("buff2", 2, "stack1")
inst.components.sourcemodifierlist:SetModifier("buff2", 2, "stack2")

-- Get the final computed value
local final_multiplier = inst.components.sourcemodifierlist:Get()  -- 1 * 1.5 * 2 * 2 = 6

-- Remove a specific key's modifier
inst.components.sourcemodifierlist:RemoveModifier("buff2", "stack1")

-- Check if a modifier exists
local has_buff1 = inst.components.sourcemodifierlist:HasModifier("buff1")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_modifiers` | table | `{}` | Internal map: `{ source => { modifiers = { [key] = value }, onremove = callback? } }` |
| `_base` | number | `1` (if no `base_value` passed) | Starting value before applying modifiers. |
| `_modifier` | number | `_base` | Cached result of combining all modifiers with `_base`. |
| `_fn` | function | `SourceModifierList.multiply` | Binary function used to combine modifiers (e.g., `multiply`, `additive`). |
| `_dirtycb` | function? | `nil` | Optional callback invoked as `dirtycb(inst, final_value)` on recalculation. |

## Main functions
### `Get()`
* **Description:** Returns the current computed modifier value (`_modifier`).
* **Parameters:** None.
* **Returns:** `number` — the accumulated modifier.

### `IsEmpty()`
* **Description:** Checks whether any modifiers have been applied.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if no modifiers exist.

### `RecalculateModifier()`
* **Description:** Recomputes the final modifier by applying `_fn` cumulatively to `_base` and all stored modifiers. Triggers `_dirtycb` if present.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetModifier(source, m, key)`
* **Description:** Adds or updates a modifier. If `m` is `nil` or equals `_base`, it removes the modifier instead.
* **Parameters:**  
  - `source` (object or string) — Identifier for the modifier origin. Objects receive an automatic `"onremove"` listener for cleanup.  
  - `m` (number or boolean) — Modifier value.  
  - `key` (string, optional) — Used to disambiguate multiple modifiers from the same source (default: `"key"`).  
* **Returns:** Nothing.

### `RemoveModifier(source, key)`
* **Description:** Removes a specific modifier (by `key`) or the entire source if `key` is omitted.
* **Parameters:**  
  - `source` (object or string) — The modifier source to remove.  
  - `key` (string, optional) — Specific key to remove. Omit to remove all modifiers from `source`.  
* **Returns:** Nothing.

### `Reset()`
* **Description:** Clears all modifiers and restores `_modifier` to `_base`. Removes all `"onremove"` listeners.
* **Parameters:** None.
* **Returns:** Nothing.

### `CalculateModifierFromSource(source, key)`
* **Description:** Computes the contribution of a specific source to the final modifier *without* updating the cached `_modifier`.
* **Parameters:**  
  - `source` (object or string) — Modifier source.  
  - `key` (string, optional) — Specific key. If omitted, combines all modifiers from `source`.  
* **Returns:** `number` — computed contribution of `source` (or `nil` → falls back to `_base`).

### `CalculateModifierFromKey(key)`
* **Description:** Computes the total contribution of all modifiers matching a specific `key` (across all sources).
* **Parameters:**  
  - `key` (string) — Key to match.  
* **Returns:** `number` — aggregated modifier value for that key (starting from `_base` and applying `_fn` for each match).

### `HasModifier(source, key)`
* **Description:** Checks if a specific modifier exists for a source/key pair.
* **Parameters:**  
  - `source` (object or string) — Modifier source.  
  - `key` (string) — Modifier key.  
* **Returns:** `boolean` — `true` if the modifier exists.

### `HasAnyModifiers()`
* **Description:** Checks if any modifiers are currently stored.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if at least one modifier exists.

## Events & listeners
- **Listens to:** `"onremove"` (on modifier `source` entities) — automatically removes the source from `_modifiers` and triggers recalculation.  
- **Pushes:** None.
