---
id: werebeast
title: Werebeast
description: Manages transformation into and out of werebeast form based on lunar cycles, time limits, and optional trigger-based thresholds.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 462b66c7
---

# Werebeast

## Overview
This component controls the werebeast transformation mechanic for an entity. It handles transitions between human and werebeast forms based on the full moon cycle, with support for configurable transformation duration, automatic reversion after time expires, and optional trigger-based activation. It also persists state across saves/loads and integrates with limbo states to prevent invalid transformations.

## Dependencies & Tags
- **Component Dependencies**: Uses `DoTaskInTime`, `GetTaskRemaining`, `Cancel` (from `task` system).
- **World State Watched**: `"isfullmoon"` (listens for full moon state changes).
- **Events Listened To**: `"exitlimbo"`, `"enterlimbo"`.
- **Events Pushed**: `"transformwere"`, `"transformnormal"`.
- **No tags are added/removed by this component**.
- **No other components are required** for core operation (though functional behavior may depend on presence of stategraph or animation tags on the host entity).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onsetwerefn` | `function` | `nil` | Optional callback invoked when transformation *to* werebeast occurs. |
| `onsetnormalfn` | `function` | `nil` | Optional callback invoked when transformation *back* to normal occurs. |
| `weretime` | `number` | `TUNING.SEG_TIME * 4` | Default duration (in seconds) the entity remains in werebeast form before auto-reverting. |
| `triggerlimit` | `number or nil` | `nil` | Threshold that must be reached (via `TriggerDelta`) to force immediate transformation. `nil` disables trigger-based transformation. |
| `triggeramount` | `number or nil` | `0` (if triggerlimit set) / `nil` | Accumulated trigger value. Resets to 0 on transformation or `ResetTriggers()`. |
| `_task` | `Task or nil` | `nil` | Internal task handle for scheduled transformations (e.g., due to moon phase change). Cancelled on limbo entry. |
| `_reverttask` | `Task or nil` | `nil` | Internal task handle scheduled to revert transformation. |
| `inst` | `Entity` | (passed to constructor) | The entity instance this component belongs to. |

## Main Functions
### `SetOnWereFn(fn)`
* **Description:** Sets the optional callback function executed when the entity successfully transforms into werebeast form.
* **Parameters:** `fn` – A function accepting one argument (the entity instance).

### `SetOnNormalFn(fn)`
* **Description:** Sets the optional callback function executed when the entity successfully reverts to normal form.
* **Parameters:** `fn` – A function accepting one argument (the entity instance).

### `SetTriggerLimit(limit)`
* **Description:** Configures a trigger threshold. When `TriggerDelta` accumulates to reach or exceed `limit`, the entity is forced into werebeast form. Passing `nil` disables this feature.
* **Parameters:** `limit` – A number or `nil`.

### `TriggerDelta(amount)`
* **Description:** Adds to the cumulative `triggeramount`. If `triggerlimit` is set and the sum reaches or exceeds the limit, triggers immediate transformation.
* **Parameters:** `amount` – A number (can be negative to reduce accumulated trigger value).

### `ResetTriggers()`
* **Description:** Resets `triggeramount` to `0` if `triggerlimit` is set; otherwise sets it to `nil`. Called automatically on transformation.

### `SetWere([time])`
* **Description:** Forces immediate transformation to werebeast form. Starts a reversion timer using the provided `time` or `self.weretime` if not specified. Executes `onsetwerefn` and pushes `"transformwere"` event.
* **Parameters:** `time` (optional) – Duration in seconds before automatic reversion. Defaults to `self.weretime`.

### `SetNormal()`
* **Description:** Forces immediate reversion to normal form. Cancels any pending reversion timer. Executes `onsetnormalfn` and pushes `"transformnormal"` event.

### `IsInWereState()`
* **Description:** Returns whether the entity is currently in werebeast form (determined by presence of `_reverttask`).
* **Returns:** `boolean` – `true` if transformed, `false` otherwise.

### `OnSave()`
* **Description:** Serializes remaining werebeast time for persistence. Returns `nil` if not transformed or time is `0`; otherwise returns a table `{ time = remaining_seconds }`.
* **Returns:** `{ time: number }` or `nil`.

### `OnLoad(data)`
* **Description:** Restores werebeast state from saved data. If `data.time` exists, immediately triggers transformation for that duration.
* **Parameters:** `data` – A table potentially containing `{ time = number }`.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing trigger status and remaining werebeast time.
* **Returns:** `string` – e.g., `"triggers: 5.00/10.00, were time: 12.50"` or `"no triggers, were time: 10.00"`.

## Events & Listeners
- **Listens to `"isfullmoon"`**: Triggers `OnIsFullmoon` to react to moon phase changes.
- **Listens to `"exitlimbo"`**: Triggers `OnExitLimbo` to reschedule transformations after exiting limbo.
- **Listens to `"enterlimbo"`**: Triggers `OnEnterLimbo` to cancel pending tasks while in limbo.
- **Pushes `"transformwere"`**: Fired when entering werebeast form via `SetWere`.
- **Pushes `"transformnormal"`**: Fired when reverting to normal via `SetNormal` or `OnRevert`.