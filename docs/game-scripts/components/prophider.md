---
id: prophider
title: Prophider
description: Manages timed hiding and reappearing behavior for an entity by replacing it with a temporary prop.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: a8c98956
---

# Prophider

## Overview
The `PropHider` component implements a timed hide-and-replace mechanism: when triggered, it removes the entity from the world and replaces it with a temporary prop, scheduling a reappear task after a randomized duration. It supports configurable hide durations, repeatable cycles (via counter), and optional callbacks at key stages (hide, unhide, reveal). It is typically used for entities that should temporarily vanish (e.g., traps, hidden items, illusions).

## Dependencies & Tags
- **Component Usage**: Relies on `inst:DoTaskInTime(...)` for delayed tasks, and expects `inst:RemoveFromScene()`, `inst:ReturnToScene()`, and `inst:IsValid()` to exist.
- **Tags**: None added/removed.
- **Tasks**: Manages a single task (`hide_task`) that is cancelled on removal or sleep.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hideupdate_duration` | `number` | `6` | Base duration (seconds) before the entity reappears. |
| `hideupdate_variance` | `number` | `1` | Maximum deviation from `hideupdate_duration`; actual time = `duration + variance * (random * 2 - 1)`. |
| `propcreationfn` | `function?` | `nil` | Optional callback to create the temporary prop (takes `inst` as argument). |
| `onvisiblefn` | `function?` | `nil` | Callback triggered when the entity becomes visible again. |
| `willunhidefn` | `function?` | `nil` | Callback invoked before reappearing; if it returns a non-`nil` target, `ShowFromProp` is called immediately. |
| `onunhidefn` | `function?` | `nil` | Callback triggered *only* when `willunhidefn` returns a valid target (i.e., early unhide). |
| `onhidefn` | `function?` | `nil` | Callback triggered immediately upon hiding. |
| `prop` | `GObj?` | `nil` | Reference to the temporary prop object (if any). |
| `counter` | `number?` | `nil` | Number of times the entity should cycle through hide/reappear logic before permanent visibility. |
| `hiding` | `boolean?` | `nil` | Internal state flag indicating if the entity is currently hidden. |
| `hide_task` | `Task?` | `nil` | Reference to the scheduled task that triggers reappearing. |

## Main Functions

### `SetPropCreationFn(fn)`
* **Description:** Sets the callback function used to generate the temporary prop when hiding. The function receives the entity instance (`inst`) as an argument and should return a valid prop entity or `nil`.
* **Parameters:** `fn` — A function `(inst: Entity) -> GObj?`.

### `SetOnVisibleFn(fn)`
* **Description:** Sets the callback triggered when the entity successfully reappears (`ShowFromProp` completes).
* **Parameters:** `fn` — A function `(inst: Entity) -> ()`.

### `SetWillUnhideFn(fn)`
* **Description:** Sets the callback invoked *before* reappearing. If it returns a non-`nil` value (e.g., a target), the entity reappears immediately; otherwise, the scheduled task proceeds.
* **Parameters:** `fn` — A function `(inst: Entity) -> any?`.

### `SetOnUnhideFn(fn)`
* **Description:** Sets the callback triggered *only* if `willunhidefn` returns a non-`nil` result (early unhide). It is *not* called during normal scheduled reappearances.
* **Parameters:** `fn` — A function `(inst: Entity, target: any) -> ()`.

### `SetOnHideFn(fn)`
* **Description:** Sets the callback triggered immediately after the entity is hidden and the prop is created.
* **Parameters:** `fn` — A function `(inst: Entity) -> ()`.

### `GenerateHideTime()`
* **Description:** Computes the randomized hide duration using the formula: `hideupdate_duration + hideupdate_variance * (random() * 2 - 1)`.
* **Returns:** `number` — The randomized duration in seconds.

### `ClearHideTask()`
* **Description:** Cancels the current hide task (`hide_task`) if it exists, and sets `hide_task` to `nil`. Prevents duplicate or orphaned tasks.
* **Parameters:** None.

### `HideWithProp(duration, counter)`
* **Description:** Initiates the hiding process. Removes the entity from the scene, replaces it with a prop (if `propcreationfn` is set), and schedules a reappear task. Updates internal state and fires `onhidefn`.
* **Parameters:**
  - `duration` (`number?`) — Optional override for hide duration. If omitted, uses `GenerateHideTime()`.
  - `counter` (`number?`) — Optional override for the number of times the hide/unhide cycle may repeat. Defaults to `10` if omitted.

### `ShowFromProp()`
* **Description:** Restores the entity to the scene, cancels scheduled tasks, notifies of visibility via `onvisiblefn`, and signals the prop (if any) via `"propreveal"` event. Clears the prop reference.
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Reschedules the hide task if the entity wakes up while still hidden and no task is pending (e.g., after server reconnection or sleep-mode wake).
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns a minimal state table containing `hiding = true` and `counter` if the entity is currently hidden, otherwise `nil`.
* **Returns:** `table?` — `{ hiding = true, counter = counter }` or `nil`.

### `OnLoad(data)`
* **Description:** Restores hiding state on load. If `data.hiding` or `data.hidetime` (legacy) is present, it re-applies `HideWithProp` using saved `counter`.
* **Parameters:** `data` (`table?`) — Save data loaded from disk.

### `GetDebugString()`
* **Description:** Returns a debug string for inspecting current state (e.g., remaining counter and task time).
* **Returns:** `string` — e.g., `"Counters: 5, Time for counter: 2.3"`.

## Events & Listeners
- Listens to no `ListenForEvent` events directly.
- Pushes the `"propreveal"` event on the `prop` entity (if valid) when `ShowFromProp` is called.
- Calls `willunhidefn(self.inst)` internally to allow custom unhide triggers.