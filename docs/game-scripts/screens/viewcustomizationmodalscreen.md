---
id: viewcustomizationmodalscreen
title: ViewCustomizationModalScreen
description: Displays a modal screen for viewing and navigating world customization options across multiple map levels.
tags: [ui, customization, world, modal]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 47558d3a
system_scope: ui
---

# ViewCustomizationModalScreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ViewCustomizationModalScreen` is a UI screen component that presents world customization options for one or more map levels (e.g., Forest, Caves). It supports multi-level worlds (e.g., surface + caves) via tab navigation and displays a non-editable `CustomizationList` for inspecting override values. It is typically used in sandbox or world editing contexts to preview customization settings without modification.

## Usage example
```lua
local leveldata = {
    { location = "forest", id = "forest", name = "Forest", overrides = {} },
    { location = "caves", id = "caves", name = "Caves", overrides = {} },
}
local screen = ViewCustomizationModalScreen(leveldata)
TheFrontEnd:AddScreen(screen)
```

## Dependencies & tags
**Components used:** None (this is a screen widget, not an entity component).
**Tags:** Uses `CUSTOMIZATION`, `SANDBOXMENU`, `SERVERLISTINGSCREEN`, and `UI` strings (from `STRINGS`). No entity tags involved.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `currentmultilevel` | number | `1` | Index of the currently active level in `self.leveldata`. |
| `leveldata` | table | *N/A* | Deep copy of the input `leveldata` containing per-level world configuration. |
| `black` | Image | *N/A* | Full-screen dark overlay (tinted to 75% opacity). |
| `root`, `clickroot` | Widget | *N/A* | Container widgets for layout and interaction. |
| `optionspanel` | Widget | *N/A* | Panel holding tab buttons and customization content. |
| `multileveltabs` | Widget | *N/A* | Container for level tab buttons. |
| `customizationlist` | CustomizationList | *N/A* | Non-editable list widget showing customization options for the current level. |

## Main functions
### `SelectMultilevel(level)`
*   **Description:** Switches the active level to `level` and refreshes the UI to display its customization options.
*   **Parameters:** `level` (number) — 1-based index of the desired level in `self.leveldata`.
*   **Returns:** Nothing.

### `IsLevelEnabled(level)`
*   **Description:** Checks if a given level index has associated data in `self.leveldata`.
*   **Parameters:** `level` (number) — 1-based index to check.
*   **Returns:** `true` if `self.leveldata[level]` is non-nil; `false` otherwise.

### `UpdateMultilevelUI()`
*   **Description:** Updates tab button states (enabled/disabled) based on `self.currentmultilevel`. Active tab is disabled; others are enabled.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Refresh()`
*   **Description:** Rebuilds the `CustomizationList` for the current level. Loads options, sets override values, applies title, and configures focus navigation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetValueForOption(level, option)`
*   **Description:** Retrieves the effective value for a given customization option at a specific level, falling back to location defaults if not overridden.
*   **Parameters:** `level` (number) — 1-based index; `option` (string) — option key.
*   **Returns:** The override value if present in `self.leveldata[level].overrides`, otherwise the location default.

### `Cancel()`
*   **Description:** Closes the screen by popping it from the `TheFrontEnd` screen stack.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles control input, including the cancel action (typically Back/ESC).
*   **Parameters:** `control` (string) — control name; `down` (boolean) — true if key/button is pressed.
*   **Returns:** `true` if the control was handled; `false` otherwise.

### `GetHelpText()`
*   **Description:** Returns localized help text indicating how to dismiss the screen.
*   **Parameters:** None.
*   **Returns:** string — e.g., `"Back  ESC"`.

### `HookupFocusMoves()`
*   **Description:** Configures focus navigation between tab buttons (Left/Right) and to the customization list (Down).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
*   **Pushes:** None.
*   **Listens to:** None (events are not used; screen is managed via direct function calls).