---
id: shelf
title: Shelf
description: Manages the state and interactions of a shelf entity that holds and allows taking of items.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: cc6c2bb2
---

# Shelf

## Overview
This component manages a shelf's item content and availability for interaction: it tracks an item placed on the shelf, controls whether the item can be taken (via `cantakeitem`), provides callbacks for item placement and removal, and handles the logic for giving or dropping the item to a taker.

## Dependencies & Tags
- **Dependencies**: Relies on `inst.components.inventory` being present on the same entity for item operations (drop/give).
- **Tags**: Adds the `"takeshelfitem"` tag when an item is present *and* `cantakeitem` is true. Removes the tag in all other cases or when the component is removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity this component is attached to. |
| `cantakeitemfn` | `function?` | `nil` | Optional test function (not directly used internally but implied to validate item taking). |
| `itemonshelf` | `PrefabInstance?` | `nil` | The item currently placed on the shelf. |
| `onitemtakenfn` | `function?` | `nil` | Callback for when an item is taken. (⚠️ *Note*: In source, this property name is assigned as `ontakeitemfn` in setter—see usage. This may be a typo in original code.*) |
| `cantakeitem` | `boolean` | `false` | Flag indicating whether items on the shelf can currently be taken. |
| `onshelfitemfn` | `function?` | `nil` | Callback invoked when an item is placed on the shelf. |
| `ontakeitemfn` | `function?` | `nil` | Callback invoked when an item is taken from the shelf. |
| `takeitemtstfn` | `function?` | `nil` | Optional test function to validate if a specific taker can take the item. |

## Main Functions

### `PutItemOnShelf(item)`
* **Description:** Places an item on the shelf. Sets `itemonshelf` and invokes the optional `onshelfitemfn` callback. Automatically updates the `"takeshelfitem"` tag based on current state.
* **Parameters:**
  - `item`: The item entity to place on the shelf.

### `TakeItem(taker)`
* **Description:** Attempts to take the current item from the shelf and transfer it to the taker. Validates that an item is present and `cantakeitem` is true. Optionally runs `takeitemtstfn`, then triggers `ontakeitemfn`, and finally moves the item via inventory logic (give to taker or drop to world).
* **Parameters:**
  - `taker`: The entity attempting to take the item (can be `nil`).
  * **Note:** If `taker` has an inventory, the item is given. Otherwise, the item is dropped from the shelf's inventory slot. If validation fails (e.g., `takeitemtstfn` returns false), the operation aborts.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string describing the current item on the shelf and whether it is takeable.
* **Parameters:** None.

### `SetOnShelfItem(fn)`
* **Description:** Sets the callback function invoked when an item is placed on the shelf.
* **Parameters:**
  - `fn`: Function `(shelf_inst, item) -> void`.

### `SetOnTakeItem(fn)`
* **Description:** Sets the callback function invoked when an item is taken from the shelf.
* **Parameters:**
  - `fn`: Function `(shelf_inst, taker, item) -> void`.

### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when the component is removed. Ensures the `"takeshelfitem"` tag is removed.

## Events & Listeners
- Listens for changes to `cantakeitem` and `itemonshelf` properties via the shared `ontakeshelfitem` handler (triggered via metatable `__newindex`), which updates the `"takeshelfitem"` tag accordingly.  
- **No explicit `inst:ListenForEvent` or `inst:PushEvent` calls are present in the source.**