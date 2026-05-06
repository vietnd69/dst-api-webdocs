---
id: shardindex
title: Shardindex
description: Manages shard-specific save data, world generation options, and server configuration for Don't Starve Together cluster servers.
tags: [save, server, cluster, worldgen, mods]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: root
source_hash: ee458be5
system_scope: network
---

# Shardindex

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`shardindex.lua` defines the `ShardIndex` class, which manages persistent save data for individual shards within a DST cluster. It handles world generation options, server configuration, session identifiers, and enabled mods. The class supports versioned save data upgrades through `savefileupgrades` and distinguishes between master shards and cave shards. This is a standalone class used by server systems — it does not attach to entities as a component.

## Usage example
```lua
local ShardIndex = require "shardindex"

-- Create a new shard index instance
local index = ShardIndex()

-- Load shard data from a specific slot
index:LoadShardInSlot(1, "Master", function()
    if index:IsValid() then
        print("Session ID:", index:GetSession())
        print("Game Mode:", index:GetGameMode())
        print("World Options:", index:GetGenOptions())
    end
end)

-- Mark data as dirty to trigger save on next Save() call
index:MarkDirty()
index:Save(function()
    print("Shard index saved successfully")
end)
```

## Dependencies & tags
**External dependencies:**
- `savefileupgrades` -- version upgrade utilities for migrating old save data formats
- `map/customize` -- world customization options validation
- `map/levels` -- level data presets and playstyle calculations

**Components used:**
None identified

