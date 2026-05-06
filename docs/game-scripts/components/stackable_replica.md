---
id: stackable_replica
title: Stackable Replica
description: Main component for managing item stack sizes with built-in network replication via net variables. Handles both server-side authoritative stack logic and client-side synchronization.
tags: [inventory, network, replication]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: components
source_hash: 7246bea3
system_scope: network
---

# Stackable

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`Stackable` is the main component for managing item stack sizes with built-in network replication via net variables. It handles both server-side authoritative stack logic and client-side synchronization, allowing clients to display accurate item stack counts without requiring server queries. This component also handles preview stack sizes for UI feedback during drag-and-drop operations.

## Usage example
```lua
-- Server-side: Add component and set stack size
local inst = CreateEntity("stackable_item")
inst:AddComponent("stackable")
inst.components.stackable:SetStackSize(5)
inst.components.stackable:SetMaxSize(TUNING.STACK_SIZE_MEDITEM)

-- Client-side: Access through replica system for synchronized data
local inst = ThePlayer.components.inventory:GetItemInSlot(1)
if inst and inst.replica.stackable then
    local count = inst.replica.stackable:StackSize()
    local max = inst.replica.stackable:MaxSize()
    print("Stack: " .. count .. "/" .. max)
end

-- Set preview for UI feedback (client-only)
inst.replica.stackable:SetPreviewStackSize(5, "drag_preview", 2)
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- accessed for stack size constants (STACK_SIZE_MEDITEM, etc.)

**Components used:**
- `stackable` -- server-side component referenced in `CanStackWith()` for authoritative stacking logic

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_stacksize` | net_smallbyte | `0` | Encoded lower bits of stack size (0-63 range). |
| `_stacksizeupper` | net_smallbyte | `0` | Encoded upper bits for stacks larger than 64 items. |
| `_ignoremaxsize` | net_bool | `false` | Whether the stack ignores maximum size limits. |
| `_maxsize` | net_tinybyte | `0` | Encoded maximum stack size index into STACK_SIZES table. |


## Main functions
### `SetStackSize(stacksize)`
* **Description:** Sets the current stack size with encoding to support values up to 4095. Uses `_stacksize` for values 0-63 and `_stacksizeupper` for larger values (each upper unit represents 64 items).
* **Parameters:** `stacksize` -- number, the total stack size to set (1-based count).
* **Returns:** None.
* **Error states:** None.

### `SetPreviewStackSize(stacksize, context, timeout)`
* **Description:** Sets a temporary preview stack size for UI feedback during drag operations. Client-side only. Automatically clears after timeout.
* **Parameters:**
  - `stacksize` -- number, the preview stack size to display.
  - `context` -- string, identifier for the preview source (e.g., "drag_preview").
  - `timeout` -- number, seconds before preview auto-clears (default `2`).
* **Returns:** None.
* **Error states:** None (client-side guard via `TheWorld.ismastersim` check).

### `ClearPreviewStackSize()`
* **Description:** Cancels any pending preview timeout task and clears preview stack size data.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `GetPreviewStackSize()`
* **Description:** Returns the current preview stack size for the entity's active preview context.
* **Parameters:** None.
* **Returns:** Number representing preview stack size, or `nil` if no preview is active.
* **Error states:** None.

### `SetMaxSize(maxsize)`
* **Description:** Sets the maximum stack size by encoding the value into `_maxsize`. Uses STACK_SIZE_CODES to map actual sizes to indices.
* **Parameters:** `maxsize` -- number, the maximum stack size (must match a TUNING.STACK_SIZE_* constant).
* **Returns:** None.
* **Error states:** Errors if `maxsize` is not found in STACK_SIZE_CODES (results in nil index access).

### `SetIgnoreMaxSize(ignoremaxsize)`
* **Description:** Sets whether this stack should ignore maximum size limits.
* **Parameters:** `ignoremaxsize` -- boolean, true to allow over-stacking.
* **Returns:** None.
* **Error states:** None.

### `StackSize()`
* **Description:** Returns the current effective stack size. Uses preview size if available, otherwise calculates from encoded net variables.
* **Parameters:** None.
* **Returns:** Number representing current stack size (1-based count).
* **Error states:** None.

### `MaxSize()`
* **Description:** Returns the current maximum stack size. Returns `math.huge` if ignore max size is enabled.
* **Parameters:** None.
* **Returns:** Number representing maximum stack size, or `math.huge` if ignored.
* **Error states:** None.

### `OriginalMaxSize()`
* **Description:** Returns the base maximum stack size without considering the ignore flag.
* **Parameters:** None.
* **Returns:** Number representing the configured maximum stack size.
* **Error states:** None.

### `IsStack()`
* **Description:** Checks if the entity represents a stack (more than one item).
* **Parameters:** None.
* **Returns:** Boolean, true if stack size is greater than 1.
* **Error states:** None.

### `IsFull()`
* **Description:** Checks if the stack has reached its current maximum capacity.
* **Parameters:** None.
* **Returns:** Boolean, true if stack size >= max size.
* **Error states:** None.

### `IsOverStacked()`
* **Description:** Checks if the stack exceeds the original maximum size (before ignore flag).
* **Parameters:** None.
* **Returns:** Boolean, true if stack size > original max size.
* **Error states:** None.

### `CanStackWith(item)`
* **Description:** Determines if this entity can stack with another item. On server, delegates to `stackable` component. On client, uses prefab match and anim state skin build as a hack (no skin info access on clients).
* **Parameters:** `item` -- entity instance to check stacking compatibility with.
* **Returns:** Boolean, true if items can be stacked together.
* **Error states:** None

## Events & listeners
- **Listens to:** `stacksizedirty` -- client-side only, triggers `OnStackSizeDirty` to forward event and clear preview.
- **Pushes:** `inventoryitem_stacksizedirty` -- forwarded from `stacksizedirty` to guarantee event order for inventory UI.