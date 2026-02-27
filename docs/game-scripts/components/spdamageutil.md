---
id: spdamageutil
title: Spdamageutil
description: A singleton utility managing special damage and defense types across entities, enabling modular damage systems via type registration and calculation.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: 80bdcfdb
---

# Spdamageutil

## Overview
This singleton component provides infrastructure for registering, querying, and manipulating special damage and defense types in DST’s combat system. It allows mods and core systems to define named damage types (e.g., "planar") with associated damage/defense calculation logic, and supports aggregating, merging, modifying, and applying such damage against entities.

## Dependencies & Tags
This component does not add any components or tags to entities. It is a utility module with no direct dependency on other components—however, its default "planar" type implementation checks for the presence of `planardamage` and `planardefense` components.

## Properties
No public instance-level properties are initialized. All state is held in module-scoped tables (`SpTypeMap`, `Fallbacks`), which are accessible via `_SpTypeMap` and `_Fallbacks` for internal or modding use (with caution).

## Main Functions

### `DefineSpType(sptype, spdata)`
* **Description:** Registers a new special damage type (e.g., `"planar"`) by mapping its name to a table of callback functions (`GetDamage`, `GetDefense`). Fails if the type is already defined.
* **Parameters:**  
  - `sptype` (string): Unique identifier for the damage type.  
  - `spdata` (table): Table containing optional `GetDamage(entity)` and/or `GetDefense(entity)` functions.

### `GetSpDamageForType(ent, sptype)`
* **Description:** Returns the special damage value of type `sptype` for the given entity, using the registered callback. Falls back to `0` if no definition or `GetDamage` is missing.
* **Parameters:**  
  - `ent` (Entity): The entity whose damage is queried.  
  - `sptype` (string): The special damage type identifier.

### `GetSpDefenseForType(ent, sptype)`
* **Description:** Returns the special defense value of type `sptype` for the given entity. Falls back to `0` if no definition or `GetDefense` is missing.
* **Parameters:**  
  - `ent` (Entity): The entity whose defense is queried.  
  - `sptype` (string): The special damage type identifier.

### `CollectSpDamage(ent, tbl)`
* **Description:** Iterates over all registered damage types, queries the entity’s damage for each, and populates a table mapping `sptype → damage_amount` for all types where damage > 0. Returns the populated table (or `nil` if no damage found).
* **Parameters:**  
  - `ent` (Entity): The entity to query.  
  - `tbl` (table?, optional): Existing table to populate; if `nil`, a new table is created.

### `MergeSpDamage(tbl1, tbl2)`
* **Description:** Combines two damage tables by summing values per damage type key. Returns `tbl1` modified in-place if both are non-nil; otherwise returns whichever table is non-`nil`.
* **Parameters:**  
  - `tbl1` (table?, optional): First damage table.  
  - `tbl2` (table?, optional): Second damage table.

### `CalcTotalDamage(tbl)`
* **Description:** Sums all values in the damage table to compute total damage.
* **Parameters:**  
  - `tbl` (table?): Table of damage amounts per type.

### `ApplyMult(tbl, mult)`
* **Description:** Multiplies all damage values in the table by `mult`, setting entries to `nil` (removing them) if the result is zero or `mult` is zero. Returns the (possibly modified) table.
* **Parameters:**  
  - `tbl` (table?): Damage table to scale.  
  - `mult` (number): Multiplicative factor.

### `ApplySpDefense(ent, tbl)`
* **Description:** Applies special defense from `ent` to reduce damage in `tbl`. For each damage type in `tbl`, subtracts the entity’s defense of that type (if > 0); damage entries are set to `nil` if reduced to ≤ 0. Returns the modified table.
* **Parameters:**  
  - `ent` (Entity): Entity providing defense.  
  - `tbl` (table?): Damage table to apply defense against.

## Events & Listeners
None.