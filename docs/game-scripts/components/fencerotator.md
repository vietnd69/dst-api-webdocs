---
id: fencerotator
title: Fencerotator
description: Rotates a target entity's orientation and spawns a visual effect upon completion.
tags: [rotation, fx, world, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2823941e
system_scope: world
---

# Fencerotator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fencerotator` is a lightweight component that rotates a given target entity by a specified angular delta. It is typically used in scenarios where fence-like structures need to be reoriented dynamically. The component does not maintain internal state beyond the instance reference and delegates the actual rotation logic using either `SetOrientation` (if available) or `Transform:SetRotation`. After rotation, it fires the `fencerotated` event and spawns a localized particle effect (`fence_rotator_fx`) at the target's position for visual feedback.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fencerotator")

-- Rotate the target entity by the default fence angle
local target = TheWorld.entities["fence_01"]
inst.components.fencerotator:Rotate(target)

-- Rotate by a custom angle
inst.components.fencerotator:Rotate(target, math.rad(45))
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  

## Properties
No public properties

## Main functions
### `Rotate(target, delta)`
*   **Description:** Rotates the provided `target` entity's orientation by `delta` radians (or a default value from `TUNING.FENCE_DEFAULT_ROTATION`). Then pushes the `fencerotated` event and spawns a rotation effect prefab.
*   **Parameters:**  
    * `target` (entity instance or `nil`) – The entity to rotate. If `nil`, the function returns early.  
    * `delta` (number, optional) – The angular increment to apply, in radians. Defaults to `TUNING.FENCE_DEFAULT_ROTATION` if omitted.
*   **Returns:** Nothing.
*   **Error states:** Returns immediately if `target` is `nil`. No error is thrown otherwise.

## Events & listeners
- **Listens to:** None  
- **Pushes:** `fencerotated` – Fired after successful rotation of the target entity.  
  Data: None.
