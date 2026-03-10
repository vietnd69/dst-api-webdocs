---
id: modconfigurationscreen
title: Modconfigurationscreen
description: Manages the UI for configuring mod settings, displaying, editing, and persisting mod configuration options.
tags: [ui, modding, configuration]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: f546eebc
system_scope: ui
---

# Modconfigurationscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ModConfigurationScreen` is a UI screen that presents and manages configuration options for a specific mod. It retrieves mod configuration data via `KnownModIndex`, renders interactive widgets (e.g., spinners), allows user edits, and supports applying, resetting, or discarding changes. It extends `Screen` and is part of the Redux UI framework. It does not directly interact with game entities or components but integrates with system-level mod APIs (`KnownModIndex`) and screen management (`TheFrontEnd`).

## Usage example
```lua
local ModConfigurationScreen = require "screens/redux/modconfigurationscreen"
local screen = ModConfigurationScreen("my_mod_id", true)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `modname` | string | — | The internal mod identifier passed to the constructor. |
| `config` | table | `nil` | Configuration options loaded via `KnownModIndex:LoadModConfigurationOptions`. |
| `options` | table | `{}` | List of normalized configuration options ready for display. |
| `client_config` | boolean | — | Whether configuration is for client-only mod settings. |
| `dirty` | boolean | `false` | Whether any settings have been modified since load. |
| `started_default` | boolean | — | Whether the initial state matched all defaults. |
| `optionwidgets` | table | `{}` | Array of UI widget data structures corresponding to options. |
| `options_scroll_list` | ScrollingGrid | — | Scrollable container widget for mod option widgets. |
| `dialog` | RectangleWindow | — | Window container housing all UI elements. |
| `option_header` | Widget | — | Header container for title, description, and value descriptions. |
| `option_description` | Text | — | Tooltip widget showing hover text for the selected option. |
| `value_description` | Text | — | Tooltip widget showing hover text for the selected value. |

## Main functions
### `CollectSettings()`
* **Description:** Gathers the current state of all mod settings into a table suitable for saving.
* **Parameters:** None.
* **Returns:** table or `nil` — a list of option tables with keys: `name`, `label`, `options`, `default`, and `saved` (current value).
* **Error states:** Returns `nil` if no options exist.

### `ResetToDefaultValues()`
* **Description:** Resets all option values to their mod-defined defaults and refreshes the UI. Shows a confirmation dialog if settings have been changed.
* **Parameters:** None.
* **Returns:** Nothing.

### `Apply()`
* **Description:** Persists modified settings to disk via `KnownModIndex:SaveConfigurationOptions`, then closes the screen. Does nothing if no changes were made.
* **Parameters:** None.
* **Returns:** Nothing.

### `Cancel()`
* **Description:** Closes the screen. If settings were modified and not reset, shows a confirmation dialog before discarding changes.
* **Parameters:** None.
* **Returns:** Nothing.

### `ConfirmRevert(callback)`
* **Description:** Displays a Yes/No confirmation dialog (using `PopupDialogScreen`) before reverting changes. Executes `callback` on confirmation.
* **Parameters:** `callback` (function) — function to execute if user confirms.
* **Returns:** Nothing.

### `MakeDirty(dirty)`
* **Description:** Sets or toggles the `dirty` flag indicating whether settings have been modified.
* **Parameters:** `dirty` (boolean? optional) — if omitted, sets `dirty` to `true`. If `true`/`false`, sets flag accordingly.
* **Returns:** Nothing.

### `IsDefaultSettings()`
* **Description:** Checks whether all current settings match their mod defaults.
* **Parameters:** None.
* **Returns:** boolean — `true` if every option’s value equals its `default`.

### `IsDirty()`
* **Description:** Returns whether any settings have been modified.
* **Parameters:** None.
* **Returns:** boolean — value of `self.dirty`.

### `OnControl(control, down)`
* **Description:** Handles input events (keyboard/controller). Supports `CONTROL_CANCEL` (Back), `CONTROL_MENU_START` (Apply), and `CONTROL_MENU_BACK` (Reset to Default).
* **Parameters:**  
  `control` (number) — input control constant.  
  `down` (boolean) — whether key/button was pressed (`true`) or released (`false`).  
* **Returns:** boolean — `true` if the control was handled, else delegates to base class.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls observed).
- **Pushes:** None (no `inst:PushEvent` calls observed).