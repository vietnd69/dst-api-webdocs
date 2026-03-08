---
id: quagmire_book
title: Quagmire Book
description: Manages the Quagmire-specific UI tabbed book interface containing Recipe Book and Achievements panels.
tags: [ui, quagmire, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b3271a5e
system_scope: ui
---

# Quagmire Book

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`QuagmireBook` is a UI widget that provides a tabbed interface for the Quagmire event mode, displaying either the Quagmire Recipe Book or the Quagmire-specific Achievements panel. It inherits from `Widget`, manages tab selection, panel lifecycle, and keyboard/controller navigation between tabs and child UI elements. The component does not attach to game entities but exists solely as a UI container.

## Usage example
```lua
-- In a screen context where parent is a valid UI widget (e.g., a menu root):
local quagmire_book = QuagmireBook(parent, secondary_left_menu, season)
```

## Dependencies & tags
**Components used:** None (pure UI widget with no entity components).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | `self:AddChild(Widget("root"))` | Root container widget for the book interface. |
| `tabs` | table of ImageButton | `{}` | List of tab buttons (Recipe Book, Achievements). |
| `last_selected` | ImageButton | First tab | Reference to the currently selected tab. |
| `panel` | Widget? | `nil` | Currently active child panel (RecipeBookWidget or AchievementsPanel). |

## Main functions
### `_DoFocusHookups(menu, secondary_left_menu)`
*   **Description:** Configures directional focus navigation between the book's tabs, the active panel, and adjacent menu elements. Clears and sets up focus change directions for keyboard/controller navigation.
*   **Parameters:**  
    `menu` (Widget) — the parent menu widget to link left/right focus to the panel.  
    `secondary_left_menu` (Widget?) — optional widget to link vertical focus (e.g., for layered menus).
*   **Returns:** Nothing.

### `OnControlTabs(control, down)`
*   **Description:** Handles tab switching controls (`CONTROL_MENU_L2` for previous tab, `CONTROL_MENU_R2` for next tab). Activates the target tab via its `onclick()` handler.
*   **Parameters:**  
    `control` (number) — the input control ID being processed.  
    `down` (boolean) — `true` if the control was pressed (the function only acts on release, i.e., when `not down`).
*   **Returns:** `true` if the control was handled and should not propagate further.

### `OnControl(control, down)`
*   **Description:** Entry point for all control inputs. Delegates tab-specific handling to `OnControlTabs` after checking the base `Widget` class.
*   **Parameters:** Same as `OnControlTabs`.
*   **Returns:** `true` if the input was handled; otherwise falls back to base class behavior.

### `GetHelpText()`
*   **Description:** Returns a localized help string describing how to switch tabs (e.g., "L2/R2 Change tab").
*   **Parameters:** None.
*   **Returns:** `string` — localized help text for the current controller.

## Events & listeners
None.