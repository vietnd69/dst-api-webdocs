---
id: custompresets
title: Custompresets
description: Manages custom world generation and settings presets for player-created world configurations.
tags: [world, presets, customization]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 2ff5909c
system_scope: world
---

# Custompresets

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`CustomPresets` is a utility class that manages player-created world presets for both world generation settings and world customization options. It handles loading, saving, validating, and deleting custom preset files stored in persistent storage. This class works alongside the `Levels` and `Customize` modules to integrate custom presets into the world generation system. Presets are stored as `.wsp` (settings) or `.wgp` (worldgen) files in the `world_presets/` directory.

## Usage example
```lua
local CustomPresets = require("custompresets")
local presets = CustomPresets()

-- Load existing custom presets from user storage
presets:Load()

-- Save a new custom preset
presets:SaveCustomPreset(
    LEVELCATEGORY.SETTINGS,
    "CUSTOM_MYPRESET",
    "SURVIVAL_TOGETHER",
    overrides,
    "My Preset",
    "Custom world settings"
)

-- Check if preset exists
if presets:PresetIDExists(LEVELCATEGORY.SETTINGS, "CUSTOM_MYPRESET") then
    presets:DeleteCustomPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_MYPRESET")
end
```

## Dependencies & tags
**Components used:** None (utility class, not attached to entities)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `presets` | table | `{}` | Cached preset data organized by category (SETTINGS/WORLDGEN). |
| `presetIDs` | table | `{}` | List of preset IDs available for each category. |

## Main functions
### `Load()`
*   **Description:** Loads custom presets from user profile and migrates them to persistent storage. Called during initialization to populate the preset system with user-created presets.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Silently fails if `Profile` is nil or contains no customization presets.

### `LoadCustomPreset(category, presetid)`
*   **Description:** Loads a specific custom preset from persistent storage and caches it. Validates that the preset ID starts with `CUSTOM_` prefix.
*   **Parameters:** `category` (LEVELCATEGORY) - preset category (SETTINGS or WORLDGEN). `presetid` (string) - must start with `CUSTOM_` prefix.
*   **Returns:** `presetdata` (table) - loaded preset data or nil if load fails.
*   **Error states:** Returns nil if preset ID does not start with `CUSTOM_`, if preset is not in `presetIDs` table, or if file load fails.

### `IsValidPreset(category, presetid)`
*   **Description:** Checks if a custom preset exists and is valid by attempting to load and parse its data.
*   **Parameters:** `category` (LEVELCATEGORY) - preset category. `presetid` (string) - preset ID to validate.
*   **Returns:** `boolean` - true if preset exists and is valid, false otherwise.
*   **Error states:** Returns false if preset ID does not start with `CUSTOM_` or if preset data is malformed.

### `SaveCustomPreset(category, presetid, basepreset, overrides, name, desc)`
*   **Description:** Creates or updates a custom preset with the specified configuration. Saves preset data to persistent storage and updates internal caches.
*   **Parameters:** `category` (LEVELCATEGORY) - preset category. `presetid` (string) - must start with `CUSTOM_`. `basepreset` (string) - base preset ID this custom preset extends. `overrides` (table) - setting overrides. `name` (string) - display name. `desc` (string) - description.
*   **Returns:** `boolean` - true on success, nil on failure.
*   **Error states:** Returns nil if any required parameter is nil, if basepreset is itself a custom preset, or if base preset data cannot be loaded.

### `MoveCustomPreset(category, oldid, presetid, name, desc)`
*   **Description:** Renames or moves an existing custom preset to a new ID. Deletes the old preset file after successful save.
*   **Parameters:** `category` (LEVELCATEGORY) - preset category. `oldid` (string) - current preset ID. `presetid` (string) - new preset ID. `name` (string) - new display name. `desc` (string) - new description.
*   **Returns:** `presetdata` (table) - the moved preset data or nil if operation fails.
*   **Error states:** Returns nil if old preset does not exist or if save operation fails.

### `DeleteCustomPreset(category, presetid)`
*   **Description:** Removes a custom preset from cache and deletes its persistent storage file.
*   **Parameters:** `category` (LEVELCATEGORY) - preset category. `presetid` (string) - preset ID to delete.
*   **Returns:** Nothing.
*   **Error states:** Silently fails if preset does not exist in cache.

### `PresetIDExists(category, presetid)`
*   **Description:** Checks if a preset ID is registered in the `presetIDs` table for the given category.
*   **Parameters:** `category` (LEVELCATEGORY) - preset category. `presetid` (string) - preset ID to check.
*   **Returns:** `boolean` - true if ID exists in presetIDs table.
*   **Error states:** None.

### `GetPresetIDs(category)`
*   **Description:** Returns the list of all registered preset IDs for a specific category.
*   **Parameters:** `category` (LEVELCATEGORY) - preset category.
*   **Returns:** `table` - array of preset ID strings.
*   **Error states:** Returns empty table if category has no presets.

## Events & listeners
Not applicable - this is a utility class that does not interact with the entity event system.