---
id: container_classified
title: Container Classified
description: Defines a hidden entity that manages client-side prediction and UI synchronization for container inventories.
tags: [inventory, network, ui, client, prediction]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 47a47ae5
system_scope: inventory
---

# Container Classified

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`container_classified` is a hidden prefab entity attached to container replicas to handle client-side inventory prediction and UI state synchronization. It is not spawned directly by modders; instead, it is instantiated automatically by the network replication system when a container is observed by a client. This entity maintains a local preview of item slots (`_itemspreview`) while waiting for server authority updates, ensuring responsive inventory interactions. It exposes methods for querying slot contents, modifying stack sizes locally, and syncing actions to the server via RPC.

## Usage example
```lua
-- Access via a container's replica classified data (Client side)
local container = inst.replica.container
if container and container.classified then
    local classified = container.classified
    local item = classified:GetItemInSlot(1)
    local has_wood = classified:Has("logs", 1)
    
    -- Check if the container is currently busy syncing
    if not classified:IsBusy() then
        classified:ReceiveItem(some_item, 1)
    end
end
```

## Dependencies & tags
**External dependencies:**
- `containers` -- Used for `MAXITEMSLOTS` constant and slot initialization.

**Components used:**
- `constructionbuilderuidata` -- Accessed on `ThePlayer` to determine construction ingredient slots during item moves.
- `inventory` -- Replica accessed for active item queries and stack size synchronization.
- `container` -- Replica accessed for slot acceptance logic and overflow handling.
- `stackable` -- Replica accessed for stack size, max size, and stacking compatibility checks.

**Tags:**
- `CLASSIFIED` -- Added to the entity to identify it as a network classified data holder.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `infinitestacksize` | `net_bool` | `false` | Network variable indicating if the container allows infinite stacking. |
| `readonlycontainer` | `net_bool` | `false` | Network variable indicating if the container is read-only. |
| `_items` | `table` | `{}` | Array of `net_entity` variables representing the authoritative item slots. |
| `_itemspool` | `table` | `{}` | Pool of unused `net_entity` variables for slot resizing. |
| `_slottasks` | `table` | `nil` | Map of pending tasks for specific slot dirty events. |
| `_refreshtask` | `task` | `nil` | Scheduled task reference for debouncing UI refreshes. |
| `_busy` | `boolean` | `true` | Flag indicating if the classified data is currently processing a sync. |
| `_itemspreview` | `table` | `nil` | Temporary table holding proxy items during client prediction before server sync. |
| `_parent` | `entity` | `nil` | Reference to the parent container entity that owns this classified instance. |

## Main functions
### `InitializeSlots(numslots)`
* **Description:** Resizes the `_items` array to match `numslots`. Moves entities between `_items` and `_itemspool` to adjust capacity.
* **Parameters:** `numslots` -- target number of slots.
* **Returns:** None.
* **Error states:** Errors if `inst._slottasks` is not nil (cannot re-initialize after listeners are registered).

### `SetSlotItem(slot, item, src_pos)`
* **Description:** Server-side function. Sets the item in a specific slot and serializes usage data if valid.
* **Parameters:**
  - `slot` -- integer slot index.
  - `item` -- entity instance or nil.
  - `src_pos` -- vector position for pickup serialization.
* **Returns:** None.
* **Error states:** None.

### `IsHolding(item, checkcontainer)`
* **Description:** Checks if the container holds `item`, optionally checking nested containers.
* **Parameters:**
  - `item` -- entity instance to check.
  - `checkcontainer` -- boolean to recurse into contained inventories.
* **Returns:** `true` if holding, `false` otherwise.
* **Error states:** None.

### `GetItemInSlot(slot)`
* **Description:** Returns the item entity in the specified slot. Uses preview data if available.
* **Parameters:** `slot` -- integer slot index.
* **Returns:** Entity instance or `nil`.
* **Error states:** None.

### `GetItems()`
* **Description:** Returns a table of all items currently in the container.
* **Parameters:** None.
* **Returns:** Table of entity instances.
* **Error states:** None.

### `IsEmpty()`
* **Description:** Checks if all slots are empty.
* **Parameters:** None.
* **Returns:** `true` if empty, `false` otherwise.
* **Error states:** None.

### `IsFull()`
* **Description:** Checks if all slots are occupied.
* **Parameters:** None.
* **Returns:** `true` if full, `false` otherwise.
* **Error states:** None.

### `Has(prefab, amount, iscrafting)`
* **Description:** Checks if the container has at least `amount` of `prefab`. Optionally excludes items tagged `nocrafting`.
* **Parameters:**
  - `prefab` -- string prefab name.
  - `amount` -- number required.
  - `iscrafting` -- boolean to filter crafting-usable items.
* **Returns:** `boolean` (has enough), `number` (actual count found).
* **Error states:** None.

### `HasItemWithTag(tag, amount)`
* **Description:** Checks if the container has items with a specific tag totaling `amount`.
* **Parameters:**
  - `tag` -- string tag name.
  - `amount` -- number required.
* **Returns:** `boolean` (has enough), `number` (actual count found).
* **Error states:** None.

### `FindItem(fn)`
* **Description:** Iterates items and returns the first one matching the predicate function `fn`.
* **Parameters:** `fn` -- function(item) returning boolean.
* **Returns:** Entity instance or `nil`.
* **Error states:** None.

