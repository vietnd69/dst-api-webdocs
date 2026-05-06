---
id: dataanalyzer
title: DataAnalyzer
description: Manages creature scan data history with periodic regeneration for WX-78 module systems.
tags: [wx78, data, scanning]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: components
source_hash: 86c91703
system_scope: entity
---

# DataAnalyzer

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`DataAnalyzer` tracks and manages creature scan data history for entities, typically used with WX-78 scanning modules. It stores data values per creature prefab, supports periodic data regeneration over time, and persists data across save/load cycles. The component integrates with `wx78_moduledefs` to retrieve creature data definitions including maximum data caps.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dataanalyzer")

-- Start automatic data regeneration every 60 seconds
inst.components.dataanalyzer:StartDataRegen(60)

-- Query data for a specific creature
local data = inst.components.dataanalyzer:GetData("spider")

-- Spend accumulated data (returns amount spent)
local spent = inst.components.dataanalyzer:SpendData("spider")

-- Stop regeneration when no longer needed
inst.components.dataanalyzer:StopDataRegen()
```

## Dependencies & tags
**External dependencies:**
- `wx78_moduledefs.GetCreatureScanDataDefinition` -- retrieves creature scan data definitions including maxdata caps

**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. |
| `datahistory` | table | `{}` | Maps prefab/scan IDs to accumulated data values. Persists across save/load. |
| `_process_data_task` | task | `nil` | Scheduled periodic task handle for data regeneration. Cancelled on StopDataRegen(). |

## Main functions
### `StartDataRegen(dt)`
*   **Description:** Starts periodic data regeneration that increases stored data values over time. Cancels any existing regeneration task before creating a new one. Regeneration increases each prefab's data by `maxdata/16` per interval, capped at `maxdata`.
*   **Parameters:** `dt` (number) -- time interval in seconds between regeneration ticks.
*   **Returns:** nil
*   **Error states:** None

### `StopDataRegen()`
*   **Description:** Cancels the active data regeneration periodic task and clears the task handle. Safe to call multiple times or when no task is active.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `GetData(ent_or_prefab)`
*   **Description:** Retrieves the current accumulated data value for a creature. If the prefab has no history entry but has a creature definition, initializes it to `maxdata` before returning. Returns 0 if no data exists and no definition is available.
*   **Parameters:** `ent_or_prefab` (entity or string) -- entity instance or prefab name string to query.
*   **Returns:** number -- floor of accumulated data value, or 0 if unavailable.
*   **Error states:** None

### `SpendData(prefab)`
*   **Description:** Extracts and returns the floor of accumulated data for a prefab, then reduces the stored value by that amount. If no history entry exists but a creature definition is available, initializes to `maxdata` before spending. Returns 0 if no data is available.
*   **Parameters:** `prefab` (string) -- prefab name to spend data from.
*   **Returns:** number -- amount of data spent (floor of stored value before deduction), or 0.
*   **Error states:** None

### `OnSave()`
*   **Description:** Returns a table containing the `datahistory` for persistence. Called automatically when the world saves.
*   **Parameters:** None
*   **Returns:** table -- `{ datahistory = self.datahistory }`
*   **Error states:** None

### `OnLoad(data, newents)`
*   **Description:** Restores `datahistory` from saved data. Called automatically when the world loads. Safely handles nil or missing `datahistory` in the load table.
*   **Parameters:**
    - `data` (table or nil) -- saved component data table
    - `newents` (table) -- entity remapping table (unused by this component)
*   **Returns:** nil
*   **Error states:** None

## Events & listeners
None identified.