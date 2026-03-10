---
id: beefaloskinpresetspopup
title: BeefaloSkinPresetsPopup
description: Manages a UI popup for viewing, loading, and saving Beefalo skin presets per character.
tags: [ui, skin, character, save, load]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 611c6a40
system_scope: ui
---

# BeefaloSkinPresetsPopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`BeefaloSkinPresetsPopup` is a UI screen component that provides an interface for users to manage named presets of Beefalo cosmetic attachments (head, horns, body, feet, tail). It displays a scrollable list of preset slots, allows loading a saved preset to apply current skin choices, or saving the currently selected skins as a named preset. It extends `Screen` and integrates with user profile storage via `user_profile` and standard UI patterns (e.g., controller navigation, scrolling grids).

## Usage example
```lua
local popup = BeefaloSkinPresetsPopup(
    user_profile,
    character_prefab_name,
    selected_skins_table,
    function(preset_data)
        -- apply_cb: apply the selected preset to the character's skins
        ApplyBeefaloSkins(character_inst, preset_data)
    end
)
TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `user_profile` | table | `nil` | Reference to the user profile object (provides `GetSkinPresetForCharacter` and `SetSkinPresetForCharacter`). |
| `character` | string | `nil` | Name of the character for which presets are managed. |
| `selected_skins` | table | `nil` | Current skin choices (keys: `"beef_head"`, `"beef_horn"`, etc.). |
| `apply_cb` | function | `nil` | Callback invoked when a preset is loaded; receives the loaded preset data. |
| `list_items` | array of tables | `{}` | Array of preset slot data, indexed 1..`NUM_SKIN_PRESET_SLOTS`. |

## Main functions
### `_LoadPreset(i)`
* **Description:** Loads the skin preset stored in slot `i` and applies it to the selected character via the `apply_cb` callback, then closes the popup.
* **Parameters:** `i` (number) – 1-based index of the preset slot to load.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; assumes `self.list_items[i]` is valid.

### `_SetPreset(i)`
* **Description:** Saves the current `selected_skins` as preset `i` in the user profile, then closes the popup.
* **Parameters:** `i` (number) – 1-based index of the preset slot to save to.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; sanitizes `selected_skins` via `ValidateItemsLocal` before saving.

### `OnControl(control, down)`
* **Description:** Handles controller input (e.g., directional pad, A/B buttons). Delegates primary input to button-bound controller actions and falls back to base class handling.
* **Parameters:**  
  `control` (string) – control identifier (e.g., `"CONTROL_UP"`, `"CONTROL_CANCEL"`).  
  `down` (boolean) – true if the control was pressed, false if released.  
* **Returns:** `true` if input was handled; `false` otherwise.

### `GetHelpText()`
* **Description:** Returns the current help text for context-sensitive UI (e.g., on-screen controller hints).
* **Parameters:** None.
* **Returns:** string – help text derived from bound buttons.

### `_Cancel()`
* **Description:** Closes the popup without applying or saving any changes.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `pop` action via `TheFrontEnd:PopScreen(self)` when dialog is closed (load, save, or cancel).
- **Listens to:** None identified (controller actions handled via `oncontrol_fn` delegate).