---
id: bufferedaction
title: BufferedAction
description: Stores and executes a deferred action between an entity (doer) and a target, with support for success/failure callbacks and validation.
tags: [action, inventory, network, validation]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 8caba818
system_scope: entity
---

# BufferedAction

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`BufferedAction` is a lightweight, stateful wrapper for deferred actions in the Entity Component System. It captures all necessary context—doer, target, action function, optional inventory item, position, recipe, and validation flags—to safely queue and later execute game actions. This ensures consistency across networked environments by validating the action before execution and preserving ownership/inventory state at creation time. It is commonly used in input handling, AI behavior, and remote action dispatch where immediate execution is undesirable or unsafe.

## Usage example
```lua
local inst = CreateEntity()
local doer = some_player
local target = some_actor
local action = GetAction("attack")
local invobject = doer.components.inventory:GetActiveItem()

local buffered = BufferedAction(doer, target, action, invobject)
buffered:AddSuccessAction(function() print("Attack successful!") end)
buffered:AddFailAction(function() print("Attack failed.") end)

if buffered:IsValid() then
    buffered:Do()
end
```

## Dependencies & tags
**Components used:** `inventoryitem` (to capture and verify target ownership)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `doer` | `Entity` or `nil` | `doer` | The entity performing the action. |
| `target` | `Entity` or `nil` | `target` | The entity being acted upon. |
| `action` | `table` | `action` | The action definition, containing `fn`, `id`, `distance`, `validfn`, etc. |
| `invobject` | `Entity` or `nil` | `invobject` | Inventory item used in the action (if any). |
| `pos` | `DynamicPosition` or `nil` | `DynamicPosition(pos)` | Positional target for actions without a specific target entity. |
| `rotation` | number | `0` | Facing rotation associated with the action. |
| `recipe` | `string` or `nil` | `recipe` | Optional crafting recipe name. |
| `distance` | number | `action.distance` | Max distance allowed to perform the action. |
| `arrivedist` | number | `action.arrivedist` | Distance at which the doer is considered to have arrived. |
| `forced` | boolean or `nil` | `forced` | Whether the action should be executed even against default restrictions. |
| `doerownsobject` | boolean | Computed | True if `doer` currently holds `invobject`. |
| `initialtargetowner` | `Entity` or `nil` | Computed | Owner of `target` at creation time (for inventory item validation). |
| `autoequipped` | boolean or `nil` | `nil` | If set, indicates `invobject` was auto-equipped (used for validation). |
| `onsuccess` | array of functions | `{}` | Callbacks invoked on successful action. |
| `onfail` | array of functions | `{}` | Callbacks invoked on failed action. |

## Main functions
### `Do()`
*   **Description:** Executes the buffered action if valid. Handles item usage, callback dispatch, and result reporting.
*   **Parameters:** None.
*   **Returns:** `success` (boolean), `reason` (any) — Indicates whether the action succeeded; `reason` provides failure details.
*   **Error states:** Returns `false, reason` immediately if `IsValid()` is `false`. Fails safely if `invobject` is invalid.

### `IsValid()`
*   **Description:** Verifies all context is still valid for the action (e.g., entities still exist, target ownership unchanged, item ownership intact). This includes checks for network safety (`TheWorld.ismastersim`) and custom validation functions.
*   **Parameters:** None.
*   **Returns:** `true` if the action can be executed safely, `false` otherwise.
*   **Error states:** Returns `false` if any entity involved has been destroyed or ownership has changed (for target inventory items or held objects).

### `TestForStart()`
*   **Description:** Alias of `IsValid`. Historical remnant of older code; kept for compatibility.
*   **Parameters:** None.
*   **Returns:** Same as `IsValid`.

### `GetActionString()`
*   **Description:** Retrieves the localized action label (e.g., "Attack", "Gather") to display in UI or logs.
*   **Parameters:** None.
*   **Returns:** `str` (string), `overriden` (boolean) — Human-readable action string and whether it was custom-override.
*   **Error states:** Falls back to `GetActionString(action.id, ...)` if no override exists.

### `AddFailAction(fn)`
*   **Description:** Appends a callback to be invoked if the action fails.
*   **Parameters:** `fn` (function) — A no-argument function to run on failure.
*   **Returns:** Nothing.

### `AddSuccessAction(fn)`
*   **Description:** Appends a callback to be invoked if the action succeeds.
*   **Parameters:** `fn` (function) — A no-argument function to run on success.
*   **Returns:** Nothing.

### `Succeed()`
*   **Description:** Executes all success callbacks and clears the callback lists.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Fail()`
*   **Description:** Executes all failure callbacks and clears the callback lists.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetActionPoint()`
*   **Description:** Returns the 3D positional target for the action (e.g., for placement or aiming).
*   **Parameters:** None.
*   **Returns:** `Vector3` or `nil`.

### `GetDynamicActionPoint()`
*   **Description:** Returns the `DynamicPosition` wrapper for the action point.
*   **Parameters:** None.
*   **Returns:** `DynamicPosition` or `nil`.

### `SetActionPoint(pt)`
*   **Description:** Updates the action point to a new position.
*   **Parameters:** `pt` (`Vector3` or `table`) — New position to set.
*   **Returns:** Nothing.

### `__tostring()`
*   **Description:** Provides a human-readable string representation for debugging.
*   **Parameters:** None.
*   **Returns:** `string` — Formatted as `<action_label> <target> With Inv: <item> Recipe: <recipe>`.

## Events & listeners
*   **Listens to:** None.
*   **Pushes:** None.