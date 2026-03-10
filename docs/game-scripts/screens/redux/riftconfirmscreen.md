---
id: riftconfirmscreen
title: RiftConfirmScreen
description: A UI screen that displays a confirmation dialog for rift-related actions, extending PopupDialogScreen with custom controller input handling to prevent accidental cancellation.
tags: [ui, dialog, input]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: c2ef4bd8
system_scope: ui
---

# RiftConfirmScreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`RiftConfirmScreen` is a UI screen subclass of `PopupDialogScreen` used to present confirmation dialogs for rift-specific actions (e.g., entering or closing rifts). It inherits standard popup dialog behavior but implements custom controller input handling to avoid unintended dialog cancellation—specifically when the B button is held during dialog initialization. It manages an `OnControl` event callback (`oncontrol_fn`) and tracks control states to ensure inputs are only processed after an initial debounce period.

## Usage example
```lua
local RiftConfirmScreen = require("screens/redux/riftconfirmscreen")

-- Create and show the confirmation screen
local screen = RiftConfirmScreen(
    "Confirm Rift Entry",
    "Are you sure you want to enter the rift? This action cannot be undone.",
    {
        { text = "Yes", action = "ACCEPT" },
        { text = "No", action = "CANCEL" }
    }
)
screen.oncontrol_fn = function(control, down)
    if control == "ACCEPT" then
        -- Proceed with rift entry
    elseif control == "CANCEL" then
        -- Discard action
    end
end
PushScreen(screen)
```

## Dependencies & tags
**Components used:** None (uses `PopupDialogScreen`, a UI screen class).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `controldown` | table | `{}` | Tracks currently pressed controls (by name) during the debounce window. |
| `tick0` | number | `GetStaticTick()` | Initial tick timestamp used to enforce a 1-tick debounce for controller presses. |
| `oncontrol_fn` | function | `nil` | Callback invoked on confirmed control releases (set externally by caller). |

## Main functions
### `OnControl(control, down)`
* **Description:** Handles controller input, including debouncing held inputs to prevent instant cancellation (e.g., pressing B while opening the dialog). Delegates confirmed inputs to `oncontrol_fn`.
* **Parameters:**  
  `control` (string) — The control name (e.g., `"ACCEPT"`, `"CANCEL"`).  
  `down` (boolean) — `true` if the control is being pressed, `false` if released.
* **Returns:**  
  - `true` if the input was fully consumed (cancelled propagation).  
  - `false` if input should continue processing (e.g., for base class handling).
* **Error states:**  
  - If `down` is `true` and the tick delta from `tick0` is ≤ 1, the input is not yet tracked.  
  - If `down` is `false` but the control was not previously tracked, the release is ignored.

## Events & listeners
- **Pushes:** Not applicable (does not fire custom events).  
- **Listens to:** Delegates to `PopupDialogScreen` base handlers and triggers `oncontrol_fn` on confirmed control releases (caller-defined callback).