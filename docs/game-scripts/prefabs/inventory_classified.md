---
id: inventory_classified
title: Inventory Classified
description: Client-side classified prefab that manages inventory state prediction and synchronization between client and server for player inventory operations.
tags: [inventory, network, player, ui, sync]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: fad42627
system_scope: inventory
---

# Inventory Classified

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`inventory_classified` is a classified prefab that handles client-side inventory state prediction and synchronization. It attaches to player entities and manages local preview states for inventory items, equipment slots, and active item operations while waiting for server confirmation. The prefab maintains separate server-authoritative state (via net_entity variables) and client preview state (via `_itemspreview`, `_equipspreview` tables) to provide responsive UI feedback during inventory interactions.

## Usage example
```lua
-- This prefab is automatically created and attached to player entities
-- Access via player entity's classified reference:
local player = ThePlayer
local inv_classified = player.inventory_classified

-- Check if inventory is busy (processing sync)
if not inv_classified:IsBusy() then
    -- Get item in specific slot
    local item = inv_classified:GetItemInSlot(1)
    
    -- Check if player has specific prefab
    local has, count = inv_classified:Has("log", 5)
    
    -- Find item by predicate function
    local food = inv_classified:FindItem(function(item)
        return item:HasTag("food")
    end)
end
```

## Dependencies & tags
**External dependencies:**
- `equipslotutil` -- provides EquipSlot utility functions and EQUIPSLOTS constants

**Components used:**
- `playercontroller` -- handles remote inventory actions via RPC calls
- `playeractionpicker` -- determines available actions for inventory items
- `spellbook` -- enables spell casting from inventory
- `constructionbuilderuidata` -- supports construction ingredient slot targeting
- `container` -- manages overflow container access and item transfers
- `inventoryitem` -- serializes usage state and pickup positions
- `stackable` -- handles stack size tracking and preview synchronization
- `equippable` -- manages equipment slot assignments

