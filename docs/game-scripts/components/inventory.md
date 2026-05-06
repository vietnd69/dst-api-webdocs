---
id: inventory
title: Inventory
description: The Inventory component manages an entity's item slots, equipment slots, and active item, providing core functionality for item acquisition, equipment handling, damage calculation, and inventory queries.
tags: [inventory, items, equipment, player, management]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 227fcf57
system_scope: inventory
---

# Inventory

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
The `inventory` component is a core system attached to player entities and some creatures that manages all item storage and equipment functionality. It maintains three primary data structures: `itemslots` for general inventory, `equipslots` for worn equipment, and `activeitem` for the currently held item. This component integrates closely with `inventoryitem`, `container`, `equippable`, and `stackable` components to handle item pickup, equipment logic, stack management, and damage resistance calculations. It also provides extensive query methods for finding items by prefab, tag, or crafting suitability, and manages UI visibility states for container interactions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventory")

-- Check if inventory has a specific item
local has_axe = inst.components.inventory:Has("axe")

-- Equip an item from active slot
if inst.components.inventory:GetActiveItem() ~= nil then
    inst.components.inventory:EquipActiveItem()
end

-- Drop everything on death
inst.components.inventory:DropEverything(true, false)

-- Query items by tag
local food_items = inst.components.inventory:GetItemsWithTag("food")
```

## Dependencies & tags

**External dependencies:**
- `equipslotutil` -- Required for EquipSlot.Count() and EquipSlot.FromID() in ApplyDamage
- `components/spdamageutil` -- Required for SpDamageUtil.GetSpDefenseForType() in ApplyDamage and EquipHasSpDefenseForType

**Components used:**
- `inventoryitem` -- Checked on items for ownership, dropping, and container restrictions
- `stackable` -- Used for stack size calculations and combining stacks
- `equippable` -- Checked for equip slot, restrictions, and insulation
- `armor` -- Used for damage absorption and durability in ApplyDamage
- `resistance` -- Checked for damage resistance in ApplyDamage
- `damagetyperesist` -- Used for damage type multipliers in ApplyDamage
- `petleash` -- Checked in CheckMigrationPets for pet collection
- `migrationpetowner` -- Checked in CheckMigrationPets for pet collection
- `container` -- Checked for overflow container and item holding
- `replica.inventory` -- Used for network synchronization of heavylifting and floaterheld
- `playercontroller` -- Checked for client controller attachment status.
- `setbonus` -- Updated on equip and unequip actions.
- `playerfloater` -- Checked when equipping to hands slot.
- `playeractionpicker` -- Used to get inventory and use item actions.
- `locomotor` -- Used to push buffered actions.
- `spellbook` -- Used for spell selection and casting.
- `inspectable` -- Used to check if item can be inspected.
- `named` -- Used to set names on ash prefabs.
- `curseditem` -- Checked to prevent dropping cursed items on death.
- `constructionbuilderuidata` -- accessed via self.inst.components.constructionbuilderuidata for construction slot targeting
- `moisture` -- accessed via self.inst.components.moisture for waterproof inventory check
- `waterproofer` -- accessed via item.components.waterproofer for waterproofness effectiveness
- `container_proxy` -- accessed via k.components.container_proxy for master entity lookup

**Tags:**
- `heavy` -- check
- `nocrafting` -- check
- `player` -- check
- `backpack` -- check
- `nonpotatable` -- check
- `pocketdimension_container` -- check
- `usingmagiciantool` -- check
- `busy` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isopen` | boolean | `false` | Whether the inventory UI is currently open |
| `isvisible` | boolean | `false` | Whether the inventory is visible |
| `ignoreoverflow` | boolean | `false` | Flag to ignore overflow container limits when moving items |
| `ignorefull` | boolean | `false` | Flag to ignore full inventory checks |
| `silentfull` | boolean | `false` | Flag to suppress full inventory sounds |
| `ignoresound` | boolean | `false` | Flag to suppress inventory sounds |
| `itemslots` | table | `{}` | Array of items in inventory slots |
| `maxslots` | number | `GetMaxItemSlots(TheNet:GetServerGameMode())` | Maximum number of inventory slots based on game mode |
| `equipslots` | table | `{}` | Table of equipped items by slot name |
| `heavylifting` | boolean | `false` | Whether the entity is currently heavy lifting |
| `activeitem` | Entity | `nil` | The item currently held in hand |
| `acceptsstacks` | boolean | `true` | Whether this inventory accepts stacked items |
| `ignorescangoincontainer` | boolean | `false` | Whether to ignore canGoInContainer restrictions |
| `opencontainers` | table | `{}` | List of containers currently opened by this inventory |
| `opencontainerproxies` | table | `{}` | Proxy references for open containers |
| `dropondeath` | boolean | `true` | Whether items drop when the entity dies |
| `isexternallyinsulated` | SourceModifierList | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Modifier list tracking external insulation status |

