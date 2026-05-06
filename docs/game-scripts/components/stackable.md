---
id: stackable
title: Stackable
description: Manages item stacking behavior for inventory entities, allowing multiple instances of the same prefab to combine into a single stack.
tags: [inventory, stacking, items]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: c8c81185
system_scope: inventory
---

# Stackable

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Stackable` enables inventory items to combine into stacks, reducing inventory clutter and improving performance. It tracks the current stack size, enforces maximum stack limits, and handles property dilution (perish time, moisture, chill, charge) when items are merged. The component integrates with the replica system for network synchronization and pushes `stacksizechange` events when the stack count changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("stackable")
inst:AddComponent("inventoryitem")

-- Check if item can stack with another
if inst.components.stackable:CanStackWith(other_item) then
    inst.components.stackable:Put(other_item, source_pos)
end

-- Remove items from stack
local removed = inst.components.stackable:Get(5)

-- Query stack state
print(inst.components.stackable:StackSize())
print(inst.components.stackable:IsFull())
```

## Dependencies & tags
**External dependencies:**
- `TUNING.STACK_SIZE_MEDITEM` -- default maximum stack size constant

**Components used:**
- `perishable` -- dilutes perish time when stacking via `Dilute()`
- `inventoryitem` -- dilutes moisture via `DiluteMoisture()`, inherits owner on destack
- `edible` -- dilutes chill temperature via `DiluteChill()`
- `curseditem` -- copies cursed fields via `CopyCursedFields()`
- `rechargeable` -- copies charge state via `SetCharge()`, `SetChargeTime()`
- `stackable_replica` -- syncs stack size and max size to clients

**Tags:**
- `applied_curse` -- copied to destacked items if source has this tag

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stacksize` | number | `1` | Current number of items in the stack. Assignment fires `onstacksize` watcher. |
| `maxsize` | number | `TUNING.STACK_SIZE_MEDITEM` | Maximum items allowed in stack. Assignment fires `onmaxsize` watcher. |
| `originalmaxsize` | number | `nil` | Stores original maxsize when infinite stacking is enabled. Read-only via `makereadonly`. |
| `ondestack` | function | `nil` | Callback fired when items are removed from stack via `Get()`. Signature: `fn(instance, original_inst)`. |

## Main functions

### `SetIgnoreMaxSize(ignoremaxsize)`
*   **Description:** Toggles infinite stacking mode. When enabled, `maxsize` is set to `math.huge` and the original value is stored in `originalmaxsize`. When disabled, restores the original maxsize.
*   **Parameters:** `ignoremaxsize` -- boolean to enable or disable infinite stacking
*   **Returns:** nil
*   **Error states:** None

### `IsStack()`
*   **Description:** Returns true if the entity represents multiple items combined (stacksize greater than 1).
*   **Parameters:** None
*   **Returns:** boolean
*   **Error states:** None

### `StackSize()`
*   **Description:** Returns the current number of items in the stack.
*   **Parameters:** None
*   **Returns:** number
*   **Error states:** None

### `IsFull()`
*   **Description:** Returns true if the stack has reached its maximum capacity.
*   **Parameters:** None
*   **Returns:** boolean
*   **Error states:** None

### `IsOverStacked()`
*   **Description:** Returns true if the stacksize exceeds the original maxsize (possible when infinite stacking was previously enabled).
*   **Parameters:** None
*   **Returns:** boolean
*   **Error states:** None

### `CanStackWith(item)`
*   **Description:** Checks if another item can be stacked with this one. Validates prefab match, skin match, and custom `stackable_CanStackWithFn` hook.
*   **Parameters:** `item` -- entity instance to check
*   **Returns:** boolean
*   **Error states:** Errors if `item` has no `prefab` field (nil dereference on `item.prefab` — no guard present).

### `OnSave()`
*   **Description:** Returns save data if stacksize is not 1. Used by the world save system.
*   **Parameters:** None
*   **Returns:** Table `{stack = number}` or `nil` if stacksize is 1
*   **Error states:** None

### `OnLoad(data)`
*   **Description:** Restores stacksize from save data. Clamps to `MAXUINT` and pushes `stacksizechange` event.
*   **Parameters:** `data` -- save table with `stack` field
*   **Returns:** nil
*   **Error states:** None

### `SetOnDeStack(fn)`
*   **Description:** Sets the callback function fired when items are removed from the stack via `Get()`.
*   **Parameters:** `fn` -- callback function with signature `fn(instance, original_inst)`
*   **Returns:** nil
*   **Error states:** None

### `SetStackSize(sz)`
*   **Description:** Sets the stack size directly, clamped to `MAXUINT`. Pushes `stacksizechange` event with old and new sizes.
*   **Parameters:** `sz` -- number of items in stack
*   **Returns:** nil
*   **Error states:** None

### `Get(num)`
*   **Description:** Removes `num` items from the stack. If stacksize > num, spawns a new prefab instance with the removed count and copies component state (perishable, curseditem, rechargeable, inventoryitem). If `stacksize <= num`, returns self.
*   **Parameters:** `num` -- number of items to remove (default `1`)
*   **Returns:** New entity instance (if partial stack removed) or `self` (if entire stack taken)
*   **Error states:** None

### `RoomLeft()`
*   **Description:** Returns the number of additional items that can be added to the stack before reaching maxsize.
*   **Parameters:** None
*   **Returns:** number
*   **Error states:** None

### `Put(item, source_pos)`
*   **Description:** Adds another item's stack to this one. Dilutes perishable, moisture, and chill properties. If the combined total exceeds maxsize, the overflow remains on the source item and is returned. Pushes `stacksizechange` event.
*   **Parameters:**
    - `item` -- entity instance to add
    - `source_pos` -- vector position for source tracking (used internally)
*   **Returns:** The source `item` if overflow occurred, otherwise `nil`
*   **Error states:** Errors with assert if `item == self` (stacking on self is invalid). Errors if `item.components.stackable` is nil (no guard before accessing `item.components.stackable.stacksize`).

### `GetDebugString()`
*   **Description:** Returns a formatted string showing current stacksize, maxsize, and originalmaxsize (if set). Displays `--` for infinite maxsize.
*   **Parameters:** None
*   **Returns:** string
*   **Error states:** None

## Events & listeners
- **Pushes:** `stacksizechange` — fired when stack size changes. Data: `{stacksize = number, oldstacksize = number, src_pos = vector | nil}`