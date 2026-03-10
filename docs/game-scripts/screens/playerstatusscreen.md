---
id: playerstatusscreen
title: Playerstatusscreen
description: Renders and manages the in-game player status screen, displaying server information and connected players with moderation controls.
tags: [ui, player, screen, moderation, network]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: d459efa8
system_scope: ui
---

# Playerstatusscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PlayerStatusScreen` is a screen component that displays server metadata (name, description, age, mode) and a scrollable list of connected players. For each player, it renders identification info (character badge, name, age), network performance indicators, and moderation buttons (view profile, mute, kick, ban, user actions). It supports input handling, real-time updates (every 0.5 seconds), and server-specific behaviors such as Lava Arena round tracking. This screen is opened via `CONTROL_SHOW_PLAYER_STATUS` and integrates with `UserCommands`, `TheNet`, `ServerPreferences`, and vote/kick/ban systems.

## Usage example
```lua
local PlayerStatusScreen = require "screens/playerstatusscreen"
TheFrontEnd:PushScreen(PlayerStatusScreen(player_entity))
```

## Dependencies & tags
**Components used:** `playervoter`, `worldvoter`, `lavaarenaeventstate` (via `TheWorld.net.components.lavaarenaeventstate`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity that owns the screen. |
| `time_to_refresh` | number | `REFRESH_INTERVAL` (0.5) | Time remaining until the next player list refresh. |
| `show_player_badge` | boolean | `true` (if online mode and not offline) | Controls whether rank/badge UI appears on player rows. |
| `scroll_list` | ScrollableList or `nil` | `nil` | Scrollable widget container for player rows. |
| `player_widgets` | table | `{}` | Array of player row widgets. |
| `numPlayers` | number | `0` | Cached player count used to detect changes. |
| `server_group` | string | `""` | Server clan ID. |
| `servermenunumbtns` | number | `0` | Count of server menu buttons present (view group, toggle name/desc). |
| `usercommandpickerscreen` | UserCommandPickerScreen or `nil` | `nil` | Reference to the currently open user command picker sub-screen. |

## Main functions
### `DoInit(ClientObjs)`
* **Description:** Initializes or rebuilds the entire screen layout and player list. Renders server info (title, age, description, mods), button rows for server controls, and populates the scrollable player list with modifiable UI elements per player. If `ClientObjs` is `nil`, it fetches the current client table.
* **Parameters:** `ClientObjs` (table or `nil`) — Optional array of client records from `TheNet:GetClientTable()`.
* **Returns:** Nothing.
* **Error states:** None documented. Always constructs or updates UI based on current network state.

### `OnUpdate(dt)`
* **Description:** Updates the screen each frame. Manages the refresh timer and rebuilds the player list when player count or identity changes. Updates per-player UI (name, age, performance, mute status, command states for kick/ban). Handles Lava Arena round display and age updates in normal worlds.
* **Parameters:** `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles control inputs (keyboard/controller). Closes the screen on `CONTROL_SHOW_PLAYER_STATUS`, `CONTROL_PAUSE`, or `CONTROL_CANCEL` (if `click_to_close`). Supports `CONTROL_MENU_MISC_2` to view group profile and `CONTROL_MENU_MISC_1` to toggle server name/description visibility.
* **Parameters:** `control` (number) — Control enum. `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if the input was handled; otherwise `false`.

### `OnBecomeActive()`
* **Description:** Called when the screen becomes active. Initializes the list and sets auto-pause state.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeInactive()`
* **Description:** Called when the screen becomes inactive. Clears voice mute observers and disables auto-pause.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Closes the screen by popping it from the front-end stack and re-enabling debug toggles.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDisplayName(clientrecord)`
* **Description:** Overridable method to return the display name for a client record. Defaults to `clientrecord.name`.
* **Parameters:** `clientrecord` (table) — Client data table with at least `name` field.
* **Returns:** string — The player’s display name.

### `RefreshServerName()`
* **Description:** Updates the server title and description text widgets, respecting `ServerPreferences` filters and screen button counts to adjust size/position.
* **Parameters:** None.
* **Returns:** Nothing.

### `OpenUserCommandPickerScreen(targetuserid)`
* **Description:** Opens the user command picker screen for a given player ID, if not already open.
* **Parameters:** `targetuserid` (string or number) — The user ID of the target player.
* **Returns:** Nothing.

### `IsUserCommandPickerScreenOpen()`
* **Description:** Returns whether the user command picker sub-screen is currently active.
* **Parameters:** None.
* **Returns:** boolean.

### `CloseUserCommandPickerScreen()`
* **Description:** Closes the user command picker sub-screen if open.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).