## Main functions









### `EnableDropOnDeath()`
* **Description:** Enables dropping items on death and registers the death event listener.
* **Parameters:** None
* **Returns:** None

### `DisableDropOnDeath()`
* **Description:** Disables dropping items on death and removes the death event listener.
* **Parameters:** None
* **Returns:** None

### `OnRemoveFromEntity()`
* **Description:** Alias for DisableDropOnDeath, called when component is removed from entity.
* **Parameters:** None
* **Returns:** None

### `NumItems()`
* **Description:** Counts the number of items in inventory slots.
* **Parameters:** None
* **Returns:** number - count of items

### `NumStackedItems()`
* **Description:** Counts total items including stack sizes from stackable components.
* **Parameters:** None
* **Returns:** number - total stacked item count

### `TransferInventory(receiver)`
* **Description:** Transfers all persistent items and equipment from this inventory to another entity's inventory. Returns early if receiver has no inventory component.
* **Parameters:**
  - `receiver` -- Entity to transfer inventory to
* **Returns:** None
* **Error states:** None

### `SwapEquipment(other, equipslot_to_swap, force)`
* **Description:** Swaps equipment between this inventory and another entity's inventory. Returns false if other entity or its inventory is nil.
* **Parameters:**
  - `other` -- Other entity to swap equipment with
  - `equipslot_to_swap` -- Specific equip slot to swap or nil for all slots
  - `force` -- Force unequip regardless of restrictions
* **Returns:** boolean - true if swap succeeded, false otherwise
* **Error states:** None

### `OnSave()`
* **Description:** Serializes inventory items, equipment, and active item for save data.
* **Parameters:** None
* **Returns:** data (table), references (table) - save record and entity references

### `CanTakeItemInSlot(item, slot)`
* **Description:** Checks if an item can be placed in a specific inventory slot.
* **Parameters:**
  - `item` -- Item entity to check
  - `slot` -- Slot index to check or nil
* **Returns:** boolean - true if item can be taken

### `AcceptsStacks()`
* **Description:** Returns whether this inventory accepts stacked items.
* **Parameters:** None
* **Returns:** boolean - value of acceptsstacks

### `IgnoresCanGoInContainer()`
* **Description:** Returns whether this inventory ignores canGoInContainer restrictions.
* **Parameters:** None
* **Returns:** boolean - value of ignorescangoincontainer



### `OnLoad(data, newents)`
* **Description:** Loads inventory items, equipment, and active item from save data.
* **Parameters:**
  - `data` -- Save data table with items, equip, and activeitem
  - `newents` -- Entity reference mapping for save records
* **Returns:** None

### `DropActiveItem()`
* **Description:** Drops the currently held active item and clears it.
* **Parameters:** None
* **Returns:** Entity - the dropped item or nil

### `ReturnActiveActionItem(item, instant)`
* **Description:** Returns the active action item to inventory with special handling for buffered actions.
* **Parameters:**
  - `item` -- Item to return to inventory
  - `instant` -- Boolean indicating instant return without buffered action hacks
* **Returns:** None

