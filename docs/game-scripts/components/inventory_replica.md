---
id: inventory_replica
title: Inventory Replica
description: Manages network-synchronized inventory state between server and clients, delegating logic to the actual inventory component when available.
tags: [inventory, network, client, server]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8a1a6310
system_scope: network
---

# Inventory Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`inventory_replica` is a client-side component that synchronizes inventory state from the server via a replicated `inventory_classified` object. On the server, it creates and manages the classified object and forwards inventory events to it. On the client, it attaches to an existing classified object to expose the inventory interface without duplicating logic. It delegates all public API calls to either the actual `inventory` component (when present) or the `classified` object, ensuring consistent behavior across server and client.

Key relationships:
- Reads from and delegates to `components.inventory` when running on the server or when the real inventory exists.
- Uses `components.playeractionpicker` to manage action filters for heavy lifting and floater-holding states.
- Interacts with `revivablecorpse` to hide the inventory UI when the entity is a corpse.

## Dependencies & tags
**Components used:** `inventory`, `playeractionpicker`, `revivablecorpse`
**Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance the component is attached to. |
| `opentask` | `Task` | `nil` | A static task used to defer inventory opening on the server. |
| `classified` | `inventory_classified` | `nil` | The network-classified object holding synchronized inventory state. |

## Main functions
### `AttachClassified(classified)`
*   **Description:** Attaches the server-provided `inventory_classified` object to this replica, registers event listeners for state changes, and triggers UI visibility updates.
*   **Parameters:** `classified` (`inventory_classified`) – The classified object to attach.
*   **Returns:** Nothing.

### `DetachClassified()`
*   **Description:** Detaches the `classified` object, hides the inventory UI, and pushes events to notify other systems of closure.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnOpen()`
*   **Description:** Informs the `classified` object that the inventory is open, making its `visible` state `true`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnClose()`
*   **Description:** Informs the `classified` object that the inventory is closed, setting `visible` to `false` and cancelling pending open tasks.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetHeavyLifting(heavylifting)`
*   **Description:** Sets the heavy-lifting state on the `classified` object and updates action filters to allow or disallow heavy-lifting actions.
*   **Parameters:** `heavylifting` (`boolean`) – Whether the player is currently heavy lifting.
*   **Returns:** Nothing.

### `SetFloaterHeld(floaterheld)`
*   **Description:** Sets the floater-holding state on the `classified` object, updates action filters, and triggers state graph events (`sg_startfloating`/`sg_stopfloating`).
*   **Parameters:** `floaterheld` (`boolean`) – Whether a floater is currently held.
*   **Returns:** Nothing.

### `GetNumSlots()`
*   **Description:** Returns the total number of inventory slots. Delegates to the real inventory component if present; otherwise returns the maximum slots for the current game mode.
*   **Parameters:** None.
*   **Returns:** `number` – Total number of inventory slots.

### `IsVisible()`
*   **Description:** Returns whether the inventory UI is visible.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if the inventory is visible, `false` otherwise.

### `IsOpenedBy(guy)`
*   **Description:** Checks if the inventory is currently opened by a specific entity.
*   **Parameters:** `guy` (`Entity`) – The entity to check.
*   **Returns:** `boolean` – `true` if opened by `guy`, `false` otherwise.

### `IsHeavyLifting()`
*   **Description:** Returns whether the player is heavy lifting, based on real inventory state or classified data.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if heavy lifting, `false` otherwise.

### `IsFloaterHeld()`
*   **Description:** Returns whether a floater is currently held, based on real inventory state or classified data.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if holding a floater, `false` otherwise.

### `GetItemInSlot(slot)`
*   **Description:** Gets the item in the specified inventory slot.
*   **Parameters:** `slot` (`number`) – The slot index.
*   **Returns:** `Entity?` – The item entity, or `nil` if the slot is empty.

### `GetEquippedItem(eslot)`
*   **Description:** Gets the item equipped in the specified equipment slot.
*   **Parameters:** `eslot` (`string`) – The equipment slot name (e.g., `MAINHAND`, `BACK`).
*   **Returns:** `Entity?` – The equipped item, or `nil` if empty.

### `GetActiveItem()`
*   **Description:** Gets the currently held active item (e.g., the item being used in UI interactions).
*   **Parameters:** None.
*   **Returns:** `Entity?` – The active item entity, or `nil`.

### `Has(prefab, amount, checkallcontainers)`
*   **Description:** Checks if the inventory contains at least `amount` of a given prefab.
*   **Parameters:** 
    * `prefab` (`string`) – The prefab name.
    * `amount` (`number`) – Required minimum quantity.
    * `checkallcontainers` (`boolean?`) – Whether to check containers.
*   **Returns:** `boolean, number` – Whether the amount is satisfied and the actual count found.

### `GetOpenContainers()`
*   **Description:** Returns a table of open container entities (keys only, values are `true`). Includes overflow containers.
*   **Parameters:** None.
*   **Returns:** `table` – A map of container entities.

## Events & listeners
- **Listens to:**
  - `"visibledirty"` on `classified` – Triggers `OnVisibleDirty` to show/hide crafting and inventory UI.
  - `"heavyliftingdirty"` on `classified` – Updates player action filters for heavy lifting.
  - `"floaterhelddirty"` on `classified` – Updates player action filters and triggers floating state graph events.
  - `"onremove"` on `classified` – Triggers `DetachClassified`.
  - `"newactiveitem"`, `"itemget"`, `"itemlose"`, `"equip"`, `"unequip"` on `inst` (server only) – Updates `classified` state.

- **Pushes:**
  - `"newactiveitem"` with `{}` – Fired during detachment to clear active item on client.
  - `"inventoryclosed"` – Fired during detachment to notify UI systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventory_replica")

-- Server-side: Open the inventory
inst.replica.inventory:OnOpen()

-- Client-side: Check visibility
if inst.replica.inventory:IsVisible() then
    print("Inventory is open!")
end

-- Client-side: Get active item
local item = inst.replica.inventory:GetActiveItem()
```

