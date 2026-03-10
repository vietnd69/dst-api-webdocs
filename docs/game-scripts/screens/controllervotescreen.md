---
id: controllervotescreen
title: Controllervotescreen
description: Manages the controller-specific UI overlay for the vote dialog, handling input focus and integration with HUD scaling and dialog lifecycle events.
tags: [ui, controller, input, overlay]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: ab6b07e2
system_scope: ui
---

# Controllervotescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ControllerVoteScreen` is a UI screen that overlays and manages the controller-focused interaction with the vote dialog. It wraps the existing `VoteDialog` widget, positions it correctly relative to HUD controls, and integrates controller focus (via gain/loss focus callbacks) with a dynamic prompt text that displays the localized "accept" button label. The screen listens to HUD scale and vote-dialog hide events to ensure responsive UI behavior.

## Usage example
```lua
local ControllerVoteScreen = require "screens/controllervotescreen"
local vote_dialog = CreateWidget("votedialog") -- assuming standard setup
local screen = ControllerVoteScreen(vote_dialog)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `votedialog` | table | `nil` | Reference to the parent `VoteDialog` widget instance. |
| `blackoverlay` | Image widget | `nil` | Full-screen darkening overlay. |
| `root` | Widget | `nil` | Root widget for positioning the dialog relative to HUD. |
| `scale_root` | Widget | `nil` | Widget used to apply HUD scaling changes. |
| `dialogroot` | Widget | `nil` | Container widget mirroring the `VoteDialog` root position. |
| `prompt` | Text widget | `nil` | Dynamic text showing the localized controller accept button. |
| `selection` | number or `nil` | `nil` | Index of the currently focused vote button (1-based). |

## Main functions
### `ControllerVoteScreen:OnBecomeInactive()`
*   **Description:** Called when the screen loses focus. If the prompt is active, it triggers closing the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Calls `Close()` if `self.prompt` is not `nil`, potentially triggering side effects even during deactivation.

### `ControllerVoteScreen:Close()`
*   **Description:** Closes the screen, cleans up focus bindings, kills the prompt, restores the `VoteDialog` root to its owner, and notifies the `VoteDialog` of selection state before popping itself from the screen stack.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ControllerVoteScreen:OnControl(control, down)`
*   **Description:** Handles input control events. Delegates to base screen first; if the base handles it, returns `true`. Otherwise, if the cancel button is released, closes the screen.
*   **Parameters:**
    *   `control` (Control enum) – the input control pressed/released.
    *   `down` (boolean) – `true` if the control is pressed, `false` if released.
*   **Returns:** `true` if the event was handled; `false` otherwise.
*   **Error states:** Returns `true` early if the base screen handled the event or if `CONTROL_CANCEL` is released.

## Events & listeners
- **Listens to:**
  - `refreshhudsize` – updates `scale_root` when HUD scaling changes. Event data includes `scale`.
  - `hidevotedialog` – triggers `Close()` on the screen when the vote dialog should be hidden.