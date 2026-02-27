---
id: worldcharacterselectlobby
title: Worldcharacterselectlobby
description: Manages the lobby phase before world spawn, including character selection, player readiness tracking, countdown logic, and match startup synchronization in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 6a785df5
---

# Worldcharacterselectlobby

## Overview
This component orchestrates the world character selection lobby—the period after world creation but before character spawning—by managing player readiness flags, countdown timers, client-server synchronization via network variables, and event-driven state transitions. It operates only on the master simulation (server) for authoritative logic while providing read-only data to clients.

## Dependencies & Tags
- Uses `TheWorld.components.lavaarenaanalytics` or `TheWorld.components.quagmireanalytics` for analytics reporting (if present).
- Registers network variables: `spawncharacterdelaydirty`, `lockedforshutdown`, and `player_ready_to_start_dirty`.
- Registers for events: `ms_requestedlobbycharacter`, `player_ready_to_start_dirty`, `ms_clientauthenticationcomplete`, `ms_clientdisconnected`, and `spawncharacterdelaydirty`.
- Tags the entity with wall-updating and regular update cycles during lobby phases via `StartWallUpdatingComponent` and `StartUpdatingComponent`.
- Does not add or remove standard component tags; relies solely on internal logic and networked state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity the component is attached to (the world entity). |
| `_world` | `TheWorld` | `TheWorld` | Reference to the global world object. |
| `_ismastersim` | `boolean` | `TheWorld.ismastersim` | Whether this instance is running on the master simulation. |
| `_countdowni` | `net_byte` | `COUNTDOWN_INACTIVE` (255) | Networked countdown timer value; synced across clients. |
| `_lockedforshutdown` | `net_bool` | `false` | Networked flag indicating if the server is locked for shutdown. |
| `_players_ready_to_start` | `table of net_string` | Array of empty strings | List of networked strings storing user IDs of players ready to start; max size = server max players. |
| `_lobby_up_time` | `number` | `0` | Real-world timestamp when the lobby started (set on first client connect). |
| `_client_wait_time` | `table` | `{}` | Map of `userid → connection timestamp` for wait-time analytics. |
| `_countdownf` | `number` | `-1` | Internal floating-point countdown counter (master only), decremented per frame. |

## Main Functions

### `GetSpawnDelay()`
* **Description:** Returns the current spawn delay. Returns `-1` if the lobby is inactive (no countdown in progress); otherwise returns the current integer countdown value (in seconds).
* **Parameters:** None.

### `IsAllowingCharacterSelect()` *(Master only)*
* **Description:** Determines if players can still select characters. Returns `true` only when no countdown is active (`_countdowni == COUNTDOWN_INACTIVE`) and the server is not locked for shutdown.
* **Parameters:** None.

### `IsServerLockedForShutdown()`
* **Description:** Returns whether the server has been flagged for pending shutdown.
* **Parameters:** None.

### `IsPlayerReadyToStart(userid)`
* **Description:** Checks if a given player (by `userid`) has signaled readiness to start the match.
* **Parameters:**  
  `userid` (string/number): The unique identifier of the player.

### `OnPostInit()` *(Master only)*
* **Description:** Called after world initialization. If a deferred server shutdown was requested, sets the `_lockedforshutdown` flag.
* **Parameters:** None.

### `Dump()`
* **Description:** Prints the current contents of `_players_ready_to_start` to the console for debugging (e.g., showing which players are ready).
* **Parameters:** None.

### `CanPlayersSpawn()`
* **Description:** Indicates whether players may now spawn—returns `true` when the internal countdown (`_countdownf`) has reached `0`.
* **Parameters:** None.

### `OnWallUpdate(dt)`
* **Description:** Decrements the internal countdown timer (`_countdownf`) by `dt`, and syncs the ceiling of the value to `_countdowni` when changed. Used during active countdown.
* **Parameters:**  
  `dt` (number): Delta time in seconds since last frame.

### `OnUpdate(dt)`
* **Description:** Monitors whether players remain connected or have spawned. Stops updating when all players disconnect or at least one spawns (by resetting `IsMatchStarting` flag and halting updates).
* **Parameters:**  
  `dt` (number): Delta time in seconds since last frame.