### `HasAnyEquipment()`
* **Description:** Checks if any equipment slots are occupied.
* **Parameters:** None
* **Returns:** boolean - true if any equipment is equipped

### `IsWearingArmor()`
* **Description:** Checks if any equipped item has an armor component.
* **Parameters:** None
* **Returns:** boolean - true if wearing armor

### `ArmorHasTag(tag)`
* **Description:** Checks if any equipped armor item has the specified tag.
* **Parameters:**
  - `tag` -- Tag string to check on armor items
* **Returns:** boolean - true if armor with tag found

### `EquipHasTag(tag)`
* **Description:** Checks if any equipped item has the specified tag.
* **Parameters:**
  - `tag` -- Tag string to check on equipped items
* **Returns:** boolean - true if equipped item with tag found

### `EquipHasSpDefenseForType(sptype)`
* **Description:** Checks if any equipped item has special defense for the given damage type.
* **Parameters:**
  - `sptype` -- Special damage type to check defense against
* **Returns:** boolean - true if special defense found

### `IsHeavyLifting()`
* **Description:** Returns whether the entity is currently heavy lifting.
* **Parameters:** None
* **Returns:** boolean - value of heavylifting

### `IsFloaterHeld()`
* **Description:** Returns whether a floater is being held.
* **Parameters:** None
* **Returns:** boolean - floaterheld value or false

### `ApplyDamage(damage, attacker, weapon, spdamage)`
* **Description:** Applies damage to equipped armor, calculating absorption and special defense.
* **Parameters:**
  - `damage` -- Base damage amount
  - `attacker` -- Attacking entity
  - `weapon` -- Weapon entity or nil
  - `spdamage` -- Special damage table or nil
* **Returns:** leftover_damage (number), spdamage (table or nil) - remaining damage after absorption

### `GetActiveItem()`
* **Description:** Returns the currently held active item.
* **Parameters:** None
* **Returns:** Entity - active item or nil

### `IsItemEquipped(item)`
* **Description:** Checks if an item is currently equipped and returns the slot name.
* **Parameters:**
  - `item` -- Item entity to check
* **Returns:** string - equip slot name or nil

### `SelectActiveItemFromEquipSlot(slot)`
* **Description:** Unequips an item from an equip slot and makes it the active item.
* **Parameters:**
  - `slot` -- Equip slot to select item from
* **Returns:** Entity - the new active item

### `CombineActiveStackWithSlot(slot, stack_mod)`
* **Description:** Combines the active stackable item with an item in the specified slot.
* **Parameters:**
  - `slot` -- Inventory or equip slot to combine with
  - `stack_mod` -- Boolean to modify stack size by 1
* **Returns:** None

### `SelectActiveItemFromSlot(slot)`
* **Description:** Moves an item from an inventory slot to the active item slot.
* **Parameters:**
  - `slot` -- Inventory slot to select item from
* **Returns:** Entity - the new active item or nil
* **Error states:** Asserts in dev branch if item is locked in slot

### `ReturnActiveItem(slot, stack_mod)`
* **Description:** Returns the active item to an inventory slot or drops it if inventory is full.
* **Parameters:**
  - `slot` -- Slot to return item to or nil for first available
  - `stack_mod` -- Boolean to return only one item from stack
* **Returns:** None

### `GetNumSlots()`
* **Description:** Returns the maximum number of inventory slots.
* **Parameters:** None
* **Returns:** number - maxslots value

### `GetItemSlot(item)`
* **Description:** Finds the inventory slot containing a specific item.
* **Parameters:**
  - `item` -- Item entity to find slot for
* **Returns:** number - slot index or nil



### `IsHolding(item, checkcontainer)`
* **Description:** Checks if the inventory is holding an item in slots, equipment, or active item.
* **Parameters:**
  - `item` -- Item entity to check
  - `checkcontainer` -- Boolean to recursively check containers
* **Returns:** boolean - true if holding the item

### `FindItem(fn)`
* **Description:** Finds the first item matching a predicate function in inventory, active item, or overflow.
* **Parameters:**
  - `fn` -- Function to test items, returns true for match
