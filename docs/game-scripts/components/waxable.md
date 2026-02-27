---
id: waxable
title: Waxable
description: Enables an entity to be waxed or sprayed with wax items, handling wax application logic and dynamic tagging.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f13b60e6
---

# Waxable

## Overview
The `Waxable` component allows an entity to be waxed (or sprayed with wax), offering a customizable callback (`waxfn`) to define what happens when waxing occurs, and automatically manages the `"waxable"` and `"needswaxspray"` tags on the entity based on internal state and waxing conditions.

## Dependencies & Tags
- **Tags added/removed:** `"waxable"` (when waxable), `"needswaxspray"` (when wax spray is needed).
- **Component dependencies:** Relies on components present on the *waxing item* (`wax`, `finiteuses`, `stackable`), not directly added to the host entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the parent entity, assigned in the constructor. |
| `waxfn` | `function` | `nil` | Callback function responsible for executing waxing logic (signature: `fn(inst, doer, waxitem)` → `result: boolean, reason?: string`). |
| `needs_spray` | `boolean` | `false` | Indicates whether the entity currently requires wax spray. Controls the `"needswaxspray"` tag. |

*Note:* No explicit `_ctor` properties beyond `inst` and `needs_spray` are initialized — `waxfn` starts as `nil` and is set via `SetWaxfn()`.

## Main Functions
### `Waxable:SetWaxfn(fn)`
* **Description:** Sets the waxing callback function that defines how waxing behaves for this entity.
* **Parameters:**  
  - `fn (function)`: A function with signature `fn(inst, doer, waxitem) → result: boolean, reason?: string`.

### `Waxable:SetNeedsSpray(val)`
* **Description:** Updates whether the entity needs wax spray, adding or removing the `"needswaxspray"` tag accordingly.
* **Parameters:**  
  - `val (any)`: Truthy value sets `needs_spray = true`; otherwise `false`.

### `Waxable:NeedsSpray()`
* **Description:** Returns whether the entity is currently in a state that requires wax spray (i.e., `needs_spray` is true).
* **Parameters:** None.  
* **Returns:** `boolean`.

### `Waxable:Wax(doer, waxitem)`
* **Description:** Attempts to apply wax to the entity. Validates conditions (e.g., sprays only allowed if `needs_spray`), invokes the `waxfn` callback, and consumes the wax item upon success.
* **Parameters:**  
  - `doer (Entity)`: The entity performing the waxing (e.g., a player).  
  - `waxitem (Entity)`: The wax item used (must have `wax` component; if it's a spray, `needs_spray` is enforced).  
* **Returns:** `result (boolean)`, optionally `reason (string)`.  
* **Side effects:** Consumes `waxitem` on success (via `finiteuses:Use()`, `stackable:Get():Remove()`, or `waxitem:Remove()`). Fails if `needs_spray` is false but the item is a spray, or if `waxfn` returns false.

### `Waxable:OnRemoveFromEntity()`
* **Description:** Cleanup method called when this component is removed from the entity; ensures wax-related tags are removed.
* **Parameters:** None.

## Events & Listeners
None.