---
id: witherable
title: Witherable
description: Manages temperature-dependent withering and rejuvenation behavior for plants and crops, including rain sensitivity, protection windows, and state transitions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f9f7bff8
---

# Witherable

## Overview
The `Witherable` component controls the environmental life cycle of plants and crops by dynamically toggling their withered state based on local temperature and rain conditions. It schedules timed transitions between withered, barren, and active states, supports protection periods that suspend decay, and persists state across saves/loadups. Entities gain the `"witherable"` tag on initialization, and adopt the `"withered"` tag when decayed.

## Dependencies & Tags
- **Requires components:** `crop` (optional), `pickable` (optional), `rainimmunity` (optional, for rain exposure logic).
- **Adds tags:** `"witherable"` on entity initialization; `"withered"` when decayed.
- **Removes tags on removal:** `"witherable"` and `"withered"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | `boolean` | `true` | Enables/disables scheduled withering/rejuvenation tasks. |
| `withered` | `boolean` | `false` | Current decayed state of the entity. |
| `wither_temp` | `number` | Random between `TUNING.MIN_PLANT_WITHER_TEMP` and `TUNING.MAX_PLANT_WITHER_TEMP` | Temperature threshold above which the entity *can* wither (provided not rained on). |
| `rejuvenate_temp` | `number` | Random between `TUNING.MIN_PLANT_REJUVENATE_TEMP` and `TUNING.MAX_PLANT_REJUVENATE_TEMP` | Temperature threshold below which the entity *can* rejuvenate (or if rained on). |
| `delay_to_time` | `number?` | `nil` | Future timestamp until which scheduling is postponed (e.g., during rain protection or manual delay). |
| `task_to_time` | `number?` | `nil` | Timestamp for the next scheduled check (withering/rejuvenation). |
| `task` | `Task?` | `nil` | Active task handle for pending checks. |
| `restore_cycles` | `number?` | `nil` | Stores pickable's cycle count prior to barrening for later restoration. |
| `is_watching_rain` | `boolean?` | `nil` | Whether the component is listening to world `"startrain"` events. |
| `protect_to_time` | `number?` | `nil` | Timestamp when current protection ends. |
| `protect_task` | `Task?` | `nil` | Task handle for ending protection period. |

## Main Functions

### `Enable(enable)`
* **Description:** Enables or disables scheduled withering/rejuvenation. Disabling pauses checks; re-enabling resumes based on current state and conditions.
* **Parameters:**  
  `enable` (`boolean?`) — If `false`, disables the component and cancels pending tasks. If truthy (and currently disabled), re-enables and restarts scheduling.

### `IsWithered()`
* **Description:** Returns whether the entity is currently in the withered state.
* **Returns:** `boolean`

### `IsProtected()`
* **Description:** Indicates whether the entity is currently under a protection window that delays withering and triggers rejuvenation.
* **Returns:** `boolean`

### `CanWither()`
* **Description:** Checks if the entity *can* wither (i.e., is not already withered and has no active protection).
* **Returns:** `boolean`

### `CanRejuvenate()`
* **Description:** Checks if the entity *can* rejuvenate (i.e., is withered and not a crop; crops rejuvenate via `crop:Rejuvenate()` logic, not pickable logic).
* **Returns:** `boolean`

### `ForceWither()`
* **Description:** Immediately transitions the entity to withered state, bypassing all timers and conditions. Cancels pending tasks.
* **Parameters:** None

### `ForceRejuvenate()`
* **Description:** Immediately transitions a withered pickable to a non-barren state (rejuvenation), bypassing timers and conditions. Cancels pending tasks.
* **Parameters:** None

### `DelayWither(delay)`
* **Description:** Postpones the next withering check by `delay` seconds. Only triggers if not already withered.
* **Parameters:**  
  `delay` (`number`) — Time in seconds to delay the withering timer.

### `DelayRejuvenate(delay)`
* **Description:** Postpones the next rejuvenation check by `delay` seconds *only if not rained on*. Does nothing if rained on (since rejuvenation is imminent).
* **Parameters:**  
  `delay` (`number`) — Time in seconds to delay the rejuvenation timer.

### `Protect(duration)`
* **Description:** Applies a protection window of `duration` seconds: during this period, withering is delayed and rejuvenation is forced. Also starts a delayed task to end protection.
* **Parameters:**  
  `duration` (`number`) — Length of protection in seconds.

### `Start()`
* **Description:** Begins or resumes scheduling checks (withering/rejuvenation/delay) if the component is enabled, the entity is awake, and no task is pending.
* **Parameters:** None

### `Stop()`
* **Description:** Cancels any pending task and stops listening to world state events (e.g., rain).
* **Parameters:** None

### `OnSave()`
* **Description:** Returns a serializable table containing current state for persistence: whether withered, remaining cycles, and time remaining for delays, tasks, and protection.
* **Returns:** `table?` — Non-empty data table or `nil` if no state to save.

### `OnLoad(data)`
* **Description:** Restores state from saved data. Handles loading of withered status, restore cycles, and pending delays/timers.
* **Parameters:**  
  `data` (`table`) — Saved state data.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing current state, temperatures, and active timers.
* **Returns:** `string`

## Events & Listeners
- Listens for `"startrain"` world state event → triggers `OnStartRain(self)` handler to restart scheduling when rain begins.
- Triggers `OnEndProtect(self)` via task when protection period ends (via `Protect`).
- Calls `OnInit(inst, self)` at time `0` after construction (via `DoTaskInTime`) to ensure initialization is deferred to frame 0.