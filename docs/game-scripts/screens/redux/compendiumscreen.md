---
id: compendiumscreen
title: Compendiumscreen
description: Manages the UI and navigation for the in-game compendium, which displays various reference panels such as history, character details, cookbook, and more.
tags: [ui, navigation, reference]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: abad06c8
system_scope: ui
---

# Compendiumscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CompendiumScreen` is a UI screen component that serves as the main interface for the compendium feature. It provides navigation between multiple reference panels—including history of travels, character details, cookbook, plant registry, obituaries, encounters, and cinematics—via a top-level menu. It extends `Screen`, uses a `Subscreener` for panel switching, and manages focus and state (active/inactive) for the UI.

## Usage example
```lua
local prev_screen = TheFrontEnd:GetCurrentScreen()
local compendium = CompendiumScreen(prev_screen)
TheFrontEnd:AddScreen(compendium)
```

## Dependencies & tags
**Components used:** None (this is a screen, not an entity component)
**Tags:** Adds `UI`, `compendium`, and `compendiumscreen` tags to `self.inst` via the parent `Screen` class (inferred from DST conventions).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | `nil` | Root widget container for screen layout |
| `bg` | Widget | `nil` | Background widget |
| `title` | Text | `nil` | Screen title display |
| `onlinestatus` | OnlineStatus | `nil` | Online status indicator widget |
| `kit_puppet` | KitcoonPuppet | `nil` | Animated mascot puppet (Kitcoon) |
| `cancel_button` | ImageButton | `nil` | Back/cancel button widget |
| `panel_root` | Widget | `nil` | Container for active panel widgets |
| `characterdetails` | CharacterDetailsPanel | `nil` | Reference to the currently active character details panel |
| `subscreener` | Subscreener | `nil` | Menu navigation and panel switching controller |
| `selected_tab` | string | `nil` | Identifier of the currently selected panel tab |
| `default_focus` | Widget | `nil` | Widget that receives initial input focus |

## Main functions
### `CompendiumScreen._ctor(self, prev_screen)`
*   **Description:** Constructor. Initializes the screen layout, loads background, title, online status, and panel widgets; builds the tab menu and activates the first tab (history of travels).
*   **Parameters:** `prev_screen` (Screen or nil) — the screen to return to on close.
*   **Returns:** Nothing.
*   **Error states:** No known error conditions.

### `_BuildMenu(subscreener)`
*   **Description:** Builds and returns the navigation menu widget with buttons for each panel tab. Adds tooltips and registers button callbacks with the subscreener.
*   **Parameters:** `subscreener` (Subscreener) — the subscreener instance managing panel switching.
*   **Returns:** Menu widget — the constructed menu container.
*   **Error states:** Returns `nil` if any widget creation fails (rare).

### `OnControl(control, down)`
*   **Description:** Handles input events. Specifically processes `CONTROL_CANCEL` to close the screen.
*   **Parameters:**  
    `control` (number) — the input control identifier (e.g., `CONTROL_CANCEL`).  
    `down` (boolean) — `true` if the button is pressed down; only actions on release.
*   **Returns:** `true` if the control was handled; `false` otherwise.

### `Close(fn)`
*   **Description:** Closes the screen and fades back to the previous screen. Calls `TheFrontEnd:FadeBack` with optional completion callback.
*   **Parameters:** `fn` (function or nil) — optional callback to execute after fade completes.
*   **Returns:** Nothing.

### `OnBecomeActive()`
*   **Description:** Called when the screen becomes active (e.g., after being added to the front-end). Refreshes the character details panel and enables the Kitcoon puppet.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeInactive()`
*   **Description:** Called when the screen becomes inactive (e.g., before closing or losing focus). Disables the Kitcoon puppet.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns localized help text for current input method (keyboard/controller), indicating how to open the help menu or go back.
*   **Parameters:** None.
*   **Returns:** string — concatenated help text string (e.g., `"Back (B)"` or `"Back (Esc)"`).

## Events & listeners
None identified.