**Tags:**
- `CLASSIFIED` -- added to the classified entity itself
- `busy` -- checked on parent entity to prevent actions during sync
- `inspectable` -- checked before allowing item inspection
- `nocrafting` -- excluded from crafting ingredient counts when present
- `heavy` -- prevents certain inventory operations when equipped

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_refreshtask` | task | `nil` | Scheduled refresh task handle for inventory state updates. |
| `_busy` | boolean | `true` | Whether inventory is currently processing synchronization. |
| `_activeitem` | entity | `nil` | Currently active/held item in cursor (client preview). |
| `_returningitem` | entity | `nil` | Item being returned to container during operation. |
| `_returncontainer` | entity | `nil` | Container to return active item to after operation. |
| `_returnslot` | number | `nil` | Slot index to return active item to. |
| `_itemspreview` | table | `nil` | Client-side preview state for inventory slots. |
| `_equipspreview` | table | `nil` | Client-side preview state for equipment slots. |
| `ignoreoverflow` | boolean | `false` | Whether to ignore overflow container when checking space. |
| `visible` | net_bool | `false` | Network variable for inventory visibility state. |
| `heavylifting` | net_bool | `false` | Network variable for heavy lifting state. |
| `floaterheld` | net_bool | `false` | Network variable for floater held state. |
| `_active` | net_entity | `nil` | Network variable for active item entity reference. |
| `_items` | table | `{}` | Array of net_entity variables for inventory slots. |
| `_equips` | table | `{}` | Table of net_entity variables for equipment slots. |
| `_slottasks` | table | `nil` | Task handles for slot dirty event debouncing. |

## Main functions
### `SetActiveItem(inst, item)`
* **Description:** Server-side function that sets the active item and serializes its usage state. Clears active item if validation fails. **Server-only:** Only available when `TheWorld.ismastersim` is true.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- item entity or nil to clear
* **Returns:** None
* **Error states:** None

### `SetSlotItem(inst, slot, item, src_pos)`
* **Description:** Server-side function that sets an item in a specific inventory slot and serializes usage with pickup position. **Server-only:** Only available when `TheWorld.ismastersim` is true.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
  - `item` -- item entity or nil to clear
  - `src_pos` -- vector3 pickup position
* **Returns:** None
* **Error states:** None

### `SetSlotEquip(inst, eslot, item)`
* **Description:** Server-side function that sets an item in a specific equipment slot and serializes usage state. **Server-only:** Only available when `TheWorld.ismastersim` is true.
* **Parameters:**
  - `inst` -- classified entity instance
  - `eslot` -- equipment slot constant (e.g., EQUIPSLOTS.HANDS)
  - `item` -- item entity or nil to clear
* **Returns:** None
* **Error states:** None







### `IsBusy(inst)`
* **Description:** Checks if inventory is currently busy processing synchronization or parent is nil.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** boolean -- true if busy or parent is nil
* **Error states:** None

### `IsHolding(inst, item, checkcontainer)`
* **Description:** Checks if inventory is holding an item in active slot, inventory slots, equipment slots, or preview states.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- item entity to search for
  - `checkcontainer` -- boolean whether to check container holdings
* **Returns:** boolean -- true if item is held anywhere in inventory
* **Error states:** None

### `GetActiveItem(inst)`
* **Description:** Returns the currently active/held item in cursor.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** Entity instance or nil
* **Error states:** None

### `GetItemInSlot(inst, slot)`
* **Description:** Returns item in specified inventory slot, using preview state if available.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
* **Returns:** Entity instance or nil
* **Error states:** None

### `GetEquippedItem(inst, eslot)`
* **Description:** Returns item in specified equipment slot, using preview state if available.
* **Parameters:**
  - `inst` -- classified entity instance
  - `eslot` -- equipment slot constant
* **Returns:** Entity instance or nil
* **Error states:** None



### `GetItems(inst)`
* **Description:** Returns array of actual items in inventory slots, excluding active item.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** Table of entity instances
* **Error states:** None

### `GetEquips(inst)`
* **Description:** Returns table of actual items in equipment slots, excluding active item.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** Table of entity instances keyed by equipment slot
* **Error states:** None

### `GetOverflowContainer(inst)`
* **Description:** Returns overflow container from body equipment if ignoreoverflow is false.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** Container component replica or nil
* **Error states:** None

### `IsFull(inst)`
* **Description:** Checks if all inventory slots are occupied.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** boolean -- true if all slots are filled
* **Error states:** None



### `Has(inst, prefab, amount, checkallcontainers)`
* **Description:** Checks if inventory has required amount of prefab, optionally including open containers.
* **Parameters:**
  - `inst` -- classified entity instance
  - `prefab` -- string prefab name
  - `amount` -- required quantity
  - `checkallcontainers` -- boolean whether to include open containers
* **Returns:** boolean has, number count -- whether requirement met and total count found
* **Error states:** None

### `HasItemWithTag(inst, tag, amount)`
* **Description:** Checks if inventory has required amount of items with specific tag.
* **Parameters:**
  - `inst` -- classified entity instance
  - `tag` -- string tag to search for
  - `amount` -- required quantity
* **Returns:** boolean has, number count -- whether requirement met and total count found
* **Error states:** None

### `FindItem(inst, fn)`
* **Description:** Finds first item matching predicate function in inventory, active item, or overflow.
* **Parameters:**
  - `inst` -- classified entity instance
  - `fn` -- function(item) returning boolean
* **Returns:** Entity instance or nil
* **Error states:** None

### `QueueRefresh(inst, delay)`
* **Description:** Schedules inventory refresh task and sets busy state. Cancels crafting refresh on player if delay is 0.
* **Parameters:**
  - `inst` -- classified entity instance
  - `delay` -- number seconds to wait before refresh
* **Returns:** None
* **Error states:** None



















### `PushNewActiveItem(inst, data, returncontainer, returnslot)`
* **Description:** Sets new active item with proxy and pushes newactiveitem event to parent.
* **Parameters:**
  - `inst` -- classified entity instance
  - `data` -- table with item reference
  - `returncontainer` -- container to return item to
  - `returnslot` -- slot to return item to
* **Returns:** None
* **Error states:** None

### `UseActiveItemProxy(inst)`
* **Description:** Creates proxy for active item if it doesn't have preview context set.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** None
* **Error states:** None

### `PushItemGet(inst, data, ignoresound)`
* **Description:** Updates preview state for item received in slot and pushes gotnewitem/itemget events.
* **Parameters:**
  - `inst` -- classified entity instance
  - `data` -- table with item and slot
  - `ignoresound` -- boolean whether to skip sound event
* **Returns:** None
* **Error states:** None

### `PushItemLose(inst, data)`
* **Description:** Updates preview state for item lost from slot and pushes itemlose event.
* **Parameters:**
  - `inst` -- classified entity instance
  - `data` -- table with slot index
* **Returns:** None
* **Error states:** None

### `PushEquip(inst, data)`
* **Description:** Updates preview state for equipped item and pushes equip event.
* **Parameters:**
  - `inst` -- classified entity instance
  - `data` -- table with item and eslot
* **Returns:** None
* **Error states:** None

### `PushUnequip(inst, data)`
* **Description:** Updates preview state for unequipped item and pushes unequip event.
* **Parameters:**
  - `inst` -- classified entity instance
  - `data` -- table with eslot
* **Returns:** None
* **Error states:** None

### `PushStackSize(inst, item, stacksize, animatestacksize, activestacksize, animateactivestacksize, selfonly, sounddata)`
* **Description:** Updates preview stack size for item and pushes stacksizepreview event. Handles complex stack splitting scenarios.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- item entity
  - `stacksize` -- new stack size or nil
  - `animatestacksize` -- boolean whether to animate change
  - `activestacksize` -- active item stack size or nil
  - `animateactivestacksize` -- boolean whether to animate active change
  - `selfonly` -- boolean whether update is local only
  - `sounddata` -- optional sound event data
* **Returns:** None
* **Error states:** None

### `ReturnActiveItem(inst)`
* **Description:** Returns active item to its original container slot. Sends RPC to server.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** None
* **Error states:** None

### `ReturnActiveItemToSlot(inst, slot)`
* **Description:** Returns active item to specific slot, handling stacking if slot has compatible item.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `PutOneOfActiveItemInSlot(inst, slot)`
* **Description:** Moves one item from active stack to specified slot. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `PutAllOfActiveItemInSlot(inst, slot)`
* **Description:** Moves entire active item stack to specified slot. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `TakeActiveItemFromHalfOfSlot(inst, slot)`
* **Description:** Takes half of stack from slot into active item. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `TakeActiveItemFromCountOfSlot(inst, slot, count)`
* **Description:** Takes specified count from slot into active item. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
  - `count` -- number of items to take
* **Returns:** None
* **Error states:** None

### `TakeActiveItemFromAllOfSlot(inst, slot)`
* **Description:** Takes entire stack from slot into active item. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `AddOneOfActiveItemToSlot(inst, slot)`
* **Description:** Adds one item from active stack to existing slot stack. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `AddAllOfActiveItemToSlot(inst, slot)`
* **Description:** Adds entire active stack to existing slot stack, respecting max size. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
* **Returns:** None
* **Error states:** None

### `SwapActiveItemWithSlot(inst, slot)`
* **Description:** Swaps active item with item in specified slot. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
* **Returns:** None
* **Error states:** None



### `UseItemFromInvTile(inst, item)`
* **Description:** Uses item from inventory tile with active item as target. Determines actions via playeractionpicker.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- target item entity
* **Returns:** None
* **Error states:** None

### `ControllerUseItemOnItemFromInvTile(inst, item, active_item)`
* **Description:** Controller input handler for using item on another item from inventory.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- target item entity
  - `active_item` -- active/held item entity
* **Returns:** None
* **Error states:** None

### `ControllerUseItemOnSelfFromInvTile(inst, item)`
* **Description:** Controller input handler for using item on self from inventory (equip/unequip).
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- item entity to use
* **Returns:** None
* **Error states:** None

### `ControllerUseItemOnSceneFromInvTile(inst, item)`
* **Description:** Controller input handler for using item on scene target from inventory.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- item entity to use
* **Returns:** None
* **Error states:** None

### `InspectItemFromInvTile(inst, item)`
* **Description:** Sends inspect action for item from inventory tile. Only proceeds if item has "inspectable" tag and parent has `playercontroller` component.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- item entity to inspect
* **Returns:** None
* **Error states:** None

### `DropItemFromInvTile(inst, item, single)`
* **Description:** Drops item from inventory tile. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- item entity to drop
  - `single` -- boolean whether to drop single item or stack
* **Returns:** None
* **Error states:** None

### `CastSpellBookFromInv(inst, item)`
* **Description:** Casts spell from spellbook item in inventory. Only proceeds if item has `spellbook` component and parent has `playercontroller` component.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- spellbook item entity
* **Returns:** None
* **Error states:** None

### `EquipActiveItem(inst)`
* **Description:** Equips active item to its designated equipment slot. Sends RPC to server.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** None
* **Error states:** Errors if active item has no equippable replica component (accesses EquipSlot() on inst._activeitem.replica.equippable without component existence check).

### `EquipActionItem(inst, item)`
* **Description:** Equips item as action item, handling cursor inventory interactions. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- item entity to equip
* **Returns:** None
* **Error states:** Errors if item has no equippable replica component (accesses EquipSlot() on item.replica.equippable without component existence check).

### `SwapEquipWithActiveItem(inst)`
* **Description:** Swaps active item with currently equipped item in same slot. Sends RPC to server.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** None
* **Error states:** Errors if active item has no equippable replica component (accesses EquipSlot() on inst._activeitem.replica.equippable without component existence check).

### `TakeActiveItemFromEquipSlot(inst, eslot)`
* **Description:** Takes equipped item from slot into active item. Sends RPC to server.
* **Parameters:**
  - `inst` -- classified entity instance
  - `eslot` -- equipment slot constant
* **Returns:** None
* **Error states:** None

### `MoveItemFromAllOfSlot(inst, slot, container)`
* **Description:** Moves entire stack from inventory slot to target container. Handles construction builder targeting.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
  - `container` -- target container entity
* **Returns:** None
* **Error states:** None

### `MoveItemFromHalfOfSlot(inst, slot, container)`
* **Description:** Moves half of stack from inventory slot to target container.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
  - `container` -- target container entity
* **Returns:** None
* **Error states:** None

### `MoveItemFromCountOfSlot(inst, slot, container, count)`
* **Description:** Moves specified count from inventory slot to target container.
* **Parameters:**
  - `inst` -- classified entity instance
  - `slot` -- integer slot index
  - `container` -- target container entity
  - `count` -- number of items to move
* **Returns:** None
* **Error states:** None



### `ReceiveItem(inst, item, count)`
* **Description:** Receives item into inventory, handling stacking and overflow. Supports recursive calls via internalloop flag.
* **Parameters:**
  - `inst` -- classified entity instance
  - `item` -- item entity to receive
  - `count` -- number of items to receive (optional)
* **Returns:** number remainder -- items that couldn't be placed, or nil if all placed
* **Error states:** Errors if item has no replica table (accesses item.replica without nil guard at function start).



### `RemoveIngredients(inst, recipe, ingredientmod)`
* **Description:** Removes recipe ingredients from inventory for crafting. Checks all open containers.
* **Parameters:**
  - `inst` -- classified entity instance
  - `recipe` -- recipe table with ingredients array
  - `ingredientmod` -- number multiplier for ingredient amounts
* **Returns:** boolean -- true if ingredients were successfully removed
* **Error states:** Returns false if inventory is busy or overflow container is busy (early return, not an error). Returns false if open containers lack classified references.



## Events & listeners
**Listens to:**
- `activedirty` -- triggers OnActiveDirty handler for active item changes
- `items[i]dirty` -- triggers OnItemsDirty handler for inventory slot changes (per slot)
- `equips[k]dirty` -- triggers OnEquipsDirty handler for equipment slot changes (per slot)
- `stackitemdirty` (TheWorld) -- triggers OnStackItemDirty handler for stack size changes

**Pushes:**
- `refreshinventory` -- fired when inventory state is refreshed
- `newactiveitem` -- fired when active item changes
- `gotnewitem` -- fired when item is received in slot
- `itemget` -- fired when item is acquired
- `itemlose` -- fired when item is lost from slot
- `equip` -- fired when item is equipped
- `unequip` -- fired when item is unequipped
- `stacksizechange` -- fired when stack size changes
- `stacksizepreview` -- fired for preview stack size updates