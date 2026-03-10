---
id: playerdeaths
title: Playerdeaths
description: Manages persistent death logs for players, including sorting, saving, and loading historical death records.
tags: [player, persistence, save, death]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ff338f86
system_scope: player
---

# Playerdeaths

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Playerdeaths` is a persistence component responsible for tracking and storing player death records. It maintains an in-memory list of death events (`persistdata`), handles sorting by configurable fields (e.g., `days_survived`), and manages saving/loading to/from persistent storage via `TheSim:GetPersistentString` and `SavePersistentString`. It is intended to be used on a global or shared entity (e.g., a `morgue` entity) that persists across world loads.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playerdeaths")

-- Load existing data (async)
inst.components.playerdeaths:Load(function(success)
    if success then
        local rows = inst.components.playerdeaths:GetRows()
        print("Loaded", #rows, "death records")
    end
end)

-- Record a new death
inst.components.playerdeaths:OnDeath({
    days_survived = 12,
    killed_by = "Worm",
    character = "Walter"
})

-- Save manually if needed
inst.components.playerdeaths:Save()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persistdata` | table | `{}` | List of death record tables, each containing metadata (e.g., `days_survived`, `killed_by`). |
| `dirty` | boolean | `true` | Indicates whether `persistdata` has unsaved changes. |
| `sort_function` | function | `function(a,b) return (a.days_survived or 1) > (b.days_survived or 1) end` | Default comparison function used to sort death records by `days_survived` descending. |

## Main functions
### `Reset()`
*   **Description:** Clears all stored death records, marks data as dirty, and immediately saves an empty state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnDeath(row)`
*   **Description:** Appends a new death record to `persistdata`. On Xbox One (`IsXB1()`), attempts to resolve a player name to a network ID (`row.netid`) if the death was caused by another player (`row.pk` and `row.killed_by` are present). Triggers an immediate save.
*   **Parameters:** `row` (table) — death record object; expected keys include `days_survived`, `killed_by`, and optionally `pk`, `netid`.
*   **Returns:** Nothing.

### `GetRows()`
*   **Description:** Returns the current list of death records.
*   **Parameters:** None.
*   **Returns:** `table` — array of death record tables (e.g., `{ {days_survived=5, ...}, ... }`).

### `Sort(field)`
*   **Description:** Sorts `persistdata` in-place. Uses the default `sort_function` if `field` is `nil`, or a field-specific function based on whether the field values are strings or numbers. Uses `stringidsorter` for strings.
*   **Parameters:** `field` (string or `nil`) — optional field name to sort by.
*   **Returns:** Nothing.

### `Save(callback)`
*   **Description:** Serializes and saves `persistdata` to persistent storage *only if* `dirty` is `true`. Ensures the list size does not exceed 40 records by trimming oldest entries. Optionally invokes `callback(true)` on success or `callback(true)` for unchanged data; does not invoke `callback` on failure.
*   **Parameters:** `callback` (function or `nil`) — optional function to call after saving; signature `function(success)`.
*   **Returns:** Nothing.

### `Load(callback)`
*   **Description:** Asynchronously loads death records from persistent storage using `TheSim:GetPersistentString`. Invokes `Set` internally with the loaded string.
*   **Parameters:** `callback` (function or `nil`) — optional function to call after loading; signature `function(success)`.
*   **Returns:** Nothing.

### `Set(str, callback)`
*   **Description:** Parses and sets `persistdata` from a JSON-encoded string. Sorts the records upon successful load. Clears the `dirty` flag. Calls `callback(true)` on success or `callback(false)` on failure/empty input.
*   **Parameters:**  
  - `str` (string or `nil`) — JSON-encoded death records string.  
  - `callback` (function or `nil`) — optional function to call after parsing.
*   **Returns:** Nothing.

### `GetSaveName()`
*   **Description:** Returns the persistent storage key used for saving/loading. Returns `"morgue"` unless the current branch is `"dev"`, in which case it returns `"morgue_dev"`.
*   **Parameters:** None.
*   **Returns:** `string` — storage key (e.g., `"morgue"`, `"morgue_dev"`).

## Events & listeners
None identified