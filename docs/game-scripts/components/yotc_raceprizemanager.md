---
id: yotc_raceprizemanager
title: Yotc Raceprizemanager
description: Manages prize distribution for carrat races, tracking race data and awarding loot based on race completion.
tags: [racing, loot, world, event]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b8e0a030
system_scope: world
---

# Yotc Raceprizemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`yotc_raceprizemanager` is a world-scoped component responsible for managing carrat race progression and distributing race prizes to racers upon completion. It tracks active races per starting line (`start_line`), registers racers and checkpoints, detects race completion, calculates prize amounts (based on distance completed and racers present), and awards loot using the `yotc_racecompetitor` component. It respects world state (`TheWorld.state.cycles`) to prevent prize exhaustion and broadcasts the `"yotc_ratraceprizechange"` event when prize availability changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("yotc_raceprizemanager")

-- Register a racer to a starting line
local success, old_racer = inst.components.yotc_raceprizemanager:RegisterRacer(racer_inst, start_line_entity)

-- Begin the race at the specified starting line
inst.components.yotc_raceprizemanager:BeginRace(start_line_entity)

-- When a racer finishes
inst.components.yotc_raceprizemanager:RacerFinishedRace(racer_inst, distance_value)

-- Query prize availability
if inst.components.yotc_raceprizemanager:HasPrizeAvailable() then
    print("Prizes are available!")
end
```

## Dependencies & tags
**Components used:** `yotc_racecompetitor`, `entitytracker`
**Tags:** Adds `has_prize` or `has_no_prize` via `yotc_racecompetitor` (not directly on `inst`).
**World events listened to:** `"cycles"` (via `WatchWorldState`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this component is attached to. |
| `_races` | table | `{}` | Dictionary mapping `start_line` entities to race data tables. |
| `_prize` | number | `-1` | World cycle count when the last prize was awarded. `-1` means prizes are always available. |

## Main functions
### `HasPrizeAvailable()`
* **Description:** Checks if prizes are available for the current world cycle.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `_prize < TheWorld.state.cycles`, otherwise `false`.

### `RegisterRacer(new_racer, start_line)`
* **Description:** Registers a racer to a specific race (identified by `start_line`). Validates the racer (must have a trainer or be a ghost racer) and avoids duplicates. If a trainer already has a racer in the race, the older racer is replaced.
* **Parameters:** `new_racer` (`Entity`) — The racer entity; `start_line` (`Entity`) — The starting line entity.
* **Returns:** `true, old_racer?` — `true` on success, with `old_racer` if another racer from the same trainer was replaced; `false, nil` if registration failed (e.g., invalid racer).
* **Error states:** Returns `false, nil` if `new_racer` is invalid, missing required components, or already registered.

### `BeginRace(start_line)`
* **Description:** Marks a race as started, fires `"yotc_racebegun"` on the `start_line` entity, and initializes a periodic music state task.
* **Parameters:** `start_line` (`Entity`) — The starting line entity used during `RegisterRacer`.
* **Returns:** Nothing.
* **Error states:** No-op if `start_line` race data does not exist or has no racers.

### `EndOfRace(race_id)`
* **Description:** Cleans up a race after completion: resets racer music state, fires `"yotc_race_over"` on all checkpoints, and removes the race entry from `_races`.
* **Parameters:** `race_id` (`Entity`) — The `start_line` entity acting as the race ID.
* **Returns:** Nothing.

### `RemoveRacer(racer)`
* **Description:** Removes a racer from its assigned race before or during the race. If no racers remain or all racers finished, triggers prize distribution (`GivePrizes`) and cleanup.
* **Parameters:** `racer` (`Entity`) — The racer to remove.
* **Returns:** Nothing.
* **Error states:** No-op if racer is not registered to a race.

### `RegisterCheckpoint(racer, checkpoint)`
* **Description:** Records a checkpoint entity under the racer’s race data.
* **Parameters:** `racer` (`Entity`) — Registered racer; `checkpoint` (`Entity`) — The checkpoint to register.
* **Returns:** Nothing.
* **Error states:** No-op if racer is not registered to a race.

### `RacerFinishedRace(racer, distance)`
* **Description:** Records a racer’s completion of the race. If all racers in the race have finished, triggers prize distribution.
* **Parameters:** `racer` (`Entity`) — The racer that finished; `distance` (`number`) — Distance covered (used for prize calculation).
* **Returns:** `boolean` — `true` if this racer placed first; `false` otherwise.

### `IsFirstPlaceRacer(racer)`
* **Description:** Determines if the racer is the current first-place finisher *before* any racer has finished the race (i.e., `race.results == nil` and the racer was first registered).
* **Parameters:** `racer` (`Entity`) — The racer to check.
* **Returns:** `boolean` — `true` if racer is first place *prior* to any finish; otherwise `false`.
* **Error states:** Returns `false` if `racer` is not in a race or if results are already recorded.

### `OnSave()`
* **Description:** Serializes state (currently only `_prize`) for world save.
* **Parameters:** None.
* **Returns:** `table` — `{ prize_date = _prize }`.

### `LoadPostPass(ents, data)`
* **Description:** Restores state from world save. Handles legacy format (`data.prize == 0 or 1`) and current format (`data.prize_date`).
* **Parameters:** `ents` (`table`) — Unused; `data` (`table?`) — Saved data.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a compact debug representation of the component state.
* **Parameters:** None.
* **Returns:** `string` — `"prize:<value>"`.

## Events & listeners
- **Listens to:** `"cycles"` — Triggers `updateprize` to detect when prizes may become available again.
- **Pushes:** `"yotc_ratraceprizechange"` — Broadcast when prize availability changes (after prizes are awarded or loaded). `"yotc_racebegun"` — Broadcast on the `start_line` entity when a race begins. `"yotc_race_over"` — Broadcast on each checkpoint entity when a race completes.
