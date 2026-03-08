---
id: presetbox
title: Presetbox
description: Manages the UI panel for displaying, selecting, editing, and deleting world/customization presets in the game's customization screen.
tags: [ui, customization, preset]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a6962c54
system_scope: ui
---

# Presetbox

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PresetBox` is a UI widget that presents controls and information for managing presets in the customization screen. It displays metadata for the currently selected preset (name, description, playstyle), and provides buttons for loading, saving, editing, reverting, and deleting presets—adapting its behavior based on the `levelcategory` (SETTINGS, WORLDGEN, or COMBINED). It delegates most logic to its `parent_widget`, acting as a visual and interactive front-end layer.

## Usage example
```lua
local PresetBox = require "widgets/redux/worldsettings/presetbox"
local parent_widget = ... -- e.g., a CustomizationScreen or compatible parent

local presetbox = widget:AddChild(PresetBox(parent_widget, LEVELCATEGORY.WORLDGEN, 500))
presetbox:SetTextAndDesc("My World Preset", "A balanced world setup for multiplayer.")
presetbox:SetEditable(true)
presetbox:SetRevertable(false)
presetbox:SetPresetEditable(true)
presetbox:SetPlaystyleIcon("adventure")
```

## Dependencies & tags
**Components used:** None (pure UI widget, no ECS components)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `height` | number | `500` | Height of the box in pixels. |
| `levelcategory` | `LEVELCATEGORY` enum | `nil` | Determines behavior and strings (SETTINGS, WORLDGEN, or COMBINED). |
| `parent_widget` | widget | `nil` | The owning widget (e.g., `CustomizationScreen`) providing preset data and business logic. |
| `root` | Image | — | Root visual container for the box. |
| `presets` | Text | — | Title label for the preset section. |
| `presetname` | Text | — | Displays the current preset’s name. |
| `presetdesc` | Text | — | Displays the current preset’s description. |
| `playstyle` | Widget | — | Container for the playstyle icon and label; hidden if no playstyle. |
| `revertbutton` | IconButton | — | Reverts unsaved changes. |
| `presetbutton` | StandardButton | — | Opens the preset selection popup. |
| `savepresetbutton` | StandardButton | — | Saves current settings/worldgen as a new preset. |
| `editpresetbutton` | IconButton | — | Edits the currently loaded preset. |
| `changepresetmode` | IconButton | — | Toggles between linked/unlinked preset mode (only shown for new shards). |

## Main functions
### `OnPresetChosen(presetid)`
*   **Description:** Loads a selected preset, prompting confirmation if unsaved tweaks exist. Delegates to `parent_widget:OnPresetButton(presetid)` after confirmation.
*   **Parameters:** `presetid` (string or number) — the ID of the preset to load.
*   **Returns:** Nothing.
*   **Error states:** Displays a warning dialog if tweaks exist and user selects "No"; does nothing on cancellation.

### `OnCombinedPresetChosen(presetid)`
*   **Description:** Loads a combined preset (applies both settings and worldgen), prompting confirmation if unsaved combined tweaks exist. Delegates to `parent_widget:OnCombinedPresetButton(presetid)` after confirmation.
*   **Parameters:** `presetid` (string or number) — the ID of the combined preset to load.
*   **Returns:** Nothing.

### `OnPresetButton()`
*   **Description:** Opens the `PresetPopupScreen` for preset selection and management (load, edit, delete), passing callbacks to this widget’s handlers.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRevertChanges()`
*   **Description:** Shows a confirmation dialog to discard unsaved changes and reverts to the stored preset, calling `parent_widget:RevertChanges()` on confirmation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSavePreset()`
*   **Description:** Opens the `NamePresetScreen` to save current settings/worldgen as a new preset. Calls `parent_widget:SavePreset()` or `SaveCombinedPreset()` depending on category.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** If save fails, shows a failure dialog.

### `OnEditPreset()`
*   **Description:** Opens the `NamePresetScreen` pre-filled with the current preset’s name and description, to edit its metadata. Calls `EditPreset()` or `EditCombinedPreset()` on save.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EditPreset(originalid, presetid, name, desc, updateoverrides)`
*   **Description:** Updates the name and description of a preset, optionally updating overrides. Delegates to `parent_widget:EditPreset(...)`.
*   **Parameters:**  
  - `originalid` (string/number) — current preset ID before update.  
  - `presetid` (string/number) — new or updated preset ID.  
  - `name` (string) — new preset name.  
  - `desc` (string) — new preset description.  
  - `updateoverrides` (boolean) — whether to update overrides from current tweak state.
*   **Returns:** Boolean — result of `parent_widget:EditPreset(...)`.

### `EditCombinedPreset(originalid, presetid, name, desc, updateoverrides)`
*   **Description:** Like `EditPreset`, but for combined presets. Delegates to `parent_widget:EditCombinedPreset(...)`.
*   **Parameters:** Same as `EditPreset`.
*   **Returns:** Boolean — result of `parent_widget:EditCombinedPreset(...)`.

### `DeletePreset(presetid)`
*   **Description:** Deletes a standard preset. Delegates to `parent_widget:DeletePreset(presetid)`.
*   **Parameters:** `presetid` (string or number).
*   **Returns:** Nothing.

### `DeleteCombinedPreset(presetid)`
*   **Description:** Deletes a combined preset. Delegates to `parent_widget:DeleteCombinedPreset(presetid)`.
*   **Parameters:** `presetid` (string or number).
*   **Returns:** Nothing.

### `SetTextAndDesc(text, desc)`
*   **Description:** Updates the displayed preset name and description text.
*   **Parameters:**  
  - `text` (string) — preset name.  
  - `desc` (string) — preset description.
*   **Returns:** Nothing.

### `SetPlaystyleIcon(playstyle_id)`
*   **Description:** Configures and shows or hides the playstyle icon and label based on the playstyle ID. Uses `Levels.GetPlaystyleDef()` to fetch icon data.
*   **Parameters:** `playstyle_id` (string or nil) — ID of the playstyle (e.g., `"adventure"`), or `nil` to hide.
*   **Returns:** Nothing.

### `SetEditable(editable)`
*   **Description:** Shows or hides all action buttons (preset, save, revert, edit) based on editable state.
*   **Parameters:** `editable` (boolean) — whether to show buttons.
*   **Returns:** Nothing.

### `SetRevertable(revertable)`
*   **Description:** Controls whether the revert button is selectable via UI navigation.
*   **Parameters:** `revertable` (boolean) — `true` = allow selection, `false` = disable selection.
*   **Returns:** Nothing.

### `SetPresetEditable(editable)`
*   **Description:** Controls whether the edit preset button is selectable via UI navigation.
*   **Parameters:** `editable` (boolean) — `true` = allow selection, `false` = disable selection.
*   **Returns:** Nothing.

### `Refresh()`
*   **Description:** Updates visibility of the change preset mode button based on whether the current shard is new (calls `IsNewShard()` on parent).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoFocusHookups()`
*   **Description:** Configures directional navigation (focus flow) between buttons using `SetFocusChangeDir()` and `ClearFocusDirs()`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.  
(Widget itself does not fire events; navigation and actions are handled via callbacks to `parent_widget`.)