---
id: inventory_replica
title: Inventory Replica
description: Synchronizes inventory state and actions between the server and client by acting as a network-replicated proxy for the real inventory component.
tags: [network, inventory, client-server]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: components
source_hash: 8a1a6310
system_scope: network
---

# Inventory Replica

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`InventoryReplica` (instantiated as the `"inventory_replica"` component) enables network synchronization of inventory operations between the server and client in DST. It operates as a lightweight replica of the `inventory` component on the client, backed by an `inventory_classified` entity on the server. It reflects real-time changes like active item updates, slot/equip modifications, visibility toggles, and heavy-lifting/floater-held states via event-driven updates. It bridges the `inventory` component on the server (accessible only on `ismastersim`) with client UI and action logic, ensuring accurate representation during gameplay and cross-state transitions (e.g., dying and reviving as a corpse).

## Usage example
```lua
-- Typically added automatically via prefab definition; manual usage is rare.
-- Example of invoking server-triggered events (only on master):
local inst = TheWorld
if TheWorld.ismastersim then
    local inventory_replica = inst:AddComponent("inventory_replica")
    inventory_replica:SetHeavyLifting(true)
    inventory_replica:SetFloaterHeld(false)
end

-- Client-side UI reacts automatically to events like "visibledirty",
-- "heavyliftingdirty", and "floaterhelddirty" via internal callbacks.
```

## Dependencies & tags
**Components used:** `inventory`, `revivablecorpse`, `playeractionpicker`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Owner entity instance (assigned in constructor). |
| `classified` | `Entity` (represents `inventory_classified`) | `nil` | Server-side classified entity used for network sync. Only non-`nil` on master or client if loaded from `inst.inventory_classified`. |
| `opentask` | `Task` | `nil` | Static task used on server to delay inventory opening. |

## Main functions
### `AttachClassified(classified)`
* **Description:** Attaches an `inventory_classified` entity to this replica, setting up event listeners for visibility, heavy lifting, and floater-held state changes. Also triggers UI rebuild.
* **Parameters:** `classified` (`Entity`) — The classified entity to attach.
* **Returns:** Nothing.

