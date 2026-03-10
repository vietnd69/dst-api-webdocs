---
id: birdinteractscreen
title: Birdinteractscreen
description: Displays a UI dialog for interacting with birds (e.g., in the Traderscreen), providing a customizable menu of actions via a curved window interface.
tags: [ui, menu, dialog]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: f8b8e225
system_scope: ui
---

# Birdinteractscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`BirdInteractScreen` is a UI screen that renders a modal dialog for bird-related interactions, such as trading or selecting a bird-related action. It extends the base `Screen` class and constructs a centered window with a darkened backdrop and a scrolling menu of buttons. The screen is designed for use in the Redux UI system and integrates with the `STRINGS.UI.TRADESCREEN` localization framework.

## Usage example
```lua
local buttons = {
    { text = "Sell", fn = OnSell },
    { text = "Inspect", fn = OnInspect },
}
local screen = BirdInteractScreen(buttons)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | `ImageButton` | — | Full-screen darkening overlay (alpha 0.75) for visual focus. |
| `proot` | `Widget` | — | Root widget container for dialog content, centered on screen. |
| `bg` | `Widget` (from `TEMPLATES.CurlyWindow`) | — | The curved-window background containing the dialog title. |
| `menu` | `Menu` | — | Scrollable menu of action buttons. |
| `default_focus` | `Widget` | `self.menu` | Widget that receives initial input focus when screen is active. |

## Main functions
### `BirdInteractScreen(buttons)`
*   **Description:** Constructor. Initializes the screen UI elements: backdrop, root container, curly-window background, and a menu of buttons.
*   **Parameters:** `buttons` (table) — List of button definitions passed to the `Menu` constructor. Each entry typically contains `text` and `fn` keys.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `OnControl(control, down)`
*   **Description:** Handles controller/button input. Delegates to parent class first; handles `CONTROL_CANCEL` (e.g., Escape or B button) to pop the screen off the front-end stack.
*   **Parameters:**  
  &nbsp;&nbsp;`control` (string) — The control action pressed.  
  &nbsp;&nbsp;`down` (boolean) — `true` if the control is pressed; `false` for release.
*   **Returns:** `true` if the control was handled; `false` otherwise.
*   **Error states:** Returns `true` immediately on successful cancellation (screen pop), preventing further propagation.

### `GetHelpText()`
*   **Description:** Returns localized help text for the screen, showing the key/action to cancel/close the dialog (e.g., "Escape BACK").
*   **Parameters:** None.
*   **Returns:** `string` — Concatenated help string with localized control name and "BACK" label from `STRINGS.UI.TRADESCREEN`.
*   **Error states:** None identified.

## Events & listeners
None identified