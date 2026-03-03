---
id: farmsoildrinker
title: Farmsoildrinker
description: Tracks and calculates the time a soil entity spends in wet and dry states for farming-related moisture logic.
tags: [farming, soil, moisture, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 273a8369
system_scope: world
---

# Farmsoildrinker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FarmSoilDrinker` is a world-level component that tracks cumulative time spent in wet and dry states for a soil entity. It supports networked state persistence via `OnSave`/`OnLoad` and integrates with `farming_manager` to determine current soil moisture. It is typically attached to soil entities (e.g., planted plots) to support dynamic moisture-based behavior and visual feedback.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("farmsoildrinker")
-- Optionally configure callbacks:
inst.components.farmsoildrinker.getdrinkratefn = function(ent) return 1.0 end
inst.components.farmsoildrinker.onsoilmoisturestatechangefn = function(ent, cur, prev) print("Moisture changed") end
```

## Dependencies & tags
**Components used:** `farming_manager` (accessed via `TheWorld.components.farming_manager:IsSoilMoistAtPoint`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `time.dry` | number | `0` | Total accumulated time (in seconds) the soil has been dry. |
| `time.wet` | number | `0` | Total accumulated time (in seconds) the soil has been wet. |
| `timer_start_time` | number | `GetTime()` | Timestamp of the last moisture-state change, used to accumulate partial intervals. |
| `getdrinkratefn` | function | `nil` | Optional callback returning the current moisture consumption rate based on `self.inst`. |
| `onsoilmoisturestatechangefn` | function | `nil` | Optional callback invoked on soil moisture state changes: `(inst, cur_state, prev_state)`. |

## Main functions
### `Reset()`
*   **Description:** Initializes or resets the moisture time counters and timer start time.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateMoistureTime(is_soil_moist, was_soil_moist)`
*   **Description:** Accumulates elapsed time into the appropriate state bucket (`dry` or `wet`) based on the previous moisture state.
*   **Parameters:**  
  - `is_soil_moist` (boolean or `nil`) – Current moisture state. May be `nil` if unknown.  
  - `was_soil_moist` (boolean or `nil`) – Previous moisture state. Used to determine which state timer to update.
*   **Returns:** Nothing.

### `CalcPercentTimeHydrated()`
*   **Description:** Returns the proportion of time the soil has spent in the wet state (as a value between `0` and `1`), using accumulated data and the current real-time moisture state.
*   **Parameters:** None.
*   **Returns:** number – Percentage (0.0 to 1.0) of total time that the soil has been wet.
*   **Error states:** Returns `0` if total time (`dry + wet`) is zero.

### `GetMoistureRate()`
*   **Description:** Returns the current moisture consumption rate for this soil, if a rate function is defined.
*   **Parameters:** None.
*   **Returns:** number – Rate value (typically seconds per moisture unit consumed). Returns `0` if `getdrinkratefn` is `nil`.
*   **Error states:** Returns `0` if `getdrinkratefn` is not assigned.

### `OnSoilMoistureStateChange(cur_state, prev_state)`
*   **Description:** Invokes the optional `onsoilmoisturestatechangefn` callback (if set) when the soil moisture state changes.
*   **Parameters:**  
  - `cur_state` (boolean) – Current moisture state (`true` = wet, `false` = dry).  
  - `prev_state` (boolean) – Previous moisture state.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes component state for persistence (save files / replication).
*   **Parameters:** None.
*   **Returns:** table – Data table with keys:  
  - `time`: `{ dry = number, wet = number }`  
  - `timer_start_time`: number – Adjusted elapsed time since last state change.

### `OnLoad(data)`
*   **Description:** Restores component state from a saved/loaded data table.
*   **Parameters:** `data` (table) – Data returned by `OnSave`.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string summarizing current moisture state and accumulated times.
*   **Parameters:** None.
*   **Returns:** string – Formatted string like `"Ground is wet, Time wet: 12.34, dry: 5.67"`.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:**  
  - `"ms_registersoildrinker"` – Fired once on initialization, passing the entity instance.  
  - `"ms_unregistersoildrinker"` – Fired when the component is removed from the entity.
