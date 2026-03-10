---
id: kitcoonnamepopup
title: KitcoonNamePopup
description: Displays a UI popup for entering or selecting a name for a kitcoon, with OK, random name, and cancel options.
tags: [ui, naming, popup]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 561671ae
system_scope: ui
---

# KitcoonNamePopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`KitcoonNamePopup` is a UI screen component that presents a modal dialog for naming a kitcoon. It provides a text input field, a button to generate a random name, and buttons to confirm or cancel the operation. It inherits from `Screen` and integrates with the Redux template system for consistent UI styling. The popup is activated during gameplay, typically after acquiring or spawning a kitcoon, and handles text input, validation, and callback execution upon completion.

## Usage example
```lua
local KitcoonNamePopup = require "screens/kitcoonnamepopup"

TheFrontEnd:PushScreen(
    KitcoonNamePopup(
        function(name) print("Kitcoon named:", name) end,
        function() print("Naming cancelled") end
    )
)
```

## Dependencies & tags
**Components used:** None (uses UI widgets and `TheFrontEnd`, `TheInput`, `GetRandomItem`, `STRINGS`, `ANCHOR_*`, `MOVE_*`, `CONTROL_*`, `UICOLOURS`, etc.)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | `Image` | `nil` | Full-screen darkening overlay (`Image`) to dim background. |
| `root` | `Widget` | `nil` | Root container using `TEMPLATES.ScreenRoot()`. |
| `dialog` | `Menu` | `nil` | CurlyWindow dialog container for body, title, and action buttons. |
| `textbox_root` | `Widget` | `nil` | Container for the single-line text entry field. |
| `onNamed` | function | `nil` | Callback invoked when the user confirms a valid name. |
| `onCancel` | function | `nil` | Callback invoked when the user cancels. |
| `default_focus` | `Widget` | `nil` | Widget that receives initial focus (`textbox_root.textbox`). |

## Main functions
### `OnBecomeActive()`
* **Description:** Activated when the screen becomes the topmost active screen. Sets focus to the text input and enables text editing for keyboard users (not controller users, who edit manually).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input control events (e.g., controller button presses). Delegates to base class first, then handles `CONTROL_CANCEL` to trigger `OnCancel()`.
* **Parameters:** `control` (string) — control identifier (e.g., `"CANCEL"`); `down` (boolean) — whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if the event was handled; `false` otherwise.

### `OnNamed()`
* **Description:** Confirms the entered name. Disables the screen, pops itself from `TheFrontEnd`, trims whitespace from the input, and invokes the `onNamed` callback with the cleaned name.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnCancel()`
* **Description:** Cancels the operation. Disables the screen, pops itself from `TheFrontEnd`, and invokes the `onCancel` callback.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `TextInput` events on `self.textbox_root.textbox` via `OnTextInputted` and `OnTextEntered` handlers (custom callbacks, not `inst:ListenForEvent`).
- **Pushes:** None identified.