---
id: efficientuser
title: Efficientuser
description: Manages action efficiency multipliers for an entity, tracking modifiers per action type.
tags: [utility, actions, modifiers]
sidebar_position: 10
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: components
source_hash: 45236f2f
system_scope: entity
---

# Efficientuser

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`EfficientUser` manages efficiency multipliers for actions performed by an entity. It stores a collection of `SourceModifierList` instances keyed by action type, allowing multiple sources to modify the efficiency of a specific action (e.g., mining speed). This component is typically added to characters or tools to handle buff/debuff logic for action execution rates.

Notably, modifications applied to `ACTIONS.MINE` automatically propagate to `ACTIONS.REMOVELUNARBUILDUP`, ensuring consistent efficiency between mining and lunar cleanup tasks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("efficientuser")

-- Add a 50% efficiency bonus from a specific source
inst.components.efficientuser:AddMultiplier(ACTIONS.MINE, 1.5, "buff_source")

-- Retrieve the current multiplier (defaults to 1 if no modifiers)
local multiplier = inst.components.efficientuser:GetMultiplier(ACTIONS.MINE)

-- Remove the modifier when the buff expires
inst.components.efficientuser:RemoveMultiplier(ACTIONS.MINE, "buff_source")
```

## Dependencies & tags
**External dependencies:**
- `util/sourcemodifierlist` -- Used to create modifier lists for each action type (`SourceModifierList`).

**Components used:**
- None identified.

**Tags:**
- None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. |
| `actions` | table | `{}` | Maps action enums to `SourceModifierList` instances. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Lifecycle hook called when the component is removed from the entity. Iterates through all stored action modifiers and calls `Reset()` on each `SourceModifierList` to clean up state.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if any value in `self.actions` is not a valid `SourceModifierList` instance lacking a `Reset` method.

### `GetMultiplier(action)`
*   **Description:** Retrieves the current efficiency multiplier for the specified action. Returns `1` if no modifiers are registered for the action.
*   **Parameters:** `action` -- Action enum (e.g., `ACTIONS.MINE`).
*   **Returns:** number -- The calculated multiplier, or `1` if none exist.
*   **Error states:** None. Safely handles missing action keys via `and` check.

### `AddMultiplier(action, multiplier, source)`
*   **Description:** Adds a efficiency modifier for the specified action. Creates a new `SourceModifierList` for the action if one does not exist.
    *   **Side Effect:** If `action` is `ACTIONS.MINE`, this function recursively calls itself to apply the same multiplier to `ACTIONS.REMOVELUNARBUILDUP`.
*   **Parameters:**
    - `action` -- Action enum to modify.
    - `multiplier` -- number -- The efficiency multiplier value.
    - `source` -- string -- Identifier for the modifier source (used for removal).
*   **Returns:** nil
*   **Error states:** Errors if `self.inst` is nil when constructing `SourceModifierList` (no nil guard before `SourceModifierList(self.inst)` call).

### `RemoveMultiplier(action, source)`
*   **Description:** Removes a specific modifier source from the specified action. Does not delete the `SourceModifierList` instance if other modifiers remain.
    *   **Side Effect:** If `action` is `ACTIONS.MINE`, this function recursively calls itself to remove the modifier from `ACTIONS.REMOVELUNARBUILDUP`.
*   **Parameters:**
    - `action` -- Action enum to modify.
    - `source` -- string -- Identifier for the modifier source to remove.
*   **Returns:** nil
*   **Error states:** None

## Events & listeners
None identified.