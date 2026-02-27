---
id: inspectaclesparticipant
title: Inspectaclesparticipant
description: Manages the state, puzzle generation, and gameplay logic for the Inspectacles minigame system on a per-entity basis.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 029562b2
---

# Inspectaclesparticipant

## Overview
This component implements the core logic for the Inspectacles minigame system, including puzzle generation, game state management, cooldown handling, box creation, and client-server synchronization. It operates on an entity (typically a player) and coordinates interactions between the minigame logic, inventory events, and world placement.

## Dependencies & Tags
- **Events listened on:** `"inspectaclesgamechanged"`, `"ms_closepopup"`, `"itemget"`, `"equip"`, `"itemlose"`, `"unequip"`, `"onremove"`, `"onremove"` (on box entity).
- **Components used implicitly via `inst`:** `inventory`, `player_classified`, `skilltreeupdater`.
- **Tags observed:** `"inspectaclesvision"` (on items), `"inspectaclesbox"`, `"inspectaclesbox2"`.
- **Tags not explicitly added or removed by this component itself.**

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owner entity. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Whether this is the master simulation (server). |
| `GRIDSIZE` | `number` | `3` | Hardcoded grid size used in UI rendering. |
| `VALIDVALUEMAX` | `number` | `4` | Upper bound (exclusive) for puzzle data values (0–3 inclusive). |
| `CLIENT_game` | `table` / `nil` | `nil` | Client-side game metadata (from `INSPECTACLES_GAMES_LOOKUP`). |
| `CLIENT_puzzle` | `number` / `nil` | `nil` | Client-side computed puzzle ID. |
| `CLIENT_puzzledata` | `table` / `nil` | `nil` | Client-side ring-buffer puzzle data. |
| `game` | `table` / `nil` | `nil` | Server-side active game object. |
| `posx`, `posz` | `number` / `nil` | `nil` | Server-side world coordinates of the game location. |
| `puzzle` | `number` / `nil` | `nil` | Server-side computed puzzle ID. |
| `puzzledata` | `table` / `nil` | `nil` | Server-side ring-buffer puzzle data. |
| `box` | `Entity` / `nil` | `nil` | Reference to the spawned inspectacles box prefab. |
| `hide` | `boolean` / `nil` | `nil` | Whether the current game is hidden (not visible). |
| `upgraded` | `boolean` / `nil` | `nil` | Whether the inspectacles box is upgraded (via skill). |
| `shardid` | `number` / `nil` | `nil` | Shard ID where the game was created (for shard-scoped games). |
| `oninittask` | `Tasks` / `nil` | `nil` | One-shot task triggered on init to initialize the game state. |
| `cooldowntask` | `Tasks` / `nil` | `nil` | Timer task for the cooldown period after finishing a game. |

## Main Functions
### `CalculateGamePuzzle(gameid, posx, posz)`
* **Description:** Computes a deterministic puzzle ID from game ID and world position using bit manipulation to ensure client and server generate identical puzzles.
* **Parameters:**  
  - `gameid`: `number` — Integer ID of the game (from `INSPECTACLES_GAMES`).  
  - `posx`, `posz`: `number` — World coordinates of the game location.

### `GetPuzzleData(puzzle)`
* **Description:** Converts the numeric `puzzle` ID into a 12–18 element ring buffer of small values (0–3) used for minigame input logic.
* **Parameters:**  
  - `puzzle`: `number` — Puzzle ID from `CalculateGamePuzzle`.

### `CheckGameSolution(solution)`
* **Description:** Validates the player-submitted solution; currently only accepts `solution == 0` as valid on server.
* **Parameters:**  
  - `solution`: `number` — Player’s submitted answer (0–3 typically).

### `SetCurrentGame(gameid, posx, posz)`
* **Description:** Sets the active game state on the server (including puzzle and puzzle data), updates network variables, and triggers box creation.
* **Parameters:**  
  - `gameid`: `number` / `nil` — Game ID or `nil` to clear the game.  
  - `posx`, `posz`: `number` — Game position.

