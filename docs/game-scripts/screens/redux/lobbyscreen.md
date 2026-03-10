---
id: lobbyscreen
title: Lobbyscreen
description: Manages the lobby UI flow during online multiplayer game setup, including character selection, skin loadouts, wait states, and post-match XP/leaderboard panels.
tags: [ui, lobby, multiplayer, network]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: a0084816
system_scope: ui
---

# Lobbyscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`LobbyScreen` is the primary screen component that orchestrates the multiplayer lobby UI in Don't Starve Together. It handles character selection, skin customization (loadouts), waiting for other players, and post-match summary panels (e.g., XP and MVP cards). It organizes its UI into a sequence of panels (e.g., `CharacterSelectPanel`, `LoadoutPanel`, `WaitingPanel`, `WxpPanel`, `ServerLockedPanel`, `LavaarenaFestivalBookPannel`) and switches between them based on game mode and server state. It interacts heavily with network and world components (e.g., `worldcharacterselectlobby`) to coordinate player readiness and server shutdown status.

## Usage example
```lua
local LobbyScreen = require "screens/redux/lobbyscreen"
local profile = TheFrontEnd:GetProfile()

-- Construct and push the lobby screen, passing in a callback to execute on game start
local screen = LobbyScreen(profile, function(char, skin_base, body, hand, legs, feet)
    -- Start the game with the selected character and skins
    StartGameWorld(char, {base=skin_base, body=body, hand=hand, legs=legs, feet=feet})
end)

TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `worldcharacterselectlobby` (via `IsServerLockedForShutdown`), `TheNet`, `TheWorld`, `Settings.match_results`, `TheSkillTree`, `TheSim`, `TheMixer`, `TheFrontEnd`, `TheInput`, `TheGlobalInstance`, `Client_IsTournamentActive`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` | User profile containing character ownership, loadouts, and XP data. Passed at construction. |
| `cb` | function | `nil` | Callback invoked when the game is started. Receives `(char, skin_base, clothing_body, clothing_hand, clothing_legs, clothing_feet)`. |
| `lobbycharacter` | string | `nil` | Currently selected character for lobby display (before final game loadout). |
| `character_for_game` | string | `nil` | Final character prefab chosen for the upcoming match. |
| `currentskins` | table | `nil` | Table containing `base`, `body`, `hand`, `legs`, `feet` skin overrides. |
| `panels` | table | `{}` | Ordered list of panel constructors (e.g., `{panelfn = WxpPanel}`). Populated at construction. |
| `current_panel_index` | number | `0` | Index of the currently active panel in `panels`. |
| `panel` | widget | `nil` | Instance of the currently active panel widget. |
| `panel_title` | Text widget | `nil` | Title text element displayed above panels. |
| `back_button` | Button widget | `nil` | Back/Disconnect button; its action changes based on panel position. |
| `next_button` | Button widget | `nil` | Next/Start button; triggers panel-specific logic (e.g., switching panels or starting the game). |
| `chat_sidebar` | ChatSidebar widget | `nil` | Chat widget used to display and manage lobby chat. |
| `issoundplaying` | boolean | `false` | Tracks whether lobby music is currently playing. |

## Main functions
### `StartGame(lobby)`
*   **Description:** Immediately stops lobby music and invokes the `cb` callback passed at construction, effectively transitioning from the lobby to the game world. Disables the start button if present.
*   **Parameters:** `lobby` (table) – the `LobbyScreen` instance.
*   **Returns:** Nothing.

### `ToNextPanel(dir)`
*   **Description:** Switches to the next or previous panel based on `dir` (`1` for forward, `-1` for backward), skipping disabled panels if defined. Handles cleanup, focus reassignment, and UI updates for the new panel.
*   **Parameters:** `dir` (number) – direction to move (`1` or `-1`).
*   **Returns:** Nothing. May call `TheFrontEnd:PushScreen` to show a quit confirmation dialog if at the first panel.

### `OnBecomeActive()`
*   **Description:** Called when the screen becomes active. Starts lobby music and invokes the `OnBecomeActive` method on the active panel if present.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnDestroy()`
*   **Description:** Called when the screen is destroyed. Stops lobby music and cleans up the base screen state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartLobbyMusic()`
*   **Description:** Plays lobby-themed music and sound effects if not already playing. Uses the mixer to set the master level and push the `"lobby"` mix.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopLobbyMusic()`
*   **Description:** Stops lobby music and sound effects, and pops the `"lobby"` mix from the mixer.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoConfirmQuit()`
*   **Description:** Shows a confirmation dialog before quitting the lobby. The dialog text differs if the local client is the server (host) or a client.
*   **Parameters:** None.
*   **Returns:** Nothing. Calls `DoRestart(true)` if confirmed.

### `DoFocusHookups()`
*   **Description:** Configures focus navigation between the chat sidebar and the current panel, allowing keyboard/controller navigation between chat and the panel UI.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `lobbyplayerspawndelay` on `TheWorld` – triggers `StartGame(self)` when `data.active` is `true` and `data.time == 0`; disables back button when `data.active` is `true`.
- **Pushes:** None.