---
id: waitingforplayers
title: Waitingforplayers
description: Manages the lobby UI grid showing player avatars, readiness states, and local player voting functionality during the waiting-for-players phase before world spawn.
tags: [lobby, ui, network, player]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 354b19b5
system_scope: ui
---

# Waitingforplayers

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Waitingforplayers` is a UI widget that displays player avatars and readiness indicators in the lobby screen. It renders a grid of player puppets representing connected clients, updates their readiness states, and provides a checkbox for the local player to signal readiness or vote to force-start the game. It reacts to network events (`player_ready_to_start_dirty`, `lobbyplayerspawndelay`) and integrates with `WorldCharacterSelectLobby` to query readiness status.

## Usage example
```lua
local waiting_screen = CreateWidget("WaitingForPlayers", owner, TheNet:GetServerMaxPlayers())
waiting_screen:Refresh(true) -- force refresh of all player listings
-- The widget automatically updates on network events and input actions
```

## Dependencies & tags
**Components used:** `worldcharacterselectlobby` (via `TheWorld.net.components.worldcharacterselectlobby:IsPlayerReadyToStart(...)`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `userdata` (Entity) | — | The entity instance that owns this widget. |
| `players` | `table` | `[]` | Current list of connected players (as returned by `TheNet:GetClientTable()`), filtered to exclude dedicated server hosts. |
| `player_listing` | `table` of `PlayerAvatarPortrait` widgets | `nil` | Array of avatar widgets representing player slots. |
| `proot` | `Widget` | — | Root container widget for layout. |
| `list_root` | `Grid` | — | Grid layout container for player avatars. |
| `playerready_checkbox` | `LabelCheckbox` widget | — | Checkbox for local player to mark readiness or vote to start. |
| `spawn_countdown_active` | `boolean` | `false` | Flag indicating if a spawn delay countdown is active. |

## Main functions
### `IsServerFull()`
* **Description:** Determines whether the server has reached its maximum player capacity.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the number of connected players equals `TheNet:GetServerMaxPlayers()`, otherwise `false`.

### `GetPlayerTable()`
* **Description:** Retrieves the filtered list of connected players suitable for display in the lobby UI. Removes dedicated server host entries (when not client-hosted) and optionally prioritizes the local player.
* **Parameters:** None.
* **Returns:** `table` — Array of player data objects (each with `userid`, `name`, `colour`, `lobbycharacter`, `performance`, etc.).

### `Refresh(force)`
* **Description:** Updates the avatar grid and player data. Rebuilds player listings only when necessary unless `force` is `true`.
* **Parameters:** `force` (boolean) — If `true`, forces refresh of all player slots regardless of whether data changed.
* **Returns:** Nothing.

### `RefreshPlayersReady()`
* **Description:** Updates readiness indicators for each player avatar and manages visibility/state of the local player checkbox. Adjusts text based on server fullness and active spawn countdown.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input events. Specifically triggers the player-ready checkbox when `CONTROL_PAUSE` is released and the checkbox is enabled.
* **Parameters:** 
  * `control` (`number`) — The control code (e.g., `CONTROL_PAUSE`).
  * `down` (`boolean`) — Whether the control is pressed (`true`) or released (`false`).
* **Returns:** `boolean` — `true` if the event was handled, otherwise `false`.

### `GetHelpText()`
* **Description:** Returns localized help text instructions for the local player's available controls (e.g., how to toggle readiness).
* **Parameters:** None.
* **Returns:** `string` — Concatenated help string, potentially including control key + action text.

## Events & listeners
- **Listens to:** `player_ready_to_start_dirty` (from `TheWorld.net`) — Triggers `RefreshPlayersReady()` to update readiness states, and manages checkbox timeout task cancellation.
- **Listens to:** `lobbyplayerspawndelay` (from `TheWorld`) — Activates or deactivates the spawn countdown display and adjusts checkbox state when countdown is active.