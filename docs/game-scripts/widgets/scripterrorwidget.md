---
id: scripterrorwidget
title: Scripterrorwidget
description: Displays a fullscreen error dialog with customizable title, message, optional additional text, and action buttons.
tags: [ui, error, dialog]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a4152b5e
system_scope: ui
---

# Scripterrorwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ScriptErrorWidget` renders a persistent, fullscreen error dialog used to present critical script-level errors to the player. It overlays the entire UI with a darkened background and displays structured text and optional action buttons. The widget manages global input handlers to ensure proper focus and control navigation while active, and it registers itself as the UI root for input routing.

## Usage example
```lua
local ScriptErrorWidget = require "widgets/scripterrorwidget"
local dialog = ScriptErrorWidget(
    "Script Error",
    "An unexpected error occurred during world initialization.",
    { { text = "Restart Game", fn = function() TheSim:Reset() end } },
    ANCHOR_CENTER,
    "Please check your mod configuration and try again."
)
```

## Dependencies & tags
**Components used:** `TheInput`, `TheSim`, `TheInputProxy` (global services), `Widget`, `Text`, `Image`, `AnimButton`, `Button`, `Menu`, `UIAnim`, `AnimButton`
**Tags:** Sets `is_screen = true` internally; no entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_screen` | boolean | `true` | Marks this widget as a screen for focus/hierarchy handling. |
| `black` | Image | — | Fullscreen dark overlay with 80% opacity. |
| `root` | Widget | — | Centered root container for dialog content. |
| `title` | Text | — | Large (50pt) title text positioned above content. |
| `text` | Text | — | Main body message with word wrap and configurable size. |
| `additionaltext` | Text | `nil` | Optional secondary message text block. |
| `version` | Text | — | displays `"Rev. "..APP_VERSION.." "..PLATFORM` in bottom-left corner. |
| `menu` | Menu | `nil` | Button menu (if buttons array is provided). |
| `default_focus` | Menu | `self.menu` or `nil` | Initial focus target; defaults to menu if present. |
| `timeout` | table or `nil` | `nil` | Optional `{ timeout: number, cb: function }` for auto-close logic. |
| `special_general_control` | number or `nil` | — | Input handler ID for keyboard/mouse control mapping. |
| `special_mouse_control` | number or `nil` | — | Input handler ID for mouse button events. |

## Main functions
### `GoAway()`
* **Description:** Removes the error dialog from the screen, cleans up input handlers, restores the previous UI root, and destroys the widget.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles keyboard/mouse control events (e.g., `CONTROL_ACCEPT`, `CONTROL_CANCEL`). Delegates to base class if not handled.
* **Parameters:**
  - `control` (number) — The control code (e.g., `CONTROL_PRIMARY`, `CONTROL_ACCEPT`).
  - `down` (boolean) — Whether the control was pressed (`true`) or released.
* **Returns:** `true` if the base class handled it, otherwise falls through.

### `OnUpdate(dt)`
* **Description:** Runs every frame to manage focus, timeouts, and debug key detection (e.g., `Ctrl+R`).
* **Parameters:**
  - `dt` (number) — Delta time in seconds.
* **Returns:** `true`.
* **Error states:** None; always returns `true`.

## Events & listeners
- **Listens to:** None directly — uses global `TheInput.oncontrol` and `TheInput.onmousebutton` via registered handlers.
- **Pushes:** None.