---
id: mapdeliverable
title: Mapdeliverable
description: Manages item delivery mechanics with progress tracking, callbacks, and save/load support for map-based delivery actions.
tags: [delivery, map, item]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 05f893f0
system_scope: entity
---

# Mapdeliverable

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`MapDeliverable` manages the delivery lifecycle of an item entity traveling from an origin point to a destination. It tracks delivery progress over time, supports custom callback hooks for delivery events, and integrates with the `bufferedmapaction` prefab for player-initiated map actions. The component handles save/load persistence for in-progress deliveries and provides progress querying for UI feedback.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("mapdeliverable")

-- Configure delivery time
inst.components.mapdeliverable:SetDeliveryTime(10)

-- Set callback for delivery completion
inst.components.mapdeliverable:SetOnStopDeliveryFn(function(delivery_inst)
    print("Delivery completed!")
end)

-- Start delivery to a point
local dest_pt = Vector3(100, 0, 100)
inst.components.mapdeliverable:SendToPoint(dest_pt, player)

-- Check progress
local progress = inst.components.mapdeliverable:GetProgress()
```

## Dependencies & tags
**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. |
| `deliverytime` | number | `5` | Default delivery duration in seconds. Used if `deliverytimefn` is not set. |
| `deliverytimefn` | function | `nil` | Optional function to calculate delivery time dynamically. Signature: `fn(inst, dest, doer) → number`. |
| `onstartdeliveryfn` | function | `nil` | Called when delivery starts. Signature: `fn(inst, pt, doer) → success, reason`. Return `false` to cancel. |
| `ondeliveryprogressfn` | function | `nil` | Called each update during delivery. Signature: `fn(inst, t, len, origin, dest)`. |
| `onstopdeliveryfn` | function | `nil` | Called when delivery completes or is stopped. Signature: `fn(inst)`. |
| `onstartmapactionfn` | function | `nil` | Called when map action starts. Signature: `fn(inst, doer) → success, reason`. Return `false` to cancel. |
| `oncancelmapactionfn` | function | `nil` | Called when map action is cancelled. Signature: `fn(inst, doer)`. |
| `origin` | Vector3 | `nil` | Starting position of the delivery. Set in `SendToPoint()`. |
| `dest` | Vector3 | `nil` | Destination position of the delivery. Set in `SendToPoint()`. |
| `t` | number | `nil` | Current elapsed time in seconds. `nil` when not delivering. |
| `len` | number | `nil` | Total delivery duration in seconds. `nil` when not delivering. |
| `bufferedmapaction` | entity | `nil` | The bufferedmapaction prefab instance. Cleared on cancel or completion. |

## Main functions
### `Reset_Internal()`
* **Description:** Internal reset function that clears delivery state variables (`origin`, `dest`, `t`, `len`) to `nil`. Called when delivery completes or is stopped.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnRemoveEntity()`
* **Description:** Cleanup handler called when the owning entity is removed. Cancels any active `bufferedmapaction` and triggers the cancel callback if present.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnRemoveFromEntity()`
* **Description:** Cleanup handler called when the component is removed from the entity. Calls `CancelMapAction()` to clean up any pending delivery.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SetDeliveryTime(t)`
* **Description:** Sets the default delivery duration in seconds. Used when `deliverytimefn` is not configured.
* **Parameters:** `t` -- number, delivery time in seconds
* **Returns:** nil
* **Error states:** None

### `SetDeliveryTimeFn(fn)`
* **Description:** Sets a custom function to calculate delivery time dynamically based on destination and doer.
* **Parameters:** `fn` -- function with signature `fn(inst, dest, doer) → number`
* **Returns:** nil
* **Error states:** None

### `SetOnStartDeliveryFn(fn)`
* **Description:** Sets the callback function invoked when delivery starts. Can return `false` to cancel the delivery.
* **Parameters:** `fn` -- function with signature `fn(inst, pt, doer) → success, reason`
* **Returns:** nil
* **Error states:** None

### `SetOnDeliveryProgressFn(fn)`
* **Description:** Sets the callback function invoked each update tick during delivery. Provides progress data for UI updates.
* **Parameters:** `fn` -- function with signature `fn(inst, t, len, origin, dest)`
* **Returns:** nil
* **Error states:** None

