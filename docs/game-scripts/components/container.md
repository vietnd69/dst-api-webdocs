---
id: container
title: Container
description: Manages item storage, slot management, and container UI interactions for entities that can hold inventory items.
tags: [inventory, storage, ui, items]
sidebar_position: 10

last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: components
source_hash: f515acfd
system_scope: inventory
---

# Container

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`Container` is the core component for managing item storage on entities such as chests, backpacks, and player inventories. It handles slot allocation, item insertion/removal, stacking behavior, and container open/close state tracking. Works closely with `inventoryitem`, `stackable`, and `inventory` components to coordinate item transfers between entities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("container")
inst.components.container:SetNumSlots(9)
inst.components.container:WidgetSetup("chest", { widget = "chest" })

local item = SpawnPrefab("rocks")
inst.components.container:GiveItem(item, 1)

inst.components.container:Open(player)
local hasItem = inst.components.container:Has("rocks", 1)
inst.components.container:Close(player)
```

## Dependencies & tags
**External dependencies:**
- `containers` -- module for widget setup and container type definitions

**Components used:**
- `inventory` -- tracks open containers and manages item transfers
- `inventoryitem` -- validates item placement, handles owner changes on drop/put
- `stackable` -- manages stack sizes, stacking compatibility, and overstacked items
- `equippable` -- checked to prevent equippables in containers when game mode restricts
- `playeractionpicker` -- registers/unregisters container for player action context
- `constructionbuilderuidata` -- retrieves target slot for construction ingredients
- `preserver` -- added automatically when read-only mode is enabled
- `rider` -- checks mount relationship for auto-close logic

**Tags:**
- `portablestorage` -- checked for special auto-close behavior when in inventory
- `keep_pocket_rummage` -- checked on stategraph to prevent auto-close
- `nocrafting` -- excludes items from crafting ingredient searches
- `player` -- checked for restricted tag validation

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | N/A | The entity instance that owns this component. |
| `slots` | table | `{}` | Table mapping slot indices to item entities. |
| `numslots` | number | `0` | Total number of slots in the container. |
| `canbeopened` | boolean | `true` | Whether the container can be opened by players. |
| `skipopensnd` | boolean | `false` | Skip playing sound when container opens. |
| `skipclosesnd` | boolean | `false` | Skip playing sound when container closes. |
| `acceptsstacks` | boolean | `true` | Whether the container allows stacked items. |
| `infinitestacksize` | boolean | `false` | Readonly. Allows stacks to exceed normal max size. |
| `readonlycontainer` | boolean | `false` | Readonly. Prevents items from being added or removed. |
| `usespecificslotsforitems` | boolean | `false` | Items must go to specific slots defined by `itemtestfn`. |
| `issidewidget` | boolean | `false` | Container UI displays as a side widget (e.g., backpack). |
| `type` | string/nil | `nil` | Container type identifier for matching similar containers. |
| `widget` | table/nil | `nil` | Widget configuration data for UI display. |
| `itemtestfn` | function/nil | `nil` | Custom function to validate if item can go in slot. |
| `priorityfn` | function/nil | `nil` | Custom function to prioritize this container for items. |
| `openlist` | table | `{}` | Maps opener entities to open state. |
| `opencount` | number | `0` | Number of players currently viewing this container. |
| `ignoresound` | boolean | `false` | Temporarily suppresses sound during item transfers. |
| `ignoreoverstacked` | boolean | `false` | Temporarily allows overstacked items during transfers. |
| `openlimit` | number/nil | `nil` | Maximum number of simultaneous openers. If nil, no limit is enforced. Configured via WidgetSetup. |

## Main functions

### `WidgetSetup(prefab, data)`
* **Description:** Configures the container's UI widget using prefab and data parameters. Makes widget properties readonly after setup.
* **Parameters:**
  - `prefab` -- string prefab name for the container type
  - `data` -- table containing widget configuration
* **Returns:** None
* **Error states:** None

### `GetWidget()`
* **Description:** Returns the widget configuration table for this container.
* **Parameters:** None
* **Returns:** Widget table or `nil` if not configured.

### `NumItems()`
* **Description:** Returns the count of items currently in the container.
* **Parameters:** None
* **Returns:** Number of non-nil slots occupied.

### `IsFull()`
* **Description:** Checks if all slots are occupied.
* **Parameters:** None
* **Returns:** `true` if occupied slots >= `numslots`, `false` otherwise.

### `IsEmpty()`
* **Description:** Checks if the container has no items.
* **Parameters:** None
* **Returns:** `true` if `slots` table is empty, `false` otherwise.

### `SetNumSlots(numslots)`
* **Description:** Sets the total number of slots. Must be >= current `numslots`.
* **Parameters:** `numslots` -- new slot count (must be >= current value)
* **Returns:** None
* **Error states:** Asserts if `numslots` < current `self.numslots`.

### `DropItemBySlot(slot, drop_pos, keepoverstacked)`
* **Description:** Drops the item at the specified slot at `drop_pos`. Handles locked items and internal containers.
* **Parameters:**
  - `slot` -- integer slot index
  - `drop_pos` -- Vector3 position to drop at (defaults to container position)
  - `keepoverstacked` -- boolean to preserve overstacked state
* **Returns:** Dropped item entity or `nil` if slot empty or item locked.
* **Error states:** Asserts in dev branch if item is locked in slot.

### `DropEverythingWithTag(tag, drop_pos, keepoverstacked)`
* **Description:** Drops all items with the specified tag. Recursively handles nested containers.
* **Parameters:**
  - `tag` -- string tag to match
  - `drop_pos` -- Vector3 position to drop at
  - `keepoverstacked` -- boolean to preserve overstacked state
* **Returns:** None

### `DropEverythingByFilter(filterfn)`
* **Description:** Drops all items matching the filter function. Recursively handles nested containers.
* **Parameters:** `filterfn` -- function(container_inst, item) returning boolean
* **Returns:** None

### `DropEverything(drop_pos, keepoverstacked)`
* **Description:** Drops all non-locked items in the container. Recursively handles nested containers.
* **Parameters:**
  - `drop_pos` -- Vector3 position to drop at
  - `keepoverstacked` -- boolean to preserve overstacked state
* **Returns:** None

### `DropEverythingUpToMaxStacks(maxstacks, drop_pos)`
* **Description:** Drops items until `maxstacks` number of stacks have been dropped.
* **Parameters:**
  - `maxstacks` -- maximum number of stacks to drop
  - `drop_pos` -- Vector3 position to drop at
* **Returns:** None

### `DropItem(itemtodrop)`
* **Description:** Drops a specific item at the container's world position. Note: Not supported when using container_proxy as this will be the pocket dimension_container at (0, 0, 0) (V2C).
* **Parameters:** `itemtodrop` -- entity to drop
* **Returns:** None
* **Error states:** None

### `DropOverstackedExcess(item)`
* **Description:** Drops excess items from a stack that exceeds its original max size.
* **Parameters:** `item` -- entity with stackable component
* **Returns:** None

### `DropItemAt(itemtodrop, x, y, z)`
* **Description:** Drops a specific item at the specified coordinates.
* **Parameters:**
  - `itemtodrop` -- entity to drop
  - `x` -- number or Vector3 for x coordinate
  - `y` -- number for y coordinate (if x is number)
  - `z` -- number for z coordinate (if x is number)
* **Returns:** Dropped item entity or `nil` if item invalid or locked.
* **Error states:** Asserts in dev branch if item is locked in slot.

### `CanTakeItemInSlot(item, slot)`
* **Description:** Validates if an item can be placed in the specified slot.
* **Parameters:**
  - `item` -- entity to validate
  - `slot` -- integer slot index (optional)
* **Returns:** `true` if item can be placed, `false` otherwise.

### `GetSpecificSlotForItem(item)`
* **Description:** Returns the specific slot index for an item if `usespecificslotsforitems` is enabled.
* **Parameters:** `item` -- entity to find slot for
* **Returns:** Integer slot index or `nil`.

### `ShouldPrioritizeContainer(item)`
* **Description:** Checks if this container should be prioritized for the given item via `priorityfn`.
* **Parameters:** `item` -- entity to check priority for
* **Returns:** `true` if prioritized, `false` otherwise.

### `AcceptsStacks()`
* **Description:** Returns whether the container allows stacked items.
* **Parameters:** None
* **Returns:** Boolean value of `acceptsstacks`.

### `IsSideWidget()`
* **Description:** Returns whether the container displays as a side widget.
* **Parameters:** None
* **Returns:** Boolean value of `issidewidget`.

### `DestroyContents(onpredestroyitemcallbackfn)`
* **Description:** Removes and destroys all items in the container.
* **Parameters:** `onpredestroyitemcallbackfn` -- optional callback before each item is destroyed
* **Returns:** None

### `DestroyContentsConditionally(filterfn, onpredestroyitemcallbackfn)`
* **Description:** Removes and destroys items matching the filter function.
* **Parameters:**
  - `filterfn` -- function(container_inst, item) returning boolean
  - `onpredestroyitemcallbackfn` -- optional callback before each item is destroyed
* **Returns:** None

### `CanAcceptCount(item, maxcount)`
* **Description:** Calculates how many items from a stack the container can accept.
* **Parameters:**
  - `item` -- entity to check acceptance for
  - `maxcount` -- maximum count to accept (optional)
* **Returns:** Number of items that can be accepted.

### `GiveItem(item, slot, src_pos, drop_on_fail)`
* **Description:** Attempts to place an item in the container. Handles stacking and slot assignment.
* **Parameters:**
  - `item` -- entity to add
  - `slot` -- target slot index (optional)
  - `src_pos` -- source position for event data (optional)
  - `drop_on_fail` -- boolean to drop item if placement fails (default `true`)
* **Returns:** `true` if item was placed, `false` otherwise.

### `RemoveItemBySlot(slot, keepoverstacked)`
* **Description:** Removes and returns the item at the specified slot.
* **Parameters:**
  - `slot` -- integer slot index
  - `keepoverstacked` -- boolean to preserve overstacked state (optional)
* **Returns:** Removed item entity or `nil`.

### `RemoveAllItems()`
* **Description:** Removes all items from the container and returns them.
* **Parameters:** None
* **Returns:** Table of removed item entities.

### `GetNumSlots()`
* **Description:** Returns the total number of slots in the container.
* **Parameters:** None
* **Returns:** Integer value of `numslots`.

### `GetItemInSlot(slot)`
* **Description:** Returns the item entity at the specified slot.
* **Parameters:** `slot` -- integer slot index
* **Returns:** Item entity or `nil` if slot is empty.

### `GetItemSlot(item)`
* **Description:** Returns the slot index containing the specified item.
* **Parameters:** `item` -- entity to find slot for
* **Returns:** Integer slot index or `nil` if not found.

### `GetAllItems()`
* **Description:** Returns a table of all non-nil items in the container.
* **Parameters:** None
* **Returns:** Table of item entities.

### `Open(doer)`
* **Description:** Opens the container for the specified player. Handles UI, sounds, and opener tracking.
* **Parameters:** `doer` -- player entity opening the container
* **Returns:** None
* **Error states:** None (silently ignores if already opened by doer).

### `Close(doer)`
* **Description:** Closes the container for the specified player. Handles UI, sounds, and opener tracking.
* **Parameters:** `doer` -- player entity closing the container (optional, closes all if nil)
* **Returns:** None
* **Error states:** None (silently ignores if not opened by doer).

### `IsOpen()`
* **Description:** Checks if the container is currently open by any player.
* **Parameters:** None
* **Returns:** `true` if `opencount` > 0, `false` otherwise.

### `IsOpenedBy(guy)`
* **Description:** Checks if a specific player has this container open.
* **Parameters:** `guy` -- player entity to check
* **Returns:** `true` if player is in `openlist`, `false` otherwise.

### `IsOpenedByOthers(guy)`
* **Description:** Checks if any player other than the specified one has this container open.
* **Parameters:** `guy` -- player entity to exclude from check
* **Returns:** `true` if other openers exist, `false` otherwise.

### `CanOpen()`
* **Description:** Checks if the container can be opened (respects `openlimit` if set).
* **Parameters:** None
* **Returns:** `true` if under open limit, `false` otherwise.

### `GetOpeners()`
* **Description:** Returns a table of all players currently viewing this container.
* **Parameters:** None
* **Returns:** Table of player entities.

### `IsHolding(item, checkcontainer)`
* **Description:** Checks if the container holds the specified item, optionally checking nested containers.
* **Parameters:**
  - `item` -- entity to search for
  - `checkcontainer` -- boolean to recursively check nested containers (optional)
* **Returns:** `true` if item found, `false` otherwise.

### `FindItem(fn)`
* **Description:** Returns the first item matching the predicate function.
* **Parameters:** `fn` -- function(item) returning boolean
* **Returns:** First matching item entity or `nil`.

### `FindItems(fn)`
* **Description:** Returns all items matching the predicate function.
* **Parameters:** `fn` -- function(item) returning boolean
* **Returns:** Table of matching item entities.

### `ForEachItem(fn, ...)`
* **Description:** Iterates over all items in the container, calling the function for each.
* **Parameters:**
  - `fn` -- function(item, ...) to call for each item
  - `...` -- additional arguments passed to fn
* **Returns:** None

### `Has(item, amount, iscrafting)`
* **Description:** Checks if the container has at least `amount` of the specified prefab.
* **Parameters:**
  - `item` -- string prefab name
  - `amount` -- number required
  - `iscrafting` -- boolean to exclude items with "nocrafting" tag
* **Returns:** Boolean (has enough), number (actual count found).

### `HasItemThatMatches(fn, amount)`
* **Description:** Checks if the container has at least `amount` of items matching the function.
* **Parameters:**
  - `fn` -- function(item) returning boolean
  - `amount` -- number required
* **Returns:** Boolean (has enough), number (actual count found).

### `HasItemWithTag(tag, amount)`
* **Description:** Checks if the container has at least `amount` of items with the specified tag.
* **Parameters:**
  - `tag` -- string tag to match
  - `amount` -- number required
* **Returns:** Boolean (has enough), number (actual count found).

### `GetItemsWithTag(tag)`
* **Description:** Returns all items with the specified tag.
* **Parameters:** `tag` -- string tag to match
* **Returns:** Table of matching item entities.

### `GetItemByName(item, amount)`
* **Description:** Returns a table mapping items to counts for the specified prefab up to `amount`.
* **Parameters:**
  - `item` -- string prefab name
  - `amount` -- total count needed
* **Returns:** Table of `{item_entity = count}` mappings.

### `GetCraftingIngredient(item, amount, reverse_search_order)`
* **Description:** Returns crafting ingredients for the specified prefab, prioritizing smaller stacks.
* **Parameters:**
  - `item` -- string prefab name
  - `amount` -- total count needed
  - `reverse_search_order` -- boolean to search from end of slots first
* **Returns:** Table of `{item_entity = count}` mappings.

### `ConsumeByName(item, amount)`
* **Description:** Removes and destroys `amount` of the specified prefab from the container.
* **Parameters:**
  - `item` -- string prefab name
  - `amount` -- number to consume
* **Returns:** None

### `OnSave()`
* **Description:** Serializes container contents for save data.
* **Parameters:** None
* **Returns:** Save data table, references table.

### `OnLoad(data, newents)`
* **Description:** Restores container contents from save data.
* **Parameters:**
  - `data` -- save data table with items
  - `newents` -- entity mapping for save references
* **Returns:** None

### `RemoveItem(item, wholestack, _checkallcontainers_, keepoverstacked)`
* **Description:** Removes an item from the container by entity reference.
* **Parameters:**
  - `item` -- entity to remove
  - `wholestack` -- boolean to remove entire stack (optional)
  - `_checkallcontainers_` -- unused parameter for interface compatibility
  - `keepoverstacked` -- boolean to preserve overstacked state (optional)
* **Returns:** Removed item entity or `nil`.

### `RemoveItem_Internal(item, slot, wholestack, keepoverstacked)`
* **Description:** Internal method to remove an item from a specific slot. Returns `nil` if `readonlycontainer` is enabled (graceful handling).
* **Parameters:**
  - `item` -- entity to remove
  - `slot` -- integer slot index
  - `wholestack` -- boolean to remove entire stack
  - `keepoverstacked` -- boolean to preserve overstacked state
* **Returns:** Removed item entity or `nil`.
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Called each tick when container is open. Handles auto-close logic based on distance and visibility.
* **Parameters:** `dt` -- delta time since last update
* **Returns:** None

### `PutOneOfActiveItemInSlot(slot, opener)`
* **Description:** Moves one item from the player's active item to the specified slot.
* **Parameters:**
  - `slot` -- integer slot index
  - `opener` -- player entity performing the action
* **Returns:** None

### `PutAllOfActiveItemInSlot(slot, opener)`
* **Description:** Moves all of the player's active item to the specified slot.
* **Parameters:**
  - `slot` -- integer slot index
  - `opener` -- player entity performing the action
* **Returns:** None

### `TakeActiveItemFromHalfOfSlot(slot, opener)`
* **Description:** Moves half of a stack from the slot to the player's active item.
* **Parameters:**
  - `slot` -- integer slot index
  - `opener` -- player entity performing the action
* **Returns:** None

### `TakeActiveItemFromCountOfSlot(slot, count, opener)`
* **Description:** Moves a specific count from the slot to the player's active item.
* **Parameters:**
  - `slot` -- integer slot index
  - `count` -- number of items to take
  - `opener` -- player entity performing the action
* **Returns:** None

### `TakeActiveItemFromAllOfSlot(slot, opener)`
* **Description:** Moves all items from the slot to the player's active item.
* **Parameters:**
  - `slot` -- integer slot index
  - `opener` -- player entity performing the action
* **Returns:** None
* **Error states:** Asserts in dev branch if item is locked in slot.

### `AddOneOfActiveItemToSlot(slot, opener)`
* **Description:** Adds one item from the player's active item to an existing stack in the slot.
* **Parameters:**
  - `slot` -- integer slot index
  - `opener` -- player entity performing the action
* **Returns:** None

### `AddAllOfActiveItemToSlot(slot, opener)`
* **Description:** Adds all of the player's active item to an existing stack in the slot.
* **Parameters:**
  - `slot` -- integer slot index
  - `opener` -- player entity performing the action
* **Returns:** None

### `SwapActiveItemWithSlot(slot, opener)`
* **Description:** Swaps the player's active item with the item in the specified slot.
* **Parameters:**
  - `slot` -- integer slot index
  - `opener` -- player entity performing the action
* **Returns:** None

### `SwapOneOfActiveItemWithSlot(slot, opener)`
* **Description:** Swaps one item from the player's active item with all items in the slot.
* **Parameters:**
  - `slot` -- integer slot index
  - `opener` -- player entity performing the action
* **Returns:** None

### `MoveItemFromAllOfSlot(slot, container, opener)`
* **Description:** Moves all items from a slot to another container.
* **Parameters:**
  - `slot` -- integer slot index
  - `container` -- target container entity or component
  - `opener` -- player entity performing the action
* **Returns:** None

### `MoveItemFromHalfOfSlot(slot, container, opener)`
* **Description:** Moves half of a stack from a slot to another container.
* **Parameters:**
  - `slot` -- integer slot index
  - `container` -- target container entity or component
  - `opener` -- player entity performing the action
* **Returns:** None

### `MoveItemFromCountOfSlot(slot, container, count, opener)`
* **Description:** Moves a specific count from a slot to another container.
* **Parameters:**
  - `slot` -- integer slot index
  - `container` -- target container entity or component
  - `count` -- number of items to move
  - `opener` -- player entity performing the action
* **Returns:** None

### `ReferenceAllItems()`
* **Description:** Returns a table of all items for reference counting purposes.
* **Parameters:** None
* **Returns:** Table of item entities.

### `EnableInfiniteStackSize(enable)`
* **Description:** Enables or disables infinite stack size mode for all items in the container.
* **Parameters:** `enable` -- boolean to enable or disable
* **Returns:** None

### `EnableReadOnlyContainer(enable)`
* **Description:** Enables or disables read-only mode. Adds preserver component when enabled.
* **Parameters:** `enable` -- boolean to enable or disable
* **Returns:** None
* **Error states:** Asserts if items are transferred in/out of read-only container (dev only).

### `IsRestricted(target)`
* **Description:** Checks if the target is restricted from accessing this container based on `restrictedtag`.
* **Parameters:** `target` -- entity to check access for
* **Returns:** `true` if restricted, `false` otherwise.

## Events & listeners
- **Listens to:** `player_despawn` -- pushes "player_despawn" event to all items in container when owner despawns
- **Pushes:** `dropitem` -- fired when an item is dropped from the container (data: `{item = item}`)
- **Pushes:** `itemget` -- fired when an item is placed in a slot (data: `{slot = slot, item = item, src_pos = src_pos}`)
- **Pushes:** `itemlose` -- fired when an item is removed from a slot (data: `{slot = slot, prev_item = item}`)
- **Pushes:** `onopen` -- fired when container is opened (data: `{doer = doer}`)
- **Pushes:** `onclose` -- fired when container is closed (data: `{doer = doer}`)