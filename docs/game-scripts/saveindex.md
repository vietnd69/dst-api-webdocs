---
id: saveindex
title: Saveindex
description: Manages save slot indexing, world data persistence, and session metadata for Don't Starve Together save files.
tags: [save, persistence, session]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: root
source_hash: 5ced4e44
system_scope: world
---

# Saveindex

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`saveindex.lua` defines the `SaveIndex` class, which manages the save slot index system for Don't Starve Together. It handles save slot creation, loading, deletion, and metadata tracking including session IDs, world generation options, server configuration, and enabled mods. The class interfaces with `TheSim` for persistent string storage and `TheNet` for session and cluster management. Save data versioning is tracked with automatic upgrade paths from v1 through v4.

## Usage example
```lua
-- SaveGameIndex is the global instance used throughout the game
-- To create a new instance for custom use:
local SaveIndex = require "saveindex"
local saveIndex = SaveIndex()

-- Load the save index from persistent storage
saveIndex:Load(function()
    print("Loaded "..saveIndex:GetNumSlots().." save slots")
end)

-- Set current slot and check if empty
saveIndex:SetCurrentIndex(1)
if saveIndex:IsSlotEmpty(1) then
    print("Slot 1 is empty")
end

-- Get session ID for a slot
local session = saveIndex:GetSlotSession(1)

-- Note: The game uses a global SaveGameIndex instance defined elsewhere
-- Example with global instance:
-- local session = SaveGameIndex:GetSlotSession(1)
```

## Dependencies & tags
**External dependencies:**
- `map/levels` -- level data and default world generation presets
- `map/customize` -- world customization options validation
- `savefileupgrades` -- save data version upgrade utilities

**Components used:**
- None identified (standalone class, not attached to entities)

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.data` | table | `{ version = 4, slots = {} }` | Internal data table containing save data version and all slot entries. |
| `self.data.version` | number | `4` | Save data format version for compatibility checking. |
| `self.data.slots` | table | `{}` | Array of slot data tables, each containing world, server, session_id, and enabled_mods. |
| `self.data.last_used_slot` | number | `nil` | Index of the last accessed save slot. |
| `self.current_slot` | number | `1` | Currently active save slot index. |
| `self.loaded_from_file` | boolean | `nil` | Set to `true` after successful file load; used for migration logic. |

## Main functions
### `SaveIndex()`
* **Description:** Constructor that creates a new SaveIndex instance and initializes default data structure.
* **Parameters:** None
* **Returns:** SaveIndex instance
* **Error states:** None

### `Init()`
* **Description:** Initializes the save index data structure with version number and guarantees minimum slot count.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GuaranteeMinNumSlots(numslots)`
* **Description:** Ensures the slots array has at least `numslots` entries, creating new empty slots as needed.
* **Parameters:** `numslots` -- minimum number of slots to guarantee
* **Returns:** None
* **Error states:** None

### `GetNumSlots()`
* **Description:** Returns the total number of save slots currently in the index.
* **Parameters:** None
* **Returns:** Number of slots (integer)
* **Error states:** None

### `GetSaveIndexName()`
* **Description:** Returns the filename for the save index, appending branch name if in dev mode.
* **Parameters:** None
* **Returns:** String filename (e.g., `"saveindex"` or `"saveindex_dev"`)
* **Error states:** None

### `Save(callback)`
* **Description:** Saves the save index to persistent storage. Currently deprecated and does not actually save data.
* **Parameters:** `callback` -- function to call after save operation (optional)
* **Returns:** None
* **Error states:** None (deprecated, no-op)

### `Load(callback)`
* **Description:** Loads the save index from persistent storage on game start.
* **Parameters:** `callback` -- function to call after load completes
* **Returns:** None
* **Error states:** None (load failures are handled internally)

### `LoadClusterSlot(slot, shard, callback)`
* **Description:** Loads save index data from a specific cluster slot and shard (used in frontend for cluster saves).
* **Parameters:**
  - `slot` -- save slot number
  - `shard` -- shard name (e.g., `"Master"`, `"Caves"`)
  - `callback` -- function to call after load completes
* **Returns:** None
* **Error states:** None

### `GetSaveDataFile(file, cb)`
* **Description:** Loads save data from a specific file path with validation and error handling.
* **Parameters:**
  - `file` -- path to the save file
  - `cb` -- callback function receiving loaded save data
* **Returns:** None
* **Error states:** Asserts on load failure, nil data, empty data, or corrupt save file.

### `GetSaveData(slotnum, cb)`
* **Description:** Retrieves save data for a specific slot, handling both cluster and non-cluster save paths.
* **Parameters:**
  - `slotnum` -- save slot number
  - `cb` -- callback function receiving loaded save data
* **Returns:** None
* **Error states:** None (callback receives nil if file not found)

### `DeleteSlot(slot, cb, save_options)`
* **Description:** Deletes a save slot, removing session data and cluster data. Optionally preserves world options.
* **Parameters:**
  - `slot` -- slot number to delete
  - `cb` -- callback after deletion
  - `save_options` -- boolean to preserve world/server/mod options
* **Returns:** None
* **Error states:** None

### `SaveCurrent(onsavedcb, isshutdown)`
* **Description:** Saves the current game state. Only executes on server (clients return early).
* **Parameters:**
  - `onsavedcb` -- callback after save completes
  - `isshutdown` -- boolean indicating if sim is shutting down
