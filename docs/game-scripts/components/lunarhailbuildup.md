---
id: lunarhailbuildup
title: Lunarhailbuildup
description: Manages lunar hail accumulation and decay on an entity, tracks work required to dismantle the buildup, and triggers moonglass rewards upon completion.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 73ebd5f2
---

# Lunarhailbuildup

## Overview
This component tracks and manages lunar hail buildup on an entity, including buildup and decay phases governed by in-game lunar hail events. It handles work required to remove the buildup, reward dropping (moonglass), and state transitions between buildup/decay/workable states. It integrates with the world’s `islunarhailing` state and responds to work-related events.

## Dependencies & Tags
- **Component Dependency:** None explicitly added (`inst:AddComponent` calls are not present in this file).
- **Tags Added/Removed:**  
  - Adds `"LunarBuildup"` tag during `WorkInit()` and `OnRemoveFromEntity()` removes it.
- **World State Watched:** `"islunarhailing"` (via `WatchWorldState`).
- **Tuning Dependencies:** Uses `TUNING.LUNARHAIL_BUILDUP_*` constants (e.g., `TOTAL_WORK_AMOUNT_MEDIUM`, `MOONGLASS_AMOUNT_MEDIUM`, `TICK_TIME`, `RATE`, `DECAY_TICK_TIME`, `DECAY_RATE`, `MOONGLASS_REWARDS_CHARGED_CHANCE_MIN`, `MOONGLASS_REWARDS_CHARGED_CHANCE_MAX`, `MOONGLASS_REWARDS_DESTRUCTION_MULT`).

## Properties
| Property | Type | Default Value | Description |
|---------|------|---------------|-------------|
| `inst` | `Entity` | (constructor param) | Reference to the parent entity. |
| `buildupmax` | `number` | `1` | Maximum possible buildup value (used as denominator for percentages). |
| `buildupcurrent` | `number` | `0` | Current buildup amount, clamped between `0` and `buildupmax`. |
| `workleft` | `number` | `0` | Amount of work remaining to fully dismantle the buildup. |
| `totalworkamount` | `number` | `TUNING.LUNARHAIL_BUILDUP_TOTAL_WORK_AMOUNT_MEDIUM` | Total work required to clear buildup from 100%. |
| `moonglassamount` | `number` | `TUNING.LUNARHAIL_BUILDUP_MOONGLASS_AMOUNT_MEDIUM` | Base count of moonglass items to drop on completion. |
| `ignorelunarhailticks` | `boolean` | `nil` | If set, skips buildup/decay tick updates from lunar hail events. |
| `onstartislunarhailingfn` | `function?` | `nil` | Optional callback triggered when lunar hail starts. |
| `onstopislunarhailingfn` | `function?` | `nil` | Optional callback triggered when lunar hail stops. |
| `lunarhailtick_task` | `Task?` | `nil` | Periodic task driving buildup/decay ticks. |

## Main Functions

### `SetOnStartIsLunarHailingFn(fn)`
* **Description:** Sets a callback function invoked when lunar hail begins and buildup is active.  
* **Parameters:**  
  - `fn (function)`: Function to call on lunar hail start; receives `inst` as argument.

### `SetOnStopIsLunarHailingFn(fn)`
* **Description:** Sets a callback function invoked when lunar hail ends and buildup is active.  
* **Parameters:**  
  - `fn (function)`: Function to call on lunar hail stop; receives `inst` as argument.

### `IsBuildupWorkable()`
* **Description:** Returns whether work has been initiated on the buildup (i.e., `workleft > 0`).  
* **Returns:** `boolean`.

### `SetTotalWorkAmount(totalworkamount)`
* **Description:** Updates the total work required for full buildup removal, adjusting `workleft` if necessary.  
* **Parameters:**  
  - `totalworkamount (number)`: New total work amount; `workleft` is clamped down if increased.

### `SetMoonGlassAmount(moonglassamount)`
* **Description:** Updates the base number of moonglass items to drop upon completion.  
* **Parameters:**  
  - `moonglassamount (number)`: New base amount.

### `GetBuildupPercent()`
* **Description:** Returns the current buildup as a percentage (0.0 to 1.0).  
* **Returns:** `number`.

