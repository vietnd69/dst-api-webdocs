---
id: farmsoildrinker
title: Farmsoildrinker
description: Tracks and calculates the hydration history of a soil entity by measuring time spent in wet and dry states.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 273a8369
---

# Farmsoildrinker

## Overview
This component monitors the moisture state of a soil entity over time, recording cumulative durations in wet and dry conditions. It supports persistence (via `OnSave`/`OnLoad`), dynamic hydration rate reporting, state-change callbacks, and debug visualization. It is automatically registered with the world on creation and unregistered on removal.

## Dependencies & Tags
- `TheWorld.components.farming_manager`: Used to query soil moisture at the entity's position.
- Registers/unregisters itself with the world via events `"ms_registersoildrinker"` and `"ms_unregistersoildrinker"`.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owning entity (soil container). |
| `time.dry` | `number` | `0` | Cumulative time (in seconds) the soil has been dry. |
| `time.wet` | `number` | `0` | Cumulative time (in seconds) the soil has been wet. |
| `timer_start_time` | `number` | `GetTime()` | Timestamp of the last state-change update. |
| `getdrinkratefn` | `function?` | `nil` | Optional callback returning the soil’s hydration rate. |
| `onsoilmoisturestatechangefn` | `function?` | `nil` | Optional callback invoked when soil moisture state changes. |

## Main Functions

### `Reset()`
* **Description:** Initializes or resets all tracked time counters and the internal timer.
* **Parameters:** None.

### `UpdateMoistureTime(is_soil_moist, was_soil_moist)`
* **Description:** Updates cumulative wet/dry time based on the soil’s current and previous moisture state. Adds elapsed time since `timer_start_time` to the appropriate counter.
* **Parameters:**  
  - `is_soil_moist`: Boolean indicating current moisture state (or `nil` to infer).  
  - `was_soil_moist`: Boolean indicating previous moisture state.

### `CalcPercentTimeHydrated()`
* **Description:** Computes the percentage of total elapsed time the soil has been wet. Updates moisture time before calculating.
* **Parameters:** None.  
* **Returns:** `number` between `0` (never wet) and `1` (always wet).

### `GetMoistureRate()`
* **Description:** Returns the current hydration rate by invoking the optional `getdrinkratefn` callback, or `0` if not set.
* **Parameters:** None.  
* **Returns:** `number` representing hydration rate.

### `OnSoilMoistureStateChange(cur_state, prev_state)`
* **Description:** Invokes the optional `onsoilmoisturestatechangefn` callback with current and previous moisture states.
* **Parameters:**  
  - `cur_state`: Current soil moisture state (e.g., `"wet"`, `"dry"`).  
  - `prev_state`: Previous soil moisture state.

### `OnSave()`
* **Description:** Serializes hydration tracking data for persistence. Includes elapsed time counters and an adjusted `timer_start_time` to account for ongoing updates.
* **Parameters:** None.  
* **Returns:** `table` with keys `time` (table of `dry`/`wet` values) and `timer_start_time`.

### `OnLoad(data)`
* **Description:** Restores hydration tracking data from saved state. Recalculates `timer_start_time` for continuity.
* **Parameters:**  
  - `data`: `table` matching the structure returned by `OnSave()`.

### `GetDebugString()`
* **Description:** Returns a human-readable string for debugging, showing current moisture state and elapsed times (including pending time since last update).
* **Parameters:** None.  
* **Returns:** `string`.

## Events & Listeners
- **Listens on creation (via `DoTaskInTime`):** Pushes `"ms_registersoildrinker"` event on world to register itself.  
- **On removal (`OnRemoveFromEntity`):** Pushes `"ms_unregistersoildrinker"` event to unregister itself.  
- No internal `inst:ListenForEvent` calls are present in this component.