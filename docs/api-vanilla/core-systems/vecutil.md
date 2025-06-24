---
id: vecutil
title: VecUtil
description: Utility functions for 2D vector operations on the XZ plane
sidebar_position: 155
slug: api-vanilla/core-systems/vecutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# VecUtil

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `vecutil.lua` module provides high-performance utility functions for 2D vector operations on the XZ plane. These functions are optimized for Don't Starve Together's primary gameplay coordinate system where Y represents height and XZ represents the ground plane. All functions operate directly on coordinate parameters without requiring object instantiation.

## Usage Example

```lua
-- Basic 2D vector operations on XZ plane
local x1, z1 = 1, 3
local x2, z2 = 4, 6

-- Add two vectors
local result_x, result_z = VecUtil_Add(x1, z1, x2, z2)
-- result: 5, 9

-- Calculate distance between points
local distance = VecUtil_Dist(x1, z1, x2, z2)

-- Get normalized direction vector
local dir_x, dir_z = VecUtil_NormalizeNoNaN(x2 - x1, z2 - z1)
```

## Functions

### VecUtil_Add(p1_x, p1_z, p2_x, p2_z) {#vecutil-add}

**Status:** `stable`

**Description:**
Adds two 2D vectors component-wise on the XZ plane.

**Parameters:**
- `p1_x` (number): X component of first vector
- `p1_z` (number): Z component of first vector
- `p2_x` (number): X component of second vector
- `p2_z` (number): Z component of second vector

**Returns:**
- (number, number): The sum vector components (x, z)

**Example:**
```lua
local x, z = VecUtil_Add(1, 3, 4, 6)
-- Result: x=5, z=9
```

### VecUtil_Sub(p1_x, p1_z, p2_x, p2_z) {#vecutil-sub}

**Status:** `stable`

**Description:**
Subtracts the second 2D vector from the first vector component-wise.

**Parameters:**
- `p1_x` (number): X component of first vector
- `p1_z` (number): Z component of first vector
- `p2_x` (number): X component of second vector
- `p2_z` (number): Z component of second vector

**Returns:**
- (number, number): The difference vector components (x, z)

**Example:**
```lua
local x, z = VecUtil_Sub(5, 9, 1, 3)
-- Result: x=4, z=6
```

### VecUtil_Scale(p1_x, p1_z, scale) {#vecutil-scale}

**Status:** `stable`

**Description:**
Scales a 2D vector by a scalar value.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_z` (number): Z component of vector
- `scale` (number): Scalar multiplier

**Returns:**
- (number, number): The scaled vector components (x, z)

**Example:**
```lua
local x, z = VecUtil_Scale(2, 4, 1.5)
-- Result: x=3, z=6
```

### VecUtil_LengthSq(p1_x, p1_z) {#vecutil-lengthsq}

**Status:** `stable`

**Description:**
Calculates the squared length (magnitude) of a 2D vector. This is more efficient than calculating the actual length when comparing distances.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number): The squared length of the vector

**Example:**
```lua
local lengthSq = VecUtil_LengthSq(3, 4)
-- Result: 25 (3² + 4² = 9 + 16 = 25)
```

### VecUtil_Length(p1_x, p1_z) {#vecutil-length}

**Status:** `stable`

**Description:**
Calculates the length (magnitude) of a 2D vector.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number): The length of the vector

**Example:**
```lua
local length = VecUtil_Length(3, 4)
-- Result: 5 (√25)
```

### VecUtil_DistSq(p1_x, p1_z, p2_x, p2_z) {#vecutil-distsq}

**Status:** `stable`

**Description:**
Calculates the squared distance between two 2D points. More efficient than calculating actual distance for comparison purposes.

**Parameters:**
- `p1_x` (number): X coordinate of first point
- `p1_z` (number): Z coordinate of first point
- `p2_x` (number): X coordinate of second point
- `p2_z` (number): Z coordinate of second point

**Returns:**
- (number): The squared distance between the points

**Example:**
```lua
local distSq = VecUtil_DistSq(0, 0, 3, 4)
-- Result: 25
```

### VecUtil_Dist(p1_x, p1_z, p2_x, p2_z) {#vecutil-dist}

**Status:** `stable`

**Description:**
Calculates the actual distance between two 2D points.

**Parameters:**
- `p1_x` (number): X coordinate of first point
- `p1_z` (number): Z coordinate of first point
- `p2_x` (number): X coordinate of second point
- `p2_z` (number): Z coordinate of second point

**Returns:**
- (number): The distance between the points

**Example:**
```lua
local distance = VecUtil_Dist(0, 0, 3, 4)
-- Result: 5
```

### VecUtil_Dot(p1_x, p1_z, p2_x, p2_z) {#vecutil-dot}

**Status:** `stable`

**Description:**
Calculates the dot product of two 2D vectors. Useful for determining angles between vectors and for projection calculations.

**Parameters:**
- `p1_x` (number): X component of first vector
- `p1_z` (number): Z component of first vector
- `p2_x` (number): X component of second vector
- `p2_z` (number): Z component of second vector

**Returns:**
- (number): The dot product of the two vectors

**Example:**
```lua
local dot = VecUtil_Dot(1, 0, 0, 1)
-- Result: 0 (perpendicular vectors)

