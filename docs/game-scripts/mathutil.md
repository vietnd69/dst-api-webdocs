---
id: mathutil
title: Mathutil
description: A collection of mathematical utility functions for calculations including interpolation, rounding, angle normalization, distance computation, and line generation.
tags: [utility, math, helper]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: root
source_hash: 38f4e101
system_scope: world
---

# Mathutil

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`mathutil.lua` provides a set of standalone mathematical helper functions used throughout the game codebase. This module extends the global `math` table with additional utilities and defines global functions for common operations like linear interpolation, value remapping, rounding, angle normalization, squared distance calculations, and Bresenham line generation. Unlike components, this file does not attach to entities and has no constructor — it is simply required and its functions are called directly.

## Usage example
```lua
require "mathutil"  -- Loads global functions (no table returned)

-- Linear interpolation between two values
local value = Lerp(0, 100, 0.5)  -- Returns 50

-- Clamp a value between min and max
local clamped = math.clamp(150, 0, 100)  -- Returns 100

-- Get sine wave based on game time
local sine = GetSineVal(0.5, true, inst)  -- Returns absolute sine value

-- Calculate squared distance between two positions
local distSq = DistXZSq({x = 0, z = 0}, {x = 3, z = 4})  -- Returns 25
```

## Dependencies & tags
**Components used:** None identified
**Tags:** None identified
**Global constants required:** `PI` (math.pi), `TWOPI` (2 * math.pi) — DST environment constants used by angle and sine functions

## Properties
No public properties

## Main functions
### `GetSineVal(mod, abs, inst)`
*   **Description:** Returns a sine wave value based on game time. The wave period can be modified, and the absolute value can be optionally returned.
*   **Parameters:**
    *   `mod` (number or nil) — Multiplier to modify the wave period. If nil, defaults to `1`.
    *   `abs` (boolean or nil) — If true, returns the absolute value of the sine wave.
    *   `inst` (entity or nil) — Entity instance to get time alive from. If nil, uses global `GetTime()`.
*   **Returns:** (number) — Sine wave value between `-1` and `1`, or `0` to `1` if `abs` is true.

### `Lerp(a, b, t)`
*   **Description:** Linearly interpolates a number from `a` to `b` over parameter `t`.
*   **Parameters:**
    *   `a` (number) — Start value.
    *   `b` (number) — End value.
    *   `t` (number) — Interpolation factor, typically between `0` and `1`.
*   **Returns:** (number) — Interpolated value.

### `Remap(i, a, b, x, y)`
*   **Description:** Remaps a value from one range to another.
*   **Parameters:**
    *   `i` (number) — Input value to remap.
    *   `a` (number) — Start of input range.
    *   `b` (number) — End of input range.
    *   `x` (number) — Start of output range.
    *   `y` (number) — End of output range.
*   **Returns:** (number) — Remapped value in the new range.

### `RoundBiasedUp(num, idp)`
*   **Description:** Rounds a number to specified decimal points. Values at `0.5` are always rounded up.
*   **Parameters:**
    *   `num` (number) — Number to round.
    *   `idp` (number or nil) — Number of decimal places. If nil, defaults to `0`.
*   **Returns:** (number) — Rounded value.

### `RoundBiasedDown(num, idp)`
*   **Description:** Rounds a number to specified decimal points. Values at `0.5` are always rounded down.
*   **Parameters:**
    *   `num` (number) — Number to round.
    *   `idp` (number or nil) — Number of decimal places. If nil, defaults to `0`.
*   **Returns:** (number) — Rounded value.

### `RoundToNearest(numToRound, multiple)`
*   **Description:** Rounds a number to the nearest multiple of a given value.
*   **Parameters:**
    *   `numToRound` (number) — Number to round.
    *   `multiple` (number) — Multiple to round to.
*   **Returns:** (number) — Rounded value.

### `math.clamp(num, min, max)`
*   **Description:** Clamps a number between two values. Extends the global `math` table.
*   **Parameters:**
    *   `num` (number) — Number to clamp.
    *   `min` (number) — Minimum boundary.
    *   `max` (number) — Maximum boundary.
*   **Returns:** (number) — Clamped value within the range.

