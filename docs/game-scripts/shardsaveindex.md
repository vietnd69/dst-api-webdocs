---
id: shardsaveindex
title: Shardsaveindex
description: Manages shard-specific save index data and slot-level world/session metadata for persistent storage across game sessions.
tags: [save, network, world]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 4856123f
system_scope: world
---

# Shardsaveindex

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`ShardSaveIndex` is a core system component responsible for maintaining and providing access to shard-aware save data in Don't Starve Together. It manages save slots across multiple shards (e.g., `Master` and `Caves`), stores metadata such as game mode, server options, session info, and world state (day/season), and handles migration of legacy save data and failed conversions. It operates primarily on the front end and during game startup, coordinating with `TheSim`, `TheNet`, and `ShardIndex` for file I/O and entity sync.

## Usage example
```lua
local shardSaveIndex = ShardSaveIndex()
shardSaveIndex:Load(function()
    local slot = 1
    local shard = "Master"
    local shardIndex = shardSaveIndex:GetShardIndex(slot, shard, true)
    if shardIndex and shardIndex:IsValid() then
        print("Slot "..slot.." is valid.")
    end
    local gameMode = shardSaveIndex:GetSlotGameMode(slot)
    print("Game mode:", gameMode)
end)
```

## Dependencies & tags
**Components used:** None (uses standalone module functions and global objects like `TheSim`, `TheNet`, `SaveGameIndex`, `ModManager`, etc.)
**Tags:** Does not manipulate entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | number | `1` | Current data version used for migration. |
| `slot_cache` | table | `{}` | Cached `ShardIndex` instances, keyed by `slot` then `shard`. |
| `slots` | table | `{}` | Map of slot IDs to booleans indicating whether the slot is multi-level (`true` = forest + caves). |
| `failed_slot_conversions` | table | `nil` | Map of slot IDs that failed legacy-to-shard conversion and require retry. |

## Main functions
### `GetShardSaveIndexName()`
* **Description:** Returns the filename identifier used for persistent storage (`"shardsaveindex"`).
* **Parameters:** None.
* **Returns:** `string` — the storage key.

### `GetShardIndex(slot, shard, create_if_missing)`
* **Description:** Retrieves or optionally creates a `ShardIndex` instance for a given slot and shard, caching it in `slot_cache`. Used to access shard-level world/session data.
* **Parameters:**  
  `slot` (number) — save slot index.  
  `shard` (string) — shard name (e.g., `"Master"`, `"Caves"`).  
  `create_if_missing` (boolean) — if `true`, creates a new `ShardIndex` if none exists.  
* **Returns:** `ShardIndex?` — cached shard index instance or `nil` if invalid and not created.

### `Save(callback)`
* **Description:** Persists the `ShardSaveIndex` state (version, failed conversions, and all cached shard data) to disk. Iterates over `slot_cache`, saving each `ShardIndex`, then serializes top-level metadata.
* **Parameters:**  
  `callback` (function?) — optional function called after save completes.  
* **Returns:** Nothing.  
* **Error states:** Skips saving if `self.invalid` is `true` (e.g., loaded outside front end).

### `ForceRetrySlotConversion(slot, skiplegacyconversion)`
* **Description:** Retries migration of a specific slot from legacy `SaveGameIndex` format to `ShardSaveIndex` format.
* **Parameters:**  
  `slot` (number) — slot ID to retry.  
  `skiplegacyconversion` (boolean) — if `true`, skips legacy session path migration.  
* **Returns:** Nothing.

### `GetValidSlots()`
* **Description:** Returns a list of non-empty slot IDs by checking each slot's `ShardIndex`.
* **Parameters:** None.
* **Returns:** `table` — array of slot numbers.

### `GetNextNewSlot(force_slot_type)`
* **Description:** Determines the next available save slot, preferring cloud for cloud-saves users or using the lowest unused local slot ID.
* **Parameters:**  
  `force_slot_type` (string?) — `"local"` or `"cloud"` to override default behavior.  
* **Returns:** `number` — next available slot index.

### `IsSlotEmpty(slot)`
* **Description:** Checks if a given slot has any saved content (Master shard must exist and be non-empty).
* **Parameters:**  
  `slot` (number) — slot ID.  
* **Returns:** `boolean`.

### `IsSlotMultiLevel(slot)`
* **Description:** Returns whether the slot stores both forest and caves levels (`true`) or only forest (`false`).
* **Parameters:**  
  `slot` (number) — slot ID.  
* **Returns:** `boolean`.

### `GetSlotGameMode(slot)`
* **Description:** Gets the game mode (`"survival"`, `"wilderness"`, `"hardcore"`, etc.) from the Master shard's `ShardIndex`.
* **Parameters:**  
  `slot` (number) — slot ID.  
* **Returns:** `string` — game mode string or `DEFAULT_GAME_MODE`.

### `GetSlotServerData(slot)`
* **Description:** Retrieves server options (e.g., mod settings, world settings) from the Master shard.
* **Parameters:**  
  `slot` (number) — slot ID.  
* **Returns:** `table` — server data or `{}` if slot is empty.

### `SetSlotServerData(slot, serverdata)`
* **Description:** Sets server options on the Master shard and marks it dirty for saving.
* **Parameters:**  
  `slot` (number) — slot ID.  
  `serverdata` (table) — server options table.  
* **Returns:** Nothing.

### `GetSlotSession(slot, shard)`
* **Description:** Gets the session ID (used for player/user identification) stored in the shard.
* **Parameters:**  
  `slot` (number) — slot ID.  
  `shard` (string) — shard name.  
* **Returns:** `string?` — session ID or `nil`.

### `GetSlotCharacter(slot)`
* **Description:** Retrieves the currently selected character for the slot (only valid for Master shard and multi-level slots).
* **Parameters:**  
  `slot` (number) — slot ID.  
* **Returns:** `string?` — character prefab name or `nil`.

### `GetSlotDayAndSeasonText(slot)`
* **Description:** Returns a localized string describing the slot’s current day and season (e.g., `"Season Spring Day 12"` or `"Late Spring Day 25"`).
* **Parameters:**  
  `slot` (number) — slot ID.  
* **Returns:** `string`.

### `GetSlotDay(slot)`
* **Description:** Returns the current day count (cycles + 1) for the slot’s Master shard.
* **Parameters:**  
  `slot` (number) — slot ID.  
* **Returns:** `number` — day number (default `1` if slot empty).

### `GetSlotPresetText(slot)`
* **Description:** Returns a localized preset label: `"Forest Only"` or `"Forest and Caves"`.
* **Parameters:**  
  `slot` (number) — slot ID.  
* **Returns:** `string`.

### `SetSlotEnabledServerMods(slot)`
* **Description:** Sets enabled server mods for the slot by fetching from `ModManager` and storing in the Master shard. If slot is empty, caches mods for later use.
* **Parameters:**  
  `slot` (number) — slot ID.  
* **Returns:** `nil`.

### `LoadSlotEnabledServerMods(slot)`
* **Description:** Loads and applies server mod overrides from the Master shard for the given slot.
* **Parameters:**  
  `slot` (number) — slot ID.  
* **Returns:** `nil`.

### `DeleteSlot(slot, cb, save_options)`
* **Description:** Deletes all data associated with a slot, including files and cache.
* **Parameters:**  
  `slot` (number) — slot ID to delete.  
  `cb` (function?) — optional callback after deletion.  
  `save_options` (any?) — passed to `ShardIndex:Delete`; if `nil`, syncs with cluster delete.  
* **Returns:** Nothing.

## Events & listeners
None identified.