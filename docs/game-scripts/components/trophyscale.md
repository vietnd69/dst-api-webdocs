---
id: trophyscale
title: Trophyscale
description: Manages the storage, comparison, and retrieval of item data for trophy-like entities, enabling dynamic trophy updates and item spawning based on weighted comparisons.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 4743737b
---

# Trophyscale

## Overview
The `Trophyscale` component enables an entity to act as a trophy holder by storing and updating item metadata—such as weight, prefab, and owner information—based on comparison with other weighable items. It supports conditional item replacement (only higher-weight items replace existing trophies), dynamic tag management (`trophyscale_*` and `trophycanbetaken`), and customizable post-processing hooks. It integrates with the `weighable` and `stackable` components and persists data across saves via `OnSave`/`OnLoad`.

## Dependencies & Tags
- **Requires Components:**
  - `weighable` (on items being compared and spawned)
  - `inventory` (on receiver when taking items)
- **Tags Added/Removed:**
  - Dynamically adds/removes `trophyscale_<type>` (e.g., `trophyscale_small`) based on the `type` property via the `ontype` setter.
  - Manages `trophycanbetaken` tag via `SetItemCanBeTaken`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | `string?` | `nil` | Current trophy category/type; triggers tag updates on change. |
| `item_data` | `table?` | `nil` | Stores metadata of the trophy item (weight, prefab, owner info). |
| `compare_postfn` | `function?` | `nil` | Optional callback invoked after a successful item comparison and data update. |
| `accepts_items` | `boolean` | `true` | Controls whether the trophy accepts new items (not directly used in this snippet but present in constructor). |

## Main Functions
### `GetDebugString()`
* **Description:** Returns a formatted debug string containing current trophy item metadata (weight, prefab, owner) or "empty" if no item is stored.
* **Parameters:** None.

### `SetComparePostFn(fn)`
* **Description:** Sets the optional `compare_postfn` callback used to run custom logic after a successful item comparison.
* **Parameters:**  
  - `fn (function)`: A function taking `(item_data, item_inst)` as arguments.

### `SetOnSpawnItemFromDataFn(fn)`
* **Description:** Sets the callback invoked when spawning an item from stored `item_data`.
* **Parameters:**  
  - `fn (function)`: A function taking `(spawned_item, data)` as arguments.

### `SetTakeItemTestFn(fn)`
* **Description:** (Deprecated/not used in current code.) Preserved for backwards compatibility; no effect.

### `SetOnItemTakenFn(fn)`
* **Description:** Sets the callback invoked after an item is successfully taken from the trophy.
* **Parameters:**  
  - `fn (function)`: A function taking `(trophy_inst, item_data)` as arguments.

### `GetItemData()`
* **Description:** Returns the current stored `item_data` table, or `nil` if empty.
* **Parameters:** None.

### `Compare(inst_compare, doer)`
* **Description:** Compares the weight of the given `inst_compare` entity against the stored trophy item. If the new item is heavier (or the trophy is empty), it updates `item_data`, removes the original item, triggers `onnewtrophy`, and returns `true`. Otherwise, returns `false` with reason `"trophyscale_TOOO_SMALL"`.
* **Parameters:**  
  - `inst_compare (Entity)`: The entity being tested as a new trophy (must have `weighable` component).  
  - `doer (Entity)`: The entity performing the action (e.g., player), passed in the event.

### `ClearItemData()`
* **Description:** Resets `item_data` to `nil`, effectively clearing the trophy.

### `SpawnItemFromData(override_data)`
* **Description:** Spawns and returns a new item based on stored `item_data` (or an override table), applying weight, owner info, and custom spawn logic. Returns `nil` if invalid data is provided.
* **Parameters:**  
  - `override_data (table?)`: Optional table to use instead of `item_data`.

### `SetItemCanBeTaken(can_be_taken)`
* **Description:** Adds or removes the `trophycanbetaken` tag on the trophy entity based on whether items can be taken.
* **Parameters:**  
  - `can_be_taken (boolean)`: If `true`, adds the tag; otherwise, removes it.

### `TakeItem(receiver)`
* **Description:** Spawns and gives the trophy item to the `receiver` entity (must have `inventory`), invokes the `onitemtakenfn` callback, clears `item_data`, and returns `true`. Returns `false` on failure.
* **Parameters:**  
  - `receiver (Entity)`: The entity receiving the item (must have `inventory` component).

### `OnSave()`
* **Description:** Returns `item_data` for serialization during save.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores `item_data` from loaded data.
* **Parameters:**  
  - `data (table?)`: Saved `item_data` to restore.

## Events & Listeners
- **Listens to:** None.
- **Triggers:**
  - `"onnewtrophy"` — Emitted when a new trophy item replaces the existing one (in `Compare`). Payload: `{ old = item_data_old, new = self.item_data, doer = doer }`.