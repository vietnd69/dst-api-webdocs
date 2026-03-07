---
id: stackable_replica
title: Stackable Replica
description: Manages networked stack size, max size, and preview stack size state for items that can be stacked in inventories.
tags: [inventory, network, ui]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8ecf01ef
system_scope: inventory
---

# Stackable Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Stackable` is a client-side replica component that synchronizes and exposes stack size information for inventory items. It works in tandem with the server-side `stackable` component (not shown) to maintain consistent stack size state across the network. It supports preview stack sizes (e.g., for drag-and-drop UI previews), configurable max sizes via size classes (tiny, small, medium, large, pellet), and a configurable ignore-max-size flag.

## Usage example
```lua
-- Client-side usage (e.g., in UI code)
local stackable = inst.replica.stackable
if stackable then
    local current = stackable:StackSize()
    local max = stackable:MaxSize()
    stackable:SetPreviewStackSize(5, "drag", 1.5)
end
```

## Dependencies & tags
**Components used:** None (self-contained replica component).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `SetStackSize(stacksize)`
*   **Description:** Sets the authoritative stack size. Handles encoding values above 64 across two networked fields (`_stacksize` and `_stacksizeupper`). Values are clamped to 1-based indexing (internal representation is 0-based).
*   **Parameters:** `stacksize` (number) - the desired stack count (1 or higher).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `stacksize` is non-numeric or invalid; silently caps large values.

### `SetPreviewStackSize(stacksize, context, timeout)`
*   **Description:** Sets a temporary stack size preview (e.g., for drag-preview) on the client. Only effective on non-master simulation (i.e., clients). Allows multiple contexts (e.g., `"drag"`, `"merge"`) to coexist.
*   **Parameters:** 
    *   `stacksize` (number) - the preview stack count.
    *   `context` (string) - identifier for the preview source.
    *   `timeout` (number, optional) - seconds before preview auto-clears; defaults to `2`.
*   **Returns:** Nothing.

### `ClearPreviewStackSize()`
*   **Description:** Clears all preview stack sizes and cancels pending timeout tasks.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetPreviewStackSize()`
*   **Description:** Returns the preview stack size for the current preview context (`inst.stackable_preview_context`), if set.
*   **Parameters:** None.
*   **Returns:** (number, nil) - the preview stack size or `nil` if no preview is active.

### `SetMaxSize(maxsize)`
*   **Description:** Sets the max stack size using a predefined size class (e.g., `TUNING.STACK_SIZE_SMALLITEM`). Maps from size value to internal code index.
*   **Parameters:** `maxsize` (number) - one of the `TUNING.STACK_SIZE_*` constants.
*   **Returns:** Nothing.

### `SetIgnoreMaxSize(ignoremaxsize)`
*   **Description:** Enables or disables ignoring the max size limit (e.g., for special items like bulk drop items).
*   **Parameters:** `ignoremaxsize` (boolean).
*   **Returns:** Nothing.

### `StackSize()`
*   **Description:** Returns the current effective stack size, prioritizing preview values.
*   **Parameters:** None.
*   **Returns:** number - current stack size (1 or more).

### `MaxSize()`
*   **Description:** Returns the current max stack size, respecting the `ignoremaxsize` flag.
*   **Parameters:** None.
*   **Returns:** number - maximum stack size, or `math.huge` if `ignoremaxsize` is true.

### `OriginalMaxSize()`
*   **Description:** Returns the base max stack size as configured by `SetMaxSize`, ignoring the `ignoremaxsize` flag.
*   **Parameters:** None.
*   **Returns:** number - base maximum stack size.

### `IsStack()`
*   **Description:** Checks if the item is currently stacked (more than one).
*   **Parameters:** None.
*   **Returns:** boolean - `true` if `StackSize() > 1`.

### `IsFull()`
*   **Description:** Checks if the stack is at or beyond its current max size.
*   **Parameters:** None.
*   **Returns:** boolean - `true` if `StackSize() >= MaxSize()`.

### `IsOverStacked()`
*   **Description:** Checks if the stack exceeds the original (non-ignored) max size.
*   **Parameters:** None.
*   **Returns:** boolean - `true` if `StackSize() > OriginalMaxSize()`.

## Events & listeners
- **Listens to:** `stacksizedirty` - triggers `OnStackSizeDirty`, which clears preview stack size and pushes `inventoryitem_stacksizedirty` for downstream UI updates.
- **Pushes:** `inventoryitem_stacksizedirty` - fired to notify that the stack size has been updated (e.g., for inventory UI refresh).