### `Clamp(num, min, max)`
*   **Description:** Clamps a number between two values. Global function alias for `math.clamp`.
*   **Parameters:**
    *   `num` (number) — Number to clamp.
    *   `min` (number) — Minimum boundary.
    *   `max` (number) — Maximum boundary.
*   **Returns:** (number) — Clamped value within the range.

### `IsNumberEven(num)`
*   **Description:** Checks if a number is even.
*   **Parameters:**
    *   `num` (number) — Number to check.
*   **Returns:** (boolean) — True if the number is even, false otherwise.

### `DistXYSq(p1, p2)`
*   **Description:** Calculates the squared distance between two positions in the XY plane.
*   **Parameters:**
    *   `p1` (table) — First position with `x` and `y` fields.
    *   `p2` (table) — Second position with `x` and `y` fields.
*   **Returns:** (number) — Squared distance value.

### `DistXZSq(p1, p2)`
*   **Description:** Calculates the squared distance between two positions in the XZ plane (common for ground-level distance in DST).
*   **Parameters:**
    *   `p1` (table) — First position with `x` and `z` fields.
    *   `p2` (table) — Second position with `x` and `z` fields.
*   **Returns:** (number) — Squared distance value.

### `math.range(start, stop, step)`
*   **Description:** Generates an array of numbers from start to stop with optional step. Extends the global `math` table.
*   **Parameters:**
    *   `start` (number) — Starting value.
    *   `stop` (number) — Ending value.
    *   `step` (number or nil) — Step increment. If nil, defaults to `1`.
*   **Returns:** (table) — Array of numbers.

### `math.diff(a, b)`
*   **Description:** Returns the absolute difference between two numbers. Extends the global `math` table.
*   **Parameters:**
    *   `a` (number) — First number.
    *   `b` (number) — Second number.
*   **Returns:** (number) — Absolute difference.

### `ReduceAngle(rot)`
*   **Description:** Reduces an angle in degrees to the range `-180` to `180`.
*   **Parameters:**
    *   `rot` (number) — Angle in degrees.
*   **Returns:** (number) — Normalized angle.

### `DiffAngle(rot1, rot2)`
*   **Description:** Calculates the absolute difference between two angles in degrees.
*   **Parameters:**
    *   `rot1` (number) — First angle in degrees.
    *   `rot2` (number) — Second angle in degrees.
*   **Returns:** (number) — Absolute angle difference.

### `ReduceAngleRad(rot)`
*   **Description:** Reduces an angle in radians to the range `-pi` to `pi`.
*   **Parameters:**
    *   `rot` (number) — Angle in radians.
*   **Returns:** (number) — Normalized angle.

### `DiffAngleRad(rot1, rot2)`
*   **Description:** Calculates the absolute difference between two angles in radians.
*   **Parameters:**
    *   `rot1` (number) — First angle in radians.
    *   `rot2` (number) — Second angle in radians.
*   **Returns:** (number) — Absolute angle difference.

### `BresenhamLineXZtoXZ(x1, z1, x2, z2)`
*   **Description:** Generates points along a line using Bresenham's algorithm in the XZ plane. Orthogonal moves only; diagonals create 2x2 blocks.
*   **Parameters:**
    *   `x1` (number) — Starting X coordinate.
    *   `z1` (number) — Starting Z coordinate.
    *   `x2` (number) — Ending X coordinate.
    *   `z2` (number) — Ending Z coordinate.
*   **Returns:** (table) — Array of position tables with `x` and `z` fields.

### `BresenhamLineXZtoXZExcludeCaps(x1, z1, x2, z2, excludestart, excludeend)`
*   **Description:** Generates Bresenham line points with optional exclusion of start and/or end points.
*   **Parameters:**
    *   `x1` (number) — Starting X coordinate.
    *   `z1` (number) — Starting Z coordinate.
    *   `x2` (number) — Ending X coordinate.
    *   `z2` (number) — Ending Z coordinate.
    *   `excludestart` (boolean) — If true, excludes the starting point from results.
    *   `excludeend` (boolean) — If true, excludes the ending point from results.
*   **Returns:** (table) — Array of position tables with `x` and `z` fields.

## Events & listeners
None.