---
id: modconfigurationscreen
title: Modconfigurationscreen
description: Manages the UI screen for configuring mod options, including applying, resetting, and canceling configuration changes.
tags: [ui, mod, settings]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 160ee21c
system_scope: ui
---

# Modconfigurationscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ModConfigurationScreen` is a screen widget that displays and manages mod-specific configuration options. It loads configuration data for a given mod, renders editable widgets (spinners) for each option, and handles user interactions such as applying changes, resetting to defaults, or canceling without saving. It extends `Screen` and integrates with the game's UI system, including focus navigation, controller input, and `KnownModIndex` for persistent configuration storage.

## Usage example
```lua
-- Instantiate and push the screen for a specific mod
local modname = "my_mod_id"
local client_config = true -- or false for server config
TheFrontEnd:PushScreen(ModConfigurationScreen(modname, client_config))
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None added or checked by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `modname` | string | `nil` | Identifier of the mod being configured. |
| `config` | table or `nil` | `nil` | Raw configuration data loaded via `KnownModIndex:LoadModConfigurationOptions`. |
| `client_config` | boolean | `nil` | Flag indicating whether client-side configuration is used. |
| `options` | table | `{}` | List of processed option descriptors used to render spinners. |
| `optionwidgets` | table | `{}` | List of UI widgets corresponding to each option. |
| `dirty` | boolean | `false` | Indicates whether any option value has been modified since last apply/reset. |
| `started_default` | boolean | `false` | Whether all options were initially set to their defaults when the screen opened. |

## Main functions
### `CollectSettings()`
*   **Description:** Gathers all current option values into a table format suitable for saving via `KnownModIndex:SaveConfigurationOptions`.
*   **Parameters:** None.
*   **Returns:** A table of option configurations, each entry containing `name`, `label`, `options`, `default`, and `saved` (current value).

### `ResetToDefaultValues()`
*   **Description:** Resets all option values to their defaults. Prompts the user for confirmation if changes have been made.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Apply()`
*   **Description:** Saves current settings via `KnownModIndex:SaveConfigurationOptions` and closes the screen. If no changes were made, it closes directly without saving.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Cancel()`
*   **Description:** Closes the screen and discards changes. Prompts confirmation if changes have been made and settings were not originally all-default.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ConfirmRevert(callback)`
*   **Description:** Displays a confirmation popup dialog before reverting (discarding) changes.
*   **Parameters:** `callback` (function) — Function to execute if user confirms revert (typically pops screen and resets state).
*   **Returns:** Nothing.

### `MakeDirty(dirty)`
*   **Description:** Sets or toggles the `dirty` flag. If called with no argument, sets `dirty` to `true`.
*   **Parameters:** `dirty` (boolean, optional) — Explicit value for the dirty flag.
*   **Returns:** Nothing.

### `IsDefaultSettings()`
*   **Description:** Checks whether all current option values match their defaults.
*   **Parameters:** None.
*   **Returns:** `true` if all options are at default values; `false` otherwise.

### `IsDirty()`
*   **Description:** Returns whether any option values have been modified since the screen was opened or last applied.
*   **Parameters:** None.
*   **Returns:** `true` if the screen is in a dirty state; `false` otherwise.

### `OnControl(control, down)`
*   **Description:** Handles controller and keyboard input events (e.g., cancel, apply, reset).
*   **Parameters:**  
  `control` (string) — Control constant (e.g., `CONTROL_CANCEL`, `CONTROL_MENU_BACK`).  
  `down` (boolean) — Whether the control is pressed (`true`) or released (`false`).  
*   **Returns:** `true` if the event was handled; `false` otherwise.

### `GetHelpText()`
*   **Description:** Generates localized help text describing controller/keyboard controls relevant to the current screen state.
*   **Parameters:** None.
*   **Returns:** A string with control labels and descriptions joined with spacing.

## Events & listeners
- **Listens to:** None identified (no `inst:ListenForEvent` calls in the source).
- **Pushes:** None identified (no `inst:PushEvent` calls in the source).