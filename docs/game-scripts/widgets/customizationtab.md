---
id: customizationtab
title: Customizationtab
description: Manages the UI for selecting and editing world generation presets across multiple map levels in the sandbox menu.
tags: [ui, customization, world, menu, presets]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b7bf41e0
system_scope: ui
---

# Customizationtab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CustomizationTab` is a UI widget that provides the interface for configuring world generation settings for one or more map levels in the sandbox creation menu. It manages preset selection via a spinner, displays editable customization options via a `CustomizationList`, and handles multi-level world setups. It integrates with `PopupDialogScreen` for confirmation dialogs, `Spinner`/`NumericSpinner` for selection controls, and interacts with world generation data from `map/customize.lua` and `map/levels.lua`. This component is part of the client-side UI and does not directly modify game state — it aggregates changes for the parent `ServerCreationScreen`.

## Usage example
```lua
-- Typically instantiated by ServerCreationScreen during sandbox menu setup
local tab = CustomizationTab(servercreationscreen)

-- Access and modify current level settings
tab:SelectMultilevel(2) -- switch to second level tab
tab:SetTweak(2, "autumn", "short") -- set tweak for autumn length
tab:Refresh() -- update UI after changes

-- Retrieve final compiled settings for world generation
local final_settings = tab:CollectOptions()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  
**UI Elements used:** `Widget`, `Text`, `Image`, `ImageButton`, `Spinner`, `NumericSpinner`, `PopupDialogScreen`, `CustomizationList`, `TEMPLATES.TabButton`, `TEMPLATES.IconButton`, `TEMPLATES.SmallButton`, `TEMPLATES.LabelSpinner`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `current_level_locations` | table | `SERVER_LEVEL_LOCATIONS` | List of level location IDs available for current game mode. |
| `slotoptions` | table | `{}` | Preset data loaded from a save slot when viewing a saved world. |
| `slot` | number | `-1` | Index of the save slot currently being edited. |
| `currentmultilevel` | number | `1` | Index of the currently selected level tab. |
| `allowEdit` | boolean | `true` | Whether edits are allowed (false when viewing saved slots). |
| `servercreationscreen` | table (reference) | passed to constructor | Parent screen that owns this tab; used to update buttons and signal dirty state. |
| `current_option_settings` | table | `{}` | Stores current configuration per level: `{ preset = string, tweaks = table }`. |
| `presetpanel` | widget | created in constructor | Panel containing preset controls (spinner, tabs, buttons). |
| `current_option_settingspanel` | widget | created in constructor | Panel containing the active customization list for the selected level. |
| `customizationlist` | `CustomizationList` | `nil` | Widget displaying editables for the selected level. |
| `multileveltabs` | widget | created in constructor | Container for level selection tab buttons. |

## Main functions
### `Refresh()`
*   **Description:** Updates the entire UI state for the current level, including preset list, description, and tab states. Called after loading, selection changes, or edits.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `SelectMultilevel(level)`
*   **Description:** Switches the active level tab to the specified index (`level`) and refreshes the UI accordingly.
*   **Parameters:** `level` (number) — 1-based index of the level tab to select.
*   **Returns:** Nothing.
*   **Error states:** None.

### `UpdatePresetList()`
*   **Description:** Repopulates the preset spinner and refreshes the customization options list (`CustomizationList`) for the current level. Handles both editable and read-only (saved slot) modes.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `UpdatePresetInfo(level)`
*   **Description:** Updates the preset title, description, and button visibility (Save/Revert) based on whether the current level has custom tweaks or is in read-only mode.
*   **Parameters:** `level` (number) — level index to update info for. If not the current level, the function exits early.
*   **Returns:** Nothing.
*   **Error states:** None.

### `GetLocationForLevel(level)`
*   **Description:** Returns the location ID string for a given level index, prioritizing the current preset if one exists, otherwise using the default location from `current_level_locations`.
*   **Parameters:** `level` (number) — level index.
*   **Returns:** string — location identifier, or `nil` if not determinable.

### `IsLevelEnabled(level)`
*   **Description:** Checks whether a level has been added (i.e., `current_option_settings[level]` is non-`nil`).
*   **Parameters:** `level` (number) — level index.
*   **Returns:** boolean — `true` if the level is active, `false` otherwise.

### `SetTweak(level, option, value)`
*   **Description:** Records a custom tweak for a specific option in the given level. Clears the tweak if it matches the default or preset override value.
*   **Parameters:**  
    - `level` (number) — level index  
    - `option` (string) — option name (e.g., `"autumn"`)  
    - `value` (any) — value assigned to the option  
*   **Returns:** Nothing.

### `LoadPreset(level, preset)`
*   **Description:** Loads a preset by ID into the specified level slot. If `preset` is `nil`, loads the default preset for the level's location. Initializes `tweaks` to an empty table.
*   **Parameters:**  
    - `level` (number) — level index  
    - `preset` (string? | nil) — preset ID, or `nil` to load default  
*   **Returns:** Nothing.
*   **Error states:** In editable mode, asserts if `presetdata` is `nil`. In non-editable mode, falls back to `"MOD_MISSING"` preset if load fails.

### `SavePreset()`
*   **Description:** Saves the current tweaks as a new custom preset. If the preset limit (5) is exceeded, presents a modal to choose an existing preset index to overwrite. Saves to the profile and reloads the new preset.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Exits early if there are no tweaks to save.

### `RemoveMultiLevel(level)`
*   **Description:** Removes a level (other than level 1) from `current_option_settings`. Adjusts `currentmultilevel` if the removed level was active.
*   **Parameters:** `level` (number) — level index to remove.
*   **Returns:** Nothing.

### `AddMultiLevel(level)`
*   **Description:** Adds a new level slot for the given index, loading defaults if needed. Typically called when the user clicks an "Add level" tab.
*   **Parameters:** `level` (number) — level index to add.
*   **Returns:** Nothing.

### `UpdateSlot(slotnum, prevslot, delete)`
*   **Description:** Loads preset and tweak data from a save slot (`slotnum`) for editing, or resets to defaults if the slot is empty. Used when switching between save slots. In non-empty slots, `allowEdit` is set to `false`.
*   **Parameters:**  
    - `slotnum` (number) — target slot index  
    - `prevslot` (number) — previous slot index (for preserving changes between slots)  
    - `delete` (boolean) — if `true`, skip loading if slot unchanged  
*   **Returns:** Nothing.

### `GetNumberOfTweaks(levelonly)`
*   **Description:** Counts the number of active tweaks across all levels, or just for `levelonly` if specified.
*   **Parameters:** `levelonly` (number? | nil) — optional level index to restrict count.
*   **Returns:** number — total tweak count.

### `RevertChanges()`
*   **Description:** Prompts the user via a confirmation dialog to discard current tweaks and reload the last loaded preset for the active level.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `CollectOptions()`
*   **Description:** Compiles and returns a flattened list of final world settings for all levels. Combines preset defaults, overrides, and active tweaks, and propagates `specialevent` settings across all levels.
*   **Parameters:** None.
*   **Returns:** table — array of level configurations, each with `overrides` populated with final values.

### `GetLocationStringID(level)`
*   **Description:** Returns the uppercase location string ID used for localization lookups (e.g., `"FOREST"`). Falls back to `"UNKNOWN"` or the default location if preset data is unavailable.
*   **Parameters:** `level` (number) — level index.
*   **Returns:** string — localized location key.

### `UpdateMultilevelUI()`
*   **Description:** Updates tab button visuals and text based on whether the level is enabled, editable, or can be added. Shows/hides the remove button accordingly.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdatePresetList()` (repeated detail for clarity)
*   **Description:** Updates the preset spinner and customization list for the current level. Handles both editable (user adding levels) and read-only (viewing saved slot) modes.

### `HookupFocusMoves()`
*   **Description:** Configures keyboard/controller focus navigation between widgets in the UI hierarchy (tabs, spinner, buttons, customization list).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `VerifyValidSeasonSettings()`
*   **Description:** Checks whether at least one season is enabled for the first level. Used to validate user selections.
*   **Parameters:** None.
*   **Returns:** boolean — `false` if all seasons are `"noseason"`, otherwise `true`.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  
> This component is purely UI-driven and does not fire or listen to core game events. It responds to user-driven callbacks (button clicks, spinner changes) and UI lifecycle events (focus moves, tab switching) managed by DST's widget system.