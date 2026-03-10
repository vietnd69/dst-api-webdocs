---
id: setpopupdialog
title: SetPopupDialog
description: Displays a UI dialog showing the contents, requirements, and reward of a skin set selection menu.
tags: [ui, screen, inventory]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 10a3d9e1
system_scope: ui
---

# SetPopupDialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`SetPopupDialog` is a UI screen that presents detailed information about a skin set, including its constituent items (requirements) and the reward skin. It is used in the inventory or set selection UI to allow players to preview what is needed to unlock a set and what they receive upon completion. The component inherits from `Screen`, manages its own visual layout (background, title, item lists), and responds to user input via a menu button. It uses the `skin_set_info.lua` module to determine which items belong to the set.

## Usage example
```lua
local SetPopupDialog = require "screens/setpopupdialog"
local dialog = SetPopupDialog("beefalo_harness")
TheFrontEnd:PushScreen(dialog)
```

## Dependencies & tags
**Components used:** None (pure UI widget)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | Image | `nil` | Full-screen dark overlay (tinted black at 75% opacity) to dim background UI. |
| `proot` | Widget | `nil` | Root container widget for all dialog elements; centered on screen. |
| `bg` | Widget | `nil` | Dialog background container (curly window template). |
| `bg.fill` | Image | `nil` | Interior fill texture for the dialog background. |
| `title` | Text | `nil` | Title text element, displaying `STRINGS.SET_NAMES[set_item_type]`. |
| `info_txt` | Text | `nil` | Multi-line descriptive text (word-wrapped) showing `STRINGS.SET_DESCRIPTIONS[set_item_type]`. |
| `input_item_imagetext` | table | `{}` | Array of `ItemImageText` widgets for each required item in the set. |
| `reward` | Widget | `nil` | `ItemImageText` widget representing the reward skin. |
| `reward_txt` | Text | `nil` | Label text displaying `STRINGS.UI.SETPOPUP.REWARD`. |
| `menu` | Menu | `nil` | OK button menu for closing the dialog. |
| `buttons` | table | `{}` | Raw button data used to construct the menu. |
| `horizontal_line`, `reward_horizontal_line` | Image | `nil` | Decorative horizontal separator lines. |

## Main functions
### `Close()`
* **Description:** Closes the dialog by popping it from the screen stack.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `OnControl(control, down)`
* **Description:** Handles controller and keyboard input to support dialog dismissal. Specifically, triggers the OK action on `CONTROL_CANCEL` (e.g., Escape or B button) if a secondary button exists (legacy behavior for multi-button dialogs).
* **Parameters:**  
  `control` (number) — Control identifier (e.g., `CONTROL_CANCEL`).  
  `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
* **Returns:** `true` if the event was handled; `false` otherwise.
* **Error states:** Only acts when `down == false`; ignores key repeats.

### `GetHelpText()`
* **Description:** Returns localized help text describing how to dismiss the dialog (e.g., “Escape Back”).
* **Parameters:** None.
* **Returns:** `string` — Concatenated localized help string, or empty string if no actionable buttons.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.