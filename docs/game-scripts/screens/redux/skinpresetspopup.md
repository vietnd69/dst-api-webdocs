---
id: skinpresetspopup
title: SkinPresetsPopup
description: Displays a scrolling list of skin presets for a specific character, allowing users to load or save custom skin configurations.
tags: [ui, skins, profile]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 11ddabed
system_scope: ui
---

# SkinPresetsPopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`SkinPresetsPopup` is a UI screen that presents a scrollable list of skin presets for a given character, enabling the user to load a saved preset (applying its skin choices) or save the current `selected_skins` to a preset slot. It integrates with `user_profile` to read/write preset data and returns via a callback (`apply_cb`) when a preset is loaded. The screen uses Redux-style templates for consistent layout and controller navigation support.

## Usage example
```lua
local SkinPresetsPopup = require "screens/redux/skinpresetspopup"
local popup = SkinPresetsPopup(user_profile, character, selected_skins, function(preset)
    -- apply the loaded preset to the player
    ApplySkinsFromPreset(preset)
end)
TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `user_profile` | table | — | The user profile instance used to get/set skin presets. |
| `character` | string | — | The character ID for which presets are managed. |
| `selected_skins` | table | — | The current skin configuration to save when saving a preset. |
| `apply_cb` | function | — | Callback invoked when loading a preset; receives the preset table as argument. |
| `list_items` | table of tables | `{}` | Array of preset data objects (one per slot), fetched from `user_profile:GetSkinPresetForCharacter`. |
| `dialog` | CurlyWindow | — | The main popup container with title and controls. |
| `scroll_list` | ScrollingGrid | — | Grid widget displaying each preset slot item. |

## Main functions
### `:OnControl(control, down)`
* **Description:** Handles input control events, routing them first to the base `Screen` implementation, then to the controller-specific handler.
* **Parameters:** `control` (number) — the control code; `down` (boolean) — whether the control is pressed.
* **Returns:** `true` if the control was handled, otherwise `false`.
* **Error states:** Returns early if the base `OnControl` handles the event.

### `:GetHelpText()`
* **Description:** Returns the current help text string for UI tooltips, based on controller button mappings.
* **Parameters:** None.
* **Returns:** string — the current help text.

### `:_LoadPreset(i)`
* **Description:** Loads the skin preset from slot `i` and invokes `apply_cb` with the preset data, then closes the screen.
* **Parameters:** `i` (number) — the preset slot index (`1` to `NUM_SKIN_PRESET_SLOTS`).
* **Returns:** Nothing.
* **Error states:** No explicit error handling; assumes valid index.

### `:_SetPreset(i)`
* **Description:** Saves the current `selected_skins` to preset slot `i` and closes the screen.
* **Parameters:** `i` (number) — the preset slot index (`1` to `NUM_SKIN_PRESET_SLOTS`).
* **Returns:** Nothing.
* **Error states:** No explicit error handling; assumes valid index.

### `:_Cancel()`
* **Description:** Closes the popup without saving or loading.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.