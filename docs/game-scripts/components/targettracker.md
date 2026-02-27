---
id: targettracker
title: Targettracker
description: Tracks and manages entity targeting logic, including timing, pausing, cloning from another tracker, and automatic termination when tracking conditions are no longer met.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 93233840
---

# Targettracker

## Overview
The `TargetTracker` component is responsible for managing target acquisition, tracking duration, pausing/resuming behavior, and automatic termination of target tracking. It is typically attached to entities that need to monitor another entity (the target) for a specific purpose (e.g., a character focusing on a monster or item), updating tracking time, checking validity of the target, and invoking callbacks during state transitions.

## Dependencies & Tags
- **Component Dependency:** `target` must have `components.targettracker` for `CloneTargetFrom` to function properly.
- **Tag Usage:** None explicitly added or removed by this component.
- **Component Registration:** Requires `inst:StartUpdatingComponent(self)` and `inst:StopUpdatingComponent(self)` for update lifecycle management.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `Entity` or `nil` | `nil` | The currently tracked entity. |
| `timetracking` | `number` or `nil` | `nil` | Accumulated time (in seconds) spent tracking the target. |
| `pausetime` | `number` or `nil` | `nil` | Remaining pause duration (if paused). |
| `onresettarget` | `function` or `nil` | `nil` | Callback invoked when tracking is reset/ended. Called as `fn(inst, target)`. |
| `onpausefn` | `function` or `nil` | `nil` | Callback invoked when tracking is paused. Called as `fn(inst)`. |
| `onresumefn` | `function` or `nil` | `nil` | Callback invoked when tracking resumes after a pause. Called as `fn(inst)`. |
| `ontimeupdatefn` | `function` or `nil` | `nil` | Callback invoked on each update tick during tracking. Called as `fn(inst, total_time, delta_time)`. |
| `shouldkeeptrackingfn` | `function` or `nil` | `nil` | Custom predicate function to decide whether tracking should continue. Called as `fn(inst, target)`. |
| `_updating` | `boolean` | `false` | Internal flag indicating if the component is currently receiving periodic updates. |

## Main Functions

### `SetOnResetTarget(fn)`
* **Description:** Assigns a callback function to be executed when the component finishes tracking (via `StopTracking(true)`).
* **Parameters:**
  * `fn` (`function`): Function to call on reset. Signature: `fn(inst, target)`.

### `SetOnPauseFn(fn)`
* **Description:** Assigns a callback function to be executed when `Pause()` is called.
* **Parameters:**
  * `fn` (`function`): Function to call on pause. Signature: `fn(inst)`.

### `SetOnResumeFn(fn)`
* **Description:** Assigns a callback function to be executed when tracking resumes after the pause duration elapses.
* **Parameters:**
  * `fn` (`function`): Function to call on resume. Signature: `fn(inst)`.

### `SetOnTimeUpdateFn(fn)`
* **Description:** Assigns a callback function to be invoked each update tick while tracking and not paused.
* **Parameters:**
  * `fn` (`function`): Function to call on time update. Signature: `fn(inst, total_time, last_time)`.

### `SetShouldKeepTrackingFn(fn)`
* **Description:** Sets a custom predicate function used during updates to determine if tracking should continue. If it returns `false`, tracking stops.
* **Parameters:**
  * `fn` (`function`): Function to call to decide continuation. Signature: `fn(inst, target)`.

### `HasTarget()`
* **Description:** Returns whether a target is currently being tracked.
* **Returns:** `boolean` — `true` if a target is assigned; otherwise `false`.

### `IsTracking(testtarget)`
* **Description:** Checks if the given entity is the currently tracked target.
* **Parameters:**
  * `testtarget` (`Entity`): The entity to compare against the current target.
* **Returns:** `boolean` — `true` if `testtarget` matches `self.target`.

### `IsPaused()`
* **Description:** Indicates whether tracking is currently paused.
* **Returns:** `boolean` — `true` if `pausetime` is not `nil`.

### `IsCloningTarget()`
* **Description:** Determines if the tracker is cloning the target from another tracker (i.e., cloning with no elapsed tracking time and currently paused).
* **Returns:** `boolean` — `true` if `timetracking <= 0` and the tracker is paused.

### `GetTimeTracking()`
* **Description:** Returns the accumulated tracking time (in seconds).
* **Returns:** `number` or `nil` — Total tracked time, or `nil` if not tracking.

### `SetTimeTracking(time)`
* **Description:** Manually sets the tracking time and triggers the time update callback if defined.
* **Parameters:**
  * `time` (`number`): The value to assign to `timetracking`.

### `CloneTargetFrom(item, pausetime)`
* **Description:** Clones the target and pausing state from another `TargetTracker` attached to the given `item`. Does nothing if the source tracker has no target or no tracking time.
* **Parameters:**
  * `item` (`Entity`): Entity with a `targettracker` component to clone from.
  * `pausetime` (`number` or `nil`): If provided, sets the pause duration for both trackers.

### `TrackTarget(target)`
* **Description:** Begins tracking the specified entity. Sets up internal state and registers an event listener to stop tracking if the target is removed.
* **Parameters:**
  * `target` (`Entity`): The entity to begin tracking.

### `StopTracking(reset)`
* **Description:** Halts tracking and resets internal state. Optionally triggers the reset callback.
* **Parameters:**
  * `reset` (`boolean`): If `true`, invokes the `onresettarget` callback (if set).

### `Pause(time)`
* **Description:** Pauses tracking for a specified duration.
* **Parameters:**
  * `time` (`number`): Duration in seconds to pause.

### `OnUpdate(dt)`
* **Description:** Handles periodic updates (both via `Update` and `LongUpdate`). Validates the target, updates tracking time, handles pausing/resuming, and stops tracking if the target is no longer valid.
* **Parameters:**
  * `dt` (`number`): Delta time in seconds since last update.

### `GetDebugString()`
* **Description:** Returns a formatted string summarizing the current state for debugging.
* **Returns:** `string` — Human-readable debug info including target, time tracking, pause time, and update status.

## Events & Listeners
- **Listens to:**
  - `"onremove"` on `self.target`: Triggers `self:StopTracking(true)`.
- **Pushes events:**
  - `"targettracker_starttrack"` with argument `target`: Fired when tracking begins.
  - `"targettracker_stoptrack"`: Fired when tracking ends.