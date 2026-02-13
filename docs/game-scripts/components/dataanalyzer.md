---
id: dataanalyzer
title: Dataanalyzer
description: This component manages a history of collectible "data" for various creature prefabs, allowing it to regenerate over time and be spent by the entity.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: player
---

# Dataanalyzer

## Overview
This component is responsible for managing a resource referred to as "data" associated with different creature prefabs. It maintains a history of these data values, provides methods for them to regenerate periodically, and allows the entity to retrieve and spend these accumulated data points. It is typically associated with WX-78's scanning and module system, as indicated by the dependency on `wx78_moduledefs`.

## Dependencies & Tags
None identified.

## Properties
| Property            | Type                  | Default Value | Description                                                              |
| :------------------ | :-------------------- | :------------ | :----------------------------------------------------------------------- |
| `inst`              | `Entity`              | `nil`         | The entity this component is attached to.                                |
| `datahistory`       | `table`               | `{}`          | A table mapping prefab names (string) to their current "data" value (number). |
| `_process_data_task`| `PeriodicTask` (table)| `nil`         | An internal handle for the currently running data regeneration task.     |

## Main Functions
### `StartDataRegen(dt)`
*   **Description:** Initiates a periodic task that calls an internal helper function (`process_data_increase`) every `dt` seconds to regenerate "data" for all entries in `datahistory`. If a data regeneration task is already active, it is cancelled before starting a new one.
*   **Parameters:**
    *   `dt` (number): The time interval, in seconds, between each data regeneration step.

### `StopDataRegen()`
*   **Description:** Cancels any currently active data regeneration task, effectively halting the periodic increase of "data" values for all prefabs.
*   **Parameters:** None.

### `GetData(prefab)`
*   **Description:** Retrieves the current "data" value for a specified prefab. If the prefab has no existing data history, it attempts to initialize its data to the `maxdata` value defined in `wx78_moduledefs`. Returns 0 if the prefab is unknown and has no recorded data. The returned value is floored to an integer.
*   **Parameters:**
    *   `prefab` (string): The name of the prefab to retrieve data for.

### `SpendData(prefab)`
*   **Description:** Spends all currently accumulated "data" for a specified prefab. The total floored integer value of the data is returned, and the fractional part (if any) is retained in the `datahistory`. If the prefab has no data history, it is first initialized to its `maxdata` value. Returns 0 if the prefab is unknown and has no recorded data.
*   **Parameters:**
    *   `prefab` (string): The name of the prefab to spend data from.

### `OnSave()`
*   **Description:** Prepares the component's state for persistent saving by returning a table containing the current `datahistory`.
*   **Parameters:** None.

### `OnLoad(data, newents)`
*   **Description:** Restores the component's state from saved game data. Specifically, it loads the `datahistory` table from the provided `data` table.
*   **Parameters:**
    *   `data` (table): The table containing the saved component data.
    *   `newents` (table): A table mapping old entity IDs to new ones (this parameter is unused by the component).