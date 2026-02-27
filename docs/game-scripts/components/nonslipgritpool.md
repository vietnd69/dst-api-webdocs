---
id: nonslipgritpool
title: Nonslipgritpool
description: Provides logic to determine whether a given point on the ground is covered by non-slip grit, used to prevent entities from sliding on icy surfaces.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 15364425
---

# Nonslipgritpool

## Overview
This component enables an entity (typically a铺有 grit 的区域, such as a grit-spreader or a custom area) to define which ground positions are "non-slippery" — i.e., safe from ice-related sliding. It offers a flexible way to specify grit coverage via a custom callback function or, if none is provided, defaults to checking if the point lies within the entity's physical radius.

## Dependencies & Tags
- Adds the `"nonslipgritpool"` tag to the entity in its constructor.
- Removes the `"nonslipgritpool"` tag when the component is removed from the entity.
- Relies on the `inst.Physics` component (used only if no custom callback is set) to query radius.
- Relies on the `inst.Transform` component to query world position.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isgritatfn` | `function?` | `nil` | Optional callback function `fn(inst, x, y, z) → boolean` that determines whether grit is present at a given world coordinate. If `nil`, falls back to circular radius-based check. |

## Main Functions
### `SetIsGritAtPoint(fn)`
* **Description:** Assigns a custom function used to determine if grit covers a specific point. This allows dynamic or irregular coverage logic (e.g., polygonal zones or procedural patterns).
* **Parameters:**  
  `fn` (`function?`) — A function taking `(inst, x, y, z)` and returning `true` if grit exists at that point, `false` otherwise. Set to `nil` to disable custom logic and fall back to radius-based detection.

### `IsGritAtPosition(x, y, z)`
* **Description:** Evaluates whether the grit pool covers the specified world position. Uses either the custom callback (if set) or a circular check based on the entity’s physics radius and position.
* **Parameters:**  
  `x`, `y`, `z` (`number`) — World-space coordinates to test.

## Events & Listeners
None.