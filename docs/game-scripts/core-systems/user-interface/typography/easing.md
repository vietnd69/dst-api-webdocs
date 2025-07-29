---
id: easing
title: Easing
description: Mathematical easing functions for smooth animations and transitions
sidebar_position: 3

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Easing

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `easing` module provides a comprehensive collection of mathematical easing functions for creating smooth animations and transitions. These functions are adapted from Robert Penner's Easing Equations and are commonly used in tweening systems to control the rate of change of animated values over time.

## Usage Example

```lua
local easing = require("easing")

-- Basic linear interpolation
local result = easing.linear(50, 0, 100, 100) -- Returns 50

-- Smooth ease-in animation
local smoothResult = easing.inQuad(25, 0, 100, 100) -- Returns 6.25

-- Bounce effect at the end
local bounceResult = easing.outBounce(75, 0, 100, 100) -- Returns bounce curve value
```

## Function Parameters

All easing functions follow the same parameter structure:

**Standard Parameters:**
- `t` (number): Elapsed time (current time in animation)
- `b` (number): Beginning value (start value)
- `c` (number): Change in value (ending value - beginning value)
- `d` (number): Duration (total animation time)

**Additional Parameters (for some functions):**
- `a` (number): Amplitude (for elastic and back functions)
- `p` (number): Period (for elastic functions)
- `s` (number): Overshoot factor (for back functions)

## Linear Functions

### linear(t, b, c, d) {#linear}

**Status:** `stable`

**Description:**
Provides linear interpolation with constant rate of change.

**Parameters:**
- `t` (number): Elapsed time
- `b` (number): Beginning value
- `c` (number): Change in value
- `d` (number): Duration

**Returns:**
- (number): Interpolated value

**Example:**
```lua
-- Linear movement from 0 to 100 over 2 seconds
local value = easing.linear(1, 0, 100, 2) -- Returns 50
```

## Quadratic Functions

### inQuad(t, b, c, d) {#in-quad}

**Status:** `stable`

**Description:**
Quadratic ease-in function. Acceleration from zero velocity.

**Parameters:**
- `t` (number): Elapsed time
- `b` (number): Beginning value
- `c` (number): Change in value
- `d` (number): Duration

**Returns:**
- (number): Interpolated value with quadratic ease-in curve

**Example:**
```lua
-- Slow start, then accelerating
local value = easing.inQuad(0.5, 0, 100, 1) -- Returns 25
```

### outQuad(t, b, c, d) {#out-quad}

**Status:** `stable`

**Description:**
Quadratic ease-out function. Deceleration to zero velocity.

**Example:**
```lua
-- Fast start, then slowing down
local value = easing.outQuad(0.5, 0, 100, 1) -- Returns 75
```

### inOutQuad(t, b, c, d) {#in-out-quad}

**Status:** `stable`

**Description:**
Quadratic ease-in-out function. Acceleration until halfway, then deceleration.

**Example:**
```lua
-- Smooth acceleration and deceleration
local value = easing.inOutQuad(0.5, 0, 100, 1) -- Returns 50
```

### outInQuad(t, b, c, d) {#out-in-quad}

**Status:** `stable`

**Description:**
Quadratic ease-out-in function. Deceleration until halfway, then acceleration.

## Cubic Functions

### inCubic(t, b, c, d) {#in-cubic}

**Status:** `stable`

**Description:**
Cubic ease-in function. Stronger acceleration than quadratic.

### outCubic(t, b, c, d) {#out-cubic}

**Status:** `stable`

**Description:**
Cubic ease-out function. Stronger deceleration than quadratic.

### inOutCubic(t, b, c, d) {#in-out-cubic}

**Status:** `stable`

**Description:**
Cubic ease-in-out function.

### outInCubic(t, b, c, d) {#out-in-cubic}

**Status:** `stable`

**Description:**
Cubic ease-out-in function.

## Quartic Functions

### inQuart(t, b, c, d) {#in-quart}

**Status:** `stable`

