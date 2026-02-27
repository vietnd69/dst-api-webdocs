---
id: perishable
title: Perishable
description: Manages food spoilage progression, decay logic, and tag-based freshness states (fresh/stale/spoiled) for entities.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2db04a72
---

# Perishable

## Overview
This component implements the logic for food spoilage in *Don't Starve Together*, tracking remaining freshness time, applying environmental and situational decay modifiers (e.g., temperature, refrigeration, wetness, acid rain), updating freshness tags (`fresh`, `stale`, `spoiled`), and triggering spoilage behavior (including on-perish replacement logic). It integrates with the ECS `Update` loop via a periodic task.

## Dependencies & Tags
- **Component Dependencies:** None explicitly added in `_ctor`; however, the component assumes existence of:
  - `inst.components.edible` (used conditionally for temperature regulation)
  - `inst.components.stackable` (used in `Dilute`, `Perish`, and `OnLoad`)
  - `inst.components.inventoryitem` (for owner and container slot retrieval)
  - `inst.components.occupier` (optional, to determine owner when item is held/occupied)
- **Tags Managed:** `fresh`, `stale`, `spoiled` — removed and added dynamically based on spoilage percentage.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity. |
| `perishfn` | `function` | `nil` | Callback invoked when item spoils. |
| `frozenfiremult` | `boolean` | `false` | If `true`, applies extra decay multiplier for frozen items near fire. |
| `perishtime` | `number` | `nil` | Total base spoilage time (seconds). Initialized via constructor parameter or `SetPerishTime`. |
| `perishremainingtime` | `number` | `nil` | Remaining spoilage time (seconds). Updated dynamically during decay. |
| `updatetask` | `Task` | `nil` | Periodic update task managing decay; `nil` when paused/stopped. |
| `start_dt` | `number` | `nil` | Delay before first decay tick in `StartPerishing`. |
| `localPerishMultiplyer` | `number` | `1` | Custom decay multiplier for mod-specific logic. |
| `onperishreplacement` | `string` | `nil` | Prefab name to spawn on spoilage. |

## Main Functions

### `Update(inst, dt)`
* **Description:** Core decay handler. Computes effective decay rate based on environment (temperature, rain), container (fridge, preserver), owner traits (spoiler, preserver), item state (wetness, frozen), and multipliers. Advances `perishremainingtime`, triggers `perishchange` events, chill-hot foods, and calls `Perish()` when expired.  
* **Parameters:**
  - `inst`: The entity owning the component.
  - `dt`: Time delta; may be overridden by `start_dt` or cached `start_dt`.

### `IsFresh()`
* **Description:** Returns `true` if the entity has the `fresh` tag.
* **Parameters:** None.

### `IsStale()`
* **Description:** Returns `true` if the entity has the `stale` tag.
* **Parameters:** None.

### `IsSpoiled()`
* **Description:** Returns `true` if the entity has the `spoiled` tag.
* **Parameters:** None.

### `Dilute(number, timeleft)`
* **Description:** Adjusts spoilage time for stacked items (e.g., combining partial items). Only functional if `stackable` component exists. Recalculates `perishremainingtime` as a weighted average and triggers `perishchange`.
* **Parameters:**
  - `number`: Stack size of the added item.
  - `timeleft`: Remaining spoilage time of the added item.

### `AddTime(time)`
* **Description:** Adds time to `perishremainingtime`, capping at `perishtime`. Triggers `perishchange` event if the displayed percent changes.
* **Parameters:**
  - `time`: Seconds to add.

### `SetPerishTime(time)`
* **Description:** Sets both `perishtime` and `perishremainingtime` to `time`. Automatically restarts perishing if a task is already running.
* **Parameters:**
  - `time`: Total spoilage time in seconds.

### `SetLocalMultiplier(newMult)`
* **Description:** Sets `localPerishMultiplyer`, allowing mods to globally scale spoilage rate for this item.
* **Parameters:**
  - `newMult`: Multiplier (e.g., `0.5` for half decay rate).

### `GetLocalMultiplier()`
* **Description:** Returns current `localPerishMultiplyer`.
* **Parameters:** None.

### `SetNewMaxPerishTime(newtime)`
* **Description:** Updates `perishtime` while preserving current spoilage percentage by recalculating `perishremainingtime`.
* **Parameters:**
  - `newtime`: New total spoilage time in seconds.

### `SetOnPerishFn(fn)`
* **Description:** Assigns the callback function to execute upon spoilage.
* **Parameters:**
  - `fn`: A function that accepts the entity (`inst`) as its sole argument.

### `GetPercent()`
* **Description:** Returns spoilage percentage (`0.0–1.0`), calculated as `perishremainingtime / perishtime`. Returns `0` if invalid.
* **Parameters:** None.

### `SetPercent(percent)`
* **Description:** Sets `perishremainingtime` based on `perishtime` and a percentage. Clamps `percent` between `0` and `1`. Restarts perishing if active.
* **Parameters:**
  - `percent`: Spoilage percentage (`0.0–1.0`).

### `ReducePercent(amount)`
* **Description:** Decreases spoilage percentage by `amount`.
* **Parameters:**
  - `amount`: Value subtracted from current percent (e.g., `0.1` for 10% faster spoilage).

### `GetDebugString()`
* **Description:** Returns human-readable debug info (e.g., `"Perishing 120.00s"` or `"perished"`), including `frozenfiremult` status.
* **Parameters:** None.

### `LongUpdate(dt)`
* **Description:** Handles decay during long tick intervals (e.g., world sleep). Uses `GetTaskRemaining` to preserve decay precision across tick gaps.
* **Parameters:**
  - `dt`: Delta time.

### `StartPerishing()`
* **Description:** Begins or restarts the spoilage decay task (`Update`). Cancels any existing task first.
* **Parameters:** None.

### `IsPerishing()`
* **Description:** Returns `true` if perishing is active (i.e., `updatetask` is not `nil`).
* **Parameters:** None.

### `Perish()`
* **Description:** Handles spoilage logic: cancels decay task, runs `perishfn`, pushes `"perished"` event, and optionally replaces the item with `onperishreplacement` prefab. Handles stack size and inventory slot preservation.
* **Parameters:** None.

### `StopPerishing()`
* **Description:** Cancels the decay task without spoiling the item (pauses spoilage).
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns serialization table with `paused` status and `perishremainingtime`. (Note: The function body currently has a `return` statement after `return {}`, making it nonfunctional—likely a typo in the source.)
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Loads saved state (`data.time`, `data.paused`) and restores perishing state accordingly.
* **Parameters:**
  - `data`: Table containing `time` (number) and `paused` (boolean) fields.

## Events & Listeners
- **Pushes Events:**
  - `"forceperishchange"` — When freshness tags change (`fresh`/`stale`/`spoiled`).
  - `"perishchange"` — When `perishremainingtime` changes enough to alter the displayed percentage (checked every ~1% via `math.floor` comparison).
  - `"perished"` — When spoilage completes.
- **No `inst:ListenForEvent` calls are present.**