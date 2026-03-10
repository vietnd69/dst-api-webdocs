---
id: popupdialog
title: PopupDialog
description: Renders a styled, interactive popup dialog screen with configurable size, theme, and buttons.
tags: [ui, dialog]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 37aafb0f
system_scope: ui
---

# PopupDialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PopupDialogScreen` is a UI screen component that creates a themed popup dialog box. It inherits from `Screen` and uses reusable layout templates (`TEMPLATES.CurlyWindow`, `TEMPLATES.BackgroundTint`, `TEMPLATES.ScreenRoot`) to render title, body text, and interactive buttons. The appearance and behavior are customizable via style (e.g., `light`, `dark`, `dark_wide`) and size preset (e.g., `small`, `medium`, `big`, `bigger`).

## Usage example
```lua
local PopupDialogScreen = require "screens/redux/popupdialog"

local dialog = PopupDialogScreen(
    "Title",
    "This is the dialog body text.",
    {
        {text="OK", fn=function() dialog:Close() end},
        {text="Cancel", fn=function() dialog:Close() end},
    },
    nil,        -- spacing_override (optional)
    "medium",   -- longness preset (optional)
    "dark"      -- style preset (optional)
)

TheFrontEnd:PushScreen(dialog)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `longness` | table | `LENGTHS["small"]` | Contains `height` value selected from `LENGTHS` based on the `longness` constructor argument. |
| `style` | table | `STYLES["dark"]` | Contains `bgconstructor` and `text` properties defining visual styling. |
| `black` | Image | — | Background tint overlay added to the screen. |
| `proot` | Widget | — | Root container widget for dialog elements. |
| `dialog` | Widget | — | Container returned by `style.bgconstructor`; holds dialog body and buttons. |
| `buttons` | array | `{}` | Array of button definitions passed to `ControllerFunctionsFromButtons`. |
| `oncontrol_fn` | function | — | Controller input handler derived from buttons. |
| `gethelptext_fn` | function | — | Function returning help text string, derived from buttons. |
| `default_focus` | Widget | `self.dialog` | Widget designated as the default focus target. |

## Main functions
### `OnControl(control, down)`
*   **Description:** Handles UI control inputs (e.g., controller/D-Pad navigation). Delegates to both parent class and button-specific handler.
*   **Parameters:**  
    `control` (string) — The control identifier (e.g., `"accept"`, `"cancel"`).  
    `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
*   **Returns:** `true` if the input was handled; `false` otherwise.

### `Close()`
*   **Description:** Removes the screen from the frontend stack, effectively closing the dialog.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns the help text string for the currently focused UI element (e.g., button descriptions).
*   **Parameters:** None.  
*   **Returns:** String — help text derived from button definitions. May be `nil` if no help text is defined.

## Events & listeners
None identified.