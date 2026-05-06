---
id: container_replica
title: Container Replica
description: Client-side replica of the container component that synchronizes container state and inventory operations between server and clients.
tags: [inventory, network, replication]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 326615d9
system_scope: inventory
---

# Container

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
The `Container` component coordinates container UI display and network state synchronization between server and clients. It manages classified entities for replication, handles container open/close events, and delegates authoritative slot operations to the server-side container component or classified entities. Works with `inventoryitem` to validate item placement and integrates with player HUD for container UI.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("container")
inst.components.container:SetNumSlots(9)
inst.components.container:SetCanBeOpened(true)
inst.components.container:WidgetSetup("chest", {widget = "chest"})
inst.components.container:Open(ThePlayer)
```

## Dependencies & tags
**External dependencies:**
- `containers` -- widget setup and container configuration utilities

**Components used:**
- `container` -- server-side component accessed via `self.inst.components.container` for authoritative state
- `inventoryitem` -- checks item ownership and container eligibility via replica

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | nil | The entity instance that owns this component. |
| `_cannotbeopened` | net_bool | false | Network variable controlling whether container can be opened. |
| `_skipopensnd` | net_bool | false | Network variable to skip open sound effect. |
| `_skipclosesnd` | net_bool | false | Network variable to skip close sound effect. |
| `_isopen` | boolean | false | Local state tracking if container is currently open. |
| `_numslots` | number | 0 | Number of inventory slots in this container. |
| `acceptsstacks` | boolean | true | Whether this container accepts stacked items. |
| `usespecificslotsforitems` | boolean | false | Whether items must go in specific slots. |
| `issidewidget` | boolean | false | Whether container UI appears as side widget. |
| `type` | string | nil | Container type identifier. |
| `widget` | table | nil | Widget configuration table. |
| `itemtestfn` | function | nil | Custom function to test if item can go in slot. |
| `priorityfn` | function | nil | Custom function to prioritize container for item. |
| `opentask` | task | nil | Scheduled task for opening container. |
| `openers` | table | {} | Table of players who have opened this container. |
| `opener` | entity | nil | Primary opener entity for classified data. |

## Main functions
### `OnRemoveEntity()`
* **Description:** Cleans up classified entities, openers, and event callbacks when the container entity is removed. Handles both server and client cleanup paths.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `AttachClassified(classified)`
* **Description:** Attaches a classified entity for network replication and initializes slots. Sets up detach callback on entity removal.
* **Parameters:** `classified` -- classified entity instance
* **Returns:** None
* **Error states:** Errors if `classified` is nil when calling `classified:InitializeSlots()` — no nil guard present.

### `DetachClassified()`
* **Description:** Removes event callback and clears classified entity reference.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `AttachOpener(opener)`
* **Description:** Attaches an opener entity, schedules container open task, and listens for item changes to refresh crafting UI.
* **Parameters:** `opener` -- player entity that opened the container
* **Returns:** None
* **Error states:** Errors if `opener` is nil when setting up classified target — no nil guard present.

### `DetachOpener()`
* **Description:** Removes opener event callbacks, refreshes crafting UI, and closes the container.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `AddOpener(opener)`
* **Description:** Adds a player to the list of container openers. Creates classified opener entity for network replication. Handles single vs multiple opener logic.
* **Parameters:** `opener` -- player entity
* **Returns:** None
* **Error states:** Errors if `self.inst.components.container` is nil when `opencount > 1` — asserts in `SetOpener` helper.

### `RemoveOpener(opener)`
* **Description:** Removes a player from the opener list and cleans up their classified entity. Updates classified target based on remaining openers.
* **Parameters:** `opener` -- player entity to remove
* **Returns:** None
* **Error states:** Errors if `self.inst.components.container` is nil when `opencount > 1` — no nil guard in slot iteration.

### `WidgetSetup(prefab, data)`
* **Description:** Configures container widget using the containers module. Sets up inventory and drop event listeners for crafting UI refresh.
* **Parameters:**
  - `prefab` -- string prefab name
  - `data` -- table with widget configuration
* **Returns:** None
* **Error states:** None

### `GetWidget()`
* **Description:** Returns the widget configuration table.
* **Parameters:** None
* **Returns:** Widget table or `nil`

### `SetNumSlots(numslots)`
* **Description:** Sets the number of inventory slots for this container.
* **Parameters:** `numslots` -- number of slots
* **Returns:** None
* **Error states:** None

### `GetNumSlots()`
* **Description:** Returns the number of inventory slots.
* **Parameters:** None
* **Returns:** Number of slots

### `SetCanBeOpened(canbeopened)`
* **Description:** Controls whether the container can be opened by players.
* **Parameters:** `canbeopened` -- boolean
* **Returns:** None
* **Error states:** None

### `CanBeOpened()`
* **Description:** Returns whether the container can be opened.
* **Parameters:** None
* **Returns:** Boolean

### `SetSkipOpenSnd(skipopensnd)`
* **Description:** Controls whether open sound effect is skipped.
* **Parameters:** `skipopensnd` -- boolean
* **Returns:** None
* **Error states:** None

### `ShouldSkipOpenSnd()`
* **Description:** Returns whether open sound should be skipped.
* **Parameters:** None
* **Returns:** Boolean

### `SetSkipCloseSnd(skipclosesnd)`
* **Description:** Controls whether close sound effect is skipped.
* **Parameters:** `skipclosesnd` -- boolean
* **Returns:** None
* **Error states:** None

### `ShouldSkipCloseSnd()`
* **Description:** Returns whether close sound should be skipped.
* **Parameters:** None
* **Returns:** Boolean

### `EnableInfiniteStackSize(enable)`
* **Description:** Enables or disables infinite stack size for items in this container.
* **Parameters:** `enable` -- boolean
* **Returns:** None
* **Error states:** None

### `IsInfiniteStackSize()`
* **Description:** Returns whether infinite stack size is enabled.
* **Parameters:** None
* **Returns:** Boolean, returns `false` if classified is nil

### `EnableReadOnlyContainer(enable)`
* **Description:** Sets container to read-only mode where items cannot be removed. Refreshes UI for all openers.
* **Parameters:** `enable` -- boolean
* **Returns:** None
* **Error states:** None

### `IsReadOnlyContainer()`
* **Description:** Returns whether container is in read-only mode.
* **Parameters:** None
* **Returns:** Boolean, returns `false` if classified is nil

### `CanTakeItemInSlot(item, slot)`
* **Description:** Validates whether an item can be placed in a specific slot. Checks item restrictions, read-only state, game mode properties, and slot-specific rules.
* **Parameters:**
  - `item` -- entity instance to check
  - `slot` -- integer slot index (optional)
* **Returns:** Boolean
* **Error states:** None

### `GetSpecificSlotForItem(item)`
* **Description:** Finds the appropriate slot for an item if container uses specific slot assignment.
* **Parameters:** `item` -- entity instance
* **Returns:** Slot index or `nil` if no suitable slot found

### `ShouldPrioritizeContainer(item)`
* **Description:** Determines if this container should be prioritized for storing the given item based on priority function and item restrictions.
* **Parameters:** `item` -- entity instance
* **Returns:** Boolean

### `AcceptsStacks()`
* **Description:** Returns whether this container accepts stacked items.
* **Parameters:** None
* **Returns:** Boolean

### `IsSideWidget()`
* **Description:** Returns whether container UI appears as a side widget.
* **Parameters:** None
* **Returns:** Boolean

### `IsOpenedBy(guy)`
* **Description:** Checks if a specific player has opened this container.
* **Parameters:** `guy` -- player entity to check
* **Returns:** Boolean

### `IsHolding(item, checkcontainer)`
* **Description:** Checks if the container is holding a specific item.
* **Parameters:**
  - `item` -- entity instance to check
  - `checkcontainer` -- boolean to include nested containers
* **Returns:** Boolean

### `FindItem(fn)`
* **Description:** Finds an item in the container matching the provided function.
* **Parameters:** `fn` -- function that takes item and returns boolean
* **Returns:** Item entity or `nil`

### `GetItemInSlot(slot)`
* **Description:** Returns the item in a specific slot.
* **Parameters:** `slot` -- integer slot index
* **Returns:** Item entity or `nil`

### `GetItems()`
* **Description:** Returns all items in the container.
* **Parameters:** None
* **Returns:** Table of item entities or empty table

### `IsEmpty()`
* **Description:** Returns whether the container has no items.
* **Parameters:** None
* **Returns:** Boolean

### `IsFull()`
* **Description:** Returns whether the container has no available slots.
* **Parameters:** None
* **Returns:** Boolean

### `Has(prefab, amount, iscrafting)`
* **Description:** Checks if container has a specific prefab with required amount.
* **Parameters:**
  - `prefab` -- string prefab name
  - `amount` -- number required
  - `iscrafting` -- boolean for crafting context
* **Returns:** Boolean and count

### `HasItemWithTag(tag, amount)`
* **Description:** Checks if container has items with a specific tag.
* **Parameters:**
  - `tag` -- string tag name
  - `amount` -- number required
* **Returns:** Boolean and count

### `Open(doer)`
* **Description:** Opens the container for a player. Plays open sound and shows container UI.
* **Parameters:** `doer` -- player entity opening the container
* **Returns:** None
* **Error states:** None

### `Close()`
* **Description:** Closes the container. Plays close sound and hides container UI.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `IsBusy()`
* **Description:** Returns whether the container is currently busy (e.g., during transfer operations).
* **Parameters:** None
* **Returns:** Boolean

### `PutOneOfActiveItemInSlot(slot)`
* **Description:** Moves one item from active item to specified slot.
* **Parameters:** `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `PutAllOfActiveItemInSlot(slot)`
* **Description:** Moves all items from active item to specified slot.
* **Parameters:** `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `TakeActiveItemFromHalfOfSlot(slot)`
* **Description:** Takes half of items from slot to active item.
* **Parameters:** `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `TakeActiveItemFromCountOfSlot(slot, count)`
* **Description:** Takes specific count of items from slot to active item.
* **Parameters:**
  - `slot` -- integer slot index
  - `count` -- number of items to take
