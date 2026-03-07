---
id: worldoverseer
title: Worldoverseer
description: Tracks player activity, equipment usage, crafting, and session metrics for analytics reporting in multiplayer games.
tags: [analytics, multiplayer, tracking]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 656a30f6
system_scope: world
---

# Worldoverseer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WorldOverseer` is a singleton-like component responsible for collecting and reporting detailed player statistics and gameplay metrics. It tracks when players join/leave, records clothing/equipment wear durations, monitors crafting activity, captures death events, and aggregates periodic session-level and player-level data for remote analytics. It runs automatically on `TheWorld` entity and leverages periodic tasks to flush collected data to `TheSim:SendProfileStats()`.

Key integrations include:
- `age` component for player age in days
- `inventory` component to reference all current items
- `skinner` component for clothing/equipment tracking

## Usage example
```lua
-- Automatically added to TheWorld in the core game
-- Modders typically interact with it by listening to its events or checking its internal state
-- Example: retrieving player stats after a session
local stats = TheWorld.components.worldoverseer:CalcPlayerStats()
for _, stat in ipairs(stats) do
    print("Player:", stat.player.prefab, "Playtime:", stat.secondsplayed)
end
```

## Dependencies & tags
**Components used:** `age`, `inventory`, `skinner`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance (typically `TheWorld`) that owns this component. |
| `data` | `table` | `{}` | Reserved data storage; currently unused. |
| `_seenplayers` | `table` | `{}` | Tracks per-player statistics (`player` → stats table) during current timeframe. |
| `_cycles` | `number?` | `nil` | Current world cycle count (from `cycleschanged` event). |
| `_daytime` | `number?` | `nil` | Current time of day (from `clocktick` event). |
| `_v2_seenplayers` | `table` | `{}` | Tracks players by `userid` for session-based analytics (V2 schema). |
| `last_heartbeat_poll_time` | `number` | `os.time()` | Last timestamp of `HeartbeatPoll` execution. |
| `heartbeat_poll_counter` | `number` | `0` | Accumulated interval for heartbeat polling. |

## Main functions
### `OnPlayerJoined(src, player)`
*   **Description:** Registers a player’s arrival, starts time tracking, and sets up event listeners for that player (death, clothing, crafting, equipping).
*   **Parameters:** `src` (`Entity?`) — event source; `player` (`Entity`) — the player entity.
*   **Returns:** Nothing.
*   **Error states:** Manually records initial clothing if `skinner` component exists but events were missed during startup.

### `OnPlayerLeft(src, player)`
*   **Description:** Finalizes time tracking for the player and updates `worn_items` end times.
*   **Parameters:** `src` (`Entity?`) — event source; `player` (`Entity`) — the player entity.
*   **Returns:** Nothing.

### `CalcIndividualPlayerStats(player)`
*   **Description:** Computes aggregated statistics for a single player: total playtime, time spent wearing each item, and craft counts.
*   **Parameters:** `player` (`Entity`) — player entity to calculate stats for.
*   **Returns:** `stats` (`table`) and `shouldremove` (`boolean`).  
    `stats` includes:  
    - `player`: player entity  
    - `secondsplayed`: total playtime in seconds  
    - `worn_items`: `{ [item_name] = total_time }`  
    - `crafted_items`: `{ [item_name] = count }`  
    `shouldremove` is `true` if the player has fully disconnected and stats should be purged.

### `DumpIndividualPlayerStats(stat, event)`
*   **Description:** Formats and sends individual player analytics data to `TheSim:SendProfileStats()`.
*   **Parameters:** `stat` (`table`) — result from `CalcIndividualPlayerStats`; `event` (`string`) — event name (e.g., `"heartbeat.player"`).
*   **Returns:** Nothing.

### `DumpPlayerStats()`
*   **Description:** Calls `CalcPlayerStats()` and `DumpIndividualPlayerStats()` for every tracked player with event `"heartbeat.player"`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DumpSessionStats()`
*   **Description:** Generates and sends a session-level analytics payload (e.g., server config, game mode, recipe items present in world).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Heartbeat()`
*   **Description:** Fires every `WORLDOVERSEER_HEARTBEAT` (5 minutes). Calls `DumpPlayerStats()` and `DumpSessionStats()`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HeartbeatPoll()`
*   **Description:** Runs every `WORLDOVERSEER_HEARTBEAT_POLL` (5 seconds) **only on the master shard**. Tracks per-player session lifecycle using `userid` (V2 metrics).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `not TheWorld.ismastershard`. Detects long pauses (e.g., OS suspend/resume) and restarts sessions.

### `SendClientJoin(userid, data)`
*   **Description:** Sends a `"SESSION_BEGIN"` analytics event for a new player session.
*   **Parameters:** `userid` (`string`) — unique user ID; `data` (`table`) — includes `gameplay_session_id` and `prefab`.
*   **Returns:** Nothing.

### `SendClientHeartBeat(userid, data)`
*   **Description:** Sends a `"HEARTBEAT"` analytics event for ongoing player session.
*   **Parameters:** `userid` (`string`); `data` (`table`) — includes `gameplay_session_id` and `prefab`.
*   **Returns:** Nothing.

### `SendClientQuit(userid, data)`
*   **Description:** Sends a `"SESSION_END"` analytics event for a player session.
*   **Parameters:** `userid` (`string`); `data` (`table`) — includes `gameplay_session_id` and `prefab`.
*   **Returns:** Nothing.

### `QuitAll()`
*   **Description:** Sends `"SESSION_END"` events for all tracked players in `_v2_seenplayers`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnPlayerDeath(player, data)`
*   **Description:** Records death event with player age (days), world age, and death cause.
*   **Parameters:** `player` (`Entity`) — deceased player; `data` (`table`) — includes `cause`.
*   **Returns:** Nothing.

### `OnPlayerChangedSkin(player, data)`
*   **Description:** Updates `worn_items` tracking when a player changes skins (e.g., via clothing).
*   **Parameters:** `player` (`Entity`); `data` (`table`) — includes `old_skin` and `new_skin`.
*   **Returns:** Nothing.

### `OnItemCrafted(player, data)`
*   **Description:** Records item crafting activity.
*   **Parameters:** `player` (`Entity`); `data` (`table`) — includes `skin`.
*   **Returns:** Nothing.

### `OnEquipSkinnedItem(player, data)`
*   **Description:** Records time start for a newly equipped item.
*   **Parameters:** `player` (`Entity`); `data` (`string`) — skin name.
*   **Returns:** Nothing.

### `OnUnequipSkinnedItem(player, data)`
*   **Description:** Records time end for an unequipped item.
*   **Parameters:** `player` (`Entity`); `data` (`string`) — skin name.
*   **Returns:** Nothing.

### `GetWorldRecipeItems()`
*   **Description:** Returns a list of all unique recipe items currently present in the world (via `Ents`).
*   **Parameters:** None.
*   **Returns:** `items` (`table?`) — array of prefab names, or `nil` if world or entities unavailable.

## Events & listeners
- **Listens to:**
  - `"ms_playerjoined"` — new player join.
  - `"ms_playerleft"` — player disconnect.
  - `"cycleschanged"` — updates `self._cycles`.
  - `"clocktick"` — updates `self._daytime`.
  - `"death"` — on each player entity.
  - `"changeclothes"` — skin change.
  - `"buildstructure"`, `"builditem"` — crafting.
  - `"equipskinneditem"`, `"unequipskinneditem"` — equipment changes.
- **Pushes:** None — this component only sends data via `TheSim:SendProfileStats`.
