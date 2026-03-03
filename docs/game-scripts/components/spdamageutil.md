---
id: spdamageutil
title: Spdamageutil
description: A singleton utility for managing and calculating special damage types and their interaction with special defenses across entities.
tags: [combat, damage, utility]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 80bdcfdb
system_scope: combat
---

# Spdamageutil

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SpDamageUtil` is a singleton utility component that provides centralized support for defining and working with special damage types (e.g., planar damage). It allows registration of custom damage/defense calculation functions via `DefineSpType`, and offers helpers to collect, merge, and apply multipliers and defenses to special damage tables.

It interfaces directly with the `planardamage` and `planardefense` components to provide default behavior for the built-in `"planar"` damage type.

## Usage example
```lua
-- Define a new special damage type (e.g., "venom")
SpDamageUtil.DefineSpType("venom", {
    GetDamage = function(ent)
        return ent.components.poison and ent.components.poison:GetDamage() or 0
    end,
    GetDefense = function(ent)
        return ent.components.resistance and ent.components.resistance:GetDefenseForType("venom") or 0
    end,
})

-- Calculate total special damage for a target
local damageTable = SpDamageUtil.CollectSpDamage(target)
local total = SpDamageUtil.CalcTotalDamage(damageTable)

-- Apply multiplier and then defense
SpDamageUtil.ApplyMult(damageTable, 1.5)
damageTable = SpDamageUtil.ApplySpDefense(target, damageTable)
```

## Dependencies & tags
**Components used:** `planardamage`, `planardefense`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_SpTypeMap` | table | `{}` | Internal registry mapping special damage type names (`string`) to their definition tables (must contain `GetDamage` and/or `GetDefense` functions). Mods should not modify directly without caution. |
| `_Fallbacks` | table | `{ GetDamage = fn, GetDefense = fn }` | Contains fallback functions used when a damage type definition is missing a required function (`GetDamage` or `GetDefense`). |

## Main functions
### `DefineSpType(sptype, spdata)`
* **Description:** Registers a new special damage type with its associated calculation functions. Must be called before attempting to query damage/defense for that type. Overwrites existing definitions (but asserts uniqueness during definition).
* **Parameters:**  
  `sptype` (string) — Unique identifier for the damage type (e.g., `"planar"`).  
  `spdata` (table) — Table containing at least one of `GetDamage` or `GetDefense` functions. Each function must accept a single argument: `ent` (TheEntity).
* **Returns:** Nothing.

### `GetSpDamageForType(ent, sptype)`
* **Description:** Returns the special damage amount of the given type for the specified entity using the registered definition.
* **Parameters:**  
  `ent` (TheEntity) — Entity to calculate damage for.  
  `sptype` (string) — Registered special damage type name.
* **Returns:** number — Calculated damage value, or `0` if type is unknown or its `GetDamage` function returns `nil`.

### `GetSpDefenseForType(ent, sptype)`
* **Description:** Returns the special defense value of the given type for the specified entity using the registered definition.
* **Parameters:**  
  `ent` (TheEntity) — Entity to calculate defense for.  
  `sptype` (string) — Registered special damage type name.
* **Returns:** number — Calculated defense value, or `0` if type is unknown or its `GetDefense` function returns `nil`.

### `CollectSpDamage(ent, tbl)`
* **Description:** Iterates over all registered damage types, calculates each special damage value for the entity, and populates a table mapping `sptype → damage`. Only non-zero values are added.
* **Parameters:**  
  `ent` (TheEntity) — Entity whose special damage values should be collected.  
  `tbl` (table?, optional) — Pre-existing table to populate. If omitted or `nil`, a new table is created.
* **Returns:** table — The populated damage table (same as `tbl` if provided).

### `MergeSpDamage(tbl1, tbl2)`
* **Description:** Merges two special damage tables by summing values for matching keys. Handles `nil` inputs gracefully.
* **Parameters:**  
  `tbl1` (table?) — First damage table (updated in place if non-nil).  
  `tbl2` (table?) — Second damage table.
* **Returns:** table? — `tbl1` after modification if both inputs are non-nil; otherwise, whichever input is non-nil.

### `CalcTotalDamage(tbl)`
* **Description:** Sums all numeric values in the special damage table.
* **Parameters:**  
  `tbl` (table?) — Damage table produced by `CollectSpDamage` or similar.
* **Returns:** number — Total special damage across all types, or `0` if `tbl` is `nil` or empty.

### `ApplyMult(tbl, mult)`
* **Description:** Applies a multiplier to all values in the damage table. Removes entries where the result is `0` or `nil`.
* **Parameters:**  
  `tbl` (table?) — Damage table to modify.  
  `mult` (number) — Multiplier to apply.
* **Returns:** table? — The same table (`tbl`) after modification, or `nil` if all entries were removed.

### `ApplySpDefense(ent, tbl)`
* **Description:** Reduces special damage values in the table by the entity's matching special defense values. Values less than or equal to defense are set to `nil` (removed); overages are reduced to the difference.
* **Parameters:**  
  `ent` (TheEntity) — Entity whose special defenses are used to mitigate the damage.  
  `tbl` (table?) — Damage table to adjust.
* **Returns:** table? — The same table (`tbl`) after mitigation, or `nil` if all damage is negated.

## Events & listeners
None identified.
