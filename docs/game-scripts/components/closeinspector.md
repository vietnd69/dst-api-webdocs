---
id: closeinspector
title: Closeinspector
description: Adds a tag to an entity and provides hooks for custom inspect target and inspect point validation logic, typically used to restrict or customize inspector interactions.
tags: [inspector, validation, utility]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f218a4b6
system_scope: entity
---

# Closeinspector

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Closeinspector` is a utility component that attaches to an entity and ensures it carries the `closeinspector` tag. It enables optional custom validation logic for inspector-related actions (e.g., inspecting a specific target or inspecting a point in space) by allowing external code to register callbacks via `SetInspectTargetFn` and `SetInspectPointFn`. When removed from an entity, it automatically removes the tag. This component is typically used on prefabs where strict control over inspector behavior is needed.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("closeinspector")

inst.components.closeinspector:SetInspectTargetFn(function(owner, doer, target)
    if target:HasTag("monster") then
        return false, "Cannot inspect monsters."
    end
    return true
end)

inst.components.closeinspector:SetInspectPointFn(function(owner, doer, pt)
    if pt.y < 0 then
        return false, "Point below ground."
    end
    return true
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `closeinspector` in constructor; removes `closeinspector` on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inspecttargetfn` | function or `nil` | `nil` | Optional callback for validating inspect target actions. Signature: `(owner, doer, target) → (success: boolean, reason?: string)`. |
| `inspectpointfn` | function or `nil` | `nil` | Optional callback for validating inspect point actions. Signature: `(owner, doer, pt) → (success: boolean, reason?: string)`. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Automatically called when the component is removed from its entity. Removes the `closeinspector` tag to keep entity state consistent.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetInspectTargetFn(fn)`
* **Description:** Sets the callback function used to validate attempts to inspect a specific entity target.
* **Parameters:** `fn` (function or `nil`) – if non-`nil`, the function must accept `(owner, doer, target)` and return two values: a boolean `success` and optionally a string `reason` explaining failure.
* **Returns:** Nothing.

### `SetInspectPointFn(fn)`
* **Description:** Sets the callback function used to validate attempts to inspect a specific point in space.
* **Parameters:** `fn` (function or `nil`) – if non-`nil`, the function must accept `(owner, doer, pt)` and return two values: a boolean `success` and optionally a string `reason` explaining failure.
* **Returns:** Nothing.

### `CloseInspectTarget(doer, target)`
* **Description:** Invokes the inspect target callback (if set) and returns its result.
* **Parameters:** 
  * `doer` – the entity performing the inspect action.
  * `target` – the entity being inspected.
* **Returns:** The result of `inspecttargetfn(owner, doer, target)`, i.e., `(success: boolean, reason?: string)`. Returns `nil` if no callback is set.

### `CloseInspectPoint(doer, pt)`
* **Description:** Invokes the inspect point callback (if set) and returns its result.
* **Parameters:** 
  * `doer` – the entity performing the inspect action.
  * `pt` – the point (`Vector3` or similar) being inspected.
* **Returns:** The result of `inspectpointfn(owner, doer, pt)`, i.e., `(success: boolean, reason?: string)`. Returns `nil` if no callback is set.

## Events & listeners
Not applicable.
