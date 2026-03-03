---
id: itemstore
title: Itemstore
description: Manages a storage list of item records for an entity, supporting adding, retrieving, saving, and loading of items without persisting the actual item instances.
tags: [inventory, storage, persistence]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 630aaf8c
system_scope: inventory
---

# Itemstore

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Itemstore` is a lightweight component that stores references to items as serialized records (`item_record`) and optional migration metadata (`migrationdata`), rather than keeping the actual item instances. It is typically attached to entities (e.g., containers, special interactable objects) that need to persistently store item definitions across game sessions. The component supports saving and loading via the entity's save/load lifecycle, and notifies listeners of count changes via events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("itemstore")

-- Add an item by instance
inst.components.itemstore:AddItem(some_item)

-- Add using a pre-existing record and migration data
inst.components.itemstore:AddItemRecordAndMigrationData(record, { sessionid = "abc123" })

-- Retrieve and spawn the first 5 stored items
local items = inst.components.itemstore:GetFirstItems(5)
for _, spawned_item in ipairs(items) do
    spawned_item.Transform:SetPosition(inst.Transform:GetWorldPosition())
end

print("Remaining items:", inst.components.itemstore:GetNumberOfItems())
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `storeditemdatas` | table | `{}` | Internal list of stored item data records. Each entry is a table with `item_record` (required) and optional `migrationdata`. |

## Main functions
### `GetNumberOfItems()`
* **Description:** Returns the total number of stored item records.
* **Parameters:** None.
* **Returns:** `number` — count of items currently stored.

### `GetFirstItems(count)`
* **Description:** Spawns the first `count` stored items, removes them from storage, and returns a list of the spawned item instances. This function modifies the store by draining the oldest entries.
* **Parameters:** `count` (number) — number of items to retrieve and spawn.
* **Returns:** `table` — array of spawned item instances (may contain fewer than `count` items if storage has fewer).
* **Error states:** If `count` exceeds available items, only the existing items are spawned; the remaining entries are adjusted accordingly. No error is thrown.

### `AddItem(item)`
* **Description:** Serializes the given item instance, adds its record to storage, and removes the item from the world.
* **Parameters:** `item` (Entity) — the item instance to store.
* **Returns:** Nothing.

### `AddItemRecordAndMigrationData(item_record, migrationdata)`
* **Description:** Adds a pre-existing item record (typically from save data or copy) directly to storage, optionally including migration/session metadata.
* **Parameters:**  
  * `item_record` (table) — save record from `item:GetSaveRecord()`, containing at least `prefab`, `skinname`, `skin_id`, and `data`.  
  * `migrationdata` (table?) — optional metadata (e.g., `{ sessionid = ... }`) used during item reconstruction. May be `nil`.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Called during entity save to serialize stored items. Returns `nil` if no items are stored.
* **Parameters:** None.
* **Returns:** `table?` — save data table `{ itemdatas = storeditemdatas }`, or `nil` if empty.

### `OnLoad(data)`
* **Description:** Called during entity load to restore stored items from saved data.
* **Parameters:** `data` (table?) — the saved data table (expected to contain `itemdatas`). May be `nil`.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `itemstore_changedcount` — fired whenever an item is added or retrieved (i.e., after `AddItem`, `AddItemRecordAndMigrationData`, and `GetFirstItems`). Used to update UI or other dependent systems.
