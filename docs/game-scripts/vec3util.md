---
id: vec3util
title: Vec3Util
description: Provides utility functions for 3D vector mathematics, including arithmetic, distance, and normalization operations.
tags: [math, physics, utility]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 3be5949d
system_scope: physics
---

# Vec3Util

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Vec3Util` is a standalone Lua module that provides a collection of pure, stateless functions for performing common 3D vector operations. It operates entirely on raw numeric components (`x`, `y`, `z`) rather than encapsulated vector objects, making it lightweight and ideal for performance-sensitive or math-heavy calculations throughout the codebase. As a utility module, it has no dependency on the ECS, components, or entities — it is used procedurally by other scripts.

## Usage example
```lua
local x, y, z = Vec3Util_Normalize(3, 4, 0)
local dist = Vec3Util_Dist(0, 0, 0, 3, 4, 0)
local mid = { Vec3Util_Lerp(0, 0, 0, 10, 10, 10, 0.5) }
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `Vec3Util_Add(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z)`
* **Description:** Adds two 3D vectors component-wise.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the first vector.
  * `p2_x`, `p2_y`, `p2_z` (numbers) — coordinates of the second vector.
* **Returns:** `new_x`, `new_y`, `new_z` — the summed vector components.

### `Vec3Util_Sub(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z)`
* **Description:** Subtracts the second vector from the first, component-wise.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the minuend vector.
  * `p2_x`, `p2_y`, `p2_z` (numbers) — coordinates of the subtrahend vector.
* **Returns:** `new_x`, `new_y`, `new_z` — the difference vector components.

### `Vec3Util_Scale(p1_x, p1_y, p1_z, scale)`
* **Description:** Scales a vector by a scalar factor.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the vector.
  * `scale` (number) — scaling factor.
* **Returns:** `new_x`, `new_y`, `new_z` — the scaled vector components.

### `Vec3Util_LengthSq(p1_x, p1_y, p1_z)`
* **Description:** Computes the squared length (magnitude) of a vector.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the vector.
* **Returns:** `length_sq` (number) — the sum of squares of the components.
* **Use case:** Avoids `sqrt` overhead when comparing magnitudes.

### `Vec3Util_Length(p1_x, p1_y, p1_z)`
* **Description:** Computes the length (magnitude) of a vector.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the vector.
* **Returns:** `length` (number) — the Euclidean length.

### `Vec3Util_DistSq(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z)`
* **Description:** Computes the squared Euclidean distance between two points.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the first point.
  * `p2_x`, `p2_y`, `p2_z` (numbers) — coordinates of the second point.
* **Returns:** `dist_sq` (number) — the squared distance.
* **Use case:** More efficient than `Vec3Util_Dist` for comparisons.

### `Vec3Util_Dist(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z)`
* **Description:** Computes the Euclidean distance between two points.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the first point.
  * `p2_x`, `p2_y`, `p2_z` (numbers) — coordinates of the second point.
* **Returns:** `dist` (number) — the distance.

### `Vec3Util_Dot(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z)`
* **Description:** Computes the dot product of two vectors.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the first vector.
  * `p2_x`, `p2_y`, `p2_z` (numbers) — coordinates of the second vector.
* **Returns:** `dot` (number) — the scalar dot product.
* **Use case:** Determining angle between vectors (e.g., alignment, facing).

### `Vec3Util_Lerp(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z, percent)`
* **Description:** Linearly interpolates between two points.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the start point.
  * `p2_x`, `p2_y`, `p2_z` (numbers) — coordinates of the end point.
  * `percent` (number) — interpolation factor in the range `[0, 1]`.
* **Returns:** `x`, `y`, `z` — interpolated point coordinates.

### `Vec3Util_Normalize(p1_x, p1_y, p1_z)`
* **Description:** Returns a unit vector in the same direction as the input vector.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the input vector.
* **Returns:** `norm_x`, `norm_y`, `norm_z` — normalized vector components.
* **Error states:** Behavior is undefined (division by zero) if the input vector has zero length.

### `Vec3Util_NormalAndLength(p1_x, p1_y, p1_z)`
* **Description:** Simultaneously computes the normalized vector and its original length.
* **Parameters:**
  * `p1_x`, `p1_y`, `p1_z` (numbers) — coordinates of the input vector.
* **Returns:** `norm_x`, `norm_y`, `norm_z`, `length` — normalized components and the original magnitude.
* **Use case:** Efficiently retrieve both direction and magnitude in a single pass.

## Events & listeners
None identified