* **Returns:** Entity - matching item or nil

### `FindItems(fn)`
* **Description:** Finds all items matching a predicate function in inventory, equipment, active item, and overflow.
* **Parameters:**
  - `fn` -- Function to test items, returns true for match
* **Returns:** table - array of matching items

### `ForEachItem(fn, ...)`
* **Description:** Iterates over all items in inventory, equipment, active item, and overflow.
* **Parameters:**
  - `fn` -- Function to call on each item
  - `...` -- Additional arguments passed to fn
* **Returns:** None

### `ForEachWetableItem(fn, ...)`
* **Description:** Iterates over items that can get wet (inventory, equipment, active item).
* **Parameters:**
  - `fn` -- Function to call on each wetable item
  - `...` -- Additional arguments passed to fn
* **Returns:** None

### `ForEachEquipment(fn, ...)`
* **Description:** Iterates over all equipped items.
* **Parameters:**
  - `fn` -- Function to call on each equipped item
  - `...` -- Additional arguments passed to fn
* **Returns:** None

### `ForEachItemSlot(fn, ...)`
* **Description:** Iterates over items in inventory slots only.
* **Parameters:**
  - `fn` -- Function to call on each inventory slot item
  - `...` -- Additional arguments passed to fn
* **Returns:** None

### `RemoveItemBySlot(slot, keepoverstacked)`
* **Description:** Removes and returns an item from a specific inventory slot.
* **Parameters:**
  - `slot` -- Slot index to remove item from
  - `keepoverstacked` -- Boolean to keep overstacked items
* **Returns:** Entity - removed item or nil

### `DropItem(item, wholestack, randomdir, pos, keepoverstacked)`
* **Description:** Drops an item from inventory at a position, pushing dropitem event.
* **Parameters:**
  - `item` -- Item entity to drop
  - `wholestack` -- Boolean to drop entire stack
  - `randomdir` -- Random direction for drop physics
  - `pos` -- Position vector to drop at or nil
  - `keepoverstacked` -- Boolean to keep overstacked items
* **Returns:** Entity - dropped item or nil
* **Error states:** Asserts in dev branch if item is locked in slot and not a partial stack

### `ForceNoInsulated(force)`
* **Description:** Forces the insulation check to return false regardless of equipment.
* **Parameters:**
  - `force` -- Boolean to force no insulation or nil to clear
* **Returns:** None

### `IsInsulated()`
* **Description:** Checks if the entity is insulated from electricity via equipped items or external modifiers.
* **Parameters:** None
* **Returns:** boolean - true if insulated

### `GetEquippedItem(eslot)`
* **Description:** Returns the item equipped in a specific slot.
* **Parameters:**
  - `eslot` -- Equip slot name to get item from
* **Returns:** Entity - equipped item or nil

### `GetItemInSlot(slot)`
* **Description:** Returns the item in a specific inventory slot.
* **Parameters:**
  - `slot` -- Inventory slot index
* **Returns:** Entity - item or nil

### `GetFirstItemInAnySlot()`
* **Description:** Returns the first item found in any inventory slot.
* **Parameters:** None
* **Returns:** Entity - first item or nil

### `IsFull()`
* **Description:** Checks if all inventory slots are occupied.
* **Parameters:** None
* **Returns:** boolean - true if inventory is full

### `GetNextAvailableSlot(item)`
* **Description:** Finds the next available slot for an item, checking stacks, overflow, and empty slots.
* **Parameters:**
  - `item` -- Item to find a slot for
* **Returns:** slot (number or nil), container (table) - slot index and container reference

### `CanAcceptCount(item, maxcount)`
* **Description:** Calculates how many of a specific item stack can be accepted into the inventory based on available space and stacking rules.
* **Parameters:**
  - `item` -- Entity instance to check acceptance for.
  - `maxcount` -- Maximum number of items to accept.
* **Returns:** number -- The count of items that can be accepted.