### `ReceiveItem(item, count, forceslot)`
* **Description:** Attempts to add `item` to the container locally. Handles stacking and slot finding. Returns remainder if not all could be accepted. Silently returns without action if `forceslot` is out of bounds (guard condition present in source).
* **Parameters:**
  - `item` -- entity instance.
  - `count` -- number of items to add (optional).
  - `forceslot` -- specific slot index (optional).
* **Returns:** Number of items remaining (0 if fully accepted).
* **Error states:** None

### `ConsumeByName(prefab, amount)`
* **Description:** Removes items matching `prefab` from the container up to `amount`. Used for local prediction of crafting costs.
* **Parameters:**
  - `prefab` -- string prefab name.
  - `amount` -- number to remove.
* **Returns:** None.
* **Error states:** None.

### `TakeActionItem(item, slot)`
* **Description:** Removes a specific item from a slot locally.
* **Parameters:**
  - `item` -- entity instance.
  - `slot` -- integer slot index.
* **Returns:** None.
* **Error states:** None.

### `IsBusy()`
* **Description:** Checks if the classified instance is currently processing a refresh or lacks a parent.
* **Parameters:** None.
* **Returns:** `true` if busy, `false` otherwise.
* **Error states:** None.

### `ReturnActiveItemToSlot(slot)`
* **Description:** Moves the player's active item back into the specified slot if valid.
* **Parameters:** `slot` -- integer slot index.
* **Returns:** None.
* **Error states:** None.

### `PutOneOfActiveItemInSlot(slot)`
* **Description:** Moves one unit of the active item into the specified slot and syncs to server.
* **Parameters:** `slot` -- integer slot index.
* **Returns:** None.
* **Error states:** None.

### `PutAllOfActiveItemInSlot(slot)`
* **Description:** Moves the entire active item stack into the specified slot and syncs to server.
* **Parameters:** `slot` -- integer slot index.
* **Returns:** None.
* **Error states:** None.

### `TakeActiveItemFromHalfOfSlot(slot)`
* **Description:** Takes half of a stack from the slot into the active item hand.
* **Parameters:** `slot` -- integer slot index.
* **Returns:** None.
* **Error states:** None.

### `TakeActiveItemFromCountOfSlot(slot, count)`
* **Description:** Takes a specific count from the slot into the active item hand.
* **Parameters:**
  - `slot` -- integer slot index.
  - `count` -- number of items to take.
* **Returns:** None.
* **Error states:** None.

### `TakeActiveItemFromAllOfSlot(slot)`
* **Description:** Takes the entire stack from the slot into the active item hand.
* **Parameters:** `slot` -- integer slot index.
* **Returns:** None.
* **Error states:** None.

### `AddOneOfActiveItemToSlot(slot)`
* **Description:** Adds one unit from the active item to the existing stack in the slot.
* **Parameters:** `slot` -- integer slot index.
* **Returns:** None.
* **Error states:** None.

### `AddAllOfActiveItemToSlot(slot)`
* **Description:** Adds the entire active item stack to the existing stack in the slot.
* **Parameters:** `slot` -- integer slot index.
* **Returns:** None.
* **Error states:** None.

### `SwapActiveItemWithSlot(slot)`
* **Description:** Swaps the active item with the item in the slot.
* **Parameters:** `slot` -- integer slot index.
* **Returns:** None.
* **Error states:** None.

### `SwapOneOfActiveItemWithSlot(slot)`
* **Description:** Swaps one unit of the active item with the item in the slot.
* **Parameters:** `slot` -- integer slot index.
* **Returns:** None.
* **Error states:** None.

### `MoveItemFromAllOfSlot(slot, container)`
* **Description:** Moves the entire stack from the slot to another container.
* **Parameters:**
  - `slot` -- integer slot index.
  - `container` -- target container entity.
* **Returns:** None.
* **Error states:** None.

### `MoveItemFromHalfOfSlot(slot, container)`
* **Description:** Moves half the stack from the slot to another container.
* **Parameters:**
  - `slot` -- integer slot index.
  - `container` -- target container entity.
* **Returns:** None.
* **Error states:** None.

### `MoveItemFromCountOfSlot(slot, container, count)`
* **Description:** Moves a specific count from the slot to another container.
* **Parameters:**
  - `slot` -- integer slot index.
  - `container` -- target container entity.
  - `count` -- number of items to move.
* **Returns:** None.
* **Error states:** None.

### `OnEntityReplicated()`
* **Description:** Called when the entity is replicated. Attaches the classified instance to the parent container's replica.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Prints error message if parent is nil. Attachment failure does not print an error.

### `OnRemoveEntity()`
* **Description:** Cleans up references when the entity is removed.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

## Events & listeners
- **Listens to:**
  - `items[i]dirty` -- Triggered when a specific slot's network variable changes. Queues `OnItemsDirty`.
  - `readonlycontainerdirty` -- Triggered when read-only status changes. Queues `Refresh`.
  - `stackitemdirty` (TheWorld) -- Triggered when any item stack changes globally. Queues `OnStackItemDirty` if holding the item.
- **Pushes:**
  - `refresh` -- Fired on parent container when local state is synchronized.
  - `itemget` -- Fired on parent container when an item is added to a slot.
  - `itemlose` -- Fired on parent container when an item is removed from a slot.
  - `stacksizechange` -- Fired on item entity when stack size updates.
  - `stacksizepreview` -- Fired on item entity for client-side stack prediction.
  - `refreshcrafting` -- Fired on `ThePlayer` to update crafting UI.
  - `cancelrefreshcrafting` -- Fired on `ThePlayer` to debounce crafting updates.
  - `gotnewitem` -- Fired on `ThePlayer` when an item is acquired (triggers UI sounds).