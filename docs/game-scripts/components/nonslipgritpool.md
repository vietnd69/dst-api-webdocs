---
id: nonslipgritpool
title: Nonslipgritpool
description: Provides logic to determine whether a point on the ground is covered in non-slip grit, used to prevent entities from sliding on ice or slippery surfaces.
tags: [physics, environment, slippery]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 15364425
system_scope: physics
---

# Nonslipgritpool

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`NonSlipGritPool` is a component that enables an entity to act as a source of non-slip grit, typically used in icy or slippery environments to allow entities to walk without sliding. It is attached to entities (such as specific terrain features or placed objects) and provides a function to query whether a given world position is covered in grit. The component registers the `nonslipgritpool` tag on the owning entity and supports both custom grit-detection logic and a fallback radius-based check.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("nonslipgritpool")
-- Set a custom grit detection function (e.g., based on placement mesh)
inst.components.nonslipgritpool:SetIsGritAtPosition(function(entity, x, y, z)
    -- Custom logic here
    return false
end)
-- Or rely on default radius check if Physics component is present
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `nonslipgritpool`; removed on entity removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isgritatfn` | function or `nil` | `nil` | Optional callback used to determine if a point is grit-covered. Signature: `fn(entity, x, y, z) → boolean`. |

## Main functions
### `SetIsGritAtPoint(fn)`
*   **Description:** Sets a custom function to determine whether a point (`x`, `y`, `z`) is covered in non-slip grit. This overrides the default radius-based logic.
*   **Parameters:** `fn` (function or `nil`) – a function that takes `entity`, `x`, `y`, and `z` and returns `true` if grit is present at that point, or `nil` to disable custom logic.
*   **Returns:** Nothing.

### `IsGritAtPosition(x, y, z)`
*   **Description:** Checks whether the point (`x`, `y`, `z`) is covered in grit. Uses either the custom `isgritatfn` (if set) or a distance check against the entity’s physics radius.
*   **Parameters:**  
    `x` (number) – X coordinate of the point to check.  
    `y` (number) – Y coordinate of the point to check.  
    `z` (number) – Z coordinate of the point to check.  
*   **Returns:** `boolean` – `true` if the point is covered in grit, `false` otherwise.
*   **Error states:** Returns `false` if no custom function is defined *and* the owning entity lacks a `Physics` component.

## Events & listeners
None identified