* **Returns:** None
* **Error states:** None

### `TakeActiveItemFromAllOfSlot(slot)`
* **Description:** Takes all items from slot to active item.
* **Parameters:** `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `AddOneOfActiveItemToSlot(slot)`
* **Description:** Adds one item from active item to existing stack in slot.
* **Parameters:** `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `AddAllOfActiveItemToSlot(slot)`
* **Description:** Adds all items from active item to existing stack in slot.
* **Parameters:** `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `SwapActiveItemWithSlot(slot)`
* **Description:** Swaps active item with item in slot.
* **Parameters:** `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `SwapOneOfActiveItemWithSlot(slot)`
* **Description:** Swaps one item from active item with one item from slot.
* **Parameters:** `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `MoveItemFromAllOfSlot(slot, container)`
* **Description:** Moves all items from slot to another container.
* **Parameters:**
  - `slot` -- integer slot index
  - `container` -- target container entity
* **Returns:** None
* **Error states:** None

### `MoveItemFromHalfOfSlot(slot, container)`
* **Description:** Moves half of items from slot to another container.
* **Parameters:**
  - `slot` -- integer slot index
  - `container` -- target container entity
* **Returns:** None
* **Error states:** None

### `MoveItemFromCountOfSlot(slot, container, count)`
* **Description:** Moves specific count of items from slot to another container.
* **Parameters:**
  - `slot` -- integer slot index
  - `container` -- target container entity
  - `count` -- number of items to move
* **Returns:** None
* **Error states:** None

### `SetOpener()`
* **Description:** Deprecated function kept for mod compatibility. Does nothing.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `itemget` - refreshes crafting UI when item is added to container
- **Listens to:** `itemlose` - refreshes crafting UI when item is removed from container
- **Listens to:** `onremove` - detaches classified and opener entities when they are removed
- **Listens to:** `onputininventory` - tracks owner for crafting UI refresh
- **Listens to:** `ondropped` - clears owner reference when container is dropped
- **Pushes:** `refreshcrafting` - fired to player/owner when container state changes