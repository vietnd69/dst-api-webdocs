---
id: curseditem
title: Curseditem
description: This component manages items that actively seek out players to apply a curse effect, often making the item stick to the player.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: inventory
source_hash: cdca7f42
---

# Curseditem

## Overview
The Curseditem component is responsible for implementing an item's ability to "curse" players. This involves actively seeking out nearby players, checking their eligibility and inventory space, moving towards them, and eventually forcing the item into their possession to apply a curse effect. It also manages the persistence of the curse by ensuring the item remains with the cursed player if possible.

## Dependencies & Tags
*   **Components relied upon**: `health`, `inventory`, `stackable`, `inventoryitem`, `cursable`, `debuffable`, `Transform`, `floater`, `talker`.
*   **Tags added/removed by this component**:
    *   Adds `cursed_inventory_item` to the item when its `active` property is true.
    *   Removes `cursed_inventory_item` from the item when its `active` property is false.
    *   Removes `applied_curse` from the item if its `cursed_target` becomes invalid (e.g., dies).

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | (Self) | A reference to the entity this component is attached to. |
| `active` | `boolean` | `true` | Determines if the cursed item is currently active and capable of pursuing and cursing players. |
| `cursed_target` | `Entity` or `nil` | `nil` | The player entity currently cursed by this item. |
| `target` | `Entity` or `nil` | `nil` | The player entity this item is currently pursuing to curse. |
| `CopyCursedFields` | `function` | `CopyCursedFields` (local function) | A reference to a utility function used to transfer curse-related state (active, cursed_target, target) between Curseditem components, typically for stackable items. |
| `inst.findplayertask` | `Task` or `nil` | `nil` | A reference to the periodic task used to search for a player to curse. |
| `starttime` | `number` | `nil` | The game time when a valid `target` player was first identified. |
| `startpos` | `Vector3` | `nil` | The world position of the item when a valid `target` player was first identified. |

## Main Functions
### `Curseditem(self, inst)` (Constructor)
*   **Description:** Initializes the Curseditem component on an entity. It sets initial property values, registers event listeners for pickup, sleep, and wake events, and starts the component's update cycle.
*   **Parameters:**
    *   `self`: The Curseditem instance.
    *   `inst`: The entity to which this component is attached.

### `onactive(self, active)`
*   **Description:** This function serves as a listener for changes to the `active` property. When the `active` property changes, it adds or removes the `cursed_inventory_item` tag from the `inst` entity accordingly.
*   **Parameters:**
    *   `self`: The Curseditem instance.
    *   `active`: `boolean`, the new value of the `active` property.

### `CopyCursedFields(from, to)`
*   **Description:** A utility function used to copy the `active`, `cursed_target`, and `target` states from one Curseditem component (`from`) to another (`to`). This is primarily used to maintain curse state when items are transferred, split, or stacked.
*   **Parameters:**
    *   `from`: The source Curseditem component instance.
    *   `to`: The destination Curseditem component instance.

### `checkplayersinventoryforspace(player)`
*   **Description:** Determines if a given player has sufficient inventory space to receive this cursed item. It considers empty slots, the possibility of adding to a partial stack of the same item, or if the player could drop another item to make space.
*   **Parameters:**
    *   `player`: The player `Entity` to check.
*   **Returns:** `boolean`, `true` if space is available or can be made, `false` otherwise.

### `lookforplayer()`
*   **Description:** Initiates or restarts a periodic task to find the closest valid player within a 10-unit radius. A valid player must be alive, cursable, not have a "spawnprotectionbuff" debuff, and have inventory space for the item. If a suitable player is found, the task is canceled, and that player is set as the component's `target`.
*   **Parameters:** None.

### `CheckForOwner()`
*   **Description:** This function is called when a `cursed_target` exists. It verifies if the `cursed_target` is still alive. If the `cursed_target` is dead, the "applied_curse" tag is removed, and `cursed_target` is cleared. Otherwise, if the item is not `INLIMBO` and its current owner is not the `cursed_target`, it attempts to force the item back onto the `cursed_target`'s inventory.
*   **Parameters:** None.

### `OnUpdate(dt)`
*   **Description:** The primary update logic for the cursed item. It manages the item's state transitions, player pursuit, and curse application.
    *   If a `cursed_target` is present, it first calls `CheckForOwner()` to validate the curse.
    *   If a `target` player is active and valid (alive, cursable, has inventory space), the item moves towards them. If it gets close enough, it forces itself into the player's inventory. If not close, it interpolates its position towards the target.
    *   If no `target` is present or the current `target` becomes invalid, it cancels any existing player search task and schedules a new one to find a player.
*   **Parameters:**
    *   `dt`: `number`, the time elapsed since the last update frame.

### `Given(item, data)`
*   **Description:** A callback function triggered when the item is picked up by or given to a new owner. If the new owner has a `cursable` component, the item attempts to apply its curse to them. If the curse has already been applied, the owner may utter a contextual message indicating they cannot escape the curse.
*   **Parameters:**
    *   `item`: The item `Entity` itself (which is `self.inst`).
    *   `data`: `table`, contains event-specific data, specifically `data.owner` which is the `Entity` receiving the item.

## Events & Listeners
*   **Listens for `onpickup`**: When the `inst` entity is picked up, it triggers the `Given` function to handle curse application.
*   **Listens for `entitysleep`**: When the `inst` entity goes to sleep, it calls `self.inst:StopUpdatingComponent(self)` to pause its update logic.
*   **Listens for `entitywake`**: When the `inst` entity wakes up, it calls `self.inst:StartUpdatingComponent(self)` to resume its update logic.