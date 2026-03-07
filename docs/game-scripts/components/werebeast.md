---
id: werebeast
title: Werebeast
description: Manages werebeast transformation logic, including moon phase triggers, manual transformation, and automatic reversion timers.
tags: [combat, transformation, moon, state, save]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 462b66c7
system_scope: entity
---

# Werebeast

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WereBeast` is a core component that governs the transformation and reversion behavior of werebeast characters (e.g.,伍迪/Woodie). It tracks time spent in werebeast form, responds to full moon phases, supports manual triggering (via combat or other mechanics), and handles automatic reversion after a configurable duration. It integrates with the save/load system and task scheduling to maintain consistent state across sessions and world re-loads.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("werebeast")

-- Set callbacks for transformation events
inst.components.werebeast:SetOnWereFn(function(entity) print("Changed to werebeast!") end)
inst.components.werebeast:SetOnNormalFn(function(entity) print("Reverted to human!") end)

-- Manually trigger a transformation for 60 seconds
inst.components.werebeast:SetWere(60)

-- Alternatively, set up trigger-based transformation
inst.components.werebeast:SetTriggerLimit(5)
inst.components.werebeast:TriggerDelta(2) -- increment trigger counter
inst.components.werebeast:TriggerDelta(4) -- exceeds limit → transforms
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None added, removed, or checked directly by this component (relies on external systems to apply/remove player tags like `werebeast`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onsetwerefn` | function or nil | `nil` | Callback invoked when transforming into werebeast form. |
| `onsetnormalfn` | function or nil | `nil` | Callback invoked when reverting to normal (human) form. |
| `weretime` | number | `TUNING.SEG_TIME * 4` | Default duration (in seconds) before automatic reversion after transformation. |
| `triggerlimit` | number or nil | `nil` | Threshold of accumulated trigger points required to force transformation; `nil` disables trigger-based transformation. |
| `triggeramount` | number or nil | `nil` or `0` | Current accumulated trigger points. Set to `0` if `triggerlimit` is non-`nil`; otherwise `nil`. |
| `_task` | task or nil | `nil` | Pending scheduled task (e.g., delayed transform on moon phase change). |
| `_reverttask` | task or nil | `nil` | Pending scheduled reversion task. Non-`nil` indicates current werebeast state. |

## Main functions
### `SetOnWereFn(fn)`
*   **Description:** Sets the callback function to run when transformation to werebeast occurs.
*   **Parameters:** `fn` (function) - a function accepting a single `inst` argument.
*   **Returns:** Nothing.

### `SetOnNormalFn(fn)`
*   **Description:** Sets the callback function to run when reverting to normal occurs.
*   **Parameters:** `fn` (function) - a function accepting a single `inst` argument.
*   **Returns:** Nothing.

### `SetTriggerLimit(limit)`
*   **Description:** Configures a trigger threshold. Once accumulated `triggeramount` meets or exceeds `limit`, automatic transformation occurs. Call `ResetTriggers()` to reset current amount.
*   **Parameters:** `limit` (number or nil) - threshold amount; `nil` disables trigger-based transformation.
*   **Returns:** Nothing.
*   **Error states:** Calling this clears `triggeramount` to `0` (if `limit` is non-`nil`) or `nil`.

### `TriggerDelta(amount)`
*   **Description:** Increments the accumulated trigger amount by `amount`. If `triggerlimit` is set and the new amount reaches or exceeds the limit, initiates transformation.
*   **Parameters:** `amount` (number) - the value to add to `triggeramount`.
*   **Returns:** Nothing.
*   **Error states:** No effect if `triggerlimit` is `nil`.

### `SetWere(time)`
*   **Description:** Immediately transforms the entity to werebeast form and schedules reversion after `time` seconds. Defaults to `weretime` if `time` is omitted.
*   **Parameters:** `time` (number or nil) - duration in seconds before reversion.
*   **Returns:** Nothing.
*   **Error states:** Cancels existing `_task` and `_reverttask`; pushes `"transformwere"` event.

### `SetNormal()`
*   **Description:** Immediately reverts the entity to normal (human) form and cancels any pending reversion task.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Cancels `_task` and `_reverttask`; pushes `"transformnormal"` event.

### `IsInWereState()`
*   **Description:** Returns whether the entity is currently in werebeast form.
*   **Parameters:** None.
*   **Returns:** `true` if `_reverttask` is non-`nil`; otherwise `false`.

### `OnSave()`
*   **Description:** Returns serialization data for the current transformation state.
*   **Parameters:** None.
*   **Returns:** `{ time = number }` if transforming or currently in werebeast state (time remaining in seconds); otherwise `nil`.

### `OnLoad(data)`
*   **Description:** Restores transformation state from serialized data. If `data.time` is present, immediately sets werebeast form with remaining time.
*   **Parameters:** `data` (table or nil) - serialized state from `OnSave()`.
*   **Returns:** Nothing.
*   **Error states:** No effect if `data` is `nil` or `data.time` is missing/invalid.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string summarizing the current transformation state.
*   **Parameters:** None.
*   **Returns:** `string` - e.g., `"triggers: 3.00/5.00, were time: 42.17"` or `"no triggers, were time: 15.00"`.

## Events & listeners
- **Listens to:**  
  - `exitlimbo` — Re-schedules transformation check (e.g., after respawning or exiting limbo).  
  - `enterlimbo` — Cancels pending tasks while in limbo (prevents state inconsistency).  
  - `isfullmoon` (via `WatchWorldState`) — Triggers `OnIsFullmoon` on moon phase changes.

- **Pushes:**  
  - `"transformwere"` — Fired when transformation to werebeast completes.  
  - `"transformnormal"` — Fired when reversion to normal completes.