* **Returns:** None
* **Error states:** Asserts if `TheWorld` is nil.

### `SetCurrentIndex(saveslot)`
* **Description:** Sets the currently active save slot index.
* **Parameters:** `saveslot` -- slot number to set as current
* **Returns:** None
* **Error states:** None

### `GetCurrentSaveSlot()`
* **Description:** Returns the currently active save slot index.
* **Parameters:** None
* **Returns:** Current slot number (integer)
* **Error states:** None

### `OnGenerateNewWorld(saveslot, savedata, session_identifier, cb)`
* **Description:** Initializes a new world save with session identifier and triggers save after serialization.
* **Parameters:**
  - `saveslot` -- slot number for the new world
  - `savedata` -- world serialization data
  - `session_identifier` -- unique session ID
  - `cb` -- callback after save completes
* **Returns:** None
* **Error states:** None

### `UpdateServerData(saveslot, serverdata, onsavedcb)`
* **Description:** Updates server configuration data for a save slot and triggers save.
* **Parameters:**
  - `saveslot` -- slot number to update
  - `serverdata` -- server configuration table
  - `onsavedcb` -- callback after save completes
* **Returns:** None
* **Error states:** None

### `GetGameMode(saveslot)`
* **Description:** Returns the game mode for a specific save slot.
* **Parameters:** `saveslot` -- slot number to query
* **Returns:** Game mode string (defaults to `DEFAULT_GAME_MODE` if not set)
* **Error states:** None

### `StartSurvivalMode(saveslot, customoptions, serverdata, onsavedcb)`
* **Description:** Initializes a new survival mode save slot with world generation options and server data.
* **Parameters:**
  - `saveslot` -- slot number to initialize
  - `customoptions` -- custom world generation options (optional)
  - `serverdata` -- server configuration data
  - `onsavedcb` -- callback after save completes
* **Returns:** None
* **Error states:** None

### `IsSlotEmpty(slot)`
* **Description:** Checks if a save slot is empty (nil, no data, or no session ID).
* **Parameters:** `slot` -- slot number to check
* **Returns:** Boolean `true` if slot is empty
* **Error states:** None

### `IsSlotMultiLevel(slot)`
* **Description:** Checks if a save slot contains multiple levels (e.g., Forest and Caves).
* **Parameters:** `slot` -- slot number to check
* **Returns:** Boolean `true` if slot has multiple levels
* **Error states:** None

### `GetLastUsedSlot()`
* **Description:** Returns the index of the last accessed save slot.
* **Parameters:** None
* **Returns:** Slot number (integer, defaults to `-1` if not set)
* **Error states:** None

### `SetLastUsedSlot(slot)`
* **Description:** Sets the last used slot index.
* **Parameters:** `slot` -- slot number to record
* **Returns:** None
* **Error states:** None

### `GetSlotServerData(slot)`
* **Description:** Returns the server configuration data for a specific slot.
* **Parameters:** `slot` -- slot number to query
* **Returns:** Server data table (empty table if slot is nil or invalid)
* **Error states:** None

### `GetSlotGenOptions(slot)`
* **Description:** Returns a deep copy of world generation options for a slot.
* **Parameters:** `slot` -- slot number (defaults to current slot if nil)
* **Returns:** Table of world generation options
* **Error states:** None

### `GetSlotSession(slot, caves_session)`
* **Description:** Returns the session ID for a slot, handling multi-level cluster saves.
* **Parameters:**
  - `slot` -- slot number (defaults to current slot if nil)
  - `caves_session` -- boolean to fetch Caves shard session instead of Master
* **Returns:** Session ID string or `nil`
* **Error states:** None

### `BuildSlotDayAndSeasonText(slotnum)`
* **Description:** Builds display text showing day count and season for a save slot.
* **Parameters:** `slotnum` -- slot number to query
* **Returns:** Formatted string (e.g., `"Summer Day 15"`)
* **Error states:** None

### `CheckWorldFile(slot)`
* **Description:** Checks if a world save file exists for a slot.
* **Parameters:** `slot` -- slot number to check
* **Returns:** Boolean `true` if world file exists
* **Error states:** None

### `LoadSlotCharacter(slot)`
* **Description:** Loads the character prefab name from a save slot's user session data.
* **Parameters:** `slot` -- slot number (defaults to current slot if nil)
* **Returns:** Character prefab name string or `nil`
* **Error states:** None

### `LoadServerEnabledModsFromSlot(slot)`
* **Description:** Loads and enables server mods from a save slot's stored mod configuration.
* **Parameters:** `slot` -- slot number (defaults to current slot if nil)
* **Returns:** None
* **Error states:** None

### `SetServerEnabledMods(slot)`
* **Description:** Saves currently enabled server mods and their configuration to a save slot.
* **Parameters:** `slot` -- slot number (defaults to current slot if nil)
* **Returns:** None
* **Error states:** None

### `GetEnabledMods(slot)`
* **Description:** Returns the enabled mods data for a save slot.
* **Parameters:** `slot` -- slot number (defaults to current slot if nil)
* **Returns:** Table of enabled mod data
* **Error states:** None

## Events & listeners
None.