**Tags:**
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ismaster` | boolean | `false` | Whether this shard index represents the Master shard. |
| `slot` | number or nil | `nil` | Save slot number for cluster storage. |
| `shard` | string or nil | `nil` | Shard name (e.g., "Master", "Caves"). |
| `version` | number | `5` | Shard index data format version for upgrade compatibility. |
| `world` | table | `{options = {}}` | Contains world generation data and options. |
| `world.options` | table | `{}` | World generation override settings and presets. |
| `server` | table | `{}` | Server configuration data including game mode and playstyle. |
| `session_id` | string or nil | `nil` | Unique session identifier for the current world instance. |
| `enabled_mods` | table | `{}` | Table of enabled server mods with configuration data. |
| `isdirty` | boolean | `false` | Whether data has changed and needs to be saved. |
| `valid` | boolean | `false` | Whether the shard index loaded successfully and is usable. |
| `invalid` | boolean | `false` | Whether the shard index is marked as invalid (load failure). |

## Main functions
### `GetShardIndexName()`
* **Description:** Returns the filename identifier used for saving/loading shard index data.
* **Parameters:** None
* **Returns:** `"shardindex"` (string)
* **Error states:** None

### `Save(callback)`
* **Description:** Saves the shard index data to persistent storage. Only saves if data is dirty or running on a server. Clears the dirty flag after saving.
* **Parameters:**
  - `callback` -- optional function called after save completes
* **Returns:** None
* **Error states:** None

### `WriteTimeFile(callback)`
* **Description:** Writes a timestamp file tracking when the save was created and last saved. Reads existing time file if present to preserve creation date.
* **Parameters:**
  - `callback` -- optional function called after write completes
* **Returns:** None
* **Error states:** None

### `Load(callback)`
* **Description:** Loads shard index data based on server type. Dedicated servers load from root save folder, client-hosted servers load from specified slot, and clients are marked invalid.
* **Parameters:**
  - `callback` -- optional function called after load completes
* **Returns:** None
* **Error states:** None

### `LoadShardInSlot(slot, shard, callback)`
* **Description:** Loads shard index data from a specific cluster slot and shard name.
* **Parameters:**
  - `slot` -- number save slot index
  - `shard` -- string shard name (e.g., "Master", "Caves")
  - `callback` -- optional function called after load completes
* **Returns:** None
* **Error states:** None

### `GetSaveDataFile(file, cb)`
* **Description:** Loads and validates save data from a specific file path. Asserts on load failure with detailed error messages.
* **Parameters:**
  - `file` -- string file path to load
  - `cb` -- function callback receiving loaded save data
* **Returns:** None
* **Error states:** Asserts if file load fails, data is nil, empty, or corrupt.

### `GetSaveData(cb)`
* **Description:** Retrieves current world session save data. Uses legacy or cluster slot paths depending on server configuration.
* **Parameters:**
  - `cb` -- function callback receiving save data or nil
* **Returns:** None
* **Error states:** None

### `IsMasterShardIndex()`
* **Description:** Checks if this shard index represents the Master shard.
* **Parameters:** None
* **Returns:** `true` if master shard, `false` otherwise
* **Error states:** None

### `GetSlot()`
* **Description:** Returns the save slot number for this shard index.
* **Parameters:** None
* **Returns:** Number or `nil` if not set
* **Error states:** None

### `GetShard()`
* **Description:** Returns the shard name for this shard index.
* **Parameters:** None
* **Returns:** String or `nil` if not set
* **Error states:** None

### `NewShardInSlot(slot, shard)`
* **Description:** Initializes a new shard index in the specified slot and shard. Resets all data tables to empty defaults and marks as dirty.
* **Parameters:**
  - `slot` -- number save slot index
  - `shard` -- string shard name
* **Returns:** None
* **Error states:** None

### `Delete(cb, save_options)`
* **Description:** Deletes session data and resets shard index. Optionally preserves server options and mods before saving empty state.
* **Parameters:**
  - `cb` -- optional function called after deletion
  - `save_options` -- boolean whether to preserve server/mod options
* **Returns:** None
* **Error states:** None

### `SaveCurrent(onsavedcb, isshutdown)`
* **Description:** Saves the current world state. Only executes on server (not client). Asserts sufficient disk space and world entity existence.
* **Parameters:**
  - `onsavedcb` -- function called after save completes
  - `isshutdown` -- boolean indicating if sim is shutting down after save
* **Returns:** None
* **Error states:** Asserts if insufficient disk space or `TheWorld` is nil. Returns early on client without error.

### `OnGenerateNewWorld(savedata, metadataStr, session_identifier, cb)`
* **Description:** Handles new world generation by serializing world session data and updating session ID. Triggers shard index save after serialization.
* **Parameters:**
  - `savedata` -- table world generation data
  - `metadataStr` -- string metadata for serialization
  - `session_identifier` -- string new session ID
  - `cb` -- function called after complete
* **Returns:** None
* **Error states:** None

### `SetServerShardData(customoptions, serverdata, onsavedcb)`
* **Description:** Configures server shard data including world options, game mode, and mods. Applies level data overrides and worldgen overrides from files. Handles legacy game mode migration (wilderness/endless to survival).
* **Parameters:**
  - `customoptions` -- table custom world options or nil
  - `serverdata` -- table server configuration data
  - `onsavedcb` -- function called after save completes
* **Returns:** None
* **Error states:** Asserts if no world options defined after configuration.

### `CheckWorldFile()`
* **Description:** Checks if the world session file exists for the current session ID.
* **Parameters:** None
* **Returns:** `true` if file exists, `false` otherwise
* **Error states:** None

### `MarkDirty()`
* **Description:** Marks the shard index data as modified, triggering a save on next `Save()` call.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `IsValid()`
* **Description:** Checks if the shard index loaded successfully and is in a valid state.
* **Parameters:** None
* **Returns:** `true` if valid, `false` otherwise
* **Error states:** None

### `IsEmpty()`
* **Description:** Checks if the shard index has no session ID (empty/uninitialized state).
* **Parameters:** None
* **Returns:** `true` if session_id is nil or empty string, `false` otherwise
* **Error states:** None

### `GetServerData()`
* **Description:** Returns the server configuration data table.
* **Parameters:** None
* **Returns:** Table (empty table if `self.server` is nil)
* **Error states:** None

### `GetGenOptions()`
* **Description:** Returns the world generation options table.
* **Parameters:** None
* **Returns:** Table from `self.world.options`
* **Error states:** None

### `GetSession()`
* **Description:** Returns the current session identifier.
* **Parameters:** None
* **Returns:** String or `nil`
* **Error states:** None

### `GetGameMode()`
* **Description:** Returns the current game mode from server data or the default game mode.
* **Parameters:** None
* **Returns:** String game mode name
* **Error states:** None

### `GetEnabledServerMods()`
* **Description:** Returns the enabled server mods table. Only returns data on master shard.
* **Parameters:** None
* **Returns:** Table (empty table if not master shard)
* **Error states:** None

### `LoadEnabledServerMods()`
* **Description:** Loads and enables server mods from the enabled_mods table. Only executes on master shard. Disables all mods first, then re-enables configured mods with their options.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetEnabledServerMods(enabled_mods)`
* **Description:** Sets the enabled server mods table. Only executes on master shard. Marks data as dirty. Used in frontend for server creation screen.
* **Parameters:**
  - `enabled_mods` -- table of mod configurations
* **Returns:** None
* **Error states:** None

### `SetServerData(serverdata)`
* **Description:** Sets the server configuration data table. Only executes on master shard. Marks data as dirty.
* **Parameters:**
  - `serverdata` -- table server configuration
* **Returns:** None
* **Error states:** None

### `SetGenOptions(options)`
* **Description:** Sets the world generation options table. Only executes on master shard. Marks data as dirty.
* **Parameters:**
  - `options` -- table world generation options
* **Returns:** None
* **Error states:** None

## Events & listeners
None.