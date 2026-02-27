---
id: yotc_racecompetitor
title: Yotc Racecompetitor
description: Manages race participation logic for entities, including checkpoint navigation, stamina tracking, race state transitions, and prize awarding.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 95d88cb2
---

# Yotc Racecompetitor

## Overview
This component enables an entity to participate in a structured race by tracking race state (prerace, racing, postrace, raceover), navigating between checkpoints, managing stamina-based movement limitations, and handling prize distribution upon race completion. It dynamically finds the next valid checkpoint, records path statistics, and coordinates with `yotc_raceprizemanager` for registration and prize assignment.

## Dependencies & Tags
**Dependencies:**
- Uses the `yotc_raceprizemanager` world component for racer registration and prize coordination.
- Requires tag-based identification of checkpoints: must have tag `"yotc_racecheckpoint"` and must not have `"fire"` or `"burnt"` tags.

**Tags Added/Removed:**
- Adds `"has_prize"` when a prize is awarded (`OnAllRacersFinished` with non-nil prize_table).
- Adds `"has_no_prize"` when no prize is awarded (`OnAllRacersFinished` with nil prize_table).
- Removes both `"has_prize"` and `"has_no_prize"` during cleanup (e.g., `OnRemoveFromEntity`, `CollectPrize`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | The entity instance the component is attached to. |
| `racestate` | `string` | `"prerace"` | Current race state: `"prerace"`, `"racing"`, `"postrace"`, or `"raceover"`. |
| `checkpoints` | `table` | `{}` | Map of visited checkpoints to visit counts. |
| `race_distance` | `number` | `0` | Accumulated Euclidean distance between consecutive checkpoints. |
| `next_checkpoint` | `Entity?` | `nil` | The next expected checkpoint entity (or `nil` if race not started or failed). |
| `prev_checkpoint` | `Entity?` | `nil` | Previously visited checkpoint (used for path tracking and forgetfulness logic). |
| `checkpoint_timer` | `number` | `GetTime()` at `_SetCheckPoint` | Timestamp when `next_checkpoint` was assigned; used for timeout. |
| `forgetfulness` | `number` | `0` | Counter tracking successful checkpoint passes; used in forgetfulness probability calculation. |
| `stamina_max` | `number` | `8` | Base maximum stamina value. |
| `stamina_max_var` | `number` | `2` | Random variance added to stamina on recovery. |
| `stamina` | `number` | `stamina_max` | Current stamina; decrements while moving, triggers exhaustion at `<= 0`. |
| `exhausted_time` | `number` | `2` | Base duration before stamina recovers after exhaustion. |
| `exhausted_time_var` | `number` | `1` | Random variance added to recovery delay. |
| `race_start_point` | `Entity?` | `nil` | The starting checkpoint entity (used for finish-line detection and recovery logic). |
| `race_begun_fn` | `function?` | `nil` | Callback invoked when race begins (first checkpoint passed). |
| `race_finished_fn` | `function?` | `nil` | Callback invoked when the race finish line is reached. |
| `race_over_fn` | `function?` | `nil` | Callback invoked when the race is finalized (`racestate` = `"raceover"`). |
| `race_prize` | `table?` | `nil` | Array of prefab names constituting the prize (set by `yotc_raceprizemanager`). |
| `queuedstarttask` | `DoTaskInTime?` | `nil` | Delayed task used to defer race start (for `delay > 0` in `StartRace`). |
| `recover_stamina_task` | `DoTaskInTime?` | `nil` | Delayed task to recover stamina after exhaustion. |
| `latestartertask` | `DoTaskInTime?` | `nil` | Delayed task indicating the racer is starting late. |
| `isforgetful` | `boolean?` | *(not set in constructor)* | Controls whether forgetfulness logic is active; must be set externally if used. |

## Main Functions

### `:OnRemoveEntity()`
* **Description:** Cleans up when the entity is removed from the world; deregisters the racer from `yotc_raceprizemanager` if present.
* **Parameters:** None.

### `:OnRemoveFromEntity()`
* **Description:** Cleans up race-related state and callbacks when the component is removed; cancels pending tasks, resets tags, clears checkpoint reference, and invokes final callbacks.
* **Parameters:** None.

### `:OnEntitySleep()`
* **Description:** Immediately removes the component if the entity sleeps during active racing phases, preventing invalid progress tracking.
* **Parameters:** None.

### `:SetRaceBegunFn(race_begun_fn)`
* **Description:** Sets the callback function executed once the race officially begins (after passing the first checkpoint).
* **Parameters:**
  - `race_begun_fn (function)` – Function signature: `function(racer: Entity)`.

### `:SetRaceFinishedFn(race_finished_fn)`
* **Description:** Sets the callback function executed upon reaching the finish line (`yotc_racefinishline` checkpoint).
* **Parameters:**
  - `race_finished_fn (function)` – Function signature: `function(racer: Entity)`.

### `:SetRaceOverFn(race_over_fn)`
* **Description:** Sets the callback function executed when the race is finalized (`racestate` = `"raceover"`).
* **Parameters:**
  - `race_over_fn (function)` – Function signature: `function(racer: Entity)`.

### `:_SetCheckPoint(checkpoint, is_starting_line)`
* **Description:** Assigns a new checkpoint as the immediate target; manages event listeners on the checkpoint entity and resets timer.
* **Parameters:**
  - `checkpoint (Entity?)` – The target checkpoint entity or `nil`.
  - `is_starting_line (boolean)` – If `true`, registers listener for `"yotc_racebegun"` event on the checkpoint.

### `:StartRace(delay)`
* **Description:** Initiates the race after an optional delay; initializes state, resets distance, recovers stamina, begins movement update loop, and triggers the `"yotc_racebegun"` callback.
* **Parameters:**
  - `delay (number?)` – Delay in seconds before starting; if `nil`, starts immediately.

### `:FinishRace()`
* **Description:** Marks the race as finished (reached finish line); stops update loop, invokes `"yotc_racefinished"` callback, and sets `"postrace"` state.
* **Parameters:** None.

### `:AbortRace(prize_table)`
* **Description:** Aborts the race (e.g., due to timeout or failure); calls `FinishRace()` and `OnAllRacersFinished()` with `nil` prize to clear tags.
* **Parameters:**
  - `prize_table (table?)` – Unused in this method; retained for API compatibility.

### `:OnAllRacersFinished(prize_table)`
* **Description:** Finalizes race state after all racers complete or fail; assigns `"has_prize"` or `"has_no_prize"` tags and invokes `"race_over"` callback.
* **Parameters:**
  - `prize_table (table?)` – Array of prize prefab names; if non-nil, award prize.

### `:SetRaceStartPoint(start_point_entity)`
* **Description:** Designates the starting checkpoint (used for distance measurement and finish-line detection).
* **Parameters:**
  - `start_point_entity (Entity)` – The checkpoint entity serving as the race start.

### `:_FindNextCheckPoint()`
* **Description:** Determines the next valid checkpoint using proximity search, visit count limits, and optional forgetfulness logic. Registers checkpoints with the prize manager and updates `race_distance`.
* **Parameters:** None.

### `:OnUpdate(dt)`
* **Description:** Main race loop, called during updates while racing; handles timeout, checkpoint proximity, exhaustion mechanics, and finish-line detection.
* **Parameters:**
  - `dt (number)` – Delta time in seconds.

### `:SetLateStarter(start_delay)`
* **Description:** Registers a delayed start timer; used to indicate the racer begins late.
* **Parameters:**
  - `start_delay (number)` – Delay in seconds before signaling late start completion.

### `:IsStartingLate()`
* **Description:** Returns `true` if the racer has a pending late-start task.
* **Parameters:** None.
* **Returns:** `boolean`.

### `:IsExhausted()`
* **Description:** Returns `true` if the racer is currently recovering from exhaustion.
* **Parameters:** None.
* **Returns:** `boolean`.

### `:RecoverStamina()`
* **Description:** Restores stamina to a random value between `stamina_max` and `stamina_max + stamina_max_var`; cancels pending recovery task.
* **Parameters:** None.

### `:CollectPrize()`
* **Description:** Spawns a wrapped `"redpouch_yotc"` containing the race prize items if prize exists; removes `"has_prize"` tag and returns the pouch.
* **Parameters:** None.
* **Returns:** `Entity?` – The `redpouch_yotc` entity if a prize was awarded; `nil` otherwise.

### `:GetDebugString()`
* **Description:** Returns a formatted string for debugging purposes, showing key state values (checkpoint, state, stamina, distance, etc.).
* **Parameters:** None.
* **Returns:** `string`.

## Events & Listeners
- **Listens for:**
  - `"onremove"` on `next_checkpoint` → calls `onnextcheckpointremove`.
  - `"burntup"` on `next_checkpoint` → calls `onnextcheckpointremove`.
  - `"yotc_racebegun"` on `next_checkpoint` (only if assigned as starting line) → calls `start_race`.
- **Triggers:**
  - `"yotc_racer_at_checkpoint"` on `next_checkpoint` when reached.
  - `"yotc_racer_exhausted"` on `inst` when stamina reaches `0`.
  - `"carrat_error_direction"` on `inst` when forgetfulness causes skipping backward to previous checkpoint.