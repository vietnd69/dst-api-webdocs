---
id: tuning
title: Tuning
description: Defines and initializes the global TUNING table containing all gameplay constants and configuration values for Don't Starve Together.
tags: [tuning, configuration, world, player, entity]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 8aa25b56
system_scope: world
---

# Tuning

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `tuning.lua` file is responsible for initializing and managing the global `TUNING` table, which stores all runtime-configurable gameplay constants such as time durations, character stats, item durability, creature attributes, and world generation parameters. It supports dynamic modifier registration via `AddTuningModifier`, allowing modded or context-sensitive overrides to be applied at runtime. A global `Tune` function is used to populate `TUNING`, and the table includes a metatable to support modifier-based dynamic resolution.

## Usage example
```lua
-- Register a modifier to adjust winter length based on world settings
AddTuningModifier("WINTER_LENGTH", function(base_value)
    return base_value * (GetModWorldGenSetting("winter_length_multiplier") or 1)
end)

-- Ensure tuning is initialized (typically done during game startup)
Tune()
```

## Dependencies & tags
**Components used:**
- `techtree.lua` — imported as `TechTree`; used to initialize `PROTOTYPER_TREES` with `TechTree.Create()`

**Tags:**
- None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TUNING` | table | `{}` | Global table of gameplay constants, populated by `Tune()`. Includes nested tables for time, characters, items, combat, seasons, and more. Has a metatable for modifier resolution via `TUNING_MODIFIERS`. |
| `TUNING_MODIFIERS` | table | `{}` | Stores registered modifier functions keyed by `tuning_var`. Used to lazily compute final tuning values based on context (e.g., world settings). |

## Main functions
### `AddTuningModifier(tuning_var, fn, tuning_value)`
* **Description:** Registers a modifier function for a specific tuning variable. If no modifier is registered for `tuning_var` and `fn` is a valid function, the function and base value (from `TUNING[tuning_var]` or `tuning_value`) are stored in `TUNING_MODIFIERS`. The original `TUNING[tuning_var]` entry is cleared (`nil`) to defer resolution to the modifier chain.  
* **Parameters:**  
  - `tuning_var` (string): Key identifying the tuning variable (e.g., `"WINTER_LENGTH"`).  
  - `fn` (function): Modifier function applied to compute the final value.  
  - `tuning_value` (number|string|nil): Fallback base value if `TUNING[tuning_var]` is not set.  
* **Returns:** `nil`  
* **Error states:** If `fn` is `nil` or falsy, no entry is added to `TUNING_MODIFIERS`.  

### `Tune(overrides)`
* **Description:** Initializes and populates the global `TUNING` table with all gameplay constants. Supports day/night segmentation, character stats, item properties, creature attributes, seasoning values, skill trees, rift mechanics, and more. Attaches a metatable to `TUNING` to support dynamic modifier resolution via `TUNING_MODIFIERS`.  
* **Parameters:**  
  - `overrides` (table|nil): Optional table of key-value pairs to override defaults. Currently unused in the implementation.  
* **Returns:** `nil`  
* **Error states:** None — safely handles `nil` input by treating it as an empty table.  

## Events & listeners
None