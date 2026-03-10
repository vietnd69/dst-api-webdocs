---
id: bigpopupdialog
title: Bigpopupdialog
description: Renders a fullscreen modal dialog with a darkened background, titled header, wrapped text content, and a horizontal menu of interactive buttons, used for non-interactive prompts or timed messages.
tags: [ui, dialog, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 3db88f66
system_scope: ui
---

# Bigpopupdialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`BigPopupDialogScreen` is a legacy UI screen component used to display a modal dialog with a large, centered window containing a title, descriptive text, and one or more buttons. It dims the entire screen behind the dialog and arranges buttons horizontally at the bottom of the dialog. As indicated by its own comment, this component is deprecated in favor of `PopupDialogScreen` with extended layout options. It extends the base `Screen` class and overrides `OnUpdate` and `OnControl` to support optional timeout-based callback execution.

## Usage example
```lua
local BigPopupDialogScreen = require "screens/bigpopupdialog"

local my_buttons = {
    Button("OK", function() print("OK pressed") end),
    Button("Cancel", function() print("Cancel pressed") end),
}

local dialog = BigPopupDialogScreen(
    "Warning",
    "This is a long message that will wrap automatically within the dialog.",
    my_buttons,
    { timeout = 10, cb = function() print("Timeout!") end }
)

-- Add to screen manager (e.g., TheFrontEnd): TheFrontEnd:AddScreen(dialog)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | `Image` | — | Fullscreen dark overlay with 75% opacity, used to dim the background. |
| `proot` | `Widget` | — | Root widget for dialog content, centered and scaled proportionally. |
| `bg` | `Widget` | — | Dialog container created via `TEMPLATES.CurlyWindow`. |
| `bg.fill` | `Image` | — | Inner panel fill for visual styling. |
| `title` | `Text` | — | Title text widget, positioned near the top. |
| `text` | `Text` | — | Main descriptive text widget with word wrapping enabled. |
| `menu` | `Menu` | — | Horizontal menu containing the dialog's buttons. |
| `buttons` | table | — | Reference to the `buttons` array passed to the constructor. |
| `default_focus` | `Menu` | `self.menu` | Default UI focus target. |
| `timeout` | table or `nil` | `nil` | Optional `{ timeout = number, cb = function }` for auto-closing the dialog. |

## Main functions
### `OnUpdate(dt)`
* **Description:** Handles frame-by-frame updates, including decrementing the remaining timeout and invoking the callback when time expires. Required for screen lifecycle.
* **Parameters:** `dt` (number) — delta time since last frame.
* **Returns:** `true` — indicates the screen should continue updating.
* **Error states:** None.

### `OnControl(control, down)`
* **Description:** Delegates input control events to the base `Screen` class and returns its result. Enables standard UI navigation within the dialog.
* **Parameters:**  
  `control` (string) — name of the control pressed (e.g., `"confirm"`, `"cancel"`).  
  `down` (boolean) — whether the control was pressed (`true`) or released (`false`).
* **Returns:** `boolean` — result of the base `OnControl` call; `true` if handled.

## Events & listeners
None identified.