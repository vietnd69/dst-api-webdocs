---
id: mathutil
title: Mathutil
description: Provides utility functions for mathematical operations, including interpolation, rounding, clamping, angle normalization, and grid-based line tracing.
tags: [math, utility, world]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 66b0bdef
system_scope: world
---

# Mathutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`mathutil` is a standalone Lua utility module providing reusable mathematical and geometric helper functions. It does not implement an Entity Component System component—its functions are globally accessible and operate on primitive types or simple table structures (e.g., coordinate points). Functions cover common operations like linear interpolation, range remapping, rounding (with bias control), angle reduction and difference, 2D/3D squared distance, and grid-aware line drawing (Bresenham-style) for the XZ plane.

## Usage example
```lua
local value = mathutil.Lerp(0, 10, 0.5) -- returns 5
local clamped = mathutil.Clamp(15, 0, 10) -- returns 10
local even = mathutil.IsNumberEven(4) -- returns true
local distance_sq = mathutil.DistXYSq({x=0,y=0}, {x=3,y=4}) -- returns 25
local points = mathutil.BresenhamLineXZtoXZ(0, 0, 2, 1) -- returns list of grid points
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `GetSineVal(mod, abs, inst)`
*   **Description:** Generates a sine wave value based on game time. Scales the frequency by `mod` and optionally returns the absolute value (full-wave rectified wave).
*   **Parameters:** 
    *   `mod` (number?) — frequency multiplier (period = 2 / mod). Defaults to `1` if omitted.
    *   `abs` (boolean?) — if truthy, returns `|sin|`; otherwise returns signed sine.
    *   `inst` (Entity?) — if provided, uses `inst:GetTimeAlive()` as time source; otherwise uses global `GetTime()`.
*   **Returns:** number — sine value (range `[-1, 1]` or `[0, 1]` if `abs` is true).
*   **Error states:** Returns `0` if `mod` is `0`, but no explicit error handling for invalid inputs.

### `Lerp(a, b, t)`
*   **Description:** Linearly interpolates from `a` to `b` by factor `t`.
*   **Parameters:** 
    *   `a` (number) — start value.
    *   `b` (number) — end value.
    *   `t` (number) — interpolation factor, typically in `[0, 1]`.
*   **Returns:** number — `a + (b - a) * t`.
*   **Error states:** No special handling; extrapolation occurs for `t` outside `[0, 1]`.

### `Remap(i, a, b, x, y)`
*   **Description:** Remaps input value `i` from source range `[a, b]` to target range `[x, y]`.
*   **Parameters:** 
    *   `i` (number) — value to remap.
    *   `a`, `b` (number) — source range bounds (`a ≠ b`).
    *   `x`, `y` (number) — target range bounds.
*   **Returns:** number — remapped value.
*   **Error states:** Returns `NaN` or `±∞` if `a == b`; caller should validate inputs.

### `RoundBiasedUp(num, idp)`
*   **Description:** Rounds `num` to `idp` decimal places; 0.5-values round *up* (toward positive infinity).
*   **Parameters:** 
    *   `num` (number) — value to round.
    *   `idp` (number?) — integer decimal places (defaults to `0`).
*   **Returns:** number — rounded value.
*   **Example:** `RoundBiasedUp(2.5, 0) → 3`, `RoundBiasedUp(-2.5, 0) → -2`.

### `RoundBiasedDown(num, idp)`
*   **Description:** Rounds `num` to `idp` decimal places; 0.5-values round *down* (toward negative infinity).
*   **Parameters:** 
    *   `num` (number) — value to round.
    *   `idp` (number?) — integer decimal places (defaults to `0`).
*   **Returns:** number — rounded value.
*   **Example:** `RoundBiasedDown(2.5, 0) → 2`, `RoundBiasedDown(-2.5, 0) → -3`.

### `RoundToNearest(numToRound, multiple)`
*   **Description:** Rounds `numToRound` to the nearest multiple of `multiple`.
*   **Parameters:** 
    *   `numToRound` (number) — value to round.
    *   `multiple` (number) — target multiple (must be nonzero).
*   **Returns:** number — nearest multiple of `multiple`.
*   **Example:** `RoundToNearest(7, 5) → 5`, `RoundToNearest(8, 5) → 10`.

### `math.clamp(num, min, max)`
### `Clamp(num, min, max)`
*   **Description:** Returns `num` constrained to the inclusive range `[min, max]`. Both functions are aliases.
*   **Parameters:** 
    *   `num`, `min`, `max` (number) — values.
*   **Returns:** number — clamped value.
*   **Error states:** Behavior is undefined if `min > max` (returns `min` or `max` inconsistently); caller should ensure `min ≤ max`.

### `IsNumberEven(num)`
*   **Description:** Determines if `num` is an even integer.
*   **Parameters:** 
    *   `num` (number) — value to test.
*   **Returns:** boolean — `true` if `num % 2 == 0`, else `false`.
*   **Error states:** Returns `true` for non-integer even numbers (e.g., `2.0`), but `false` for non-integers like `2.5`.

### `DistXYSq(p1, p2)`
*   **Description:** Computes the squared Euclidean distance between two 2D points (`p1.x`, `p1.y`) and (`p2.x`, `p2.y`).
*   **Parameters:** 
    *   `p1`, `p2` (`{x=number, y=number}`) — point tables.
*   **Returns:** number — squared distance.
*   **Use case:** Avoids costly square root when comparing distances.

### `DistXZSq(p1, p2)`
*   **Description:** Computes the squared Euclidean distance between two 3D points projected onto the XZ plane (ignores Y-axis).
*   **Parameters:** 
    *   `p1`, `p2` (`{x=number, y=number, z=number}`) — point tables.
*   **Returns:** number — squared XZ distance.
*   **Use case:** World-space horizontal distance in DST’s coordinate system.

### `math.range(start, stop, step)`
*   **Description:** Generates a table of numbers from `start` to `stop` in increments of `step`.
*   **Parameters:** 
    *   `start`, `stop` (number) — range bounds.
    *   `step` (number?) — increment (defaults to `1`).
*   **Returns:** `{number}` — list of numbers.
*   **Error states:** Infinite loop or empty table if `step` has wrong sign relative to `(stop - start)`.

### `math.diff(a, b)`
*   **Description:** Returns absolute difference between `a` and `b`.
*   **Parameters:** `a`, `b` (number).
*   **Returns:** number — `|a - b|`.
*   **Alias for:** `math.abs(a - b)`.

### `ReduceAngle(rot)`
*   **Description:** Normalizes rotation angle `rot` (in degrees) to the range `[-180, 180]`.
*   **Parameters:** `rot` (number) — angle in degrees.
*   **Returns:** number — normalized angle.

### `DiffAngle(rot1, rot2)`
*   **Description:** Returns the smallest unsigned angular difference (in degrees) between two rotations.
*   **Parameters:** `rot1`, `rot2` (number) — angles in degrees.
*   **Returns:** number — difference in `[0, 180]`.

### `ReduceAngleRad(rot)`
*   **Description:** Normalizes rotation angle `rot` (in radians) to the range `[-π, π]`.
*   **Parameters:** `rot` (number) — angle in radians.
*   **Returns:** number — normalized angle.

### `DiffAngleRad(rot1, rot2)`
*   **Description:** Returns the smallest unsigned angular difference (in radians) between two rotations.
*   **Parameters:** `rot1`, `rot2` (number) — angles in radians.
*   **Returns:** number — difference in `[0, π]`.

### `BresenhamLineXZtoXZ(x1, z1, x2, z2)`
*   **Description:** Computes a list of grid-aligned points tracing a line from `(x1, z1)` to `(x2, z2)` on the XZ plane. Uses a modified algorithm to include diagonal steps as 2x2 blocks (see comment).
*   **Parameters:** 
    *   `x1`, `z1`, `x2`, `z2` (number) — integer grid coordinates.
*   **Returns:** {`{x=number, z=number}`} — ordered list of grid points.
*   **Error states:** Does not enforce integer inputs; returns points with fractional coordinates if inputs are non-integers.

### `BresenhamLineXZtoXZExcludeCaps(x1, z1, x2, z2, excludestart, excludeend)`
*   **Description:** Calls `BresenhamLineXZtoXZ`, then optionally removes the first or last point.
*   **Parameters:** 
    *   `excludestart` (boolean) — if true, omits the starting point.
    *   `excludeend` (boolean) — if true, omits the ending point.
*   **Returns:** {`{x=number, z=number}`} — filtered list of points.

## Events & listeners
Not applicable