---
id: worldoverseer
title: Worldoverseer
description: Tracks player presence, gameplay sessions, equipment changes, crafting, and death events to aggregate and transmit analytics data about world activity.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 656a30f6
---

# Worldoverseer

## Overview
The Worldoverseer component monitors and logs player activity across gameplay sessions in Don't Starve Together. It tracks when players join or leave the world, records clothing/equipment changes, item crafting, player deaths, and periodically sends aggregated statistics (including session metadata and world state) to the SimAnalytics system. It maintains two parallel tracking systems: one for legacy analytics (`_seenplayers`) and one for modern session-based tracking (`_v2_seenplayers`), handling both heartbeat-style world-wide reports and per-player session lifecycle events.

## Dependencies & Tags
- `TheWorld`: Listens for world-level events (`ms_playerjoined`, `ms_playerleft`, `cycleschanged`, `clocktick`).
- `AllPlayers`: Iterates existing players on initialization.
- `Stats` module: Used to build context tables and format item lists.
- `json.encode_compliant`: For preparing analytics payloads.
- `TheSim:SendProfileStats(...)`: Primary output mechanism for stats.
- Tags added: None.
- Components used (via entity interaction, not self-added): `skinner`, `age`, `inventory`.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to (typically the world root). |
| `data` | `table` | `{}` | Unused placeholder table. |
| `_seenplayers` | `table` | `{}` | Legacy tracking structure for per-player activity metrics (start/end times, worn items, crafted items). |
| `_v2_seenplayers` | `table` | `{}` | Modern session-based tracking structure keyed by `userid`, storing `gameplay_session_id` and `prefab`. |
| `_cycles` | `number?` | `nil` | Current world cycle count (from `cycleschanged` event). |
| `_daytime` | `number?` | `nil` | Current world time (from `clocktick` event). |
| `last_heartbeat_poll_time` | `number` | `os.time()` | Timestamp of last `HeartbeatPoll` execution (used for suspend detection). |
| `heartbeat_poll_counter` | `number` | `0` | Accumulated time in seconds since last major `HeartbeatPoll` aggregation (used for scheduling global heartbeat events). |

## Main Functions

### `RecordPlayerJoined(player)`
* **Description:** Initializes or resets analytics tracking for a player who has joined the world. Records the start time, worn clothing, and prepares for crafting/death tracking.
* **Parameters:**
  * `player`: The `Player` entity joining.

### `RecordPlayerLeft(player)`
* **Description:** Finalizes analytics tracking for a player who has left, computing total playtime and closing open item wear periods.
* **Parameters:**
  * `player`: The `Player` entity who left.

### `CalcIndividualPlayerStats(player)`
* **Description:** Computes aggregated statistics (play time, total worn item durations, crafted item counts) for a single player. Returns the result and a flag indicating if the player record should be removed from `_seenplayers` (true if the player left).
* **Parameters:**
  * `player`: The `Player` entity whose stats to compute.

### `CalcPlayerStats()`
* **Description:** Computes stats for all currently tracked players and cleans up records for players who have left.
* **Returns:** An array of stat objects (one per player) suitable for `DumpIndividualPlayerStats`.

### `DumpIndividualPlayerStats(stat, event)`
* **Description:** Serializes and transmits analytics data for a single player's session or activity window.
* **Parameters:**
  * `stat`: Table containing player, `secondsplayed`, `worn_items`, `crafted_items`, and optionally `current_inventory`.
  * `event`: String identifier (e.g., `"heartbeat.player"`, `"player.leave_world"`).

### `DumpPlayerStats()`
* **Description:** Calls `CalcPlayerStats()` and sends all computed stats via `DumpIndividualPlayerStats` with `"heartbeat.player"` event.
* **Parameters:** None.

### `DumpSessionStats()`
* **Description:** Sends aggregated server/session-level analytics, including player count, gamemode, admin status, clan info, world age, and inventory of world items (via `GetWorldRecipeItems`).
* **Parameters:** None.

