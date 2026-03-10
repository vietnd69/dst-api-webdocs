---
id: dlcsupport_strings
title: Dlcsupport Strings
description: Manages string formatting logic for constructing prefixed or suffixed names of items and entities based on language rules and modded content.
tags: [localization, strings, dlc]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 8c2d3362
system_scope: ui
---

# Dlcsupport Strings

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`dlcsupport_strings.lua` is a utility module that centralizes the logic for determining whether a given adjective (e.g., `wet`, `smoldering`) should be prefixed or suffixed to an entity’s base name when generating localized display names. It provides functions to configure and query this behavior per string key, and to construct the final formatted name. This module supports dynamic language customization, especially for modded content where naming conventions may vary.

## Usage example
```lua
-- Configure that "smoldering" uses a prefix (e.g., "Smoldering Torch")
SetUsesPrefix(STRINGS.SMOLDERINGITEM, true)

-- Build a formatted name for an entity
local formatted = ConstructAdjectivedName(inst, STRINGS.NAMES.SMOKEY_TORCH, STRINGS.SMOLDERINGITEM)
-- Returns "Smoldering Smokey Torch" if prefix logic applies
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `MakeAllSuffixes(fn)`
* **Description:** Sets all entries in `USE_PREFIX` to suffix mode (i.e., forces adjectives to appear *after* the noun), unless a custom function `fn` is provided (in which case it overrides the default behavior per key).
* **Parameters:** `fn` (function or `nil`) — optional callback function that receives `(inst, name, adjective)` and returns a string, or `false` to use suffix format unconditionally. If not a function, treated as `false`.
* **Returns:** Nothing.
* **Error states:** If `fn` is not a function, defaults to suffix behavior (`false`).

### `MakeAllPrefixes(fn)`
* **Description:** Sets all entries in `USE_PREFIX` to prefix mode (i.e., forces adjectives to appear *before* the noun), unless a custom function `fn` is provided.
* **Parameters:** `fn` (function or `nil`) — optional callback function that receives `(inst, name, adjective)` and returns a string, or `true` to use prefix format unconditionally. If not a function, treated as `true`.
* **Returns:** Nothing.
* **Error states:** If `fn` is not a function, defaults to prefix behavior (`true`).

### `SetUsesPrefix(item, usePrefix)`
* **Description:** Explicitly configures whether a given string key (e.g., `STRINGS.SMOLDERINGITEM`) should use a prefix (`true`) or suffix (`false`). Also invokes `TryGuaranteeCoverage` to cross-link related keys for consistency.
* **Parameters:**  
  - `item` (string) — a string key (e.g., `STRINGS.WET_PREFIX.FOOD`).  
  - `usePrefix` (boolean or `nil`) — `true` for prefix, `false` for suffix. Must be non-`nil`.
* **Returns:** Nothing.
* **Error states:** No effect if `item` is not a string or `usePrefix` is `nil`.

### `ConstructAdjectivedName(inst, name, adjective)`
* **Description:** Constructs a formatted display name by combining `name` and `adjective` according to configured prefix/suffix rules, optionally delegating to a custom function if defined.
* **Parameters:**  
  - `inst` (optional table) — the entity instance; used to resolve `name` if not provided explicitly.  
  - `name` (optional string) — base display name. If `nil`, derived from `inst.prefab` via `STRINGS.NAMES[UPPER(inst.prefab)]`.  
  - `adjective` (string) — adjective string key or literal (e.g., `STRINGS.WET_PREFIX.FOOD`).  
* **Returns:** `string` — the formatted name, e.g., `"Wet Food"` or `"Food Wet"` depending on rules.  
* **Error states:**  
  - Returns `name.." "..adjective` if no `usePrefix` rule is found for either `adjective` or `name`.  
  - If the configured rule is a function and it returns a non-string value, falls back to default rule (`prefix/suffix` based on boolean).

### `UsesPrefix(item)`
* **Description:** Internal helper to check whether `item` should use a prefix. Used by `ConstructAdjectivedName`.
* **Parameters:** `item` (string) — string key (e.g., `STRINGS.SMOLDERINGITEM`).  
* **Returns:** `boolean` or `nil` — `true` for prefix, `false` for suffix, or `nil` if undefined.  
* **Error states:** Returns `nil` if `item` is not a string or not present in `USE_PREFIX`.

## Events & listeners
None identified