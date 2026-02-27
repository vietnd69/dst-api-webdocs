---
id: container
title: Container
description: This component provides a flexible inventory system for entities, managing item slots and handling storage, retrieval, and interaction with contained items.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: inventory
source_hash: 02c56607
---

# Container

## Overview
The Container component is a foundational element in Don't Starve Together's entity system, responsible for allowing entities to hold other items. It manages a set of item slots, facilitating actions such as adding and removing items, dropping contents, and handling player interactions like opening and closing the container's UI. It also provides mechanisms for item filtering, stack management, and persistence through saving and loading.

## Dependencies & Tags
This component interacts with various other components and game systems:

*   **Components Utilized**:
    *   `inst.replica.container`: For network synchronization of container state.
    *   `inst.components.inventoryitem`: For managing items within the container.
    *   `inst.components.stackable`: For handling stackable items.
    *   `inst.components.inventory`: To interact with the player's main inventory.
    *   `inst.components.playeractionpicker`: For UI interaction when a player is near.
    *   `inst.components.rider`: To check mount status for auto-close logic.
    *   `inst.components.constructionbuilderuidata`: For specific slot placement in crafting UIs.
    *   `inst.components.preserver`: Conditionally added/removed when `readonlycontainer` is enabled/disabled.
*   **External Modules**:
    *   `containers`: The `containers.widgetsetup` function is called for widget configuration.
*   **Events Listened To**:
    *   `player_despawn`: Triggered when the owner entity despawns, prompting contained items to also despawn.
    *   `itemget`: Conditionally listened to (via `ReadOnlyContainerAssert_in`) when `readonlycontainer` is enabled, asserting if an item is added to a read-only container.
    *   `itemlose`: Conditionally listened to (via `ReadOnlyContainerAssert_out`) when `readonlycontainer` is enabled, asserting if an item is removed from a read-only container.
*   **Events Pushed/Triggered**:
    *   `item:PushEvent("player_despawn")`: Pushed by individual items inside the container when the container's owner despawns.
    *   `self.inst:PushEvent("dropitem", { item = item })`: Triggered when an item is dropped from the container.
    *   `self.inst:PushEvent("itemget", { slot = in_slot, item = item, src_pos = src_pos })`: Triggered when an item is successfully placed into the container.
    *   `self.inst.components.inventoryitem.owner:PushEvent("gotnewitem", { item = item, slot = in_slot })`: Pushed to the owner's inventory when a new item is put into this container.
    *   `self.inst:PushEvent("onopen", {doer = doer})`: Triggered when a player opens the container.
    *   `doer:PushEvent("refreshcrafting")`: Pushed to the `doer` (player) to refresh their crafting menu upon container open/close.
    *   `opener:PushEventImmediate("ms_closeportablestorage", { item = self.inst })`: Triggered on the opener when a portable storage container closes under specific conditions.
    *   `self.inst:PushEvent("onclose", {doer = doer})`: Triggered when a player closes the container.
    *   `self.inst:PushEvent("itemlose", { slot = slot, prev_item = item })`: Triggered when an item is removed from the container.

