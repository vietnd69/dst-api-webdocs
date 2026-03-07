---
id: storage_robotbrain
title: Storage Robotbrain
description: Manages the decision-making logic for storage robots to pick up, store, and return items based on inventory state and fuel levels.
tags: [ai, inventory, brain, storage, automation]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 66d76533
---

# Storage Robotbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `StorageRobotBrain` component implements the behavior tree for storage robots (`storage_robot`, `winona_storage_robot`), enabling autonomous item handling in the game world. It orchestrates the robot’s actions using a priority-based behavior tree to prioritize picking up items, storing them in appropriate containers, and returning to its spawn point when fuel is low. It relies heavily on shared utility functions from `StorageRobotCommon` and integrates with `Inventory`, `Fueled`, and `Stackable` components to make decisions about item handling. The component ensures only one robot attempts to interact with a specific item at a time via a global `ignorethese` registry, preventing race conditions.

## Usage example

```lua
local robot = SpawnPrefab("storage_robot")
if robot ~= nil then
    robot:AddComponent("storage_robot_brain")
    -- The brain automatically initializes behavior on spawn via OnInitializationComplete
    -- and begins executing behavior tree actions immediately.
end
```

## Dependencies & tags
**Components used:**
- `fueled` — accessed via `inst.components.fueled:GetPercent()` to check fuel levels.
- `inventory` — accessed via `inst.components.inventory:GetActiveItem()`, `GetFirstItemInAnySlot()`, and `DropItem()`.
- `stackable` — accessed via `item.components.stackable:IsFull()` to determine if stacks can accept more items.

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_targetitem` | `Entity` or `nil` | `nil` | Internal reference to the item currently being ignored by this robot to prevent duplication of pickup attempts. |
| `_targetitem_event_onputininventory` | `function` or `nil` | `nil` | Event callback registered on `_targetitem` to clear the ignore state when the item is placed into an inventory. |
| `ignorethese` (global) | `table` | `{}` | Shared registry mapping each ignored item to the robot instance currently attempting to pick it up. Used to prevent multiple robots from targeting the same item concurrently. |

## Main functions
### `StorageRobotBrain:IgnoreItem(item)`
* **Description:** Registers the given `item` as ignored for this robot’s pickup logic, preventing duplicate attempts by other robots. Also sets up a one-time listener to unignore the item if it is later placed into an inventory.
* **Parameters:**
  - `item` (`Entity`) — The item entity to mark as ignored.
* **Returns:** None.
* **Error states:** None. Overwrites any previously ignored item by first calling `UnignoreItem()`.

### `StorageRobotBrain:UnignoreItem()`
* **Description:** Clears the current `_targetitem` ignore state, removing the global registry entry and detaching the event listener if present.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** If `_targetitem` is invalid or nil, the function is safe and does nothing.

### `StorageRobotBrain:ShouldIgnoreItem(item)`
* **Description:** Determines whether this robot should avoid interacting with a given `item` because another robot is already handling it.
* **Parameters:**
  - `item` (`Entity`) — The item to check.
* **Returns:** `boolean` — Returns `true` if another robot is currently processing `item`; otherwise `false`.
* **Error states:** None.

### `StorageRobotBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) for the robot. The behavior tree has a root priority node that executes actions in order: *Pick Up Item*, *Store Item*, *Return to spawn*, and a background *Sleep Mode* behavior. Actions are skipped if the robot is `busy` or `broken`, or when fuel is critically low (and near spawn point).
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `StorageRobotBrain:OnStop()`
* **Description:** Cleans up the ignore state by calling `UnignoreItem()` to prevent stale entries in `ignorethese`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `StorageRobotBrain:OnInitializationComplete()`
* **Description:** Notifies `StorageRobotCommon` to finalize the robot’s spawn point initialization (e.g., recording its initial position for return navigation).
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `PickUpAction(inst)`
* **Description:** Helper function used by the behavior tree’s *Pick Up Item* action. Attempts to locate an appropriate item using `StorageRobotCommon.FindItemToPickupAndStore()` and returns a `BufferedAction` to pick it up. If the robot is full (active item exists and stack is full) or fuel is critically low near its spawn point, the action returns `nil`.
* **Parameters:**
  - `inst` (`Entity`) — The robot entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if no item is available, if the active inventory slot is occupied by a full stack, or if low fuel is detected near the spawn point.

### `StoreItemAction(inst)`
* **Description:** Helper function for the *Store Item* action. Finds a container that can accept the robot’s first non-full stack and returns a `BufferedAction` to store it. Calls `UnignoreItem()` to release any previously ignored item.
* **Parameters:**
  - `inst` (`Entity`) — The robot entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if the robot has no items in inventory, or if no suitable container is found.

### `GoHomeAction(inst)`
* **Description:** Helper for the *Return to spawn* action. Drops any held items if present, and attempts to move the robot back to its spawn point. Returns a `BufferedAction` to walk to the spawn point. Includes a min-dist check to avoid infinite looping.
* **Parameters:**
  - `inst` (`Entity`) — The robot entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if no spawn point is defined. May return early (without action) if robot is already close enough (`< 0.25` world units) to the spawn point.

## Events & listeners
- **Listens to:**
  - `"onputininventory"` — Attached temporarily to the `_targetitem` when `IgnoreItem()` is called. Triggers `_targetitem_event_onputininventory`, which in turn calls `UnignoreItem()` to clear the ignore state.
- **Pushes:**
  - `"sleepmode"` — Fired when the robot enters low-fuel sleep mode after waiting for 6 seconds (or immediately if fuel remains critically low).