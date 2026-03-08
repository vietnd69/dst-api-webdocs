---
id: cookbookwidget
title: Cookbookwidget
description: Manages the UI layout and tab navigation for the Quagmire cookbook screen, dynamically rendering recipe panels based on selected cooking method.
tags: [ui, cookbook, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: dbcebcc1
system_scope: ui
---

# Cookbookwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CookbookWidget` is a UI widget responsible for rendering the Quagmire recipe book interface. It creates a tabbed navigation system (for Crockpot, Portable Crockpot, and modded recipes) and instantiates the appropriate `CrockpotPage` panel when a tab is selected. It handles controller navigation via tab-switching controls and updates the active recipe display accordingly.

## Usage example
```lua
local cookbook_widget = AddChild(CookbookWidget(parent))
-- The widget automatically initializes with the configured tab structure and displays the appropriate page.
-- Tab switching is triggered automatically by user input via `OnControl`.
```

## Dependencies & tags
**Components used:** `TheCookbook`, `TheInventory`, `TheFrontEnd`, `TheNet`, `TheInput` (global singletons); `cooking` module.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | — | Root container widget for all child UI elements. |
| `tabs` | table | `{}` | List of tab widgets (ImageButton instances), one per cooking type. |
| `last_selected` | ImageButton | — | Currently active tab button. |
| `panel` | Widget? | `nil` | Currently active recipe panel (e.g., CrockpotPage), or `nil` if none. |
| `focus_forward` | any | — | Default focus target for the active panel, used in controller navigation. |
| `sync_status` | Text? | `nil` | Optional status message widget showing online data sync issues (only when `TheCookbook:ApplyOnlineProfileData()` fails). |

## Main functions
### `:_PositionTabs(tabs, w, y)`
*   **Description:** Horizontally arranges a list of tab widgets centered around the origin using a linear spacing formula.
*   **Parameters:** `tabs` (table) — list of tab widgets to position; `w` (number) — horizontal spacing offset; `y` (number) — vertical position (fixed).
*   **Returns:** Nothing.

### `:OnControlTabs(control, down)`
*   **Description:** Handles controller-specific tab navigation (`CONTROL_MENU_L2` for previous tab, `CONTROL_MENU_R2` for next tab). Calls the clicked tab's handler on button release (`down == false`).
*   **Parameters:** `control` (number) — input control code; `down` (boolean) — whether the button is pressed (`true`) or released (`false`).
*   **Returns:** `true` if the input was handled (tab change triggered), otherwise `nil`.

### `:OnControl(control, down)`
*   **Description:** Main input handler; delegates to base class first, then attempts to process tab navigation via `OnControlTabs`.
*   **Parameters:** `control` (number) — input control code; `down` (boolean) — button state.
*   **Returns:** `true` if input was consumed by this widget or parent, otherwise `nil`.

### `:GetHelpText()`
*   **Description:** Returns localized help text describing how to switch tabs using controller buttons.
*   **Parameters:** None.
*   **Returns:** string — concatenated help string (e.g., `"L2/R2 Change Tab"`).

## Events & listeners
- **Listens to:** None explicitly (no `inst:ListenForEvent` calls are present).
- **Pushes:** None explicitly (no `inst:PushEvent` calls are present).