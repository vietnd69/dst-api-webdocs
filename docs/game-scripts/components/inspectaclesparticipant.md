---
id: inspectaclesparticipant
title: Inspectaclesparticipant
description: Manages the state and behavior of the Inspectacles minigame system for an entity, including puzzle generation, game setup, reward granting, and client-server synchronization.
tags: [minigame, puzzle, inventory, synchronization, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 029562b2
system_scope: entity
---

# Inspectaclesparticipant

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`InspectaclesParticipant` handles the lifecycle of an Inspectacles minigame session for an entity (typically a player). It generates deterministic puzzles using world position and game ID, manages the box and its visual state (shown/hidden), handles cooldowns, grants rewards upon successful completion, and synchronizes game state between client and server via networked component fields. It interacts closely with the `inventory` component to check for vision-aiding items and the `skilltreeupdater` component to determine upgraded box eligibility.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inspectaclesparticipant")
inst.components.inspectaclesparticipant:SetCurrentGame(3, 120, -80)
inst.components.inspectaclesparticipant:CreateNewAndOrShowCurrentGame()
```

## Dependencies & tags
**Components used:** `inventory`, `skilltreeupdater`
**Tags:** Checks `inspectaclesvision` (on items); no tags are added or removed directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `ismastersim` | boolean | — | True if the current instance is the master simulation (server). |
| `GRIDSIZE` | number | `3` | Constant used in the UI widget layout. |
| `VALIDVALUEMAX` | number | `4` | Upper bound (exclusive) for puzzle value range `[0, 3]`. |
| `game` | string? | `nil` | Server-side active game name (e.g., `"FREE_0"`). |
| `posx`, `posz` | number? | `nil` | Server-side world coordinates of the game location. |
| `puzzle`, `puzzledata` | — | `nil` | Server-side computed puzzle ID and ring-buffer data. |
| `CLIENT_game`, `CLIENT_puzzle`, `CLIENT_puzzledata` | — | `nil` | Client-side cached values set via `inspectaclesgamechanged` event. |
| `hide` | boolean? | `nil` | Server-side flag indicating if the current game box is hidden. |
| `box` | `Entity`? | `nil` | Reference to the spawned `inspectaclesbox` (or `inspectaclesbox2` if upgraded) entity. |
| `shardid` | number? | `nil` | Shard ID at the time of game start, used to restrict participation to the correct shard. |
| `upgraded` | boolean? | `nil` | Server-side flag indicating whether the box should be upgraded. |
| `cooldowntask` | `Task`? | `nil` | Server-side delayed task tracking the cooldown before next game can start. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up event listeners and cancels pending tasks when the component is removed from the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnClosePopup(data)`
*   **Description:** Validates solution submitted via the Inspectacles popup and finishes the game if correct.
*   **Parameters:**  
    `data` (table) — Popup close event data; expects `data.popup == POPUPS.INSPECTACLES` and `data.args[1]` as the submitted solution.
*   **Returns:** Nothing.
*   **Error states:** Only proceeds if the submitted `solution` equals `0`; otherwise, does nothing.

### `CalculateGamePuzzle(gameid, posx, posz)`
*   **Description:** Computes a deterministic puzzle ID using `gameid` and world tile coordinates at `(posx, posz)`; ensures identical puzzle generation on client and server.
*   **Parameters:**  
    `gameid` (number) — Numeric ID for the game type.  
    `posx`, `posz` (numbers) — World coordinates (floats).
*   **Returns:** number — A 24-bit puzzle ID (`0xFFFFFF` masked).

### `GetPuzzleData(puzzle)`
*   **Description:** Converts a puzzle ID into a ring-buffer of nibble-sized values (0–3) for use in the minigame UI and logic.
*   **Parameters:**  
    `puzzle` (number) — Puzzle ID (typically output of `CalculateGamePuzzle`).
*   **Returns:** table — Ring-buffer object with `.size`, `.index`, `.GetNext()`, `.Reset()`, and numeric values.

### `CheckGameSolution(solution)`
*   **Description:** Validates a submitted solution on the server.
*   **Parameters:**  
    `solution` (number) — Submitted answer.
*   **Returns:** boolean — `true` only if `solution == 0` (hardcoded pass condition).
*   **Error states:** Returns `false` on client; no assert if called client-side.

### `OnInspectaclesGameChanged(data)`
*   **Description:** Updates client-side state when the game changes (e.g., `inspectaclesgamechanged` event).
*   **Parameters:**  
    `data` (table) — Contains `gameid`, `posx`, `posz`.
*   **Returns:** Nothing.
*   **Error states:** Only processes if `self.inst == ThePlayer`; clears client cache on `gameid == 0`.

### `OnSignalPulse()`
*   **Description:** Triggers client-side game ping or server-side box update.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsParticipantClose(range)`
*   **Description:** Checks whether the participant entity is within a given range of the game’s active location.
*   **Parameters:**  
    `range` (number?, optional) — Distance threshold; defaults to `4`.
*   **Returns:** boolean — `true` if within range, `false` otherwise.

### `GetCLIENTDetails()` / `GetSERVERDetails()`
*   **Description:** Returns cached client/server puzzle data.
*   **Parameters:** None.
*   **Returns:** (game, puzzle, puzzledata) — Values as defined by `CLIENT_*` or `game`, `puzzle`, `puzzledata`.

### `IsFreeGame(game)`
*   **Description:** Checks if the game is a no-minigame type (no interaction required).
*   **Parameters:**  
    `game` (string?) — Game name (e.g., `"NONE"` or `"FREE_*"`).
*   **Returns:** boolean — `true` if game type requires no minigame.

### `NetworkCurrentGame()`
*   **Description:** Syncs current game data to the `player_classified.inspectacles_*` networked fields.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if not master-sim; also no-ops if `player_classified` is missing.

### `SetCurrentGame(gameid, posx, posz)`
*   **Description:** Initializes or clears the current game session (server-only).
*   **Parameters:**  
    `gameid` (number?) — Game ID (`nil` clears the session).  
    `posx`, `posz` (numbers) — World coordinates of the game location.
*   **Returns:** Nothing.

### `FindGameLocation(gameid)`
*   **Description:** Finds a walkable, hole-free location near the participant to place the game box.
*   **Parameters:**  
    `gameid` (number) — Game ID (unused internally, but passed for consistency).
*   **Returns:** number?, number? — `(x, z)` coordinates or `nil, nil` on failure.

### `CreateBox()`
*   **Description:** Spawns the game box (`inspectaclesbox` or `inspectaclesbox2`) and configures it.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if not master-sim or if `self.box` already exists.

### `CanCreateGameInWorld()`
*   **Description:** Checks if the world permits Inspectacles minigames.
*   **Parameters:** None.
*   **Returns:** boolean — `false` in cave worlds (`"cave"` tag present).

### `CreateNewAndOrShowCurrentGame()`
*   **Description:** Creates a new game (if none exists) and shows its box; handles cooldowns and upgrades.
*   **Parameters:** None.
*   **Returns:** boolean — `true` if a new game was created, `false` otherwise.

### `FinishCurrentGame()`
*   **Description:** Finalizes the current game session: grants rewards, resets state, and starts cooldown.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateBox()`
*   **Description:** Ensures the game box exists on the server; creates it if missing.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GrantRewards()`
*   **Description:** Triggers loot pinata on the game box to distribute rewards.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateInspectacles()`
*   **Description:** Refreshes the visual state of all items tagged `inspectaclesvision`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HideCurrentGame()` / `ShowCurrentGame()`
*   **Description:** Sets or clears the `hide` flag and synchronizes it.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if not master-sim, no active game, or already in requested state.

### `OnCooldownFinished()`
*   **Description:** Called when the cooldown ends: attempts to start a new game if `inspectaclesvision` item is equipped.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ApplyCooldown(overridetime)`
*   **Description:** Starts or resets the cooldown timer.
*   **Parameters:**  
    `overridetime` (number?, optional) — Cooldown duration in seconds (defaults to `TUNING.SKILLS.WINONA.INSPECTACLES_COOLDOWNTIME`).
*   **Returns:** Nothing.
*   **Error states:** No-op if not master-sim or if a game is already active.

### `IsInCooldown()`
*   **Description:** Checks whether a cooldown is currently active.
*   **Parameters:** None.
*   **Returns:** boolean — `true` if `cooldowntask` is set.

### `IsUpgradedBox()`
*   **Description:** Reports if the current game’s box is upgraded.
*   **Parameters:** None.
*   **Returns:** boolean? — `true`, `false`, or `nil`.

### `LongUpdate(dt)`
*   **Description:** Adjusts the remaining cooldown time (used during save/load or pause handling).
*   **Parameters:**  
    `dt` (number) — Delta time to adjust.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns serializable state for persistence (game data or cooldown state).
*   **Parameters:** None.
*   **Returns:** table? — Game or cooldown state; `nil` if none.

### `OnLoad(data)`
*   **Description:** Restores state from saved data.
*   **Parameters:**  
    `data` (table?) — Saved data.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Provides a human-readable debug summary of game state.
*   **Parameters:** None.
*   **Returns:** string — Formatted debug string (e.g., `"[HIDDEN] FREE_0 @(120, -80) Puzzle A1B2C3 Shard 1"`).

## Events & listeners
- **Listens to:**  
    `inspectaclesgamechanged` — Updates client-side game state.  
    `ms_closepopup` (server-only) — Handles popup solution submission.  
    `itemget`, `equip`, `itemlose`, `unequip` (server-only) — Triggers `UpdateInspectacles()` when `inspectaclesvision` items change.  
    `onremove` (on `self.box`) — Clears `self.box` reference when the box is removed.

- **Pushes:**  
    `inspectaclesping` (client-side) — Emitted with `{tx, tz}` when `OnSignalPulse()` is called and `CLIENT_game` is active.
