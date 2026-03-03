---
id: container_replica
title: Container Replica
description: Manages the client-side replica of a container's state and user interaction, synchronizing with the server-hosted container component for UI and network coordination.
tags: [inventory, network, ui]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f4d6c03f
system_scope: network
---

# Container Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Container Replica` is a client-side component that mirrors the state of a server-hosted `container` component, enabling UI responsiveness and network synchronization. It delegates core container logic (e.g., item manipulation, open/close state) to the server `container` when present, otherwise acting as a client-side proxy via the `container_classified` and `container_opener` child entities. It is primarily used in multiplayer to ensure consistent UI updates and event propagation for players interacting with containers.

Key relationships:
- Works alongside the server-side `container` component (delegates methods like `IsHolding`, `Has`, `Open`, etc.).
- Manages `container_classified` for slot and item data synchronization.
- Coordinates `container_opener` to manage open/closed state and UI triggers for local players.

## Usage example
```lua
-- Typically added automatically; not directly instantiated in prefabs.
-- Example of interacting with a container replica:
if inst.replica.container then
    local has_item = inst.replica.container:Has("stick", 1)
    local item = inst.replica.container:GetItemInSlot(1)
    inst.replica.container:Open(ThePlayer)
    inst.replica.container:Close()
end
```

## Dependencies & tags
**Components used:**  
`container`, `inventoryitem` (via `inst.replica.inventoryitem`, `item.replica.inventoryitem`)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_cannotbeopened` | `net_bool` | `net_bool(inst.GUID, ...)` | Networked flag preventing the container from being opened. |
| `_skipopensnd` | `net_bool` | `net_bool(inst.GUID, ...)` | Networked flag to skip the open sound effect. |
| `_skipclosesnd` | `net_bool` | `net_bool(inst.GUID, ...)` | Networked flag to skip the close sound effect. |
| `_isopen` | boolean | `false` | Local client-side open state (only used on client). |
| `_numslots` | number | `0` | Total number of slots in the container. |
| `acceptsstacks` | boolean | `true` | Whether the container allows stacking items. |
| `usespecificslotsforitems` | boolean | `false` | Whether item placement uses specific slot filtering. |
| `issidewidget` | boolean | `false` | Indicates if the container is a side-widget (e.g., inventory). |
| `type` | string or `nil` | `nil` | Optional container type identifier. |
| `widget` | table or `nil` | `nil` | Reference to UI widget for sound and layout. |
| `itemtestfn` | function or `nil` | `nil` | Custom callback to test if an item belongs in a slot. |
| `priorityfn` | function or `nil` | `nil` | Custom callback to prioritize this container for item placement. |
| `opentask` | `DoTaskInTime` or `nil` | `nil` | Pending delayed open task (e.g., for inventory snapping). |
| `openers` | table | `{}` | Mapping of players to their `container_opener` child entities. |
| `opener` | entity or `nil` | `nil` | On client: the single opener entity (when not server-backed). |
| `classified` | entity or `nil` | `nil` | `container_classified` entity holding slot/item data on client. |

## Main functions
### `AttachClassified(classified)`
* **Description:** Attaches a `container_classified` entity and initializes its slots to match this container’s count.
* **Parameters:** `classified` (entity) — the `container_classified` prefab instance.
* **Returns:** Nothing.

### `DetachClassified()`
* **Description:** Removes the `container_classified` attachment and cleans up listeners.
* **Parameters:** None.
* **Returns:** Nothing.

### `AttachOpener(opener)`
* **Description:** Attaches a player (as `container_opener`) to represent their open state on the client, schedules a delayed open if needed.
* **Parameters:** `opener` (entity) — the player or opener entity.
* **Returns:** Nothing.

### `DetachOpener()`
* **Description:** Detaches the opener, cancels pending open tasks, closes the UI locally, and removes event listeners.
* **Parameters:** None.
* **Returns:** Nothing.

### `AddOpener(opener)`
* **Description:** Adds a player as an opener, creating a child `container_opener` for it.
* **Parameters:** `opener` (entity) — the player.
* **Returns:** Nothing.

### `RemoveOpener(opener)`
* **Description:** Removes a player opener, cleans up the corresponding child entity, and updates networked target.
* **Parameters:** `opener` (entity) — the player to remove.
* **Returns:** Nothing.

### `WidgetSetup(prefab, data)`
* **Description:** Initializes widget-related properties and UI handlers for inventory integration (e.g., `onputininventory`, `ondropped`).
* **Parameters:**  
  `prefab` (string) — prefab name of the container entity.  
  `data` (table) — container setup configuration.  
* **Returns:** Nothing.

### `GetWidget()`
* **Description:** Returns the associated UI widget, if any.
* **Parameters:** None.
* **Returns:** (table or `nil`) The widget object or `nil`.

### `SetNumSlots(numslots)`
* **Description:** Sets the number of slots; must be called before UI initialization.
* **Parameters:** `numslots` (number) — total slot count.
* **Returns:** Nothing.

### `GetNumSlots()`
* **Description:** Returns the number of slots.
* **Parameters:** None.
* **Returns:** (number) Slot count.

### `SetCanBeOpened(canbeopened)`
* **Description:** Sets whether the container can be opened (inverts and stores in `_cannotbeopened`).
* **Parameters:** `canbeopened` (boolean) — `true` to allow opening.
* **Returns:** Nothing.

### `CanBeOpened()`
* **Description:** Returns `true` if the container can be opened.
* **Parameters:** None.
* **Returns:** (boolean)

### `SetSkipOpenSnd(skipopensnd)`
* **Description:** Sets the networked flag to skip the open sound.
* **Parameters:** `skipopensnd` (boolean)
* **Returns:** Nothing.

### `ShouldSkipOpenSnd()`
* **Parameters:** None.
* **Returns:** (boolean)

### `SetSkipCloseSnd(skipclosesnd)`
* **Parameters:** `skipclosesnd` (boolean)
* **Returns:** Nothing.

### `ShouldSkipCloseSnd()`
* **Parameters:** None.
* **Returns:** (boolean)

### `EnableInfiniteStackSize(enable)`
* **Description:** Enables infinite stack size (e.g., for testing or special items).
* **Parameters:** `enable` (boolean)
* **Returns:** Nothing.

### `IsInfiniteStackSize()`
* **Parameters:** None.
* **Returns:** (boolean)

### `EnableReadOnlyContainer(enable)`
* **Description:** Makes the container read-only (items cannot be moved).
* **Parameters:** `enable` (boolean)
* **Returns:** Nothing.

### `IsReadOnlyContainer()`
* **Parameters:** None.
* **Returns:** (boolean)

### `CanTakeItemInSlot(item, slot)`
* **Description:** Validates if `item` can be placed in `slot`, respecting inventory and container rules.
* **Parameters:**  
  `item` (entity) — the item to place.  
  `slot` (number) — the target slot index.  
* **Returns:** (boolean) `true` if placement is allowed.

### `GetSpecificSlotForItem(item)`
* **Description:** If `usespecificslotsforitems` and `itemtestfn` are set, returns the first slot index where `itemtestfn(item, slot)` is true.
* **Parameters:** `item` (entity)
* **Returns:** (number or `nil`) slot index or `nil`.

### `ShouldPrioritizeContainer(item)`
* **Description:** Checks if this container should be preferred for placing `item`, using `priorityfn`.
* **Parameters:** `item` (entity)
* **Returns:** (boolean)

### `AcceptsStacks()`
* **Parameters:** None.
* **Returns:** (boolean) value of `acceptsstacks`.

### `IsSideWidget()`
* **Parameters:** None.
* **Returns:** (boolean) value of `issidewidget`.

### `IsOpenedBy(guy)`
* **Description:** Determines if `guy` has this container open. Delegates to `container` when present; otherwise uses local state.
* **Parameters:** `guy` (entity)
* **Returns:** (boolean)

### `IsHolding(item, checkcontainer)`
* **Description:** Checks if `item` is present in the container, optionally checking sub-containers.
* **Parameters:**  
  `item` (entity or string) — item entity or prefab name.  
  `checkcontainer` (boolean, optional) — whether to recurse into sub-containers.  
* **Returns:** (boolean)

### `FindItem(fn)`
* **Description:** Searches all slots using predicate `fn(item)`; returns first matching item.
* **Parameters:** `fn` (function) — `(item) -> boolean`
* **Returns:** (entity or `nil`)

### `GetItemInSlot(slot)`
* **Description:** Returns the item in the specified slot.
* **Parameters:** `slot` (number)
* **Returns:** (entity or `nil`)

### `GetItems()`
* **Description:** Returns the slots array (server-backed) or classified items (client).
* **Parameters:** None.
* **Returns:** (table)

### `IsEmpty()`
* **Parameters:** None.
* **Returns:** (boolean)

### `IsFull()`
* **Parameters:** None.
* **Returns:** (boolean)

### `Has(prefab, amount, iscrafting)`
* **Description:** Checks if `amount` of `prefab` items exist. Returns success flag and count.
* **Parameters:**  
  `prefab` (string) — prefab name.  
  `amount` (number) — required count.  
  `iscrafting` (boolean, optional) — used for crafting-specific filtering.  
* **Returns:** (boolean, number)

### `HasItemWithTag(tag, amount)`
* **Description:** Checks for `amount` of items with `tag`.
* **Parameters:**  
  `tag` (string) — item tag.  
  `amount` (number)
* **Returns:** (boolean, number)

### `Open(doer)`
* **Description:** Opens the container UI for `doer`.
* **Parameters:** `doer` (entity) — player opening the container.
* **Returns:** Nothing.
* **Error states:** No-op if `doer ~= ThePlayer` on client (unless server-delegated).

### `Close()`
* **Parameters:** None.
* **Returns:** Nothing.

### `IsBusy()`
* **Parameters:** None.
* **Returns:** (boolean) `true` if container classification is incomplete or queued.

### `PutOneOfActiveItemInSlot(slot)`
* **Description:** Moves one item from active inventory slot to `slot`, stacking if possible.
* **Parameters:** `slot` (number)
* **Returns:** Nothing.

### `PutAllOfActiveItemInSlot(slot)`
* **Description:** Moves all items from active inventory slot to `slot`, stacking if possible.
* **Parameters:** `slot` (number)
* **Returns:** Nothing.

### `TakeActiveItemFromHalfOfSlot(slot)`
* **Description:** Takes half the stack from `slot` and places it in the active inventory slot.
* **Parameters:** `slot` (number)
* **Returns:** Nothing.

### `TakeActiveItemFromCountOfSlot(slot, count)`
* **Parameters:**  
  `slot` (number)  
  `count` (number)
* **Returns:** Nothing.

### `TakeActiveItemFromAllOfSlot(slot)`
* **Description:** Moves the entire stack from `slot` to active inventory.
* **Parameters:** `slot` (number)
* **Returns:** Nothing.

### `AddOneOfActiveItemToSlot(slot)`
* **Description:** Adds one item from active stack to `slot` stack (non-destructive).
* **Parameters:** `slot` (number)
* **Returns:** Nothing.

### `AddAllOfActiveItemToSlot(slot)`
* **Description:** Adds all items from active stack to `slot` stack (non-destructive).
* **Parameters:** `slot` (number)
* **Returns:** Nothing.

### `SwapActiveItemWithSlot(slot)`
* **Description:** Swaps the active inventory item with the item in `slot`.
* **Parameters:** `slot` (number)
* **Returns:** Nothing.

### `SwapOneOfActiveItemWithSlot(slot)`
* **Description:** Swaps one item from the active stack with one item in `slot`.
* **Parameters:** `slot` (number)
* **Returns:** Nothing.

### `MoveItemFromAllOfSlot(slot, container)`
* **Description:** Moves all items from `slot` to `container`.
* **Parameters:**  
  `slot` (number)  
  `container` (Container or table)
* **Returns:** Nothing.

### `MoveItemFromHalfOfSlot(slot, container)`
* **Description:** Moves half the stack from `slot` to `container`.
* **Parameters:**  
  `slot` (number)  
  `container` (Container or table)
* **Returns:** Nothing.

### `MoveItemFromCountOfSlot(slot, container, count)`
* **Parameters:**  
  `slot` (number)  
  `container` (Container or table)  
  `count` (number)
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `itemget` — refreshes crafting UI when an item is placed.  
  - `itemlose` — refreshes crafting UI when an item is removed.  
  - `onremove` — detach classified/opener on entity removal.  
  - `onputininventory` — track owner for crafting refresh.  
  - `ondropped` — clear owner on drop.

- **Pushes:**  
  - `refreshcrafting` — whenever container state changes (via `OnRefreshCrafting`).  
  - `onclose` — when container is closed (delegated to `container`).