### `GiveActiveItem(inst)`
* **Description:** Assigns an item to the active slot, handling pickup logic and triggering events.
* **Parameters:**
  - `inst` -- Entity instance to give as the active item.
* **Returns:** None
* **Error states:** Asserts if inst lacks inventoryitem component.

### `GiveItem(inst, slot, src_pos)`
* **Description:** Attempts to place an item into the inventory, handling stacking, overflow containers, and active item logic.
* **Parameters:**
  - `inst` -- Entity instance to add to inventory.
  - `slot` -- Optional specific slot index to place the item.
  - `src_pos` -- Optional vector position where the item was picked up from.
* **Returns:** boolean or number -- Returns slot index if successful, true if given to overflow, or false if failed.

### `Unequip(equipslot, slip, force)`
* **Description:** Removes an item from an equipment slot and handles post-unequip logic like set bonuses.
* **Parameters:**
  - `equipslot` -- The equip slot identifier to unequip from.
  - `slip` -- Optional flag indicating if unequip was due to slipping.
  - `force` -- Boolean to force unequip even if prevention logic exists.
* **Returns:** Entity -- The unequipped item instance or nil.

### `SetActiveItem(item)`
* **Description:** Sets the currently held active item, validating slot restrictions.
* **Parameters:**
  - `item` -- Entity instance to set as active or nil to clear.
* **Returns:** None
* **Error states:** Asserts in dev branch if item is locked in slot.

### `Equip(item, old_to_active, no_animation, force_ui_anim)`
* **Description:** Equips an item to its designated slot, handling conflicts, heavy lifting rules, and set bonuses.
* **Parameters:**
  - `item` -- Entity instance to equip.
  - `old_to_active` -- Boolean to move the old equipped item to active slot.
  - `no_animation` -- Boolean to skip equip animation.
  - `force_ui_anim` -- Boolean to force UI animation.
* **Returns:** boolean -- True if equip successful.

### `RemoveItem(item, wholestack, checkallcontainers, keepoverstacked)`
* **Description:** Removes an item from inventory or containers, triggering removal events.
* **Parameters:**
  - `item` -- Entity instance to remove.
  - `wholestack` -- Boolean to remove entire stack or just one.
  - `checkallcontainers` -- Boolean to search open containers for the item.
  - `keepoverstacked` -- Optional parameter for stack handling.
* **Returns:** Entity -- The removed item instance or nil.

### `GetOverflowContainer()`
* **Description:** Retrieves the overflow container component (e.g., equipped backpack) if available.
* **Parameters:** None
* **Returns:** Component -- The container component or nil.

### `Has(item, amount, checkallcontainers)`
* **Description:** Checks if the inventory contains a specific prefab amount, considering stacks and containers.
* **Parameters:**
  - `item` -- Prefab name string to search for.
  - `amount` -- Number of items required.
  - `checkallcontainers` -- Boolean to include open containers in search.
* **Returns:** boolean, number -- Boolean indicating success, and the count found.

### `HasItemThatMatches(fn, amount)`
* **Description:** Checks if inventory contains items matching a custom function.
* **Parameters:**
  - `fn` -- Function that returns true if an item matches criteria.
  - `amount` -- Number of matching items required.
* **Returns:** boolean, number -- Boolean indicating success, and the count found.

### `HasItemWithTag(tag, amount)`
* **Description:** Checks if inventory contains items with a specific tag.
* **Parameters:**
  - `tag` -- String tag to search for.
  - `amount` -- Number of tagged items required.
* **Returns:** boolean, number -- Boolean indicating success, and the count found.

### `GetItemsWithTag(tag)`
* **Description:** Returns a list of all items in inventory with a specific tag.
* **Parameters:**
  - `tag` -- String tag to search for.
* **Returns:** table -- Array of entity instances.

### `GetItemByName(item, amount, checkallcontainers)`
* **Description:** Retrieves specific items by prefab name up to a requested amount.
* **Parameters:**
  - `item` -- Prefab name string to search for.
  - `amount` -- Number of items to retrieve.
  - `checkallcontainers` -- Boolean to include open containers in search.
