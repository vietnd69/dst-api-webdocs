---
id: intentionpicker
title: Intentionpicker
description: Displays a horizontal picker of server intention options (Social, Cooperative, Competitive, Madness) with description text and callback support.
tags: [ui, selection, server]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 9d7b1358
system_scope: ui
---

# Intentionpicker

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`IntentionPicker` is a UI widget that presents a horizontal row of buttons representing server intention options (Social, Cooperative, Competitive, Madness), each associated with a configurable description string. It supports keyboard navigation (left/right arrow keys), focus management, and optional "ANY" selection. The widget is designed for use in server browser or settings UIs where players configure their intended gameplay style.

## Usage example
```lua
local IntentionPicker = require "widgets/redux/intentionpicker"

local picker = IntentionPicker(
    STRINGS.UI.INTENTION.TITLE,
    {
        SOCIAL = STRINGS.UI.INTENTION.SOCIAL_DESC,
        COOPERATIVE = STRINGS.UI.INTENTION.COOP_DESC,
        COMPETITIVE = STRINGS.UI.INTENTION.COMPETITIVE_DESC,
        MADNESS = STRINGS.UI.INTENTION.MADNESS_DESC,
        ANY = STRINGS.UI.INTENTION.ANY_DESC,
    },
    true -- allow ANY option
)

picker:SetCallback(function(intention)
    print("Selected intention:", intention)
end)

picker:SetFocus(MOVE_RIGHT)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buttons` | table of ImageButton | `{}` | Array of intention option buttons. |
| `anybutton` | ImageButton | `nil` | Optional "ANY" button (present only if `allowany` is true). |
| `headertext` | Text | `nil` | Title text widget. |
| `description` | Text | `nil` | Description text widget that updates on button focus. |
| `cb` | function | `nil` | Callback function set via `:SetCallback()`. |
| `next_focus` | ImageButton | `nil` | Temporary focus target used by `:SetSelected()`. |

## Main functions
### `SetCallback(cb)`
*   **Description:** Registers a callback function to be invoked when any button is clicked.
*   **Parameters:** `cb` (function) - function to call with the selected intention value as its argument.
*   **Returns:** Nothing.

### `SetSelected(intention)`
*   **Description:** Sets the focus to the button matching the given intention value.
*   **Parameters:** `intention` (string) - one of `INTENTIONS.*` constants (e.g., `"SOCIAL"`, `"COMPETITIVE"`).
*   **Returns:** Nothing.
*   **Error states:** If no matching button is found, no focus change occurs.

### `SetFocus(direction)`
*   **Description:** Sets initial focus to a button based on direction, unless `next_focus` is already set (e.g., after `SetSelected`).
*   **Parameters:** `direction` (number) - `MOVE_LEFT` or `MOVE_RIGHT`; ignored if `next_focus` is non-`nil`.
*   **Returns:** Nothing.
*   **Error states:** No-op if the button array is empty.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified