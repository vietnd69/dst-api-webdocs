---
id: worldsettingstimer
title: Worldsettingstimer
description: Manages named, saveable timers with pause/resume, time scaling, and event/callback execution in the world context.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 454412f0
---

# Worldsettingstimer

## Overview
This component provides a centralized timer system for an entity, allowing multiple named timers to be added, started, paused, resumed, and saved/loaded. It supports custom callbacks or `timerdone` events upon completion, maintains time state across saves (using normalized fractional time), and integrates with long updates for world-scale time progression.

## Dependencies & Tags
* Depends on `inst:DoTaskInTime()` for scheduling callbacks.
* Uses `GetTime()` to compute elapsed time.
* Emits the `timerdone` event via `inst:PushEvent` when a timer completes (unless a callback is provided).
* No components or tags are added or removed by this class.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to. |
| `timers` | `table` | `{}` | Map of active/inactive timer configurations by name. Each entry stores `maxtime`, `enabled`, `callback`, `externallongupdate`, and optionally `timeleft`, `end_time`, `initial_time`, `paused`, `blocklongupdate`, and `timer`. |
| `saved_timers` | `table` | `{}` | Holds timer definitions loaded from save data but not yet added (via `AddTimer`) — used to defer timer initialization until later. |

## Main Functions

### `AddTimer(name, maxtime, enabled, callback, externallongupdate)`
* **Description:** Registers a new timer with the given parameters. If a saved state exists for this name, it immediately starts the timer using that saved state.
* **Parameters:**
  * `name` (string): Unique identifier for the timer.
  * `maxtime` (number): Total duration of the timer in seconds.
  * `enabled` (boolean): If false, the timer starts in a disabled (inactive) state.
  * `callback` (function or nil): Optional function called when timer completes. If nil, the `timerdone` event is pushed.
  * `externallongupdate` (boolean or nil): If true, this timer is excluded from `LongUpdate` updates.

### `StartTimer(name, time, paused, initialtime_override, blocklongupdate)`
* **Description:** Begins a registered timer with a specific initial duration. Must be called after `AddTimer`. Automatically cancels any existing long task for the timer.
* **Parameters:**
  * `name` (string): Timer name.
  * `time` (number): Time remaining in seconds.
  * `paused` (boolean): Whether the timer starts paused.
  * `initialtime_override` (number or nil): Overrides the internal `initial_time` used for time elapsed calculation.
  * `blocklongupdate` (boolean or nil): If true, prevents `LongUpdate` from modifying this timer.

### `StopTimer(name)`
* **Description:** Cancels the timer and clears internal time state fields (`timeleft`, `end_time`, etc.). Safe to call if timer is not active.

### `PauseTimer(name, blocklongupdate)`
* **Description:** Pauses the timer by canceling its task and preserving `timeleft`. Updates `blocklongupdate` flag if provided.
* **Parameters:**
  * `name` (string): Timer name.
  * `blocklongupdate` (boolean or nil): Optional flag to prevent long updates from affecting this timer.

### `ResumeTimer(name)`
* **Description:** Resumes a paused timer by re-scheduling its task with remaining time.
* **Parameters:**
  * `name` (string): Timer name.
* **Returns:** `true` if resuming succeeded; `nil` otherwise.

### `GetTimeLeft(name)`
* **Description:** Returns current remaining time in seconds. For non-paused timers, recalculates based on `end_time - GetTime()` before returning.
* **Parameters:**
  * `name` (string): Timer name.
* **Returns:** Number (remaining time) or `nil`.

### `SetTimeLeft(name, time)`
* **Description:** Sets the remaining time of an active timer. Pauses and resumes if currently running to maintain accuracy.
* **Parameters:**
  * `name` (string): Timer name.
  * `time` (number): New time remaining in seconds (clamped to ≥ 0).

### `SetMaxTime(name, time)`
* **Description:** Rescales a timer's maximum time while preserving the proportional remaining time.
* **Parameters:**
  * `name` (string): Timer name.
  * `time` (number): New maximum time in seconds (clamped to ≥ 0).

### `GetTimeElapsed(name)`
* **Description:** Computes the time elapsed since the timer started, using `initial_time - timeleft`.
* **Parameters:**
  * `name` (string): Timer name.
* **Returns:** Number or `nil` if timer not active.

### `LongUpdate(dt)`
* **Description:** Advances all non-paused, non-blocked timers by `dt`. Used by world/simulation loop to handle real-time ticking for timers.

### `OnSave()`
* **Description:** Returns a save-compatible table containing normalized timer states (`timeleft/maxtime`) for active timers. Returns `nil` if no timers need saving.
* **Returns:** `{ timers = { [name] = { timeleft, paused, blocklongupdate, initial_time } } }` or `nil`.

### `OnLoad(data)`
* **Description:** Loads saved timer states. If the timer is already registered via `AddTimer`, it starts immediately. Otherwise, stores for deferred use.
* **Parameters:**
  * `data` (table): Save data object containing `timers`.

### `GetDebugString()`
* **Description:** Returns a formatted multi-line string for debugging timer states (enabled, maxtime, timeleft, paused, etc.).

## Events & Listeners
* Listens for `timerdone` indirectly via internal callback `OnTimerDone`.
* Triggers:
  * `timerdone` event with payload `{ name = name }` if no callback is set when timer completes.

---