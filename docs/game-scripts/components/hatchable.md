---
id: hatchable
title: Hatchable
description: Manages the incubation process for eggs, tracking progress toward hatching or failure based on thermal conditions and time.
tags: [egg, thermoregulation, lifecycle, incubation, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e82d2048
system_scope: entity
---

# Hatchable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hatchable` manages the lifecycle of an egg-like entity through three primary states: `unhatched`, `crack`, and `hatch`, or failure to `dead`. It monitors the thermal environment by querying nearby `heater` components to determine if the egg receives suitable warmth (exothermic heat) or cooling (endothermic heat) depending on time-of-day preferences. The component handles progress accumulation for hatching or discomfort buildup leading to failure. It integrates with the world's phase cycle (`day`, `dusk`, `night`) and persists state across saves via `OnSave`/`OnLoad`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hatchable")
inst.components.hatchable:SetCrackTime(15)
inst.components.hatchable:SetHatchTime(900)
inst.components.hatchable:SetHeaterPrefs(true, nil, true)
inst.components.hatchable:StartUpdating()
```

## Dependencies & tags
**Components used:** `heater` (via `inst.components.heater:GetHeat`, `IsExothermic`, `IsEndothermic`)
**Tags:** Adds `HASHEATER` to entities it searches for; checks `INLIMBO` to exclude from heating calculations.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `progress` | number | `0` | Current progress toward cracking or hatching. |
| `discomfort` | number | `0` | Accumulated discomfort when environment is unsuitable. |
| `state` | string | `"unhatched"` | Current state: `"unhatched"`, `"crack"`, `"comfy"`, `"uncomfy"`, `"dead"`, or `"hatch"`. |
| `cracktime` | number | `10` | Seconds required to transition from `unhatched` to `crack`. |
| `hatchtime` | number | `600` | Seconds required to transition from `comfy` to `hatch`. |
| `hatchfailtime` | number | `60` | Seconds of discomfort before transitioning to `dead`. |
| `heater_prefs` | table | `{ day=false, dusk=nil, night=true }` | Per-phase preferences for desired heat sources (`true`=needs heat, `false`=needs no heat, `nil`=indifferent). |
| `chiller_prefs` | table | `{ day=false, dusk=false, night=false }` | Per-phase preferences for desired cooling sources (`true`=needs cooling, `false`=no cooling needed, `nil`=indifferent). |
| `delay` | boolean | `false` | Whether updates are temporarily suspended (e.g., during an animation). |
| `toohot` | boolean | `false` | Whether current environment is too hot (unsuitable for comfort). |
| `toocold` | boolean | `false` | Whether current environment is too cold (unsuitable for comfort). |

## Main functions
### `GetDebugString()`
*   **Description:** Returns a formatted string summarizing the current state, progress, and discomfort for debugging output.
*   **Parameters:** None.
*   **Returns:** `string` — Human-readable debug info (e.g., `"state: crack, progress: 9.50/10.00, discomfort: 1.20/60.00"`).

### `OnState(state, forcestateupdate)`
*   **Description:** Updates the internal `state` and invokes the optional `onstatefn` callback if the state has changed or forced update.
*   **Parameters:**  
    - `state` (string) — New state value (e.g., `"crack"`, `"hatch"`).  
    - `forcestateupdate` (boolean, optional) — If `true`, invokes callback even if state hasn’t changed.
*   **Returns:** Nothing.

### `StartUpdating()`
*   **Description:** Begins periodic updates of the hatch logic (every `TUNING.HATCH_UPDATE_PERIOD` seconds) unless already running or in terminal state (`dead`/`hatch`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopUpdating()`
*   **Description:** Cancels the periodic update task and sets `self.task` to `nil`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetHeaterPrefs(day, dusk, night)`
*   **Description:** Configures whether the egg requires heat during each world phase. `nil` indicates indifference.
*   **Parameters:**  
    - `day`, `dusk`, `night` (boolean or `nil`) — Desired heat state for the respective phases.  
*   **Returns:** Nothing.

### `SetChillerPrefs(day, dusk, night)`
*   **Description:** Configures whether the egg requires cooling during each world phase. `nil` indicates indifference.
*   **Parameters:**  
    - `day`, `dusk`, `night` (boolean or `nil`) — Desired cooling state for the respective phases.  
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes core state data for saving to disk.
*   **Parameters:** None.
*   **Returns:** `table` — Data table with keys: `state`, `progress`, `discomfort`, `toohot`, `toocold`.

### `OnLoad(data)`
*   **Description:** Restores state data from save and restarts updates.
*   **Parameters:**  
    - `data` (table or `nil`) — Serialized data from `OnSave()`.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** `state_changed` — triggered implicitly via `onstatefn` callback (if set) when `OnState()` updates the state. Note: this is not a formal `PushEvent`; it is a user-defined callback mechanism.
