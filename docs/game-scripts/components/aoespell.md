---
id: aoespell
title: Aoespell
description: Provides reusable logic for casting area-of-effect spells with custom spell functions and rich casting validations.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 1a6f8280
---

# aoespell

## Overview
The `aoespell` component provides core functionality for managing and casting Area of Effect (AoE) spells within Don't Starve Together. It allows an entity to define a custom spell execution logic, verify casting conditions based on various other components (like `spellbook`, `aoetargeting`, `fueled`), and notify the caster of the spell's outcome. Its primary responsibility is to abstract the complexities of spell casting and condition checking into a reusable component.

## Dependencies & Tags
This component relies on or interacts with the following other components and game elements:
*   `inst.components.spellbook`: Used to check if the item can be used as a spell by the `doer`.
*   `inst.components.inventoryitem`: Checks if the item is owned by the `doer` if it's an inventory item.
*   `inst.components.fueled`: Checks if a fueled item (like a staff) has fuel.
*   `inst.components.aoetargeting`: Used to retrieve specific targeting rules such as `alwaysvalid`, `allowwater`, `deployradius`, and `allowriding`.
*   `doer.components.rider`: Checks if the `doer` is riding a mount, and if casting is disallowed while riding.
*   `TheWorld.Map`: Calls `TheWorld.Map:CanCastAtPoint` to determine if the target position is valid for casting.

None identified.

## Properties
| Property    | Type       | Default Value | Description                                                                                                                                                                                                                                                                                                                           |
| :---------- | :--------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `spellfn`   | `function` | `nil`         | A custom Lua function that defines the actual effect of the spell when it is cast. It is expected to be set via `SetSpellFn`. When called, it receives `(inst, doer, pos)` as arguments and should return `(success, reason)`, where `success` is a boolean and `reason` is an optional string explaining failure. |

## Main Functions
### `SetSpellFn(fn)`
*   **Description:** Sets the custom function that will be executed when the spell is cast. This function defines the actual effects of the AoE spell.
*   **Parameters:**
    *   `fn`: (`function`) The function to be called when `CastSpell` is executed. It should accept `(inst, doer, pos)` and optionally return `(success, reason)`.

### `CastSpell(doer, pos)`
*   **Description:** Executes the spell's custom logic (defined by `self.spellfn`) at the specified position. It also pushes an `oncastaoespell` event to the `doer` after attempting the cast.
*   **Parameters:**
    *   `doer`: (`entity`) The entity attempting to cast the spell.
    *   `pos`: (`vector3`) The target position for the spell in the world.

### `CanCast(doer, pos)`
*   **Description:** Determines if the spell can be cast by the `doer` at the given `pos`. This function performs a series of checks based on various components and world conditions.
*   **Parameters:**
    *   `doer`: (`entity`) The entity attempting to cast the spell.
    *   `pos`: (`vector3`) The target position for the spell in the world.
*   **Checks Performed:**
    *   Verifies that `self.spellfn` has been set.
    *   If `inst` has a `spellbook` component:
        *   Checks `spellbook:CanBeUsedBy(doer)`.
        *   If `inst` has an `inventoryitem` component, ensures `doer` is the `GetGrandOwner()`.
        *   If `inst` has a `fueled` component, ensures it's not `IsEmpty()`.
        *   If `inst` is a player, ensures `inst` is the `doer`.
    *   If `inst` has an `aoetargeting` component:
        *   Checks `aoetargeting:IsEnabled()`.
        *   Retrieves `alwaysvalid`, `allowwater`, `deployradius`, and `allowriding` from `aoetargeting`.
    *   Checks if the `doer` is riding (`doer.components.rider:IsRiding()`) and if `allowriding` is false.
    *   Finally, calls `TheWorld.Map:CanCastAtPoint(pos, alwayspassable, allowwater, deployradius)` to validate the map position.

## Events & Listeners
*   **Pushes Event:**
    *   `oncastaoespell`: Pushed to the `doer` entity after `CastSpell` is called.
        *   **Data:** `{ item = self.inst, pos = pos, success = success }`
            *   `item`: The spell item (the entity with this component).
            *   `pos`: The target position where the spell was cast.
            *   `success`: A boolean indicating if the spell's `spellfn` executed successfully.