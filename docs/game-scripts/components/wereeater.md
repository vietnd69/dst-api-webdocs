---
id: wereeater
title: Wereeater
description: Tracks consumption of monster meat to gradually trigger transformation into a Wereplayer when two or more portions are eaten within a time window.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 03421d47
---

# Wereeater

## Overview
The `wereeater` component manages the incremental tracking of monster meat consumption for wereplayer characters, accumulating counts over time and triggering transformation upon reaching a threshold (≥2) within a configurable decay window.

## Dependencies & Tags
- Relies on `inst:HasTag("wereplayer")` to prevent re-transformation while already transformed.
- Uses `inst:DoTaskInTime()` for delayed decay of food memory.
- Listens for the `"oneat"` event.
- Pushes the `"wereeaterchanged"` event to notify listeners of count or transformation state changes.
- None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `duration` | number | `TUNING.TOTAL_DAY_TIME / 2` | Time window (in seconds) over which monster meat consumption decay occurs. |
| `monster_count` | number | `0` | Current accumulated count of monster meat portions eaten. |
| `forget_task` | task reference or `nil` | `nil` | Reference to the pending decay task, or `nil` if none is scheduled. |
| `forcetransformfn` | function or `nil` | `nil` | Optional custom function to handle forced transformation; signature: `fn(inst, mode)`. |

## Main Functions

### `SetForceTransformFn(fn)`
* **Description:** Sets the function responsible for performing forced transformation (e.g., intoWere or back to human).  
* **Parameters:**  
  - `fn` (`function | nil`): A callback function that accepts `(inst, mode)` where `mode` is the transformation mode (e.g., `"werewolf"`) or `nil`.

### `ResetFoodMemory()`
* **Description:** Immediately clears the monster meat counter and cancels any pending decay task, effectively resetting the component’s state.  
* **Parameters:** None.

### `ForceTransformToWere(mode)`
* **Description:** Invokes the configured `forcetransformfn` (if set) to force transformation to a Wereplayer state.  
* **Parameters:**  
  - `mode` (`string | nil`): The transformation mode, typically inferred from the eaten item’s `were_mode` property.

### `EatMosterFood(data)`
* **Description:** Handles consumption of monster meat; increments the counter, schedules decay, and triggers transformation if `monster_count ≥ 2`. Returns early if the entity is already transformed.  
* **Parameters:**  
  - `data` (`table`): Event data containing at least `food`, a reference to the eaten food item. Required fields: `food:HasTag("monstermeat")` (checked) and optionally `food:HasTag("wereitem")` and `food.were_mode`.

### `OnSave()`
* **Description:** Serializes state for persistence, returning `nil` if no active memory (`monster_count = 0`) or data containing `monster_count` and remaining time (`task_left`) of the decay task otherwise.  
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores serialized state after loading; initializes `monster_count` and reschedules the decay task if needed.  
* **Parameters:**  
  - `data` (`table`): Saved state containing `monster_count` (integer) and optionally `task_left` (number, remaining time for decay task).

### `GetDebugString()`
* **Description:** Returns a debug string summarizing current `monster_count`, the decay window limit (hardcoded as 4 in the format), and the current/total decay time.  
* **Parameters:** None.

## Events & Listeners
- **Listens for `"oneat"`:** Triggers `OnEat`, which calls `EatMosterFood(data)`.
- **Listens for `"oneat"` removal:** Removes the `"oneat"` callback when component is removed via `OnRemoveFromEntity`.
- **Pushes `"wereeaterchanged"`:** Emitted after each successful monster meat consumption (including count update and transformation intent) and after decay step (when count decreases). Event payload contains `old`, `new`, and `istransforming` (boolean).
  - Emitted when transformation is triggered (`istransforming = true`).
  - Emitted during natural decay (`istransforming = false`).