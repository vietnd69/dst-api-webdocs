---
id: debuff
title: Debuff
description: This component manages the lifecycle and behavior of a single debuff instance attached to an entity.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Debuff

## Overview
The `Debuff` component is a flexible utility class designed to represent and manage a single debuff effect applied to an entity. It holds references to the debuff's name, its target entity, and a series of optional callback functions that define its behavior during attachment, detachment, extension, and visual updates. This component is typically instantiated and managed by a `debuffable` component on a target entity, allowing for dynamic and custom debuff effects.

## Dependencies & Tags
This component itself does not directly add other components or tags to its `inst`. It is designed to be utilized and managed by another component, specifically the `debuffable` component, which is responsible for applying and removing `Debuff` instances from a target entity.

## Properties
| Property | Type | Default Value | Description |
| :------------------------- | :------- | :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inst` | `Entity` | N/A | The entity instance that this `Debuff` object is conceptually attached to. In practice, this often refers to a separate visual or effect entity that represents the debuff, rather than the `target` entity itself. |
| `name` | `string` | `nil` | The unique identifier string for this debuff instance. |
| `target` | `Entity` | `nil` | The entity currently affected by this debuff. |
| `onattachedfn` | `function` | `nil` | A callback function executed when the debuff is first attached to the `target` entity. It typically receives `(debuff_inst, target, followsymbol, followoffset, data, buffer)`. |
| `ondetachedfn` | `function` | `nil` | A callback function executed when the debuff is removed from the `target` entity. It typically receives `(debuff_inst, target)`. |
| `onextendedfn` | `function` | `nil` | A callback function executed when the debuff's duration or effect is extended on the `target` entity. It typically receives `(debuff_inst, target, followsymbol, followoffset, data, buffer)`. |
| `onchangefollowsymbolfn` | `function` | `nil` | A callback function executed when the debuff's visual attachment point (follow symbol) on the `target` entity needs to change. It typically receives `(debuff_inst, target, followsymbol, followoffset)`. |

## Main Functions
### `SetAttachedFn(fn)`
*   **Description:** Sets the callback function that will be invoked when this debuff is initially attached to a target.
*   **Parameters:**
    *   `fn`: `function` - The function to be called. It should accept parameters like `(debuff_inst, target, followsymbol, followoffset, data, buffer)`.

### `SetDetachedFn(fn)`
*   **Description:** Sets the callback function that will be invoked when this debuff is detached from its target.
*   **Parameters:**
    *   `fn`: `function` - The function to be called. It should accept parameters like `(debuff_inst, target)`.

### `SetExtendedFn(fn)`
*   **Description:** Sets the callback function that will be invoked when this debuff is extended on its target.
*   **Parameters:**
    *   `fn`: `function` - The function to be called. It should accept parameters like `(debuff_inst, target, followsymbol, followoffset, data, buffer)`.

### `SetChangeFollowSymbolFn(fn)`
*   **Description:** Sets the callback function that will be invoked when the visual follow symbol of this debuff on its target needs to change.
*   **Parameters:**
    *   `fn`: `function` - The function to be called. It should accept parameters like `(debuff_inst, target, followsymbol, followoffset)`.

### `Stop()`
*   **Description:** Initiates the removal of this debuff from its target entity. This is achieved by calling `RemoveDebuff` on the `target` entity's `debuffable` component (presuming the target has one).
*   **Parameters:** None.

### `AttachTo(name, target, followsymbol, followoffset, data, buffer)`
*   **Description:** Attaches this `Debuff` instance to a specified target entity, setting its identifier and target reference. It then executes the `onattachedfn` callback if one has been defined. This function is typically called by the `debuffable` component.
*   **Parameters:**
    *   `name`: `string` - The unique identifier for this debuff.
    *   `target`: `Entity` - The entity to which the debuff is being attached.
    *   `followsymbol`: `string` - (Optional) The name of a symbol on the target entity's anim state to follow for visual effects.
    *   `followoffset`: `Vector3` - (Optional) An offset from the `followsymbol` for visual effects.
    *   `data`: `table` - (Optional) Arbitrary data specific to this debuff instance.
    *   `buffer`: `number` - (Optional) A numeric value, often representing duration or intensity.

### `OnDetach()`
*   **Description:** Clears the debuff's name and target references, then executes the `ondetachedfn` callback if one has been defined. This function is typically called by the `debuffable` component when the debuff is being removed.
*   **Parameters:** None.

### `Extend(followsymbol, followoffset, data, buffer)`
*   **Description:** Executes the `onextendedfn` callback if one has been defined. This function is used to refresh or update an existing debuff, often extending its duration or modifying its effects.
*   **Parameters:**
    *   `followsymbol`: `string` - (Optional) The name of a symbol on the target entity's anim state to follow for visual effects.
    *   `followoffset`: `Vector3` - (Optional) An offset from the `followsymbol` for visual effects.
    *   `data`: `table` - (Optional) Arbitrary data specific to this debuff instance.
    *   `buffer`: `number` - (Optional) A numeric value, often representing duration or intensity.

### `ChangeFollowSymbol(followsymbol, followoffset)`
*   **Description:** Executes the `onchangefollowsymbolfn` callback if one has been defined. This function is used to adjust the visual attachment point of the debuff on its target. This function is typically called by the `debuffable` component.
*   **Parameters:**
    *   `followsymbol`: `string` - The new name of the symbol on the target entity's anim state to follow.
    *   `followoffset`: `Vector3` - The new offset from the `followsymbol`.