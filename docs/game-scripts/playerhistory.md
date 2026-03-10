---
id: playerhistory
title: PlayerHistory
description: Manages persistent tracking of player interactions, including playtime and last seen dates, across multiplayer sessions.
tags: [network, persistence, multiplayer]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 263b2314
system_scope: network
---

# PlayerHistory

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`PlayerHistory` is a persistence and network utility component that records and maintains a history of other players encountered during multiplayer sessions. It tracks metadata such as playtime, last seen date, server name, and character prefab. The component automatically updates its internal table from the current client list every 60 seconds and persists data using `SavePersistentString`. It supports two saved data versions (v1 and v2), automatically loads and upgrades older formats, and enforces expiration and entry limits to prevent unbounded growth.

## Usage example
```lua
local inst = TheWorld
inst:AddComponent("playerhistory")
inst.components.playerhistory:Load(function(success)
    if success then
        local history = inst.components.playerhistory:GetRows()
        -- process sorted history
    end
end)
inst.components.playerhistory:StartListening()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `seen_players` | table | `{}` | Map from `userid` to player record data (e.g., `name`, `last_seen_date`, `time_played_with`). |
| `seen_players_updatetime` | table | `{}` | Tracks the last simulation time each player was observed in the current session. |
| `task` | periodic task or `nil` | `nil` | Reference to the periodic task updating history. |
| `dirty` | boolean | `false` | Whether unsaved changes exist and require saving. |
| `target_max_entries` | number | `100` | Maximum number of player entries to retain before pruning. |

## Main functions
### `StartListening()`
* **Description:** Begins a periodic task that calls `UpdateHistoryFromClientTable` every 60 seconds to refresh the player history from the current network client list.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `self.task` is already set.

### `Reset()`
* **Description:** Clears all player history data, marks the state as dirty, and triggers an immediate save.
* **Parameters:** None.
* **Returns:** Nothing.

### `DiscardOldData()`
* **Description:** Removes entries older than `USER_HISTORY_EXPIRY_TIME` and truncates the list to `target_max_entries` by sorting and removing excess. Marks the state as dirty if changes occur.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateHistoryFromClientTable()`
* **Description:** Syncs player history by iterating over `TheNet:GetClientTable()`. For each client (excluding self and dedicated server host), it updates or creates an entry, accumulates playtime, and updates metadata. Removes stale entries for disconnected players and saves the updated history.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetRows()`
* **Description:** Returns a sorted copy of `seen_players` table, ordered primarily by `last_seen_date` (newest first), then by `time_played_with` (most first), and finally by `name` (alphabetical via `stringidsorter`).
* **Parameters:** None.
* **Returns:** `table` — A list of deep-copied player records.

### `GetRowsMostTime()`
* **Description:** Returns a sorted copy of `seen_players`, ordered primarily by `time_played_with` (most first), then by `last_seen_date` (newest first), and finally by `name` (alphabetical).
* **Parameters:** None.
* **Returns:** `table` — A list of deep-copied player records.

### `RemoveUser(userid)`
* **Description:** Removes the specified `userid` from the history, marks the state as dirty, and triggers an immediate save.
* **Parameters:** `userid` (string or number) — The unique identifier of the player to remove.
* **Returns:** Nothing.

### `Save(callback)`
* **Description:** Encodes `seen_players` as JSON and saves it to persistent storage using `SavePersistentString`. Only executes if `self.dirty` is `true`.
* **Parameters:** `callback` (function or `nil`) — Optional function to invoke with `(success)` after the save completes.
* **Returns:** Nothing.

### `Load(callback)`
* **Description:** Loads saved data via `TheSim:GetPersistentString`, decodes JSON, handles versioning (v1 or v2), runs `DiscardOldData`, and resets the `dirty` flag. Invokes the optional callback with `success` status.
* **Parameters:** `callback` (function or `nil`) — Optional function to invoke with `(success)` after the load completes.
* **Returns:** Nothing.

### `GetSaveName()`
* **Description:** Returns the storage key used for saving and loading history data. Uses `"player_history"` in release builds; otherwise appends the current branch name.
* **Parameters:** None.
* **Returns:** `string` — The key name for persistent storage.

### `SortBackwards(field)`
* **Description:** Deprecated placeholder; prints a deprecation warning and does nothing.
* **Parameters:** `field` (any) — Unused.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified