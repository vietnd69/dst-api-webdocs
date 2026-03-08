---
id: hitbox
title: Hitbox
description: Defines a configurable hitbox representation using circles and triangles, supporting world-space transformations and collision tests against points, lines, circles, triangles, and other hitboxes.
tags: [physics, collision, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: util
source_hash: 5df6fc57
system_scope: physics
---

# Hitbox

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`HitBox` is a utility component that models an entity's physical hit area using a combination of circles and triangles defined in local space. It provides methods to transform these shapes into world space (respecting position and rotation), perform collision detection against various geometric primitives, and optionally render them for debugging. It does not manage its own lifecycle as a component, but is typically instantiated and used directly within other scripts or components.

## Usage example
```lua
local hitbox = HitBox(inst)
hitbox:AddCircle(0, 0, 1)
hitbox:AddTriangle(-1, -1, 1, -1, 0, 1)
hitbox:SetWorldTransformFromEntity(inst)
if hitbox:CollidesWithCircle(target_x, target_z, 0.5) then
    -- Handle collision
end
```

## Dependencies & tags
**Components used:** None (self-contained utility; may optionally interact with `DebugRender` if present on `owner`).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bounds_r` | number | `-1` | Maximum radius (distance from origin) of any contained shape; used for early-out AABB culling. |
| `tris` | table | `nil` | Array of triangle definitions (`{x1, z1, x2, z2, x3, z3}`). |
| `circs` | table | `nil` | Array of circle definitions (`{x, z, r}`). |
| `x`, `z` | number | `0` | World-space position of the hitbox origin. |
| `rot` | number | `0` | World-space rotation (in degrees) of the hitbox. |
| `cos_theta`, `sin_theta` | number or `nil` | `nil` | Cached sine and cosine of rotation (lazy-initialized). |
| `cached` | table | `nil` | Cache mapping local shapes to pre-transformed world-space versions. |
| `colour` | RGB(A) table | `{255, 127, 0}` | RGBA color used for debug rendering. |
| `owner` | entity or `nil` | `nil` | Entity whose transform the hitbox should use. |

## Main functions
### `AddTriangle(x1, z1, x2, z2, x3, z3)`
*   **Description:** Adds a triangle to the hitbox using local coordinates. Updates `bounds_r` to include the new triangle.
*   **Parameters:**
    *   `x1`, `z1`, `x2`, `z2`, `x3`, `z3` (numbers) — Local-space coordinates of the three triangle vertices.
*   **Returns:** Nothing.

### `AddCircle(x, z, r)`
*   **Description:** Adds a circle to the hitbox using local coordinates. Updates `bounds_r` to include the new circle.
*   **Parameters:**
    *   `x`, `z` (numbers) — Local-space center coordinates of the circle.
    *   `r` (number) — Radius of the circle.
*   **Returns:** Nothing.

### `Reset()`
*   **Description:** Clears all triangles and circles, resets `bounds_r` and the internal cache.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetWorldXZ(x, z)`
*   **Description:** Updates the hitbox's world-space position. Clears the transformation cache.
*   **Parameters:**
    *   `x`, `z` (numbers) — New world-space X and Z coordinates.
*   **Returns:** Nothing.

### `SetWorldRot(rot)`
*   **Description:** Updates the hitbox's world-space rotation (in degrees). Clears the cached sine/cosine and transformation cache.
*   **Parameters:**
    *   `rot` (number) — New rotation in degrees.
*   **Returns:** Nothing.

### `SetWorldTransformFromEntity(ent)`
*   **Description:** Synchronizes the hitbox's position and rotation with the given entity's transform.
*   **Parameters:**
    *   `ent` (entity) — Entity with a `Transform` component.
*   **Returns:** Nothing.

### `LocalToWorldXZ(x, z)`
*   **Description:** Converts local-space coordinates to world-space coordinates, applying the hitbox's current position and rotation.
*   **Parameters:**
    *   `x`, `z` (numbers) — Local-space coordinates.
*   **Returns:**
    *   `wx` (number) — World-space X coordinate.
    *   `wz` (number) — World-space Z coordinate.

### `CollidesWithTestFns(circ_test_fn, tri_test_fn)`
*   **Description:** Core collision dispatcher. Applies the provided per-shape test functions against all circles and triangles, transformed to world space. Returns `true` on first collision.
*   **Parameters:**
    *   `circ_test_fn` (function) — Function expecting `(x, z, r)` that returns `true`/`false`.
    *   `tri_test_fn` (function) — Function expecting `(x1, z1, x2, z2, x3, z3)` that returns `true`/`false`.
*   **Returns:** `true` if any shape collides, otherwise `false`.
*   **Error states:** Returns `false` if `bounds_r < 0` (no shapes defined).

### `CollidesWithPoint(x, z)`
*   **Description:** Tests for collision against a point using `math2d`.
*   **Parameters:**
    *   `x`, `z` (numbers) — World-space point coordinates.
*   **Returns:** `true` if the point lies within any circle or triangle of the hitbox, otherwise `false`.

### `CollidesWithLine(x1, z1, x2, z2)`
*   **Description:** Tests for collision between a line segment and the hitbox.
*   **Parameters:**
    *   `x1`, `z1`, `x2`, `z2` (numbers) — World-space endpoints of the line segment.
*   **Returns:** `true` if the line intersects any circle or triangle, otherwise `false`.

### `CollidesWithCircle(x, z, r)`
*   **Description:** Tests for collision with another circle.
*   **Parameters:**
    *   `x`, `z` (numbers) — Center coordinates of the test circle.
    *   `r` (number) — Radius of the test circle.
*   **Returns:** `true` if any hitbox circle or triangle intersects the test circle, otherwise `false`.

### `CollidesWithTriangle(x1, z1, x2, z2, x3, z3)`
*   **Description:** Tests for collision with another triangle.
*   **Parameters:**
    *   `x1`, `z1`, `x2`, `z2`, `x3`, `z3` (numbers) — World-space vertices of the test triangle.
*   **Returns:** `true` if any hitbox circle or triangle intersects the test triangle, otherwise `false`.

### `CollidesWithHitBox(other)`
*   **Description:** Tests for collision with another `HitBox` instance.
*   **Parameters:**
    *   `other` (HitBox) — Another hitbox instance.
*   **Returns:** `true` if any shape from either hitbox intersects any shape from the other, otherwise `false`.
*   **Error states:** Returns `false` if either hitbox has no shapes (`bounds_r < 0`).

### `SetColour(r, g, b, a)`
*   **Description:** Sets the RGBA color used for debug rendering.
*   **Parameters:**
    *   `r`, `g`, `b` (numbers 0–255) — RGB components.
    *   `a` (number 0–1, optional) — Alpha (opacity). Defaults to `1`.
*   **Returns:** Nothing.

### `DebugDraw()`
*   **Description:** Renders the hitbox's circles and triangles in world space using the entity's `DebugRender` system.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `owner` is `nil` or `bounds_r < 0`.

## Events & listeners
None.