* **Returns:** table -- Map of item instances to counts.



### `GetCraftingIngredient(item, amount)`
* **Description:** Finds items suitable for crafting, prioritizing open containers and smaller stacks.
* **Parameters:**
  - `item` -- Prefab name string to search for.
  - `amount` -- Number of items required for crafting.
* **Returns:** table -- Map of item instances to counts.



### `ConsumeByName(item, amount)`
* **Description:** Consumes items by prefab name from inventory slots, active item, and overflow container.
* **Parameters:**
  - `item` -- String prefab name of the item to consume.
  - `amount` -- Number of items to consume (default 1).
* **Returns:** None

### `DropEverythingWithTag(tag)`
* **Description:** Drops all items in inventory, active slot, and equip slots that match the given tag, recursing into containers.
* **Parameters:**
  - `tag` -- String tag to match for dropping items.
* **Returns:** None

### `DropEverythingByFilter(filterfn)`
* **Description:** Drops items based on a filter function, recursing into containers.
* **Parameters:**
  - `filterfn` -- Function(inst, item) returning boolean to determine if item should be dropped.
* **Returns:** None

### `DropEverything(ondeath, keepequip)`
* **Description:** Drops all inventory items, handling death rules, locked slots, and internal containers.
* **Parameters:**
  - `ondeath` -- Boolean indicating if drop is due to player death.
  - `keepequip` -- Boolean to keep equipped items.
* **Returns:** None

### `DropEquipped(keepBackpack, keepPreventUnequipping)`
* **Description:** Drops all equipped items based on flags.
* **Parameters:**
  - `keepBackpack` -- Boolean to keep items with 'backpack' tag.
  - `keepPreventUnequipping` -- Boolean to keep items preventing unequipping.
* **Returns:** None

### `DestroyContents(onpredestroyitemcallbackfn)`
* **Description:** Destroys all items in active slot, inventory slots, and equip slots, recursing into containers.
* **Parameters:**
  - `onpredestroyitemcallbackfn` -- Optional callback function(inst, item) called before destruction.
* **Returns:** None

### `BurnNonpotatableInContainer(container)`
* **Description:** Replaces items with 'nonpotatable' tag in a container with ash prefabs.
* **Parameters:**
  - `container` -- Container component instance to process.
* **Returns:** None

### `ReferenceAllItems()`
* **Description:** Returns a table of all items in inventory, equip slots, and overflow container.
* **Parameters:** None
* **Returns:** Table of item entities.

### `GetDebugString()`
* **Description:** Returns a debug string summarizing inventory contents and waterproofness.
* **Parameters:** None
* **Returns:** String

### `IsOpenedBy(guy)`
* **Description:** Checks if the inventory is open and visible by the specified entity.
* **Parameters:**
  - `guy` -- Entity instance to check.
* **Returns:** Boolean

### `Show()`
* **Description:** Makes the inventory UI visible if open.
* **Parameters:** None
* **Returns:** None

### `Open()`
* **Description:** Opens the inventory UI and handles overflow container opening.
* **Parameters:** None
* **Returns:** None

### `Hide()`
* **Description:** Hides the inventory UI, returns active item, and closes open containers.
* **Parameters:** None
* **Returns:** None

### `Close(keepactiveitem)`
* **Description:** Closes the inventory UI and closes all open containers.
* **Parameters:**
  - `keepactiveitem` -- Boolean to keep the active item instead of returning it.
* **Returns:** None

### `CloseAllChestContainers()`
* **Description:** Closes all open containers of type 'chest'.
* **Parameters:** None
* **Returns:** None

### `PutOneOfActiveItemInSlot(slot)`
* **Description:** Moves one item from the active stack into the specified slot.
* **Parameters:**
  - `slot` -- Integer slot index.
* **Returns:** None

### `PutAllOfActiveItemInSlot(slot)`
* **Description:** Moves the entire active item stack into the specified slot.
* **Parameters:**
  - `slot` -- Integer slot index.
