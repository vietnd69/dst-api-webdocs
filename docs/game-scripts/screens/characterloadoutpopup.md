---
id: characterloadoutpopup
title: Characterloadoutpopup
description: Manages the UI popup screen for loading, previewing, and confirming character loadouts in the wardrobe/dress-up interface.
tags: [ui, character, loadout]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 4530411b
system_scope: ui
---

# Characterloadoutpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CharacterLoadoutPopupScreen` is a UI screen component responsible for presenting the character loadout (wardrobe) interface. It displays the selected character’s portrait, a `DressupPanel` for outfit customization, and a set of action buttons (Cancel, Reset, Set). It handles focus navigation, input (including gamepad scrolling), and coordinates saving or discarding changes before closing.

## Usage example
```lua
local profile = ThePlayer and ThePlayer.components.playerdata and ThePlayer.components.playerdata.profile
local screen = CharacterLoadoutPopupScreen(profile, "windego")
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `ROOT`, `IMAGE` (via `self.black`, `self.heroportrait`), and uses internal widget containers (`proot`, `dressup`, `menu`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | (passed in) | Player profile used to persist/load character loadout data. |
| `black` | Image | — | Full-screen dark overlay (tinted black at `.75` opacity). |
| `proot` | Widget | — | Root container widget for screen content. |
| `heroportrait` | Image | — | Displays the current character's portrait image. |
| `dressup` | DressupPanel | — | Widget for outfit customization and skin selection. |
| `menu` | Menu | — | Horizontal menu with Cancel, Reset, and Set buttons. |
| `default_focus` | Widget | `self.menu` | The widget that receives initial input focus. |

## Main functions
### `Cancel()`
* **Description:** Resets current dressup changes to the last saved state and closes the popup.
* **Parameters:** None.
* **Returns:** Nothing.

### `Reset()`
* **Description:** Reverts the `DressupPanel` to its original outfit configuration and refreshes the portrait.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Commits and saves the current skin choices via `DressupPanel:GetSkinsForGameStart()`, calls `OnClose()` on the panel, and removes the screen from the frontend stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetPortrait()`
* **Description:** Updates the `heroportrait` image based on the currently selected character and base skin. Falls back to legacy paths for modded characters.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns localized help text indicating the cancel control (e.g., `ESC` or `B` on gamepad).
* **Parameters:** None.
* **Returns:** `string` — localized help string.

### `OnControl(control, down)`
* **Description:** Handles keyboard/gamepad input for screen navigation. Responds to `CONTROL_CANCEL`, `CONTROL_PREVVALUE`, `CONTROL_NEXTVALUE`, `CONTROL_SCROLLBACK`, and `CONTROL_SCROLLFWD`.
* **Parameters:**  
  - `control` (string) — the control being triggered.  
  - `down` (boolean) — whether the control is pressed (`true`) or released (`false`).  
* **Returns:** `boolean` — `true` if the event was handled, `false` otherwise.

## Events & listeners
- **Pushes:** None identified  
- **Listens to:**  
  - `_onfocuschange` (inherited, via focus hookups)  
  - Control events via `OnControl` (e.g., `CONTROL_CANCEL`, `CONTROL_SCROLLBACK`)  
  - Screen lifecycle events (`OnBecomeActive`, `OnDestroy`, `OnControl`)  
  (Note: Explicit `ListenForEvent` calls are not present; event handling occurs via overridden callbacks and focus navigation.)