**Description:**
Quartic (4th power) ease-in function.

### outQuart(t, b, c, d) {#out-quart}

**Status:** `stable`

**Description:**
Quartic ease-out function.

### inOutQuart(t, b, c, d) {#in-out-quart}

**Status:** `stable`

**Description:**
Quartic ease-in-out function.

### outInQuart(t, b, c, d) {#out-in-quart}

**Status:** `stable`

**Description:**
Quartic ease-out-in function.

## Quintic Functions

### inQuint(t, b, c, d) {#in-quint}

**Status:** `stable`

**Description:**
Quintic (5th power) ease-in function.

### outQuint(t, b, c, d) {#out-quint}

**Status:** `stable`

**Description:**
Quintic ease-out function.

### inOutQuint(t, b, c, d) {#in-out-quint}

**Status:** `stable`

**Description:**
Quintic ease-in-out function.

### outInQuint(t, b, c, d) {#out-in-quint}

**Status:** `stable`

**Description:**
Quintic ease-out-in function.

## Sinusoidal Functions

### inSine(t, b, c, d) {#in-sine}

**Status:** `stable`

**Description:**
Sinusoidal ease-in function. Smooth curved acceleration.

**Example:**
```lua
-- Gentle curved acceleration
local value = easing.inSine(0.5, 0, 100, 1) -- Returns ~29.3
```

### outSine(t, b, c, d) {#out-sine}

**Status:** `stable`

**Description:**
Sinusoidal ease-out function. Smooth curved deceleration.

### inOutSine(t, b, c, d) {#in-out-sine}

**Status:** `stable`

**Description:**
Sinusoidal ease-in-out function. Very smooth acceleration and deceleration.

### outInSine(t, b, c, d) {#out-in-sine}

**Status:** `stable`

**Description:**
Sinusoidal ease-out-in function.

## Exponential Functions

### inExpo(t, b, c, d) {#in-expo}

**Status:** `stable`

**Description:**
Exponential ease-in function. Very slow start with dramatic acceleration.

**Example:**
```lua
-- Very slow start, then rapid acceleration
local value = easing.inExpo(0, 0, 100, 1) -- Returns 0 (special case)
local value2 = easing.inExpo(0.5, 0, 100, 1) -- Returns ~3.1
```

### outExpo(t, b, c, d) {#out-expo}

**Status:** `stable`

**Description:**
Exponential ease-out function. Fast start with dramatic deceleration.

### inOutExpo(t, b, c, d) {#in-out-expo}

**Status:** `stable`

**Description:**
Exponential ease-in-out function.

### outInExpo(t, b, c, d) {#out-in-expo}

**Status:** `stable`

**Description:**
Exponential ease-out-in function.

## Circular Functions

### inCirc(t, b, c, d) {#in-circ}

**Status:** `stable`

**Description:**
Circular ease-in function. Based on quarter circle arc.

### outCirc(t, b, c, d) {#out-circ}

**Status:** `stable`

**Description:**
Circular ease-out function.

### inOutCirc(t, b, c, d) {#in-out-circ}

**Status:** `stable`

**Description:**
Circular ease-in-out function.

### outInCirc(t, b, c, d) {#out-in-circ}

**Status:** `stable`

**Description:**
Circular ease-out-in function.

## Elastic Functions

### inElastic(t, b, c, d, a, p) {#in-elastic}

**Status:** `stable`

**Description:**
Elastic ease-in function. Creates a spring-like effect with oscillation before reaching the target.

**Parameters:**
- `t` (number): Elapsed time
- `b` (number): Beginning value
- `c` (number): Change in value
- `d` (number): Duration
- `a` (number, optional): Amplitude (defaults to change value)
- `p` (number, optional): Period (defaults to duration * 0.3)

**Example:**
```lua
-- Spring effect with oscillation at start
local value = easing.inElastic(0.8, 0, 100, 1) -- Creates elastic spring effect
```

### outElastic(t, b, c, d, a, p) {#out-elastic}

