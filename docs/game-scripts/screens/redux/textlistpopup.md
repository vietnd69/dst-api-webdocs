---
id: textlistpopup
title: Textlistpopup
description: Renders a scrollable popup UI screen displaying a list of text items with optional buttons and navigation support.
tags: [ui, popup, navigation]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 10017260
system_scope: ui
---

# Textlistpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`TextListPopup` is a screen class that displays a scrollable list of text entries in a popup window. It supports optional per-item click handlers (rendered as buttons), custom title/body text, and keyboard/controller navigation. Built as a subclass of `Screen`, it integrates into DST's UI flow and handles focus management for both mouse and controller inputs.

## Usage example
```lua
local TextListPopup = require "screens/redux/textlistpopup"

local list_items = {
    { text = "Option 1", onclick = function() print("Clicked 1") end },
    { text = "Option 2", onclick = function() print("Clicked 2") end },
    { text = "No action" },
}

local popup = TextListPopup(list_items, "Title", "Description text goes here", nil, 10, false)
TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | Widget | `nil` | Background tint widget added during construction. |
| `proot` | Widget | `nil` | Main root widget for popup content. |
| `dialog` | CurlyWindow | `nil` | Container widget for title, body, and buttons. |
| `scroll_list` | ScrollingGrid | `nil` | Scrollable container for list items. |
| `buttons` | table | `{}` | List of button definitions (text, callback, controller control). |
| `oncontrol_fn` | function | `nil` | Controller input handler generated from buttons. |
| `gethelptext_fn` | function | `nil` | Function returning help text string. |

## Main functions
### `OnControl(control, down)`
*   **Description:** Handles input control events. Delegates to base screen and then to controller-specific button actions.
*   **Parameters:** `control` (string) — the control action (e.g., `CONTROL_SELECT`, `CONTROL_CANCEL`). `down` (boolean) — whether the control was pressed (`true`) or released (`false`).
*   **Returns:** `true` if the event was handled; `false` otherwise.

### `GetHelpText()`
*   **Description:** Returns help text for the current UI state, typically used for on-screen controller prompt hints.
*   **Parameters:** None.
*   **Returns:** string — the help text.

### `_Cancel()`
*   **Description:** Cancels and closes the popup by popping it from the frontend screen stack.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified