---
id: mainscreen_ps4
title: Mainscreen Ps4
description: Renders the PlayStation 4–specific main menu UI, managing screen transitions, sound, storage checks, and display-safe-area configuration.
tags: [ui, ps4, menu]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 744daa96
system_scope: ui
---

# Mainscreen Ps4

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`MainScreen` is a screen widget responsible for displaying the PlayStation 4–specific main menu interface. It handles background rendering (including DLC-specific assets), animated title elements, dynamic menu population, navigation flow (e.g., settings, credits, controls), audio playback, and platform-specific post-launch checks like storage availability and display safe-area adjustment. It extends `Screen` and integrates with the `TheFrontEnd`, `TheInput`, `TheSystemService`, and `Profile` APIs.

## Usage example
```lua
-- Typically instantiated and pushed via TheFrontEnd on startup
local screen = MainScreen(profile)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None identified (this is a screen widget, not a component; it uses subsystem APIs like `TheFrontEnd`, `TheSystemService`, `TheInput`, `Profile`, and `STRINGS`).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` (passed in constructor) | User profile instance used to persist settings and state (e.g., display safe-area popup flag). |
| `log` | boolean | `true` | Internal logging flag (unused in current logic). |
| `default_focus` | Widget | `self.menu` | Widget that receives focus on activation. |
| `music_playing` | boolean | `false` | Tracks whether FE music and portal SFX have been played. |
| `mainmenu` | boolean | `nil` | Tracks whether the screen is currently in the top-level main menu state. |
| `bg` | Image | `nil` | Background image widget (DLC-aware). |
| `fixed_root` | Widget | `nil` | Root container for fixed-position UI elements. |
| `anim` | UIAnim | `nil` | Animated title widget (e.g., "willow_title_fire", "wilson_title_fire"). |
| `shield` | Image | `nil` | Title emblem widget. |
| `bannerroot` | Widget | `nil` | Container for update banner. |
| `banner` | Image | `nil` | Update banner image. |
| `updatename` | Text | `nil` | Text widget displaying localized console edition string. |
| `right_col` | Widget | `nil` | Container for right-side menu column. |
| `menu` | Menu | `nil` | Interactive menu widget for option buttons. |

## Main functions
### `DoInit()`
* **Description:** Initializes the screen UI: sets graphics options, adds background, animated title, title shield, update banner, and constructs the right-side menu. Must be called after construction.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented.

### `MainMenu()`
* **Description:** Populates the main menu with a single "OPTIONS" item and sets the `mainmenu` flag to `true`. Replaces any previous menu state.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoOptionsMenu()`
* **Description:** Populates the menu with sub-options: "CREDITS", "CONTROLS", and "SETTINGS".
* **Parameters:** None.
* **Returns:** Nothing.

### `OnCreditsButton()`
* **Description:** Stops FE music and portal sound, then pushes the `CreditsScreen`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControlsButton()`
* **Description:** Pushes the `ControlsScreen`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Settings()`
* **Description:** Pushes the `OptionsScreen` (non-DLC mode).
* **Parameters:** None.
* **Returns:** Nothing.

### `ShowMenu(menu_items)`
* **Description:** Clears the current menu and adds new items from the provided list, setting focus to the menu. Called by `MainMenu()` and `DoOptionsMenu()`.
* **Parameters:** `menu_items` (table) — list of `{text = string, cb = function}` entries.
* **Returns:** Nothing.

### `Refresh()`
* **Description:** Resets the menu to `MainMenu()`, then restarts FE music and portal SFX.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input navigation, including returning to main menu on `CONTROL_CANCEL` when not in the top-level menu. Delegates base input handling via `Screen._base`.
* **Parameters:**  
  `control` (number) — Control enum constant.  
  `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
* **Returns:** `true` if the event was handled; otherwise `false`.
* **Error states:** Early return if storage is not available.

### `OnUpdate(dt)`
* **Description:** Manages playback of the intro movie and FE audio. Ensures music and SFX play once. After the movie (or initially), triggers `CheckStorage()`.
* **Parameters:** `dt` (number) — Delta time since last frame.
* **Returns:** Nothing.

### `CheckStorage()`
* **Description:** Queries `TheSystemService` for storage availability and last save/load operation status. If an error occurred, displays an error dialog and exits; otherwise proceeds to `CheckDisplayArea()`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Calls `TheFrontEnd:OnSaveLoadError()` if operation is not `NONE` and status is not `OK`.

### `CheckDisplayArea()`
* **Description:** Checks whether display safe-area adjustment is required. If not adjusted and the popup has not been seen, displays a `BigPopupDialogScreen` prompting user to adjust. Calls `Profile:ShowedDisplayAdjustmentPopup()` and `Profile:Save()` on dismiss.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented.

### `GetHelpText()`
* **Description:** Returns contextual help text ("CANCEL: BACK") when not in the main menu; returns an empty string otherwise.
* **Parameters:** None.
* **Returns:** `string` — localized help text or empty string.

### `OnBecomeActive()`
* **Description:** Base callback invoked when the screen becomes active. Delegates to `Screen._base.OnBecomeActive`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Input handler for navigation and back-button logic.
* **Parameters:**  
  `control` (number) — control constant (e.g., `CONTROL_CANCEL`).  
  `down` (boolean) — key press state.  
* **Returns:** `true` if handled; otherwise `false`.
* **Error states:** Returns early if storage is unavailable.

## Events & listeners
- **Listens to:** None identified (screen lifecycle managed via callbacks like `OnControl`, `OnUpdate`, `OnBecomeActive`, which are framework-invoked).
- **Pushes:** None identified (screen transitions handled via `TheFrontEnd:PushScreen(...)` calls).