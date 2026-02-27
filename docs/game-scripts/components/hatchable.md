---
id: hatchable
title: Hatchable
description: Manages the incubation and hatching process of an egg by tracking progress, thermal comfort, and state transitions based on nearby heating or cooling sources.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: e82d2048
---

# Hatchable

## Overview
This component implements the logic for egg hatching in *Don't Starve Together*. It tracks the egg's progress through distinct states (`unhatched`, `crack`, `comfy`, `uncomfy`, `hatch`, `dead`) and determines thermal suitability using nearby heater/chiller entities (e.g., campfires). Progress increases only when the egg's thermal preferences are met; otherwise, discomfort accumulates and may lead to failure or termination.

## Dependencies & Tags
- **Tags used in entity queries:** `HASHEATER`, `INLIMBO`
- **Component usage:** Relies on the `heater` component of nearby entities to assess thermal impact.
- **No components explicitly added** by this class; it operates solely on the host entity (`inst`) and external entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the host entity the component is attached to. |
| `progress` | `number` | `0` | Current progress toward the next stage (cracking or hatching). |
| `discomfort` | `number` | `0` | Accumulated discomfort from thermal stress (causes hatching failure if excessive). |
| `state` | `string` | `"unhatched"` | Current state of the egg (e.g., `"unhatched"`, `"crack"`, `"hatch"`, `"dead"`). |
| `cracktime` | `number` | `10` | Time (in seconds) required to progress from `unhatched` to `crack` under optimal conditions. |
| `hatchtime` | `number` | `600` | Time (in seconds) required to hatch from the `comfy` state. |
| `hatchfailtime` | `number` | `60` | Time (in seconds) of discomfort accumulation before the egg dies. |
| `heater_prefs` | `table` | `{ day = false, dusk = nil, night = true }` | Desired thermal profile: `true` = requires heating, `false` = requires cooling, `nil` = indifferent. Indexed by phase (`day`, `dusk`, `night`). |
| `chiller_prefs` | `table` | `{ day = false, dusk = false, night = false }` | Complementary chiller preferences (currently unused in logic). |
| `delay` | `boolean` | `false` | Temporary pause flag (set via `:Delay()`). |
| `toohot` | `boolean` | `false` | Tracks if the current environment is too hot. |
| `toocold` | `boolean` | `false` | Tracks if the current environment is too cold. |
| `task` | `Task` | `nil` | Reference to the periodic update task (managed internally). |

## Main Functions
### `Hatchable:GetDebugString()`
* **Description:** Returns a formatted string for debugging, showing current state, progress, and discomfort values.
* **Parameters:** None.

### `Hatchable:SetOnState(fn)`
* **Description:** Registers a callback function to invoke whenever the egg's state changes.
* **Parameters:**
  * `fn(state)` — Function called with arguments `(entity, new_state)`.

### `Hatchable:SetCrackTime(t)`
* **Description:** Sets the time required for the egg to crack open (default: `10` seconds).
* **Parameters:**
  * `t` — New `cracktime` value (seconds).

### `Hatchable:SetHatchTime(t)`
* **Description:** Sets the time required for the egg to hatch once comfortable (default: `600` seconds).
* **Parameters:**
  * `t` — New `hatchtime` value (seconds).

### `Hatchable:SetHatchFailTime(t)`
* **Description:** Sets the threshold of discomfort that causes the egg to die (default: `60` seconds).
* **Parameters:**
  * `t` — New `hatchfailtime` value (seconds).

### `Hatchable:OnState(state, forcestateupdate)`
* **Description:** Updates the egg's state and triggers the `onstatefn` callback if set or state changed.
* **Parameters:**
  * `state` — New state string (e.g., `"crack"`, `"hatch"`).
  * `forcestateupdate` — If `true`, triggers callback even if state did not change.

### `Hatchable:Delay(time)`
* **Description:** Pauses hatching progress for the specified duration.
* **Parameters:**
  * `time` — Delay duration in seconds.

### `Hatchable:StopUpdating()`
* **Description:** Cancels the periodic update task (used when the egg is `dead` or `hatch`ed).
* **Parameters:** None.

### `Hatchable:StartUpdating()`
* **Description:** Begins the periodic update loop (`TUNING.HATCH_UPDATE_PERIOD`) to advance hatching logic. Skips if `dead`, `hatch`, or already running.
* **Parameters:** None.

### `Hatchable:SetHeaterPrefs(day, dusk, night)`
* **Description:** Configures heating preferences for each day phase.
* **Parameters:**
  * `day`, `dusk`, `night` — Booleans or `nil` (indifferent). `true` = needs heating, `false` = needs cooling.

### `Hatchable:SetChillerPrefs(day, dusk, night)`
* **Description:** Configures cooling preferences for each day phase (currently unused).
* **Parameters:** Same as `SetHeaterPrefs`.

### `Hatchable:GetHeaterPref(phase)`
* **Description:** Returns the heating preference for the current world phase.
* **Parameters:** None (uses `TheWorld.state.phase` internally).

### `Hatchable:GetChillerPref(phase)`
* **Description:** Returns the cooling preference for the specified phase (currently unused).
* **Parameters:** None (but expects `phase` as input, even if unused).

### `Hatchable:OnUpdate(dt)`
* **Description:** Core logic loop (runs periodically). Checks for nearby heating/cooling entities, updates comfort, and advances progress. Triggers state changes as appropriate.
* **Parameters:**
  * `dt` — Delta time since last update.

### `Hatchable:OnSave()`
* **Description:** Returns serialization data for saving game state.
* **Parameters:** None.  
* **Returns:** Table with `state`, `progress`, `discomfort`, `toohot`, and `toocold`.

### `Hatchable:OnLoad(data)`
* **Description:** Restores state from saved data and resumes updates.
* **Parameters:**
  * `data` — Table returned from `OnSave()`.

## Events & Listeners
None.