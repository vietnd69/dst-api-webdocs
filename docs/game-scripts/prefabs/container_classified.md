---
id: container_classified
title: Container Classified
description: Manages client-side preview state and server-side slot synchronization for containers during interactive inventory operations.
tags: [inventory, container, network, ui, crafting]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6c9b0e5a
system_scope: inventory
---

# Container Classified

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`Container Classified` is a specialized container component used to manage the client-side preview state and RPC-driven synchronization of inventory slots during player-driven interactions (e.g., crafting, building, item transfer). It operates alongside the `container` component on the same entity, providing non-blocking, optimistic UI updates via preview state (`_itemspreview`) until server confirmation is received. It is typically attached to entities that act as containers in crafting/building workflows (e.g., workbenches, chests, crafting tables) and works in coordination with `inventory_classified` to handle active-item operations.

## Usage example
```lua
-- Creating a classified container entity (server-side)
local inst = CreateEntity()
inst:AddTag("container")
inst:AddComponent("container")
inst:AddComponent("container_classified")

-- Client-side, it is attached automatically via OnEntityReplicated
-- No direct manual instantiation needed on the client
```

## Dependencies & tags
**Components used:**  
- `container` (via `inst._parent.replica.container`)  
- `inventoryitem` (via `item.replica.inventoryitem`)  
- `stackable` (via `item.replica.stackable`)  
- `constructionbuilderuidata` (indirectly, for crafting ingredient slot mapping)  

**Tags:**  
- Adds `CLASSIFIED` to the entity via `inst:AddTag("CLASSIFIED")`.  
- No tags are checked or removed dynamically.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `infinitestacksize` | `net_bool` | `false` | Networked boolean indicating whether overstacked items are allowed. |
| `readonlycontainer` | `net_bool` | `false` | Networked boolean; triggers `"readonlycontainerdirty"` event on change. |
| `_items` | `table` of `net_entity` | `{}` | Networked slot entities; one per container slot. |
| `_itemspool` | `table` of `net_entity` | `{}` | Reusable networked entity pool for slots. |
| `_itemspreview` | `table` or `nil` | `nil` | Client-side preview buffer for slot items; non-`nil` during pending operations. |
| `_slottasks` | `table` or `nil` | `nil` | Tracks deferred slot tasks (e.g., dirty handlers) on the client. |
| `_refreshtask` | `GScriptTask` or `nil` | `nil` | Task scheduled to reset preview state after `TIMEOUT`. |
| `_busy` | `boolean` | `true` | Server-side flag indicating if the container is unavailable for interaction. |
| `_parent` | `entity` or `nil` | `nil` | Entity that owns this classified container (only set on client after replication). |

## Main functions
### `InitializeSlots(inst, numslots)`
* **Description:** Adjusts the number of active inventory slots to match `numslots`. Can only be called once before `RegisterNetListeners`. Adds or removes slots using the internal `_itemspool`.
* **Parameters:**  
  - `numslots` (number) — target number of slots (must be `>= 1` and `<= containers.MAXITEMSLOTS`).  
* **Returns:** Nothing.  
* **Error states:** Throws an `assert` error if called after `_slottasks` has been initialized.

### `IsBusy(inst)`
* **Description:** Returns `true` if the container is busy or has no parent (client-side).
* **Parameters:** None.  
* **Returns:** `boolean`.  
* **Error states:** None.

### `GetItemInSlot(inst, slot)`
* **Description:** Retrieves the item in the specified slot, using either the live `_items` (server/normal state) or `_itemspreview` (client preview state).
* **Parameters:**  
  - `slot` (number) — 1-indexed slot index.  
* **Returns:** `entity` or `nil`.  
* **Error states:** Returns `nil` for out-of-bounds slots.

### `GetItems(inst)`
* **Description:** Returns an array of actual items in all slots (from `_items:value()`), or preview items if `_itemspreview` is set.
* **Parameters:** None.  
* **Returns:** `table` (array of `entity` or `nil`).  

### `IsEmpty(inst)`
* **Description:** Returns `true` if all slots are empty (empty `nil` entries in both live and preview states).
* **Parameters:** None.  
* **Returns:** `boolean`.  

### `IsFull(inst)`
* **Description:** Returns `true` if all slots are occupied (no `nil` entries in both live and preview states).
* **Parameters:** None.  
* **Returns:** `boolean`.  

### `Has(inst, prefab, amount, iscrafting)`
* **Description:** Counts total items of `prefab` up to `amount`, optionally excluding items tagged `"nocrafting"`.
* **Parameters:**  
  - `prefab` (string) — prefab name.  
  - `amount` (number) — required minimum count.  
  - `iscrafting` (boolean) — whether to exclude `nocrafting` items.  
* **Returns:** `count >= amount` (boolean), `count` (number).  

### `HasItemWithTag(inst, tag, amount)`
* **Description:** Counts total items with `tag` up to `amount`.
* **Parameters:**  
  - `tag` (string) — tag name to match.  
  - `amount` (number) — required minimum count.  
* **Returns:** `count >= amount` (boolean), `count` (number).  

### `FindItem(inst, fn)`
* **Description:** Returns the first item satisfying predicate `fn(item)`, checking either `_itemspreview` or live `_items`.
* **Parameters:**  
  - `fn` (function) — predicate accepting an `entity`.  
* **Returns:** `entity` or `nil`.  

### `ReceiveItem(inst, item, count, forceslot)`
* **Description:** Attempts to insert `item` into the container. Handles stacking, overstacking (respecting `infinitestacksize`), and overflow accounting. Called during item placement (e.g., `MoveItemFromAllOfSlot`).
* **Parameters:**  
  - `item` (entity) — item to insert.  
  - `count` (number or `nil`) — max number of items to accept (defaults to full stack if `nil`).  
  - `forceslot` (number or `nil`) — specific slot index to attempt insertion (1-based).  
* **Returns:** `number` — number of leftover items (0 if fully accepted).  
* **Error states:** Returns `0` if container is busy or `forceslot` is invalid.

### `ConsumeByName(inst, prefab, amount)`
* **Description:** Removes items by `prefab` up to `amount`, consuming entire stacks or splitting stacks as needed.
* **Parameters:**  
  - `prefab` (string) — prefab name to consume.  
  - `amount` (number) — number of items to remove (`<= 0` returns early).  
* **Returns:** Nothing.  

### `TakeActionItem(inst, item, slot)`
* **Description:** Removes `item` from `slot` during active UI interaction (e.g., drag/drop).
* **Parameters:**  
  - `item` (entity) — must match `GetItemInSlot(slot)`.  
  - `slot` (number) — slot index.  
* **Returns:** Nothing.  
* **Error states:** No-op if container is busy or item mismatch.

## Events & listeners
- **Listens to:**  
  - `"items[<N>]dirty"` — triggered per slot on server update; defers `OnItemsDirty` by one frame.  
  - `"readonlycontainerdirty"` — triggers immediate refresh.  
  - `"stackitemdirty"` (world event) — if item is held in this container, triggers `OnStackItemDirty`.  

- **Pushes (client):**  
  - `"refresh"` — fires on container refresh.  
  - `"itemget"` / `"itemlose"` — fired when item is added/removed in preview.  
  - `"gotnewitem"` — fired on gaining item (if held by `ThePlayer`).  
  - `"stacksizechange"` — pushed on item stack size change.  
  - `"stacksizepreview"` — pushed when previewing stack size changes.  
  - `"refreshcrafting"` / `"cancelrefreshcrafting"` — fired to synchronize crafting UI.  

- **Pushes (server):** none directly — only via parent entity (e.g., `inst._parent:PushEvent("refresh")`).