---
id: timer
title: Timer
description: Manages named, configurable timers with start, pause, resume, stop, and persistence support for entities in the Entity Component System.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: c6626c89
---

# Timer

## Overview
The Timer component provides an entity with the ability to register, run, pause, resume, and persist named timers. Each timer counts down from a specified duration and triggers a `timerdone` event when it expires. It supports saving and loading state for persistence across sessions, and handles timer cleanup when removed from an entity.

## Dependencies & Tags
- **Uses:** `inst:DoTaskInTime()` — deferred task scheduling via the game’s task system.
- **Uses:** `GetTime()` — wall-clock time for computing elapsed and remaining time.
- **Uses:** `inst:PushEvent()` — to notify listeners when a timer completes.
- **Uses:** `inst.components.timer:OnSave()` / `OnLoad()` — for serialization and deserialization.
- **No tags** are added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | Reference to the host entity; set on construction. |
| `timers` | `table` | `{}` | Internal map of timer names to timer state objects. Each entry contains `timer`, `timeleft`, `end_time`, `initial_time`, and `paused`. |

No other public properties are initialized or exposed beyond what appears in the internal timer structure.

## Main Functions

### `StartTimer(name, time, paused, initialtime_override)`
* **Description:** Creates a new timer with the given name and duration (in seconds). If `paused` is true, the timer is paused immediately after creation. Optionally overrides the initial time for accurate elapsed-time tracking.
* **Parameters:**
  - `name` (string): Unique identifier for the timer.
  - `time` (number): Duration in seconds before the timer completes.
  - `paused` (boolean, optional): If `true`, starts the timer in paused state.
  - `initialtime_override` (number, optional): Overrides the stored `initial_time` (defaults to `time`).

### `StopTimer(name)`
* **Description:** Cancels and removes the specified timer. Has no effect if the timer does not exist.
* **Parameters:**
  - `name` (string): Name of the timer to stop.

### `PauseTimer(name)`
* **Description:** Pauses the timer, canceling its scheduled task and preserving remaining time. Has no effect if the timer doesn’t exist or is already paused.
* **Parameters:**
  - `name` (string): Name of the timer to pause.

### `ResumeTimer(name)`
* **Description:** Resumes a previously paused timer using its saved remaining time. Returns `true` on success.
* **Parameters:**
  - `name` (string): Name of the paused timer to resume.

### `GetTimeLeft(name)`
* **Description:** Returns the current remaining time (in seconds) of the timer. For active (non-paused) timers, recalculates remaining time based on current clock time. Returns `nil` if the timer does not exist.
* **Parameters:**
  - `name` (string): Name of the timer.

### `SetTimeLeft(name, time)`
* **Description:** Sets the remaining time of the timer. Automatically pauses and resumes active timers to apply the new duration precisely.
* **Parameters:**
  - `name` (string): Name of the timer.
  - `time` (number): New remaining time in seconds (clamped to non-negative).

### `GetTimeElapsed(name)`
* **Description:** Returns how much time has elapsed since the timer started. Returns `nil` if the timer does not exist.
* **Parameters:**
  - `name` (string): Name of the timer.

### `TimerExists(name)`
* **Description:** Checks whether a timer with the given name is currently registered.
* **Parameters:**
  - `name` (string): Timer name to check.
* **Returns:** `boolean` — `true` if the timer exists, `false` otherwise.

### `IsPaused(name)`
* **Description:** Checks if the timer is currently paused.
* **Parameters:**
  - `name` (string): Timer name.
* **Returns:** `boolean` — `true` if paused and timer exists.

### `GetDebugString()`
* **Description:** Returns a formatted string listing all active timers and their current state (time left, paused status). Used for debugging and diagnostics.
* **Returns:** `string` — Multi-line string with timer details.

### `OnSave()`
* **Description:** Serializes the current state of all timers for saving to disk.
* **Returns:** `table?` — A table with `{ timers = { [name] = { timeleft, paused, initial_time } } }` or `nil` if no timers exist.

### `OnLoad(data)`
* **Description:** Restores timer state from saved data. Existing timers with the same name are stopped first.
* **Parameters:**
  - `data` (table): Saved timer data from `OnSave()`.

### `LongUpdate(dt)`
* **Description:** Internal method used by the game’s world update loop to decrement active timers in steps (e.g., when running in real-time or lag-scaled modes).
* **Parameters:**
  - `dt` (number): Delta time (in seconds) to subtract from each timer.

### `TransferComponent(newinst)`
* **Description:** Moves all timers from this component to another entity’s Timer component (e.g., when an entity is respawned or teleported).
* **Parameters:**
  - `newinst` (Entity): Target entity with a `timer` component.

## Events & Listeners
- **Listens to:** None.
- **Triggers:**
  - `timerdone` — fires when a timer expires; payload is `{ name = name }`.

---