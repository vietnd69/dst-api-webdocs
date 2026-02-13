---
id: bloomer
title: Bloomer
description: Manages a priority-based stack of bloom visual effects for an entity and propagates them to attached child entities.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Bloomer

## Overview
The Bloomer component manages a stack of bloom visual effects applied to an entity. Each bloom effect has a source, an effect handle (`fx`), and a priority. The component ensures that only the bloom effect with the highest priority is active at any given time.

This component also supports a parent-child hierarchy. When a child entity is attached, it inherits the parent's currently active bloom effect. This effect propagation is handled recursively if the child also has a `bloomer` component.

## Dependencies & Tags
**Dependencies:**
*   Requires the entity to have an `AnimState` (`inst.AnimState`) to apply the visual effects.

**Tags:**
*   None identified.

## Properties
| Property     | Type   | Default Value | Description                                                                         |
|--------------|--------|---------------|-------------------------------------------------------------------------------------|
| inst         | Entity | `inst`        | The entity instance this component is attached to.                                  |
| bloomstack   | table  | `{}`          | An array that stores active bloom effects, sorted by priority.                      |
| children     | table  | `{}`          | A key-value map of attached child entities that will inherit bloom effects.         |

## Main Functions
### `AttachChild(child)`
*   **Description:** Registers a child entity to inherit bloom effects from this entity. If the parent currently has a bloom effect, it is immediately applied to the child. The component will automatically stop tracking the child if it is removed from the game.
*   **Parameters:**
    *   `child`: The entity instance to attach as a child.

### `DetachChild(child)`
*   **Description:** Unregisters a child entity, stopping it from inheriting bloom effects. If the child has its own `bloomer` component, the effect from this parent is popped from its stack.
*   **Parameters:**
    *   `child`: The entity instance to detach.

### `GetCurrentFX()`
*   **Description:** Returns the effect handle of the highest-priority bloom effect currently on the stack.
*   **Parameters:** None. Returns `nil` if the stack is empty.

### `GetCurrentFxAndPriority()`
*   **Description:** Returns the effect handle (`fx`) and priority of the highest-priority bloom effect currently on the stack.
*   **Parameters:** None. Returns `nil, nil` if the stack is empty.

### `PushBloom(source, fx, priority)`
*   **Description:** Adds a new bloom effect to the stack or updates an existing one from the same source. The stack is re-sorted by priority, and if the top effect changes, the entity's visual bloom effect is updated. The component will automatically listen for the `source` entity's removal to clean up the effect.
*   **Parameters:**
    *   `source`: The entity or object providing the bloom effect. Used as a unique identifier.
    *   `fx`: The string handle for the bloom effect asset.
    *   `priority`: (Optional) A number representing the effect's priority. Higher numbers take precedence. Defaults to `0`.

### `PopBloom(source)`
*   **Description:** Removes a bloom effect from the stack that matches the given source. If the removed effect was the active one, the component re-evaluates the stack and applies the next highest-priority effect, or clears the effect if the stack is now empty.
*   **Parameters:**
    *   `source`: The entity or object that originally provided the bloom effect to be removed.

### `GetDebugString()`
*   **Description:** Generates a formatted string that lists all current bloom effects on the stack, including their priority, source, and effect handle. Useful for debugging.
*   **Parameters:** None.

## Events & Listeners
*   `inst:ListenForEvent("onremove", callback, source)`: Listens for the `onremove` event on each unique `source` entity that pushes a bloom effect. When the source is removed, `PopBloom` is called to remove its effect from the stack.
*   `inst:ListenForEvent("onremove", callback, child)`: Listens for the `onremove` event on each attached child entity. When a child is removed, it is automatically unregistered from the `children` table.