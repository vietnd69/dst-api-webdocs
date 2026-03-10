---
id: viewcustomizationmodalscreen
title: Viewcustomizationmodalscreen
description: Renders a modal UI screen for viewing and switching between world customization settings and world generation options for predefined map levels in DST.
tags: [ui, customization, settings]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: a2de5d21
system_scope: ui
---

# Viewcustomizationmodalscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ViewCustomizationModalScreen` is a specialized UI screen component used to display customization options for a specific map level (e.g., Forest, Caves). It supports two categories of options — `SETTINGS` (world settings) and `WORLDGEN` (world generation parameters) — using tabbed navigation and multilevel support for games with multiple levels. It presents these options via a `SettingsList` widget and integrates with the `Customize` and `Levels` modules to fetch defaults and level data.

This screen does *not* allow editing; it is read-only, as indicated by `IsEditable()` returning `false`.

## Usage example
```lua
-- Typically instantiated internally by DST's frontend in response to a level customization view request.
-- Example manual instantiation for mod debugging (not standard practice):
local leveldata = {
    { location = "FOREST", id = "forest", version = 2, overrides = {} },
    { location = "CAVES", id = "caves", version = 2, overrides = {} },
}
local screen = ViewCustomizationModalScreen(leveldata)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None added, removed, or checked by this screen.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `currentmultilevel` | number | `1` | Index of the currently active level in `self.leveldata`. |
| `activelevelcategory` | LEVELCATEGORY | `LEVELCATEGORY.SETTINGS` | Currently selected tab category (`SETTINGS` or `WORLDGEN`). |
| `activesettingswidget` | SettingsList | (none, initialized at construction) | The active `SettingsList` instance for the current tab. |
| `leveldata` | table | (none, passed to constructor) | Deep copy of the input level data array, with entries per level. |
| `tabs` | table | `{}` | Array of tab `ImageButton`s for switching between `SETTINGS` and `WORLDGEN`. |
| `multileveltabs` | HeaderTabs | `nil` | Tab control for switching between levels (e.g., Forest, Caves). |

## Main functions
### `IsLevelEnabled(level)`
*   **Description:** Checks whether the level at the given index exists in `self.leveldata`.
*   **Parameters:** `level` (number) — 1-based index into `leveldata`.
*   **Returns:** `true` if `leveldata[level]` is a non-nil table; otherwise `false`.

### `IsEditable()`
*   **Description:** Indicates whether this screen supports editing options.
*   **Parameters:** None.
*   **Returns:** `false` — this screen is read-only.

### `GetOptions()`
*   **Description:** Retrieves the list of options for the current `activelevelcategory` (settings or worldgen) and current level.
*   **Parameters:** None.
*   **Returns:** Table of option definitions, resolved using `Customize.GetWorldSettingsOptionsWithLocationDefaults` or `Customize.GetWorldGenOptionsWithLocationDefaults`, depending on category.

### `SelectMultilevel(level)`
*   **Description:** Switches the active level to the one at the given index and refreshes the UI.
*   **Parameters:** `level` (number) — 1-based index of the level to select.
*   **Returns:** Nothing.

### `Refresh()`
*   **Description:** Updates the `SettingsList` widget with current option values, configures keyboard/controller focus navigation, and ensures the scroll list is built.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetValueForOption(option)`
*   **Description:** Returns the value of the given option for the current level. First checks `self.leveldata[currentmultilevel].overrides`, then falls back to location defaults.
*   **Parameters:** `option` (string) — the option key.
*   **Returns:** The option’s value (any type), or `nil` if neither override nor default exists.

### `Cancel()`
*   **Description:** Closes the screen by popping it from the frontend stack.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoFocusHookups()`
*   **Description:** Configures left/right focus movement between the tab buttons (for keyboard/controller navigation).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles controller/keyboard input (e.g., `CONTROL_CANCEL`, `CONTROL_MENU_L2`, `CONTROL_MENU_R2`) for navigation and dismissal.
*   **Parameters:**  
  - `control` (string) — the control ID (e.g., `"cancel"`, `"menu_l2"`, `"menu_r2"`).  
  - `down` (boolean) — `true` if key was pressed, `false` if released (screen only responds on release).
*   **Returns:** `true` if the event was handled; otherwise delegates to base class.

### `GetHelpText()`
*   **Description:** Returns localized help text for the primary action (`Cancel`).
*   **Parameters:** None.
*   **Returns:** String combining localized control label and help string (e.g., `"Esc  BACK"`).

### `SetTweak()`
*   **Description:** Placeholder dummy function required by `SettingsList`; does nothing.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** None identified.  
*(The screen does not fire or listen to any game events directly.)*