---
id: inventory_replica
title: Inventory Replica
description: Master inventory component that manages item slots, equipment, and synchronizes state to clients via classified entities.
tags: [inventory, items, equipment]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: component
source_hash: 19229028
system_scope: inventory
---

# Inventory

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Inventory` is the master component that manages an entity's item slots, equipment, and inventory state. On player entities in master simulation, it spawns an `inventory_classified` prefab to hold netvars for client synchronization. It forwards inventory events (item get/lose, equip/unequip) to the classified entity so clients can mirror the state. Most methods check `self.inst.components.inventory` to delegate to an underlying inventory component, or fall back to classified entity queries on clients.

## Usage example
```lua
-- Check inventory state:
if inst.components.inventory ~= nil then
    local active_item = inst.components.inventory:GetActiveItem()
    local is_visible = inst.components.inventory:IsVisible()
    local is_heavy = inst.components.inventory:IsHeavyLifting()
end

-- Master-side state mutation:
if TheWorld.ismastersim and inst.components.inventory ~= nil then
    inst.components.inventory:SetHeavyLifting(true)
    inst.components.inventory:OnOpen()
end
```

## Dependencies & tags
**External dependencies:**
- `inventory_classified` -- prefab spawned on master to hold netvars for client synchronization

**Components used:**
- `inventory` -- underlying inventory component; this component delegates most calls to it when present
- `playeractionpicker` -- pushes/pops action filters when heavy lifting or floater held state changes
- `revivablecorpse` -- checked during OpenInventory to hide inventory for corpses

**Tags:**
- `corpse` -- checked during OpenInventory; hides inventory if entity has this tag

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `opentask` | task | `nil` | Scheduled task for opening inventory; cancelled on close/remove. |
| `classified` | entity | `nil` | The classified entity holding netvars; spawned on master, attached on client. |
| `ondetachclassified` | function | `nil` | Callback registered on classified entity onremove event. Signature: `fn()`. Set internally by AttachClassified(). |

## Main functions
### Constructor `(self, inst)`
* **Description:** Initializes the inventory component. On master simulation with player entities, spawns `inventory_classified` prefab and sets up event listeners to forward inventory changes to clients. On clients, attaches to existing classified entity from `inst.inventory_classified`.
* **Parameters:**
  - `inst` -- the owning entity instance
* **Returns:** nil
* **Error states:** None.

### `OnRemoveEntity()`
* **Description:** Cleanup handler called when the entity is removed. Cancels open task on master, closes inventory, removes classified entity. On client, detaches classified and removes event callbacks.
* **Parameters:** None.
* **Returns:** nil
* **Error states:** Errors if `inst.components.inventory` is nil (no guard before `:Close()` call).

### `AttachClassified(classified)`
* **Description:** Attaches a classified entity to this component. Registers listeners for `visibledirty`, `heavyliftingdirty`, and `floaterhelddirty` events. Sets up `onremove` callback to auto-detach. Triggers initial visibility check.
* **Parameters:**
  - `classified` -- the classified entity to attach
* **Returns:** nil
* **Error states:** None.

### `DetachClassified()`
* **Description:** Detaches the classified entity. Clears references, hides inventory UI, pushes `newactiveitem` and `inventoryclosed` events.
* **Parameters:** None.
* **Returns:** nil
* **Error states:** None.

### `OnOpen()`
* **Description:** Sets classified target to the owning entity and sets `visible` netvar to `true`. Called when inventory opens.
* **Parameters:** None.
* **Returns:** nil
* **Error states:** None.

### `OnClose()`
* **Description:** Cancels open task, sets classified target to itself, sets `visible` netvar to `false`. Called when inventory closes.
* **Parameters:** None.
* **Returns:** nil
* **Error states:** None.

### `OnShow()`
* **Description:** Sets `visible` netvar to `true` without changing classified target. Used to show inventory without full open state.
* **Parameters:** None.
* **Returns:** nil
* **Error states:** None.

### `OnHide()`
* **Description:** Sets `visible` netvar to `false` without changing classified target. Used to hide inventory without full close state.
* **Parameters:** None.
* **Returns:** nil
* **Error states:** None.

### `SetHeavyLifting(heavylifting)`
* **Description:** Sets the `heavylifting` netvar on classified entity and triggers immediate filter update via `_OnHeavyLiftingDirty`.
* **Parameters:**
  - `heavylifting` -- boolean indicating if entity is heavy lifting
* **Returns:** nil
* **Error states:** None.

### `SetFloaterHeld(floaterheld)`
* **Description:** Sets the `floaterheld` netvar on classified entity and triggers immediate filter update via `_OnFloaterHeldDirty`.
* **Parameters:**
  - `floaterheld` -- boolean indicating if entity is holding a floater
* **Returns:** nil
* **Error states:** None.

### `GetNumSlots()`
* **Description:** Returns the number of inventory slots. Delegates to `inst.components.inventory:GetNumSlots()` if present, otherwise uses `GetMaxItemSlots()` based on game mode.
* **Parameters:** None.
* **Returns:** number of slots
* **Error states:** None.

### `CanTakeItemInSlot(item, slot)`
* **Description:** Validates if an item can be placed in a specific slot. Checks item's `inventoryitem` replica, container rules, game mode properties, slot bounds, and existing item lock/stack status.
* **Parameters:**
  - `item` -- entity to check
  - `slot` -- integer slot index
* **Returns:** boolean
* **Error states:** None.

### `AcceptsStacks()`
* **Description:** Returns whether this inventory accepts item stacking. Delegates to `inst.components.inventory:AcceptsStacks()` if present, otherwise returns `true`.
* **Parameters:** None.
* **Returns:** boolean
* **Error states:** None.

### `IgnoresCanGoInContainer()`
* **Description:** Returns whether this inventory ignores container placement rules. Delegates to `inst.components.inventory:IgnoresCanGoInContainer()` if present, otherwise returns `false`.
* **Parameters:** None.
* **Returns:** boolean
* **Error states:** None.

### `EquipHasTag(tag)`
* **Description:** Checks if any equipped item has the specified tag. Delegates to `inst.components.inventory:EquipHasTag()` if present, otherwise checks classified equips.
* **Parameters:**
  - `tag` -- string tag to check
* **Returns:** boolean
* **Error states:** None.

### `IsHeavyLifting()`
* **Description:** Returns whether the entity is currently heavy lifting. Delegates to `inst.components.inventory:IsHeavyLifting()` if present, otherwise reads `heavylifting` netvar from classified.
* **Parameters:** None.
* **Returns:** boolean
* **Error states:** None.

### `IsFloaterHeld()`
* **Description:** Returns whether the entity is holding a floater item. Delegates to `inst.components.inventory:IsFloaterHeld()` if present, otherwise reads `floaterheld` netvar from classified.
* **Parameters:** None.
* **Returns:** boolean
* **Error states:** None.

### `IsVisible()`
* **Description:** Returns whether the inventory UI is currently visible. Delegates to `inst.components.inventory.isvisible` if present, otherwise reads `visible` netvar from classified.
* **Parameters:** None.
* **Returns:** boolean
* **Error states:** None.

### `IsOpenedBy(guy)`
* **Description:** Returns whether the inventory is opened by the specified entity. Delegates to `inst.components.inventory:IsOpenedBy()` if present, otherwise checks visibility and entity match.
* **Parameters:**
  - `guy` -- entity to check
* **Returns:** boolean
* **Error states:** None.

### `IsHolding(item, checkcontainer)`
* **Description:** Returns whether the inventory is holding the specified item. Delegates to `inst.components.inventory:IsHolding()` if present, otherwise uses classified `IsHolding()`.
* **Parameters:**
  - `item` -- entity to check
  - `checkcontainer` -- boolean to include containers in check
* **Returns:** boolean
* **Error states:** None.

### `FindItem(fn)`
* **Description:** Finds an item matching the predicate function. Delegates to `inst.components.inventory:FindItem()` if present, otherwise uses classified `FindItem()`.
* **Parameters:**
  - `fn` -- predicate function taking item as argument
* **Returns:** entity or `nil`
* **Error states:** None.

### `GetActiveItem()`
* **Description:** Returns the currently active (held) item. Delegates to `inst.components.inventory:GetActiveItem()` if present, otherwise uses classified `GetActiveItem()`.
* **Parameters:** None.
* **Returns:** entity or `nil`
* **Error states:** None.

### `GetItemInSlot(slot)`
* **Description:** Returns the item in the specified slot. Delegates to `inst.components.inventory:GetItemInSlot()` if present, otherwise uses classified `GetItemInSlot()`.
* **Parameters:**
  - `slot` -- integer slot index
* **Returns:** entity or `nil`
* **Error states:** None.

### `GetEquippedItem(eslot)`
* **Description:** Returns the item in the specified equip slot. Delegates to `inst.components.inventory:GetEquippedItem()` if present, otherwise uses classified `GetEquippedItem()`.
* **Parameters:**
  - `eslot` -- integer equip slot index
* **Returns:** entity or `nil`
* **Error states:** None.

### `GetItems()`
* **Description:** Returns all items in inventory slots. Delegates to `inst.components.inventory.itemslots` if present, otherwise uses classified `GetItems()`.
* **Parameters:** None.
* **Returns:** table of items
* **Error states:** None.

### `GetEquips()`
* **Description:** Returns all equipped items. Delegates to `inst.components.inventory.equipslots` if present, otherwise uses classified `GetEquips()`.
* **Parameters:** None.
* **Returns:** table of equipped items
* **Error states:** None.

### `GetOpenContainers()`
* **Description:** Returns a table of open container entities as keys (values are `true`). Delegates to `inst.components.inventory.opencontainers` if present, otherwise builds from HUD controls.
* **Parameters:** None.
* **Returns:** table
* **Error states:** None.

### `GetOverflowContainer()`
* **Description:** Returns the overflow container (backpack). Delegates to `inst.components.inventory:GetOverflowContainer()` if present, otherwise uses classified `GetOverflowContainer()`.
* **Parameters:** None.
* **Returns:** container or `nil`
* **Error states:** None.

### `IsFull()`
* **Description:** Returns whether the inventory is full. Delegates to `inst.components.inventory:IsFull()` if present, otherwise uses classified `IsFull()`.
* **Parameters:** None.
* **Returns:** boolean
* **Error states:** None.

### `Has(prefab, amount, checkallcontainers)`
* **Description:** Checks if inventory has the specified prefab with required amount. Delegates to `inst.components.inventory:Has()` if present, otherwise uses classified `Has()`.
* **Parameters:**
  - `prefab` -- string prefab name
  - `amount` -- number required
  - `checkallcontainers` -- boolean to include containers
* **Returns:** boolean, number found
* **Error states:** None.

### `HasItemWithTag(tag, amount)`
* **Description:** Checks if inventory has items with the specified tag. Delegates to `inst.components.inventory:HasItemWithTag()` if present, otherwise uses classified `HasItemWithTag()`.
* **Parameters:**
  - `tag` -- string tag to check
  - `amount` -- number required
* **Returns:** boolean, number found
* **Error states:** None.

### `ReturnActiveItem()`
* **Description:** Returns the active item to its slot. Delegates to `inst.components.inventory:ReturnActiveItem()` if present, otherwise uses classified `ReturnActiveItem()`.
* **Parameters:** None.
* **Returns:** nil
* **Error states:** None.

### `PutOneOfActiveItemInSlot(slot)`
* **Description:** Moves one item from active item to the specified slot. Delegates to `inst.components.inventory:PutOneOfActiveItemInSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
* **Returns:** nil
* **Error states:** None.