* **Returns:** None

### `TakeActiveItemFromHalfOfSlot(slot)`
* **Description:** Takes half of a stack from the slot and makes it the active item.
* **Parameters:**
  - `slot` -- Integer slot index.
* **Returns:** None

### `TakeActiveItemFromCountOfSlot(slot, count)`
* **Description:** Takes a specific count of items from the slot and makes it the active item.
* **Parameters:**
  - `slot` -- Integer slot index.
  - `count` -- Number of items to take.
* **Returns:** None
* **Error states:** Asserts if BRANCH is 'dev' and item is locked in slot.

### `TakeActiveItemFromAllOfSlot(slot)`
* **Description:** Takes all items from the slot and makes it the active item.
* **Parameters:**
  - `slot` -- Integer slot index.
* **Returns:** None
* **Error states:** Asserts if BRANCH is 'dev' and item is locked in slot.

### `AddOneOfActiveItemToSlot(slot)`
* **Description:** Adds one item from the active stack to an existing stack in the slot.
* **Parameters:**
  - `slot` -- Integer slot index.
* **Returns:** None

### `AddAllOfActiveItemToSlot(slot)`
* **Description:** Adds the entire active item to an existing stack in the slot.
* **Parameters:**
  - `slot` -- Integer slot index.
* **Returns:** None

### `SwapActiveItemWithSlot(slot)`
* **Description:** Swaps the active item with the item in the specified slot.
* **Parameters:**
  - `slot` -- Integer slot index.
* **Returns:** None

### `CanAccessItem(item)`
* **Description:** Checks if the player can access the item based on visibility and ownership.
* **Parameters:**
  - `item` -- Item entity to check.
* **Returns:** Boolean

### `UseItemFromInvTile(item, actioncode, mod_name)`
* **Description:** Handles using an item from the inventory tile, pushing actions to locomotor.
* **Parameters:**
  - `item` -- Item entity to use.
  - `actioncode` -- Action code identifier.
  - `mod_name` -- Mod name string.
* **Returns:** None

### `ControllerUseItemOnItemFromInvTile(item, active_item, actioncode, mod_name)`
* **Description:** Handles using an active item on another item from the inventory tile.
* **Parameters:**
  - `item` -- Target item entity.
  - `active_item` -- Active item entity.
  - `actioncode` -- Action code identifier.
  - `mod_name` -- Mod name string.
* **Returns:** Boolean true if action pushed.

### `ControllerUseItemOnSelfFromInvTile(item, actioncode, mod_name)`
* **Description:** Handles using an item on self from the inventory tile.
* **Parameters:**
  - `item` -- Item entity to use on self.
  - `actioncode` -- Action code identifier.
  - `mod_name` -- Mod name string.
* **Returns:** None

### `ControllerUseItemOnSceneFromInvTile(item, target, actioncode, mod_name)`
* **Description:** Handles using an item on a scene target from the inventory tile.
* **Parameters:**
  - `item` -- Item entity to use.
  - `target` -- Target entity in scene.
  - `actioncode` -- Action code identifier.
  - `mod_name` -- Mod name string.
* **Returns:** None

### `InspectItemFromInvTile(item)`
* **Description:** Pushes a LOOKAT action to inspect the item.
* **Parameters:**
  - `item` -- Item entity to inspect.
* **Returns:** None

### `DropItemFromInvTile(item, single)`
* **Description:** Pushes a DROP action for the item from the inventory tile.
* **Parameters:**
  - `item` -- Item entity to drop.
  - `single` -- Boolean to drop single item vs whole stack.
* **Returns:** None

### `CastSpellBookFromInv(item, spell_id)`
* **Description:** Handles casting a spell from the inventory spellbook.
* **Parameters:**
  - `item` -- Spellbook item or self.
  - `spell_id` -- ID of the spell to cast.
* **Returns:** None

### `EquipActiveItem()`
* **Description:** Equips the active item if it is equippable and slot is free.
* **Parameters:** None
* **Returns:** None

