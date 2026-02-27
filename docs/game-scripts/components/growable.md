---
id: growable
title: Growable
description: Manages timed plant growth across configurable growth stages, including pausing, resuming, off-screen progression, and save/load support.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 03f366c3
---

# Growable

## Overview
The `Growable` component enables entities to progress through a sequence of growth stages over time. It supports pausing/resuming, time multipliers, off-screen growth, and integrates with the game’s sleep/wake system to handle entity state transitions. Growth is driven by internal timers, stage metadata, and optional callback functions.

## Dependencies & Tags
- **Component usage:** Relies on `inst:DoTaskInTime()` for scheduling growth steps and `inst:IsAsleep()`/`inst:IsValid()` for state checks.
- **No explicit components added or tags assigned.**  
- **Event listeners (see Events & Listeners):** None defined directly — but reacts to entity lifecycle events via `OnEntitySleep`, `OnEntityWake`, and `OnRemoveFromEntity`.

## Properties
The component does not define properties in `_ctor`, but the following internal state variables are initialized or used:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity the component is attached to (set in constructor). |
| `stages` | `table` | `nil` | Array of stage definitions — each entry is a table with optional keys: `fn`, `time`, `growfn`, `pregrowfn`, `multiplier`. |
| `stage` | `number` | `1` | Current stage index (1-based). |
| `targettime` | `number?` | `nil` | Global game time at which current stage completion is scheduled. |
| `pausedremaining` | `number?` | `nil` | Remaining time (in seconds) when growth is paused. |
| `task` | `Task?` | `nil` | Scheduled task handle for the next growth step. |
| `pausereasons` | `table` | `{}` | Map of string reasons → boolean; tracks why growth is paused. |
| `sleeptime` | `number?` | `nil` | Timestamp when entity last went to sleep (for off-screen time tracking). |
| `growonly` | `boolean` | `false` *(uninitialized)* | If `true`, skip changing stage visuals/logic, only run `growfn`s. |
| `springgrowth` | `boolean` | `false` *(uninitialized)* | If `true`, apply seasonal growth modifiers. |
| `growoffscreen` | `boolean` | `false` *(uninitialized)* | If `true`, allow growth while entity is asleep/hidden. |
| `loopstages` | `boolean` | `false` *(uninitialized)* | If `true`, loop back to start after final stage. |
| `loopstages_start` | `number` | `1` *(uninitialized)* | Stage index to loop back to (used only if `loopstages` is `true`). |
| `usetimemultiplier` | `boolean` | `false` *(uninitialized)* | Whether to scale growth time using stage multipliers during `OnLoad`. |
| `domagicgrowthfn` | `function?` | `nil` *(uninitialized)* | Optional callback for immediate growth (e.g., via magic). |

> **Note:** Boolean flags like `growonly`, `springgrowth`, `growoffscreen`, etc., are commented out in `_ctor` and remain unassigned by default. They must be explicitly set by consuming code to take effect.

## Main Functions

### `StartGrowingTask(time)`
* **Description:** Schedules the next growth tick at a future time (in seconds). Automatically cancels any existing task. Only proceeds if `growoffscreen` is `true` or the entity is not asleep.
* **Parameters:**
  * `time` (`number`): Time in seconds from now to trigger growth.

### `StartGrowing(time)`
* **Description:** Starts (or restarts) the growth process. Uses `time` if provided; otherwise, consults `stages[self.stage].time` and applies fallback. Supports `springgrowth` and `usetimemultiplier`.
* **Parameters:**
  * `time` (`number?`): Optional explicit growth time (seconds). If `nil`, derived from stage metadata.

### `StopGrowing()`
* **Description:** Cancels scheduled growth, resets timing fields (`targettime`, `pausedremaining`), and clears the task.

### `GetNextStage()`
* **Description:** Returns the next stage index, respecting `loopstages` and `loopstages_start`.
* **Returns:**
  * `number`: Next stage index (1-based), or final stage if looping is disabled.

### `GetStage()`
* **Description:** Returns current stage index.
* **Returns:**
  * `number`

### `GetCurrentStageData()`
* **Description:** Returns the metadata table for the current stage (i.e., `stages[stage]`).
* **Returns:**
  * `table?`

