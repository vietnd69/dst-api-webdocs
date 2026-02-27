---
id: cursable
title: Cursable
description: This component enables an entity to receive, manage, and remove various curses, often originating from cursed items in its inventory.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 5b6e9495
---

# Cursable

## Overview
The Cursable component allows an entity to be affected by various curses, typically originating from cursed items. It manages the application, removal, and current stack count of curses on the entity, and triggers specific curse-related behaviors, such as those associated with "MONKEY" curses, by interacting with the `curse_monkey_util` module. It also includes logic for handling cursed items within the entity's inventory and ensuring proper item management when curses are applied or removed.

## Dependencies & Tags
This component relies on the following other components and utility modules:
*   `health` component (checked for entity's life status)
*   `inventory` component (heavily used for item management, finding, consuming, and dropping items)
*   `debuffable` component (checked for "spawnprotectionbuff" debuff)
*   `curseditem` component (present on items that apply curses)
*   `stackable` component (present on items that can be stacked, used to determine curse quantity)
*   `inventoryitem` component (present on items handled by inventory)
*   `curse_monkey_util` module (for specific "MONKEY" curse effects)

Tags involved in its logic:
*   `applied_curse` (added to items upon applying a curse)
*   `ghost` (checked on the owning entity)
*   `monkey_token` (searched for on items when removing "MONKEY" curses)
*   `nosteal` (checked on items when determining inventory space or items to drop)
*   `INLIMBO` (checked on items during `ForceOntoOwner` to determine position)

## Properties
| Property   | Type    | Default Value | Description                                                    |
| :--------- | :------ | :------------ | :------------------------------------------------------------- |
| `inst`     | `Entity`| `N/A`         | A reference to the entity this component is attached to.       |
| `curses`   | `table` | `{}`          | A table mapping curse names (string) to their current stack count (number) on the entity. |

## Main Functions
### `ApplyCurse(item, curse)`
*   **Description:** Applies a curse to the entity. If an `item` is provided, the curse type and stack size are extracted from the item's `curseditem` and `stackable` components, and the item is tagged with `applied_curse`. The curse count for the specified type is incremented. Special handling exists for "MONKEY" curses, invoking `curse_monkey.docurse`.
*   **Parameters:**
    *   `item`: (`Entity`, optional) The cursed item initiating the curse. If provided, its `curseditem` component determines the curse type.
    *   `curse`: (`string`, optional) The name of the curse to apply. This parameter is used if `item` is not provided.

### `RemoveCurse(curse, numofitems, dropitems)`
*   **Description:** Removes a specified quantity of a curse from the entity. For "MONKEY" curses, it attempts to find and remove `monkey_token` items from the entity's inventory, optionally dropping them into the world. The curse count for the specified type is decremented, and special handling exists for "MONKEY" curses, invoking `curse_monkey.uncurse`.
*   **Parameters:**
    *   `curse`: (`string`) The name of the curse to remove (e.g., "MONKEY").
    *   `numofitems`: (`number`) The number of curse stacks or contributing items to remove.
    *   `dropitems`: (`boolean`) If `true`, and the curse is "MONKEY", any removed `monkey_token` items will be spawned into the world.

### `IsCursable(item)`
*   **Description:** Checks if the entity can currently receive a cursed item or curse. It verifies the entity is not a ghost, doesn't have "spawnprotectionbuff", and has available inventory space (either an empty slot or a stackable slot for the given `item`).
*   **Parameters:**
    *   `item`: (`Entity`) The item that is attempting to be cursed onto the entity.
*   **Returns:** `boolean` `true` if the entity can receive the curse/item; `false` if it cannot (e.g., has spawn protection); `nil` if the entity is a "ghost".

### `ForceOntoOwner(item)`
*   **Description:** Forces a given item into the entity's inventory, ensuring there is space by first attempting to stack the item, and if inventory is full and stacking is not possible, dropping another non-`nosteal` item from the inventory.
*   **Parameters:**
    *   `item`: (`Entity`) The item to be placed into the entity's inventory.

### `Died()`
*   **Description:** This function is intended to be called when the entity dies. It iterates through all cursed items in the entity's inventory and removes their corresponding curses, dropping the items into the world.
*   **Parameters:** None.

### `OnSave()`
*   **Description:** A placeholder function for saving the component's state. Currently, it returns an empty table, indicating that no component-specific data (like active curses) is saved. The commented-out code suggests `self.curses` could be saved in the future.
*   **Parameters:** None.
*   **Returns:** `table` An empty table.

### `OnLoad(data)`
*   **Description:** A placeholder function for loading the component's state. It currently does nothing. The commented-out code suggests it could load saved curses and re-apply them.
*   **Parameters:**
    *   `data`: (`table`) The saved data for this component.