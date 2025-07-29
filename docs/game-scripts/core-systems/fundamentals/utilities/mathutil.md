---
id: mathutil
title: Math Utilities
description: Mathematical utility functions for sine waves, interpolation, rounding, clamping, distance calculations, and angle operations
sidebar_position: 2

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Math Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `mathutil.lua` script provides essential mathematical utility functions used throughout Don't Starve Together. These functions handle common mathematical operations including sine wave generation, interpolation, rounding, clamping, distance calculations, and angle manipulations.

## Usage Example

```lua
-- Interpolate between values
local result = Lerp(10, 20, 0.5) -- Returns 15

-- Generate sine wave for animations
local wave = GetSineVal(1, true) -- Absolute sine wave

-- Clamp values to range
local clamped = Clamp(150, 0, 100) -- Returns 100

-- Calculate distance between points
local dist_sq = DistXZSq(pos1, pos2)
```

## Wave Generation Functions

### GetSineVal(mod, abs, inst) {#get-sine-val}

**Status:** `stable`

**Description:**
Generates a sine wave value based on game time with optional period modification and absolute value.

**Parameters:**
- `mod` (number): Optional period modifier (default: 1)
- `abs` (boolean): Whether to return absolute value of the sine wave
- `inst` (EntityScript): Optional entity to use for time calculation (uses entity's alive time)

**Returns:**
- (number): Sine wave value between -1 and 1 (or 0 and 1 if abs is true)

**Example:**
```lua
-- Basic sine wave for gentle animation
local gentle_wave = GetSineVal()

-- Fast oscillation with absolute values (0 to 1)
local fast_pulse = GetSineVal(3, true)

-- Slow wave tied to entity's lifetime
local entity_wave = GetSineVal(0.5, false, inst)

-- Use for breathing effect
local scale = 1 + GetSineVal(2, true, inst) * 0.1
inst.Transform:SetScale(scale, scale, scale)
```

## Interpolation Functions

### Lerp(a, b, t) {#lerp}

**Status:** `stable`

**Description:**
Linear interpolation between two values over a given parameter t.

**Parameters:**
- `a` (number): Start value
- `b` (number): End value  
- `t` (number): Interpolation parameter (0 to 1)

**Returns:**
- (number): Interpolated value

**Example:**
```lua
-- Basic interpolation
local mid_point = Lerp(0, 100, 0.5) -- Returns 50

-- Animation over time
local progress = GetTime() % 2 / 2 -- 0 to 1 over 2 seconds
local animated_x = Lerp(start_x, end_x, progress)

-- Color blending
local red_component = Lerp(0.2, 0.8, health_percent)
```

### Remap(i, a, b, x, y) {#remap}

**Status:** `stable`

**Description:**
Remaps a value from one range to another range.

**Parameters:**
- `i` (number): Input value to remap
- `a` (number): Input range minimum
- `b` (number): Input range maximum
- `x` (number): Output range minimum
- `y` (number): Output range maximum

**Returns:**
- (number): Remapped value

**Example:**
```lua
-- Remap health (0-100) to alpha (0.3-1.0)
local health = 75
local alpha = Remap(health, 0, 100, 0.3, 1.0) -- Returns 0.825

-- Remap temperature (-20 to 40) to color intensity (0 to 255)
local temp = 15
local color_intensity = Remap(temp, -20, 40, 0, 255)

-- Remap day progress (0-1) to sun angle (-90 to 90)
local day_progress = 0.25
local sun_angle = Remap(day_progress, 0, 1, -90, 90)
```

## Rounding Functions

### RoundBiasedUp(num, idp) {#round-biased-up}

**Status:** `stable`

**Description:**
Rounds a number to specified decimal places, with 0.5-values always rounded up.

**Parameters:**
- `num` (number): Number to round
- `idp` (number): Decimal places (default: 0)

**Returns:**
- (number): Rounded number

**Example:**
```lua
-- Round to integers (0.5 goes up)
local rounded = RoundBiasedUp(2.5) -- Returns 3
local rounded2 = RoundBiasedUp(2.4) -- Returns 2

-- Round to 2 decimal places
local precise = RoundBiasedUp(3.14159, 2) -- Returns 3.14

-- Round currency values
local price = RoundBiasedUp(19.95, 0) -- Returns 20
```

### RoundBiasedDown(num, idp) {#round-biased-down}

**Status:** `stable`

**Description:**
Rounds a number to specified decimal places, with 0.5-values always rounded down.

**Parameters:**
- `num` (number): Number to round
- `idp` (number): Decimal places (default: 0)

**Returns:**
- (number): Rounded number

**Example:**
```lua
-- Round to integers (0.5 goes down)
local rounded = RoundBiasedDown(2.5) -- Returns 2
local rounded2 = RoundBiasedDown(2.6) -- Returns 3

-- Conservative rounding for damage calculations
local damage = RoundBiasedDown(player_damage * modifier, 1)
```

### RoundToNearest(numToRound, multiple) {#round-to-nearest}

**Status:** `stable`

**Description:**
Rounds a number to the nearest multiple of a specified value.

**Parameters:**
- `numToRound` (number): Number to round
- `multiple` (number): Multiple to round to

**Returns:**
- (number): Number rounded to nearest multiple

**Example:**
```lua
-- Round to nearest 5
local rounded = RoundToNearest(23, 5) -- Returns 25

-- Round to nearest grid position
local grid_x = RoundToNearest(player_x, TILE_SCALE)
local grid_z = RoundToNearest(player_z, TILE_SCALE)

-- Round spawn time to nearest minute
local spawn_time = RoundToNearest(random_time, 60)
```

## Clamping Functions

### Clamp(num, min, max) {#clamp}

**Status:** `stable`

**Description:**
Constrains a number between minimum and maximum values.

**Parameters:**
- `num` (number): Number to clamp
- `min` (number): Minimum allowed value
- `max` (number): Maximum allowed value

**Returns:**
- (number): Clamped number

**Example:**
```lua
-- Clamp health to valid range
local health = Clamp(new_health, 0, max_health)

-- Clamp UI element position
local x = Clamp(mouse_x, panel_left, panel_right)
local y = Clamp(mouse_y, panel_top, panel_bottom)

-- Clamp angle for limited rotation
local angle = Clamp(target_angle, -45, 45)
```

### math.clamp(num, min, max) {#math-clamp}

**Status:** `stable`

**Description:**
Math library extension for clamping values. Identical to Clamp function.

**Parameters:**
- `num` (number): Number to clamp
- `min` (number): Minimum allowed value
- `max` (number): Maximum allowed value

**Returns:**
- (number): Clamped number

**Example:**
```lua
-- Using math library extension
local clamped = math.clamp(value, 0, 1)
```

## Utility Functions

### IsNumberEven(num) {#is-number-even}

**Status:** `stable`

**Description:**
Checks if a number is even.

**Parameters:**
- `num` (number): Number to test

**Returns:**
- (boolean): True if number is even

**Example:**
```lua
-- Alternate behavior for even/odd
if IsNumberEven(day_number) then
    SpawnSpecialEvent()
end

-- Pattern generation
for i = 1, 10 do
    local color = IsNumberEven(i) and "white" or "black"
    CreateChessboardTile(i, color)
end
```

### math.range(start, stop, step) {#math-range}

**Status:** `stable`

**Description:**
Creates a table containing a range of numbers from start to stop with optional step.

**Parameters:**
- `start` (number): Starting value
- `stop` (number): Ending value
- `step` (number): Step size (default: 1)

**Returns:**
- (table): Array of numbers in the range

**Example:**
```lua
-- Create range 1 to 10
local numbers = math.range(1, 10) -- {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

-- Create range with step
local evens = math.range(2, 10, 2) -- {2, 4, 6, 8, 10}

-- Create countdown
local countdown = math.range(10, 1, -1) -- {10, 9, 8, 7, 6, 5, 4, 3, 2, 1}
```

### math.diff(a, b) {#math-diff}

**Status:** `stable`

**Description:**
Calculates the absolute difference between two numbers.

**Parameters:**
- `a` (number): First number
- `b` (number): Second number

**Returns:**
- (number): Absolute difference

**Example:**
```lua
-- Compare values
local difference = math.diff(player_level, required_level)
if difference <= 2 then
    AllowAccess()
end

-- Find closest match
local closest_value = nil
local smallest_diff = math.huge
for _, candidate in ipairs(options) do
    local diff = math.diff(target, candidate)
    if diff < smallest_diff then
        smallest_diff = diff
        closest_value = candidate
    end
end
```

## Distance Functions

### DistXYSq(p1, p2) {#dist-xy-sq}

**Status:** `stable`

**Description:**
Calculates the squared distance between two points in XY plane (2D).

**Parameters:**
- `p1` (table): First point with .x and .y properties
- `p2` (table): Second point with .x and .y properties

**Returns:**
- (number): Squared distance

**Example:**
```lua
-- Check if entities are close (avoids expensive sqrt)
local pos1 = {x = 10, y = 20}
local pos2 = {x = 13, y = 24}
local dist_sq = DistXYSq(pos1, pos2) -- Returns 25 (5² = 25)

if dist_sq < 100 then -- Within 10 units
    TriggerNearbyEffect()
end
```

### DistXZSq(p1, p2) {#dist-xz-sq}

**Status:** `stable`

**Description:**
Calculates the squared distance between two points in XZ plane (3D world coordinates).

**Parameters:**
- `p1` (table): First point with .x and .z properties
- `p2` (table): Second point with .x and .z properties

**Returns:**
- (number): Squared distance

**Example:**
```lua
-- 3D world distance calculation
local player_pos = {x = ThePlayer.Transform:GetWorldPosition()}
local target_pos = {x = target.Transform:GetWorldPosition()}

local dist_sq = DistXZSq(player_pos, target_pos)
local interaction_range_sq = INTERACTION_RANGE * INTERACTION_RANGE

if dist_sq <= interaction_range_sq then
    ShowInteractionPrompt()
end
```

## Angle Functions

### ReduceAngle(rot) {#reduce-angle}

**Status:** `stable`

**Description:**
Normalizes an angle to the range [-180, 180] degrees.

**Parameters:**
- `rot` (number): Angle in degrees

**Returns:**
- (number): Normalized angle

**Example:**
```lua
-- Normalize rotation angles
local angle = 450 -- Equivalent to 90 degrees
local normalized = ReduceAngle(angle) -- Returns 90

-- Handle continuous rotation
local new_rotation = old_rotation + rotation_speed * dt
new_rotation = ReduceAngle(new_rotation)
```

### DiffAngle(rot1, rot2) {#diff-angle}

**Status:** `stable`

**Description:**
Calculates the absolute angular difference between two angles in degrees.

**Parameters:**
- `rot1` (number): First angle in degrees
- `rot2` (number): Second angle in degrees

**Returns:**
- (number): Absolute angular difference

**Example:**
```lua
-- Check if facing target
local player_angle = ThePlayer.Transform:GetRotation()
local target_angle = math.atan2(target_z - player_z, target_x - player_x) * 180 / math.pi
local angle_diff = DiffAngle(player_angle, target_angle)

if angle_diff < 10 then -- Within 10 degrees
    SetFacingTarget(true)
end
```

### ReduceAngleRad(rot) {#reduce-angle-rad}

**Status:** `stable`

**Description:**
Normalizes an angle to the range [-π, π] radians.

**Parameters:**
- `rot` (number): Angle in radians

**Returns:**
- (number): Normalized angle in radians

**Example:**
```lua
-- Normalize radian angles
local angle_rad = 7 -- Greater than 2π
local normalized = ReduceAngleRad(angle_rad)

-- Vector rotation calculations
local normalized_heading = ReduceAngleRad(current_heading + turn_amount)
```

### DiffAngleRad(rot1, rot2) {#diff-angle-rad}

**Status:** `stable`

**Description:**
Calculates the absolute angular difference between two angles in radians.

**Parameters:**
- `rot1` (number): First angle in radians
- `rot2` (number): Second angle in radians

**Returns:**
- (number): Absolute angular difference in radians

**Example:**
```lua
-- Precise angular comparison using radians
local heading1 = math.atan2(vel1.z, vel1.x)
local heading2 = math.atan2(vel2.z, vel2.x)
local angular_diff = DiffAngleRad(heading1, heading2)

if angular_diff < math.pi / 18 then -- Within 10 degrees (π/18 radians)
    SetSameDirection(true)
end
```

## Common Usage Patterns

### Animation and Visual Effects

```lua
-- Breathing/pulsing animation
local scale = 1 + GetSineVal(2, true) * 0.1
inst.Transform:SetScale(scale, scale, scale)

-- Floating animation
local bob_offset = GetSineVal(1.5, false) * 0.3
inst.Transform:SetPosition(x, y + bob_offset, z)

-- Color transitions
local health_percent = inst.components.health:GetPercent()
local red = Lerp(0, 1, 1 - health_percent)
local green = Lerp(0, 1, health_percent)
```

### Game Mechanics

```lua
-- Damage calculation with rounding
local base_damage = weapon.damage
local modified_damage = base_damage * damage_multiplier
local final_damage = RoundBiasedDown(modified_damage)

-- Range checking (squared distance is faster)
local range_sq = ATTACK_RANGE * ATTACK_RANGE
local dist_sq = DistXZSq(attacker_pos, target_pos)
if dist_sq <= range_sq then
    PerformAttack()
end

-- Progress mapping
local completion = Remap(current_resources, 0, required_resources, 0, 1)
UpdateProgressBar(completion)
```

## Performance Notes

- **Squared distance functions** avoid expensive square root calculations
- **GetSineVal** uses game time efficiently for synchronized animations
- **Angle normalization** prevents floating point precision issues
- **Clamping** is faster than conditional statements for range limiting

## Related Modules

- [Vector3](./vector3.md): 3D vector mathematics
- [VecUtil](./vecutil.md): Vector utility functions
- [Constants](./constants.md): Mathematical constants and definitions
- [Easing](./easing.md): Advanced interpolation and easing functions
- [Physics](./physics.md): Physics calculations and collision detection
