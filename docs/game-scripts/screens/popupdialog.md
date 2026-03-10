---
id: popupdialog
title: Popupdialog
description: Renders a customizable popup dialog screen with title, text, and clickable buttons for UI interactions.
tags: [ui, dialog, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 95fce14f
system_scope: ui
---

# Popupdialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PopupDialogScreen` is a reusable UI screen class that displays a modal popup with a customizable title, wrapped text content, and a horizontal menu of buttons. It inherits from `Screen` and supports both light and dark visual themes via a style configuration system. The component handles layout, input routing (including keyboard/controller bindings), and screen dismissal logic. It is typically used for informational alerts, confirmations, or simple choice prompts in the game's UI.

## Usage example
```lua
local PopupDialogScreen = require "screens/popupdialog"

local buttons = {
    { text = STRINGS.UI.OK, cb = function() print("OK pressed") end },
    { text = STRINGS.UI.CANCEL, cb = function() print("Cancel pressed") end }
}

local dialog = PopupDialogScreen(
    "Warning",
    "This action cannot be undone. Are you sure you want to proceed?",
    buttons,
    nil,
    nil,
    "dark"
)

TheFrontEnd:PushScreen(dialog)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `style` | string | `"light"` | Theme identifier (`"light"` or `"dark"`) determining visual appearance. |
| `black` | ImageButton | `nil` | Full-screen transparent overlay that absorbs input to prevent background interaction. |
| `proot` | Widget | `nil` | Root widget container for all dialog elements, centered on screen. |
| `bg` | Widget | `nil` | Background element created by the style's `bgconstructor` function. |
| `title` | Text | `nil` | Title text widget. |
| `text` | Text | `nil` | Main body text widget with word wrapping enabled. |
| `menu` | Menu | `nil` | Horizontal menu of buttons. |
| `buttons` | table | `nil` | Reference to the original `buttons` table passed to constructor. |
| `default_focus` | Menu | `self.menu` | Default focus target for controller navigation. |

## Main functions
### `SetTitleTextSize(size)`
* **Description:** Adjusts the font size of the dialog's title text.
* **Parameters:** `size` (number) — new font size in pixels.
* **Returns:** Nothing.

### `SetButtonTextSize(size)`
* **Description:** Adjusts the font size of all button labels in the dialog.
* **Parameters:** `size` (number) — new font size in pixels.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input events for this screen. Overrides base screen behavior to implement custom cancel-button behavior.
* **Parameters:**  
  - `control` (string) — the control type pressed (e.g., `"CONTROL_CANCEL"`).  
  - `down` (boolean) — `true` if the control was pressed down; `false` on release.  
* **Returns:** `true` if the input was handled and should not propagate further; `false` otherwise.  
* **Error states:** When `CONTROL_CANCEL` is released and there are at least two buttons with a valid last button, triggers the callback of the last button and plays a UI click sound.

### `Close()`
* **Description:** Removes this screen from the front-end stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns localized help text indicating available controls.
* **Parameters:** None.
* **Returns:** `string` — help text describing the cancel control’s function (e.g., `"ESC Back"`), or an empty string if no help applies.
* **Error states:** Returns empty string if dialog has fewer than two buttons or no last button is defined.

## Events & listeners
Not applicable