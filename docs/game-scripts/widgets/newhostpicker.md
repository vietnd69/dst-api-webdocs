---
id: newhostpicker
title: Newhostpicker
description: A UI widget for selecting server host behavior (ALONE or TOGETHER mode) in the server creation screen.
tags: [ui, server, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: cac3f893
system_scope: ui
---

# Newhostpicker

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Newhostpicker` is a UI widget responsible for rendering and managing the selection interface for the server host mode option ("Alone" vs "Together") in the server creation screen. It presents two visually distinct buttons, each representing a host behavior mode, and handles user interaction including focus navigation, click responses, and dynamic description updates.

## Usage example
```lua
local newhostpicker = TheUIScreen:AddChild(NewHostPicker())
newhostpicker:SetCallback(function(mode)
    print("Selected mode:", mode) -- e.g., "ALONE" or "TOGETHER"
end)
newhostpicker:SetFocus(MOVE_RIGHT)
```

## Dependencies & tags
**Components used:** None (pure UI widget, no entity components used).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buttons` | table | `{}` | Array of `ImageButton` widgets for host mode selection. |
| `headertext` | Text | `nil` | Header text widget displaying the title. |
| `description` | Text | `nil` | Description text widget, updated on button focus. |
| `cb` | function | `nil` | Callback function invoked on button click; set via `SetCallback()`. |
| `next_focus` | ImageButton | `nil` | Temporary storage for focus setting (used after `SetSelected()`). |

## Main functions
### `SetCallback(cb)`
*   **Description:** Sets the callback function to invoke when a host mode button is clicked.
*   **Parameters:** `cb` (function) - Function that receives one argument: the selected mode string (`"ALONE"` or `"TOGETHER"`).
*   **Returns:** Nothing.

### `SetSelected(intention)`
*   **Description:** Attempts to set focus to the button corresponding to the given `intention` (e.g., `"ALONE"`), preparing it to receive focus on next navigation.
*   **Parameters:** `intention` (string) - The mode data value to match against options (`"ALONE"` or `"TOGETHER"`).
*   **Returns:** Nothing.
*   **Error states:** No effect if `intention` does not match any option.

### `SetFocus(direction)`
*   **Description:** Directly sets keyboard/gamepad focus to the appropriate button. Prioritizes `next_focus` if set via `SetSelected()`, otherwise defaults to first or last button based on `direction`.
*   **Parameters:** `direction` (number) - Direction constant (`MOVE_LEFT` or other); determines initial focus when `next_focus` is `nil`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no events registered via `inst:ListenForEvent()`).
- **Pushes:** None (no events fired via `inst:PushEvent()`).