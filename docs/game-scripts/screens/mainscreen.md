---
id: mainscreen
title: Mainscreen
description: Manages the main game menu UI, including authentication flow, version checking, and starting local or multiplayer sessions.
tags: [ui, authentication, multiplayer, versioning]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 7e9fec9b
system_scope: ui
---

# Mainscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`MainScreen` is the primary UI screen presented to players upon launching the game. It handles authentication with the game’s servers, version compatibility verification, and provides entry points to multiplayer hosting/joining or local offline play. It is a subclass of `Screen` and orchestrates the transition to other screens (e.g., `MultiplayerMainScreen`, `EmailSignupScreen`, `MovieDialog`, `NetworkLoginPopup`) based on state and user input.

## Usage example
```lua
local MainScreen = require "screens/mainscreen"
local screen = MainScreen(profile)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** No tags are added, removed, or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | (passed at construction) | Player profile data used during initialization. |
| `log` | boolean | `true` | Unused in modern builds (legacy flag). |
| `targetversion` | number | `-1` | Most recent build changelist fetched from the server; used for version comparison. |
| `music_playing` | boolean | `false` | Tracks whether frontend music and SFX have been started. |
| `leaving` | any | `nil` | Used internally to prevent animation resets during exit. |
| `dark_card`, `title`, `presents_image`, `legalese_image` | Image widget | — | UI visual elements used for branding and legalese. |
| `play_button`, `exit_button` | ImageButton | — | Primary interactive buttons for play and quit. |
| `portal_root`, `fixed_root`, `left_col`, `right_col` | Widget | — | Layout containers for organizing screen elements. |
| `onlinestatus` | OnlineStatus widget | — | Displays network and online account status. |

## Main functions
### `DoInit()`
* **Description:** Initializes the screen’s visual layout and widgets, configures graphics options, sets up focus navigation, and fetches current version info.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLoginButton(push_mp_main_screen)`
* **Description:** Initiates the login/authentication flow, checks version, handles offline fallback, and navigates to the multiplayer main screen or shows dialogs as needed.
* **Parameters:**  
  - `push_mp_main_screen` (boolean) — If `true`, pushes `MultiplayerMainScreen` after auth; otherwise, just fades out the main screen.
* **Returns:** Nothing.
* **Error states:** Handles multiple failure modes (banned user, outdated client, auth server unreachable, missing license). In such cases, displays an appropriate `PopupDialogScreen` and calls `TheFrontEnd:PopScreen()` to return to or remain at the main screen.

### `OnHostButton()`
* **Description:** Starts a dedicated server instance, saving world generation options and mod lists; supports shift- or ctrl-modified deletion of save slot contents before launch.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `TheNet:StartServer()` fails.

### `OnJoinButton()`
* **Description:** Attempts to join the default LAN server (`DEFAULT_JOIN_IP`) and launches the game client.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `TheNet:StartClient()` fails.

### `Quit()`
* **Description:** Displays a confirmation dialog before calling `RequestShutdown()` to exit the game.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Called when the screen becomes the active screen. Restores interactivity (enables buttons), refocuses the play button, and disables offline mode.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Handles background animation resets, plays intro movie once per session (if configured), and starts music/SFX if not already playing.
* **Parameters:**  
  - `dt` (number) — Delta time since last frame.
* **Returns:** Nothing.

### `UpdateCurrentVersion()`
* **Description:** Queries the official build server (`https://s3.amazonaws.com/dstbuilds/builds.json`) to retrieve the latest changelist number.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetTargetGameVersion(ver)`
* **Description:** Sets the `targetversion` property to the provided changelist number.
* **Parameters:**  
  - `ver` (number) — The latest game build changelist to compare against `APP_VERSION`.
* **Returns:** Nothing.

### `OnCurrentVersionQueryComplete(result, isSuccessful, resultCode)`
* **Description:** Parses server response and updates version state; stores `-2` on failure or `-1` if no response received yet.
* **Parameters:**  
  - `result` (string) — Raw JSON string from server.  
  - `isSuccessful` (boolean) — Whether the HTTP request succeeded.  
  - `resultCode` (number) — HTTP status code (e.g., `200`).
* **Returns:** Nothing.

### `SetCurrentVersion(str)`
* **Description:** Parses the version JSON string and sets `self.currentversion` and `self.targetversion` to the highest valid changelist in `version.main`.
* **Parameters:**  
  - `str` (string) — JSON-encoded response containing changelist data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.  
  *(Note: While `TheFrontEnd` is used for screen transitions, this component itself does not fire custom events via `inst:PushEvent`)*