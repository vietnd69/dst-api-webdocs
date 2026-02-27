---
id: gym
title: Gym
description: Manages training interactions between a gym structure and a trainee entity, including start/stop training, sleep-cycle responsiveness, and training progress updates.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: e486cde5
---

# Gym

## Overview
This component enables a gym structure entity to manage training sessions with a designated trainee entity. It handles training lifecycle events (start, stop, completion), integrates with the world day/night cycle to trigger rest states, monitors trainee perishability, and persists training state across saves. It is designed to be attached to a gym structure and coordinate activity with a single trainee entity.

## Dependencies & Tags
- **Components used**: `timer`, `perishable` (on trainee), `musicstate` (assumed on `self.inst`)
- **Tags**: None explicitly added or removed.
- **Events listened to internally**: `"timerdone"`, `"onremove"` (on trainee), `"death"` (on trainee), `"rest"`, `"starttraining"`, `"endtraining"`, `"endrest"`
- **World state watched**: `"phase"` (day/night)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to (the gym structure). |
| `trainfn` | `function` | `nil` | Callback function executed each time a training session completes. Receives `(gym_inst, trainee_inst)`. |
| `trainee` | `Entity?` | `nil` | The entity currently undergoing training (e.g., a character). |
| `traintime` | `number` | `TUNING.CARRAT_GYM.TRAINING_TIME` | Duration in seconds of a single training cycle (unless overridden). |
| `onLoseTraineeFn` | `function?` | `nil` | Optional callback when the trainee is removed (via `SetOnRemoveTraineeFn`). Receives `gym_inst`. |
| `_removetrainee` | `function?` | `nil` | Internal handler for trainee removal/death events. |
| `perishcheck` | `Task?` | `nil` | Periodic task (every 5s) checking trainee perish level during training. |
| `resttask` | `Task?` | `nil` | Delayed task used to resume training after a perish-based interruption. |
| `montagemusic` | `Task?` | `nil` | Periodic task (every 4s) to manage music state during training. |

## Main Functions

### `SetOnRemoveTraineeFn(fn)`
* **Description:** Sets a custom callback to execute when the trainee is removed (e.g., despawned, died, or manually cleared).  
* **Parameters:**  
  - `fn(function)`: Function to call with `gym_inst` as its argument.

### `RemoveTrainee()`
* **Description:** Removes the current trainee, cleans up event listeners, stops training, and invokes the `onLoseTraineeFn` callback if set.  
* **Parameters:** None.

### `SetTrainee(inst)`
* **Description:** Assigns an entity as the trainee. Sets up `"onremove"` and `"death"` event listeners to auto-remove the trainee if it leaves the world or dies.  
* **Parameters:**  
  - `inst(Entity?)`: The entity to train; `nil` clears the trainee.

### `SetTrainFn(fn)`
* **Description:** Sets the callback function invoked at the end of each training session (after `traintime` elapses). Typically used to apply training effects (e.g., stat increases).  
* **Parameters:**  
  - `fn(function)`: Signature: `fn(gym_inst, trainee_inst)`.

### `PushMontage()`
* **Description:** Controls the gym’s music state: switches to `TRAINING` music if it’s daytime and a trainee exists; otherwise sets to `NONE`.  
* **Parameters:** None.

### `StartTraining(inst, time)`
* **Description:** Begins a training session. Starts a `"training"` timer, pushes `"starttraining"` or `"rest"` event based on time of day, and launches periodic tasks for perish checks and montage music.  
* **Parameters:**  
  - `inst(Entity)`: The trainee (optional; defaults to stored `self.trainee`).  
  - `time(number?)`: Duration override in seconds; falls back to `self.traintime` if omitted.

### `StopTraining()`
* **Description:** Halts training: cancels all associated tasks, stops the timer, resets music state, and pushes `"endtraining"`. Does *not* remove the trainee.  
* **Parameters:** None.

### `CheckPerish()`
* **Description:** During training, checks if the trainee is >90% perishable (i.e., `GetPercent() < 0.1`). If so, with 30% probability, ends training and schedules a short rest before potentially resuming.  
* **Parameters:** None.

### `OnTimerDone(data)`
* **Description:** Callback for `"timerdone"` events. When the `"training"` timer completes, it stops training and triggers the `Train()` step.  
* **Parameters:**  
  - `data(table)`: Event payload; must contain `name == "training"`.

### `Train()`
* **Description:** Applies the training effect by incrementing `trainee.training` and invoking `trainfn`.  
* **Parameters:** None.

### `checktraineesleep(phase)`
* **Description:** Responds to day/night phase changes while a trainee is assigned: pushes `"rest"` at night and `"endrest"` at day.  
* **Parameters:**  
  - `phase(string)`: `"day"` or `"night"`.

### `OnSave()`
* **Description:** Returns a table with the remaining time of the `"training"` timer (if active) for serialization.  
* **Parameters:** None.

### `LoadPostPass(newents, data)`
* **Description:** Restarts training after load if training was in progress, using the saved timer value as duration.  
* **Parameters:**  
  - `newents(table)`: Unused.  
  - `data(table)`: Contains `timer` (remaining seconds) if training was ongoing.

### `GetDebugString()`
* **Description:** Returns a placeholder debug string (`"nothing yet"`).  
* **Parameters:** None.

## Events & Listeners
- Listens to `"timerdone"` on `self.inst`, routing to `OnTimerDone`.
- Listens to `"onremove"` and `"death"` on the trainee (when assigned), routing to internal `_removetrainee`.
- Watches `"phase"` world state via `WatchWorldState`, routing to `checktraineesleep`.
- Pushes events: `"rest"`, `"starttraining"`, `"endtraining"`, `"endrest"`.