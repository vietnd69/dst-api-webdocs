---
id: optionsscreen
title: Optionsscreen
description: Manages the options UI screen for configuring game settings, input controls, and display options.
tags: [ui, settings, input, graphics, audio]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: d09a9359
system_scope: ui
---

# Optionsscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
The Optionsscreen class implements the full options menu in Don't Starve Together, handling tab navigation between settings (audio, video, HUD, etc.) and controls (keyboard/controller mapping). It maintains a working copy of settings separate from saved values, tracks dirtiness for unsaved changes, supports graphics mode validation with timeout-based revert, and persists configurations to Profile and config files.

## Usage example
```lua
-- Create and show the options screen, returning to main menu on close
local options_screen = Optionsscreen("MainMenuScreen")
TheFrontEnd:PushScreen(options_screen)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `options` | table | `{}` | Current saved option values (from Profile and TheFrontEnd) |
| `working` | table | `deepcopy(options)` | Mutable working copy of options for in-progress edits |
| `is_mapping` | boolean | `false` | Flag indicating whether control mapping is active |
| `prev_screen` | string | `nil` | Screen name to return to after closing |
| `bg`, `letterbox` | widget? | `nil` | Background and portal ownership references |
| `root`, `menu_bg`, `nav_bar` | widget | `nil` | Main UI container hierarchy |
| `settings_button`, `controls_button` | button | `nil` | Tab navigation buttons |
| `menu` | menu | `nil` | Main menu widget |
| `settingsroot`, `controlsroot` | widget | `nil` | Tab content containers |
| `onlinestatus` | widget | `nil` | Online status indicator |
| `grid` | grid | `nil` | Grid layout for settings options |
| `kb_controlwidgets`, `controller_controlwidgets` | table | `{}` | Lists of control widget tables per device |
| `kb_controllist`, `controller_controllist` | list | `nil` | Vertical lists of controls for keyboard/controller |
| `controls_header`, `actions_header` | widget | `nil` | Section headers in controls tab |
| `active_list` | list | `nil` | Currently active control list (keyboard or controller) |
| `_deviceSaved` | number | `nil` | Saved controller device ID |
| `deviceSpinner`, `resolutionSpinner`, etc. | spinner | `nil` | Spinner widgets for options |
| `left_spinners`, `right_spinners` | table | `{}`, `{}` | Spinner group lists for grid columns |
| `inputhandlers` | table | `{}` | List of control mapping event handlers |
| `devices` | table | `TheInput:GetInputDevices()` | List of connected input devices |
| `dirty` | boolean | `false` | Whether working settings differ from saved |

## Main functions
### `OptionsScreen:Class(constructor)`
* **Description:** Main constructor for the OptionsScreen class. Initializes UI, loads current option states, sets up navigation, spinners, and control lists.
* **Parameters:** `prev_screen` — optional screen name to return to; used for portal ownership transfer.
* **Returns:** New instance of `OptionsScreen` (via `Class(Screen, ...)`).

### `_BuildSettings()`
* **Description:** Builds and returns the Settings tab widget hierarchy including the title and settings grid.
* **Parameters:** None.
* **Returns:** `settingsroot` — widget containing the title and `self.grid`.

### `_BuildControls()`
* **Description:** Builds and returns the Controls tab widget hierarchy including the title and separator lines.
* **Parameters:** None.
* **Returns:** `controlsroot` — widget containing the title and line separators.

### `MakeBackButton()`
* **Description:** Creates and attaches the back button with logic to revert unsaved changes or close the screen.
* **Parameters:** None.
* **Returns:** None.

### `OnControl(control, down)`
* **Description:** Handles UI navigation and special controls (CANCEL, MENU_BACK, MENU_START). Triggers confirm dialogs for revert or apply.
* **Parameters:**  
  - `control` — control key pressed.  
  - `down` — whether the control is pressed (`true`) or released (`false`).
* **Returns:** `true` if handled, else delegate to base.

### `SetTab(tab)`
* **Description:** Switches between "settings" and "controls" tabs, updating button selection and tab visibility.
* **Parameters:**  
  - `tab` — string `"settings"` or `"controls"`.
* **Returns:** None.

### `ApplyChanges()`
* **Description:** Triggers apply logic: if graphics are dirty, shows a graphics confirm dialog; otherwise confirms apply.
* **Parameters:** None.
* **Returns:** None.

### `Close()`
* **Description:** Handles screen fade-out and pop.
* **Parameters:** None.
* **Returns:** None.

### `ConfirmRevert()`
* **Description:** Pushes a PopupDialogScreen to confirm discarding unsaved changes.
* **Parameters:** None.
* **Returns:** None.

### `ConfirmApply()`
* **Description:** Pushes a PopupDialogScreen to confirm applying all changes.
* **Parameters:** None.
* **Returns:** None.

### `GetHelpText()`
* **Description:** Returns localized help text string for current context.
* **Parameters:** None.
* **Returns:** String combining control labels and help messages.

### `Accept()`
* **Description:** Immediately saves and closes screen (bypassing confirm dialog).
* **Parameters:** None.
* **Returns:** None.

### `Save(cb)`
* **Description:** Persists `self.working` settings to Profile and saves config. Applies volumes and other non-graphics options. Calls `cb` on completion.
* **Parameters:**  
  - `cb` — optional callback.
* **Returns:** None.

### `RevertChanges()`
* **Description:** Discards `self.working`, restores `self.options`, reloads controls, applies current settings.
* **Parameters:** None.
* **Returns:** None.

### `MakeDirty()`
* **Description:** Sets the `self.dirty` flag and updates UI (menu, nav) to reflect unsaved changes.
* **Parameters:** None.
* **Returns:** None.

### `MakeClean()`
* **Description:** Clears the `self.dirty` flag and updates UI to reflect saved state.
* **Parameters:** None.
* **Returns:** None.

### `IsDirty()`
* **Description:** Checks if any option in `self.working` differs from `self.options`.
* **Parameters:** None.
* **Returns:** Boolean.

### `IsGraphicsDirty()`
* **Description:** Checks if resolution, display, or fullscreen options differ.
* **Parameters:** None.
* **Returns:** Boolean.

### `ChangeGraphicsMode()`
* **Description:** Applies graphics settings (resolution, display, fullscreen) via `TheFrontEnd:GetGraphicsOptions()`.
* **Parameters:** None.
* **Returns:** None.

### `ConfirmGraphicsChanges(fn)`
* **Description:** Shows a timed popup confirming graphics changes (accept or revert). Handles auto-revert timeout. `fn` is unused/ignored.
* **Parameters:** `fn` — unused parameter.
* **Returns:** None.

### `ApplyVolume()`
* **Description:** Immediately applies volume settings to `TheMixer`.
* **Parameters:** None.
* **Returns:** None.

### `Apply()`
* **Description:** Commits all working options to runtime and profile, including graphics, volume, vibration, HUD, mod prefs, and control mapping. Calls `MakeClean()` at end.
* **Parameters:** None.
* **Returns:** None.

### `LoadDefaultControls()`
* **Description:** Loads default control mappings and marks screen dirty.
* **Parameters:** None.
* **Returns:** None.

### `LoadCurrentControls()`
* **Description:** Loads current control mappings and marks screen clean.
* **Parameters:** None.
* **Returns:** None.

### `MapControl(deviceId, controlId)`
* **Description:** Starts control mapping for given device and control ID; shows popup dialog.
* **Parameters:**  
  - `deviceId` — device ID (`0` = keyboard).  
  - `controlId` — control index (1-based).
* **Returns:** None.

### `OnControlMapped(deviceId, controlId, inputId, hasChanged)`
* **Description:** Callback for input mapping. Updates UI labels, changed indicators, and dirtiness.
* **Parameters:**  
  - `deviceId`, `controlId`, `inputId`, `hasChanged` — as passed by `TheInputProxy`.
* **Returns:** None.

### `CreateSpinnerGroup(text, spinner)`
* **Description:** Creates and returns a compound widget (label + spinner + background) for settings grid.
* **Parameters:**  
  - `text` — label string.  
  - `spinner` — spinner widget instance.
* **Returns:** Widget `SpinnerGroup`.

### `UpdateMenu()`
* **Description:** Updates button states (apply/reset) and visibility of menu items. Hides menu on controller.
* **Parameters:** None.
* **Returns:** None.

### `OnDestroy()`
* **Description:** Cleanup: stops control mapping, removes input handlers, restores portal ownership, calls base.
* **Parameters:** None.
* **Returns:** None.

### `RefreshControls()`
* **Description:** Refreshes all control labels and changed indicators based on current mapping state. Updates nav focus and menu.
* **Parameters:** None.
* **Returns:** None.

### `RefreshNav()`
* **Description:** Sets focus change directions for navigation (arrow keys / controller D-pad).
* **Parameters:** None.
* **Returns:** None.

### `DoInit()`
* **Description:** Populates settings grid with all spinners, and controls list with all key/controller bindings. Sets up spinner change handlers.
* **Parameters:** None.
* **Returns:** None.

### `EnabledOptionsIndex(enabled)`
* **Description:** Utility: returns index `1` (disabled) or `2` (enabled) for enable/disable spinners.
* **Parameters:**  
  - `enabled` — boolean.
* **Returns:** Integer `1` or `2`.

### `InitializeSpinners(first)`
* **Description:** Sets spinner selection states from `self.working` values. Optionally adds changed indicators on first call.
* **Parameters:**  
  - `first` — boolean, `true` if first-time initialization.
* **Returns:** None.

### `UpdateDisplaySpinner()`
* **Description:** Syncs display spinner selection with current fullscreen display ID.
* **Parameters:** None.
* **Returns:** None.

### `UpdateRefreshRatesSpinner()`
* **Description:** Updates refresh rate spinner options and selection for current display/mode.
* **Parameters:** None.
* **Returns:** None.

### `UpdateResolutionsSpinner()`
* **Description:** Updates resolution spinner options and selection; enabled/disables depending on fullscreen mode.
* **Parameters:** None.
* **Returns:** None.

### `GetResolutionString(w, h)`
* **Description:** Utility: returns resolution string `"w x h"`.
* **Parameters:**  
  - `w`, `h` — integers (width/height).
* **Returns:** String.

### `SortKey(data)`
* **Description:** Computes sort key for resolution objects: `w * 16777216 + h * 65536`.
* **Parameters:**  
  - `data` — table with `w`, `h` fields.
* **Returns:** Number.

### `ValidResolutionSorter(a, b)`
* **Description:** Comparator for resolution list sorting.
* **Parameters:**  
  - `a`, `b` — resolution data objects.
* **Returns:** Boolean (`a < b`).

### `GetDisplays()`
* **Description:** Returns list of available displays.
* **Parameters:** None.
* **Returns:** Array of `{text, data}` for displays.

### `GetRefreshRates(display_id, mode_idx)`
* **Description:** Returns list of refresh rates for given display/mode.
* **Parameters:**  
  - `display_id` — display index.  
  - `mode_idx` — mode index.
* **Returns:** Array of `{text, data}` for rates.

### `GetDisplayModes(display_id)`
* **Description:** Returns sorted list of valid resolutions for display.
* **Parameters:**  
  - `display_id` — display index.
* **Returns:** Sorted array of `{text, data}` resolution objects.

### `GetDisplayModeIdx(display_id, w, h, hz)`
* **Description:** Finds mode index matching resolution and refresh.
* **Parameters:**  
  - `display_id`, `w`, `h`, `hz`.
* **Returns:** Integer index or `nil` if not found.

### `GetDisplayModeInfo(display_id, mode_idx)`
* **Description:** Gets resolution and refresh info for mode.
* **Parameters:**  
  - `display_id`, `mode_idx`.
* **Returns:** `w, h, hz` (width, height, refresh rate).

## Events & listeners
- **Listens to:** `control_mapping` — via `TheInput:AddControlMappingHandler(...)` in `DoInit`, fires `OnControlMapped`
- **Pushes:** None (all events are internal or handled via `TheFrontEnd.PushScreen`)