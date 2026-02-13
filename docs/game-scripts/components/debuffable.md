---
id: debuffable
title: Debuffable
description: Manages a collection of temporary status effects (debuffs) applied to an entity, handling their lifecycle, persistence, and visual attachment.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Debuffable

## Overview
This component allows an entity to receive and manage various debuffs. It provides functionality to add, remove, and query active debuffs, handles their visual attachment to the host entity, and ensures their proper saving, loading, and transfer across entity instances. Each debuff is typically represented by a separate entity with a `debuff` component.

## Dependencies & Tags
*   **Tags:**
    *   `debuffable`: Added to the `inst` when the component is enabled, and removed when disabled.
*   **Other Components:**
    *   Relies on debuff entities having a `debuff` component (e.g., `v.inst.components.debuff`) for proper functionality, attachment, and detachment.

## Properties
| Property       | Type     | Default Value | Description                                                              |
| :------------- | :------- | :------------ | :----------------------------------------------------------------------- |
| `inst`         | `Entity` | `nil`         | A reference to the entity this component is attached to.                 |
| `enable`       | `boolean`| `true`        | Determines if the component is active and can receive new debuffs.       |
| `followsymbol` | `string` | `""`          | The symbol name on the host entity's `anim` component that debuffs should visually follow. |
| `followoffset` | `Vector3`| `Vector3(0,0,0)`| An offset from the `followsymbol` position for debuff visuals.           |
| `debuffs`      | `table`  | `{}`          | A table storing currently active debuffs, keyed by their unique name. Each entry contains `{inst = debuff_entity, onremove = callback}`. |
| `ondebuffadded`| `function`| `nil`        | An optional callback function (`function(inst, name, debuff_entity, data, buffer)`) invoked when a new debuff is successfully added. |
| `ondebuffremoved`| `function`| `nil`      | An optional callback function (`function(inst, name, debuff_entity)`) invoked when a debuff is removed. |

## Main Functions
### `Enable(enable)`
*   **Description:** Enables or disables the debuffable component. If disabled, all active debuffs are immediately removed.
*   **Parameters:**
    *   `enable`: (`boolean`) Set to `true` to enable, `false` to disable.

### `RemoveOnDespawn()`
*   **Description:** Iterates through all active debuffs and removes any that are not configured to `keepondespawn` (i.e., `v.inst.components.debuff.keepondespawn` is `false` or `nil`). This is typically called when the host entity is about to despawn.
*   **Parameters:** None.

### `SetFollowSymbol(symbol, x, y, z)`
*   **Description:** Sets the visual follow symbol and its offset for all currently active debuffs and any debuffs added in the future.
*   **Parameters:**
    *   `symbol`: (`string`) The name of the animation symbol on the host entity to follow.
    *   `x`: (`number`) The X-coordinate offset from the symbol's position.
    *   `y`: (`number`) The Y-coordinate offset from the symbol's position.
    *   `z`: (`number`) The Z-coordinate offset from the symbol's position.

### `AddDebuff(name, prefab, data, buffer)`
*   **Description:** Adds a debuff to the entity. If a debuff with the given `name` already exists, it will be extended (its duration reset/extended) rather than adding a new one. A new debuff entity will be spawned if one doesn't exist.
*   **Parameters:**
    *   `name`: (`string`) A unique identifier for this debuff instance.
    *   `prefab`: (`string`) The prefab name of the debuff entity to spawn. This entity must have a `debuff` component.
    *   `data`: (`table`, optional) A table of data to pass to the debuff component's `AttachTo` or `Extend` method.
    *   `buffer`: (`table`, optional) A buffer table to pass to the debuff component's `AttachTo` or `Extend` method.

### `RemoveDebuff(name)`
*   **Description:** Removes a specific debuff from the entity by its name. The debuff entity's `OnDetach` method will be called, and the entity will be removed if it doesn't have a `debuff` component, or if its `debuff` component does not handle its own removal.
*   **Parameters:**
    *   `name`: (`string`) The unique identifier of the debuff to remove.

### `OnSave()`
*   **Description:** Serializes the active debuffs into a savable format. This method is called by the game's persistence system.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Deserializes and re-applies debuffs from saved game data. This method is called by the game's persistence system.
*   **Parameters:**
    *   `data`: (`table`) The table containing saved debuff data.

### `TransferComponent(newinst)`
*   **Description:** Transfers all active debuffs from the current entity to a new entity. If the new entity doesn't have a `debuffable` component, one will be added.
*   **Parameters:**
    *   `newinst`: (`Entity`) The target entity to transfer debuffs to.

### `GetDebugString()`
*   **Description:** Generates a string containing debug information about the active debuffs, primarily their count and prefab names.
*   **Parameters:** None.

## Events & Listeners
*   **Listens For:**
    *   `"onremove"`: Listens on individual debuff entities. When a debuff entity is removed, this component's internal callback `debuffs[name].onremove` is triggered, which cleans up the debuff from its internal table.