---
id: woodensignpopup
title: Woodensignpopup
description: Renders a reusable UI dialog popup with a wooden board background, supporting customizable title, body text, and bottom action buttons.
tags: [ui, screen, dialog]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 7b93c7e7
system_scope: ui
---

# Woodensignpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`WoodenSignPopup` is a UI screen class that displays a modal dialog using a wooden board texture as background. It provides structured layout for title, body text, and bottom-aligned buttons, closely resembling the in-game wooden sign aesthetic. It inherits from `Screen` and leverages Redux UI templates for consistency with the updated menu system.

## Usage example
```lua
local WoodenSignPopup = require "widgets/redux/woodensignpopup"

local popup = WoodenSignPopup(
    "Warning",                            -- title_text
    "The path ahead is unstable.",        -- body_text
    {                                      -- bottom_buttons
        { text = STRINGS.UI.CANCEL, cb = function() popup:Close() end }
    }
)

TheFrontEnd:ShowScreen(popup)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | `Image` (child of `Screen`) | `TEMPLATES.BackgroundTint()` | Full-screen background tint overlay. |
| `proot` | `Widget` (`ScreenRoot`) | `TEMPLATES.ScreenRoot()` | Root container for screen content. |
| `bg` | `Image` | `"images/tradescreen_redux.xml", "woodenboard.tex"` | Wooden board background image widget. |
| `dialog` | `Widget` | `"dialog"` container | Container for title, body, and button areas. |
| `buttons` | `table` | `bottom_buttons` (passed to constructor) | Reference to the button list passed at construction. |
| `default_focus` | `Menu` or `nil` | `self.dialog.actions` | Default UI focus target (the button menu). |

## Main functions
### `OnControl(control, down)`
*   **Description:** Handles input events, particularly responding to `CONTROL_CANCEL` (e.g., `ESC` or `B` button) to trigger the last button’s callback if present.
*   **Parameters:**  
    `control` (number) — Input control code.  
    `down` (boolean) — `true` if the button is pressed down; `false` on release.  
*   **Returns:** `true` if the event was handled, otherwise delegates to base class.

### `GetHelpText()`
*   **Description:** Returns localized help text for the primary action (e.g., "ESC Back") if applicable.
*   **Parameters:** None.  
*   **Returns:** `string` — Concatenated localized help text (e.g., `"ESC Back"`), or an empty string if no action is available.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified