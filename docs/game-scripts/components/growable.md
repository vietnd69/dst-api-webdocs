---
id: growable
title: Growable
description: Manages staged growth progress for entities, supporting timed, paused, and sleep-aware growth with stage transitions and save/load persistence.
tags: [growth, stages, save-load, animation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 03f366c3
system_scope: entity
---

# Growable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Growable` manages entity growth through discrete stages over time. It tracks growth progress with timed tasks, supports pausing and resuming (including sleep-aware time handling), and notifies the entity via stage-specific callbacks. The component integrates with DST’s save/load system to persist growth state and supports both screen-space and off-screen growth via `growoffscreen`. It is typically attached to prefabs like trees, crops, or seasonal structures that progress through visual and functional stages.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("growable")

inst.components.growable.stages = {
    { fn = function() inst.AnimState:PlayAnimation("stage1") end },
    { fn = function() inst.AnimState:PlayAnimation("stage2") end },
    { fn = function() inst.AnimState:PlayAnimation("stage3") end },
}

inst.components.growable.stage = 1
inst.components.growable:StartGrowing(20) -- Grow to next stage in 20 seconds
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None added, removed, or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity instance | — | Reference to the entity that owns this component. |
| `stages` | table or `nil` | `nil` | Array of stage data tables, each optionally containing `fn`, `time`, `multiplier`, `pregrowfn`, and `growfn` callbacks. |
| `stage` | number | `1` | Current stage index (1-based). |
| `pausereasons` | table | `{}` | Map of active pause reasons (keyed by string or truthy value). |
| `targettime` | number or `nil` | `nil` | Absolute game time when current growth step should complete. |
| `pausedremaining` | number or `nil` | `nil` | Remaining growth time when paused (in seconds). |
| `task` | DoTaskInTime task or `nil` | `nil` | Active growth timer task. |
| `sleeptime` | number or `nil` | `nil` | Game time when the entity last went to sleep (for catch-up calculations). |
| `usetimemultiplier` | boolean | `false` | Whether the current growth uses stage-specific time multiplier. |
| `growoffscreen` | boolean | `false` *(commented out)* | If true, growth continues while entity is asleep/off-screen. |

## Main functions
### `StartGrowingTask(time)`
* **Description:** Schedules a growth completion callback (`OnGrow`) to run after `time` seconds. Skips scheduling if the entity is asleep and `growoffscreen` is false.
* **Parameters:** `time` (number) — time in seconds until growth completes.
* **Returns:** Nothing.

### `StartGrowing(time)`
* **Description:** Initiates or restarts growth to the next stage. If `time` is omitted, reads duration from `self.stages[self.stage].time` or uses a fallback of 10 seconds. Handles `springgrowth` and stage-specific multipliers. Clears any existing growth task first.
* **Parameters:** `time` (number, optional) — custom growth duration in seconds.
* **Returns:** Nothing.
* **Error states:** Prints a warning and returns early if `self.stages` is empty. Returns early if `self.stage > #self.stages`.

### `StopGrowing()`
* **Description:** Cancels any active growth task and clears `targettime` and `pausedremaining`.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetNextStage()`
* **Description:** Returns the stage index that would follow the current stage, respecting looping behavior if enabled (`loopstages`).
* **Parameters:** None.
* **Returns:** number — next stage index (e.g., `self.stage + 1` or `1` if looping).

### `GetStage()`
* **Description:** Returns the current stage index.
* **Parameters:** None.
* **Returns:** number — current stage index (1-based).

### `GetCurrentStageData()`
* **Description:** Returns the stage data table for the current stage.
* **Parameters:** None.
* **Returns:** table or `nil` — stage data, e.g., `{ fn = ... }`, or `nil` if out of bounds.

### `IsGrowing()`
* **Description:** Checks if growth is actively in progress (i.e., a target time is set).
* **Parameters:** None.
* **Returns:** boolean — `true` if `self.targettime ~= nil`.

### `DoMagicGrowth(doer)`
* **Description:** Invokes a custom magic growth callback if defined (`domagicgrowthfn`), allowing manual stage completion (e.g., via item use). Typical for magical or player-triggered growth.
* **Parameters:** `doer` (entity) — entity performing the action.
* **Returns:** boolean — result of `domagicgrowthfn`, or `false` if not defined.

### `DoGrowth(skipgrownfn)`
* **Description:** Advances growth to the next stage, calls `pregrowfn`, updates `stage`, invokes `growfn`, and optionally schedules next growth. Skips advancement if `growonly` is true.
* **Parameters:** `skipgrownfn` (boolean, optional) — if true, skips calling the stage’s `growfn`.
* **Returns:** boolean — `true` if growth advanced; `false` if already complete or inactive.

### `Pause(reason)`
* **Description:** Pauses growth, preserving remaining time and performing time catch-up if the entity was sleeping. Stores `reason` as a key in `pausereasons`.
* **Parameters:** `reason` (any, optional) — identifier for why growth is paused (e.g., `"hibernation"`).
* **Returns:** Nothing.

### `Resume(reason)`
* **Description:** Removes `reason` from pause tracking. If no active reasons remain, restarts growth using `pausedremaining`.
* **Parameters:** `reason` (any, optional) — pause reason to clear.
* **Returns:** boolean — `true` if growth restarted; `false` if still paused.

### `IsPaused()`
* **Description:** Checks if growth is currently paused.
* **Parameters:** None.
* **Returns:** boolean — `true` if `pausedremaining ~= nil`.

### `ExtendGrowTime(extra_time)`
* **Description:** Increases remaining growth time by `extra_time`, updating either the active task or `pausedremaining`.
* **Parameters:** `extra_time` (number) — seconds to add to growth time.
* **Returns:** Nothing.

### `SetStage(stage)`
* **Description:** Directly sets the current stage, clamps to bounds, and invokes the stage’s `fn` callback. Does not modify growth state.
* **Parameters:** `stage` (number) — target stage index.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes growth state for saving. Includes `stage`, remaining time (scaled by multiplier), sleep duration, and multiplier flag.
* **Parameters:** None.
* **Returns:** table or `nil` — save data, or `nil` if empty.

### `OnLoad(data)`
* **Description:** Restores growth state from save data. Handles stage, time (unscaled by multiplier), and sleep delta.
* **Parameters:** `data` (table) — save data previously returned by `OnSave()`.
* **Returns:** Nothing.

### `LongUpdate(dt)`
* **Description:** Processes elapsed time `dt` for growth, handling catches-up after sleep and advancing stages as needed. Used when waking up or during large time steps.
* **Parameters:** `dt` (number) — elapsed time in seconds.
* **Returns:** Nothing.

### `OnEntitySleep()`
* **Description:** Cancels active growth task and records when sleep began (for later catch-up). Growth resumes from sleep via `OnEntityWake`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityWake()`
* **Description:** Resumes growth after wake-up, replaying elapsed time via `LongUpdate` if necessary.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing growth state (e.g., `"Growing! Stage: 2  |  Timeleft: 4.52s"`).
* **Parameters:** None.
* **Returns:** string — descriptive status string.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** `OnRemoveFromEntity` — assigned to `StopGrowing()` for cleanup on component removal.