### `OnRequestLobbyCharacter(world, data)`
* **Description:** Handles a client's character choice submission. Sets the lobby character for the client, marks them as *not ready*, and initiates countdown if all players are ready.
* **Parameters:**  
  `world` (TheWorld): Reference to the world entity.  
  `data` (table): Contains `userid`, `prefab_name`, `skin_base`, `clothing_body`, `clothing_hand`, `clothing_legs`, `clothing_feet`.

### `OnLobbyClientConnected(src, data)`
* **Description:** Handles new client connection to the lobby. Clears ready flags, records connection time, updates lobby uptime, and sends analytics. If countdown is active, the joining client will not be able to participate.
* **Parameters:**  
  `src` (Entity): Source of the event (TheWorld).  
  `data` (table): Contains `userid`.

### `OnLobbyClientDisconnected(src, data)`
* **Description:** Handles client disconnection during the lobby. Clears ready flags, records disconnect analytics, cancels match if lobby becomes empty, and resets lobby uptime if no players remain.
* **Parameters:**  
  `src` (Entity): Source of the event (TheWorld).  
  `data` (table): Contains `userid`.

### `StarTimer(time)`
* **Description:** Starts the spawn countdown for the given duration (`time`). Locks new connections, sets match-starting flag, clears ready flags, and transitions the component to wall-updating mode.
* **Parameters:**  
  `time` (number): Duration of countdown in seconds.

### `CountPlayersReadyToStart()`
* **Description:** Counts and returns the number of players marked as ready to start.
* **Parameters:** None.

### `TryStartCountdown()`
* **Description:** Checks if all connected lobby clients are ready. If so, starts the countdown. Only runs when character selection is allowed.
* **Parameters:** None.

### `SetPlayerReadyToStart(userid, is_ready)`
* **Description:** Explicitly sets a player’s ready state. Does nothing if countdown is active.
* **Parameters:**  
  `userid` (string/number): Player identifier.  
  `is_ready` (boolean): `true` to mark ready, `false` to mark not ready.

### `TogglePlayerReadyToStart(userid)`
* **Description:** Toggles the ready state of a player. Does nothing if countdown is active.
* **Parameters:**  
  `userid` (string/number): Player identifier.

### `ClearAllPlayersReadyToStart()`
* **Description:** Clears all ready flags for every player slot.
* **Parameters:** None.

### `CalcLobbyUpTime()`
* **Description:** Returns the elapsed real time (in seconds) since `_lobby_up_time` was set, or `0` if unset.
* **Parameters:** None.

## Save/Load Functions

### `OnSave()` *(Master only)*
* **Description:** Saves whether the match countdown completed (`_countdowni == 0`) to disk.
* **Returns:** Table `{ match_started = boolean }`.

### `OnLoad(data)` *(Master only)*
* **Description:** Restores lobby state on world load. If match had started, re-initializes countdown state and prevents new connections.
* **Parameters:**  
  `data` (table): Saved state from `OnSave()`.

## Events & Listeners

- **Listens to:**
  - `spawncharacterdelaydirty`: Triggers `OnCountdownDirty` to propagate countdown changes to clients.
  - `player_ready_to_start_dirty`: Triggers `TryStartCountdown` to re-evaluate starting countdown when any player toggles readiness.
  - `ms_requestedlobbycharacter`: Handles character selection requests from clients.
  - `ms_clientauthenticationcomplete`: Handles new client connections to the lobby.
  - `ms_clientdisconnected`: Handles client disconnections.

- **Emits:**
  - `lobbyplayerspawndelay`: Broadcasts the current countdown time (`time`) and active status to clients via `TheWorld:PushEvent(...)`.
  - Analytics events via `analytics:SendAnalyticsLobbyEvent(...)` when supported (e.g., `"lobby.join"`, `"lobby.leave"`, `"lobby.startmatch"`, `"lobby.cancelmatch"`, `"lobby.clientstartmatch"`).