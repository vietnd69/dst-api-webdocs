---
id: yotc_racecompetitor
title: Yotc Racecompetitor
description: Manages race participation logic for entities competing in YOTC-style races, including checkpoint navigation, stamina management, and race completion or abort handling.
tags: [race, ai, navigation, stamina]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 95d88cb2
system_scope: entity
---
# Yotc Racecompetitor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Yotc_RaceCompetitor` enables an entity to participate in a race by navigating a sequence of checkpoints, managing stamina, and communicating race progress. It interacts with `yotc_raceprizemanager` to register checkpoints, report finish times, and remove racers. The component handles dynamic pathfinding via proximity checks to valid `yotc_racecheckpoint` entities and supports features such as forgetfulness (randomly revisiting old checkpoints) and delayed starts.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("yotc_racecompetitor")

-- Set race callbacks
inst.components.yotc_racecompetitor:SetRaceBegunFn(function(racer) print("Race started!") end)
inst.components.yotc_racecompetitor:SetRaceFinishedFn(function(racer) print("Race finished!") end)
inst.components.yotc_racecompetitor:SetRaceOverFn(function(racer) print("Race over!") end)

-- Define the starting checkpoint
local start_cp = SpawnPrefab("yotc_racecheckpoint")
start_cp:AddTag("yotc_racefinishline")
inst.components.yotc_racecompetitor:SetRaceStartPoint(start_cp)