local dot2 = VecUtil_Dot(2, 3, 4, 5)
-- Result: 23 (2*4 + 3*5 = 8 + 15 = 23)
```

### VecUtil_Lerp(p1_x, p1_z, p2_x, p2_z, percent) {#vecutil-lerp}

**Status:** `stable`

**Description:**
Performs linear interpolation between two 2D vectors.

**Parameters:**
- `p1_x` (number): X component of start vector
- `p1_z` (number): Z component of start vector
- `p2_x` (number): X component of end vector
- `p2_z` (number): Z component of end vector
- `percent` (number): Interpolation factor (0.0 to 1.0)

**Returns:**
- (number, number): The interpolated vector components (x, z)

**Example:**
```lua
-- Interpolate halfway between two points
local x, z = VecUtil_Lerp(0, 0, 10, 20, 0.5)
-- Result: x=5, z=10

-- Get 25% of the way from start to end
local x2, z2 = VecUtil_Lerp(0, 0, 10, 20, 0.25)
-- Result: x2=2.5, z2=5
```

### VecUtil_NormalizeNoNaN(p1_x, p1_z) {#vecutil-normalizenonan}

**Status:** `stable`

**Description:**
Normalizes a 2D vector to unit length, returning (0, 0) if the input vector has zero length. This prevents NaN results that could occur with zero-length vectors.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number, number): The normalized vector components (x, z) or (0, 0) if input was zero-length

**Example:**
```lua
local x, z = VecUtil_NormalizeNoNaN(3, 4)
-- Result: x=0.6, z=0.8 (unit vector)

local x2, z2 = VecUtil_NormalizeNoNaN(0, 0)
-- Result: x2=0, z2=0 (safe handling of zero vector)
```

### VecUtil_Normalize(p1_x, p1_z) {#vecutil-normalize}

**Status:** `stable`

**Description:**
Normalizes a 2D vector to unit length. Note: This function does not handle zero-length vectors safely - use VecUtil_NormalizeNoNaN for safer normalization.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number, number): The normalized vector components (x, z)

**Example:**
```lua
local x, z = VecUtil_Normalize(6, 8)
-- Result: x=0.6, z=0.8 (unit vector in same direction)
```

### VecUtil_NormalAndLength(p1_x, p1_z) {#vecutil-normalandlength}

**Status:** `stable`

**Description:**
Normalizes a 2D vector and returns both the normalized vector and its original length. More efficient than calling normalize and length separately.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number, number, number): The normalized vector components (x, z) and the original length

**Example:**
```lua
local norm_x, norm_z, length = VecUtil_NormalAndLength(6, 8)
-- Result: norm_x=0.6, norm_z=0.8, length=10
```

### VecUtil_GetAngleInDegrees(p1_x, p1_z) {#vecutil-getangleindegrees}

**Status:** `stable`

**Description:**
Calculates the angle of a 2D vector in degrees (0-360). The angle is measured from the positive X-axis.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number): The angle in degrees (0-360)

**Example:**
```lua
local angle = VecUtil_GetAngleInDegrees(1, 0)
-- Result: 0 (pointing along positive X-axis)

local angle2 = VecUtil_GetAngleInDegrees(0, 1)
-- Result: 90 (pointing along positive Z-axis)

local angle3 = VecUtil_GetAngleInDegrees(-1, 0)
-- Result: 180 (pointing along negative X-axis)
```

### VecUtil_GetAngleInRads(p1_x, p1_z) {#vecutil-getangleinrads}

**Status:** `stable`

**Description:**
Calculates the angle of a 2D vector in radians (0-2π). The angle is measured from the positive X-axis.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number): The angle in radians (0-2π)

**Example:**
```lua
local angle = VecUtil_GetAngleInRads(1, 0)
-- Result: 0 (pointing along positive X-axis)

