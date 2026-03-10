---
id: namepresetscreen
title: NamePresetScreen
description: Manages the UI dialog for creating or editing custom preset names and descriptions in the World Customization menu.
tags: [ui, customization, input]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 3a1eddbe
system_scope: ui
---

# NamePresetScreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`NamePresetScreen` is a UI screen subclass used to collect and validate user input for naming and describing custom presets (e.g., world generation presets). It presents two text fields—`name` and `description`—with built-in validation, length limits, character filtering, and navigation hooks. Upon confirmation, it notifies the calling code via a provided callback function. This screen integrates with `TheFrontEnd` to manage modal popups and with `CustomPresetManager` for preset ID generation and collision detection.

## Usage example
```lua
TheFrontEnd:PushScreen(
    NamePresetScreen(
        "forest",                     -- category
        STRINGS.UI.CUSTOMIZATIONSCREEN.EDIT_PRESET_TITLE,
        STRINGS.UI.CUSTOMIZATIONSCREEN.SAVE,
        function(id, name, desc)
            -- Handle save logic (e.g., CustomPresetManager:SetPreset(id, name, desc))
        end,
        existing_preset_id,            -- editingpresetid (nil for new)
        existing_name,                 -- initial name
        existing_desc                  -- initial description
    )
)
```

## Dependencies & tags
**Components used:** None (this is a screen subclass, not an ECS component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `levelcategory` | string | *(from constructor)* | The world category (e.g., `"forest"`, `"caves"`) used for preset scoping. |
| `onconfirmfn` | function | *(required by constructor)* | Callback invoked on successful save with signature `(id, name, desc)`. |
| `editingpresetid` | string or nil | `nil` | The ID of the preset being edited (used to allow overwriting self). |
| `preset_name` | LabelTextbox | *(initialized in constructor)* | Text input field for the preset name. |
| `preset_desc` | LabelTextbox | *(initialized in constructor)* | Text input field for the preset description. |
| `window` | Widget | *(initialized in constructor)* | Main window container hosting UI elements. |
| `root` | Widget | *(initialized in constructor)* | Root container widget for the screen. |
| `bg` | Widget | *(initialized in constructor)* | Background tint overlay. |
| `default_focus` | Widget | `self.preset_name` | Widget to receive focus on screen open. |

## Main functions
### `SavePreset()`
* **Description:** Validates the input fields, checks for name collisions, and closes the screen after calling `onconfirmfn` with the ID, name, and description.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Displays a `PopupDialogScreen` if the name is empty or if a preset with the same ID already exists for the category (unless it's the same preset being edited).

### `Close()`
* **Description:** Closes the screen by popping it from `TheFrontEnd`'s screen stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetID(name)`
* **Description:** Generates a canonical preset ID from the user-provided name by uppercasing it and prepending `"CUSTOM_"`.
* **Parameters:** `name` (string) — the user-supplied preset name.
* **Returns:** string — the normalized ID (e.g., `"CUSTOM_WINTER_WONDERLAND"`).
* **Error states:** None.

### `DoFocusHookups()`
* **Description:** Configures keyboard/controller focus navigation between the name field, description field, and window (e.g., tabbing or D-Pad movement).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input events. Specifically, cancels the screen on `CONTROL_CANCEL` when the key/button is released (not pressed).
* **Parameters:** `control` (number) — the control code; `down` (boolean) — `true` if key/button is pressed, `false` if released.
* **Returns:** boolean — `true` if the event was handled, `false` otherwise.

### `GetHelpText()`
* **Description:** Returns localized help text describing the cancel control (e.g., “Escape – Cancel”).
* **Parameters:** None.
* **Returns:** string — formatted help text.

## Events & listeners
None.