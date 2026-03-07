---
id: prophider
title: Prophider
description: Manages temporary visibility toggling of an entity using a placeholder prop, with optional callbacks and scheduled re-emergence logic.
tags: [visibility, prop, scheduling, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a8c98956
system_scope: entity
---

# Prophider

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PropHider` enables an entity to temporarily hide itself by removing it from the scene and replacing it with a generated prop object (e.g., a rock, bush, or decoration). When the entity is ready to reappear, the prop is removed and the entity returns to the scene. It supports configurable hide durations with random variance, a retry counter (for multi-stage hides), and multiple optional callback functions for custom logic at each stage (hide, unhide, prop creation, visibility change). The component also handles save/load state, awake/sleep synchronization, and provides a debug string.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("prophider")

-- Optional: set custom behavior callbacks
inst.components.prophider:SetPropCreationFn(function(e)
    return SpawnPrefab("rock")
end)
inst.components.prophider:SetOnHideFn(function(e)
    print("Entity hidden")
end)
inst.components.prophider:SetOnUnhideFn(function(e, target)
    print("Entity revealed; target was", target)
end)

-- Hide for default duration, with default counter of 10
inst.components.prophider:HideWithProp()

-- Manually trigger reveal (e.g., when triggered by player interaction)
inst.components.prophider:ShowFromProp()
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Checks `valid` on props via `prop:IsValid()`; no tags added/removed directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hideupdate_duration` | number | `6` | Base duration (seconds) used for scheduled re-emergence. |
| `hideupdate_variance` | number | `1` | Random variance (±1 second) applied to hide duration. |
| `propcreationfn` | function\|nil | `nil` | Callback that creates the prop object when hiding. |
| `onvisiblefn` | function\|nil | `nil` | Called when the entity becomes fully visible again. |
| `willunhidefn` | function\|nil | `nil` | Called before unhide; returns a `target` (any) or `nil`. If non-`nil`, triggers full reveal + `onunhidefn`. |
| `onunhidefn` | function\|nil | `nil` | Called after full unhide (only when `willunhidefn` returns non-`nil`). |
| `onhidefn` | function\|nil | `nil` | Called immediately after hiding (after `RemoveFromScene`). |
| `prop` | entity\|nil | `nil` | Reference to the generated prop during hide state. |
| `counter` | number\|nil | `nil` | Number of remaining hide cycles before full reveal. |
| `hiding` | boolean\|nil | `nil` | `true` if currently hidden; `nil` otherwise. |
| `hide_task` | task\|nil | `nil` | Pending scheduled task to attempt unhide. |

## Main functions
### `SetPropCreationFn(fn)`
* **Description:** Sets the callback function used to create the replacement prop when hiding. The function receives the hidden entity instance as argument and should return a valid prefab instance.
* **Parameters:** `fn` (function\|nil) — callback with signature `fn(inst: Entity) -> prop: Entity?`.
* **Returns:** Nothing.

### `SetOnVisibleFn(fn)`
* **Description:** Sets the callback invoked when the entity finishes becoming fully visible again (i.e., after `ShowFromProp` completes).
* **Parameters:** `fn` (function\|nil) — callback with signature `fn(inst: Entity)`.
* **Returns:** Nothing.

### `SetWillUnhideFn(fn)`
* **Description:** Sets the callback invoked before attempting to unhide. Return `nil` to keep hiding (and decrement `counter`), or return a non-`nil` value to trigger immediate full reveal and invoke `onunhidefn`.
* **Parameters:** `fn` (function\|nil) — callback with signature `fn(inst: Entity) -> target: any?`.
* **Returns:** Nothing.

### `SetOnUnhideFn(fn)`
* **Description:** Sets the callback invoked only when a full unhide occurs (i.e., `willunhidefn` returned non-`nil`). Does not run if unhide is deferred via counter decrement.
* **Parameters:** `fn` (function\|nil) — callback with signature `fn(inst: Entity, target: any)`.
* **Returns:** Nothing.

### `SetOnHideFn(fn)`
* **Description:** Sets the callback invoked immediately after the entity is removed from the scene and a prop is (optionally) created.
* **Parameters:** `fn` (function\|nil) — callback with signature `fn(inst: Entity)`.
* **Returns:** Nothing.

### `GenerateHideTime()`
* **Description:** Computes a randomized hide duration in seconds, based on `hideupdate_duration` and `hideupdate_variance`.
* **Parameters:** None.
* **Returns:** number — hide duration = `duration + variance * (random * 2 - 1)`.
* **Error states:** None.

### `ClearHideTask()`
* **Description:** Cancels any pending scheduled unhide task (`hide_task`) and clears the reference.
* **Parameters:** None.
* **Returns:** Nothing.

### `HideWithProp(duration, counter)`
* **Description:** Hides the entity by removing it from the scene and (optionally) spawning a prop. Schedules a reappear attempt after `duration`. Uses `counter` to allow multi-stage hides (re-hide until `counter` reaches `1`).
* **Parameters:**  
  `duration` (number\|nil) — hide interval in seconds. If `nil`, uses `GenerateHideTime`.  
  `counter` (number\|nil) — number of times to re-hide before final reveal. If `nil`, defaults to `10`.
* **Returns:** Nothing.
* **Error states:** No-op if already hiding (`hiding == true`). Does nothing if `prop` is invalid during cleanup; only invalidates it internally.

### `ShowFromProp()`
* **Description:** Immediately reveals the entity (returns to scene), triggers `onvisiblefn`, sends `propreveal` event to the current prop (if valid), and clears state (`prop`, `hiding`, `counter`, `hide_task`).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if not currently hiding (`hiding ~= true`).

### `OnEntityWake()`
* **Description:** Restarts the scheduled unhide task if the entity was hidden and no task was pending (e.g., after waking from sleep).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the component's hide state for saving.
* **Parameters:** None.
* **Returns:** table\|nil — returns `{ hiding = true, counter = counter }` if `hiding == true`; otherwise `nil`.

### `OnLoad(data)`
* **Description:** Restores state from save data. If `data` indicates the entity was hidden (either `data.hiding` or `data.hidetime` is present), calls `HideWithProp` with saved `counter` and default duration.
* **Parameters:** `data` (table\|nil) — data returned by `OnSave` or legacy format (`hidetime`).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted debug string for debugging visibility state.
* **Parameters:** None.
* **Returns:** string — e.g., `"Counters: 3, Time for counter: 2.1"`.

## Events & listeners
- **Listens to:** None identified (component uses `DoTaskInTime` internally but does not register events with `inst:ListenForEvent`).
- **Pushes:** None identified (component calls `prop:PushEvent("propreveal", self.inst)` if `prop` is valid, but this is entity-to-entity, not a `inst:PushEvent` from this component).
