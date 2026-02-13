---
id: amorphous
title: Amorphous
description: Allows an entity to morph between defined forms based on container contents and custom enter or exit behavior.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# amorphous

## Overview
The `amorphous` component enables an entity to dynamically change its visual appearance or behavior (referred to as "forms") based on internal conditions, primarily the items held within its `container` component. It allows for defining multiple forms, each with specific requirements (e.g., item tags) and associated entry/exit functions, facilitating dynamic transformations of entities in the game world.

## Dependencies & Tags
This component relies on the presence of other components on the entity to function correctly, though it does not add them itself.

*   `inst.components.container`: Crucial for forms that depend on items held by the entity. The component checks container contents, specifically item tags, to determine the appropriate form.
*   `inst.components.health`: Used to prevent morphing if the entity is dead.
*   Item Tags: Forms are defined with `itemtags`, requiring specific items with those tags to be present in the container.

None identified.

## Properties
| Property        | Type     | Default Value | Description                                                                   |
| :-------------- | :------- | :------------ | :---------------------------------------------------------------------------- |
| `self.inst`     | `Entity` | `nil`         | A reference to the entity that this component is attached to.                 |
| `self.forms`    | `table`  | `{}`          | A numerically indexed table containing all defined form definitions for the entity. |
| `self.currentform`| `table`  | `nil`         | A reference to the currently active form definition.                          |

## Main Functions
### `Amorphous:OnRemoveFromEntity()`
*   **Description:** Cleans up event listeners when the component is removed from the entity to prevent memory leaks and ensure proper uninitialization.
*   **Parameters:** None.

### `Amorphous:OnSave()`
*   **Description:** Prepares data for saving the entity's state. It saves the name of the `currentform` if it exists and is not the last form in the `self.forms` table (which is typically considered the default or base form).
*   **Parameters:** None.

### `Amorphous:OnLoad(data)`
*   **Description:** Loads the entity's amorphous state from saved data. If a `form` name is provided in the `data`, it attempts to find and `MorphToForm` that specific form.
*   **Parameters:**
    *   `data`: (`table`) A table containing saved data, expected to have a `form` field with the name of the form to load.

### `Amorphous:LoadPostPass()`
*   **Description:** Called during the entity's `LoadPostPass` phase. This function adds additional event listeners (`itemget`, `itemlose`) that are typically needed after initial entity setup. If `POPULATING` is true (e.g., during world generation), it immediately triggers a `CheckForMorph`.
*   **Parameters:** None.

### `Amorphous:GetCurrentForm()`
*   **Description:** Retrieves the name of the `currentform`.
*   **Parameters:** None.

### `Amorphous:AddForm(form)`
*   **Description:** Adds a new form definition to the `self.forms` table. Forms should be tables containing at least a `name` field, and optionally `itemtags`, `enterformfn`, and `exitformfn`.
*   **Parameters:**
    *   `form`: (`table`) A table defining the new form.

### `Amorphous:FindForm(name)`
*   **Description:** Searches the `self.forms` table for a form definition matching the given `name`.
*   **Parameters:**
    *   `name`: (`string`) The name of the form to find.

### `Amorphous:MorphToForm(form, instant)`
*   **Description:** Transitions the entity to a specified `form`. If there is a `currentform` with an `exitformfn`, that function is called first. Then, the `currentform` is updated, and if the new `form` has an `enterformfn`, it is called.
*   **Parameters:**
    *   `form`: (`table`) The target form definition to morph to.
    *   `instant`: (`boolean`) A flag passed to `exitformfn` and `enterformfn`, typically indicating if the transition should be immediate without animations or delays.

### `Amorphous:CheckForMorph()`
*   **Description:** The core logic for determining if the entity should change its form. It iterates through the defined `forms` (excluding the last/default one), checking if the entity's `container` component (if present) contains items matching the `itemtags` defined for each form. The first form whose tag requirements are met will be morphed to. If no such form is found, the entity will morph to the last form in the `self.forms` table (considered the default state). Morphs are prevented if the container is open or the entity is dead.
*   **Parameters:** None.

## Events & Listeners
*   `inst:ListenForEvent("onclose", CheckForMorph)`: Triggers a form check when the entity's container (if present) is closed.
*   `inst:ListenForEvent("itemget", CheckForMorphIfClosed)`: Triggers a form check when an item is added to the entity's container, but only if the container is not currently open.
*   `inst:ListenForEvent("itemlose", CheckForMorphIfClosed)`: Triggers a form check when an item is removed from the entity's container, but only if the container is not currently open.