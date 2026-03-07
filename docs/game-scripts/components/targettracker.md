---
id: targettracker
title: Targettracker
description: Tracks a single target entity and manages tracking duration, pausing, and automatic invalidation.
tags: [combat, ai, tracking]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 93233840
system_scope: entity
---

# Targettracker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`TargetTracker` is a component that enables an entity to maintain and monitor a single target entity over time. It handles tracking duration, pausing, and automatic invalidation (e.g., target death or removal), and supports callback hooks for custom logic. It is typically added to AI-controlled entities or combat systems that need to follow, attack, or react to a specific target.

The component interacts with the `health` component to detect when a tracked target becomes invalid (e.g., dead), and fires events to notify other systems when tracking starts or stops.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("targettracker")

-- Set up callbacks
inst.components.targettracker:SetOnResetTarget(function() print("Target lost") end)
inst.components.targettracker:SetOnTimeUpdateFn(function(inst, time, lasttime)
    print(string.format("Tracking for %.1f seconds (delta: %.1f)", time, time - lasttime))
end)

-- Start tracking a target
inst.components.targettracker:TrackTarget(some_entity)

-- Pause tracking for 5 seconds
inst.components.targettracker:Pause(5)
```

## Dependencies & tags
**Components used:** `health` (via `target.components.health:IsDead()`)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | entity or `nil` | `nil` | The currently tracked entity. |
| `timetracking` | number or `nil` | `nil` | Total time (in seconds) spent tracking the current target. |
| `pausetime` | number or `nil` | `nil` | Remaining time before unpausing (if paused). |
| `onresettarget` | function or `nil` | `nil` | Callback fired when tracking stops and `reset` is `true`. Signature: `fn(inst, target)`. |
| `onpausefn` | function or `nil` | `nil` | Callback fired when pausing starts. Signature: `fn(inst)`. |
| `onresumefn` | function or `nil` | `nil` | Callback fired when pause ends. Signature: `fn(inst)`. |
| `ontimeupdatefn` | function or `nil` | `nil` | Callback fired each frame while tracking (non-paused). Signature: `fn(inst, total_time, last_time)`. |
| `shouldkeeptrackingfn` | function or `nil` | `nil` | Optional predicate. Tracking stops if `false` is returned. Signature: `fn(inst, target)`. |
| `_updating` | boolean | `false` | Internal flag indicating whether `OnUpdate` is active. |

## Main functions
### `SetOnResetTarget(fn)`
*   **Description:** Assigns a callback function that is invoked when tracking stops and the `reset` parameter is `true`.
*   **Parameters:** `fn` (function) - callback with signature `(inst, target)`.
*   **Returns:** Nothing.

### `SetOnPauseFn(fn)`
*   **Description:** Assigns a callback invoked when tracking is paused.
*   **Parameters:** `fn` (function) - callback with signature `(inst)`.
*   **Returns:** Nothing.

### `SetOnResumeFn(fn)`
*   **Description:** Assigns a callback invoked when tracking resumes after pausing.
*   **Parameters:** `fn` (function) - callback with signature `(inst)`.
*   **Returns:** Nothing.

### `SetOnTimeUpdateFn(fn)`
*   **Description:** Assigns a callback invoked each update tick while tracking (non-paused) to report elapsed tracking time.
*   **Parameters:** `fn` (function) - callback with signature `(inst, total_time, last_time)`, where `total_time` is cumulative time, and `last_time` is time at previous frame.
*   **Returns:** Nothing.

### `SetShouldKeepTrackingFn(fn)`
*   **Description:** Assigns an optional predicate function used to decide whether to continue tracking. If it returns `false`, tracking stops.
*   **Parameters:** `fn` (function) - predicate with signature `(inst, target)`.
*   **Returns:** Nothing.

### `HasTarget()`
*   **Description:** Checks if the component currently tracks any target.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if a target is set, `false` otherwise.

### `IsTracking(testtarget)`
*   **Description:** Checks if the specified entity is the current target.
*   **Parameters:** `testtarget` (entity) — the entity to compare against the tracked target.
*   **Returns:** `boolean` — `true` if `testtarget` matches the tracked target.

### `IsPaused()`
*   **Description:** Checks if tracking is currently paused.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `pausetime` is not `nil`.

### `IsCloningTarget()`
*   **Description:** Returns `true` if the component is cloning a target (i.e., tracking is paused and no positive time is accumulated yet).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `(timetracking <= 0)` and `IsPaused()`.

### `GetTimeTracking()`
*   **Description:** Returns the total accumulated tracking time.
*   **Parameters:** None.
*   **Returns:** `number or nil` — current `timetracking` value, or `nil` if never set.

### `SetTimeTracking(time)`
*   **Description:** Manually sets the accumulated tracking time and triggers the time update callback.
*   **Parameters:** `time` (number) — value to assign to `timetracking`.
*   **Returns:** Nothing.

### `CloneTargetFrom(item, pausetime)`
*   **Description:** Copies the target and pause state from another `TargetTracker` component (typically used for effect duplication, e.g., pet or clone effects).
*   **Parameters:**  
    *   `item` (entity) — entity whose `targettracker` component to clone from.  
    *   `pausetime` (number or `nil`) — optional pause duration to apply to both components.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `item.components.targettracker` is missing, or if `item` has no target.

### `TrackTarget(target)`
*   **Description:** Begins tracking a new target. Fails silently if a target is already tracked.
*   **Parameters:** `target` (entity) — the entity to begin tracking.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `target == nil` or if `target` is invalid (no validation is performed beyond assignment and event firing).

### `StopTracking(reset)`
*   **Description:** Stops tracking the current target and cleans up event listeners and updates.
*   **Parameters:** `reset` (boolean) — if `true`, invokes `onresettarget` callback and fires `targettracker_stoptrack` event.
*   **Returns:** Nothing.

### `Pause(time)`
*   **Description:** Pauses the tracking timer for the given duration. Does not stop updating or event callbacks.
*   **Parameters:** `time` (number) — duration in seconds to pause.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** The main update loop—validates the target, updates tracking time, or handles pausing. Automatically called by the entity's update system while `_updating == true`.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.
*   **Error states:** Stops tracking if `target` is invalid, removed, sleeping, or dead; or if `shouldkeeptrackingfn` returns `false`.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string summarizing tracking state.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"Target: abigail || Time Tracking: 10 || Pause Time: 5 || Updating: ON"`.

## Events & listeners
- **Listens to:**  
  - `onremove` on the tracked target (registered in `TrackTarget`) — triggers `StopTracking(true)`.
- **Pushes:**  
  - `targettracker_starttrack(target)` — fired when tracking begins.  
  - `targettracker_stoptrack()` — fired when tracking ends.