### `PutAllOfActiveItemInSlot(slot)`
* **Description:** Moves all of active item to the specified slot. Delegates to `inst.components.inventory:PutAllOfActiveItemInSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
* **Returns:** nil
* **Error states:** None.

### `TakeActiveItemFromHalfOfSlot(slot)`
* **Description:** Takes half of the item from the specified slot into active item. Delegates to `inst.components.inventory:TakeActiveItemFromHalfOfSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
* **Returns:** nil
* **Error states:** None.

### `TakeActiveItemFromCountOfSlot(slot)`
* **Description:** Takes a specific count from the specified slot into active item. Delegates to `inst.components.inventory:TakeActiveItemFromCountOfSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
* **Returns:** nil
* **Error states:** None.

### `TakeActiveItemFromAllOfSlot(slot)`
* **Description:** Takes all items from the specified slot into active item. Delegates to `inst.components.inventory:TakeActiveItemFromAllOfSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
* **Returns:** nil
* **Error states:** None.

### `AddOneOfActiveItemToSlot(slot)`
* **Description:** Adds one item from active item to the stack in the specified slot. Delegates to `inst.components.inventory:AddOneOfActiveItemToSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
* **Returns:** nil
* **Error states:** None.

### `AddAllOfActiveItemToSlot(slot)`
* **Description:** Adds all of active item to the stack in the specified slot. Delegates to `inst.components.inventory:AddAllOfActiveItemToSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
* **Returns:** nil
* **Error states:** None.

