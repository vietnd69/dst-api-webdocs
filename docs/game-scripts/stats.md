---
id: stats
title: Stats
description: Collects and sends gameplay metrics and session statistics to the analytics backend.
tags: [analytics, network, session]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: e6338401
system_scope: network
---

# Stats

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `stats.lua` module is responsible for gathering, formatting, and transmitting gameplay telemetry and session metadata. It collects user-specific information (e.g., install ID, play session duration), world state data (e.g., save/session identifiers), and game events (e.g., session start, game start). It is not a component attached to entities but a top-level utility script providing global functions and internal tracking mechanisms used across the game and mods. Key functionality includes building contextual JSON payloads, managing accumulated profile stats, and interfacing with the engine’s analytics pipeline via `TheSim:SendProfileStats`.

## Usage example
```lua
-- Send a custom metrics event (e.g., upon completing an achievement)
local player = ThePlayer
local values = { achievement_id = "explore_caves", time_ms = 12345 }
Stats.PushMetricsEvent("achievement_complete", player, values, true)

-- Track a session-level statistic (e.g., number of meals cooked)
Stats.ProfileStatsAdd("meals_cooked", 5)
```

## Dependencies & tags
**Components used:** `age`, `shardstate`, `stackable` (via `PrefabListToMetrics`).  
**Tags:** None identified.

## Properties
No public properties. The module exposes global tables `ProfileStats` and `MainMenuStats` as module-level variables, and defines local tracking tables (`TrackingEventsStats`, `TrackingTimingStats`) for event/timing metrics.

## Main functions
### `BuildContextTable(player)`
*   **Description:** Builds a table of contextual metadata about the current game state and user, suitable for inclusion in telemetry payloads. May accept either a user ID string or a player entity/table with a `userid` field and optional `components`.
*   **Parameters:** `player` (string or table) – user identifier or player instance.
*   **Returns:** table – a dictionary containing fields like `user`, `user_age`, `build`, `install_id`, `session_id`, `save_id`, `master_save_id`, `world_time`, and `install_id`.
*   **Error states:** Returns `"unknown"` or `"testing"` for `user` if player context is unavailable; omits optional fields (e.g., `user_age`, `session_id`) if missing dependencies.

### `InitStats()`
*   **Description:** Initializes the analytics event listener for account-related events to trigger stats transmission on successful connection.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `PushMetricsEvent(event_id, player, values, is_only_local_users_data)`
*   **Description:** Constructs and sends a metrics event payload to the backend. Combines context data, event identifier, and optional key-value pairs into a JSON payload.
*   **Parameters:**  
    `event_id` (string) – the type of event (e.g., `"startup.gamestart"`).  
    `player` (string or table) – user identifier or player instance (see `BuildContextTable`).  
    `values` (table or nil) – optional key-value pairs to merge into the payload.  
    `is_only_local_users_data` (boolean) – flag indicating whether data contains only local user info (passed to engine API).
*   **Returns:** Nothing.

### `RecordSessionStartStats()`
*   **Description:** Sends a `sessionstart` event payload with startup context and enabled mod information. Only operates if `STATS_ENABLE` is true.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RecordGameStartStats()`
*   **Description:** Sends a `startup.gamestart` event payload with platform and app-data writability details. Only operates if `STATS_ENABLE` is true.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `PrefabListToMetrics(list)`
*   **Description:** Converts a list of items (e.g., inventory items) into a metrics-friendly list of `{ prefab = "name", count = N }` entries, accounting for stackable components.
*   **Parameters:** `list` (array of tables) – items with optional `prefab` and `stackable` component.
*   **Returns:** array of tables – aggregated counts per prefab.

### `ClearProfileStats()`
*   **Description:** Clears the global `ProfileStats` table.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ProfileStatsAdd(item, value)`
*   **Description:** Increments a numeric statistic in `ProfileStats`. If `value` is `nil`, increments by `1`.
*   **Parameters:**  
    `item` (string) – the statistic key.  
    `value` (number or nil) – the amount to add.
*   **Returns:** Nothing.

### `ProfileStatsSet(item, value)`
*   **Description:** Sets a statistic in `ProfileStats` to an explicit value.
*   **Parameters:**  
    `item` (string) – the statistic key.  
    `value` (any) – the value to assign.
*   **Returns:** Nothing.

### `ProfileStatsAddToField(field, value)`
*   **Description:** Adds to a nested numeric statistic in `ProfileStats` using dot-notation (e.g., `"boss.killed.jabberwock"`). Creates intermediate tables if needed.
*   **Parameters:**  
    `field` (string) – dot-separated field path.  
    `value` (number or nil) – amount to add (defaults to `1`).
*   **Returns:** Nothing.

### `SuUsed(item, value)`
*   **Description:** Marks `GameStats.super` as true and sets a statistic in `ProfileStats`.
*   **Parameters:**  
    `item` (string) – statistic key.  
    `value` (any) – statistic value.
*   **Returns:** Nothing.

### `WasSuUsed()`
*   **Description:** Returns whether any "super" statistic (via `SuUsed`/`SuUsedAdd`) has been recorded.
*   **Parameters:** None.
*   **Returns:** boolean – `true` if `GameStats.super` is set.

### `GetTestGroup()`
*   **Description:** Returns a test group ID (`0` or `1`) based on the Steam ID (hash modulo `2`). Non-Steam users get `0`.
*   **Parameters:** None.
*   **Returns:** number – `0` or `1`.

## Events & listeners
- **Listens to:** `account` events via `RegisterOnAccountEventListener(statsEventListener)` – specifically `SuccesfulConnect` fires `OnLaunchComplete()` upon successful login (event codes `3` or `6` with `success == true` and `sessionStatsSent == false`).
- **Pushes:** None (this module is for ingestion, not emission of game events).