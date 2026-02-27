---
id: itemstore
title: Itemstore
description: Manages a persistent store of item records, allowing items to be saved and later restored via their save data.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 630aaf8c
---

# Itemstore

## Overview
The `ItemStore` component stores item records in memory for later reconstruction, typically used by containers or systems that need to preserve item state across saves or sessions. It does not hold live entities directly but keeps serialized `item_record` data; items are spawned on demand (e.g., via `GetFirstItems`) and removed from the store. It integrates with the game’s save/load system via `OnSave` and `OnLoad`.

## Dependencies & Tags
- Depends on `SpawnPrefab` (a global utility for creating prefabs with optional skins and creators).
- Does not add or remove entity tags.
- Does not require other components to function, though it is typically attached to an entity (e.g., a storage container) via `inst:AddComponent("itemstore")`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `storeditemdatas` | `table` | `{}` | A list of item record entries; each entry is a table with `item_record` (required) and optionally `migrationdata`. |

## Main Functions

### `GetNumberOfItems()`
* **Description:** Returns the total number of item records currently stored.
* **Parameters:** None.

### `GetFirstItems(count)`
* **Description:** Retrieves and spawns the first `count` stored items as live entities, then removes them from the internal list. Spawns each item using its saved record and persistence data. Emits the `itemstore_changedcount` event after modification.
* **Parameters:**
  * `count` (`number`): The number of items to retrieve. If fewer than `count` items exist, returns as many as are available.

### `AddItem(item)`
* **Description:** Adds a live item to the store by extracting its save record, removing the item from the world, and storing the record. Emits the `itemstore_changedcount` event.
* **Parameters:**
  * `item` (`Entity`): A live item entity to be stored (it will be removed from the world after capture).

### `AddItemRecordAndMigrationData(item_record, migrationdata)`
* **Description:** Adds a raw item record (and optional migration metadata) directly to the store, without requiring a live item. Useful for deserialization or importing items. Emits the `itemstore_changedcount` event.
* **Parameters:**
  * `item_record` (`table`): A table containing prefab name, optional skin name, skin ID, and persist data—typically the output of `item:GetSaveRecord()`.
  * `migrationdata` (`table` or `nil`): Optional data used to track the origin session (e.g., for creator attribution), typically containing a `sessionid`.

### `OnSave()`
* **Description:** Returns the serializable state of the component for saving to disk. Returns `nil` if the store is empty.
* **Parameters:** None.
* **Returns:** A table of the form `{ itemdatas = self.storeditemdatas }`, or `nil`.

### `OnLoad(data)`
* **Description:** Restores the component state from saved data. Triggers the `itemstore_changedcount` event if items were loaded (i.e., if the count is non-zero).
* **Parameters:**
  * `data` (`table` or `nil`): The saved data for this component, typically from `OnSave()`. If `nil`, no action is taken.

## Events & Listeners
- Emits:
  - `"itemstore_changedcount"`: Triggered whenever the number of stored items changes (e.g., after `AddItem`, `GetFirstItems`, or `OnLoad` with non-zero items).
- Does not listen for any events (no `ListenForEvent` calls found).