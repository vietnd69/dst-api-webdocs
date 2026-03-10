---
id: klump
title: Klump
description: Manages loading and caching of encrypted asset and string files (klumps) for the Quagmire event.
tags: [assets, localization, quagmire, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 803a6e66
system_scope: network
---

# Klump

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `klump.lua` module provides utilities for loading encrypted asset files (such as images, animations, and localization strings) used in the Quagmire event. It tracks which klumps have been loaded to avoid redundant operations and integrates with the `Profile` component to persist decryption ciphers. The module supports two loading modes: an upfront boot-time load (when `LOAD_UPFRONT_MODE` is enabled) and a lazy/on-demand approach during festival activation. It relies on `klump_files.lua` for file lists and uses `quagmire_food_ids.lua` for food-related asset names when event conditions are met.

## Usage example
```lua
-- Force-load Quagmire klumps on boot if the event is active
LoadAccessibleKlumpFiles(false)

-- Load a specific klump file later
local cipher = Profile:GetKlumpCipher("anim/dynamic/food_example.dyn")
if cipher then
    LoadKlumpFile("anim/dynamic/food_example.dyn", cipher)
end

-- Apply localized string from encrypted JSON
ApplyKlumpToStringTable("STRINGS.NAMES.FOOD_EXAMPLE", '{"en": "Weird Food", "es": "Comida Rara"}')
```

## Dependencies & tags
**Components used:** `Profile` (via `Profile:GetKlumpCipher()`, `Profile:SaveKlumpCipher()`)
**Tags:** None identified.

## Properties
No public properties. All state is held in the module-level `loaded_klumps` table and constants.

## Main functions
### `LoadAccessibleKlumpFiles(minimal_load)`
* **Description:** Loads all accessible Quagmire klump files (assets and strings) either on boot (if `LOAD_UPFRONT_MODE` is `false`) or upfront during initialization (if `true`). Only activates when the Quagmire event is active or was recently active. Skips strings during `minimal_load`.
* **Parameters:** `minimal_load` (boolean) — if `true`, skips loading of localization strings.
* **Returns:** Nothing.

### `LoadKlumpFile(klump_file, cipher, suppress_print)`
* **Description:** Loads and caches an encrypted asset file (e.g., `.tex`, `.dyn`) via `TheSim:LoadKlumpFile()`. Records the cipher in `Profile` and marks the file as loaded.
* **Parameters:** 
  * `klump_file` (string) — path to the klump file (e.g., `"anim/dynamic/food.dyn"`).
  * `cipher` (string or table) — decryption key/cipher for the klump.
  * `suppress_print` (boolean) — if `true`, skips diagnostic print output.
* **Returns:** Nothing.

### `LoadKlumpString(klump_file, cipher, suppress_print)`
* **Description:** Loads and caches an encrypted localization string file via `TheSim:LoadKlumpString()`. Behaves like `LoadKlumpFile()` but for string data.
* **Parameters:** 
  * `klump_file` (string) — path to the klump string file (e.g., `"strings/names/food.lua"`).
  * `cipher` (string or table) — decryption key/cipher for the klump.
  * `suppress_print` (boolean) — if `true`, skips diagnostic print output.
* **Returns:** Nothing.

### `IsKlumpLoaded(klump_file)`
* **Description:** Checks if a specific klump file has already been loaded in this session.
* **Parameters:** `klump_file` (string) — the klump file path to check.
* **Returns:** `true` if the file was loaded, `false` otherwise.

### `ApplyKlumpToStringTable(string_id, json_str)`
* **Description:** Decodes a JSON-encoded localized string, selects the appropriate locale, and assigns the value to the global `STRINGS` table at the path specified by `string_id`. Handles common locale aliases (`zhr` → `zh`, `mex` → `es`).
* **Parameters:** 
  * `string_id` (string) — dot-notation path (e.g., `"STRINGS.NAMES.FOO"`) indicating where to place the string.
  * `json_str` (string) — JSON string containing locale keys (e.g., `{"en": "Foo", "es": "Foo ES"}`).
* **Returns:** Nothing.

## Events & listeners
None identified. This module provides top-level functions and does not register or fire events.