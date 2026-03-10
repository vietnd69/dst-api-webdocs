---
id: characterbioscreen
title: Characterbioscreen
description: Renders the character biography screen UI with bio details, character puppet, and navigation controls for back, wardrobe, and video actions.
tags: [ui, screen, character]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: cb341e49
system_scope: ui
---

# Characterbioscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CharacterBioScreen` is a UI screen component that displays detailed character biography information, including static bio visuals, a character puppet (KitcoonPuppet), and inline navigation buttons. It extends `Screen` and is used exclusively for client-side UI presentation—no server-side logic or entity data interaction occurs.

## Usage example
```lua
local CharacterBioScreen = require "screens/redux/characterbioscreen"
TheFrontEnd:FadeToScreen(nil, function()
    return CharacterBioScreen("walton")
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `characterbio` via `CharacterBio` widget (internal to `CharacterBio`), and uses `online` via `OnlineStatus`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `character` | string | — | Character name used to instantiate `CharacterBio` and fetch video URLs. |
| `root` | Widget | — | Root container widget for the screen's layout hierarchy. |
| `bio` | CharacterBio | — | Child widget displaying character biography details. |
| `bg` | Widget | — | Background element added behind `bio`. |
| `kit_puppet` | KitcoonPuppet | — | Animated puppet representation of the character. |
| `onlinestatus` | OnlineStatus | — | Widget displaying online status indicators. |
| `cancel_button` | Button | — | Back button that closes the screen. |
| `video_button` | Button | `nil` | Optional button to open character video URL (only if Steam and `CHARACTER_VIDEOS` exist). |
| `wardrobe_button` | Button | `nil` | Button to open the wardrobe/skin selection screen. |
| `focus_forward` | Widget | `bio` | First focusable widget for input navigation. |

## Main functions
### `CharacterBioScreen(character)`
*   **Description:** Constructor. Initializes the screen layout, character bio, background, puppet, status indicator, and navigation buttons.
*   **Parameters:** `character` (string) — the character prefab name (e.g., `"walton"`).
*   **Returns:** Nothing.

### `OnWardrobe()`
*   **Description:** Navigates to the `WardrobeScreen` for the current character using screen fade transition.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input controls—back, video (Steam only, controller), and wardrobe (keyboard/mouse). Delegates to parent `Screen` first.
*   **Parameters:**
    *   `control` (number) — `CONTROL_` constant (e.g., `CONTROL_CANCEL`, `CONTROL_MENU_START`, `CONTROL_MENU_MISC_1`).
    *   `down` (boolean) — whether the control is pressed (`true`) or released (`false`).
*   **Returns:** `true` if the control was handled; `false` otherwise.

### `GetHelpText()`
*   **Description:** Returns formatted help text showing keybinds for current control scheme (keyboard or controller).
*   **Parameters:** None.
*   **Returns:** `string` — concatenated help text with control labels and descriptions.

### `OnBecomeActive()`
*   **Description:** Activated when the screen becomes topmost. Enables the character puppet animation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeInactive()`
*   **Description:** Invoked when the screen is no longer active. Disables the character puppet animation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Close(fn)`
*   **Description:** Closes the screen using `TheFrontEnd:FadeBack()` and calls optional callback.
*   **Parameters:** `fn` (function, optional) — callback invoked after fade completes.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified