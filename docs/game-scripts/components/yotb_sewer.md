---
id: yotb_sewer
title: Yotb Sewer
description: Manages the sewing workflow for a container-based crafting station, including recipe validation, task scheduling, and persistence across saves/load.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: crafting
source_hash: 55b197aa
---

# Yotb Sewer

## Overview
The `YOTB_Sewer` component implements the core logic for a sewer-based sewing station. It handles verifying sewable recipes, scheduling crafting tasks, managing state transitions (empty → sewing → done/rejected), persisting state across saves/load, and controlling container behavior (e.g., locking during operation).

## Dependencies & Tags
- **Component Dependencies:** `container`
- **Tags Added/Removed:** 
  - Adds tag `"readytosew"` when container is full and closed.
  - Removes tag `"readytosew"` on opening, item loss, or removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | Reference to the owning entity. |
| `done` | `boolean` or `nil` | `nil` | Indicates if a sewing task has completed (true), is in progress (nil), or hasn't started (nil). |
| `targettime` | `number` (Unix timestamp) or `nil` | `nil` | Timestamp when the current sewing task should finish. |
| `task` | `SimTask` or `nil` | `nil` | Task handle for the scheduled sewing/rejection callback. |
| `product` | `string` (prefab name) or `nil` | `nil` | Name of the prefab to spawn on successful sewing. |
| `product_spoilage` | `number` | `nil` | Not used in current implementation. |
| `spoiledproduct` | `string` | `"spoiled_food"` | Prefab name used if recipe is invalid (rejection path). |
| `spoiltime` | `number` | `nil` | Not used in current implementation. |
| `ingredient_prefabs` | `table` of strings | `{}` | List of item prefabs inserted into the container before sewing starts. |

## Main Functions

### `IsDone()`
* **Description:** Returns `true` if a sewing task has completed (either successfully or rejected).
* **Parameters:** None.

### `IsSewing()`
* **Description:** Returns `true` if a sewing task is currently in progress (has started but not yet completed).
* **Parameters:** None.

### `GetTimeToSew()`
* **Description:** Returns the remaining time (in seconds) until the current sewing task finishes. Returns `0` if not sewing or completed.
* **Parameters:** None.

### `CanSew()`
* **Description:** Returns `true` if the entity's container exists and is full — meaning it *could* begin a sewing task.
* **Parameters:** None.

### `StartSewing(doer)`
* **Description:** Initiates the sewing process. Validates the ingredients, schedules a task, destroys container contents, locks the container, and removes the `"readytosew"` tag. If the recipe is invalid, schedules a "rejection" (drops all items); otherwise, spawns the product.
* **Parameters:**
  * `doer` (*Entity* or `nil*): The entity initiating the sewing. Not used internally but kept for API consistency.

### `StopSewing(reason)`
* **Description:** Cancels the active sewing task, resets state variables, and optionally spawns the product if stopped due to fire.
* **Parameters:**
  * `reason` (*string*): Reason for stopping (currently only `"fire"` has special behavior — spawns the product at the station).

### `OnSave()`
* **Description:** Serializes relevant state (product, progress, ingredients) for saving to disk. Includes remaining time, product prefab, and ingredient list.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the sewing state from saved data. Re-schedules the pending task with remaining time or calls appropriate callbacks (`oncontinuedone`, `oncontinuesewing`) as needed.
* **Parameters:**
  * `data` (*table*): Saved state table from `OnSave()`.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string describing the current state: product name, status (SEWING/FULL/EMPTY), and time to sew.
* **Parameters:** None.

### `LongUpdate(dt)`
* **Description:** Adjusts task timing for world time changes (e.g., season transitions or server lag). Recalculates task schedule and re-submits the callback if sewing is in progress.
* **Parameters:**
  * `dt` (*number*): Delta time to adjust for.

## Events & Listeners
- Listens for `"itemget"` → triggers `oncheckready`
- Listens for `"onclose"` → triggers `oncheckready`
- Listens for `"itemlose"` → triggers `onnotready`
- Listens for `"onopen"` → triggers `onnotready`
- Calls `inst:PushEvent("ondonesewing")` via `self.ondonesewing` callback (if defined) upon task completion.