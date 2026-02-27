---
id: stackable
title: Stackable
description: Manages stackable item behavior, including size limits, stacking logic, and persistence across game saves.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 7599da8c
---

# Stackable

## Overview
The `Stackable` component enables an entity to represent a stack of identical items rather than a single instance. It tracks the current stack size and maximum stack capacity, handles stacking operations (combining stacks or splitting them), and synchronizes these values with the networked replica system. It also manages state such as infinite max size toggling and interacts with other components (e.g., `perishable`, `inventoryitem`, `curseditem`, `rechargeable`, `edible`) during stack operations.

## Dependencies & Tags
- **Requires**:
  - `inst.replica.stackable`: For networked replication of `stacksize` and `maxsize`.
  - `inst.replica.inventoryitem`: Used to set pickup position when stack size changes (if the `inventoryitem` replica exists).
- **Events Emitted**:
  - `stacksizechange` (see Events & Listeners).
- **No tags** are explicitly added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stacksize` | `number` | `1` | Current number of items in the stack. |
| `maxsize` | `number` | `TUNING.STACK_SIZE_MEDITEM` | Maximum allowed stack size (can be overridden to `math.huge` via `SetIgnoreMaxSize`). |
| `originalmaxsize` | `number?` | `nil` | Stores the non-infinite max size when `SetIgnoreMaxSize(true)` is active. Read-only after initialization. |

## Main Functions
### `SetIgnoreMaxSize(ignoremaxsize)`
* **Description:** Temporarily sets `maxsize` to infinity (`math.huge`) to allow stacking beyond normal limits (e.g., for debugging or special mechanics). When disabled, restores the original max size.
* **Parameters:**
  - `ignoremaxsize` (`boolean`): If `true`, ignore max size limits; if `false`, restore the original limit.

### `IsStack()`
* **Description:** Returns `true` if the stack contains more than one item.
* **Parameters:** None.

### `StackSize()`
* **Description:** Returns the current stack size.
* **Parameters:** None.

### `IsFull()`
* **Description:** Returns `true` if the current stack size meets or exceeds the current `maxsize`.
* **Parameters:** None.

### `IsOverStacked()`
* **Description:** Returns `true` if the current stack size exceeds the *original* (non-infinite) max size—used to detect oversized stacks when `SetIgnoreMaxSize(true)` was active.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns stack data to be persisted if `stacksize` is not `1`; otherwise returns `nil`.
* **Parameters:** None.
* **Returns:** `table?` — e.g., `{ stack = 5 }` if stack size is 5.

### `OnLoad(data)`
* **Description:** Loads stack size from saved data (clamped to `MAXUINT`), and broadcasts a `stacksizechange` event.
* **Parameters:**
  - `data` (`table?`): Contains the `stack` key with the saved stack size.

### `SetOnDeStack(fn)`
* **Description:** Registers a callback function to be invoked when the stack is split via `Get()`.
* **Parameters:**
  - `fn` (`function`): Callback signature: `fn(new_instance, original_instance)`.

### `SetStackSize(sz)`
* **Description:** Directly sets the stack size, clamped to `MAXUINT`, and emits a `stacksizechange` event.
* **Parameters:**
  - `sz` (`number`): Desired stack size.

### `Get(num)`
* **Description:** Splits off `num` items (default `1`) from the stack, creating a new instance. Updates relevant child components (e.g., perishable, cursed, rechargeable) on the new instance.
* **Parameters:**
  - `num` (`number?`): Number of items to extract.
* **Returns:** `entity?` — The new instance if extraction occurred; otherwise, `self.inst` (if no split happened).

### `RoomLeft()`
* **Description:** Returns how many more items can be added before reaching `maxsize`.
* **Parameters:** None.
* **Returns:** `number` — Positive value indicating remaining capacity.

### `Put(item, source_pos)`
* **Description:** Attempts to merge `item` (another stackable entity) into this stack. Updates perishability, moisture, and other derived properties. May return the remainder `item` if the stack overflows.
* **Parameters:**
  - `item` (`Entity`): The stackable item to merge.
  - `source_pos` (`Vector3?`): Position of the item being added (used for inventory pickup sync).
* **Returns:** `Entity?` — The remainder item if not fully consumed, or `nil`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string (e.g., `"5/10"` or `"12/--(10)"` for infinite mode).
* **Parameters:** None.
* **Returns:** `string`.

## Events & Listeners
- **Events Emitted:**
  - `stacksizechange` — Pushed when stack size changes (e.g., via `SetStackSize`, `OnLoad`, `Get`, or `Put`). Event data includes:
    - `stacksize` (`number`): New stack size.
    - `oldstacksize` (`number`): Previous stack size.
    - `src_pos` (`Vector3?`, optional): Source position for `Put` operations.
- **No `inst:ListenForEvent` calls** — This component does not listen for external events.