### `DetachClassified()`
* **Description:** Detaches the `classified` entity, cleans up listeners, hides inventory UI, and pushes `newactiveitem` and `inventoryclosed` events.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnOpen()`
* **Description:** Triggers opening of the inventory UI on the client by setting `visible` to `true` on the `classified` entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnClose()`
* **Description:** Closes the inventory UI on the client by setting `visible` to `false`. Cancels any pending open task on the server.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnShow()`
* **Description:** Makes the inventory UI visible on the client (e.g., used when resurrecting and needing to re-show the inventory).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnHide()`
* **Description:** Hides the inventory UI on the client without closing the container state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetHeavyLifting(heavylifting)`
* **Description:** Sets the heavy-lifting state on the `classified` entity and triggers associated action filter updates and SG state changes.
* **Parameters:** `heavylifting` (`boolean`) — Whether the inventory is in heavy-lifting mode.
* **Returns:** Nothing.

### `SetFloaterHeld(floaterheld)`
* **Description:** Sets the floater-held state on the `classified` entity and updates player action filters and SG state accordingly.
* **Parameters:** `floaterheld` (`boolean`) — Whether a floater (e.g., lantern or lightsource) is currently being held in inventory.
* **Returns:** Nothing.

### `GetNumSlots()`
* **Description:** Returns the total number of inventory slots, delegating to `inventory` if available, otherwise returning the default maximum for the current game mode.
* **Parameters:** None.
* **Returns:** `number` — The maximum slot count.

### `CanTakeItemInSlot(item, slot)`
* **Description:** Validates whether the inventory can accept `item` in `slot`, checking item validity, container compatibility, and equip rules.
* **Parameters:**  
  `item` (`Entity`) — The item to insert.  
  `slot` (`number`) — The target slot index.  
* **Returns:** `boolean` — `true` if the item can be placed in the slot.

### `AcceptsStacks()`
* **Description:** Returns whether the inventory accepts stacked items (delegates to `inventory` or defaults to `true`).
* **Parameters:** None.
* **Returns:** `boolean`.

### `IgnoresCanGoInContainer()`
* **Description:** Determines if the inventory bypasses container restrictions (e.g., waterlogged items in some containers).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if restrictions are ignored.

### `EquipHasTag(tag)`
* **Description:** Checks if any equipped item has the specified tag.
* **Parameters:** `tag` (`string`) — The tag to search for.
* **Returns:** `boolean` — `true` if a match is found.

### `IsHeavyLifting()`
* **Description:** Reports whether the inventory is in heavy-lifting mode (affects action availability).
* **Parameters:** None.
* **Returns:** `boolean`.

### `IsFloaterHeld()`
* **Description:** Reports whether a floater item is currently held (affects action filters and SG state).
* **Parameters:** None.
* **Returns:** `boolean`.

### `IsVisible()`
* **Description:** Returns whether the inventory UI is visible.
* **Parameters:** None.
* **Returns:** `boolean`.

### `IsOpenedBy(guy)`
* **Description:** Returns whether the inventory is currently opened by the given entity `guy`.
* **Parameters:** `guy` (`Entity`) — The candidate opener.
* **Returns:** `boolean`.

### `IsHolding(item, checkcontainer)`
* **Description:** Returns whether the inventory is holding `item` (optionally scanning containers).
* **Parameters:**  
  `item` (`Entity`) — The item to check.  
  `checkcontainer` (`boolean`) — Whether to scan open containers.  
* **Returns:** `boolean`.

### `FindItem(fn)`
* **Description:** Returns the first item satisfying the predicate `fn`.
* **Parameters:** `fn` (`function`) — A filter function `(item) → boolean`.
* **Returns:** `Entity?` — The first matching item, or `nil`.

### `GetActiveItem()`
* **Description:** Returns the currently active item.
* **Parameters:** None.
* **Returns:** `Entity?`.

### `GetItemInSlot(slot)`
* **Description:** Returns the item in the specified inventory slot.
* **Parameters:** `slot` (`number`) — Slot index.
* **Returns:** `Entity?`.

### `GetEquippedItem(eslot)`
* **Description:** Returns the equipped item in the given equipment slot.
* **Parameters:** `eslot` (`string`) — Equipment slot (e.g., `"mainhand"`, `"back"`).
* **Returns:** `Entity?`.

### `GetItems()`
* **Description:** Returns the array of items in the inventory slots.
* **Parameters:** None.
* **Returns:** `{ Entity }`.

### `GetEquips()`
* **Description:** Returns the array of equipped items by equipment slot.
* **Parameters:** None.
* **Returns:** `{ Entity }`.

### `GetOpenContainers()`
* **Description:** Returns a table whose keys are open container entities.
* **Parameters:** None.
* **Returns:** `{ [Entity]: true }`.

### `GetOverflowContainer()`
* **Description:** Returns the container component (replica) for overflow storage (e.g., backpack).
* **Parameters:** None.
* **Returns:** `ContainerReplica?`.

### `IsFull()`
* **Description:** Returns whether the inventory has no free slots.
* **Parameters:** None.
* **Returns:** `boolean`.

### `Has(prefab, amount, checkallcontainers)`
* **Description:** Checks if the inventory contains at least `amount` of `prefab`, optionally scanning containers.
* **Parameters:**  
  `prefab` (`string`) — Prefab name to check.  
  `amount` (`number`) — Required minimum count.  
  `checkallcontainers` (`boolean`) — Whether to include containers.  
* **Returns:** `boolean, number` — Whether quantity is met, and actual count.

### `HasItemWithTag(tag, amount)`
* **Description:** Checks if the inventory contains at least `amount` items with `tag`.
* **Parameters:**  
  `tag` (`string`) — Tag to match.  
  `amount` (`number`) — Required minimum count.  
* **Returns:** `boolean, number`.

### `ReturnActiveItem()`
* **Description:** Returns the active item to the active slot.
* **Parameters:** None.
* **Returns:** Nothing.

### `PutOneOfActiveItemInSlot(slot)`
* **Description:** Adds one stackable unit of the active item into `slot`.
* **Parameters:** `slot` (`number`) — Target slot.
* **Returns:** Nothing.

### `PutAllOfActiveItemInSlot(slot)`
* **Description:** Adds the entire active stack into `slot`, if compatible.
* **Parameters:** `slot` (`number`) — Target slot.
* **Returns:** Nothing.

### `TakeActiveItemFromHalfOfSlot(slot)`
* **Description:** Takes half of the stack from `slot` into the active slot.
* **Parameters:** `slot` (`number`) — Source slot.
* **Returns:** Nothing.

### `TakeActiveItemFromCountOfSlot(slot)`
* **Description:** Takes the entire stack from `slot` into the active slot.
* **Parameters:** `slot` (`number`) — Source slot.
* **Returns:** Nothing.

### `TakeActiveItemFromAllOfSlot(slot)`
* **Description:** Synonym for `TakeActiveItemFromCountOfSlot`.
* **Parameters:** `slot` (`number`) — Source slot.
* **Returns:** Nothing.

### `AddOneOfActiveItemToSlot(slot)`
* **Description:** Adds one stackable unit from the active item to an existing item in `slot`.
* **Parameters:** `slot` (`number`) — Target slot.
* **Returns:** Nothing.

### `AddAllOfActiveItemToSlot(slot)`
* **Description:** Adds as many stackable units as possible from the active item to an existing item in `slot`.
* **Parameters:** `slot` (`number`) — Target slot.
* **Returns:** Nothing.

### `SwapActiveItemWithSlot(slot)`
* **Description:** Swaps the active item with the item in `slot`.
* **Parameters:** `slot` (`number`) — Target slot.
* **Returns:** Nothing.

### `UseItemFromInvTile(item)`
* **Description:** Triggers use of `item` via a tile-based interaction (e.g., clicking a floor item).
* **Parameters:** `item` (`Entity`) — The item to use.
* **Returns:** Nothing.
* **Error states:** Returns early if `item` is `nil` or invalid.

### `ControllerUseItemOnItemFromInvTile(item, active_item)`
* **Description:** Performs a controller-mode item-on-item action using inventory tile items.
* **Parameters:**  
  `item` (`Entity`) — The target item.  
  `active_item` (`Entity`) — The active item.  
* **Returns:** Nothing.
* **Error states:** Returns early if either item is `nil` or invalid.

### `ControllerUseItemOnSelfFromInvTile(item)`
* **Description:** Performs a controller-mode item-on-self action.
* **Parameters:** `item` (`Entity`) — The item to use.
* **Returns:** Nothing.
* **Error states:** Returns early if `item` is `nil` or invalid.

### `ControllerUseItemOnSceneFromInvTile(item)`
* **Description:** Performs a controller-mode item-on-scene action.
* **Parameters:** `item` (`Entity`) — The item to use.
* **Returns:** Nothing.
* **Error states:** Returns early if `item` is `nil` or invalid.

### `InspectItemFromInvTile(item)`
* **Description:** Initiates inspection of `item` (e.g., for crafting or tooltip).
* **Parameters:** `item` (`Entity`) — The item to inspect.
* **Returns:** Nothing.
* **Error states:** Returns early if `item` is `nil` or invalid.

### `DropItemFromInvTile(item, single)`
* **Description:** Drops `item` from inventory tile UI.
* **Parameters:**  
  `item` (`Entity`) — The item to drop.  
  `single` (`boolean`) — Whether to drop only part of the stack.  
* **Returns:** Nothing.
* **Error states:** Returns early if `item` is `nil` or invalid.

### `CastSpellBookFromInv(item)`
* **Description:** Casts a spell from `item` (must be a `spellbook` component).
* **Parameters:** `item` (`Entity`) — The spellbook to cast from.
* **Returns:** Nothing.
* **Error states:** Returns early if `item` is `nil` or invalid.

### `EquipActiveItem()`
* **Description:** Equips the active item if valid and equip slot is free.
* **Parameters:** None.
* **Returns:** Nothing.

### `EquipActionItem(item)`
* **Description:** Equips `item` as the action item (e.g., for quick-switch actions).
* **Parameters:** `item` (`Entity`) — The item to equip.
* **Returns:** Nothing.

### `SwapEquipWithActiveItem()`
* **Description:** Swaps the currently equipped action item with the active item.
* **Parameters:** None.
* **Returns:** Nothing.

### `TakeActiveItemFromEquipSlot(eslot)`
* **Description:** Moves the item from `eslot` into the active slot.
* **Parameters:** `eslot` (`string`) — Equipment slot to de-equip from.
* **Returns:** Nothing.

### `MoveItemFromAllOfSlot(slot, container)`
* **Description:** Moves an entire stack from `slot` to `container`.
* **Parameters:**  
  `slot` (`number`) — Source slot.  
  `container` (`ContainerReplica?`) — Target container.  
* **Returns:** Nothing.

### `MoveItemFromHalfOfSlot(slot, container)`
* **Description:** Moves half of the stack from `slot` to `container`.
* **Parameters:**  
  `slot` (`number`) — Source slot.  
  `container` (`ContainerReplica?`) — Target container.  
* **Returns:** Nothing.

### `MoveItemFromCountOfSlot(slot, container, count)`
* **Description:** Moves `count` items from `slot` to `container`.
* **Parameters:**  
  `slot` (`number`) — Source slot.  
  `container` (`ContainerReplica?`) — Target container.  
  `count` (`number`) — Number of items to move.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `newactiveitem` — Updates active item via `classified:SetActiveItem()`.  
  - `itemget` — Updates item in a specific slot via `classified:SetSlotItem()`.  
  - `itemlose` — Clears item in a specific slot via `classified:SetSlotItem(slot)`.  
  - `equip` — Updates equipped item via `classified:SetSlotEquip()`.  
  - `unequip` — Clears equipped slot via `classified:SetSlotEquip(eslot)`.  
  - `visibledirty` — Shows/hides inventory UI.  
  - `heavyliftingdirty` — Updates heavy-lifting action filter.  
  - `floaterhelddirty` — Updates floater-held action filter and SG events.  
  - `onremove` — Cleans up classified detachment on entity removal.

- **Pushes (via `inst:PushEvent()`):**  
  - `newactiveitem` — Fired when detaching classified to reset active item state.  
  - `inventoryclosed` — Fired on detach to signal full closure.
