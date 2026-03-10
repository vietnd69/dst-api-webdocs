---
id: mainscreen
title: Mainscreen
description: Manages the main menu screen for Don't Starve Together, including UI layout, button handling, authentication flow, and multiplayer session initialization.
tags: [ui, multiplayer, authentication, frontend]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 276b1537
system_scope: ui
---

# Mainscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`MainScreen` is the primary frontend screen that renders the main menu of Don't Starve Together. It defines UI layout (backgrounds, title, logo images), input handling (mouse/keyboard and controller), authentication flow integration, and session initialization logic (host, join, offline play). It inherits from `Screen` and manages widgets such as buttons, images, and online status indicators. The screen orchestrates transitions to other screens (e.g., `MultiplayerMainScreen`, `EmailSignupScreen`, `PopupDialogScreen`) based on user actions and network state.

## Usage example
```lua
-- Typically instantiated by TheFrontEnd when displaying the main menu.
-- Example of low-level instantiation:
local profile = ThePlayer or CreatePlayerProfile()
local mainscreen = MainScreen(profile)
TheFrontEnd:PushScreen(mainscreen)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None added, removed, or checked directly on `self.inst`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` | User profile data, passed to constructor. |
| `log` | boolean | `true` | Logging flag (unused in current implementation). |
| `targetversion` | number | `-1` | Target version indicator (unused in current implementation). |
| `fixed_root` | `Widget` | `nil` | Root widget for fixed-position UI elements. |
| `left_col` | `Widget` | `nil` | Container widget for left-column elements. |
| `title`, `presents_image`, `legalese_image` | `Image` | `nil` | Title logo and legal images. |
| `play_button` | `ImageButton` | `nil` | Play/Host button widget. |
| `exit_button` | `ImageButton` | `nil` | Quit button widget. |
| `updatename` | `Text` | `nil` | Build string display. |
| `onlinestatus` | `OnlineStatus` | `nil` | Online status indicator widget. |
| `music_playing` | boolean | `false` | Tracks whether FE music has started. |
| `auto_login_started` | boolean | `nil` | Flag indicating if auto-login task has begun. |

## Main functions
### `DoInit()`
* **Description:** Initializes UI layout, buttons, images, and focus management for the main screen. Creates the foreground, title logos, play/quit buttons, and debug buttons (if `DEBUG_MODE` is true). Sets up online status display and resolves platform-specific quirks (e.g., `WIN32_RAIL` scaling).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLoginButton(push_mp_main_screen)`
* **Description:** Handles the login/auth flow triggered by the Play button. Orchestrates offline mode detection, account ban/upgrade checks, auth token validity, and presents dialogs for offline mode or data collection consent. On success, transitions to `MultiplayerMainScreen`.
* **Parameters:**  
  - `push_mp_main_screen` (boolean) — If true, pushes the `MultiplayerMainScreen`; otherwise, fades back to current screen.
* **Returns:** Nothing.

### `EmailSignup()`
* **Description:** Pushes the `EmailSignupScreen` for newsletter subscription.
* **Parameters:** None.
* **Returns:** Nothing.

### `Quit()`
* **Description:** Pushes a confirmation dialog ("Are you sure you want to quit?") and calls `RequestShutdown()` on confirmation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnHostButton()`
* **Description:** Initializes and starts a local server in offline mode. Deletes the current save slot if Shift or Ctrl is held (optionally preserving world gen options), or loads the slot as-is.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnJoinButton()`
* **Description:** Attempts to join a default LAN server (`DEFAULT_JOIN_IP`). Calls `ShowLoading()` after initialization.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnJoinPlayTestButton()`
* **Description:** Attempts to join a playtest server using the local setting `misc/play_test_ip`.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeDebugButtons()`
* **Description:** Conditionally (if `DEBUG_MODE` is true) creates Host and Join debug buttons in the upper-left column, and optionally a Join PlayTest button if a playtest IP is configured.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Called when this screen becomes the active screen. Re-enables buttons, sets focus to `play_button`, initializes `FriendsManager`, and starts auto-login logic if enabled (via `DoPeriodicTask`). Ensures FE music playback begins in `OnUpdate`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Plays the frontend music (`FE_MUSIC`) on first invocation. Includes commented-out portal animation logic.
* **Parameters:**  
  - `dt` (number) — Delta time since last frame.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Overrides base screen input handling. In debug mode, maps gamepad `MENU_START` to host and `MENU_BACK` to join for rapid iteration.
* **Parameters:**  
  - `control` (number) — Input control constant (e.g., `CONTROL_MENU_START`).  
  - `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if the control was handled; otherwise `false`.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified