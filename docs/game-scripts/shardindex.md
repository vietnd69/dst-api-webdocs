---
id: shardindex
title: Shardindex
description: Manages persistent world, server, and session data for a game shard, including loading, saving, upgrades, and world generation overrides.
tags: [world, save, network, worldgen]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 3fe0356c
system_scope: world
---

# Shardindex

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`ShardIndex` is a core component responsible for managing persistent data for a game shard (e.g., `Master`, `Caves`). It handles serialization/deserialization of world and server configuration data, session identification, enabled mod state, and world generation overrides. It supports upgrade paths for persisted data across versions and integrates with `savefileupgrades` and `map/customize` for data validation and migration.

## Usage example
```lua
local shardindex = ShardIndex()
shardindex:Load(function()
    if shardindex:IsValid() and not shardindex:IsEmpty() then
        local world_opts = shardindex:GetGenOptions()
        local server_data = shardindex:GetServerData()
        print("Game mode:", shardindex:GetGameMode())
    end
end)
```

## Dependencies & tags
**Components used:** None (standalone data manager, not attached to entities).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ismaster` | boolean | `false` | Whether this shard index represents the `Master` shard. |
| `slot` | number or `nil` | `nil` | Cluster slot index (e.g., `0`, `1`, ...) for local or cluster saves. |
| `shard` | string or `nil` | `nil` | Shard name (e.g., `"Master"`, `"Caves"`). |
| `version` | number | `5` | Current shard index data format version. |
| `world` | table | `{options = {}}` | World generation options, including overrides. |
| `server` | table | `{}` | Server configuration (e.g., `game_mode`, `playstyle`). |
| `session_id` | string or `nil` | `nil` | Unique session identifier for the world. |
| `enabled_mods` | table | `{}` | Map of mod names to enabled/config state. |
| `valid` | boolean | `false` | Whether loaded data is valid. |
| `isdirty` | boolean | `false` | Whether data has unsaved changes. |

## Main functions
### `:Save(callback)`
*   **Description:** Persists the current `ShardIndex` state to disk (slot/shard-specific or global depending on context). Marks the index as no longer dirty after successful save.
*   **Parameters:** `callback` (function, optional) — Called upon completion (successful or skipped).
*   **Returns:** Nothing.
*   **Error states:** Skips saving if `invalid` is true or `isdirty` is false (and not on server).

### `:WriteTimeFile(callback)`
*   **Description:** Writes a timestamp file (`shardindex_time`) containing creation and last save time. Used for metadata tracking.
*   **Parameters:** `callback` (function, optional) — Called after writing completes.
*   **Returns:** Nothing.

### `:Load(callback)`
*   **Description:** Loads shard index data from disk. Behavior differs by environment: dedicated servers always load (valid), client-hosted servers require `Settings.save_slot`, others are marked invalid.
*   **Parameters:** `callback` (function, optional) — Called after loading completes.
*   **Returns:** Nothing.

### `:LoadShardInSlot(slot, shard, callback)`
*   **Description:** Explicitly loads shard index data for a specific slot and shard from `Cluster_XX/` folder.
*   **Parameters:**  
    * `slot` (number) — Cluster slot index.  
    * `shard` (string) — Shard name (e.g., `"Caves"`).  
    * `callback` (function, optional) — Called after loading.
*   **Returns:** Nothing.

### `:GetSaveData(callback)`
*   **Description:** Loads the world save data (entities, state) for the current session. Uses modern path (`Slot/Master/session_id`) unless legacy path is enforced.
*   **Parameters:** `callback` (function, optional) — Receives loaded save data table on success, or is called with no args on failure.
*   **Returns:** Nothing (asynchronous).

### `:NewShardInSlot(slot, shard)`
*   **Description:** Initializes a new, empty shard index for a slot/shard. Sets `valid=true` and marks as dirty for immediate saving.
*   **Parameters:**  
    * `slot` (number) — Cluster slot index.  
    * `shard` (string) — Shard name.
*   **Returns:** Nothing.

### `:Delete(cb, save_options)`
*   **Description:** Deletes the current world session via `TheNet:DeleteSession`, resets data, and optionally saves server/mod options afterward (e.g., for UI reset).
*   **Parameters:**  
    * `cb` (function, optional) — Called after deletion/reset.  
    * `save_options` (boolean) — Whether to preserve `server`, `world.options`, and `enabled_mods` after reset.
*   **Returns:** Nothing.

### `:SaveCurrent(onsavedcb, isshutdown)`
*   **Description:** Triggers a full world save via `SaveGame`. Only runs on servers (not clients). Updates `session_id` before saving.
*   **Parameters:**  
    * `onsavedcb` (function) — Called after saving finishes.  
    * `isshutdown` (boolean) — Signals whether the sim is shutting down after saving.
*   **Returns:** Nothing.

### `:OnGenerateNewWorld(savedata, metadataStr, session_identifier, cb)`
*   **Description:** Serializes world session data and saves shard index metadata for a newly generated world.
*   **Parameters:**  
    * `savedata` (table) — World session data.  
    * `metadataStr` (string) — Metadata serialized string.  
    * `session_identifier` (string) — New session ID.  
    * `cb` (function, optional) — Called after saving finishes.
*   **Returns:** Nothing.

### `:SetServerShardData(customoptions, serverdata, onsavedcb)`
*   **Description:** Configures the shard with server, world, and mod data. Applies level and worldgen overrides (e.g., `leveldataoverride.lua`, `worldgenoverride.lua`) and upgrades legacy `game_mode` values (`wilderness`/`endless` → `survival`).
*   **Parameters:**  
    * `customoptions` (table, optional) — World options to use if provided and non-empty.  
    * `serverdata` (table) — Server configuration (e.g., `game_mode`, `difficulty`).  
    * `onsavedcb` (function, optional) — Called after saving final data.
*   **Returns:** Nothing.

### `:GetSaveDataFile(file, cb)`
*   **Description:** Loads raw world save data for a given filename (not session-based). Used internally; asserts on load failures.
*   **Parameters:**  
    * `file` (string) — Save data filename.  
    * `cb` (function) — Receives loaded save data table.
*   **Returns:** Nothing.

### `:CheckWorldFile()`
*   **Description:** Checks whether the world file for the current session exists.
*   **Parameters:** None.
*   **Returns:** `boolean` — True if `session_id` is non-empty and the corresponding file path exists.

### `:MarkDirty()`
*   **Description:** Marks the index as dirty so that subsequent `:Save` calls persist changes.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `:IsValid()`
*   **Description:** Returns whether the shard index was successfully loaded and is usable.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `:IsEmpty()`
*   **Description:** Checks if the shard has no active session.
*   **Parameters:** None.
*   **Returns:** `boolean` — True if `session_id` is `nil` or empty string.

### `:GetSlot()`, `:GetShard()`
*   **Description:** Getters for slot and shard name.
*   **Parameters:** None.
*   **Returns:** `number?` or `string?`.

### `:GetServerData()`
*   **Description:** Returns server configuration table.
*   **Parameters:** None.
*   **Returns:** `table`.

### `:GetGenOptions()`
*   **Description:** Returns world generation options table (including `overrides`).
*   **Parameters:** None.
*   **Returns:** `table`.

### `:GetSession()`
*   **Description:** Returns the session identifier string.
*   **Parameters:** None.
*   **Returns:** `string?`.

### `:GetGameMode()`
*   **Description:** Returns the configured game mode, defaulting to `DEFAULT_GAME_MODE` if unset.
*   **Parameters:** None.
*   **Returns:** `string`.

### `:GetEnabledServerMods()`
*   **Description:** Returns enabled server mods if `ismaster`, otherwise an empty table.
*   **Parameters:** None.
*   **Returns:** `table`.

### `:LoadEnabledServerMods()`
*   **Description:** Enables and configures mods stored in `enabled_mods` (master shard only) via `ModManager` and `KnownModIndex`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `:SetEnabledServerMods(enabled_mods)`
*   **Description:** Updates `enabled_mods` and marks dirty (master shard only).
*   **Parameters:** `enabled_mods` (table) — New mod state table.
*   **Returns:** Nothing.

### `:SetServerData(serverdata)`
*   **Description:** Updates server data (master shard only) and marks dirty.
*   **Parameters:** `serverdata` (table).
*   **Returns:** Nothing.

### `:SetGenOptions(options)`
*   **Description:** Updates world generation options (master shard only) and marks dirty.
*   **Parameters:** `options` (table).
*   **Returns:** Nothing.

## Events & listeners
None.