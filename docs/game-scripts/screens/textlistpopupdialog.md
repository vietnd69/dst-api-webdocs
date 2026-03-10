---
id: textlistpopupdialog
title: Textlistpopupdialog
description: Renders a scrollable popup dialog with a title, descriptive text body, and list of strings; supports keyboard and controller input with customizable buttons.
tags: [ui, popup, dialog]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 76b0acb8
system_scope: ui
---

# Textlistpopupdialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`TextListPopupDialogScreen` is a legacy UI screen class used to display a modal popup containing a title, an optional descriptive body of text (with word-wrapped scrolling support), and a list of strings rendered in a scrollable list. It also supports both keyboard (mouse-driven) and controller inputs via customizable button callbacks. This screen inherits from `Screen`, integrates standard HUD widgets (`Text`, `ScrollableList`, `ImageButton`, `Menu`), and is marked as deprecated in favor of `TextListPopup`.

## Usage example
```lua
local TextListPopupDialogScreen = require "screens/textlistpopupdialog"

local screen = TextListPopupDialogScreen(
    "Title",                 -- title text
    "Line 1, Line 2, Line 3",-- comma-separated or table of strings for the list
    "Optional body text...", -- optional body text
    {{ text = "OK", cb = function() print("OK clicked") end }}, -- optional buttons
    245,                     -- spacing between buttons (ignored if buttons=nil)
    NEWFONT                  -- font for list items
)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds no tags; operates purely as a UI screen.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | `Image` | `nil` | Full-screen darkening overlay with 75% opacity. |
| `proot` | `Widget` | `nil` | Root widget for proportional layout of dialog contents. |
| `bg` | `Widget` | `nil` | Container for the dialog background/frame. |
| `bg.fill` | `Image` | `nil` | Background fill texture. |
| `title` | `Text` | `nil` | Title text widget. |
| `listwidgets` | table of `Widget` | `{}` | List of widgets holding each list string. |
| `body` | `Text` | `nil` | Optional descriptive text (word-wrapped). |
| `scrolllist` | `ScrollableList` | `nil` | Scrollable container for `listwidgets`. |
| `menu` | `Menu` | `nil` | Button menu for non-controller (keyboard/mouse) input. |
| `button` | `ImageButton` | `nil` | Single OK button for non-controller input. |
| `buttons` | table | `nil` | List of button specs (`text`, `cb`, `controller_control`). |
| `default_focus` | `ScrollableList` | `self.scrolllist` | Focus target for input navigation. |

## Main functions
### `SetTitleTextSize(size)`
*   **Description:** Sets the font size of the title text widget.
*   **Parameters:** `size` (number) – the new font size.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input events for controller or keyboard; triggers button callbacks or closes the screen on cancel.
*   **Parameters:**
    *   `control` (string) – input control name (e.g., `"control_cancel"`, `"control_accept"`).
    *   `down` (boolean) – `true` if the key was pressed, `false` on release.
*   **Returns:** `true` if the event was handled, `false` otherwise.

### `Close()`
*   **Description:** Removes the screen from the front-end stack.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns localized help text describing the available actions (e.g., button mappings).
*   **Parameters:** None.
*   **Returns:** `string` – concatenated help string (e.g., `"B Cancel  A OK"`).

## Events & listeners
None identified.