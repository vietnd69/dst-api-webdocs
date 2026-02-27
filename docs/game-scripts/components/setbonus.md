---
id: setbonus
title: Setbonus
description: Manages equipment set bonuses by tracking when matching head and body items are equipped or unequipped, and invoking custom callbacks when a set bonus is activated or deactivated.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 35948e2f
---

# Setbonus

## Overview
The `SetBonus` component is responsible for detecting and managing equipment set bonuses in the game. It verifies whether an entity (typically a piece of equipment) belongs to a named equipment set (e.g., `FARMER`, `SCHOLAR`) and coordinates enabling or disabling the set bonus when a matching pair of head and body equipment items is equipped or unequipped. It works in conjunction with the `inventory` component and supports optional custom logic via `onenabledfn` and `ondisabledfn` callbacks.

## Dependencies & Tags
- **Component Dependencies**: Relies on the entity having a `setbonus` component if equipped as part of a set (indirect self-reference), and on `inventory.equipslots` being populated with head/body items for set checks. Also interacts with `inventoryitem` and `inventory` components during removal or state updates.
- **Tags**: None explicitly added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `setname` | `string` | `""` | The name of the equipment set this item belongs to (e.g., `"FARMER"`), validated against `EQUIPMENTSETNAMES` in `constants.lua`. |
| `enabled` | `boolean` | `false` | Indicates whether the set bonus is currently active for this item. |
| `onenabledfn` | `function` | `nil` | Optional callback function invoked when the set bonus is enabled; receives the equipped item as argument. |
| `ondisabledfn` | `function` | `nil` | Optional callback function invoked when the set bonus is disabled; receives the equipped item as argument. |
| `inst` | `Entity` | `self` (the entity the component is attached to) | Reference to the entity this component instance is attached to. |

*Note: `EnableBonusForEquip` and `DisableBonusForEquip` are exposed as public methods for external use by mods but are implemented as local functions and attached as properties.*  

## Main Functions

### `SetBonus:SetSetName(name)`
* **Description:** Assigns the equipment set name to this item. Performs validation to ensure the name exists in `EQUIPMENTSETNAMES`.
* **Parameters:**  
  - `name` (`string`): The name of the equipment set (case-insensitive; internally uppercased for lookup).

### `SetBonus:SetOnEnabledFn(fn)`
* **Description:** Sets the callback function to invoke when the set bonus is enabled.
* **Parameters:**  
  - `fn` (`function`): A function that accepts a single argument (the equipped item entity).

### `SetBonus:SetOnDisabledFn(fn)`
* **Description:** Sets the callback function to invoke when the set bonus is disabled.
* **Parameters:**  
  - `fn` (`function`): A function that accepts a single argument (the equipped item entity).

### `SetBonus:_HasSetBonus(inventory)`
* **Description:** Checks whether the `HEAD` and `BODY` equipment slots both contain items that belong to the same set (i.e., share the same `setname`). Returns a boolean indicating whether a matching set exists, and the set name if so.
* **Parameters:**  
  - `inventory` (`Inventory`): The inventory component of the entity (e.g., a player) to check for equipped items.

### `SetBonus:UpdateSetBonus(inventory, isequipping)`
* **Description:** Updates the set bonus state for all items in the inventory based on whether the full set is equipped. Enables bonuses for matching items when `isequipping=true`, or disables them otherwise. Also disables the current item if it is no longer equipped (`isequipping=false`).
* **Parameters:**  
  - `inventory` (`Inventory`): The inventory component to inspect and update.  
  - `isequipping` (`boolean`): `true` if an item is being equipped, `false` if unequipping.

### `SetBonus:IsEnabled(setname)`
* **Description:** Checks if the set bonus is currently active. If `setname` is provided, also verifies that the active set matches the given name.
* **Parameters:**  
  - `setname` (`string?`, optional): Specific set name to validate against; if `nil`, only checks `enabled` state.

### `SetBonus:OnRemoveFromEntity()`
* **Description:** Handles cleanup when the item is removed from its entity (e.g., destroyed, moved to inventory). Disables the bonus and triggers a full update of set bonuses for the owner’s inventory if necessary.
* **Parameters:** None.

### `SetBonus:GetDebugString()`
* **Description:** Returns a formatted debug string summarizing the set name and whether the bonus is active.
* **Parameters:** None.

## Events & Listeners
None. This component does not listen for or push any events via `inst:ListenForEvent` or `inst:PushEvent`.