---
id: math2d
title: Math2D
description: A utility module providing optimized 2D geometric intersection and distance calculations for hitbox detection and collision queries.
tags: [physics, geometry, utility]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 725c44d8
system_scope: physics
---

# Math2D

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`math2d` is a pure utility module containing a collection of static, side-effect-free 2D geometry functions. It is used for hitbox detection and spatial queries where performance is critical—avoiding `sqrt`, `trig`, and division operations in favor of fast arithmetic. All functions operate on coordinate pairs or geometric primitives (points, lines, circles, triangles, axis-aligned rectangles) and return boolean or numeric values. This module has no ECS component semantics; it is a standalone collection of mathematical helpers, typically imported and used directly in other scripts (e.g., `local math2d = require("math2d")`).

## Usage example
```lua
local math2d = require("math2d")

-- Distance squared between two points (avoids expensive sqrt)
local dist_sq = math2d.DistSq(0, 0, 3, 4)  -- returns 25

-- Check if a point lies within a circle
local inside = math2d.IsPointInCircle(1, 1, 0, 0, 5)  -- returns true

-- Line intersection test
local intersects = math2d.LineIntersectsLine(0, 0, 1, 1, 0, 1, 1, 0)  -- returns true
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `DistSq(Ax, Ay, Bx, By)`
*   **Description:** Computes the squared Euclidean distance between two points A and B. Avoids costly `sqrt` operations for performance.
*   **Parameters:**  
    `Ax`, `Ay` (numbers) - Coordinates of point A.  
    `Bx`, `By` (numbers) - Coordinates of point B.  
*   **Returns:** Number - squared distance (`(Bx-Ax)^2 + (By-Ay)^2`).

### `DistSqPointToLine(Px, Py, Ax, Ay, Bx, By)`
*   **Description:** Computes the squared distance from point P to the *line segment* AB (not the infinite line). Handles endpoints via clamping.
*   **Parameters:**  
    `Px`, `Py` (numbers) - Coordinates of point P.  
    `Ax`, `Ay`, `Bx`, `By` (numbers) - Endpoints of line segment AB.  
*   **Returns:** Number - squared distance from P to segment AB.

### `IsPointOnLine(Px, Py, Ax, Ay, Bx, By)`
*   **Description:** Tests whether point P lies exactly on the line segment AB (including endpoints). Degenerate cases (A = B) are handled.
*   **Parameters:**  
    `Px`, `Py`, `Ax`, `Ay`, `Bx`, `By` (numbers) - As above.  
*   **Returns:** Boolean - `true` if P is collinear with AB and within the segment bounds.

### `IsPointInCircle(Px, Py, Cx, Cy, Cr)`
*   **Description:** Tests whether point P lies inside or on the boundary of the circle centered at C with radius Cr.
*   **Parameters:**  
    `Px`, `Py` (numbers) - Coordinates of point P.  
    `Cx`, `Cy` (numbers) - Circle center.  
    `Cr` (number) - Circle radius (non-negative).  
*   **Returns:** Boolean - `true` if point is inside or on the circle.

### `IsPointInTriangle(Px, Py, Ax, Ay, Bx, By, Cx, Cy)`
*   **Description:** Tests whether point P lies inside or on the boundary of triangle ABC. Handles degenerate (collinear) triangles by falling back to line segment containment.
*   **Parameters:**  
    `Px`, `Py` (numbers) - Point coordinates.  
    `Ax`, `Ay`, `Bx`, `By`, `Cx`, `Cy` (numbers) - Triangle vertex coordinates.  
*   **Returns:** Boolean - `true` if point is inside or on the triangle.

### `LineIntersectsLine(Ax, Ay, Bx, By, Cx, Cy, Dx, Dy)`
*   **Description:** Tests whether line segment AB intersects line segment CD (including endpoint touches and partial/full overlap).
*   **Parameters:**  
    Segment endpoints for AB and CD as numbers.  
*   **Returns:** Boolean - `true` if segments intersect (including at endpoints or overlapping).

### `LineIntersectsCircle(Ax, Ay, Bx, By, Cx, Cy, Cr)`
*   **Description:** Tests whether line segment AB intersects circle centered at C with radius Cr.
*   **Parameters:**  
    Segment endpoints `Ax,Ay,Bx,By`; circle center `Cx,Cy`; radius `Cr` (numbers).  
*   **Returns:** Boolean - `true` if segment and circle intersect.

### `LineIntersectsTriangle(Ax, Ay, Bx, By, Dx, Dy, Ex, Ey, Fx, Fy)`
*   **Description:** Tests whether line segment AB intersects triangle DEF. Handles degenerate triangles (collinear vertices) via fallback to `LineIntersectsLine`.
*   **Parameters:**  
    Segment endpoints `Ax,Ay,Bx,By`; triangle vertices `Dx,Dy,Ex,Ey,Fx,Fy` (numbers).  
*   **Returns:** Boolean - `true` if segment and triangle intersect.

### `CircleIntersectsCircle(Ax, Ay, Ar, Bx, By, Br)`
*   **Description:** Tests whether circle A (center `(Ax,Ay)`, radius `Ar`) intersects circle B (center `(Bx,By)`, radius `Br`). Includes tangency and containment cases.
*   **Parameters:**  
    Centers and radii for both circles as numbers.  
*   **Returns:** Boolean - `true` if circles intersect (including touching or one inside the other).

### `TriangleIntersectsCircle(Ax, Ay, Bx, By, Cx, Cy, Ex, Ey, Er)`
*   **Description:** Tests whether triangle ABC intersects circle centered at E with radius Er. Handles degenerate triangles.
*   **Parameters:**  
    Triangle vertices `Ax,Ay,Bx,By,Cx,Cy`; circle center `Ex,Ey`; radius `Er` (numbers).  
*   **Returns:** Boolean - `true` if triangle and circle intersect.

### `TriangleIntersectsTriangle(Ax, Ay, Bx, By, Cx, Cy, Ex, Ey, Fx, Fy, Gx, Gy)`
*   **Description:** Tests whether triangle ABC intersects triangle EFG. Handles degenerate triangles.
*   **Parameters:**  
    Triangle vertices for ABC and EFG as numbers.  
*   **Returns:** Boolean - `true` if triangles intersect.

### `RectIntersectsRect(Al, At, Ar, Ab, Bl, Bt, Br, Bb)`
*   **Description:** Tests whether two *axis-aligned rectangles* intersect. Parameters define rectangle edges: left/right (`Al`, `Ar`) and top/bottom (`At`, `Ab`) for each rect.
*   **Parameters:**  
    `Al`, `At`, `Ar`, `Ab`, `Bl`, `Bt`, `Br`, `Bb` (numbers) - Edge coordinates.  
*   **Returns:** Boolean - `true` if rectangles overlap (including edge contact).

## Events & listeners
Not applicable