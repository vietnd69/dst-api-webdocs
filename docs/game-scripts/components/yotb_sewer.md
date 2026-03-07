---
id: yotb_sewer
title: Yotb Sewer
description: Manages the sewing animation and recipe processing pipeline for a sewer-based crafting station, including task scheduling, inventory handling, and save/load synchronization.
tags: [crafting, inventory, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: crafting
source_hash: 55b197aa
system_scope: crafting
---

# YotB Sewer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`YOTB_Sewer` is a component that handles the sewing workflow for a custom crafting station. It monitors container state for readiness, starts sewing tasks upon user request, validates ingredient combinations via `yotb_sewing.lua`, and manages the outcome (product spawn or rejection drop). It integrates tightly with the `container` component for inventory handling and integrates DST's task system (`DoTaskInTime`) and serialization system (`OnSave`/`OnLoad`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("container")
inst:AddComponent("yotb_sewer")

inst.components.yotb_sewer.onstartsewing = function(entity)
    print("Sewing started on", entity:GetDebugName())
end

inst.components.yotb_sewer.ondonesewing = function(entity)
    print("Sewing completed!")
end

-- Fill container with items to trigger "readytosew" tag
-- Then call:
inst.components.yotb_sewer:StartSewing(player)
```

## Dependencies & tags
**Components used:** `container` (for slot checking, closing, destroying contents, and dropping), `physics` (for product velocity), `transform` (for position), `yotb_sewing` (via `sewing.IsRecipeValid`, `sewing.CalculateRecipe`)
**Tags:** Adds `readytosew` (when container is full and closed); removes `readytosew` on open, item removal, or cleanup.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this component is attached to. |
| `done` | `boolean?` | `nil` | `true` after sewing/rejection completes; `nil` when active or uninitialized. |
| `targettime` | `number?` | `nil` | Absolute game time when the sewing task completes (from `GetTime()`). |
| `task` | `Task?` | `nil` | The scheduled `DoTaskInTime` task handle. |
| `product` | `string?` | `nil` | Prefab name of the成品 item to spawn on success. |
| `product_spoilage` | `number?` | `nil` | Spoilage amount for the product (currently unused; TODO comment suggests pending implementation). |
| `spoiledproduct` | `string` | `"spoiled_food"` | Prefab name to use if spoilage logic is added later. |
| `spoiltime` | `number?` | `nil` | Spoilage duration (currently unused). |
| `ingredient_prefabs` | `table?` | `nil` | List of prefab names from container slots during start. |
| `onstartsewing` | `function?` | `nil` | Optional callback fired when sewing begins. |
| `ondonesewing` | `function?` | `nil` | Optional callback fired when sewing finishes (success or rejection). |
| `oncontinuedone` | `function?` | `nil` | Callback fired when resuming a completed job from save data. |
| `oncontinuesewing` | `function?` | `nil` | Callback fired when resuming an in-progress job from save data. |

## Main functions
### `IsDone()`
*   **Description:** Returns whether the current sewing job has finished (product spawned or rejection completed).
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if `self.done` is truthy; otherwise `false`.
*   **Error states:** None.

### `IsSewing()`
*   **Description:** Returns whether a sewing job is currently active.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if `self.done` is `nil` and `self.targettime` is set; otherwise `false`.
*   **Error states:** None.

### `GetTimeToSew()`
*   **Description:** Returns remaining time (in seconds) until the sewing job completes.
*   **Parameters:** None.
*   **Returns:** `number` – Seconds remaining (≥ 0), or 0 if not sewing or done.
*   **Error states:** Returns 0 if `self.targettime` is `nil`.

### `CanSew()`
*   **Description:** Checks whether the container is valid and full, indicating readiness to begin sewing.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if `container` exists and `container:IsFull()` is `true`.
*   **Error states:** Returns `false` if no container or container not full.

### `StartSewing(doer)`
*   **Description:** Initiates a sewing job. Validates ingredients via `yotb_sewing.lua`, schedules the task, destroys container contents, and closes the container.
*   **Parameters:** `doer` (`Entity?`) – The entity triggering the action (not currently used beyond context).
*   **Returns:** Nothing.
*   **Error states:** Returns early if `self.targettime` is already set (no-op on re-entry).

### `StopSewing(reason)`
*   **Description:** Cancels an active sewing task, optionally spawning a product on fire-related termination, and resets internal state.
*   **Parameters:** `reason` (`string?`) – Currently only `"fire"` triggers a fallback product spawn.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnSave()`
*   **Description:** Serializes state for world save. Includes current progress, product, and remaining time.
*   **Parameters:** None.
*   **Returns:** `table` – JSON-compatible table with keys: `done`, `product`, `remainingtime`, `ingredient_prefabs`.
*   **Error states:** `remainingtime` omitted if ≤ 0.

### `OnLoad(data)`
*   **Description:** Restores state from save data and re-schedules task if needed.
*   **Parameters:** `data` (`table`) – Save data as returned by `OnSave()`.
*   **Returns:** Nothing.
*   **Error states:** Does not re-validate recipe; assumes original ingredients and recipe remain valid.

### `GetDebugString()`
*   **Description:** Returns a human-readable status string for debugging UI.
*   **Parameters:** None.
*   **Returns:** `string` – Format: `"<product> STATUS timetosew: XX.XX"`.
*   **Error states:** Status is `"SEWING"`, `"FULL"` (done), or `"EMPTY"`.

### `LongUpdate(dt)`
*   **Description:** Adjusts `targettime` in response to game slowdown (e.g., pause), preserving task scheduling integrity.
*   **Parameters:** `dt` (`number`) – Delta time since last update.
*   **Returns:** Nothing.
*   **Error states:** Advances task immediately if `targettime <= GetTime()`.

## Events & listeners
- **Listens to:** `itemget` – Re-checks readiness to add `readytosew` tag when an item is inserted.
- **Listens to:** `onclose` – Re-checks readiness to add `readytosew` tag after closing.
- **Listens to:** `itemlose` – Removes `readytosew` tag when an item is removed.
- **Listens to:** `onopen` – Removes `readytosew` tag when opened.
- **Pushes:** None directly; uses `inst:PushEvent("onclose", ...)` via `container:Close(...)`.