## Properties
| Property                 | Type      | Default Value | Description                                                                                                                                                                                                                                              |
| :----------------------- | :-------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slots`                  | table     | `{}`          | A table storing the items currently in the container, indexed by slot number.                                                                                                                                                                            |
| `numslots`               | number    | `0`           | The total number of available slots in the container.                                                                                                                                                                                                    |
| `canbeopened`            | boolean   | `true`        | Determines if the container can be opened by players. Set via a property setter (`oncanbeopened`).                                                                                                                                                        |
| `skipopensnd`            | boolean   | `false`       | If true, no sound will play when the container is opened. Set via a property setter (`onskipopensnd`).                                                                                                                                                   |
| `skipclosesnd`           | boolean   | `false`       | If true, no sound will play when the container is closed. Set via a property setter (`onskipclosesnd`).                                                                                                                                                  |
| `acceptsstacks`          | boolean   | `true`        | If true, the container will attempt to stack items with existing ones.                                                                                                                                                                                   |
| `usespecificslotsforitems` | boolean   | `false`       | If true, the `itemtestfn` will be used to determine specific slots for items, rather than finding the first available slot.                                                                                                                            |
| `issidewidget`           | boolean   | `false`       | If true, the container's UI will appear as a side widget in the HUD.                                                                                                                                                                                     |
| `type`                   | any       | `nil`         | A string or identifier representing the type of container (e.g., "backpack", "chest"). Used for UI identification and grouping.                                                                                                                          |
| `widget`                 | table     | `nil`         | Reference to the UI widget associated with this container, if any.                                                                                                                                                                                       |
| `itemtestfn`             | function  | `nil`         | An optional function used to test if a given item can be placed in a specific slot. Signature: `function(item, slot)` returning boolean.                                                                                                                  |
| `priorityfn`             | function  | `nil`         | An optional function used to determine if this container should be prioritized for item placement. Signature: `function(item)` returning boolean.                                                                                                         |
| `openlist`               | table     | `{}`          | A table storing references to entities (players) currently opening this container.                                                                                                                                                                       |
| `opencount`              | number    | `0`           | The number of players currently viewing/opening the container.                                                                                                                                                                                           |
| `ignoresound`            | boolean   | `false`       | A temporary flag to suppress sound effects during item transfer operations.                                                                                                                                                                              |
| `ignoreoverstacked`      | boolean   | `false`       | A temporary flag to ignore overstacked items during internal item removal processes.                                                                                                                                                                     |
| `infinitestacksize`      | boolean   | `false`       | (Read-only) If true, items in this container ignore their maximum stack size. Managed by `EnableInfiniteStackSize`.                                                                                                                                      |
| `readonlycontainer`      | boolean   | `false`       | (Read-only) If true, items cannot be added to or removed from this container. Managed by `EnableReadOnlyContainer`.                                                                                                                                      |
| `openlimit`              | number    | `nil`         | The maximum number of players that can open this container simultaneously. If nil, there is no limit.                                                                                                                                                  |
| `onopenfn`               | function  | `nil`         | An optional callback function invoked when the container is first opened (i.e., `opencount` becomes 1). Signature: `function(inst, data)`.                                                                                                                |
| `onanyopenfn`            | function  | `nil`         | An optional callback function invoked whenever any player opens the container (i.e., `opencount` increments). Signature: `function(inst, data)`.                                                                                                           |
| `onclosefn`              | function  | `nil`         | An optional callback function invoked when the container is fully closed (i.e., `opencount` becomes 0). Signature: `function(inst, doer)`.                                                                                                                |
| `onanyclosefn`           | function  | `nil`         | An optional callback function invoked whenever any player closes the container (i.e., `opencount` decrements). Signature: `function(inst, data)`.                                                                                                          |

## Main Functions
### `WidgetSetup(prefab, data)`
*   **Description:** Initializes the container's widget properties based on provided prefab data. It copies properties like `numslots`, `acceptsstacks`, `usespecificslotsforitems`, `issidewidget`, `type`, `widget`, `itemtestfn`, `priorityfn`, and `openlimit` from the `data` table. It also synchronizes these properties to the replica and makes them read-only after setup.
*   **Parameters:**
    *   `prefab`: The prefab string of the entity owning this component.
    *   `data`: A table containing setup data for the widget properties.

### `NumItems()`
*   **Description:** Returns the current number of unique item stacks in the container (i.e., the number of occupied slots).
*   **Parameters:** None.

### `IsFull()`
*   **Description:** Checks if all available slots in the container are currently occupied.
*   **Parameters:** None.

### `IsEmpty()`
*   **Description:** Checks if the container has no items in any of its slots.
*   **Parameters:** None.

### `SetNumSlots(numslots)`
*   **Description:** Sets the maximum number of slots this container can hold. The new number must be greater than or equal to the current `numslots`.
*   **Parameters:**
    *   `numslots`: (number) The new total number of slots.

### `DropItemBySlot(slot, drop_pos, keepoverstacked)`
*   **Description:** Removes an item from a specific slot and drops it into the world. If `keepoverstacked` is true, only the non-overstacked portion of a stack is removed if applicable.
*   **Parameters:**
    *   `slot`: (number) The slot index from which to drop the item.
    *   `drop_pos`: (Vector3, optional) The world position to drop the item at. Defaults to the container's position.
    *   `keepoverstacked`: (boolean, optional) If true, and the item is overstacked, only drops the "normal" stack size, leaving the excess in the container.

### `DropEverythingWithTag(tag, drop_pos, keepoverstacked)`
*   **Description:** Iterates through all items in the container and its nested containers, dropping any item that possesses the specified tag.
*   **Parameters:**
    *   `tag`: (string) The tag to filter items by.
    *   `drop_pos`: (Vector3, optional) The world position to drop items at. Defaults to the container's position.
    *   `keepoverstacked`: (boolean, optional) If true, and an item is overstacked, only drops the "normal" stack size, leaving the excess.

### `DropEverythingByFilter(filterfn)`
*   **Description:** Drops items from the container based on a custom filter function. The `filterfn` is called for each item, and if it returns true, the item is dropped. Recursively applies to nested containers.
*   **Parameters:**
    *   `filterfn`: (function) A function `function(inst, item)` that returns true if the item should be dropped.

### `DropEverything(drop_pos, keepoverstacked)`
*   **Description:** Removes and drops all items from all slots in the container into the world.
*   **Parameters:**
    *   `drop_pos`: (Vector3, optional) The world position to drop items at. Defaults to the container's position.
    *   `keepoverstacked`: (boolean, optional) If true, and an item is overstacked, only drops the "normal" stack size, leaving the excess.

### `DropEverythingUpToMaxStacks(maxstacks, drop_pos)`
*   **Description:** Drops items from the container until a specified number of stacks have been dropped.
*   **Parameters:**
    *   `maxstacks`: (number) The maximum number of item stacks to drop.
    *   `drop_pos`: (Vector3, optional) The world position to drop items at. Defaults to the container's position.

### `DropItem(itemtodrop)`
*   **Description:** Removes a specific item from the container (if found) and drops it at the container's world position. This function is a wrapper for `DropItemAt`.
*   **Parameters:**
    *   `itemtodrop`: (Entity) The specific item entity to drop.

### `DropOverstackedExcess(item)`
*   **Description:** Checks if a given item (presumably in this container) is overstacked (has more than its `originalmaxsize`). If so, it drops the excess amount as new item entities at the container's position.
*   **Parameters:**
    *   `item`: (Entity) The item to check for overstacking.

### `DropItemAt(itemtodrop, x, y, z)`
*   **Description:** Removes a specific item from the container (if found) and drops it at the specified world coordinates.
*   **Parameters:**
    *   `itemtodrop`: (Entity) The specific item entity to drop.
    *   `x`, `y`, `z`: (number or Vector3) The world coordinates or a Vector3 object for where to drop the item.

### `CanTakeItemInSlot(item, slot)`
*   **Description:** Determines if a given item can be placed into a specific slot, considering item properties (e.g., `cangoincontainer`, `canonlygoinpocket`), container state (e.g., `readonlycontainer`), and custom `itemtestfn`.
*   **Parameters:**
    *   `item`: (Entity) The item to test.
    *   `slot`: (number, optional) The specific slot index to test. Can be nil to test general compatibility.

### `GetSpecificSlotForItem(item)`
*   **Description:** If `usespecificslotsforitems` is true and `itemtestfn` is defined, this function finds and returns the first slot index where the given item can be placed according to the `itemtestfn`.
*   **Parameters:**
    *   `item`: (Entity) The item to find a slot for.

### `ShouldPrioritizeContainer(item)`
*   **Description:** Checks if this container should be prioritized for a given item, based on its `priorityfn` and general item compatibility rules.
*   **Parameters:**
    *   `item`: (Entity) The item to check prioritization for.

### `AcceptsStacks()`
*   **Description:** Returns `true` if the container is configured to accept stacked items (`self.acceptsstacks`), otherwise `false`.
*   **Parameters:** None.

### `IsSideWidget()`
*   **Description:** Returns `true` if the container's UI is configured to be a side widget (`self.issidewidget`), otherwise `false`.
*   **Parameters:** None.

### `DestroyContents(onpredestroyitemcallbackfn)`
*   **Description:** Removes and destroys all items currently in the container. An optional callback can be provided to perform actions before each item is destroyed.
*   **Parameters:**
    *   `onpredestroyitemcallbackfn`: (function, optional) A function `function(inst, item)` to call for each item before it's removed and destroyed.

### `DestroyContentsConditionally(filterfn, onpredestroyitemcallbackfn)`
*   **Description:** Removes and destroys items from the container that satisfy a given filter function. An optional callback can be provided for actions before destruction.
*   **Parameters:**
    *   `filterfn`: (function) A function `function(inst, item)` that returns true if the item should be destroyed. If nil, all contents are destroyed.
    *   `onpredestroyitemcallbackfn`: (function, optional) A function `function(inst, item)` to call for each item before it's removed and destroyed.

### `CanAcceptCount(item, maxcount)`
*   **Description:** Determines how many units of a given item (from its stack) the container can accept, considering existing stacks and empty slots.
*   **Parameters:**
    *   `item`: (Entity) The item to check for acceptance.
    *   `maxcount`: (number, optional) The maximum number of items to check for (defaults to stack size or 1).

### `GiveItem(item, slot, src_pos, drop_on_fail)`
*   **Description:** Attempts to place an item into the container. It tries to stack items first, then finds an empty slot. If successful, the item is removed from its previous context and placed in this container. If `drop_on_fail` is true, the item is dropped at the container's position if it cannot be placed.
*   **Parameters:**
    *   `item`: (Entity) The item entity to give to the container.
    *   `slot`: (number, optional) The specific slot to try placing the item into. If nil, any available slot or stackable slot is used.
    *   `src_pos`: (Vector3, optional) The source position of the item, used for events.
    *   `drop_on_fail`: (boolean, optional) If true (default), drops the item at the container's position if placement fails.

### `RemoveItemBySlot(slot, keepoverstacked)`
*   **Description:** Removes an item from the specified slot. If `keepoverstacked` is true, only the non-overstacked portion of a stack is removed.
*   **Parameters:**
    *   `slot`: (number) The index of the slot to remove the item from.
    *   `keepoverstacked`: (boolean, optional) If true, and the item is overstacked, only removes the "normal" stack size, leaving the excess in the container.

### `RemoveAllItems()`
*   **Description:** Removes all items from the container and returns them in a table. Does not drop or destroy them.
*   **Parameters:** None.

### `GetNumSlots()`
*   **Description:** Returns the total number of slots this container has.
*   **Parameters:** None.

### `GetItemInSlot(slot)`
*   **Description:** Returns the item entity located in the specified slot.
*   **Parameters:**
    *   `slot`: (number) The slot index to retrieve the item from.

### `GetItemSlot(item)`
*   **Description:** Finds and returns the slot number occupied by a specific item entity.
*   **Parameters:**
    *   `item`: (Entity) The item entity to find the slot for.

### `GetAllItems()`
*   **Description:** Returns a table containing all item entities currently in the container, regardless of slot.
*   **Parameters:** None.

### `Open(doer)`
*   **Description:** Marks the container as open for a specified `doer` (player). This triggers UI updates, sound effects, and adds the container to the `doer`'s list of open containers. It also stops updating other open containers of the same prefab/type.
*   **Parameters:**
    *   `doer`: (Entity) The entity (player) opening the container.

### `Close(doer)`
*   **Description:** Marks the container as closed for a specified `doer` (player). If `doer` is nil, it closes the container for all current openers. This triggers UI updates and sound effects, and removes the container from the `doer`'s list of open containers.
*   **Parameters:**
    *   `doer`: (Entity, optional) The entity (player) closing the container. If nil, closes for all.

### `IsOpen()`
*   **Description:** Returns true if the container is currently open by at least one player (`opencount > 0`), otherwise false.
*   **Parameters:** None.

### `IsOpenedBy(guy)`
*   **Description:** Returns true if the specified `guy` (player) is currently opening this container, otherwise false.
*   **Parameters:**
    *   `guy`: (Entity) The entity (player) to check.

### `IsOpenedByOthers(guy)`
*   **Description:** Returns true if the container is currently open by any other player besides the specified `guy`.
*   **Parameters:**
    *   `guy`: (Entity) The entity (player) to exclude from the count.

### `CanOpen()`
*   **Description:** Returns true if the container can be opened, considering its `openlimit` (if set) and current `opencount`.
*   **Parameters:** None.

### `GetOpeners()`
*   **Description:** Returns a table containing all entities (players) currently opening this container.
*   **Parameters:** None.

### `IsHolding(item, checkcontainer)`
*   **Description:** Checks if the container holds a specific item. If `checkcontainer` is true, it also recursively checks items within nested containers.
*   **Parameters:**
    *   `item`: (Entity) The item entity to check for.
    *   `checkcontainer`: (boolean, optional) If true, recursively checks nested containers.

### `FindItem(fn)`
*   **Description:** Finds and returns the first item in the container that satisfies the provided filter function.
*   **Parameters:**
    *   `fn`: (function) A function `function(item)` that returns true for the desired item.

### `FindItems(fn)`
*   **Description:** Finds and returns a table of all items in the container that satisfy the provided filter function.
*   **Parameters:**
    *   `fn`: (function) A function `function(item)` that returns true for desired items.

### `ForEachItem(fn, ...)`
*   **Description:** Iterates through each item in the container and calls the provided function `fn` with the item and any additional arguments.
*   **Parameters:**
    *   `fn`: (function) The function to call for each item.
    *   `...`: (any) Additional arguments to pass to `fn`.

### `Has(item, amount, iscrafting)`
*   **Description:** Checks if the container has a specified `amount` of items matching `item` (by prefab). If `iscrafting` is true, items tagged "nocrafting" are ignored.
*   **Parameters:**
    *   `item`: (string) The prefab name of the item to check for.
    *   `amount`: (number) The required quantity of the item.
    *   `iscrafting`: (boolean, optional) If true, ignores items with the "nocrafting" tag.
*   **Returns:** `(boolean) has_enough, (number) total_found_amount`

### `HasItemThatMatches(fn, amount)`
*   **Description:** Checks if the container has a specified `amount` of items that satisfy a given filter function.
*   **Parameters:**
    *   `fn`: (function) A function `function(item)` that returns true for the desired item.
    *   `amount`: (number) The required quantity of matching items.
*   **Returns:** `(boolean) has_enough, (number) total_found_amount`

### `HasItemWithTag(tag, amount)`
*   **Description:** Checks if the container has a specified `amount` of items that possess a given tag.
*   **Parameters:**
    *   `tag`: (string) The tag to filter items by.
    *   `amount`: (number) The required quantity of items with the tag.
*   **Returns:** `(boolean) has_enough, (number) total_found_amount`

### `GetItemsWithTag(tag)`
*   **Description:** Returns a table containing all items in the container that have the specified tag.
*   **Parameters:**
    *   `tag`: (string) The tag to filter items by.

### `GetItemByName(item, amount)`
*   **Description:** Retrieves a table of items from the container, matching a specific `item` prefab, up to the `amount` needed.
*   **Parameters:**
    *   `item`: (string) The prefab name of the item to find.
    *   `amount`: (number) The desired quantity of the item.
*   **Returns:** `(table) items_found` (where keys are item entities and values are quantities).

### `GetCraftingIngredient(item, amount, reverse_search_order)`
*   **Description:** Collects items suitable for crafting, prioritizing smaller stacks first. Filters by prefab `item` and ignores items with the "nocrafting" tag.
*   **Parameters:**
    *   `item`: (string) The prefab name of the crafting ingredient.
    *   `amount`: (number) The required quantity.
    *   `reverse_search_order`: (boolean, optional) If true, slots are searched in reverse order.
*   **Returns:** `(table) crafting_items` (where keys are item entities and values are quantities).

### `ConsumeByName(item, amount)`
*   **Description:** Consumes a specified `amount` of items matching `item` (by prefab) from the container, removing them. This operation is prevented if `readonlycontainer` is enabled.
*   **Parameters:**
    *   `item`: (string) The prefab name of the item to consume.
    *   `amount`: (number) The quantity to consume.

### `OnSave()`
*   **Description:** Generates save data for the container, including save records for all valid and persistent items within its slots.
*   **Parameters:** None.
*   **Returns:** `(table) data, (table) references` (save data and entity references).

### `OnLoad(data, newents)`
*   **Description:** Loads items into the container from saved `data`.
*   **Parameters:**
    *   `data`: (table) The save data table containing item information.
    *   `newents`: (table) A table of newly spawned entities from save data.

### `RemoveItem(item, wholestack, _checkallcontainers_, keepoverstacked)`
*   **Description:** Removes a specific `item` entity from the container. If `wholestack` is true, the entire stack is removed; otherwise, only one unit is removed. If `keepoverstacked` is true, and the item is overstacked, only the "normal" stack size is removed.
*   **Parameters:**
    *   `item`: (Entity) The specific item entity to remove.
    *   `wholestack`: (boolean, optional) If true, removes the entire stack. Defaults to false.
    *   `_checkallcontainers_`: (boolean, internal) Not implemented in this component, serves for interface compatibility.
    *   `keepoverstacked`: (boolean, optional) If true, and the item is overstacked, only removes the "normal" stack size.

### `OnUpdate(dt)`
*   **Description:** Called every frame while the container is being updated. Manages the auto-closing logic for open containers based on player proximity and state (e.g., mounting, specific states for portable storage).
*   **Parameters:**
    *   `dt`: (number) The time elapsed since the last update.

### `OnRemoveEntity()`
*   **Description:** Called when the entity owning this component is about to be removed. It closes the container for all openers.
*   **Parameters:** None.

### `OnRemoveFromEntity()`
*   **Description:** Called when the component is removed from an entity. It closes the container for all openers.
*   **Parameters:** None.

### `PutOneOfActiveItemInSlot(slot, opener)`
*   **Description:** Attempts to place one unit of the opener's currently active item into the specified slot of this container, if the slot is empty and the item can be taken.
*   **Parameters:**
    *   `slot`: (number) The target slot index.
    *   `opener`: (Entity) The player interacting with the container.

### `PutAllOfActiveItemInSlot(slot, opener)`
*   **Description:** Attempts to place all units of the opener's currently active item into the specified slot of this container. If the slot is occupied, it swaps items.
*   **Parameters:**
    *   `slot`: (number) The target slot index.
    *   `opener`: (Entity) The player interacting with the container.

### `TakeActiveItemFromHalfOfSlot(slot, opener)`
*   **Description:** Attempts to take half of a stackable item from the specified slot and set it as the opener's active item, if the opener has no active item.
*   **Parameters:**
    *   `slot`: (number) The source slot index.
    *   `opener`: (Entity) The player interacting with the container.

### `TakeActiveItemFromCountOfSlot(slot, count, opener)`
*   **Description:** Attempts to take a specific `count` of units from an item in the specified slot and set it as the opener's active item, if the opener has no active item.
*   **Parameters:**
    *   `slot`: (number) The source slot index.
    *   `count`: (number) The number of items to take.
    *   `opener`: (Entity) The player interacting with the container.

### `TakeActiveItemFromAllOfSlot(slot, opener)`
*   **Description:** Attempts to take all units of an item from the specified slot and set it as the opener's active item, if the opener has no active item. Handles overstacked items by taking the normal max stack size.
*   **Parameters:**
    *   `slot`: (number) The source slot index.
    *   `opener`: (Entity) The player interacting with the container.

### `AddOneOfActiveItemToSlot(slot, opener)`
*   **Description:** Attempts to add one unit of the opener's currently active item to an existing stack in the specified slot, if both items are stackable and compatible.
*   **Parameters:**
    *   `slot`: (number) The target slot index.
    *   `opener`: (Entity) The player interacting with the container.

### `AddAllOfActiveItemToSlot(slot, opener)`
*   **Description:** Attempts to add all units of the opener's currently active item to an existing stack in the specified slot, if both items are stackable and compatible. Leftover items remain as the opener's active item.
*   **Parameters:**
    *   `slot`: (number) The target slot index.
    *   `opener`: (Entity) The player interacting with the container.

### `SwapActiveItemWithSlot(slot, opener)`
*   **Description:** Swaps the opener's active item with the item in the specified slot of this container. Handles cases where the slot is empty or items can be stacked.
*   **Parameters:**
    *   `slot`: (number) The slot index to swap with.
    *   `opener`: (Entity) The player interacting with the container.

### `SwapOneOfActiveItemWithSlot(slot, opener)`
*   **Description:** Swaps one unit of the opener's active item with the item in the specified slot, if both items are single units or the active item is stackable and the target is not. The removed item from the slot is dropped.
*   **Parameters:**
    *   `slot`: (number) The slot index to swap with.
    *   `opener`: (Entity) The player interacting with the container.

### `MoveItemFromAllOfSlot(slot, container, opener)`
*   **Description:** Attempts to move the entire item (or max stack portion if overstacked) from the specified slot in this container to another `container` component, for a given `opener`.
*   **Parameters:**
    *   `slot`: (number) The source slot index in this container.
    *   `container`: (Entity) The target entity owning the container component to move the item to.
    *   `opener`: (Entity) The player initiating the move.

### `MoveItemFromHalfOfSlot(slot, container, opener)`
*   **Description:** Attempts to move half of a stackable item from the specified slot in this container to another `container` component, for a given `opener`.
*   **Parameters:**
    *   `slot`: (number) The source slot index in this container.
    *   `container`: (Entity) The target entity owning the container component to move the item to.
    *   `opener`: (Entity) The player initiating the move.

### `MoveItemFromCountOfSlot(slot, container, count, opener)`
*   **Description:** Attempts to move a specific `count` of units from an item in the specified slot of this container to another `container` component, for a given `opener`.
*   **Parameters:**
    *   `slot`: (number) The source slot index in this container.
    *   `container`: (Entity) The target entity owning the container component to move the item to.
    *   `count`: (number) The number of items to move.
    *   `opener`: (Entity) The player initiating the move.

### `ReferenceAllItems()`
*   **Description:** Returns a table containing references to all items currently stored in the container.
*   **Parameters:** None.

### `EnableInfiniteStackSize(enable)`
*   **Description:** Enables or disables infinite stack size for items within this container. When enabled, `stackable` items ignore their `maxsize`. When disabled, any overstacked items are dropped, and `stackable` items revert to their normal size limits.
*   **Parameters:**
    *   `enable`: (boolean) True to enable infinite stack size, false to disable.

### `EnableReadOnlyContainer(enable)`
*   **Description:** Enables or disables read-only mode for this container. When enabled, items cannot be added or removed, and an assertion will trigger if attempts are made. It also adds a `preserver` component to the entity to stop perish/temperature rates.
*   **Parameters:**
    *   `enable`: (boolean) True to enable read-only mode, false to disable.

### `IsRestricted(target)`
*   **Description:** Checks if a `target` player is restricted from interacting with this container based on the `restrictedtag` (if set). Non-player targets are never restricted.
*   **Parameters:**
    *   `target`: (Entity) The entity to check for interaction restriction.