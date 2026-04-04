---
id: bufferedaction
title: Bufferedaction
description: Represents a queued player action with target, position, and callback handling for the action system.
tags: [action, player, input]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 8caba818
system_scope: player
---

# Bufferedaction

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`BufferedAction` is a core class in the DST action system that encapsulates player verb interactions. It stores all necessary context for an action including the doer, target, inventory object, position, and success/failure callbacks. This class is used internally by the input and action systems to queue and execute player commands like attacking, picking up items, or building structures. It validates action conditions before execution and triggers appropriate callback chains on success or failure.

## Usage example
```lua
local action = BufferedAction(doer, target, ACTIONS.CHOP, nil, pos)
action:AddSuccessAction(function()
    print("Action completed successfully")
end)
action:AddFailAction(function()
    print("Action failed")
end)
local success, reason = action:Do()
```

## Dependencies & tags
**Components used:** `inventoryitem` (accessed via `target.components.inventoryitem`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `doer` | entity | `nil` | The entity performing the action (typically a player). |
| `target` | entity | `nil` | The target entity of the action. |
| `initialtargetowner` | entity | `nil` | Owner of the target if it is an inventory item. |
| `action` | table | `nil` | The action definition from `ACTIONS` table. |
| `invobject` | entity | `nil` | Inventory object being used for the action. |
| `doerownsobject` | boolean | `false` | Whether the doer owns the inventory object. |
| `pos` | DynamicPosition | `nil` | The world position where the action occurs. |
| `rotation` | number | `0` | Rotation value for the action. |
| `onsuccess` | table | `{}` | Table of callback functions on action success. |
| `onfail` | table | `{}` | Table of callback functions on action failure. |
| `recipe` | string | `nil` | Recipe identifier if this is a crafting action. |
| `options` | table | `{}` | Additional action options. |
| `distance` | number | `action.distance` | Required distance to perform the action. |
| `arrivedist` | number | `action.arrivedist` | Arrival distance threshold. |
| `forced` | boolean | `nil` | Whether the action is forced (bypasses some checks). |
| `autoequipped` | boolean | `nil` | True if the inventory object should be auto-equipped. |
| `skin` | string | `nil` | Skin identifier for the action. |

## Main functions
### `BufferedAction(doer, target, action, invobject, pos, recipe, distance, forced, rotation, arrivedist)`
*   **Description:** Constructor that initializes a new BufferedAction instance with all action context data.
*   **Parameters:** `doer` (entity) - the performer, `target` (entity) - the target, `action` (table) - action definition, `invobject` (entity) - inventory item, `pos` (Vector3) - position, `recipe` (string) - recipe ID, `distance` (number) - action distance, `forced` (boolean) - force flag, `rotation` (number) - rotation, `arrivedist` (number) - arrival distance.
*   **Returns:** New BufferedAction instance.

### `Do()`
*   **Description:** Executes the action by calling the action function and triggering success or failure callbacks.
*   **Parameters:** None.
*   **Returns:** `success` (boolean), `reason` (string or nil) - whether the action succeeded and optional failure reason.
*   **Error states:** Returns `false` immediately if `IsValid()` fails.

### `IsValid()`
*   **Description:** Validates all action conditions including entity validity, inventory ownership, position validity, and custom validation functions.
*   **Parameters:** None.
*   **Returns:** `boolean` - true if all action conditions are met.
*   **Error states:** Returns `false` if doer, target, invobject, or position are invalid, or if ownership checks fail.

### `TestForStart()`
*   **Description:** Alias for `IsValid()`. Used for compatibility with action system start checks.
*   **Parameters:** None.
*   **Returns:** `boolean` - same as `IsValid()`.

### `GetActionString()`
*   **Description:** Retrieves the localized action string for UI display, checking for doer overrides and action string override functions.
*   **Parameters:** None.
*   **Returns:** `string` (action display text), `overriden` (boolean) - whether a custom string was used.

### `AddSuccessAction(fn)`
*   **Description:** Adds a callback function to be executed when the action succeeds.
*   **Parameters:** `fn` (function) - callback to execute on success.
*   **Returns:** Nothing.

### `AddFailAction(fn)`
*   **Description:** Adds a callback function to be executed when the action fails.
*   **Parameters:** `fn` (function) - callback to execute on failure.
*   **Returns:** Nothing.

### `Succeed()`
*   **Description:** Executes all success callbacks and clears callback tables.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Fail()`
*   **Description:** Executes all failure callbacks and clears callback tables.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetActionPoint()`
*   **Description:** Returns the world position of the action as a Vector3.
*   **Parameters:** None.
*   **Returns:** `Vector3` or `nil` if no position is set.

### `GetDynamicActionPoint()`
*   **Description:** Returns the DynamicPosition object for the action.
*   **Parameters:** None.
*   **Returns:** `DynamicPosition` or `nil`.

### `SetActionPoint(pt)`
*   **Description:** Sets the action position, converting the input to a DynamicPosition.
*   **Parameters:** `pt` (Vector3 or table) - new position coordinates.
*   **Returns:** Nothing.

### `__tostring()`
*   **Description:** Returns a string representation of the action including action name, target, inventory object, and recipe info.
*   **Parameters:** None.
*   **Returns:** `string` - debug representation of the action.

## Events & listeners
None identified. This class uses internal callback tables (`onsuccess`, `onfail`) rather than the entity event system.