## Main functions (continued)
### `ReturnActiveItem()`, `PutOneOfActiveItemInSlot(slot)`, `PutAllOfActiveItemInSlot(slot)`, `TakeActiveItemFromHalfOfSlot(slot)`, `TakeActiveItemFromCountOfSlot(slot)`, `TakeActiveItemFromAllOfSlot(slot)`, `AddOneOfActiveItemToSlot(slot)`, `AddAllOfActiveItemToSlot(slot)`, `SwapActiveItemWithSlot(slot)`
*   **Description:** These functions manipulate the active item and inventory slots. Each delegates to `inventory` or `classified` depending on context.
*   **Parameters:** `slot` (`number`) – Target inventory slot index.
*   **Returns:** Nothing.

### `UseItemFromInvTile(item)`, `ControllerUseItemOnItemFromInvTile(item, active_item)`, `ControllerUseItemOnSelfFromInvTile(item)`, `ControllerUseItemOnSceneFromInvTile(item)`, `InspectItemFromInvTile(item)`, `DropItemFromInvTile(item, single)`, `CastSpellBookFromInv(item)`
*   **Description:** These are tile-based interaction handlers used for inventory context actions (e.g., right-click or controller actions). Each checks validity and delegates to `inventory` or `classified`.
*   **Parameters:**
    * `item` (`Entity`) – The item entity to interact with.
    * `active_item` (`Entity?`) – The currently held item (for item-on-item interactions).
    * `single` (`boolean?`) – Whether to drop only one item from a stack.
*   **Returns:** Nothing.

### `EquipActiveItem()`, `EquipActionItem(item)`, `SwapEquipWithActiveItem()`, `TakeActiveItemFromEquipSlot(eslot)`
*   **Description:** Equipment manipulation functions. Each delegates to `inventory` or `classified`.
*   **Parameters:** `eslot` (`string`) – Equipment slot name; `item` (`Entity`) – Item to equip.
*   **Returns:** Nothing.

### `MoveItemFromAllOfSlot(slot, container)`, `MoveItemFromHalfOfSlot(slot, container)`, `MoveItemFromCountOfSlot(slot, container, count)`
*   **Description:** Move items from inventory slots to another container. Each delegates to `inventory` or `classified`.
*   **Parameters:**
    * `slot` (`number`) – Source inventory slot.
    * `container` (`Container?`) – Target container component.
    * `count` (`number?`) – Number of items to move (used only in `MoveItemFromCountOfSlot`).
*   **Returns:** Nothing.

### `CanTakeItemInSlot(item, slot)`
*   **Description:** Checks whether an item can be placed in a given slot.
*   **Parameters:**
    * `item` (`Entity`) – The item to test.
    * `slot` (`number`) – Target slot index.
*   **Returns:** `boolean` – `true` if the item can be placed.

### `AcceptsStacks()`
*   **Description:** Checks whether the inventory accepts stacked items (e.g., can accept full stacks of compatible items).
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if stacks are accepted.

### `IgnoresCanGoInContainer()`
*   **Description:** Checks whether the inventory bypasses `CanGoInContainer` restrictions for items.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if restrictions are ignored.

### `EquipHasTag(tag)`
*   **Description:** Checks if any equipped item has a specific tag.
*   **Parameters:** `tag` (`string`) – The tag to check.
*   **Returns:** `boolean` – `true` if any equipped item has the tag.

### `IsHolding(item, checkcontainer)`
*   **Description:** Checks if a specific item is currently held in the inventory or active slot.
*   **Parameters:**
    * `item` (`Entity`) – The item to check.
    * `checkcontainer` (`boolean?`) – Whether to check contained items.
*   **Returns:** `boolean` – `true` if holding the item.

### `FindItem(fn)`
*   **Description:** Finds an item in the inventory that matches a given predicate function.
*   **Parameters:** `fn` (`function`) – Function taking an item and returning a boolean.
*   **Returns:** `Entity?` – The first matching item, or `nil`.

### `GetItems()`, `GetEquips()`, `GetOverflowContainer()`, `IsFull()`, `HasItemWithTag(tag, amount)`
*   **Description:** Additional query functions returning inventory state. All delegate to `inventory` or `classified`.
*   **Returns:** `GetItems`: `table` of item entities; `GetEquips`: `table` of equipped items; `GetOverflowContainer`: `container_replica?`; `IsFull`: `boolean`; `HasItemWithTag`: `boolean, number`.

## Notes
- This component does *not* manage inventory logic (e.g., adding/removing items); it only provides a network-safe read/write interface that delegates to the actual `inventory` component on the server or the `classified` object on the client.
- Server and client code paths diverge based on `TheWorld.ismastersim`. On server, a new `inventory_classified` is spawned; on client, an existing one is attached.
- Action filters (`HeavyLiftingActionFilter`, `FloaterHeldActionFilter`) dynamically adjust available actions based on classified state.
