---
id: activatable
title: Activatable
description: Controls when and how an entity can be activated, using tags and callbacks to implement custom activation behavior.
sidebar_position: 1

last_updated: 2026-02_13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# activatable

## Overview
The `activatable` component manages the "activatable" state of an entity, determining when and how a player can interact with it through an activation action (e.g., clicking on it). It controls various activation modifiers such as forced right-click, quick actions, and standing actions by adding or removing specific tags on the entity. It provides hooks for custom activation logic and triggers an event upon successful activation.

## Dependencies & Tags
**Dependencies:**
None identified. This component primarily interacts with the entity's tag system.

**Tags Added/Removed by this Component:**
*   `inactive`: Added when `self.inactive` is `true`, removed when `false`. Typically prevents general interaction.
*   `standingactivation`: Added when `self.standingaction` is `true`, removed when `false`. Suggests the entity requires the player to be standing to activate.
*   `quickactivation`: Added when `self.quickaction` is `true`, removed when `false`. Implies a quicker or more immediate activation context.
*   `activatable_forceright`: Added when `self.forcerightclickaction` is `true`, removed when `false`. Forces activation via right-click interaction.
*   `activatable_forcenopickup`: Added when `self.forcenopickupaction` is `true`, removed when `false`. Prevents pickup when the entity is activatable.

## Properties
| Property | Type | Default Value | Description |
| :------------------------- | :--------- | :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inst` | `Entity` | `nil` | A reference to the entity this component is attached to. |
| `OnActivate` | `function` | `nil` | A callback function `(inst, doer)` that is executed when `DoActivate` is called. It should return `success, msg`. |
| `inactive` | `boolean` | `true` | When `true`, the entity is considered inactive and cannot be activated. This property automatically adds/removes the `inactive` tag. |
| `standingaction` | `boolean` | `false` | When `true`, this component adds the `standingactivation` tag to the entity. |
| `quickaction` | `boolean` | `false` | When `true`, this component adds the `quickactivation` tag to the entity. |
| `forcerightclickaction` | `boolean` | `false` | When `true`, this component adds the `activatable_forceright` tag to the entity, suggesting it should be activated via right-click. |
| `forcenopickupaction` | `boolean` | `false` | When `true`, this component adds the `activatable_forcenopickup` tag to the entity, indicating it cannot be picked up while activatable. |
| `CanActivateFn` | `function` | `nil` | An optional callback function `(inst, doer)` that can be set externally. If present, its return value (`success, msg`) will override or extend the default `CanActivate` logic. |

## Main Functions

### `Activatable:OnRemoveFromEntity()`
*   **Description:** This function is automatically called when the component is removed from its parent entity. It ensures that all tags added by this component (e.g., `inactive`, `quickactivation`) are properly cleaned up and removed from the entity to prevent lingering side effects.
*   **Parameters:** None.

### `Activatable:CanActivate(doer)`
*   **Description:** Determines if the entity can currently be activated by a specific `doer`. By default, it returns `true` if `self.inactive` is `false`. If a custom `self.CanActivateFn` has been set, that function's return value will be used instead, allowing for complex activation conditions.
*   **Parameters:**
    *   `doer`: The `Entity` attempting to activate this component.
*   **Returns:** `success (boolean), msg (string, optional)`:
    *   `success`: `true` if the entity can be activated, `false` otherwise.
    *   `msg`: An optional string message providing a reason if activation is not possible.

### `Activatable:DoActivate(doer)`
*   **Description:** Initiates the activation process. It first checks if `self.OnActivate` is defined. If so, it sets `self.inactive` to `false` (making the entity non-inactive), calls the `self.OnActivate` callback with the entity and the doer, and then pushes an `"onactivated"` event if the callback returns `true` for success.
*   **Parameters:**
    *   `doer`: The `Entity` performing the activation.
*   **Returns:** `success (boolean, optional), msg (string, optional)`:
    *   The return values from the `self.OnActivate` callback. If `self.OnActivate` is `nil`, it returns `nil`.

### `Activatable:GetDebugString()`
*   **Description:** Returns a string representation of the component's current `inactive` state, primarily for debugging purposes.
*   **Parameters:** None.
*   **Returns:** `string`: The string representation of `self.inactive` (e.g., `"true"` or `"false"`).

## Events & Listeners
*   **Pushes:**
    *   `"onactivated"`: Triggered by `Activatable:DoActivate(doer)` if the `self.OnActivate` callback returns `true` for success.
        *   **Payload:** `{doer = doer_entity}`