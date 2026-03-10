---
id: lobbyscreen
title: Lobbyscreen
description: Manages the in-game lobby UI, including character selection, loadout dressing, player list, and chat, for both server and client participants.
tags: [ui, lobby, network, character]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: dcec51e0
system_scope: ui
---

# Lobbyscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`LobbyScreen` is a UI screen component responsible for displaying and managing the multiplayer lobby interface before a game starts. It handles character selection, skin customization (via `DressupPanel`), player list rendering (via `PlayerList`), in-game chat (via `LobbyChatQueue`), and state transitions between selection, loadout, and ready/waiting phases. It coordinates with network services via `TheNet`, manages lobby-specific music, and reacts to server-sent events like `lobbyplayerspawndelay`.

## Usage example
```lua
TheFrontEnd:PushScreen(LobbyScreen(profile, function(char, skin_base, ...) 
    -- Start game logic
end, false, default_char, days_survived))
```

## Dependencies & tags
**Components used:** None (this is a screen/widget, not an entity component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` | Player profile data (from `TheNet:GetProfile()`). |
| `cb` | function | `nil` | Callback executed on game start with selected character and skin IDs. |
| `no_cancel` | boolean | `false` | If `true`, disables the back/disconnect button. |
| `currentcharacter` | string? | `nil` | Currently selected character prefab name. |
| `in_loadout` | boolean | `false` | Whether the UI is currently in the loadout (skin customization) tab. |
| `in_readystate` | boolean | `false` | Whether the player has pressed “Start” and is waiting for other players. |
| `dressup` | DressupPanel | `nil` | Instance of the skin customization widget. |
| `character_scroll_list` | CharacterSelect | `nil` | Widget for scrolling and selecting characters. |
| `playerList` | PlayerList | `nil` | Widget listing all lobby participants. |
| `chatbox` | Widget | `nil` | Chat input and message display container. |
| `waiting_for_players` | WaitingForPlayersWidget | `nil` | Widget showing delay timers and player readiness. |

## Main functions
### `StartSelection()`
* **Description:** Switches the UI to the character selection mode. Shows `characterselect_root`, hides loadout and waiting UI, re-enables disconnect button, rebuilds player list and focus chain.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartLoadout()`
* **Description:** Switches the UI to the loadout/skin customization mode. Hides character selection, shows loadout UI, enables the back button, sets up the current character's portrait and quotes, and focuses the `DressupPanel`.
* **Parameters:** None.
* **Returns:** Nothing.

### `PlayerReady()`
* **Description:** Finalizes character and skin selection for this player. Sends the finalized character and skin IDs to the server via `TheNet:SendLobbyCharacterRequestToServer`, hides loadout UI, and shows the “waiting for players” state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetPortraitImage()`
* **Description:** Updates the portrait and title text displayed in the loadout tab based on the currently selected character and skin. Shows/hides name badges, base title, and quotes depending on loaded assets and character/skin.
* **Parameters:** None.
* **Returns:** Nothing.

### `SelectPortrait()`
* **Description:** Updates the UI when the character selection changes (e.g., via scroll). Sets `currentcharacter`, updates the `DressupPanel`, refreshes description and quote fields, enables/disables the start button, and resets accept state.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoConfirmQuit()`
* **Description:** Pops up a confirmation dialog to disconnect/quit the lobby. Behavior differs for server vs. client (different dialog text). On confirmation, shuts down UI, kills game, and restarts the frontend.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input for scrolling through characters, navigating focus between widgets, returning from loadout/ready state, and controller-specific actions (e.g., random character/skin buttons). Routes input to `chatbox.textbox` if it has focus.
* **Parameters:** 
  * `control` (number) – Input control constant (e.g., `CONTROL_SCROLLBACK`, `CONTROL_CANCEL`).
  * `down` (boolean) – Whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if input was handled; `false` otherwise.

### `OnUpdate(dt)`
* **Description:** Updates state each frame. Refreshes the player list and waiting widget at `REFRESH_INTERVAL` (0.5s), updates character puppets’ emotes, and handles pending reset requests.
* **Parameters:** `dt` (number) – Delta time since last frame.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Starts lobby music when the screen becomes active.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnDestroy()`
* **Description:** Stops lobby music and cleans up when the screen is destroyed.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `lobbyplayerspawndelay` (from `TheWorld`) – Updates the spawn delay timer text and plays tick sound, triggers `StartGame` when time reaches `0`.
- **Pushes:** None (does not emit custom events).