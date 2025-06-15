---
id: math
title: Math Utilities
sidebar_position: 5
last_updated: 2023-07-06
---

# Math Utilities

Mathematical functions and operations for Don't Starve Together modding that extend beyond the standard Lua math library.

## Standard Math Functions

These functions are part of the standard Lua math library:

### Basic Operations

```lua
-- Absolute value
local abs = math.abs(x)

-- Maximum and minimum
local max = math.max(x, y)
local min = math.min(x, y)

-- Floor and ceiling
local floor = math.floor(x)
local ceil = math.ceil(x)

-- Power and square root
local pow = math.pow(x, y)  -- x^y
local sqrt = math.sqrt(x)   -- √x

-- Modulo
local remainder = math.mod(x, y)
local float_remainder = math.fmod(x, y)

-- Random numbers
math.randomseed(seed)       -- Set random seed
local rand = math.random()  -- Random between 0 and 1
local rand_n = math.random(n)  -- Random integer between 1 and n
local rand_range = math.random(min, max)  -- Random integer between min and max
```

### Trigonometric Functions

```lua
-- Angle conversions
local rad = math.rad(degrees)  -- Convert degrees to radians
local deg = math.deg(radians)  -- Convert radians to degrees

-- Basic trigonometry
local sin = math.sin(rad)
local cos = math.cos(rad)
local tan = math.tan(rad)

-- Inverse trigonometry
local asin = math.asin(x)  -- Arc sine
local acos = math.acos(x)  -- Arc cosine
local atan = math.atan(x)  -- Arc tangent
local atan2 = math.atan2(y, x)  -- Arc tangent of y/x, respecting quadrants

-- Hyperbolic functions
local sinh = math.sinh(x)  -- Hyperbolic sine
local cosh = math.cosh(x)  -- Hyperbolic cosine
local tanh = math.tanh(x)  -- Hyperbolic tangent
```

### Other Functions

```lua
-- Logarithms
local ln = math.log(x)  -- Natural logarithm
local log10 = math.log10(x)  -- Base-10 logarithm
local log_base = math.log(x, base)  -- Logarithm with custom base

-- Exponential
local exp = math.exp(x)  -- e^x

-- Constants
local pi = math.pi  -- π (approximately 3.14159...)
local huge = math.huge  -- Positive infinity
```

## Extended Math Functions

Don't Starve Together provides additional math functions:

### Number Manipulation

```lua
-- Clamp a value between min and max
local clamped = math.clamp(value, min_value, max_value)

-- Get absolute difference between two numbers
local difference = math.diff(a, b)

-- Split number into integer and fractional parts
local int_part, frac_part = math.modf(x)

-- Convert a number to x * 2^n form
local mantissa, exponent = math.frexp(x)

-- Calculate x * 2^n
local result = math.ldexp(x, n)
```

### Range Functions

```lua
-- Generate an array of numbers in a range
local range = math.range(start, stop, step)  -- step is optional, defaults to 1
```

### Special Constants

```lua
-- Infinity
local inf = math.inf  -- Represents infinity (1/0)
```

## Common Use Cases

### Damage Calculations

```lua
-- Calculate damage with random variation
local function CalculateDamage(base_damage, variance)
    variance = variance or 0.1  -- Default 10% variance
    local min_damage = base_damage * (1 - variance)
    local max_damage = base_damage * (1 + variance)
    return math.random() * (max_damage - min_damage) + min_damage
end

-- Apply damage with caps
local function ApplyDamage(inst, damage)
    local health = inst.components.health
    if health then
        -- Ensure damage is at least 1 and at most the current health
        damage = math.clamp(damage, 1, health.currenthealth)
        health:DoDelta(-damage)
        return damage
    end
    return 0
end
```

### Position Calculations

```lua
-- Find a position at a random angle and distance
local function FindRandomPosition(center_x, center_y, center_z, min_dist, max_dist)
    local theta = math.random() * 2 * math.pi  -- Random angle in radians
    local dist = min_dist + math.random() * (max_dist - min_dist)
    
    local offset_x = dist * math.cos(theta)
    local offset_z = dist * math.sin(theta)
    
    return center_x + offset_x, center_y, center_z + offset_z
end

-- Check if a point is within a rectangle
local function IsPointInRect(x, z, rect_x, rect_z, rect_width, rect_height)
    return x >= rect_x and x <= rect_x + rect_width and
           z >= rect_z and z <= rect_z + rect_height
end
```

### Time and Rate Calculations

```lua
-- Convert game time to real seconds
local function GameTimeToRealSeconds(time)
    local TICKS_PER_SECOND = 30  -- DST runs at 30 ticks per second
    return time / TICKS_PER_SECOND
end

-- Calculate spawn rate based on day phase
local function CalculateSpawnRate(day_phase, base_rate)
    if day_phase == "day" then
        return base_rate * 0.5  -- Half as many spawns during day
    elseif day_phase == "dusk" then
        return base_rate        -- Normal spawn rate at dusk
    else -- night
        return base_rate * 2    -- Double spawns at night
    end
end
```

### Interpolation

```lua
-- Linear interpolation between two values
local function Lerp(a, b, t)
    return a + (b - a) * math.clamp(t, 0, 1)
end

-- Smooth step interpolation (ease in/out)
local function SmoothStep(a, b, t)
    t = math.clamp(t, 0, 1)
    t = t * t * (3 - 2 * t)  -- Smooth formula
    return a + (b - a) * t
end
``` 
