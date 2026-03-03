---
id: witherable
title: Witherable
description: Manages cyclic withering and rejuvenation of plants based on temperature and weather conditions, and supports temporary protection periods.
tags: [plant, weather, lifecycle, environmental]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f9f7bff8
system_scope: environment
---
# Witherable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Witherable` enables an entity to dynamically transition between active (healthy) and withered states in response to environmental conditions — primarily temperature and rain. It integrates with the `crop` and `pickable` components to apply state changes (e.g., crop turning into cutgrass, or pickable entering barren state) and supports temporary protection against withering. The component operates asynchronously using scheduled tasks and persists state across saves.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("witherable")
-- Entity is now subject to temperature- and rain-based withering/rejuvenation cycles
inst.components.witherable:Enable(true) -- explicitly enable
inst.components.witherable:Protect(60) -- prevent withering for 60 seconds
```

## Dependencies & tags
**Components used:** `crop`, `pickable`, `rainimmunity`
**Tags:** Adds `witherable` (always), `withered` (conditionally based on state)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Whether the component is active and schedules tasks. |
| `withered` | boolean | `false` | Whether the entity is currently in a withered state. |
| `wither_temp` | number | Random value in `[TUNING.MIN_PLANT_WITHER_TEMP, TUNING.MAX_PLANT_WITHER_TEMP]` | Threshold temperature above which withering may occur. |
| `rejuvenate_temp` | number | Random value in `[TUNING.MIN_PLANT_REJUVENATE_TEMP, TUNING.MAX_PLANT_REJUVENATE_TEMP]` | Threshold temperature below which rejuvenation may occur. |
| `delay_to_time` | number or `nil` | `nil` | Epoch time at which the current delay period ends (used for weather/forced delays). |
| `task_to_time` | number or `nil` | `nil` | Epoch time at which the next scheduled wither/rejuvenate task should run. |
| `task` | Task or `nil` | `nil` | Scheduled task handle for wither/rejuvenate logic. |
| `restore_cycles` | number or `nil` | `nil` | Stores pickable cycles count before withering for later restoration. |
| `is_watching_rain` | boolean or `nil` | `nil` | Whether the component listens for `startrain` world state events. |
| `protect_to_time` | number or `nil` | `nil` | Epoch time until which the entity is protected from withering. |
| `protect_task` | Task or `nil` | `nil` | Scheduled task handle for ending protection. |

## Main functions
### `Enable(enable)`
* **Description:** Enables or disables the component. When disabled, all scheduled tasks are cancelled and no new tasks are started.
* **Parameters:** `enable` (boolean) — `true` to enable, `false` to disable.
* **Returns:** Nothing.

### `IsWithered()`
* **Description:** Returns whether the entity is currently in a withered state.
* **Parameters:** None.
* **Returns:** `true` if withered, otherwise `false`.

### `IsProtected()`
* **Description:** Returns whether the entity is currently under protection (e.g., from `Protect()`).
* **Parameters:** None.
* **Returns:** `true` if protected, otherwise `false`.

### `CanWither()`
* **Description:** Returns whether the entity *can* wither (i.e., is not already withered and is active).
* **Parameters:** None.
* **Returns:** `true` if withering is possible, otherwise `false`.

### `CanRejuvenate()`
* **Description:** Returns whether the entity *can* rejuvenate (i.e., is currently withered and is *not* a `crop`).
* **Parameters:** None.
* **Returns:** `true` if rejuvenation is possible, otherwise `false`.

### `ForceWither()`
* **Description:** Immediately triggers the withering process, bypassing temperature and rain checks. Requires `CanWither()` to be true.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `CanWither()` is `false`.

### `ForceRejuvenate()`
* **Description:** Immediately triggers the rejuvenation process, bypassing temperature and rain checks. Requires `CanRejuvenate()` to be true.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `CanRejuvenate()` is `false`.

### `DelayWither(delay)`
* **Description:** Schedules the next withering attempt no earlier than `delay` seconds from now. Does *not* prevent withering — only delays the *next scheduled check*. Requires `CanWither()` to be true.
* **Parameters:** `delay` (number) — delay in seconds.
* **Returns:** Nothing.

### `DelayRejuvenate(delay)`
* **Description:** Schedules the next rejuvenation attempt no earlier than `delay` seconds from now. Respects rain state: if exposed to rain, no delay is scheduled (rejuv can proceed). Requires `CanRejuvenate()` to be true.
* **Parameters:** `delay` (number) — delay in seconds.
* **Returns:** Nothing.

### `Protect(duration)`
* **Description:** Applies temporary protection: prevents withering for `duration` seconds and immediately triggers forced rejuvenation. Multiple calls extend protection.
* **Parameters:** `duration` (number) — protection duration in seconds.
* **Returns:** Nothing.

### `Start()`
* **Description:** Starts the component’s behavior by scheduling the next task (wither, rejuvenate, or delay) based on current conditions and `delay_to_time`/`task_to_time`. Only runs if `enabled`, not sleeping, and no task is pending.
* **Parameters:** None.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Cancels the currently scheduled task (`self.task`) and stops watching world state events (`startrain`). Does *not* modify state.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns a table containing relevant state data (`withered`, `restore_cycles`, `delay_time_remaining`, `task_time_remaining`, `protect_time_remaining`) for persistence.
* **Parameters:** None.
* **Returns:** Table or `nil` (if no data to save).

### `OnLoad(data)`
* **Description:** Restores state after loading from a save. Handles `withered`, `restore_cycles`, delay and task timing, and protection.
* **Parameters:** `data` (table) — saved state data.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing the current state (e.g., `"withered: true wither temp: 15 rejuve temp: 5 PROTECTED: 20.00 DELAYING: 12.34"`).
* **Parameters:** None.
* **Returns:** String.

## Events & listeners
- **Listens to:** `startrain` (world state) — triggers immediate reschedule (`OnStartRain`).
- **Pushes:** None directly (but triggers `onwithered` callbacks via `crop:MakeWithered()`).
- **Hooks:** `OnEntitySleep`, `OnEntityWake` — delegates to `Stop()` and `Start()` respectively.