### `SwapActiveItemWithSlot(slot)`
* **Description:** Swaps active item with the item in the specified slot. Delegates to `inst.components.inventory:SwapActiveItemWithSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
* **Returns:** nil
* **Error states:** None.

### `UseItemFromInvTile(item)`
* **Description:** Uses an item from the inventory tile. Delegates to `inst.components.inventory:UseItemFromInvTile()` if present, otherwise uses classified.
* **Parameters:**
  - `item` -- entity to use
* **Returns:** nil
* **Error states:** None.

### `ControllerUseItemOnItemFromInvTile(item, active_item)`
* **Description:** Uses active item on another item from inventory tile (controller input). Delegates to `inst.components.inventory:ControllerUseItemOnItemFromInvTile()` if present, otherwise uses classified.
* **Parameters:**
  - `item` -- target item entity
  - `active_item` -- active item entity
* **Returns:** nil
* **Error states:** None.

### `ControllerUseItemOnSelfFromInvTile(item)`
* **Description:** Uses item on self from inventory tile (controller input). Delegates to `inst.components.inventory:ControllerUseItemOnSelfFromInvTile()` if present, otherwise uses classified.
* **Parameters:**
  - `item` -- item entity to use
* **Returns:** nil
* **Error states:** None.

### `ControllerUseItemOnSceneFromInvTile(item)`
* **Description:** Uses item on scene from inventory tile (controller input). Delegates to `inst.components.inventory:ControllerUseItemOnSceneFromInvTile()` if present, otherwise uses classified.
* **Parameters:**
  - `item` -- item entity to use
* **Returns:** nil
* **Error states:** None.

### `InspectItemFromInvTile(item)`
* **Description:** Inspects an item from inventory tile. Delegates to `inst.components.inventory:InspectItemFromInvTile()` if present, otherwise uses classified.
* **Parameters:**
  - `item` -- item entity to inspect
* **Returns:** nil
* **Error states:** None.

### `DropItemFromInvTile(item, single)`
* **Description:** Drops an item from inventory tile. Delegates to `inst.components.inventory:DropItemFromInvTile()` if present, otherwise uses classified.
* **Parameters:**
  - `item` -- item entity to drop
  - `single` -- boolean to drop single item vs whole stack
* **Returns:** nil
* **Error states:** None.

### `CastSpellBookFromInv(item)`
* **Description:** Casts a spell from a spellbook item in inventory. Delegates to `inst.components.inventory:CastSpellBookFromInv()` if present, otherwise uses classified.
* **Parameters:**
  - `item` -- spellbook item entity
* **Returns:** nil
* **Error states:** None.

### `EquipActiveItem()`
* **Description:** Equips the active item if it is equippable. Delegates to `inst.components.inventory:EquipActiveItem()` if present, otherwise uses classified.
* **Parameters:** None.
* **Returns:** nil
* **Error states:** None.

### `EquipActionItem(item)`
* **Description:** Equips an action item. Delegates to `inst.components.inventory:EquipActionItem()` if present, otherwise uses classified.
* **Parameters:**
  - `item` -- item entity to equip
* **Returns:** nil
* **Error states:** None.

### `SwapEquipWithActiveItem()`
* **Description:** Swaps equipped item with active item. Delegates to `inst.components.inventory:SwapEquipWithActiveItem()` if present, otherwise uses classified.
* **Parameters:** None.
* **Returns:** nil
* **Error states:** None.

### `TakeActiveItemFromEquipSlot(eslot)`
* **Description:** Takes active item from the specified equip slot. Delegates to `inst.components.inventory:TakeActiveItemFromEquipSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `eslot` -- integer equip slot index
* **Returns:** nil
* **Error states:** None.

