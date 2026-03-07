---
id: gym
title: Gym
description: Manages training interactions with a trainee entity, including training timer management, perishability checks, music state transitions, and phase-based rest behavior.
tags: [training, entity, timer, perishable]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e486cde5
system_scope: entity
---

# Gym

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Gym` component handles training interactions for an entity, such as a Carrat, by managing a training timer, associating a `trainee` entity, executing training logic via a callback function, and responding to in-world events (e.g., time of day, trainee removal, perishability). It integrates with the `timer` and `perishable` components to ensure robust training flow and state synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("gym")
inst.components.gym:SetTrainFn(function(gym_inst, trainee_inst)
    trainee_inst.components.talker:Say("I learned something!")
end)
local trainee = GetPlayerEntity()
inst.components.gym:SetTrainee(trainee)
inst.components.gym:StartTraining()
```

## Dependencies & tags
**Components used:** `timer`, `perishable`  
**Tags:** None added, removed, or checked by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObj` | — | Reference to the entity that owns this component. |
| `trainfn` | `function?` | `nil` | Callback function invoked after training completes; signature: `(gym_inst, trainee_inst)`. |
| `trainee` | `GObj?` | `nil` | The entity currently being trained. |
| `traintime` | number | `TUNING.CARRAT_GYM.TRAINING_TIME` | Default duration (in seconds) for training sessions. |
| `onLoseTraineeFn` | `function?` | `nil` | Optional callback invoked when the trainee is removed. |

## Main functions
### `SetOnRemoveTraineeFn(fn)`
* **Description:** Sets a callback to be executed when the trainee is removed (e.g., via `RemoveTrainee()` or spontaneous events like death).
* **Parameters:** `fn` (function) — receives the gym instance as its only argument.
* **Returns:** Nothing.

### `RemoveTrainee()`
* **Description:** Unsets the trainee, removes event listeners attached to the trainee, and cancels an active training timer if present.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Silently returns if `trainee` is `nil`.

### `SetTrainee(inst)`
* **Description:** Assigns an entity as the current trainee and registers `onremove` and `death` listeners to automatically remove it if it leaves the world.
* **Parameters:** `inst` (`GObj?`) — the entity to train; `nil` removes the current trainee.
* **Returns:** Nothing.

### `SetTrainFn(fn)`
* **Description:** Assigns the callback function invoked upon training completion.
* **Parameters:** `fn` (function) — function to run when training finishes.
* **Returns:** Nothing.

### `StartTraining(inst, time)`
* **Description:** Begins a training session by starting a named `"training"` timer, pushing `"starttraining"` (or `"rest"` at night) events, and setting up periodic checks (perishability and music).
* **Parameters:**
  * `inst` (`GObj?`) — currently unused; retained for compatibility but does not affect behavior.
  * `time` (number?) — optional override for training duration; defaults to `traintime`.
* **Returns:** Nothing.

### `StopTraining()`
* **Description:** Ends the training session: cancels the timer and periodic tasks, and pushes `"endtraining"` event.
* **Parameters:** None.
* **Returns:** Nothing.

### `CheckPerish()`
* **Description:** Periodically inspects the trainee's perish state during training; if perish level falls below `0.1`, it triggers a random chance to briefly interrupt training with a `"rest"` state.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if trainee or trainee's `perishable` component is missing.

### `Train()`
* **Description:** Executes the `trainfn` callback and increments the trainee's `training` counter (if present).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Silently returns if `trainfn` or `trainee` is `nil`.

### `OnSave()`
* **Description:** Returns serialization data for the current training timer (time remaining), if any.
* **Parameters:** None.
* **Returns:** `{ timer: number? }` — `timer` is the remaining time in seconds or `nil`.

### `LoadPostPass(newents, data)`
* **Description:** Resumes an incomplete training session on load by restarting the timer with saved time.
* **Parameters:**
  * `newents` — unused, required for interface.
  * `data` (table) — must contain `data.timer` if a session should be resumed.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a debug string representation of the component's state.
* **Parameters:** None.
* **Returns:** `"nothing yet"` (string).

## Events & listeners
- **Listens to:**  
  * `"timerdone"` — handled by `OnTimerDone()` to conclude training and invoke `Train()`.  
  * `"onremove"` and `"death"` — attached to the `trainee` to trigger `RemoveTrainee()`.  
  * `"phase"` — watched via `WatchWorldState` to call `checktraineesleep()` and push `"rest"`/`"endrest"` events based on time of day.

- **Pushes:**  
  * `"starttraining"` — fired when training begins.  
  * `"endtraining"` — fired when training ends or is interrupted (e.g., by perish threshold or phase change).  
  * `"rest"` — fired when training transitions to rest (e.g., at night or after perish threshold).  
  * `"endrest"` — fired when rest ends at dawn.
