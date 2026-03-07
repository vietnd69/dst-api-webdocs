---
id: timer
title: Timer
description: Manages named timers attached to an entity, supporting start, stop, pause, resume, and save/load operations.
tags: [timer, save, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c6626c89
system_scope: entity
---

# Timer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Timer` component provides a flexible system for scheduling and managing multiple named timers on an entity. Each timer can be started with a specific duration, paused and resumed independently, and queried for remaining or elapsed time. It supports serialization via `OnSave()`/`OnLoad()` for persistence across game sessions and can transfer timer states to a new entity via `TransferComponent()`. This component is typically used for effects with timed durations, cooldowns, or scheduled events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("timer")

inst.components.timer:StartTimer("fire_resist", 15)       -- 15-second timer
inst.components.timer:StartTimer("freeze", 5, true)       -- Start paused
inst.components.timer:ResumeTimer("freeze")
inst:ListenForEvent("timerdone", function(data)
    if data.name == "fire_resist" then
        print("Fire resistance ended!")
    end
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `timers` | table | `{}` | Internal registry mapping timer names to timer state data (read-only externally). |

## Main functions
### `StartTimer(name, time, paused, initialtime_override)`
*   **Description:** Creates and starts a new timer with the given name and duration. If `paused` is `true`, the timer is paused immediately after starting. `initialtime_override` allows preserving the original duration for elapsed calculations.
*   **Parameters:**  
    `name` (string) – Unique identifier for the timer.  
    `time` (number) – Duration of the timer in seconds.  
    `paused` (boolean, optional) – Whether to start the timer in a paused state. Default: `false`.  
    `initialtime_override` (number, optional) – Overrides the initial time stored for elapsed calculations. Default: `time`.
*   **Returns:** Nothing.
*   **Error states:** If a timer with the same `name` already exists, prints a warning and returns without modification.

### `StopTimer(name)`
*   **Description:** Immediately cancels and removes the named timer.
*   **Parameters:**  
    `name` (string) – Name of the timer to stop.
*   **Returns:** Nothing.
*   **Error states:** No effect if the timer does not exist.

### `PauseTimer(name)`
*   **Description:** Pauses the named timer, canceling its scheduled callback and preserving its remaining time.
*   **Parameters:**  
    `name` (string) – Name of the timer to pause.
*   **Returns:** Nothing.
*   **Error states:** No effect if the timer does not exist or is already paused.

### `ResumeTimer(name)`
*   **Description:** Resumes a paused timer by rescheduling the callback based on the current remaining time.
*   **Parameters:**  
    `name` (string) – Name of the timer to resume.
*   **Returns:** `true` on success; no return if the timer does not exist or is not paused.
*   **Error states:** No effect if the timer is not paused.

### `GetTimeLeft(name)`
*   **Description:** Returns the remaining time (in seconds) for the named timer. For non-paused timers, recalculates remaining time based on current game time.
*   **Parameters:**  
    `name` (string) – Name of the timer.
*   **Returns:** `number` (remaining seconds) or `nil` if the timer does not exist.

### `SetTimeLeft(name, time)`
*   **Description:** Directly sets the remaining time for the named timer. If the timer is running, it is paused first, updated, then resumed.
*   **Parameters:**  
    `name` (string) – Name of the timer.  
    `time` (number) – New remaining time in seconds (clamped to `>= 0`).
*   **Returns:** Nothing.
*   **Error states:** No effect if the timer does not exist.

### `GetTimeElapsed(name)`
*   **Description:** Returns how much time has elapsed since the timer started.
*   **Parameters:**  
    `name` (string) – Name of the timer.
*   **Returns:** `number` (elapsed seconds) or `nil` if the timer does not exist.

### `IsPaused(name)`
*   **Description:** Checks whether the named timer is currently paused.
*   **Parameters:**  
    `name` (string) – Name of the timer.
*   **Returns:** `true` if paused, `false` otherwise (or `nil` if timer does not exist).

### `TimerExists(name)`
*   **Description:** Checks whether a timer with the given name exists.
*   **Parameters:**  
    `name` (string) – Name of the timer.
*   **Returns:** `true` if the timer exists, `false` otherwise.

### `GetDebugString()`
*   **Description:** Returns a formatted string listing all active timers and their states for debugging.
*   **Parameters:** None.
*   **Returns:** `string` – Multi-line debug output.

### `OnSave()`
*   **Description:** Serializes active timers into a data table for saving.
*   **Parameters:** None.
*   **Returns:** `{ timers = { [name] = { timeleft, paused, initial_time }, ... } }` or `nil` if no timers exist.

### `OnLoad(data)`
*   **Description:** Restores timers from saved data. existing timers with the same name are stopped before restoring.
*   **Parameters:**  
    `data` (table) – Saved timer data as returned by `OnSave()`.
*   **Returns:** Nothing.

### `LongUpdate(dt)`
*   **Description:** Updates all timers by decrementing their remaining time by `dt`. Used in contexts where precise per-frame timer management is needed (e.g., save/restore precision).
*   **Parameters:**  
    `dt` (number) – Time delta in seconds.
*   **Returns:** Nothing.

### `TransferComponent(newinst)`
*   **Description:** Transfers all active timers to the `timer` component of another entity.
*   **Parameters:**  
    `newinst` (entity) – Target entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** `timerdone` – Fired when a timer completes; data payload is `{ name = "timer_name" }`.

### OnRemoveFromEntity
- **Description:** Automatically called when the component is removed from its entity. Cancels all active timers and clears the internal registry.
- **Parameters:** None  
- **Returns:** Nothing