### `EquipActionItem(item)`
* **Description:** Equips an item to the hands slot, handling stacks.
* **Parameters:**
  - `item` -- Item entity to equip (defaults to active item).
* **Returns:** None

### `SwapEquipWithActiveItem()`
* **Description:** Swaps the active item with the equipped item in the same slot.
* **Parameters:** None
* **Returns:** None

### `TakeActiveItemFromEquipSlot(eslot)`
* **Description:** Takes an item from an equip slot to the active item slot or drops it.
* **Parameters:**
  - `eslot` -- Equip slot enum.
* **Returns:** None

### `TakeActiveItemFromEquipSlotID(eslotid)`
* **Description:** Takes an item from an equip slot by ID to the active item slot.
* **Parameters:**
  - `eslotid` -- Equip slot ID number.
* **Returns:** None

### `MoveItemFromAllOfSlot(slot, container)`
* **Description:** Moves an entire item stack from a slot to a target container, checking if the item is locked in slot and validating container access.
* **Parameters:**
  - `slot` -- integer slot index to move item from
  - `container` -- target container entity to move item to
* **Returns:** nil
* **Error states:** Asserts if BRANCH is 'dev' when attempting to move a locked item

### `MoveItemFromHalfOfSlot(slot, container)`
* **Description:** Moves half of an item stack from a slot to a target container, only works if the item is stackable and has more than one item.
* **Parameters:**
  - `slot` -- integer slot index to move item from
  - `container` -- target container entity to move item to
* **Returns:** nil

### `MoveItemFromCountOfSlot(slot, container, count)`
* **Description:** Moves a specific count of items from a slot to a target container, clamping count to valid stack size range.
* **Parameters:**
  - `slot` -- integer slot index to move item from
  - `container` -- target container entity to move item to
  - `count` -- number of items to move from the stack
* **Returns:** nil
* **Error states:** Asserts if BRANCH is 'dev' when attempting to move a locked item

### `GetEquippedMoistureRate(slot)`
* **Description:** Calculates total moisture and max moisture values from equipped items, either for a specific slot or all equip slots.
* **Parameters:**
  - `slot` -- optional slot index; if nil, calculates for all equip slots
* **Returns:** moisture (number), max (number)

### `GetWaterproofness(slot)`
* **Description:** Returns total waterproofness value from equipped items, returns 1 if the entity has moisture component with waterproof inventory enabled.
* **Parameters:**
  - `slot` -- optional slot index; if nil, calculates for all equip slots
* **Returns:** number (waterproofness value)

### `IsWaterproof()`
* **Description:** Checks if the inventory is fully waterproof by testing if waterproofness is greater than or equal to 1.
* **Parameters:** None
* **Returns:** boolean

### `TransferComponent(newinst)`
* **Description:** Transfers inventory to a new entity instance, optionally empties beard if EmptyBeard function exists on the current instance.
* **Parameters:**
  - `newinst` -- target entity instance to transfer inventory to
* **Returns:** nil

### `GetOpenContainerProxyFor(master)`
* **Description:** Searches through open container proxies to find one whose master matches the provided master entity.
* **Parameters:**
  - `master` -- master entity to find matching container proxy for
* **Returns:** container proxy entity or nil if not found

## Events & listeners

**Listens to:**
- `death` — Listened on entity to trigger OnDeath callback when entity dies
- `player_despawn` — Listened on entity to trigger OnOwnerDespawned when player despawns

**Pushes:**
- `itemlose` — Pushed when an item is moved from slot to active item
- `dropitem` — Pushed when an item is dropped from inventory
- `itemget` — Pushed when an item is successfully added to a slot or active item.
- `gotnewitem` — Pushed when a new item is acquired.
- `inventoryfull` — Pushed when inventory cannot accept an item.
- `setoverflow` — Pushed when overflow container changes.
- `unequip` — Pushed when an item is unequipped.
- `newactiveitem` — Pushed when the active item changes.
- `equip` — Pushed when an item is equipped.