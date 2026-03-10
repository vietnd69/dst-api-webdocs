---
id: genericwaitingpopup
title: Genericwaitingpopup
description: Displays a generic waiting indicator with a progressively animated progress ellipsis and optional cancel functionality.
tags: [ui, popup, animation]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 62229809
system_scope: ui
---

# Genericwaitingpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`GenericWaitingPopup` is a UI screen component that presents a simple animated waiting dialog to the user. It displays a customizable title and a dynamically growing ellipsis (".", "..", ..., up to six dots) to indicate ongoing activity. It optionally supports an "OK" or "Cancel" button and responds to controller keyboard/input events for cancellation. The screen is built using Redux UI templates and inherits from the base `Screen` class.

## Usage example
```lua
local GenericWaitingPopup = require "screens/redux/genericwaitingpopup"

local popup = GenericWaitingPopup(
    "loadingpopup",
    STRINGS.UI.LOADING.TITLE,
    { { text = "Retry", cb = function() print("Retry") end } },
    false, -- allow cancel
    function() print("Cancelled") end
)

TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `forbid_cancel` | boolean | `false` | If `true`, disables the cancel button and input handling. |
| `cancel_cb` | function or `nil` | `nil` | Callback function executed when the user cancels. |
| `buttons` | table | `{}` | List of button definitions added to the popup. |
| `dialog` | widget (CurlyWindow) | `nil` | Root dialog widget containing title and body. |
| `default_focus` | widget | `dialog` | Widget set as the default focus target. |
| `time` | number | `0` | Accumulated time (in seconds) since last ellipsis update. |
| `progress` | number | `0` | Current ellipsis length (1–6), cycling repeatedly. |

## Main functions
### `OnUpdate(dt)`
* **Description:** Updates the ellipsis animation. Increments the ellipsis length every 0.75 seconds, cycling from 1 to 6 dots and repeating. Updates the body text of the dialog with the current ellipsis.
* **Parameters:** `dt` (number) — delta time in seconds since the last frame.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input controls. Delegates to the parent `Screen` implementation, then checks for the `CONTROL_CANCEL` input to trigger cancellation if not forbidden.
* **Parameters:**  
  * `control` (enum) — the control key pressed (e.g., `CONTROL_CANCEL`).  
  * `down` (boolean) — `true` when the control is pressed, `false` when released.
* **Returns:** `true` if the event was handled by this component or parent; `false` otherwise.

### `OnCancel()`
* **Description:** Executes the user-defined cancel callback (if provided), disables the screen, and removes it from the front-end stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Alias for `OnCancel()`. Invokes cancel behavior to close the popup.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns localized help text for input controls. Only includes cancel help if `forbid_cancel` is `false`.
* **Parameters:** None.
* **Returns:** `string` — localized help text for the current input mode.

## Events & listeners
None identified.