---
id: inventoryitemholder
title: Inventoryitemholder
description: Manages a single held item that can be given to or taken from an entity, with support for stacking and item lifecycle tracking.
tags: [inventory, item, holder, entity]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 8afb79ba
system_scope: inventory
---

# Inventoryitemholder

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`InventoryItemHolder` manages a single held item that can be given to or taken from an entity at any time. It handles item stacking validation, parent-child relationships, and event tracking for item lifecycle changes. The held item is removed from the scene and attached as a child to the holder entity. Does not support perishable items. The item drops when the structure finishes burning.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitemholder")

-- Configure what items can be given
inst.components.inventoryitemholder:SetAllowedTags({ "food", "seed" })
inst.components.inventoryitemholder:SetAcceptStacks(true)

-- Set callbacks for item transactions
inst.components.inventoryitemholder:SetOnItemGivenFn(function(holder, item, giver)
    print("Item given:", item.prefab)
end)

-- Give an item to the holder
local item = SpawnPrefab("carrot")
inst.components.inventoryitemholder:GiveItem(item, player)

-- Take the item back
inst.components.inventoryitemholder:TakeItem(player)
```

## Dependencies & tags
**Components used:**
- `inventory` — used for DropItem and GiveItem operations on giver/taker entities
- `inventoryitem` — used for GetGrandOwner, HibernateLivingItem, InheritWorldWetnessAtTarget, OnDropped
- `stackable` — used for CanStackWith, Get, IsFull, Put when handling stacked items

**Tags:**
- `inventoryitemholder_take` — added when holding an item (entity can be taken from)
- `inventoryitemholder_give` — added when entity can accept items (removed when holding non-stackable or full stack)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `item` | entity | `nil` | The currently held item entity. Assignment triggers `onitem` watcher. |
| `allowed_tags` | table | `nil` | List of tags that items must have to be accepted. `nil` means no restrictions. |
| `acceptstacks` | boolean | `false` | Whether the holder accepts stacking items onto an existing held item. Assignment triggers `onacceptstacks` watcher. |
| `onitemgivenfn` | function | `nil` | Callback fired when an item is successfully given. Signature: `fn(holder, item, giver)`. |
| `onitemtakenfn` | function | `nil` | Callback fired when an item is successfully taken. Signature: `fn(holder, item, taker, was_full_stack)`. |
| `_onitemremoved` | function | — | Internal callback that clears `self.item` when the held item is removed. |
| `_onitemmissing` | function | — | Internal callback that handles cleanup when the held item is dropped or put in inventory. |

## Main functions
### `SetAllowedTags(tags)`
* **Description:** Sets the list of tags that items must have to be accepted by this holder.
* **Parameters:** `tags` -- table of string tag names, or `nil` for no restrictions.
* **Returns:** nil
* **Error states:** None

### `SetOnItemGivenFn(fn)`
* **Description:** Sets the callback function to fire when an item is successfully given to the holder.
* **Parameters:** `fn` -- function with signature `fn(holder, item, giver)`. Note: `item` may be `nil` if it was stacked onto an existing held item.
* **Returns:** nil
* **Error states:** None

### `SetOnItemTakenFn(fn)`
* **Description:** Sets the callback function to fire when an item is successfully taken from the holder.
* **Parameters:** `fn` -- function with signature `fn(holder, item, taker, was_full_stack)`. Note: `item` may be invalid if it was stacked.
* **Returns:** nil
* **Error states:** None

### `SetAcceptStacks(bool)`
* **Description:** Configures whether the holder accepts stacking items onto an existing held item.
* **Parameters:** `bool` -- boolean value (converted to `true`/`false` explicitly).
* **Returns:** nil
* **Error states:** None

### `IsHolding()`
* **Description:** Returns whether the holder currently has an item.
* **Parameters:** None
* **Returns:** `true` if `self.item` is not `nil`, `false` otherwise.
* **Error states:** None

### `CanGive(item, giver)`
* **Description:** Checks if an item can be given to this holder. Validates inventoryitem component, allowed tags, and stacking rules.
* **Parameters:**
  - `item` -- entity to check
  - `giver` -- entity attempting to give (not used in validation)
* **Returns:** `true` if item can be given, `false` otherwise.
* **Error states:** Errors if `item` has no `inventoryitem` component (nil dereference on `item.components.inventoryitem` — no guard present).

### `CanTake(taker)`
* **Description:** Checks if there is a valid item that can be taken from this holder.
* **Parameters:** `taker` -- entity attempting to take (not used in validation).
* **Returns:** `true` if `self.item` exists and is valid, `false` otherwise.
* **Error states:** None

### `GiveItem(item, giver)`
* **Description:** Attempts to give an item to this holder. Handles owner inventory dropping, stacking onto existing held items, and event registration for item lifecycle tracking.
* **Parameters:**
  - `item` -- entity to give
  - `giver` -- entity giving the item
* **Returns:** `true` if successful, `false` if validation fails.
* **Error states:** Errors if `giver` has no `inventory` component when dropping from owner inventory (nil dereference on `owner.components.inventory` — no guard present beyond owner check). Errors if `item` has no `inventoryitem` component (checked in CanGive but accessed again without re-validation).

### `TakeItem(taker, wholestack)`
* **Description:** Takes the held item and gives it to the taker's inventory or drops it at the holder's position. Handles partial stack extraction if `wholestack` is false.
* **Parameters:**
  - `taker` -- entity to receive the item (optional)
  - `wholestack` -- boolean, defaults to `true`. If `false` and item is stackable, extracts one item from the stack.
* **Returns:** `true` if successful, `false` if no valid item to take.
* **Error states:** Errors if held `item` has no `inventoryitem` component (nil dereference on `item.components.inventoryitem:InheritWorldWetnessAtTarget` — no guard present). Errors if `taker` is valid but has no `inventory` component (nil dereference on `taker.components.inventory:GiveItem` — guarded by `taker.components.inventory ~= nil` check).

### `OnSave()`
* **Description:** Serializes the held item for world save. Returns save data table and references if item persists.
* **Parameters:** None
* **Returns:** Save data table and references, or `nil` if no item or item doesn't persist.
* **Error states:** None

### `OnLoad(data, newents)`
* **Description:** Restores the held item from save data by spawning the saved record and giving it to the holder.
* **Parameters:**
  - `data` -- save data table from OnSave
  - `newents` — entity mapping for save record spawning
* **Returns:** None
* **Error states:** None

### `OnRemoveFromEntity()`
* **Description:** Cleanup handler called when the component is removed from an entity. Takes the held item and removes holder tags.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns a debug string showing the held item and allowed tags for console inspection.
* **Parameters:** None
* **Returns:** Formatted string with item and allowed tags info.
* **Error states:** None

### `onitem(self, item)` (local)
* **Description:** Property watcher callback fired when `self.item` is assigned. Updates holder tags based on whether an item is held and stacking configuration.
* **Parameters:**
  - `self` -- component instance
  - `item` -- the new item value (entity or `nil`)
* **Returns:** None
* **Error states:** None

### `onacceptstacks(self, acceptstacks)` (local)
* **Description:** Property watcher callback fired when `self.acceptstacks` is assigned. Adds `inventoryitemholder_give` tag if stacks are accepted.
* **Parameters:**
  - `self` -- component instance
  - `acceptstacks` -- the new boolean value
* **Returns:** None
* **Error states:** None

### `_onitemremoved(item)` (local)
* **Description:** Internal callback that clears `self.item` when the held item is removed from the world.
* **Parameters:** `item` -- the removed item entity.
* **Returns:** None
* **Error states:** None

### `_onitemmissing(item)` (local)
* **Description:** Internal callback that handles cleanup when the held item is dropped or put in inventory unexpectedly. Removes event listeners, clears tags, and fires `onitemtakenfn` callback.
* **Parameters:** `item` -- the item that went missing.
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:**
  - `onremove` — triggers `_onitemremoved`; clears `self.item` when held item is removed from world
  - `ondropped` — triggers `_onitemmissing`; handles cleanup when held item is dropped
  - `onputininventory` — triggers `_onitemmissing`; handles cleanup when held item is put in inventory