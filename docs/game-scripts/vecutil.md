---
id: vecutil
title: Vecutil
description: Provides utility functions for 2D vector mathematics used throughout the game codebase.
tags: [math, utility, vectors]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 8b2e29f2
system_scope: physics
---

# Vecutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Vecutil` is a collection of standalone utility functions for 2D vector operations. It supports common mathematical operations such as addition, subtraction, scaling, normalization, distance calculation, dot product, linear interpolation (lerp), spherical linear interpolation (slerp), and rotation. These functions operate purely on numeric coordinates (x, z) and do not depend on any ECS components or entities — they are designed for general-purpose use across the codebase.

## Usage example
```lua
local x1, z1 = 1, 2
local x2, z2 = 4, 6

local dist = VecUtil_Dist(x1, z1, x2, z2)
local len_sq = VecUtil_LengthSq(x2 - x1, z2 - z1)
local normalized_x, normalized_z = VecUtil_NormalizeNoNaN(x2 - x1, z2 - z1)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `VecUtil_Add(p1_x, p1_z, p2_x, p2_z)`
* **Description:** Adds two 2D vectors component-wise.
* **Parameters:**  
  - `p1_x`, `p1_z` (numbers) — first vector components.  
  - `p2_x`, `p2_z` (numbers) — second vector components.  
* **Returns:** `p1_x + p2_x`, `p1_z + p2_z`.

### `VecUtil_Sub(p1_x, p1_z, p2_x, p2_z)`
* **Description:** Subtracts the second vector from the first.
* **Parameters:** Same as `VecUtil_Add`.
* **Returns:** `p1_x - p2_x`, `p1_z - p2_z`.

### `VecUtil_Scale(p1_x, p1_z, scale)`
* **Description:** Scales a vector by a scalar factor.
* **Parameters:**  
  - `p1_x`, `p1_z` (numbers) — vector components.  
  - `scale` (number) — scalar multiplier.  
* **Returns:** `p1_x * scale`, `p1_z * scale`.

### `VecUtil_LengthSq(p1_x, p1_z)`
* **Description:** Computes the squared length (magnitude) of a vector.
* **Parameters:** `p1_x`, `p1_z` (numbers) — vector components.  
* **Returns:** `p1_x^2 + p1_z^2` (number).  
* **Use case:** Preferred over `VecUtil_Length` when only relative comparisons are needed (avoids expensive square root).

### `VecUtil_Length(p1_x, p1_z)`
* **Description:** Computes the length (magnitude) of a vector.
* **Parameters:** Same as `VecUtil_LengthSq`.
* **Returns:** `sqrt(p1_x^2 + p1_z^2)` (number).

### `VecUtil_DistSq(p1_x, p1_z, p2_x, p2_z)`
* **Description:** Computes the squared Euclidean distance between two points.
* **Parameters:** Coordinates of two points.
* **Returns:** Squared distance (number).  
* **Use case:** Efficient distance comparisons without square root.

### `VecUtil_Dist(p1_x, p1_z, p2_x, p2_z)`
* **Description:** Computes the Euclidean distance between two points.
* **Parameters:** Same as `VecUtil_DistSq`.
* **Returns:** `sqrt((p1_x - p2_x)^2 + (p1_z - p2_z)^2)` (number).

### `VecUtil_Dot(p1_x, p1_z, p2_x, p2_z)`
* **Description:** Computes the dot product of two vectors.
* **Parameters:** Vector components.
* **Returns:** `p1_x * p2_x + p1_z * p2_z` (number).  
* **Use case:** Determines relative direction (e.g., whether vectors point toward or away from each other).

### `VecUtil_Lerp(p1_x, p1_z, p2_x, p2_z, percent)`
* **Description:** Linearly interpolates between two points.
* **Parameters:**  
  - `p1_x`, `p1_z`, `p2_x`, `p2_z` (numbers) — start and end points.  
  - `percent` (number, typically `0` to `1`) — interpolation factor.  
* **Returns:** Interpolated point coordinates.

### `VecUtil_NormalizeNoNaN(p1_x, p1_z)`
* **Description:** Normalizes a vector to unit length, returning `(0,0)` if the input vector is zero to avoid NaN.
* **Parameters:** Vector components.
* **Returns:** Normalized `(x, z)` or `(0,0)` if input length is zero.  
* **Error states:** Returns `(0,0)` to prevent division by zero; no `nil` return.

### `VecUtil_Normalize(p1_x, p1_z)`
* **Description:** Normalizes a vector to unit length.
* **Parameters:** Vector components.
* **Returns:** Normalized `(x, z)`.  
* **Error states:** If the input vector is `(0,0)`, this will return `NaN` — use `VecUtil_NormalizeNoNaN` instead for safety.

### `VecUtil_NormalAndLength(p1_x, p1_z)`
* **Description:** Returns both the normalized vector and its original length in one pass.
* **Parameters:** Vector components.
* **Returns:** `normalized_x`, `normalized_z`, `length`.  
* **Use case:** Avoids recomputing the length when both normalized direction and magnitude are needed.

### `VecUtil_GetAngleInDegrees(p1_x, p1_z)`
* **Description:** Returns the angle (in degrees) of a vector relative to the positive x-axis.
* **Parameters:** Vector components.
* **Returns:** Angle in degrees `[0, 360)`.  
* **Note:** Uses `math.atan2` and `RADIANS` conversion.

### `VecUtil_GetAngleInRads(p1_x, p1_z)`
* **Description:** Returns the angle (in radians) of a vector relative to the positive x-axis.
* **Parameters:** Vector components.
* **Returns:** Angle in radians `[0, 2π)`.  
* **Note:** Normalizes negative angles to `[0, 2π)` using `PI`.

### `VecUtil_Slerp(p1_x, p1_z, p2_x, p2_z, percent)`
* **Description:** Spherically interpolates between two unit vectors (assumed normalized).
* **Parameters:**  
  - `p1_x`, `p1_z`, `p2_x`, `p2_z` (numbers) — unit vectors.  
  - `percent` (number, typically `0` to `1`) — interpolation factor.  
* **Returns:** Interpolated unit vector `(x, z)`.  
* **Note:** Handles wraparound at angle boundaries (e.g., near `0`/`2π`).

### `VecUtil_RotateAroundPoint(a_x, a_z, b_x, b_z, theta)`
* **Description:** Rotates point `b` around point `a` by angle `theta`.
* **Parameters:**  
  - `a_x`, `a_z` — center of rotation.  
  - `b_x`, `b_z` — point to rotate.  
  - `theta` (number) — rotation angle in radians.  
* **Returns:** Rotated coordinates `(x, z)`.

### `VecUtil_RotateDir(dir_x, dir_z, theta)`
* **Description:** Rotates a direction vector by angle `theta`.
* **Parameters:**  
  - `dir_x`, `dir_z` — direction vector.  
  - `theta` (number) — rotation angle in radians.  
* **Returns:** Rotated direction vector `(x, z)`.

## Events & listeners
None identified.  
`Vecutil` is a pure math utility module with no event interaction.