### `IsGrowing()`
* **Description:** Checks whether growth is currently scheduled.
* **Returns:**
  * `boolean`: `true` if `targettime` is non-`nil`.

### `DoMagicGrowth(doer)`
* **Description:** Triggers immediate growth (skipping timers) via a configurable callback (`domagicgrowthfn`).
* **Parameters:**
  * `doer` (`Entity?`): Optional entity performing the growth (e.g., player or tool).
* **Returns:**
  * `boolean?`: `true` if `domagicgrowthfn` exists and executed; `nil` otherwise.

### `DoGrowth(skipgrownfn)`
* **Description:** Advances growth by one stage. Handles `pregrowfn`, `growfn`, and may restart growth if not complete.
* **Parameters:**
  * `skipgrownfn` (`boolean`): If `true`, skips calling `growfn` for the new stage (used for bulk processing).
* **Returns:**
  * `boolean`: `true` if advancement occurred; `false` if already finished and not paused.

### `Pause(reason)`
* **Description:** Pauses ongoing growth. Saves remaining time to `pausedremaining`, cancels task, and records `reason`.
* **Parameters:**
  * `reason` (`string?`): Optional identifier for the pause source (e.g., `"winter"`, `"held"`).

### `Resume(reason)`
* **Description:** Removes a pause reason; if no reasons remain, reschedules growth using stored `pausedremaining`.
* **Parameters:**
  * `reason` (`string?`): Pause reason to remove.
* **Returns:**
  * `boolean`: `true` if resumed successfully (i.e., resumed from a full pause).

### `IsPaused()`
* **Description:** Checks whether growth is currently paused.
* **Returns:**
  * `boolean`: `true` if `pausedremaining` is non-`nil`.

### `ExtendGrowTime(extra_time)`
* **Description:** Adds time to either the remaining `pausedremaining` or active `targettime`.
* **Parameters:**
  * `extra_time` (`number`): Seconds to add.

### `SetStage(stage)`
* **Description:** Forces stage to a specific index (clamped to max). Runs the stage’s `fn` callback if present.
* **Parameters:**
  * `stage` (`number`): Target stage index.

### `OnSave()`
* **Description:** Serializes growth state for save files.
* **Returns:**
  * `table?`: Contains `stage`, `time`, `sleeptime`, `usetimemultiplier`. `nil` if nothing to serialize.

### `OnLoad(data)`
* **Description:** Restores growth state from saved data. Handles stage restoration, sleeper clock offset, and scheduled time resumption.
* **Parameters:**
  * `data` (`table?`): Saved state dictionary.

### `LongUpdate(dt)`
* **Description:** Processes elapsed simulation time (e.g., wake-up catch-up, bulk growth). Used when entity wakes or catches up after being offline.
* **Parameters:**
  * `dt` (`number`): Delta time (seconds) to advance.

### `OnEntitySleep()`
* **Description:** Cancels scheduled task and records sleep start time for off-screen calculation.
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Handles entity waking: applies sleep-time delta via `LongUpdate` or reschedules task.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string describing growth status.
* **Returns:**
  * `string`: Status like `"Growing! Stage: 2  |  Timeleft: 3.45s"` or `"Paused! Stage: 1,  |  Timeleft: 10s"`.

## Events & Listeners
This component does **not** register any event listeners via `inst:ListenForEvent`.  
It does **not** push custom events via `inst:PushEvent`.  

However, it provides lifecycle hooks (`OnSave`, `OnLoad`, `OnEntitySleep`, `OnEntityWake`, `Growable.OnRemoveFromEntity`) intended to be bound by the consuming entity’s event system.

## Notes
- `stage` indices are **1-based**.
- Stage metadata entries support optional functions: `fn` (on-stage-set), `pregrowfn` (pre-stage-advance), `growfn` (post-stage-advance), and `time` (growth duration calculation).
- Growth time scaling via `multiplier` is applied during `StartGrowing` and `OnLoad`.
- Sleep/wake logic ensures entities only grow while awake unless `growoffscreen` is enabled.
- `growonly` mode is intended for cases where stage progression should be hidden (e.g., for decorative or background entities) — growth callbacks run, but `SetStage` is skipped.
- Time values are stored and computed in *game time seconds*, not wall-clock time.