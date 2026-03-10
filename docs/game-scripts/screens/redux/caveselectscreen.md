---
id: caveselectscreen
title: Caveselectscreen
description: A UI screen that allows players to select whether caves are enabled for a new server, and transitions to the server creation screen with the chosen setting.
tags: [ui, server, menu, selection]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: c521ada2
system_scope: ui
---

# Caveselectscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CaveSelectScreen` is a UI screen that presents the player with two options for caves: enabled (`caves`) or disabled (`nocaves`). It displays descriptive text, a visual indicator (icon and label), and stores the user’s selection to configure the secondary world level in the `ServerCreationScreen`. It integrates with `Profile` for persisting remembered choices and uses `KitcoonPuppet` for visual feedback.

## Usage example
This screen is constructed and shown internally by the game's frontend and is not typically instantiated directly by mods. However, a typical flow would be:

```lua
-- This screen is launched via TheFrontEnd when hosting a new game and a playstyle choice is required.
TheFrontEnd:PushScreen(CaveSelectScreen(prev_screen, slot_index, preset, parent_screen))
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X` — this is a pure UI screen.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parent_screen` | Screen | `nil` | The screen to return to after selection. |
| `slot_index` | number | `nil` | Server slot index for the new server. |
| `preset` | table | `nil` | The world preset table to apply. |
| `kit_puppet` | Widget (KitcoonPuppet) | Created in constructor | Visual puppet used for decoration/anxiety relief. |
| `style_grid` | Widget | Created in constructor | Container for the selection buttons. |
| `default_playstyle` | ImageButton | Created in constructor | The first cave option button, used as default focus. |
| `selected` | ImageButton | `nil` | Currently selected button. |
| `remember` | LabelCheckbox | Created in constructor | Checkbox to remember the user’s choice. |
| `description` | Text | Created in constructor | UI element that displays the currently selected option’s description. |

## Main functions
### `MakeStyleButton(playstyle_id)`
* **Description:** Creates a clickable button widget for a specific cave option (`"caves"` or `"nocaves"`), including its label, icon, and click behavior. The click handler launches `ServerCreationScreen` with the selected caves setting.
* **Parameters:** `playstyle_id` (string) — one of `"caves"` or `"nocaves"`.
* **Returns:** `w` (Widget) — the full button widget with nested `button` and `settings_desc` fields.
* **Error states:** If `playstyle_id` is invalid, uses an empty `cave_def` (results in blank title/description and missing icon).

### `MakeStyleGrid()`
* **Description:** Builds and arranges the grid of cave option buttons (`MakeStyleButton`) with proper focus handling and default selection logic.
* **Parameters:** None.
* **Returns:** `root` (Widget) — the container widget holding the grid and focus infrastructure.
* **Error states:** None identified.

### `UpdateStyleInfo(w)`
* **Description:** Updates the `description` text field to show the selected option’s descriptive text.
* **Parameters:** `w` (Widget) — the button widget whose `settings_desc` field is used.
* **Returns:** Nothing.
* **Error states:** No-op if `w` or `w.settings_desc` is `nil`.

### `Close()`
* **Description:** Handles screen dismissal with fade-out, popping the current screen, and re-fading the parent.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Called when the screen becomes active. Enables the `kit_puppet` animation and calls the base class method.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeInactive()`
* **Description:** Called when the screen becomes inactive. Disables the `kit_puppet` animation and calls the base class method.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input controls (e.g., `CONTROL_CANCEL` to close the screen). Delegates to base class if the control is not handled.
* **Parameters:**  
  `control` (number) — the control constant (e.g., `CONTROL_CANCEL`).  
  `down` (boolean) — `true` if the control was pressed; only `false` actions are handled for cancel.  
* **Returns:** `true` if the event was handled; otherwise `false`.

### `GetHelpText()`
* **Description:** Returns localized help text indicating the back/cancel control.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"B (Back)"`.

## Events & listeners
- **Listens to:** None directly via `inst:ListenForEvent`.
- **Pushes:** None via `inst:PushEvent`.  
(Note: The `ServerCreationScreen` is launched via `TheFrontEnd:FadeToScreen`, which manages its own lifecycle.)