**Status:** `stable`

**Description:**
Elastic ease-out function. Creates oscillation at the end of the animation.

### inOutElastic(t, b, c, d, a, p) {#in-out-elastic}

**Status:** `stable`

**Description:**
Elastic ease-in-out function.

### outInElastic(t, b, c, d, a, p) {#out-in-elastic}

**Status:** `stable`

**Description:**
Elastic ease-out-in function.

## Back Functions

### inBack(t, b, c, d, s) {#in-back}

**Status:** `stable`

**Description:**
Back ease-in function. Backs up slightly before moving forward.

**Parameters:**
- `t` (number): Elapsed time
- `b` (number): Beginning value
- `c` (number): Change in value
- `d` (number): Duration
- `s` (number, optional): Overshoot factor (defaults to 1.70158)

**Example:**
```lua
-- Backs up before moving forward
local value = easing.inBack(0.3, 0, 100, 1) -- Returns negative value (backing up)
```

### outBack(t, b, c, d, s) {#out-back}

**Status:** `stable`

**Description:**
Back ease-out function. Overshoots the target then settles back.

### inOutBack(t, b, c, d, s) {#in-out-back}

**Status:** `stable`

**Description:**
Back ease-in-out function.

### outInBack(t, b, c, d, s) {#out-in-back}

**Status:** `stable`

**Description:**
Back ease-out-in function.

## Bounce Functions

### inBounce(t, b, c, d) {#in-bounce}

**Status:** `stable`

**Description:**
Bounce ease-in function. Creates bouncing effect at the start.

**Example:**
```lua
-- Bouncing effect at start of animation
local value = easing.inBounce(0.2, 0, 100, 1) -- Creates bounce effect
```

### outBounce(t, b, c, d) {#out-bounce}

**Status:** `stable`

**Description:**
Bounce ease-out function. Creates bouncing effect at the end.

**Example:**
```lua
-- Classic bouncing ball effect
local value = easing.outBounce(0.8, 0, 100, 1) -- Bounces before settling
```

### inOutBounce(t, b, c, d) {#in-out-bounce}

**Status:** `stable`

**Description:**
Bounce ease-in-out function.

### outInBounce(t, b, c, d) {#out-in-bounce}

**Status:** `stable`

**Description:**
Bounce ease-out-in function.

## Common Usage Patterns

### UI Animations
```lua
-- Smooth button hover effect
local hoverScale = easing.outQuad(hoverTime, 1.0, 0.1, 0.2)

-- Menu slide-in animation
local menuPos = easing.outBack(animTime, -200, 200, 0.5)
```

### Game Object Movement
```lua
-- Projectile arc with gravity
local height = easing.outQuad(flightTime, startHeight, -startHeight, totalTime)

-- Spring-loaded platform
local platformPos = easing.outElastic(springTime, restPos, displacement, 1.0)
```

### Visual Effects
```lua
-- Pulsing glow effect
local glowIntensity = easing.inOutSine(pulseTime, 0.5, 0.5, 2.0)

-- Screen shake with decay
local shakeAmount = easing.outBounce(shakeTime, maxShake, -maxShake, duration)
```

## Mathematical Foundation

The easing functions are based on Robert Penner's Easing Equations, which provide smooth interpolation curves using various mathematical functions:

- **Polynomial**: Power functions (quad, cubic, quart, quint)
- **Trigonometric**: Sine and cosine functions
- **Exponential**: Powers of 2
- **Circular**: Quarter-circle arcs
- **Physical**: Spring (elastic) and bounce simulations

## License Information

This implementation is adapted from Robert Penner's Easing Equations, released under the BSD License. The original equations are widely used in animation and tweening libraries across many programming languages.

## Related Modules

- [Scheduler](./scheduler.md): Often used with easing functions for timed animations
- [EntityScript](./entityscript.md): Entity animation systems may use easing functions
- [Main Functions](./mainfunctions.md): Core game loop where animations are updated
