---
id: worldcharacterselectlobby
title: Worldcharacterselectlobby
description: Manages the lobby state and countdown sequence before players spawn into a world, including tracking player readiness and handling analytics during match startup.
tags: [lobby, network, multiplayer, countdown, analytics]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6a785df5
system_scope: network
---
# Worldcharacterselectlobby

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Worldcharacterselectlobby` is a server-side and client-side component responsible for coordinating the character selection lobby and countdown before players spawn. On the master simulation (server), it tracks which players have selected their characters and are ready to start, initiates the countdown, manages match-starting state, and reports analytics events via `lavaarenaanalytics` or `quagmireanalytics`. On the client, it listens for countdown updates and broadcasts them to the UI. It integrates with `TheNet` to set match-starting flags and control new player connections.

## Usage example
```lua
local inst = TheWorld
if inst.components.worldcharacterselectlobby then
    local delay = inst.components.worldcharacterselectlobby:GetSpawnDelay()
    print("Spawn delay:", delay)
    if inst.components.worldcharacterselectlobby:IsServerLockedForShutdown() then
        print("Server locked for shutdown")
    end
end
```

## Dependencies & tags
**Components used:** `lavaarenaanalytics`, `quagmireanalytics`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity reference | `nil` | The entity (typically `TheWorld`) this component is attached to. |
| `_countdowni` | `net_byte` | `COUNTDOWN_INACTIVE` (255) | Network variable representing the current countdown value (seconds). |
| `_lockedforshutdown` | `net_bool` | `false` | Network variable indicating if the lobby is locked due to a pending server shutdown. |
| `_players_ready_to_start` | Array of `net_string` | Empty strings | Array of network strings, each holding a `userid` of a player who is ready to start; empty string means not ready. |
| `_lobby_up_time` | number | `0` | Timestamp (real seconds) when the lobby was first activated (on first client connect after server start). |
| `_client_wait_time` | `Table<string`, number> | `{}` | Maps `userid` to connection time (seconds) used for analytics. |

## Main functions
### `GetSpawnDelay()`
*   **Description:** Returns the current countdown delay in seconds, or `-1` if the lobby is inactive (not counting down).
*   **Parameters:** None.
*   **Returns:** `number` — countdown value if active (`>= 0`), otherwise `-1`.
*   **Error states:** None.

### `IsServerLockedForShutdown()`
*   **Description:** Checks whether the lobby is locked due to a pending server shutdown.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if locked for shutdown, `false` otherwise.

### `IsPlayerReadyToStart(userid)`
*   **Description:** Checks whether a given player (by `userid`) has marked themselves as ready to start.
*   **Parameters:** `userid` (string) — Unique identifier of the player.
*   **Returns:** `boolean` — `true` if the player is ready, `false` otherwise.

### `OnPostInit()`
*   **Description:** (Master simulation only) Called after the component is initialized. If a deferred server shutdown has been requested, it immediately locks the lobby.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Dump()`
*   **Description:** Logs the current contents of `_players_ready_to_start` to the console for debugging.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CanPlayersSpawn()`
*   **Description:** Checks whether the countdown has completed and players may spawn.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if countdown finished (`_countdownf == 0`), `false` otherwise.

### `IsAllowingCharacterSelect()`
*   **Description:** (Master simulation only) Determines if players are still allowed to select and set their lobby characters.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if the countdown is inactive and lobby is not locked.

### `OnWallUpdate(dt)`
*   **Description:** Called during wall updates while counting down. Decrements the internal countdown (`_countdownf`) and syncs the network variable (`_countdowni`) if changed.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called after the countdown finishes. Monitors player connections; if all players have disconnected or someone has spawned, resets the match-starting state and stops updating.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `spawncharacterdelaydirty` (on all) — triggers `OnCountdownDirty` to sync countdown state to the client.
  - `ms_requestedlobbycharacter` (master only) — handles player character selection via `OnRequestLobbyCharacter`.
  - `player_ready_to_start_dirty` (master only) — triggers `TryStartCountdown` when a player toggles readiness.
  - `ms_clientauthenticationcomplete` (master only) — handles new client connections via `OnLobbyClientConnected`.
  - `ms_clientdisconnected` (master only) — handles client disconnects via `OnLobbyClientDisconnected`.

- **Pushes:**
  - `lobbyplayerspawndelay` (client) — broadcast whenever `_countdowni` changes, containing `time` (seconds) and `active` (bool). Used to drive UI countdown displays.