### `MoveItemFromAllOfSlot(slot, container)`
* **Description:** Moves all items from slot to a container. Delegates to `inst.components.inventory:MoveItemFromAllOfSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
  - `container` -- target container entity
* **Returns:** nil
* **Error states:** None.

### `MoveItemFromHalfOfSlot(slot, container)`
* **Description:** Moves half of items from slot to a container. Delegates to `inst.components.inventory:MoveItemFromHalfOfSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
  - `container` -- target container entity
* **Returns:** nil
* **Error states:** None.

### `MoveItemFromCountOfSlot(slot, container, count)`
* **Description:** Moves a specific count of items from slot to a container. Delegates to `inst.components.inventory:MoveItemFromCountOfSlot()` if present, otherwise uses classified.
* **Parameters:**
  - `slot` -- integer slot index
  - `container` -- target container entity
  - `count` -- number of items to move
* **Returns:** nil
* **Error states:** None.

### `OnVisibleDirty(classified)` (local)
* **Description:** Event callback fired when `visible` netvar changes. Shows or hides the inventory UI based on the new value.
* **Parameters:**
  - `classified` -- the classified entity
* **Returns:** nil
* **Error states:** None.

### `OnHeavyLiftingDirty(classified)` (local)
* **Description:** Event callback fired when `heavylifting` netvar changes. Updates action filter stack on `playeractionpicker` to restrict actions when heavy lifting.
* **Parameters:**
  - `classified` -- the classified entity
