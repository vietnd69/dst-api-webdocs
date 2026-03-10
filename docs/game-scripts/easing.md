---
id: easing
title: Easing
description: Provides a collection of mathematical easing functions for interpolating values over time, used for smooth animations and transitions.
tags: [animation, math, utility]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: c7ba8232
system_scope: utility
---

# Easing

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`easing.lua` is a utility module that exports a set of classic easing functions derived from Robert Penner's Easing Equations. These functions accept elapsed time (`t`), start value (`b`), change in value (`c`), and duration (`d`) as inputs and return interpolated intermediate values. The module is used by game systems to create smooth animations for visual effects, camera movements, UI transitions, and entity behaviors — not as a component attached to entities, but as a pure math library returned for direct consumption.

## Usage example
```lua
local Easing = require "easing"
local t = 0
local duration = 2
local start_val = 0
local end_val = 100
local change = end_val - start_val

t = t + 0.1
local value = Easing.outQuad(t, start_val, change, duration)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties.

## Main functions
### `linear(t, b, c, d)`
* **Description:** Returns a linear interpolation from `b` to `b + c` over duration `d`.
* **Parameters:**
  * `t` (number) – elapsed time (must be `0 <= t <= d`).
  * `b` (number) – starting value.
  * `c` (number) – total change in value (`ending - beginning`).
  * `d` (number) – total duration (time to complete the transition).
* **Returns:** (number) interpolated value at time `t`.

### `inQuad(t, b, c, d)`
* **Description:** Quadratic easing-in: starts slowly and accelerates.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outQuad(t, b, c, d)`
* **Description:** Quadratic easing-out: starts quickly and decelerates.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inOutQuad(t, b, c, d)`
* **Description:** Quadratic easing-in-out: starts slowly, accelerates, then decelerates smoothly.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outInQuad(t, b, c, d)`
* **Description:** Quadratic easing-out-in: starts by decelerating, then accelerates.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inCubic(t, b, c, d)`
* **Description:** Cubic easing-in: starts very slowly, accelerates rapidly.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outCubic(t, b, c, d)`
* **Description:** Cubic easing-out: starts quickly, slows down.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inOutCubic(t, b, c, d)`
* **Description:** Cubic easing-in-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outInCubic(t, b, c, d)`
* **Description:** Cubic easing-out-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inQuart(t, b, c, d)`
* **Description:** Quartic easing-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outQuart(t, b, c, d)`
* **Description:** Quartic easing-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inOutQuart(t, b, c, d)`
* **Description:** Quartic easing-in-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outInQuart(t, b, c, d)`
* **Description:** Quartic easing-out-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inQuint(t, b, c, d)`
* **Description:** Quintic easing-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outQuint(t, b, c, d)`
* **Description:** Quintic easing-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inOutQuint(t, b, c, d)`
* **Description:** Quintic easing-in-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outInQuint(t, b, c, d)`
* **Description:** Quintic easing-out-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inSine(t, b, c, d)`
* **Description:** Sine-based easing-in (quarter-wave).
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outSine(t, b, c, d)`
* **Description:** Sine-based easing-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inOutSine(t, b, c, d)`
* **Description:** Sine-based easing-in-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outInSine(t, b, c, d)`
* **Description:** Sine-based easing-out-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inExpo(t, b, c, d)`
* **Description:** Exponential easing-in (doubles speed at each step).
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.
* **Error states:** Returns `b` exactly when `t == 0`.

### `outExpo(t, b, c, d)`
* **Description:** Exponential easing-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.
* **Error states:** Returns `b + c` exactly when `t == d`.

### `inOutExpo(t, b, c, d)`
* **Description:** Exponential easing-in-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.
* **Error states:** Returns `b` when `t == 0`, `b + c` when `t == d`.

### `outInExpo(t, b, c, d)`
* **Description:** Exponential easing-out-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inCirc(t, b, c, d)`
* **Description:** Circular easing-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outCirc(t, b, c, d)`
* **Description:** Circular easing-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inOutCirc(t, b, c, d)`
* **Description:** Circular easing-in-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outInCirc(t, b, c, d)`
* **Description:** Circular easing-out-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inElastic(t, b, c, d, a, p)`
* **Description:** Elastic easing-in (overshoots and oscillates before settling).
* **Parameters:**
  * `a` (number, optional) – amplitude of the elastic oscillation. Defaults to `abs(c)` if not set or too small.
  * `p` (number, optional) – period of oscillation. Defaults to `d * 0.3`.
* **Parameters:** Same as `linear` + `a`, `p`.
* **Returns:** (number) interpolated value.
* **Error states:** Returns `b` when `t == 0`, `b + c` when `t == d`.

### `outElastic(t, b, c, d, a, p)`
* **Description:** Elastic easing-out.
* **Parameters:** Same as `inElastic`.
* **Returns:** (number) interpolated value.
* **Error states:** Returns `b` when `t == 0`, `b + c` when `t == d`.

### `inOutElastic(t, b, c, d, a, p)`
* **Description:** Elastic easing-in-out (symmetric oscillation).
* **Parameters:** Same as `inElastic`.
* **Returns:** (number) interpolated value.
* **Error states:** Returns `b` when `t == 0`, `b + c` when `t == d`.

### `outInElastic(t, b, c, d, a, p)`
* **Description:** Elastic easing-out-in.
* **Parameters:** Same as `inElastic`.
* **Returns:** (number) interpolated value.

### `inBack(t, b, c, d, s)`
* **Description:** Back easing-in (retracts slightly before moving forward).
* **Parameters:**
  * `s` (number, optional) – overshoot strength. Defaults to `1.70158`.
* **Parameters:** Same as `linear` + `s`.
* **Returns:** (number) interpolated value.

### `outBack(t, b, c, d, s)`
* **Description:** Back easing-out (overshoots and settles).
* **Parameters:** Same as `inBack`.
* **Returns:** (number) interpolated value.

### `inOutBack(t, b, c, d, s)`
* **Description:** Back easing-in-out (symmetric overshoot).
* **Parameters:** Same as `inBack`.
* **Returns:** (number) interpolated value.

### `outInBack(t, b, c, d, s)`
* **Description:** Back easing-out-in.
* **Parameters:** Same as `inBack`.
* **Returns:** (number) interpolated value.

### `outBounce(t, b, c, d)`
* **Description:** Bounce easing-out (mimics a bouncing ball settling).
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inBounce(t, b, c, d)`
* **Description:** Bounce easing-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `inOutBounce(t, b, c, d)`
* **Description:** Bounce easing-in-out.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

### `outInBounce(t, b, c, d)`
* **Description:** Bounce easing-out-in.
* **Parameters:** Same as `linear`.
* **Returns:** (number) interpolated value.

## Events & listeners
None identified.