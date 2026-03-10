---
id: saveindex
title: Saveindex
description: Manages save slot indexing, persistence loading/saving, and world configuration for Don't Starve Together multiplayer sessions.
tags: [network, persistence, world]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: e20ecacd
system_scope: network
---

# Saveindex

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`SaveIndex` is the central component responsible for managing multiple save slots and their associated game state data in Don't Starve Together. It handles persistent storage of world and server configuration, session identification, mod state, and level data overrides. It supports both local and cluster-based multiplayer environments, including upgrades from older save formats and dynamic handling of preset configurations via `worldgenoverride.lua` and `leveldataoverride.lua`. It does not directly interact with the world simulation but serves as a configuration and coordination layer for the save system.

## Usage example
```lua
local saveIndex = SaveIndex()
saveIndex:Load(function()
    local currentSlot = saveIndex:GetCurrentSaveSlot()
    local slotData = saveIndex:GetSlotServerData(currentSlot)
    local worldOptions = saveIndex:GetSlotGenOptions(currentSlot)
    print("Current game mode:", saveIndex:GetGameMode(currentSlot))
end)
```

## Dependencies & tags
**Components used:** `nil` (this is a standalone class, not an ECS component; no `inst:AddComponent` or `inst.components.X` calls)
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `data` | table | `{ version = 4, slots = {} }` | The in-memory save index data structure. |
| `current_slot` | number | `1` | Index of the currently active save slot. |
| `loaded_from_file` | boolean | `false` | Indicates whether the save index was successfully loaded from persistent storage. |

