---
id: colouradder
title: Colouradder
description: This component manages and applies additive color effects to an entity by combining contributions from multiple sources and propagating the resulting color to its children.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Colouradder

## Overview
The Colouradder component is responsible for managing a stack of additive color contributions from various sources. It calculates a combined additive color based on these contributions and applies it to the entity's `AnimState` or propagates it to attached child entities that also have a `Colouradder` or `ColouradderSync` component. This allows for dynamic, layered visual effects where multiple game elements can contribute to an entity's coloration.

## Dependencies & Tags
This component interacts with the following:
*   **`AnimState`**: If present on the host entity or its children, the calculated additive color is directly applied using `AnimState:SetAddColour()`.
*   **`colouraddersync`**: If present on the host entity or its children, the calculated additive color is synced using `colouraddersync:SyncColour()`.
*   **`colouradder`**: Child entities can also have this component, allowing for nested color propagation.

No specific tags are added or removed by this component.

## Properties
| Property            | Type      | Default Value | Description                                                                                             |
| :------------------ | :-------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inst`              | `Entity`  | (passed in)   | The entity instance this component is attached to.                                                      |
| `colourstack`       | `table`   | `{}`          | A table storing active additive color contributions, indexed by their source entity or object. Each value is an RGBA table `{r, g, b, a}`. |
| `children`          | `table`   | `{}`          | A table storing child entities that this component propagates its current color to, indexed by the child entity. |
| `colour`            | `table`   | `{ 0, 0, 0, 0 }` | The currently calculated and applied aggregate additive color (RGBA values from 0-1).                     |
| `_onremovesource`   | `function`| (function ref) | An internal callback function used to automatically `PopColour` when a source entity is removed.          |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** Called when the component is removed from its entity. It cleans up all registered "onremove" event callbacks for color sources and children, and ensures that children that received color from this component have that contribution removed.
*   **Parameters:** None.

### `AttachChild(child)`
*   **Description:** Adds a child entity to which this component will propagate its current additive color. The child will have its colour updated immediately, and will also remove itself from the parent's children list if it is removed from the world.
*   **Parameters:**
    *   `child`: (`Entity`) The entity to attach as a child.

### `DetachChild(child)`
*   **Description:** Removes a child entity from this component's propagation list. If the child has its own `colouradder` component, this component's contribution will be removed from the child's color stack.
*   **Parameters:**
    *   `child`: (`Entity`) The entity to detach.

### `GetCurrentColour()`
*   **Description:** Returns the current aggregate additive color (RGBA) that is applied to the entity.
*   **Parameters:** None.

### `CalculateCurrentColour()`
*   **Description:** Recalculates the aggregate additive color by summing up all contributions currently present in the `colourstack`. The resulting RGBA values are clamped between 0 and 1.
*   **Parameters:** None.

### `OnSetColour(r, g, b, a)`
*   **Description:** Sets the internal `colour` property to the specified RGBA values, then applies this color to the entity's `AnimState` (if present) or `colouraddersync` component (if present). It also propagates this new color to all attached children.
*   **Parameters:**
    *   `r`: (`number`) The red component (0-1).
    *   `g`: (`number`) The green component (0-1).
    *   `b`: (`number`) The blue component (0-1).
    *   `a`: (`number`) The alpha component (0-1).

### `PushColour(source, r, g, b, a)`
*   **Description:** Adds or updates an additive color contribution from a specific `source`. If the source already exists, its color is updated. If the color is `(0,0,0,0)`, it's treated as a `PopColour` call. If the source is an entity, the component will automatically listen for its "onremove" event to clear its contribution. After pushing, the total aggregate color is recalculated and applied.
*   **Parameters:**
    *   `source`: (`any`) The unique identifier for the color contribution (often an `Entity`).
    *   `r`: (`number`) The red component (0-1).
    *   `g`: (`number`) The green component (0-1).
    *   `b`: (`number`) The blue component (0-1).
    *   `a`: (`number`) The alpha component (0-1).

### `PopColour(source)`
*   **Description:** Removes a specific additive color contribution from the `colourstack`. If the source was an entity, its "onremove" event listener is removed. After popping, the total aggregate color is recalculated and applied.
*   **Parameters:**
    *   `source`: (`any`) The unique identifier of the color contribution to remove.

### `GetDebugString()`
*   **Description:** Generates a formatted string containing the current aggregate color and a list of all individual color contributions in the `colourstack`, useful for debugging.
*   **Parameters:** None.

## Events & Listeners
*   `inst:ListenForEvent("onremove", self._onremovesource, source)`: Listens for the `onremove` event on specific color `source` entities to automatically remove their additive color contribution from the `colourstack` when the source is removed from the world.
*   `inst:ListenForEvent("onremove", self.children[child], child)`: Listens for the `onremove` event on `child` entities to automatically remove them from the `children` list when they are removed from the world.