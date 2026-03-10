---
id: vector3
title: Vector3
description: A lightweight 3D vector math utility for geometric calculations, distance, normalization, and vector operations in DST.
tags: [physics, math, utility]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 75618488
system_scope: physics
---

# Vector3

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Vector3` is a core mathematical utility class for representing and operating on 3D vectors. It provides operator overloading (`+`, `-`, `*`, `/`, unary `-`, `==`), standard vector operations (`Dot`, `Cross`, `Normalize`, `Dist`, etc.), and helper functions for constructing vectors from angles or tables. It is not an ECS component but a standalone Lua class used across the codebase for geometric computations (e.g., position deltas, direction vectors, movement logic). The alias `Point` is provided for semantic clarity when representing points in space.

## Usage example
```lua
local v1 = Vector3(1, 2, 3)
local v2 = Vector3(4, 5, 6)

local sum = v1 + v2
local diff = v2 - v1
local scaled = v1 * 2
local dot = v1:Dot(v2)
local dist = v1:Dist(v2)

local normalized = v1:GetNormalized()
local point = Vector3FromTheta(math.pi / 2, 10)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties (only instance variables `x`, `y`, `z` set in constructor; no accessors or public table fields documented for external use).

## Main functions
### `Vector3(x, y, z)`
* **Description:** Constructor. Creates a new `Vector3` instance. All arguments default to `0` if `nil`.
* **Parameters:**  
  `x` (number?) — X-coordinate.  
  `y` (number?) — Y-coordinate.  
  `z` (number?) — Z-coordinate.
* **Returns:** A new `Vector3` instance.

### `:__add(rhs)`
* **Description:** Adds two vectors component-wise.
* **Parameters:** `rhs` (Vector3) — Right-hand side vector.
* **Returns:** `Vector3` — Sum of the two vectors.

### `:__sub(rhs)`
* **Description:** Subtracts `rhs` from `self` component-wise.
* **Parameters:** `rhs` (Vector3) — Vector to subtract.
* **Returns:** `Vector3` — Difference vector.

### `:__mul(rhs)`
* **Description:** Scales the vector by a scalar value.
* **Parameters:** `rhs` (number) — Scalar multiplier.
* **Returns:** `Vector3` — Scaled vector.

### `:__div(rhs)`
* **Description:** Divides the vector by a scalar.
* **Parameters:** `rhs` (number) — Scalar divisor.
* **Returns:** `Vector3` — Scaled-down vector.
* **Error states:** May produce `inf` or `nan` if `rhs` is `0`; not guarded internally.

### `:__unm()`
* **Description:** Unary minus (negates all components).
* **Parameters:** None.
* **Returns:** `Vector3` — Negated vector.

### `:Dot(rhs)`
* **Description:** Computes the dot product of two vectors.
* **Parameters:** `rhs` (Vector3) — Right-hand side vector.
* **Returns:** `number` — Dot product value.

### `:Cross(rhs)`
* **Description:** Computes the cross product of two vectors.
* **Parameters:** `rhs` (Vector3) — Right-hand side vector.
* **Returns:** `Vector3` — Perpendicular vector to the plane spanned by `self` and `rhs`.

### `:Dist(other)`
* **Description:** Computes the Euclidean distance between `self` and `other`.
* **Parameters:** `other` (Vector3) — Target point/vector.
* **Returns:** `number` — Distance (non-negative).

### `:DistSq(other)`
* **Description:** Computes the squared Euclidean distance (avoids `sqrt` for performance).
* **Parameters:** `other` (Vector3) — Target point/vector.
* **Returns:** `number` — Squared distance.

### `:Length()`
* **Description:** Computes the magnitude (length) of the vector.
* **Parameters:** None.
* **Returns:** `number` — Non-negative length.

### `:LengthSq()`
* **Description:** Computes the squared length (avoids `sqrt` for performance).
* **Parameters:** None.
* **Returns:** `number` — Squared length.

### `:Normalize()`
* **Description:** Normalizes the vector in-place to unit length.
* **Parameters:** None.
* **Returns:** `self` — Modified vector (unit length if original length > 0); otherwise, unchanged.
* **Error states:** No-op (returns unmodified) if `Length()` is `0` to avoid division by zero.

### `:GetNormalized()`
* **Description:** Returns a new normalized copy of the vector.
* **Parameters:** None.
* **Returns:** `Vector3` — Unit vector in the same direction.
* **Error states:** May produce `inf`/`nan` if `Length()` is `0`; no guard is applied.

### `:GetNormalizedAndLength()`
* **Description:** Efficiently returns both the normalized vector and its original length in one pass.
* **Parameters:** None.
* **Returns:**  
  - First return: `Vector3` — Normalized vector (or `self` if length is `0`).  
  - Second return: `number` — Original length.

### `:Get()`
* **Description:** Returns the raw `x`, `y`, `z` components.
* **Parameters:** None.
* **Returns:** `number, number, number` — The three coordinates.

### `:IsVector3()`
* **Description:** Type check to identify `Vector3` instances.
* **Parameters:** None.
* **Returns:** `true` — Always returns `true`.

### `ToVector3(obj, y, z)`
* **Description:** Coerces various inputs into a `Vector3`. Handles `nil`, existing `Vector3`s, tables, or three separate numbers.
* **Parameters:**  
  `obj` (any?) — If table or `IsVector3`, used to construct vector; otherwise treated as `x`.  
  `y` (number?) — Y-coordinate (if `obj` is not a table or vector).  
  `z` (number?) — Z-coordinate (if `obj` is not a table or vector).  
* **Returns:** `Vector3?` — A new `Vector3` or `nil` if `obj` is `nil` or `tonumber` fails.
* **Error states:** Returns `nil` if `obj` is `nil` or `tonumber` results are `nil`.

### `Vector3FromTheta(theta, radius)`
* **Description:** Creates a 2D horizontal vector (y=0) from a polar angle (`theta`) and radius in the XZ plane. Positive `theta` rotates clockwise around the Y-axis (Z negative for forward).
* **Parameters:**  
  `theta` (number) — Angle in radians.  
  `radius` (number?) — Magnitude; defaults to `1`.  
* **Returns:** `Vector3` — `(radius * cos(theta), 0, -radius * sin(theta))`.

## Events & listeners
Not applicable.