---
id: waxable
title: Waxable
description: Manages waxing interactions for an entity, including tag state and callback-based waxing logic.
tags: [wax, item, interaction, utility]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f13b60e6
system_scope: entity
---

# Waxable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Waxable` enables an entity to be processed by waxing (wax application) mechanics. It stores whether the entity *needs wax spray* and delegates the actual waxing behavior to a custom callback (`waxfn`). The component manages the `waxable` and `needswaxspray` tags automatically, and integrates with `finiteuses`, `stackable`, and `wax` components on the waxing item to consume it appropriately.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("waxable")

-- Register a custom waxing function
inst.components.waxable:SetWaxfn(function(inst, doer, waxitem)
    -- Apply wax logic here; return true on success
    inst:RemoveTag("wet")
    return true
end)

-- Mark that the entity needs wax spray (e.g., after being wet)
inst.components.waxable:SetNeedsSpray(true)

-- Attempt to wax the entity
local success = inst.components.waxable:Wax(player, wax_item)
```

## Dependencies & tags
**Components used:** `wax`, `finiteuses`, `stackable`  
**Tags:** Adds `waxable` (when `waxfn` is set), `needswaxspray` (when `needs_spray` is true); removes both on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this component belongs to. |
| `needs_spray` | boolean | `false` | Whether the entity currently needs wax spray. |
| `waxfn` | function | `nil` | Callback function defining how waxing is applied. Signature: `(inst, doer, waxitem) → (result: boolean, reason?: string)`. |

## Main functions
### `SetWaxfn(fn)`
* **Description:** Sets the callback function executed when `Wax` is called. If `nil`, the entity is not considered `waxable`.
* **Parameters:** `fn` (function?) — optional callback with signature `(inst, doer, waxitem) → (result: boolean, reason?: string)`.
* **Returns:** Nothing.

### `SetNeedsSpray(val)`
* **Description:** Sets whether the entity needs wax spray. Adds or removes the `needswaxspray` tag accordingly.
* **Parameters:** `val` (boolean) — whether spray is needed. Treats any non-`false` value as `true`.
* **Returns:** Nothing.

### `NeedsSpray()`
* **Description:** Returns whether the entity currently needs wax spray.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `needs_spray` is `true`, otherwise `false`.

### `Wax(doer, waxitem)`
* **Description:** Attempts to apply wax to the entity using the provided wax item. Calls the `waxfn` callback if present, and consumes the wax item on success.
* **Parameters:**  
  `doer` (Entity) — the entity performing the waxing action.  
  `waxitem` (Entity) — the item used to apply wax.
* **Returns:** `boolean, string?` — `true` and optionally a reason string on success; `false` (and optionally a reason) on failure. Fails if `waxfn` is `nil` or if `waxitem` is a spray but the entity does *not* need spray.
* **Error states:**  
  - Returns `false` immediately if `waxitem.components.wax` exists and `GetIsSpray()` returns `true`, but `NeedsSpray()` is `false`.  
  - Returns the result and optional reason from `waxfn` (which may be `false` and a reason string).  
  - Consumes `waxitem` *only* on success (`result == true`), via `finiteuses:Use()`, `stackable:Get():Remove()`, or direct `waxitem:Remove()` depending on available components.

### `OnRemoveFromEntity()`
* **Description:** Cleanup callback invoked when this component is removed from its entity. Removes `waxable` and `needswaxspray` tags.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.
