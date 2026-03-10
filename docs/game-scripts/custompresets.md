---
id: custompresets
title: Custompresets
description: Manages custom world and settings presets created by users or mods in Don't Starve Together.
tags: [world, settings, persistence, customization]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 2ff5909c
system_scope: world
---

# Custompresets

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`CustomPresets` is a singleton class that manages user-defined and mod-provided world and settings presets. It loads preset configurations from disk, validates them, upgrades legacy formats, and provides methods for saving, moving, and deleting presets. It integrates with `map/customize.lua` for default option handling and `map/levels.lua` for base preset data retrieval.

## Usage example
```lua
-- Load all custom presets into memory
CustomPresets:Load()

-- Check if a custom preset exists
if CustomPresets:PresetIDExists(LEVELCATEGORY.SETTINGS, "CUSTOM_MY_PRESET") then
    -- Load and use the preset data
    local preset = CustomPresets:LoadCustomPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_MY_PRESET")
    if preset then
        -- use preset data, e.g., preset:GetName(), preset:GetID()
    end
end
```

## Dependencies & tags
**Components used:** `TheSim` (for file I/O and persistent string management), `Profile` (for legacy preset migration)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `presets` | table (nested) | `{ [LEVELCATEGORY.SETTINGS] = {}, [LEVELCATEGORY.WORLDGEN] = {} }` | Cache of loaded preset data objects, keyed by category and preset ID. |
| `presetIDs` | table (nested) | `{ [LEVELCATEGORY.SETTINGS] = {}, [LEVELCATEGORY.WORLDGEN] = {} }` | Lists of valid custom preset IDs, sorted alphabetically, keyed by category. |

## Main functions
### `Load()`
* **Description:** Loads custom presets from persistent storage and legacy profile settings. Populates `presetIDs` and caches presets in `presets`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented.

### `LoadCustomPreset(category, presetid)`
* **Description:** Loads and returns the full preset data object for a given custom preset ID, or `nil` if invalid/unavailable.
* **Parameters:** 
  - `category` (number, `LEVELCATEGORY`) — Category of the preset (e.g., `LEVELCATEGORY.SETTINGS` or `LEVELCATEGORY.WORLDGEN`).
  - `presetid` (string) — ID of the custom preset (must start with `"CUSTOM_"`).
* **Returns:** `presetdata` (table or `nil`) — Parsed and extended preset data, or `nil` if missing or invalid.
* **Error states:** Returns `nil` if `presetid` is not in `presetIDs[category]`, file load fails, sandbox parse fails, or required fields (`baseid`, `name`, `desc`, `overrides`) are missing.

### `IsValidPreset(category, presetid)`
* **Description:** Synchronously checks if a preset exists and is valid without loading its full data.
* **Parameters:** 
  - `category` (number, `LEVELCATEGORY`) — Category of the preset.
  - `presetid` (string) — ID of the custom preset.
* **Returns:** `boolean` — `true` if the preset exists and is structurally valid, `false` otherwise.
* **Error states:** None.

### `SaveCustomPreset(category, presetid, basepreset, overrides, name, desc)`
* **Description:** Creates and saves a new custom preset based on an existing base preset, applying the given overrides and metadata.
* **Parameters:** 
  - `category` (number, `LEVELCATEGORY`) — Category of the preset.
  - `presetid` (string) — Unique ID for the new custom preset (must start with `"CUSTOM_"`).
  - `basepreset` (string) — ID of the base preset to copy defaults from.
  - `overrides` (table) — Key-value map of option overrides.
  - `name` (string) — Display name of the custom preset.
  - `desc` (string) — Description of the custom preset.
* **Returns:** `true` on success, `nil` if required arguments are missing, base preset is custom, or base preset data is unavailable.
* **Error states:** Returns early if `presetid` is missing, `basepreset` is a custom preset, or `basepreset` does not exist.

### `MoveCustomPreset(category, oldid, presetid, name, desc)`
* **Description:** Renames/moves an existing custom preset to a new ID (or same ID with updated name/desc).
* **Parameters:** 
  - `category` (number, `LEVELCATEGORY`) — Category of the preset.
  - `oldid` (string) — Current ID of the preset to move.
  - `presetid` (string) — New ID for the preset (must start with `"CUSTOM_"`).
  - `name` (string) — Updated display name.
  - `desc` (string) — Updated description.
* **Returns:** `presetdata` (table or `nil`) — The resulting preset object after move/update, or `nil` if `oldid` does not exist.
* **Error states:** Does nothing if `oldid` is not found.

### `DeleteCustomPreset(category, presetid)`
* **Description:** Removes a custom preset from memory and persistent storage.
* **Parameters:** 
  - `category` (number, `LEVELCATEGORY`) — Category of the preset.
  - `presetid` (string) — ID of the preset to delete.
* **Returns:** Nothing.
* **Error states:** None.

### `PresetIDExists(category, presetid)`
* **Description:** Checks whether a given preset ID exists in the loaded list for a category.
* **Parameters:** 
  - `category` (number, `LEVELCATEGORY`) — Category to check.
  - `presetid` (string) — Preset ID to verify.
* **Returns:** `boolean` — `true` if the ID is registered, `false` otherwise.
* **Note:** For `LEVELCATEGORY.COMBINED`, checks both categories.

### `IsCustomPreset(category, presetid)`
* **Description:** Alias for `PresetIDExists`. Returns `true` if the given ID is a custom preset ID.

### `GetPresetIDs(category)`
* **Description:** Returns the sorted list of custom preset IDs for a category.
* **Parameters:** 
  - `category` (number, `LEVELCATEGORY`) — Category to list.
* **Returns:** `table` — Array of preset IDs (e.g., `{ "CUSTOM_ABC", "CUSTOM_XYZ" }`).

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.