### `CreateNewAndOrShowCurrentGame()`
* **Description:** If no active game exists, spawns a new one at a valid location, sets up the puzzle, creates/shows the box, and handles upgraded-box logic. Returns `true` on success.
* **Parameters:** None.

### `FindGameLocation(gameid)`
* **Description:** Finds a walkable, safe (non-hole) location near the entity to spawn the game, prioritizing closer positions.
* **Parameters:** None.

### `CreateBox()`
* **Description:** Spawns either `"inspectaclesbox"` or `"inspectaclesbox2"` (if upgraded), positions it, marks it viewable by the owner, and sets up cleanup events.
* **Parameters:** None.

### `UpdateBox()`
* **Description:** Ensures the game box exists on the server (calls `CreateBox()` if missing).
* **Parameters:** None.

### `GrantRewards()`
* **Description:** Triggers loot pinsata effects on the box (server only).
* **Parameters:** None.

### `UpdateInspectacles()`
* **Description:** Updates all equipped items with the `"inspectaclesvision"` tag (e.g., updates their visuals or state).
* **Parameters:** None.

### `FinishCurrentGame()`
* **Description:** Finalizes the current game: grants rewards, resets game state, starts cooldown, and updates inspectacles visuals.
* **Parameters:** None.

### `IsFreeGame(game)`
* **Description:** Returns `true` if the game is marked as `"NONE"` or starts with `"FREE"` (no minigime required).
* **Parameters:**  
  - `game`: `string` — Game name or identifier.

### `HideCurrentGame()` / `ShowCurrentGame()`
* **Description:** Controls visibility of the current game on the network (server only). `Hide` suppresses network broadcast; `Show` restores it.
* **Parameters:** None.

### `ApplyCooldown(overridetime)`
* **Description:** Starts or resets a cooldown timer; prevents new games from starting until elapsed.
* **Parameters:**  
  - `overridetime`: `number` / `nil` — Optional custom cooldown duration.

### `IsInCooldown()`
* **Description:** Returns `true` if the cooldown timer is active.
* **Parameters:** None.

### `IsUpgradedBox()`
* **Description:** Returns `true` if the current box (if any) is upgraded via skill.
* **Parameters:** None.

### `OnCooldownFinished()`
* **Description:** Handler for cooldown expiration: restarts game if an inspectacles vision item is equipped, and updates visuals.
* **Parameters:** None.

### `GetCLIENTDetails()` / `GetSERVERDetails()`
* **Description:** Returns current game, puzzle, and puzzle data for client/server respectively.
* **Parameters:** None.

### `OnSave()` / `OnLoad(data)`
* **Description:** Serializes/deserializes game state (including active game, cooldown, and box upgrade status).
* **Parameters:**  
  - `data`: `table` / `nil` — Serialized data from `OnSave()`.

### `OnSignalPulse()`
* **Description:** Triggers client-side `inspectaclesping` event or server-side `UpdateBox()` call.
* **Parameters:** None.

### `IsParticipantClose(range)`
* **Description:** Checks if the entity is within a given range (in world units) of the game location or box.
* **Parameters:**  
  - `range`: `number` — Distance threshold (default `4`).

### `LongUpdate(dt)`
* **Description:** Synchronizes the cooldown timer task across simulation frames.
* **Parameters:**  
  - `dt`: `number` — Delta time.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing current game state.
* **Parameters:** None.

## Events & Listeners
- **Listens for `"inspectaclesgamechanged"`** → triggers `OnInspectaclesGameChanged`.
- **Listens for `"ms_closepopup"` (master sim only)** → triggers `OnClosePopup`.
- **Listens for `"itemget"`, `"equip"`, `"itemlose"`, `"unequip"` (master sim only)** → triggers `OnEquipChanged`, which may call `UpdateInspectacles()` if an `"inspectaclesvision"` item changed.
- **Listens for `"onremove"` (on self and box entities)** → cleans up box reference or state.