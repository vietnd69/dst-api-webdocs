---
id: savedata
title: Savedata
description: Base utility class for loading, saving, and erasing persistent player or world data to disk using TheSim's API.
tags: [data, persistence, util]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: util
source_hash: e42056d9
system_scope: network
---

# Savedata

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Savedata` is a base utility class for managing persistent data storage for mods or the game itself. It abstracts the low-level `TheSim:GetPersistentString`, `TheSim:SetPersistentString`, and `TheSim:ErasePersistentString` calls into a clean interface for saving, loading, and resetting data. It includes dirty-flag optimization (to skip unnecessary writes), conditional dev-mode filename suffixing, and optional callback support for async operations.

## Usage example
```lua
local SaveData = require "util/savedata"
local mydata = SaveData("my_mod_data")

-- Set and save data
mydata:SetValue("score", 100)
mydata:SetValue("level", 5)
mydata:Save()

-- Load data with callback
mydata:Load(function(success)
    if success then
        local score = mydata:GetValue("score")
        print("Loaded score:", score)
    else
        print("Failed to load saved data")
    end
end)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `filename` | string | — | Basename for the persistent storage file; dev builds get `_<branch>` appended. |
| `persistdata` | table | `{}` | In-memory table storing key-value pairs to be persisted. |
| `dirty` | boolean | `true` | Flag indicating whether unsaved changes exist. |

## Main functions
### `SetValue(name, value)`
* **Description:** Stores a value in the in-memory `persistdata` table. Marks the component as dirty if the value changed.
* **Parameters:**  
  - `name` (string): Key for the data.  
  - `value`: Any Lua type (string, number, table, etc.).  
* **Returns:** Nothing.

### `GetValue(name)`
* **Description:** Retrieves a stored value by key.
* **Parameters:** `name` (string) — the key to look up.  
* **Returns:** The stored value, or `nil` if not present.

### `Save(cb)`
* **Description:** Writes `persistdata` to persistent storage if `dirty` is `true`. Uses `DataDumper` to serialize the table. Executes optional callback `cb(success)` upon completion.
* **Parameters:**  
  - `cb` (function, optional) — callback accepting a single boolean argument: `true` on success, `false` on failure.  
* **Returns:** Nothing.

### `Load(cb)`
* **Description:** Reads persistent data from disk and deserializes it into `persistdata` using `RunInSandbox`. Executes optional callback `cb(success)` after load attempt.
* **Parameters:**  
  - `cb` (function, optional) — callback accepting a single boolean argument: `true` if load and parse succeeded, `false` otherwise.  
* **Returns:** Nothing.

### `Reset()`
* **Description:** Clears `persistdata` and marks the component as dirty (so the next `Save` will persist the empty state).
* **Parameters:** None.  
* **Returns:** Nothing.

### `Erase(cb)`
* **Description:** Resets in-memory data and deletes the persistent file from disk if it exists. Executes optional callback `cb(success)` after the erase operation.
* **Parameters:**  
  - `cb` (function, optional) — callback accepting a single boolean argument: `true` on success, `false` on failure.  
* **Returns:** Nothing.

## Events & listeners
None.