### `OnPlayerDeath(player, data)`
* **Description:** Sends a death analytics event including player age, world age, and cause of death.
* **Parameters:**
  * `player`: The `Player` entity that died.
  * `data`: Table containing `cause` of death (prefab for kills).

### `OnPlayerChangedSkin(player, data)`
* **Description:** Updates tracking for when a player changes outfit, ending the previous item's wear period and starting a new one.
* **Parameters:**
  * `player`: The `Player` entity.
  * `data`: Table with `old_skin` and `new_skin`.

### `OnItemCrafted(player, data)`
* **Description:** Records an item being crafted by the player.
* **Parameters:**
  * `player`: The `Player` entity.
  * `data`: Table with `skin` (prefab name) of the crafted item.

### `OnEquipSkinnedItem(player, data)`
* **Description:** Starts a new wearable item wear period (typically for non-skin items equipped with skins).
* **Parameters:**
  * `player`: The `Player` entity.
  * `data`: String—the name (prefab) of the equipped item.

### `OnUnequipSkinnedItem(player, data)`
* **Description:** Ends the current wear period for a specific item.
* **Parameters:**
  * `player`: The `Player` entity.
  * `data`: String—the name (prefab) of the unequipped item.

### `GetWorldRecipeItems()`
* **Description:** Scans the world for entities matching known recipes or prepared foods and returns a metrics-formatted list.
* **Returns:** List of recipe item prefabs, or `nil`.

### `Heartbeat()`
* **Description:** Main world-level periodic callback (every 5 minutes) that sends per-player stats and session stats.
* **Parameters:** None.

### `HeartbeatPoll()`
* **Description:** Low-frequency heartbeat (every 5 seconds) that manages per-player session tracking in `_v2_seenplayers`. Detects player joins, leaves, and suspend/resume events. Schedules and sends per-player `SESSION_BEGIN`, `HEARTBEAT`, and `SESSION_END` events.
* **Parameters:** None.

### `QuitAll()`
* **Description:** Forces `SESSION_END` events to be sent for all tracked players in `_v2_seenplayers`. Used on shutdown or shutdown-like events.
* **Parameters:** None.

### `SendClientJoin(userid, data)`
* **Description:** Sends a `SESSION_BEGIN` event for a player joining.
* **Parameters:**
  * `userid`: String—network ID of the client.
  * `data`: Table with `gameplay_session_id` and `prefab`.

### `SendClientHeartBeat(userid, data)`
* **Description:** Sends a `HEARTBEAT` event to report an active player session.
* **Parameters:**
  * `userid`: String—network ID of the client.
  * `data`: Table with `gameplay_session_id` and `prefab`.

### `SendClientQuit(userid, data)`
* **Description:** Sends a `SESSION_END` event for a player quitting.
* **Parameters:**
  * `userid`: String—network ID of the client.
  * `data`: Table with `gameplay_session_id` and `prefab`.

## Events & Listeners

- **Listens for:**
  - `"ms_playerjoined"` on `TheWorld` → `OnPlayerJoined`
  - `"ms_playerleft"` on `TheWorld` → `OnPlayerLeft`
  - `"cycleschanged"` on `TheWorld` → `OnCyclesChanged`
  - `"clocktick"` on `TheWorld` → `OnClockTick`
  - `"death"` on each `player` entity → `OnPlayerDeath`
  - `"changeclothes"` on each `player` entity → `OnPlayerChangedSkin`
  - `"buildstructure"` on each `player` entity → `OnItemCrafted`
  - `"builditem"` on each `player` entity → `OnItemCrafted`
  - `"equipskinneditem"` on each `player` entity → `OnEquipSkinnedItem`
  - `"unequipskinneditem"` on each `player` entity → `OnUnequipSkinnedItem`

- **Triggers (via `TheSim:SendProfileStats`):**
  - `"heartbeat.player"` — Per-player session stats.
  - `"heartbeat.session"` — Server/session-level stats.
  - `"player.death"` — Player death event.
  - `"SESSION_BEGIN"` — Player session start.
  - `"HEARTBEAT"` — Per-player session heartbeat.
  - `"SESSION_END"` — Player session end.