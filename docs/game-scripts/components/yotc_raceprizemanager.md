---
id: yotc_raceprizemanager
title: Yotc Raceprizemanager
description: Manages race event lifecycle and award distribution for the Yotc mod's race system.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: b8e0a030
---

# Yotc Raceprizemanager

## Overview
This component manages race registration, execution, and prize distribution within the Yotc mod for Don't Starve Together. It maintains active races per track, tracks racer participation and completion, awards in-game items (gold nuggets) upon race completion, and synchronizes prize availability with game world cycles.

## Dependencies & Tags
- **World State Watched**: `"cycles"`
- **Events Listened To**: Internal `yotc_ratraceprizechange` event handling
- **Tags/Components Used**:
  - `yotc_racecompetitor` (racer)
  - `entitytracker` (racer)
- **No tags are added or removed** by this component.
- **No direct `inst:AddComponent(...)` calls** are made.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance the component is attached to (the manager itself). |
| `_races` | `table` | `{}` | Dictionary mapping `start_line` entity IDs to active race data records. |
| `_prize` | `number` | `-1` | The world cycle count after which the next race prize becomes available. Initialized to `-1` (prize available immediately). |
| `_themetask` | `DoTaskInTime` or `nil` | `nil` | Periodic task used to maintain race music theme during active races. |

## Main Functions

### `GivePrizes(race)`
* **Description:** Awards race prizes to participants based on race results and distance achieved. Determines the first-place prize and consolation prize using tunable multipliers and distance bonuses. If prizes are awarded, updates `_prize` to the current world cycle.
* **Parameters:**
  * `race` (table): Race data record containing `results`, `racers`, and `num_racers`.

### `HasPrizeAvailable()`
* **Description:** Checks whether a race prize is currently available (i.e., enough cycles have passed since the last prize was awarded).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `_prize < current_cycle`.

### `RegisterRacer(new_racer, start_line)`
* **Description:** Registers a racer for a race at the given track (`start_line`). Validates eligibility (trainer presence or ghost racer), avoids duplicates, and enforces one trainer per lane. Detects if an existing racer from the same trainer should be replaced.
* **Parameters:**
  * `new_racer` (`Entity`): The racer entity attempting to join.
  * `start_line` (`Entity`): The track entity representing the race start.
* **Returns:** 
  * `true`, `old_racer` (`Entity` or `nil`) if successfully registered or replaced.
  * `false`, `nil` if invalid or already registered.

### `BeginRace(start_line)`
* **Description:** Marks a registered race as started and initializes music theme updates if not already active.
* **Parameters:**
  * `start_line` (`Entity`): The race start entity (also used as race ID).

### `GetRaceIdByRacer(racer)`
* **Description:** Returns the `start_line` (race ID) for a given racer, or `nil` if not in a race.
* **Parameters:**
  * `racer` (`Entity`): The racer entity.

### `GetRaceByRacer(racer)`
* **Description:** Returns the full race data record for a given racer, or `nil`.
* **Parameters:**
  * `racer` (`Entity`): The racer entity.

### `GetRaceById(start_line)`
* **Description:** Returns the race data record for a given race ID (track), or `nil`.
* **Parameters:**
  * `start_line` (`Entity`): The race start entity.

### `IsRaceUnderway(start_line)`
* **Description:** Returns whether a race at the given track has been started.
* **Parameters:**
  * `start_line` (`Entity`): The race start entity.
* **Returns:** `boolean`.

### `EndOfRace(race_id)`
* **Description:** Cleans up a finished race: resets music states, signals all checkpoints, and removes the race record.
* **Parameters:**
  * `race_id` (`Entity`): The race start entity (used as ID).

### `RemoveRacer(racer)`
* **Description:** Removes a racer from its current race. Handles race cancellation if no racers remain or award distribution if all remaining racers finish.
* **Parameters:**
  * `racer` (`Entity`): The racer to remove.

### `RegisterCheckpoint(racer, checkpoint)`
* **Description:** Registers a checkpoint entity as part of a racer’s race track.
* **Parameters:**
  * `racer` (`Entity`): The racer using the checkpoint.
  * `checkpoint` (`Entity`): The checkpoint entity.

### `RacerFinishedRace(racer, distance)`
* **Description:** Records a racer’s finish time/distance. Sets first-place status for the race if this is the first finisher. Triggers prize award and cleanup if all racers have finished.
* **Parameters:**
  * `racer` (`Entity`): The finishing racer.
  * `distance` (`number`): Distance traveled in the race.
* **Returns:** `boolean` — `true` if the racer finished first.

### `IsFirstPlaceRacer(racer)`
* **Description:** Checks if the racer is the current first-place finisher (i.e., first to finish *so far* in this race).
* **Parameters:**
  * `racer` (`Entity`): The racer entity.
* **Returns:** `boolean` — `true` only if the racer is set as `results.first_place` *and* no other racer has finished yet.

### `OnSave()`
* **Description:** Serializes the prize state (`_prize`) for world save.
* **Returns:** `table` — `{ prize_date = _prize }`.

### `LoadPostPass(ents, data)`
* **Description:** Restores `_prize` from save data. Handles backward compatibility for old `prize` (0/1) values. Fires `yotc_ratraceprizechange` to notify listeners of restored prize state.
* **Parameters:**
  * `ents` (`table`): Entity map (unused).
  * `data` (`table` or `nil`): Saved component data.

### `GetDebugString()`
* **Description:** Returns a debug string representation of the prize state.
* **Returns:** `string` — e.g., `"prize:5"`.

### `racethemecheck()`
* **Description:** Applies the race music theme (`CARRAT_MUSIC_STATES.RACE`) to all racers currently in active races. Cancels the theme task if no races remain.
* **Parameters:** None.

## Events & Listeners
- **Listens For**:
  - `"cycles"` World state change → triggers internal `updateprize`
- **Triggers/Pushes**:
  - `"yotc_racebegun"` on `start_line` when `BeginRace` is called.
  - `"yotc_race_over"` on each checkpoint when `EndOfRace` is called.
  - `"yotc_ratraceprizechange"` on prize availability update (both `GivePrizes` and `LoadPostPass`).