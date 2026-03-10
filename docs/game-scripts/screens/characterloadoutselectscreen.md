---
id: characterloadoutselectscreen
title: Characterloadoutselectscreen
description: Provides the UI screen for selecting a character before entering a character loadout customization session.
tags: [ui, character, selection, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 455d188c
system_scope: ui
---

# Characterloadoutselectscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CharacterLoadoutSelectScreen` is a UI screen component that presents a character selection interface prior to entering the character loadout popup. It overlays a darkened background and presents a scrollable list of characters using the `CharacterSelect` widget, alongside a contextual menu with navigation and selection options. This screen is part of the front-end flow for character customization and works with `CharacterLoadoutPopupScreen` to prepare profile-specific loadouts.

## Usage example
```lua
-- Typically instantiated and pushed by the frontend during character setup
TheFrontEnd:PushScreen(CharacterLoadoutSelectScreen(profile))
-- User selects a character and presses SELECT to open loadout popup
```

## Dependencies & tags
**Components used:** None (UI-only, no components attached to `self.inst`)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | Image | `nil` | Full-screen dark overlay with 75% opacity. |
| `proot` | Widget | `nil` | Root widget container for proportional scaling. |
| `root` | Widget | `nil` | Absolute-position root widget, offset to screen origin. |
| `panel` | Widget | `nil` | Curly-window styled container for UI elements. |
| `panel_bg` | Image | `nil` | Decorative panel background image. |
| `character_list` | CharacterSelect | `nil` | Character selection widget instance. |
| `title` | Text | `nil` | Title text display ("PICK"). |
| `menu` | Menu | `nil` | Action menu containing BACK and SELECT buttons. |
| `default_focus` | Widget | `self.menu` | Default input focus target. |
| `repeat_time` | number | `0` | Scroll cooldown timer for `character_list`. |
| `no_cancel` | boolean | `false` | Flag controlling whether CANCEL control is accepted. |

## Main functions
### `CharacterLoadoutSelectScreen:OnBecomeActive()`
* **Description:** Called when the screen becomes active. Ensures the screen is shown.
* **Parameters:** None.
* **Returns:** Nothing.

### `CharacterLoadoutSelectScreen:Close()`
* **Description:** Closes this screen by popping it from the front-end stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `CharacterLoadoutSelectScreen:OnControl(control, down)`
* **Description:** Handles user input controls including scrolling (mouse/keyboard/stick), selection, and cancellation.
* **Parameters:** `control` (control constant) — the input control being triggered; `down` (boolean) — whether the control is pressed (`true`) or released (`false`).
* **Returns:** `true` if the control was handled; `false` otherwise.

### `CharacterLoadoutSelectScreen:ScrollBack(control)`
* **Description:** Scrolls the character list backward (to previous character), playing a UI sound and setting a repeat timer to prevent rapid repeated scrolling on held input.
* **Parameters:** `control` (control constant) — used to determine the appropriate repeat delay.
* **Returns:** Nothing.

### `CharacterLoadoutSelectScreen:ScrollFwd(control)`
* **Description:** Scrolls the character list forward (to next character), playing a UI sound and setting a repeat timer.
* **Parameters:** `control` (control constant) — used to determine the appropriate repeat delay.
* **Returns:** Nothing.

### `CharacterLoadoutSelectScreen:GetHelpText()`
* **Description:** Generates localized help text describing available controls (BACK and character change).
* **Parameters:** None.
* **Returns:** `string` — concatenated help message, e.g., `"X / Y Change Character"`.

## Events & listeners
- **Listens to:** `nil` — this component does not register event listeners via `inst:ListenForEvent`.
- **Pushes:** `nil` — this component does not fire custom events via `inst:PushEvent`.