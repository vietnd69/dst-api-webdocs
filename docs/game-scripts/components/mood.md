---
id: mood
title: Mood
description: Manages timed and seasonal mood states for entities, including transitions triggered by day cycles and season changes.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8100a657
---

# Mood

## Overview
This component implements mood logic for entities, enabling transitions between "in mood" and "not in mood" states based on elapsed day cycles and seasonal triggers. It supports persistent state saving/loading, configurable timing for mood durations, seasonal activation, and custom callback functions for entering/leaving mood states.

## Dependencies & Tags
- Uses `inst:WatchWorldState("cycles", ...)` to listen for day completion events.
- Uses `inst:WatchWorldState("season", ...)` conditionally when mood seasons are configured.
- Does not add or remove entity tags.
- Does not declare other component dependencies explicitly in code (e.g., no `AddComponent` calls).

## Properties

| Property                         | Type      | Default Value                          | Description |
|----------------------------------|-----------|----------------------------------------|-------------|
| `enabled`                        | boolean   | `true`                                 | Whether mood logic is active. |
| `moodtimeindays.length`          | number    | `nil`                                  | Duration (in days) an entity stays *in* mood during an active mood period. |
| `moodtimeindays.wait`            | number    | `nil`                                  | Duration (in days) before next mood period begins after leaving mood. |
| `forcemood`                      | boolean   | `false`                                | If `true`, forces entry into mood on cycle reset instead of toggling. |
| `isinmood`                       | boolean   | `false`                                | Current mood state: `true` if entity is currently in mood. |
| `daystomoodchange`               | number    | `nil`                                  | Countdown (in days) until next mood transition. |
| `onentermood`                    | function  | `nil`                                  | Callback function executed when entering mood. |
| `onleavemood`                    | function  | `nil`                                  | Callback function executed when leaving mood. |
| `moodseasons`                    | table     | `{}`                                   | List of season names during which mood should activate automatically. |
| `firstseasonadded`               | boolean   | `false`                                | Internal flag indicating if the season watch listener has been added. |
| `worldsettingsmultiplier_inmood` | number    | `1`                                    | Multiplier applied to day count while in mood (used in saving/loading). |
| `worldsettingsmultiplier_outmood`| number    | `1`                                    | Multiplier applied to day count while not in mood (used in saving/loading). |
| `worldsettingsenabled`           | boolean   | `true`                                 | Whether world settings (including mood multipliers) are respected. |
| `seasonmood`                     | boolean   | `false` (not initialized in `_ctor`, set dynamically) | Whether the current mood state is season-driven (entire season). |

## Main Functions

### `Enable(enabled)`
* **Description:** Enables or disables mood logic. Disabling also forces the entity out of mood.
* **Parameters:**
  * `enabled` (boolean): Whether to enable mood.

### `SetMoodTimeInDays(length, wait, forcemood, worldsettingsmultiplier_inmood, worldsettingsmultiplier_outmood, worldsettingsenabled)`
* **Description:** Configures the timing and behavior for mood transitions.
* **Parameters:**
  * `length` (number): Days to remain *in* mood.
  * `wait` (number): Days to wait before *next* mood starts.
  * `forcemood` (boolean): If `true`, entry into mood is forced rather than toggled.
  * `worldsettingsmultiplier_inmood` (number, optional): Multiplier for day countdown while in mood.
  * `worldsettingsmultiplier_outmood` (number, optional): Multiplier for day countdown while not in mood.
  * `worldsettingsenabled` (boolean, optional): Whether world settings apply.

### `CheckForMoodChange()`
* **Description:** Checks if `daystomoodchange` has elapsed and triggers a mood transition if so.
* **Parameters:** None.

### `SetMoodSeason(activeseason)`
* **Description:** Adds a season to the list of seasons that automatically trigger mood activation. Registers the season watch listener if this is the first season added.
* **Parameters:**
  * `activeseason` (string): Name of the season (e.g., `"spring"`).

### `ValidateMood()`
* **Description:** Ensures correct mood state based on the *current* season. Typically used at world start to ensure proper behavior during initial season.
* **Parameters:** None.

### `SetIsInMood(inmood, entireseason)`
* **Description:** Directly sets the mood state. Handles time tracking, season flags, and callback execution.
* **Parameters:**
  * `inmood` (boolean): Target mood state.
  * `entireseason` (boolean): If `true`, mood lasts for the full current season.

### `ResetMood()`
* **Description:** Resets mood state to *not in mood* and reinitializes `daystomoodchange` to the `wait` interval (only if season-driven mood was active).
* **Parameters:** None.

### `SetInMoodFn(fn)`
* **Description:** Sets the callback function invoked when the entity enters mood.
* **Parameters:**
  * `fn` (function): Callback function taking `inst` as the argument.

### `SetLeaveMoodFn(fn)`
* **Description:** Sets the callback function invoked when the entity leaves mood.
* **Parameters:**
  * `fn` (function): Callback function taking `inst` as the argument.

### `IsInMood()`
* **Description:** Returns the current mood state.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if entity is in mood.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing mood state.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"inmood:true, days till change:5 SEASONMOOD"`.

### `OnSave()`
* **Description:** Serializes mood state for world save.
* **Parameters:** None.
* **Returns:** `table` — containing `inmood`, `daysleft`, `moodseasons`, and `version`.

### `OnLoad(data)`
* **Description:** Restores mood state from saved data. Handles versioned loading (v1 and v2).
* **Parameters:**
  * `data` (table): Saved mood data from `OnSave()`.

## Events & Listeners
- **Listens for:**
  - `"cycles"` → triggers `OnDayComplete` (handled internally via `WatchWorldState`)
  - `"season"` → triggers `OnSeasonChange` (handled internally via `WatchWorldState` after first season is added)
- **Triggers (via `inst:PushEvent` not present)** — does *not* push any events itself. (Callback functions like `onentermood` and `onleavemood` are invoked directly, but no `PushEvent` calls are used.)