local angle2 = VecUtil_GetAngleInRads(0, 1)
-- Result: π/2 (pointing along positive Z-axis)
```

### VecUtil_Slerp(p1_x, p1_z, p2_x, p2_z, percent) {#vecutil-slerp}

**Status:** `stable`

**Description:**
Performs spherical linear interpolation between two 2D vectors. This interpolates the angle between the vectors, maintaining unit length throughout the interpolation.

**Parameters:**
- `p1_x` (number): X component of start vector
- `p1_z` (number): Z component of start vector
- `p2_x` (number): X component of end vector
- `p2_z` (number): Z component of end vector
- `percent` (number): Interpolation factor (0.0 to 1.0)

**Returns:**
- (number, number): The interpolated unit vector components (x, z)

**Example:**
```lua
-- Slerp between two unit vectors
local x, z = VecUtil_Slerp(1, 0, 0, 1, 0.5)
-- Result: x≈0.707, z≈0.707 (45-degree angle)
```

### VecUtil_RotateAroundPoint(a_x, a_z, b_x, b_z, theta) {#vecutil-rotatearoundpoint}

**Status:** `stable`

**Description:**
Rotates point B around point A by a given angle in radians.

**Parameters:**
- `a_x` (number): X coordinate of rotation center (point A)
- `a_z` (number): Z coordinate of rotation center (point A)
- `b_x` (number): X coordinate of point to rotate (point B)
- `b_z` (number): Z coordinate of point to rotate (point B)
- `theta` (number): Rotation angle in radians

**Returns:**
- (number, number): The rotated point coordinates (x, z)

**Example:**
```lua
-- Rotate point (1, 0) around origin by 90 degrees (π/2 radians)
local x, z = VecUtil_RotateAroundPoint(0, 0, 1, 0, math.pi / 2)
-- Result: x≈0, z≈1
```

### VecUtil_RotateDir(dir_x, dir_z, theta) {#vecutil-rotatedir}

**Status:** `stable`

**Description:**
Rotates a direction vector by a given angle in radians.

**Parameters:**
- `dir_x` (number): X component of direction vector
- `dir_z` (number): Z component of direction vector
- `theta` (number): Rotation angle in radians

**Returns:**
- (number, number): The rotated direction vector components (x, z)

**Example:**
```lua
-- Rotate direction vector (1, 0) by 45 degrees
local x, z = VecUtil_RotateDir(1, 0, math.pi / 4)
-- Result: x≈0.707, z≈0.707
```

## Performance Considerations

VecUtil functions are optimized for:

- High-frequency pathfinding and movement calculations
- Distance checking for AI behaviors
- Collision detection on the ground plane
- Entity positioning and orientation
- Minimal memory allocation overhead

## Common Usage Patterns

### Entity Movement and Pathfinding
```lua
-- Calculate direction to target
local dir_x, dir_z = VecUtil_Sub(target_x, target_z, current_x, current_z)
local norm_x, norm_z = VecUtil_NormalizeNoNaN(dir_x, dir_z)

-- Move towards target with speed
local speed = 5
local new_x = current_x + norm_x * speed * dt
local new_z = current_z + norm_z * speed * dt
```

### Range Checking
```lua
-- Check if entity is within interaction range
local INTERACT_RANGE = 3
local INTERACT_RANGE_SQ = INTERACT_RANGE * INTERACT_RANGE

if VecUtil_DistSq(player_x, player_z, entity_x, entity_z) <= INTERACT_RANGE_SQ then
    -- Entity is in range
end
```

### Angle-Based AI Behaviors
```lua
-- Calculate angle to target for AI facing
local angle_to_target = VecUtil_GetAngleInDegrees(target_x - self_x, target_z - self_z)

-- Smooth rotation towards target
local current_angle = self:GetAngleToPoint(Vector3(target_x, 0, target_z))
local rotated_x, rotated_z = VecUtil_RotateDir(1, 0, math.rad(current_angle))
```

### Circular Movement Patterns
```lua
-- Create circular patrol pattern
local time = GetTime()
local radius = 10
local speed = 0.5
local center_x, center_z = 0, 0

local x = center_x + radius * math.cos(time * speed)
local z = center_z + radius * math.sin(time * speed)
```

## Related Modules

- [Vec3Util](./vec3util.md): 3D vector utility functions for full XYZ operations
- [Vector3](./vector3.md): Object-oriented 3D vector class
- [MathUtil](./mathutil.md): Additional mathematical utility functions
- [Constants](./constants.md): Mathematical constants like PI and RADIANS
