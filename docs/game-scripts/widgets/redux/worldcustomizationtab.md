---
id: worldcustomizationtab
title: Worldcustomizationtab
description: Manages world customization settings for a specific tab in the server creation screen UI, including preset loading, customization options, and level editing.
tags: [ui, world, customization, settings]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 308a0150
system_scope: ui
---

# Worldcustomizationtab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WorldCustomizationTab` is a UI widget that displays and manages world customization settings for a specific location tab (e.g., Main World or Caves) in the server creation screen. It handles preset selection, tweak application, preset saving/reversion, and dynamic UI updates (e.g., adding/removing sublevels, showing/hiding controls). It integrates with `Levels`, `Customize`, and `Profile` modules to manage world generation options and user-defined presets.

## Usage example
```lua
-- Typically instantiated internally by the server creation screen, not directly.
-- Example of usage context:
local tab = WorldCustomizationTab(tab_index, server_creation_screen_instance)
tab:SetDataForSlot(slot_id)
tab:Refresh()
```

## Dependencies & tags
**Components used:** None (UI-only widget; uses external modules via `require` and `TheFrontEnd`, `Profile`, `Levels`, `Customize`, `ShardSaveGameIndex` globals).  
**Tags:** None (does not manipulate tags on entities).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tab_location_index` | number | `nil` | Index of the location tab being managed (e.g., `1` for Main World). |
| `current_level_locations` | table | `SERVER_LEVEL_LOCATIONS` | List of location IDs for the current game mode. |
| `currentmultilevel` | number | `tab_location_index` | Index of the currently selected sublevel (multi-level support). |
| `slot` | number | `-1` | Slot ID for the save game being edited. |
| `allowEdit` | boolean | `true` | Whether the tab is in editable mode (true) or read-only (save slot loaded). |
| `current_option_settings` | table | `{}` | Stores current preset and tweak settings per level index. |
| `servercreationscreen` | table | `nil` | Reference to the parent server creation screen widget. |

## Main functions
### `Refresh()`
*   **Description:** Updates the entire UI state: preset list, preset info, and multilevel UI.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdatePresetList()`
*   **Description:** Populates the preset spinner with available presets for the current level and rebuilds the customization options list (if enabled).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if the tab’s level is invalid or disabled.

### `SetTweak(level, option, value)`
*   **Description:** Records a tweak (override) for a specific world generation option. Removes the tweak if the value matches the preset default or no longer differs from the base.
*   **Parameters:**  
  `level` (number) – level index to apply the tweak to.  
  `option` (string) – name of the world generation option.  
  `value` (any) – new value to apply (or default to revert).  
*   **Returns:** Nothing.

### `LoadPreset(preset)`
*   **Description:** Loads a preset by ID or (if `preset` is `nil`) loads the default preset for the current location. Initializes tweak storage for the tab's current level.
*   **Parameters:** `preset` (string or `nil`) – preset ID to load, or `nil` to load default.
*   **Returns:** Nothing.
*   **Error states:** Throws an `assert` error in editable mode if the preset cannot be found.

### `SavePreset()`
*   **Description:** Saves current tweaks as a new custom preset in the user profile. Prompts the user to overwrite an existing preset if the maximum (`5`) custom presets is exceeded.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Exits early if no tweaks are present.

### `RevertChanges()`
*   **Description:** Prompts the user to confirm discarding current tweaks and reloading the base preset.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsLevelEnabled(level)`
*   **Description:** Checks whether a given level index has been added to the configuration (i.e., is active).
*   **Parameters:** `level` (number) – level index to check.
*   **Returns:** `boolean` – `true` if the level exists in `current_option_settings`, `false` otherwise.

### `CollectOptions()`
*   **Description:** Builds and returns the final flattened list of world generation settings for the current level, combining the base preset with all active tweaks.
*   **Parameters:** None.
*   **Returns:** `table` – a level data object containing `overrides` (key/value pairs), or `nil` if level is not enabled.

### `SetDataForSlot(slot)`
*   **Description:** Loads save game data for a given slot into this tab. Sets `allowEdit` to `false` if a valid save exists; otherwise allows editing (with optional auto-add for default locations).
*   **Parameters:** `slot` (number) – slot index to load.
*   **Returns:** Nothing.

### `UpdateMultilevelUI()`
*   **Description:** Controls visibility and labels for the “Add [Location]” overlay, preset panel, and remove-level button based on tab state (enabled, disabled, editable, non-editable).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdatePresetInfo(level)`
*   **Description:** Updates the preset description text and spinner text for a given level, reflecting whether the current state is default, custom, or missing mod preset.
*   **Parameters:** `level` (number) – level index to update.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `level` does not match the active `currentmultilevel` or is not enabled.

### `GetLocationName(level)`
*   **Description:** Returns localized location and tab names for a given level index (e.g., `"The Forest"`, `"Main World"`).
*   **Parameters:** `level` (number) – level index.
*   **Returns:** `string, string` – location name, tab name.

### `GetNumberOfTweaks(levelonly)`
*   **Description:** Counts the number of active tweaks (custom overrides) applied for a specific level or all levels.
*   **Parameters:** `levelonly` (number or `nil`) – if provided, only count tweaks for that level.
*   **Returns:** `number` – tweak count.

### `AddMultiLevel(level)`
*   **Description:** Initializes a new sublevel entry for a non-main world (index `> 1`) if not already present.
*   **Parameters:** `level` (number) – level index to add.
*   **Returns:** Nothing.

### `RemoveMultiLevel(level)`
*   **Description:** Removes a sublevel entry from `current_option_settings` (for non-main worlds).
*   **Parameters:** `level` (number) – level index to remove.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (uses callback closures on button clicks and spinner changes instead of event listeners).
- **Pushes:** None (relies on `PopupDialogScreen` and parent screen callbacks to signal changes).