### `SetOnStopDeliveryFn(fn)`
* **Description:** Sets the callback function invoked when delivery completes or is stopped.
* **Parameters:** `fn` -- function with signature `fn(inst)`
* **Returns:** nil
* **Error states:** None

### `SetOnStartMapActionFn(fn)`
* **Description:** Sets the callback function invoked when a map action is initiated. Can return `false` to prevent the action.
* **Parameters:** `fn` -- function with signature `fn(inst, doer) → success, reason`
* **Returns:** nil
* **Error states:** None

### `SetOnCancelMapActionFn(fn)`
* **Description:** Sets the callback function invoked when a map action is cancelled.
* **Parameters:** `fn` -- function with signature `fn(inst, doer)`
* **Returns:** nil
* **Error states:** None

### `StartMapAction(doer)`
* **Description:** Initiates a buffered map action for the delivery. Spawns a `bufferedmapaction` prefab and registers an `onremove` event listener. Returns `false` if an action is already in progress or if the start callback rejects it.
* **Parameters:** `doer` -- player entity initiating the action
* **Returns:** `true` on success, `false, reason` on failure
* **Error states:** Errors if `bufferedmapaction` prefab does not exist (SpawnPrefab returns nil). Asserts that `inst.bufferedmapaction` matches the spawned instance.

### `CancelMapAction()`
* **Description:** Cancels the current buffered map action by removing the prefab instance. Clears `self.bufferedmapaction` after removal.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `IsDelivering()`
* **Description:** Returns whether a delivery is currently in progress by checking if `self.t` is set.
* **Parameters:** None
* **Returns:** boolean -- `true` if delivering, `false` otherwise
* **Error states:** None

### `GetProgress()`
* **Description:** Returns the current delivery progress as a ratio from 0 to 1. Handles edge case where `len == 0` by returning 1.
* **Parameters:** None
* **Returns:** number -- progress ratio, or `nil` if not delivering
* **Error states:** None

### `SendToPoint(pt, doer)`
* **Description:** Starts delivery to the specified destination point. Initializes origin, destination, and timing variables, then starts the component update loop. Returns `false` if already delivering or if a conflicting bufferedmapaction exists.
* **Parameters:**
  - `pt` -- Vector3 or position-like object with `Get()` method
  - `doer` -- player entity initiating the delivery
* **Returns:** `true` on success, `false` or `false, reason` on failure
* **Error states:** Errors if `onstartdeliveryfn` callback throws. The `pt:Get()` call assumes `pt` has a `Get()` method.

### `OnUpdate(dt)`
* **Description:** Update loop called each tick while delivering. Increments elapsed time `t`, calls the progress callback, and completes delivery when `t >= len`. Triggers stop callback and resets state on completion.
* **Parameters:** `dt` -- number, delta time in seconds
* **Returns:** nil
* **Error states:** None

### `Stop()`
* **Description:** Manually stops an in-progress delivery. Resets state, stops the update loop, and triggers the stop callback. Does nothing if not currently delivering.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnSave()`
* **Description:** Serializes delivery state for world save. Returns a table with origin/destination coordinates (serialized to 3 decimal places), elapsed time, and total duration. Returns `nil` if not currently delivering.
* **Parameters:** None
* **Returns:** table or `nil` -- save data with keys `x0, y0, z0, x1, y1, z1, t, len`
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores delivery state from saved data. Resumes delivery if `data.t` exists and no delivery is in progress. Validates callbacks before resuming. Prints debug message on resume.
* **Parameters:** `data` -- table from `OnSave()` with position and timing data
* **Returns:** nil
* **Error states:** None

### `_dbg_print(...)`
* **Description:** Internal debug printing function. Outputs delivery status messages to the console.
* **Parameters:** `...` -- variadic arguments passed to `print()`
* **Returns:** nil
* **Error states:** None

## Events & listeners
- **Listens to:** `onremove` -- on `bufferedmapaction` entity; triggers `_onremovebufferedmapaction` callback when the action prefab is removed