---
id: worldsettingstimer
title: Worldsettingstimer
description: Manages named, resumable, and persistent timers for world-scale settings or events.
tags: [timer, persistence, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 454412f0
system_scope: world
---

# Worldsettingstimer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Worldsettingstimer` is a component that manages multiple named timers with support for enabling/disabling, pausing/resuming, persistence, and external long-update integration. It is designed for world- or level-scale timed events where timers may need to survive save/load cycles and be adjusted dynamically during gameplay. The component stores timer metadata in `self.timers`, handles running timers via `DoTaskInTime`, and provides utilities for saving (`OnSave`) and loading (`OnLoad`) timer state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("worldsettingstimer")

inst.components.worldsettingstimer:AddTimer("season_change", 3600, true, function(entity)
    print("Season change timer elapsed!")
end)

inst.components.worldsettingstimer:StartTimer("season_change", 3600)
inst.components.worldsettingstimer:PauseTimer("season_change")
inst.components.worldsettingstimer:ResumeTimer("season_change")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `timers` | table | `{}` | Stores timer metadata by name (e.g., `maxtime`, `enabled`, `timeleft`, `paused`, etc.). |
| `saved_timers` | table | `{}` | Holds timer data not yet ready to be started (e.g., from a load that was deferred until `AddTimer` is called). |

## Main functions
### `AddTimer(name, maxtime, enabled, callback, externallongupdate)`
* **Description:** Registers a new timer with the given name. If a matching saved timer exists in `saved_timers`, it is started immediately.  
* **Parameters:**
  * `name` (string or any hashable key) – Unique identifier for the timer.
  * `maxtime` (number) – Maximum duration in seconds; used for normalization during save/load and scaling.
  * `enabled` (boolean) – Whether the timer is active (controls if `ResumeTimer` actually runs it).
  * `callback` (function or nil) – Function called with `(inst)` when the timer completes. If `nil`, the component pushes a `"timerdone"` event instead.
  * `externallongupdate` (boolean or nil) – If true, `LongUpdate` will *not* decrement this timer (caller must manage updates externally).
* **Returns:** Nothing.
* **Error states:** Prints an error and returns early if `name` or `maxtime` are missing or if the timer name already exists.

### `StartTimer(name, time, paused, initialtime_override, blocklongupdate)`
* **Description:** Starts a registered timer by scheduling its completion callback and setting its internal state.  
* **Parameters:**
  * `name` (string) – The timer name to start.
  * `time` (number) – Initial time value (in seconds) to set for `timeleft`.
  * `paused` (boolean or nil) – Initial paused state.
  * `initialtime_override` (number or nil) – Overrides `time` for `initial_time`, used for elapsed calculations.
  * `blocklongupdate` (boolean or nil) – If true, prevents `LongUpdate` from modifying this timer.
* **Returns:** Nothing.
* **Error states:** Returns early with a printed warning if the timer doesn’t exist or is already active.

### `StopTimer(name)`
* **Description:** Immediately halts a running or paused timer, resetting its runtime state without removing registration.  
* **Parameters:** `name` (string) – Timer name.
* **Returns:** Nothing.
* **Error states:** No-op if no active timer exists.

### `PauseTimer(name, blocklongupdate)`
* **Description:** Pauses a running timer, canceling its scheduled callback and updating `timeleft`.  
* **Parameters:**
  * `name` (string) – Timer name to pause.
  * `blocklongupdate` (boolean or nil) – Whether `LongUpdate` should skip this timer while paused.
* **Returns:** Nothing.
* **Error states:** No-op if timer is not active.

### `ResumeTimer(name)`
* **Description:** Resumes a paused timer if it is enabled and active.  
* **Parameters:** `name` (string) – Timer name.
* **Returns:** `true` on success, `nil` otherwise.
* **Error states:** Returns `nil` if the timer is not paused or not active.

### `GetTimeLeft(name)`
* **Description:** Returns the remaining time (in seconds). Updates `timeleft` dynamically if not paused.  
* **Parameters:** `name` (string) – Timer name.
* **Returns:** `number?` – Remaining time, or `nil` if no active timer exists.

### `SetTimeLeft(name, time)`
* **Description:** Updates the remaining time for an active, enabled timer. Respects pausing.  
* **Parameters:**
  * `name` (string) – Timer name.
  * `time` (number) – New remaining time (clamped to `>= 0`).
* **Returns:** Nothing.

### `SetMaxTime(name, time)`
* **Description:** Updates `maxtime` and scales `timeleft` proportionally to preserve relative progress.  
* **Parameters:**
  * `name` (string) – Timer name.
  * `time` (number) – New maximum duration (clamped to `>= 0`).
* **Returns:** Nothing.

### `GetTimeElapsed(name)`
* **Description:** Returns how much time has passed since the timer started (based on `initial_time`).  
* **Parameters:** `name` (string) – Timer name.
* **Returns:** `number?` – Elapsed time, or `nil` if no active timer.

### `LongUpdate(dt)`
* **Description:** Called during world long-updates (e.g., per 1 game tick for world entities) to decrement all non-blocked, non-paused timers.  
* **Parameters:** `dt` (number) – Delta time in seconds.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Generates a table of active timer states suitable for world serialization. Stores normalized `timeleft` (fraction of `maxtime`).  
* **Parameters:** None.
* **Returns:** `{ timers = { ... } }?` – Nil if no active timers.

### `OnLoad(data)`
* **Description:** Restores timers from serialized data. Instant-starts matching timers or defers loading for timers not yet registered.  
* **Parameters:** `data` (table) – Output from `OnSave()`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging console output, listing all timers and their states.  
* **Parameters:** None.
* **Returns:** `string` – Human-readable debug info.

### `TimerExists(name)`
* **Description:** Returns whether a timer has been registered (even if not active).  
* **Parameters:** `name` (string) – Timer name.
* **Returns:** `boolean`.

### `ActiveTimerExists(name)`
* **Description:** Returns whether a timer is currently active (`timeleft` is set).  
* **Parameters:** `name` (string) – Timer name.
* **Returns:** `boolean`.

### `TimerEnabled(name)`
* **Description:** Returns whether a timer is enabled (does *not* consider pausing).  
* **Parameters:** `name` (string) – Timer name.
* **Returns:** `boolean`.

### `GetMaxTime(name)`
* **Description:** Returns the registered `maxtime` for a timer.  
* **Parameters:** `name` (string) – Timer name.
* **Returns:** `number?` – `maxtime`, or `nil` if not registered.

### `IsPaused(name)`
* **Description:** Returns true if the timer is effectively paused (disabled or explicitly paused).  
* **Parameters:** `name` (string) – Timer name.
* **Returns:** `boolean`.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** `"timerdone"` – fired when a timer completes (only if no callback was provided in `AddTimer`). Data includes `{ name = name }`.