### `SetBuildupPercent(percent)`
* **Description:** Adjusts `buildupcurrent` to match the given percentage (0.0–1.0) via delta calculation.  
* **Parameters:**  
  - `percent (number)`: Target fraction of `buildupmax`.

### `SetIgnoreLunarHailTicks(ignorelunarhailticks)`
* **Description:** Enables/disables responsiveness to lunar hail events. May trigger optional callbacks when state changes.  
* **Parameters:**  
  - `ignorelunarhailticks (boolean)`.

### `DoLunarHailTick(buildingup)`
* **Description:** Applies one tick of buildup (positive delta) or decay (negative delta), skipping if rain-immune or ticks are ignored.  
* **Parameters:**  
  - `buildingup (boolean)`: If true, increases buildup; otherwise, decreases it.

### `StopTickTask()`
* **Description:** Cancels and nullifies the active periodic tick task (`lunarhailtick_task`).  
* **Parameters:** None.

### `StartBuildupTask()`
* **Description:** Starts a periodic task to increment buildup using `TUNING.LUNARHAIL_BUILDUP_TICK_TIME`.  
* **Parameters:** None.

### `StartDecayTask()`
* **Description:** Starts a periodic task to decrement buildup using `TUNING.LUNARHAIL_BUILDUP_DECAY_TICK_TIME`.  
* **Parameters:** None.

### `DoWorkToRemoveBuildup(workcount, doer)`
* **Description:** Deducts `workcount` from `workleft`; triggers reward dropping, work-finish logic, and event callbacks upon completion.  
* **Parameters:**  
  - `workcount (number)`: Amount of work to apply.  
  - `doer (Entity?)`: Entity performing work; may be `nil`.

### `DoAllRemainingWorkToRemoveBuildup(doer)`
* **Description:** Completes all remaining work in one call.  
* **Parameters:**  
  - `doer (Entity?)`: Entity performing work.

### `DropRewards(mult, doer)`
* **Description:** Spawns moonglass items at the entity's position, with a chance for charged moonglass based on current buildup percentage.  
* **Parameters:**  
  - `mult (number?)`: Multiplier applied to `moonglassamount` (default 1).  
  - `doer (Entity?)`: Source entity for luck-based upgrades.

### `OnWorkFinished()`
* **Description:** Clears `workleft`, removes `"LunarBuildup"` tag, cancels work listener, and drops buildup to 0 if complete.  
* **Parameters:** None.

### `WorkInit()`
* **Description:** Initializes work on the buildup by setting `workleft = totalworkamount`, adding `"LunarBuildup"` tag, and subscribing to `"worked"` events.  
* **Parameters:** None.

### `DoBuildupDelta(delta)`
* **Description:** Adjusts `buildupcurrent` by `delta`, clamped to `[0, buildupmax]`. Triggers state changes:  
  - If buildup reaches `buildupmax` and `workleft == 0`, initiates work.  
  - If buildup hits `0` with remaining work, finishes work passively.  
* **Parameters:**  
  - `delta (number)`: Change in buildup value.

### `OnSave()`
* **Description:** Serializes current `workleft` and `buildupcurrent` (only if non-zero).  
* **Returns:** `table` or `nil`.

### `OnLoad(data)`
* **Description:** Restores `workleft` and `buildupcurrent` from save data, reinitializing state as needed.  
* **Parameters:**  
  - `data (table?)`: Saved data from `OnSave()`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string for inspection (buildup percent, work left, next tick).  
* **Returns:** `string`.

## Events & Listeners
- **Listens For:**
  - `"worked"` → `OnWorked_Bridge` (in `WorkInit()`).
  - `"islunarhailing"` (via `WatchWorldState`) → `OnIsLunarHailing`.
- **Emits:**
  - `"lunarhailbuildupdelta"` with `{ oldpercent, newpercent }` on buildup change.
  - `"lunarhailbuildupworkablestatechanged"` in `WorkInit()` and `OnWorkFinished()`.
  - `"lunarhailbuildupworked"` with `{ doer }` in `DoWorkToRemoveBuildup()`.
  - `"workinglunarhailbuildup"` (pushed on doer) in `DoWorkToRemoveBuildup()`.