* **Returns:** nil
* **Error states:** None.

### `OnFloaterHeldDirty(classified)` (local)
* **Description:** Event callback fired when `floaterheld` netvar changes. Updates action filter stack and triggers stategraph events (`sg_startfloating` or `sg_stopfloating`).
* **Parameters:**
  - `classified` -- the classified entity
* **Returns:** nil
* **Error states:** None.

### `OpenInventory(inst, self)` (local)
* **Description:** Static task callback that opens the inventory after a delay. Hides inventory if entity is a revivable corpse with `corpse` tag.
* **Parameters:**
  - `inst` -- the entity instance
  - `self` -- the inventory component
* **Returns:** nil
* **Error states:** Errors if `inst.components.inventory` is nil (no guard before `:Open()` call). Errors if accessing `inst.components.revivablecorpse` when component is missing.

## Events & listeners
- **Listens to (on master):**
  - `newactiveitem` -- updates classified active item when active item changes. Data: `{item = entity}`
  - `itemget` -- updates classified slot when item is added. Data: `{slot = number, item = entity, src_pos = vector}`
  - `itemlose` -- clears classified slot when item is removed. Data: `{slot = number}`
  - `equip` -- updates classified equip slot. Data: `{eslot = number, item = entity}`
  - `unequip` -- clears classified equip slot. Data: `{eslot = number}`
- **Listens to (on client via classified):**
  - `visibledirty` -- triggers `OnVisibleDirty` when visibility netvar changes
  - `heavyliftingdirty` -- triggers `OnHeavyLiftingDirty` when heavy lifting netvar changes
  - `floaterhelddirty` -- triggers `OnFloaterHeldDirty` when floater held netvar changes
  - `onremove` (on classified) -- triggers detach callback when classified is removed
- **Pushes:**
  - `newactiveitem` -- fired in `DetachClassified()` to clear active item. Data: `{}`
  - `inventoryclosed` -- fired in `DetachClassified()` to signal inventory close. Data: none

**Note:** The netvars `visible`, `heavylifting`, and `floaterheld` belong to the `inventory_classified` prefab entity, not this component directly. This component reads/writes them via the classified entity reference.