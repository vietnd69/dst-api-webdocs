---
id: presetpopupscreen
title: PresetPopupScreen
description: Displays a scrollable list of world or settings presets for selection, editing, or deletion in the UI.
tags: [ui, customization, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 7c012c14
system_scope: ui
---

# PresetPopupScreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PresetPopupScreen` is a UI screen that presents a scrollable grid of presets (world generation or settings presets) based on the provided category (`LEVELCATEGORY.SETTINGS`, `LEVELCATEGORY.WORLDGEN`, or `LEVELCATEGORY.COMBINED`). It allows the user to select, edit, or delete presets and handles user input (keyboard/controller) to perform the requested actions. It integrates with the `Levels` module to retrieve and manage preset data and uses a `ScrollingGrid` to render the list of presets. The screen requires callback functions for confirming, editing, and deleting presets and manages focus, selection state, and controller-friendly help text.

## Usage example
```lua
local PresetPopupScreen = require "screens/redux/presetpopupscreen"

TheFrontEnd:PushScreen(
    PresetPopupScreen(
        "current_preset_id",
        function(levelcategory, presetid) -- onconfirmfn
            print("Confirmed preset:", presetid)
        end,
        function(levelcategory, oldid, newid, name, desc) -- oneditfn
            print("Editing", oldid, "→", newid)
            return true
        end,
        function(levelcategory, presetid) -- ondeletefn
            print("Deleting", presetid)
        end,
        LEVELCATEGORY.WORLDGEN,
        "forest",
        nil
    )
)
```

## Dependencies & tags
**Components used:** None (this is a screen, not an entity component; it uses UI widget infrastructure)
**Tags:** none — does not interact with entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `originalpreset` | string or nil | `currentpreset` arg | ID of the preset initially considered "selected" or default. |
| `levelcategory` | `LEVELCATEGORY.*` | `levelcategory` arg | Category of presets to display (`SETTINGS`, `WORLDGEN`, `COMBINED`). |
| `level_type` | string | `level_type` arg | Level type identifier (e.g., `"forest"`, `"caves"`). |
| `location` | any | `location` arg | Optional location context for preset filtering. |
| `onconfirmfn` | function | (required arg) | Callback invoked when user confirms a selection. |
| `oneditfn` | function | (required arg) | Callback invoked when user edits a preset. |
| `ondeletefn` | function | (required arg) | Callback invoked when user deletes a preset. |
| `selectedpreset` | string | first preset ID | ID of the currently selected preset. |
| `presets` | table | populated via `UpdatePresetList` | List of preset data objects displayed in the scroll grid. |

## Main functions
### `EditPreset(presetid)`
* **Description:** Launches the `NamePresetScreen` to allow editing an existing preset. Handles fallback logic for `COMBINED` presets and displays a failure dialog if `oneditfn` returns false.
* **Parameters:** `presetid` (string) — ID of the preset to edit.
* **Returns:** Nothing.
* **Error states:** Displays a failure dialog if `oneditfn` returns `false`.

### `DeletePreset(presetid)`
* **Description:** Displays a confirmation popup before deleting the specified preset; calls `ondeletefn` if confirmed.
* **Parameters:** `presetid` (string) — ID of the preset to delete.
* **Returns:** Nothing.

### `OnPresetButton(presetinfo)`
* **Description:** Handler for clicking/activating a preset in the list; selects it and refreshes the screen.
* **Parameters:** `presetinfo` (table) — Contains preset data (e.g., `{data = "preset_id"}`).
* **Returns:** Nothing.

### `UpdatePresetList()`
* **Description:** Fetches the current list of presets for the screen’s category/type/location via `Levels.GetList`, validates each entry (filters out corrupt/missing `data`), and updates the scroll list.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Silently skips entries where `preset_settingsdata[data.data]` remains `nil` after loading attempt.

### `Refresh()`
* **Description:** Instructs the scroll list to refresh its view; used after selection or data updates.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnCancel()`
* **Description:** Closes the screen without confirming any preset.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnConfirmPreset()`
* **Description:** Calls `onconfirmfn` with the selected preset ID and closes the screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSelectPreset(presetid)`
* **Description:** Records the given `presetid` as the current selection.
* **Parameters:** `presetid` (string) — ID of the selected preset.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles keyboard/controller input to trigger cancel (`CONTROL_CANCEL`) or confirm (`CONTROL_MENU_START`) actions.
* **Parameters:**  
  `control` (enum) — Input control constant.  
  `down` (boolean) — Whether the control is pressed (not released).
* **Returns:** `true` if the input was handled; `false` otherwise.

### `GetHelpText()`
* **Description:** Returns localized help text describing available control actions (e.g., `B` to cancel, `A`/`Enter` to confirm).
* **Parameters:** None.
* **Returns:** string — Concatenated localized help string.

## Events & listeners
- **Listens to:** none (no `inst:ListenForEvent` calls; this is a UI screen, not an entity).
- **Pushes:** none (no `inst:PushEvent` calls; UI navigation handled via `TheFrontEnd`).