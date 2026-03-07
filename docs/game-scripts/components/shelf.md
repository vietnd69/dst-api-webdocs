---
id: shelf
title: Shelf
description: Manages items stored on a shelf entity, including item placement, retrieval, and accessibility state.
tags: [inventory, storage, interaction]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cc6c2bb2
system_scope: inventory
---
# Shelf

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shelf` is a storage component that holds a single item on a shelf entity. It manages the item’s placement and retrieval logic, including ownership transfer to a taker via their `inventory` component or dropping to the world if no valid taker exists. The component dynamically updates the `"takeshelfitem"` tag on its host entity to indicate whether the item can currently be taken, based on internal state and callbacks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shelf")
inst.components.shelf:PutItemOnShelf(someitem)
inst.components.shelf:SetOnTakeItem(function(shelfinst, taker, item)
    print("Item taken by " .. taker:GetDebugName())
end)
inst.components.shelf.cantakeitem = true
```

## Dependencies & tags
**Components used:** `inventory` (to remove/drop items), `inventoryitem` (via `inventory` calls), `transform` (position/positioning)
**Tags:** Adds `"takeshelfitem"` when `cantakeitem` is `true` and `itemonshelf` is non-`nil`; removes it otherwise (via `ontakeshelfitem` callback).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance the component is attached to. |
| `cantakeitem` | boolean | `false` | Controls whether the held item can be taken. Also influences `"takeshelfitem"` tag. |
| `itemonshelf` | `Entity?` | `nil` | The item currently stored on the shelf. |
| `cantakeitemfn` | function? | `nil` | (Deprecated/unused) Previously intended for dynamic `cantakeitem` evaluation. |
| `onshelfitemfn` | function? | `nil` | Callback invoked when an item is placed on the shelf. |
| `ontakeitemfn` | function? | `nil` | Callback invoked when an item is taken from the shelf. |
| `takeitemtstfn` | function? | `nil` | Optional test function; if present, must return `true` for item retrieval to proceed. |

## Main functions
### `SetOnShelfItem(fn)`
*   **Description:** Sets the callback function to be invoked when an item is placed on the shelf.
*   **Parameters:** `fn` (function) — takes `(shelf_inst, item)` as arguments.
*   **Returns:** Nothing.

### `SetOnTakeItem(fn)`
*   **Description:** Sets the callback function to be invoked when an item is taken from the shelf.
*   **Parameters:** `fn` (function) — takes `(shelf_inst, taker, item)` as arguments.
*   **Returns:** Nothing.

### `PutItemOnShelf(item)`
*   **Description:** Places an item on the shelf, triggering the `onshelfitemfn` callback if defined.
*   **Parameters:** `item` (`Entity` with `components.inventoryitem`) — the item to store.
*   **Returns:** Nothing.

### `TakeItem(taker)`
*   **Description:** Removes the item from the shelf and transfers it to the taker (via their `inventory`) or drops it in the world if no taker or inventory exists.
*   **Parameters:** `taker` (`Entity?`) — the entity attempting to take the item.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `cantakeitem` is `false`, `itemonshelf` is `nil`, or if `takeitemtstfn` exists and returns `false`.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string describing the current state of the shelf.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"rock: Can be taken"` or `"rock: Cannot be taken"` if an item is present; `""` otherwise.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup method called when the component is removed from its entity; ensures `"takeshelfitem"` tag is removed.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `ListenForEvent` calls).
- **Pushes:** None directly (relies on `inventory` component events during `GiveItem`/`DropItem`).