## Main functions
### `Init()`
*   **Description:** Initializes the internal `data` table with default values and ensures the minimum number of save slots (defined by `NUM_SAVE_SLOTS`) exist.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GuaranteeMinNumSlots(numslots)`
*   **Description:** Ensures that `self.data.slots` contains at least `numslots` slots, adding empty ones as needed.
*   **Parameters:** `numslots` (number) – Minimum number of slots to guarantee.
*   **Returns:** Nothing.

### `GetNumSlots()`
*   **Description:** Returns the current count of save slots.
*   **Parameters:** None.
*   **Returns:** `number` – Number of slots in `self.data.slots`.

### `GetSaveIndexName()`
*   **Description:** Returns the filename used for the persistent save index (e.g., `saveindex` or `saveindex_dev` in dev builds).
*   **Parameters:** None.
*   **Returns:** `string` – The filename string.

### `Save(callback)`
*   **Description:** Saves the current save index. **Note:** As of 09/09/2020, this method is deprecated and performs no actual saving; it only invokes the callback.
*   **Parameters:** `callback` (function?) – Optional callback to invoke after "saving".
*   **Returns:** Nothing.

### `Load(callback)`
*   **Description:** Loads the save index from persistent storage (local or dedicated). Invokes `OnLoad` upon completion.
*   **Parameters:** `callback` (function) – Function to call after loading completes.
*   **Returns:** Nothing.

### `LoadClusterSlot(slot, shard, callback)`
*   **Description:** Loads the save index from a specific cluster slot and shard (e.g., `"Master"` or `"Caves"`). Does not log errors if the slot is empty.
*   **Parameters:** 
    *   `slot` (number) – Slot index.
    *   `shard` (string) – Shard name (e.g., `"Master"`).
    *   `callback` (function) – Function to call after loading completes.
*   **Returns:** Nothing.

### `GetSaveData(slotnum, cb)`
*   **Description:** Loads session-specific world save data (not the save index itself) from the file system based on the session ID in `slotnum`.
*   **Parameters:** 
    *   `slotnum` (number) – Slot index to read.
    *   `cb` (function) – Callback invoked with the loaded world data table, or `nil` on failure.
*   **Returns:** Nothing.

### `DeleteSlot(slot, cb, save_options)`
*   **Description:** Deletes a save slot's persistent session data and resets its `slotdata` entries. If `save_options` is true, world and server options are preserved.
*   **Parameters:** 
    *   `slot` (number?) – Slot index (or `nil` for current slot).
    *   `cb` (function?) – Callback after deletion.
    *   `save_options` (boolean) – If true, retain world and server options after deletion.
*   **Returns:** Nothing.

### `SaveCurrent(onsavedcb, isshutdown)`
*   **Description:** Initiates a full save for the current slot on the server (clients return early). Sets the session ID and calls `SaveGame`.
*   **Parameters:** 
    *   `onsavedcb` (function) – Callback after save completes.
    *   `isshutdown` (boolean) – Whether the sim is shutting down after saving.
*   **Returns:** Nothing (early return on clients).

### `SetCurrentIndex(saveslot)`
*   **Description:** Sets the current active slot index.
*   **Parameters:** `saveslot` (number) – Slot index to set as current.
*   **Returns:** Nothing.

### `GetCurrentSaveSlot()`
*   **Description:** Returns the index of the current save slot.
*   **Parameters:** None.
*   **Returns:** `number`.

### `OnGenerateNewWorld(saveslot, savedata, session_identifier, cb)`
*   **Description:** Initializes a new world save slot with provided world data and session ID. Serializes the session and saves the save index.
*   **Parameters:** 
    *   `saveslot` (number) – Slot index to initialize.
    *   `savedata` (table) – World state data to serialize.
    *   `session_identifier` (string) – Unique session ID.
    *   `cb` (function) – Callback after saving completes.
*   **Returns:** Nothing.

### `UpdateServerData(saveslot, serverdata, onsavedcb)`
*   **Description:** Updates the server-specific data for a given slot and saves the save index.
*   **Parameters:** 
    *   `saveslot` (number) – Slot index to update.
    *   `serverdata` (table) – Server configuration data (e.g., game mode, online mode).
    *   `onsavedcb` (function?) – Callback after saving.
*   **Returns:** Nothing.

### `GetGameMode(saveslot)`
*   **Description:** Retrieves the game mode for a given slot, defaulting to `DEFAULT_GAME_MODE` if unset.
*   **Parameters:** `saveslot` (number) – Slot index.
*   **Returns:** `string` – Game mode (e.g., `"survival"`, `"neverdeath"`).

### `StartSurvivalMode(saveslot, customoptions, serverdata, onsavedcb)`
*   **Description:** Initializes a new survival-mode slot, applying level data overrides and worldgen overrides before updating server data.
*   **Parameters:** 
    *   `saveslot` (number) – Slot index to start.
    *   `customoptions` (table?) – Custom world generation options (uses defaults if `nil`).
    *   `serverdata` (table) – Server configuration (e.g., game mode, cluster settings).
    *   `onsavedcb` (function?) – Callback after saving completes.
*   **Returns:** Nothing.

### `IsSlotEmpty(slot)`
*   **Description:** Checks if a slot is empty (no `session_id`).
*   **Parameters:** `slot` (number?) – Slot index (defaults to current slot).
*   **Returns:** `boolean` – `true` if the slot has no active session.

### `IsSlotMultiLevel(slot)`
*   **Description:** Checks if a slot contains multiple worlds (Master + Caves) in a non-dedicated environment.
*   **Parameters:** `slot` (number?) – Slot index (defaults to current slot).
*   **Returns:** `boolean`.

### `GetLastUsedSlot()`
*   **Description:** Returns the last-used slot index, or `-1` if none.
*   **Parameters:** None.
*   **Returns:** `number`.

### `SetLastUsedSlot(slot)`
*   **Description:** Sets the last-used slot index.
*   **Parameters:** `slot` (number) – Slot index to record.
*   **Returns:** Nothing.

### `GetSlotServerData(slot)`
*   **Description:** Returns the server configuration data for a slot (empty table if not found).
*   **Parameters:** `slot` (number?) – Slot index (defaults to current slot).
*   **Returns:** `table`.

### `GetSlotGenOptions(slot)`
*   **Description:** Returns a deep copy of the world generation options for a slot.
*   **Parameters:** `slot` (number?) – Slot index (defaults to current slot).
*   **Returns:** `table` – World generation options (array of level data tables).

### `GetSlotSession(slot, caves_session)`
*   **Description:** Returns the session ID for a slot, handling multi-level (Master + Caves) cases.
*   **Parameters:** 
    *   `slot` (number?) – Slot index.
    *   `caves_session` (boolean?) – If true, returns the Caves shard session.
*   **Returns:** `string?` – Session ID or `nil`.

### `BuildSlotDayAndSeasonText(slotnum)`
*   **Description:** Returns a localized string describing the current day and season for a slot (e.g., `"Day 3, Early Summer"`).
*   **Parameters:** `slotnum` (number) – Slot index.
*   **Returns:** `string` – Formatted day/season string.

### `CheckWorldFile(slot)`
*   **Description:** Checks whether the world save file exists for the given slot.
*   **Parameters:** `slot` (number?) – Slot index (defaults to current slot).
*   **Returns:** `boolean` – `true` if the session exists and the file path resolves.

### `LoadSlotCharacter(slot)`
*   **Description:** Loads the player character prefab name from a slot's user session. Supports multi-shard sessions.
*   **Parameters:** `slot` (number?) – Slot index (defaults to current slot).
*   **Returns:** `string?` – Character prefab name (e.g., `"wx78"`), or `nil`.

### `LoadServerEnabledModsFromSlot(slot)`
*   **Description:** Applies and enables server-side mods stored in the slot's `enabled_mods` data.
*   **Parameters:** `slot` (number?) – Slot index (defaults to current slot).
*   **Returns:** Nothing.

### `SetServerEnabledMods(slot)`
*   **Description:** Saves the currently enabled server mods and their configuration options to a slot.
*   **Parameters:** `slot` (number?) – Slot index (defaults to current slot).
*   **Returns:** Nothing.

### `GetEnabledMods(slot)`
*   **Description:** Returns the stored enabled mods data for a slot.
*   **Parameters:** `slot` (number?) – Slot index (defaults to current slot).
*   **Returns:** `table` – Map of modname → moddata.

## Events & listeners
None.