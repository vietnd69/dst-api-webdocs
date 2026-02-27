---
id: fencerotator
title: Fencerotator
description: Provides a method to rotate fence-like entities and spawns a visual effect upon rotation.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 2823941e
---

# Fencerotator

## Overview  
The `Fencerotator` component offers a `Rotate` method that adjusts the orientation of a target entity (typically a fence) by a specified delta angle, falls back to the default fence rotation tuning if no delta is provided, and triggers a visual effect and event upon completion.

## Dependencies & Tags  
- Uses `TUNING.FENCE_DEFAULT_ROTATION` for default rotation delta.
- Pushes the `"fencerotated"` event on the owner instance.
- Spawns the `"fence_rotator_fx"` prefab at the target's world position.

No explicit component dependencies (e.g., `AddComponent`) are declared in the source.

## Properties  
No public properties are initialized in the constructor or elsewhere; the component only stores a reference to the owner instance.

## Main Functions  
### `Rotate(target, delta)`
* **Description:** Rotates the `target` entity’s orientation by `delta` degrees (or the default fence rotation value if `delta` is omitted). If `target.SetOrientation` exists, it is used; otherwise, `target.Transform:SetRotation` is called. After rotation, it triggers the `"fencerotated"` event and spawns a visual effect at the target’s position.  
* **Parameters:**  
  - `target`: The entity to rotate. Must have a `Transform` component and optionally `SetOrientation` or rely on `Transform:SetRotation`. If `nil`, the function exits early.  
  - `delta` (optional, number): The angular change to apply, in degrees. Defaults to `TUNING.FENCE_DEFAULT_ROTATION` if omitted.

## Events & Listeners  
- Pushes event `"fencerotated"` on the owner instance (`self.inst`) after rotation completes.  
- Listens to no events (no `inst:ListenForEvent` calls present).