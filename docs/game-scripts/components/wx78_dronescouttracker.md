---
id: wx78_dronescouttracker
title: Wx78 Dronescouttracker
description: Tracks and manages WX-78's drone scout entities across shards with save/load support.
tags: [wx78, drones, tracking]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: f0a7c398
system_scope: entity
---

# Wx78 Dronescouttracker

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Wx78_DroneScoutTracker` is a component attached to the WX-78 character entity that maintains a registry of active drone scout entities. It handles tracking lifecycle (start/stop), automatic cleanup when drones are removed, and cross-shard persistence via save/load serialization. The component supports callback hooks for external code to respond to tracking state changes and pushes events to drones when their tracking status changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wx78_dronescouttracker")

-- Set up callbacks for tracking events
inst.components.wx78_dronescouttracker:SetOnStartTrackingFn(function(owner, drone)
    print("Started tracking drone:", drone.prefab)
end)

-- Start tracking a drone entity
local drone = SpawnPrefab("wx78_drone_scout")
inst.components.wx78_dronescouttracker:StartTracking(drone)

-- Release all drones (e.g., on character death)
inst.components.wx78_dronescouttracker:ReleaseAllDrones()
```

## Dependencies & tags
**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity (WX-78 character). |
| `data` | table | `nil` | Stores drone save records from other shards for cross-shard persistence. |
| `drones` | table | `{}` | Map of tracked drone entities to `true`. Keys are drone entity references. |
| `onstarttrackingfn` | function | `nil` | Callback hook fired when a drone starts being tracked. Signature: `fn(owner, drone)`. Set via `SetOnStartTrackingFn()`. |
| `onstoptrackingfn` | function | `nil` | Callback hook fired when a drone stops being tracked. Signature: `fn(owner, drone)`. Set via `SetOnStopTrackingFn()`. |

## Main functions
### `SetOnStartTrackingFn(fn)`
*   **Description:** Registers a callback function to be invoked when a drone begins tracking. The callback receives the owner entity and the drone entity as arguments.
*   **Parameters:** `fn` -- function to call on tracking start, or `nil` to clear.
*   **Returns:** nil
*   **Error states:** None

### `SetOnStopTrackingFn(fn)`
*   **Description:** Registers a callback function to be invoked when a drone stops being tracked. The callback receives the owner entity and the drone entity as arguments.
*   **Parameters:** `fn` -- function to call on tracking stop, or `nil` to clear.
*   **Returns:** nil
*   **Error states:** None

### `StartTracking(drone)`
*   **Description:** Begins tracking a drone entity. Adds the drone to the `drones` table, registers an "onremove" event listener for automatic cleanup, calls the `onstarttrackingfn` callback if set, and pushes a "ms_dronescout_tracked" event to the drone. Does nothing if the drone is already being tracked.
*   **Parameters:** `drone` -- entity instance of the drone to track.
*   **Returns:** nil
*   **Error states:** Errors if `drone` is nil — no nil guard before `inst:ListenForEvent()` or `drone:PushEvent()` calls.

### `StopTracking(drone)`
*   **Description:** Stops tracking a drone entity. Removes the drone from the `drones` table, unregisters the "onremove" event listener, calls the `onstoptrackingfn` callback if set, and pushes a "ms_dronescout_untracked" event to the drone. Does nothing if the drone is not currently tracked.
*   **Parameters:** `drone` -- entity instance of the drone to stop tracking.
*   **Returns:** nil
*   **Error states:** None

### `ReleaseAllDrones()`
*   **Description:** Stops tracking all currently tracked drones and signals them to despawn. Iterates through all entries in `drones`, calls `StopTracking()` for each, pushes "ms_dronescout_despawn" to each drone, and clears `self.data`.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `OnRemoveEntity()`
*   **Description:** Cleanup handler called when the owning entity is removed from the world. Iterates through all tracked drones and pushes "ms_dronescout_despawn" event to each. Does not call `StopTracking()` — only notifies drones of owner removal.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `_onremovedrone(drone)` (local)
*   **Description:** Internal callback registered via `inst:ListenForEvent()` on each tracked drone. Automatically stops tracking when a drone is removed from the world by calling `self:StopTracking(drone)`.
*   **Parameters:** `drone` -- entity that was removed
*   **Returns:** nil
*   **Error states:** None

### `OnSave()`
*   **Description:** Serializes the tracker state for world save. Generates save records for drones on the current shard via `drone:GetSaveRecord()`, organizes data by shard ID, and merges with cross-shard data stored in `self.data`. Returns a table with `drones` key containing shard-organized drone records.
*   **Parameters:** None
*   **Returns:** Table with structure `{ drones = { [shardid] = { save_records... } } }`, or `nil` if no drones tracked.
*   **Error states:** None

### `OnLoad(data, newents)`
*   **Description:** Restores tracker state from world save. Iterates through saved drone records, spawns drones on the current shard via `SpawnSaveRecord()`, and starts tracking them. Stores records from other shards in `self.data` for potential future migration.
*   **Parameters:**
    - `data` -- table from `OnSave()` containing drone records
    - `newents` -- entity mapping table for save record resolution
*   **Returns:** nil
*   **Error states:** None

## Events & listeners
- **Listens to:** `onremove` (on drone entities) — triggers `_onremovedrone` callback to automatically stop tracking when a drone is removed from the world.
- **Pushes:**
  - `ms_dronescout_tracked` — fired to drone when `StartTracking()` is called. Data: owner entity.
  - `ms_dronescout_untracked` — fired to drone when `StopTracking()` is called. Data: owner entity.
  - `ms_dronescout_despawn` — fired to drone when `ReleaseAllDrones()` or `OnRemoveEntity()` is called. Data: owner entity.