-- Initiate race with optional delay
inst.components.yotc_racecompetitor:StartRace(0.25)
```

## Dependencies & tags
**Components used:** `yotc_raceprizemanager` (global `TheWorld.components`), `unwrappable` (via `pouch.components.unwrappable`)
**Tags:** Adds/removes `has_prize`, `has_no_prize`; checks for `yotc_racecheckpoint`, `yotc_racefinishline`, `fire`, `burnt`, `moving`, `sleeping`, `exhausted`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | The entity this component is attached to. |
| `racestate` | string | `"prerace"` | Current race state: `"prerace"`, `"racing"`, `"postrace"`, `"raceover"`. |
| `checkpoints` | table | `{}` | Map of visited checkpoints to visit counts. |
| `race_distance` | number | `0` | Total accumulated distance between consecutive checkpoints. |
| `checkpoint_timer` | number | `GetTime()` at last checkpoint change | Timestamp for timeout validation. |
| `forgetfulness` | number | `0` | Counter used to compute random revisit probability. |
| `stamina_max` | number | `8` | Base maximum stamina. |
| `stamina_max_var` | number | `2` | Random variance added to max stamina on recovery. |
| `stamina` | number | `stamina_max` | Current stamina (depletes while moving). |
| `exhausted_time` | number | `2` | Base time (in seconds) before stamina recovery begins. |
| `exhausted_time_var` | number | `1` | Random variance added to `exhausted_time`. |
| `race_start_point` | `Entity?` | `nil` | Optional reference to the race start checkpoint entity. |
| `race_begun_fn` | `function?` | `nil` | Callback when race starts. |
| `race_finished_fn` | `function?` | `nil` | Callback when race finishes successfully. |
| `race_over_fn` | `function?` | `nil` | Callback when race ends (finish, abort, or timeout). |
| `next_checkpoint` | `Entity?` | `nil` | Current target checkpoint entity. |
| `prev_checkpoint` | `Entity?` | `nil` | Previous checkpoint entity (used for routing). |
| `race_prize` | table? | `nil` | Table of item prefabs awarded on finish. |
| `latestartertask` | `ActiveTask?` | `nil` | Delayed task used for late-start simulation. |
| `recover_stamina_task` | `ActiveTask?` | `nil` | Task scheduled for stamina recovery. |
| `queuedstarttask` | `ActiveTask?` | `nil` | Delayed task to initiate race start. |

## Main functions
### `OnRemoveEntity()`
* **Description:** Called when the entity is removed from the world; notifies `yotc_raceprizemanager` to remove this racer.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Clean-up called when component is removed from the entity. Cancels pending tasks, clears checkpoint, removes tags, and invokes finish/over callbacks if not already called.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntitySleep()`
* **Description:** Aborts the race by removing the component if the entity enters sleep mode during an active race.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetRaceDistance()`
* **Description:** Returns the total accumulated race distance in world units.
* **Parameters:** None.
* **Returns:** `number` — total race distance.

### `SetRaceBegunFn(race_begun_fn)`
* **Description:** Registers a callback invoked once when the race begins (after initial delay if present).
* **Parameters:** `race_begun_fn` (function) — function taking `(racer)` as argument.
* **Returns:** Nothing.

### `SetRaceFinishedFn(race_finished_fn)`
* **Description:** Registers a callback invoked once when the race finishes (i.e., `FinishRace` is called).
* **Parameters:** `race_finished_fn` (function) — function taking `(racer)` as argument.
* **Returns:** Nothing.

### `SetRaceOverFn(race_over_fn)`
* **Description:** Registers a callback invoked once when the race ends (finish, abort, or timeout), but only if not previously invoked.
* **Parameters:** `race_over_fn` (function) — function taking `(racer)` as argument.
* **Returns:** Nothing.

### `_SetCheckPoint(checkpoint, is_starting_line)`
* **Description:** Updates the `next_checkpoint`, removes event callbacks from the old checkpoint, and adds new callbacks if a new checkpoint is provided.
* **Parameters:**  
  - `checkpoint` (`Entity?`) — target checkpoint entity or `nil`.  
  - `is_starting_line` (`boolean?`) — if `true`, listens for `"yotc_racebegun"` on the checkpoint to trigger `StartRace`.
* **Returns:** Nothing.

### `StartRace(delay)`
* **Description:** Begins the race: resets race state, initializes `race_distance`, schedules a delayed start if `delay > 0`, or starts immediately if `delay <= 0` and `next_checkpoint` is valid.
* **Parameters:** `delay` (`number?`) — optional delay before starting.
* **Returns:** Nothing.
* **Error states:** No effect if `next_checkpoint` is `nil`.

### `FinishRace()`
* **Description:** Stops updating, sets `racestate` to `"postrace"`, cancels pending start task, invokes `race_finished_fn` once, and clears references.
* **Parameters:** None.
* **Returns:** Nothing.

### `AbortRace(prize_table)`
* **Description:** Terminates the race prematurely. Calls `FinishRace`, `OnAllRacersFinished`, and removes the racer from `yotc_raceprizemanager`.
* **Parameters:** `prize_table` (`table?`) — optional prize items (not applied; only used to clear racer).
* **Returns:** Nothing.

### `OnAllRacersFinished(prize_table)`
* **Description:** Finalizes race state: sets `"raceover"`, clears checkpoint, assigns `"has_prize"` or `"has_no_prize"` tag, and invokes `race_over_fn`.
* **Parameters:** `prize_table` (`table?`) — if non-nil, sets `race_prize`, otherwise clears it and adds `"has_no_prize"` tag.
* **Returns:** Nothing.

### `SetRaceStartPoint(start_point_entity)`
* **Description:** Sets and registers the race start checkpoint; marks it with `"yotc_racefinishline"` flag to support race loop logic.
* **Parameters:** `start_point_entity` (`Entity`) — the start/finish checkpoint.
* **Returns:** Nothing.

### `_FindNextCheckPoint()`
* **Description:** Determines the next checkpoint using proximity search and visited-count prioritization; supports forgetfulness logic that may revert to `prev_checkpoint`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Sets `next_checkpoint` to `nil` if no suitable checkpoint is found, leading to `AbortRace`.

### `OnUpdate(dt)`
* **Description:** Main update loop during `"racing"` state. Handles timeout, checkpoint proximity, stamina depletion, and exhaustion logic. Triggers finish if checkpoint is `yotc_racefinishline`.
* **Parameters:** `dt` (`number`) — time delta since last frame.
* **Returns:** Nothing.

### `SetLateStarter(start_delay)`
* **Description:** Schedules a task to clear `latestartertask`, simulating a delayed race start (e.g., for cinematic or gameplay pacing).
* **Parameters:** `start_delay` (`number`) — delay before task completes.
* **Returns:** Nothing.

### `IsStartingLate()`
* **Description:** Indicates whether a delayed start task is pending.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if a late-start task is active.

### `IsExhausted()`
* **Description:** Indicates whether the racer is currently in a stamina recovery phase.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if recovery task is scheduled.

### `RecoverStamina()`
* **Description:** Restores stamina to a randomized maximum value and cancels any pending recovery task.
* **Parameters:** None.
* **Returns:** Nothing.

### `CollectPrize()`
* **Description:** Spawns a `"redpouch_yotc"` at the racer's location, wraps the prize items using `unwrappable`, and removes `"has_prize"` tag. If no prize is assigned, returns `nil`.
* **Parameters:** None.
* **Returns:** `Entity?` — the spawned pouch if prize exists, otherwise `nil`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string containing current checkpoint, race state, forgetfulness, stamina, and race distance.
* **Parameters:** None.
* **Returns:** `string` — human-readable status line.

## Events & listeners
- **Listens to:**  
  - `"onremove"` on `next_checkpoint` — via `onnextcheckpointremove`, clears checkpoint reference.  
  - `"burntup"` on `next_checkpoint` — via `onnextcheckpointremove`.  
  - `"yotc_racebegun"` on `next_checkpoint` (if `is_starting_line`) — triggers `StartRace`.  
  - `"yotc_racer_at_checkpoint"` (internal use, not registered by this component).  
  - `"yotc_racer_exhausted"` (internal use, not registered by this component).
- **Pushes:**  
  - `"carrat_error_direction"` — when forgetting and reverting to `prev_checkpoint`.  
  - `"yotc_racer_exhausted"` — when stamina reaches zero.  
  - `"wrappeditem"` — on `prize_items` during prize collection (via `unwrappable`).

