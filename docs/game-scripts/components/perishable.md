---
id: perishable
title: Perishable
description: Manages spoilage progress, state transitions (fresh/stale/spoiled), and lifecycle events for perishable items in response to environmental and ownership conditions.
tags: [inventory, food, time, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 2db04a72
system_scope: entity
---

# Perishable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Perishable` component tracks the remaining time until an item spoils, updating its `perishremainingtime` value over time based on environmental conditions (e.g., temperature, acid rain), ownership context (e.g., held by a player, inside a fridge), and modifiers. It manages tag changes (`fresh`, `stale`, `spoiled`) when the spoilage progress crosses defined thresholds (`TUNING.PERISH_FRESH`, `TUNING.PERISH_STALE`), and supports callbacks on spoilage and replacement. It integrates closely with components such as `inventoryitem`, `preserver`, `edible`, `moisture`, `occupier`, and `stackable`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("perishable")
inst.components.perishable:SetPerishTime(600) -- 10 minutes
inst.components.perishable:StartPerishing()
-- Later, modify spoilage dynamically:
inst.components.perishable:AddTime(120) -- add 2 minutes
inst.components.perishable:SetPercent(0.5) -- set to halfway spoiled
```

## Dependencies & tags
**Components used:** `inventoryitem`, `occupier`, `preserver`, `edible`, `moisture`, `stackable`, `rainimmunity`, `sheltered`, `inventory`, `container`.  
**Tags:** `fresh`, `stale`, `spoiled` — added/removed dynamically based on spoilage percentage; also checks `frozen`, `small_livestock`, `nocool`, `lowcool`, `pocketdimension_container`, `fridge`, `foodpreserver`, `cage`, `spoiler`, `none`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity that owns this component. |
| `perishtime` | number | `nil` | Total spoilage time in seconds (set via `SetPerishTime`). |
| `perishremainingtime` | number | `nil` | Remaining time until spoilage; may be fractional. |
| `updatetask` | `Task` | `nil` | Periodic task used to advance spoilage; `nil` when paused. |
| `localPerishMultiplyer` | number | `1` | Multiplier applied to the final spoilage rate; can be modified dynamically. |
| `frozenfiremult` | boolean | `false` | Flag that applies additional spoilage penalty when item is frozen near fire. |
| `onperishreplacement` | string (prefab name) | `nil` | Prefab to spawn when the item spoils. |
| `onreplacedfn` | function | `nil` | Callback invoked after replacement is spawned (see `Perish`). |
| `perishfn` | function | `nil` | Custom callback invoked when the item spoils. |
| `ignorewentness` | boolean | — | Not used in code (commented out); no effect. |

## Main functions
### `SetPerishTime(time)`
* **Description:** Sets the total spoilage duration for the item and initializes remaining time. Automatically starts the spoilage timer if a task is already active.
* **Parameters:** `time` (number) — total spoil time in seconds (e.g., `600` for 10 minutes).
* **Returns:** Nothing.
* **Error states:** No effect if `time <= 0`; however, the code does not enforce this explicitly.

### `StartPerishing()`
* **Description:** Begins periodic spoilage updates using a periodic task (`DoPeriodicTask`) with randomized delta to reduce synchronization artifacts.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopPerishing()`
* **Description:** Stops the spoilage update task immediately. Useful for freezing spoilage (e.g., in freezers).
* **Parameters:** None.
* **Returns:** Nothing.

### `GetPercent()`
* **Description:** Returns the current spoilage percentage as a value between `0` (fresh) and `1` (spoiled).
* **Parameters:** None.
* **Returns:** number — `0` if `perishremainingtime` or `perishtime` is invalid/unset; otherwise `perishremainingtime / perishtime`, clamped to `1`.

### `SetPercent(percent)`
* **Description:** Directly sets the current spoilage percentage, clamped to `[0, 1]`. Updates `perishremainingtime` and fires a `perishchange` event.
* **Parameters:** `percent` (number) — desired spoilage percentage (`0` to `1`).
* **Returns:** Nothing.

### `AddTime(time)`
* **Description:** Increases remaining spoilage time without exceeding `perishtime`. Useful for refreshing perishable items (e.g., with保鲜 packs).
* **Parameters:** `time` (number) — seconds to add to `perishremainingtime`.
* **Returns:** Nothing.
* **Error states:** If no update task is running (`updatetask == nil`), this function does nothing.

### `ReducePercent(amount)`
* **Description:** Decreases the spoilage percentage by the specified amount (e.g., `0.2` for 20%).
* **Parameters:** `amount` (number) — amount to subtract from current percent (`0` to `1`).
* **Returns:** Nothing.
* **Error states:** No explicit clamping on underflow; setting negative percent may occur.

### `SetLocalMultiplier(newMult)`
* **Description:** Sets a per-instance modifier to the spoilage rate (e.g., `0.5` to halve spoilage). Applied *after* all other modifiers.
* **Parameters:** `newMult` (number) — scalar multiplier.
* **Returns:** Nothing.

### `GetLocalMultiplier()`
* **Description:** Returns the current per-instance multiplier.
* **Parameters:** None.
* **Returns:** number — the `localPerishMultiplyer` value.

### `SetNewMaxPerishTime(newtime)`
* **Description:** Rescales the spoilage time while preserving current spoilage percentage (i.e., remaining time is recomputed).
* **Parameters:** `newtime` (number) — new total spoilage time in seconds.
* **Returns:** Nothing.

### `SetOnPerishFn(fn)`
* **Description:** Registers a callback function to be invoked when the item spoils.
* **Parameters:** `fn` (function) — function taking `inst` as its only argument.
* **Returns:** Nothing.

### `Dilute(number, timeleft)`
* **Description:** Adjusts remaining spoilage time when items are stacked (e.g., mixing fresh and stale food). Computed as a weighted average across the stack.
* **Parameters:**  
  `number` (number) — number of additional items being added.  
  `timeleft` (number) — spoilage time of the added items.
* **Returns:** Nothing.
* **Error states:** Only functions if `stackable` component exists. Updates `perishremainingtime` and fires `perishchange`.

### `Perish()`
* **Description:** Handles the complete spoilage event: cancels the update task, invokes `perishfn`, fires `perished` event, and spawns `onperishreplacement` if set. Moves the replacement into the same inventory slot if the original item was in a container.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsFresh()`, `IsStale()`, `IsSpoiled()`
* **Description:** Simple tag-checking helpers to determine current spoilage state.
* **Parameters:** None.
* **Returns:** boolean — `true` if the corresponding tag is present.

### `GetDebugString()`
* **Description:** Returns a human-readable status string for debugging (e.g., `"Perishing 12.34s"` or `"Paused 0.00s frozenfiremult"`).
* **Parameters:** None.
* **Returns:** string — formatted status.

### `OnSave()`, `OnLoad(data)`
* **Description:** Handles serialization and deserialization for save/load. Stores `paused` state and `perishremainingtime`.
* **Parameters:**  
  `data` (table) — table containing `paused` and `time` fields.
* **Returns (OnSave):** `{ paused = bool, time = number }`

## Events & listeners
- **Listens to:** None — the component does not register any event listeners itself. Update logic is driven by `Update()` being called periodically via `DoPeriodicTask`.
- **Pushes:**
  - `perishchange` — fired whenever `perishremainingtime` crosses a hundredth (0.01) threshold, or `SetPercent`/`Dilute`/`AddTime` are called. Payload: `{ percent = number }`.
  - `forceperishchange` — fired when tag state changes (`fresh`, `stale`, `spoiled`). No payload.
  - `perished` — fired when the item spoils.
  - `stacksizechange` — indirectly via `stackable:SetStackSize()` during replacement.
