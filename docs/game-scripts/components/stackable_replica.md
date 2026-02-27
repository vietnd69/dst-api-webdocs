---
id: stackable_replica
title: Stackable Replica
description: Manages network-synchronized stack size, maximum stack limit, and preview logic for network-replicated entities.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 8ecf01ef
---

# Stackable Replica

## Overview
This component implements network-aware replica logic for item stack properties—such as current stack size, maximum stack limit, and ignore-max-size flag—on replicated entities (e.g., items in the world or inventory). It enables synchronized stack state across server and clients, including support for preview (transient) stack size updates used during UI interactions like drag-and-drop or crafting previews.

## Dependencies & Tags
- Relies on network netvars: `_stacksize`, `_stacksizeupper`, `_ignoremaxsize`, `_maxsize`.
- Adds `stacksizedirty` event to the instance when `SetStackSize` or `SetMaxSize` modifies state on master.
- Listens to `stacksizedirty` event on clients to trigger `inventoryitem_stacksizedirty` (on the instance) for correct ordering.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_stacksize` | `net_smallbyte` | `0` | Lower 8 bits of stack size (0–63). Represents `stacksize - 1 mod 64`. |
| `_stacksizeupper` | `net_smallbyte` | `0` | Upper 8 bits of stack size (0–63). Represents `floor((stacksize - 1) / 64)`. |
| `_ignoremaxsize` | `net_bool` | `false` | If true, treats `MaxSize()` as infinite. |
| `_maxsize` | `net_tinybyte` | `1` (maps to `TUNING.STACK_SIZE_MEDITEM`) | Encoded index (0–3) into `STACK_SIZES` table. |

*Note:* `TheWorld.ismastersim` checks determine whether the client applies preview logic. No public fields are exposed outside the `Stackable` class instance; all members use Lua’s `_` naming convention to denote internal use.

## Main Functions

### `SetStackSize(stacksize)`
* **Description:** Sets the stack size to the given value (1-based). Handles splitting into lower/upper 8-bit network variables for large stacks (up to 4095).
* **Parameters:**  
  - `stacksize` *(number)*: The desired stack count (must be ≥ 1). Internally decremented to 0-based representation for netvar storage.

### `SetPreviewStackSize(stacksize, context, timeout)`
* **Description:** Sets a temporary, context-specific preview stack size on the client. Used for UI feedback (e.g., dragging an item to see how many fit). Does not affect real stack size or sync to server.
* **Parameters:**  
  - `stacksize` *(number)*: Preview stack count.  
  - `context` *(string or hash)*: Unique identifier for the operation (e.g., `"drag"`, `"craft"`), allowing multiple contexts to coexist (later calls overwrite earlier ones).  
  - `timeout` *(number, optional)*: Seconds until preview expires (default: `2`). A task cancels preview if not renewed.

### `ClearPreviewStackSize()`
* **Description:** Immediately clears any active preview stack size and cancels the preview timeout task.

### `GetPreviewStackSize()`
* **Description:** Returns the current preview stack size for the active `inst.stackable_preview_context` if set, otherwise `nil`.
* **Returns:** `number?` — The preview stack size or `nil`.

### `SetMaxSize(maxsize)`
* **Description:** Sets the maximum stack size allowed for this item, encoded as an index into `STACK_SIZES`.
* **Parameters:**  
  - `maxsize` *(number)*: One of the predefined values from `STACK_SIZES` (e.g., `TUNING.STACK_SIZE_SMALLITEM`). Must match an existing tuning constant.

### `SetIgnoreMaxSize(ignoremaxsize)`
* **Description:** Enables or disables enforcement of the maximum stack size.
* **Parameters:**  
  - `ignoremaxsize` *(boolean)*: If `true`, `MaxSize()` returns `math.huge`.

### `StackSize()`
* **Description:** Returns the current effective stack size, factoring in preview size if present.
* **Returns:** `number` — Actual stack count.

### `MaxSize()`
* **Description:** Returns the effective maximum stack size. If `ignoremaxsize` is true, returns `math.huge`; otherwise, returns the configured `STACK_SIZES[...]` value.
* **Returns:** `number` — Maximum allowed stack count.

### `OriginalMaxSize()`
* **Description:** Returns the configured maximum stack size *without* considering `ignoremaxsize`. Always returns a value from `STACK_SIZES`.
* **Returns:** `number` — Base maximum stack size.

### `IsStack()`
* **Description:** Checks whether the item is currently in a stacked configuration (i.e., more than one item).
* **Returns:** `boolean` — `true` if `StackSize() > 1`.

### `IsFull()`
* **Description:** Checks whether the stack is at or above its effective maximum capacity.
* **Returns:** `boolean` — `true` if `StackSize() >= MaxSize()`.

### `IsOverStacked()`
* **Description:** Checks whether the stack exceeds its original (base) maximum size. Useful for detecting invalid states.
* **Returns:** `boolean` — `true` if `StackSize() > OriginalMaxSize()`.

## Events & Listeners
- **Listens to:**
  - `stacksizedirty` (client-only): Triggers `OnStackSizeDirty`, which clears preview stack size and pushes `inventoryitem_stacksizedirty` on the instance to ensure consistent ordering.
- **Triggers:**
  - `stacksizedirty` (server-only): Automatically dispatched via netvar updates (e.g., `self._stacksize:set(...)`) when `SetStackSize` or `SetMaxSize` modifies state.
  - `inventoryitem_stacksizedirty`: Manually dispatched by `OnStackSizeDirty` to signal stack size changes to other components (e.g., inventory UI).