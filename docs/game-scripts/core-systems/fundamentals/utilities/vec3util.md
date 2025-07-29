---
id: vec3util
title: Vec3Util
description: Utility functions for 3D vector operations without object instantiation
sidebar_position: 6

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Vec3Util

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `vec3util.lua` module provides high-performance utility functions for 3D vector operations. These functions operate directly on coordinate parameters (x, y, z) without requiring object instantiation, making them ideal for performance-critical calculations where object creation overhead should be avoided.

## Usage Example

```lua
-- Basic vector operations
local x1, y1, z1 = 1, 2, 3
local x2, y2, z2 = 4, 5, 6

-- Add two vectors
local result_x, result_y, result_z = Vec3Util_Add(x1, y1, z1, x2, y2, z2)
-- result: 5, 7, 9

-- Calculate distance between points
local distance = Vec3Util_Dist(x1, y1, z1, x2, y2, z2)
```

## Functions

### Vec3Util_Add(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z) {#vec3util-add}

**Status:** `stable`

**Description:**
Adds two 3D vectors component-wise.

**Parameters:**
- `p1_x` (number): X component of first vector
- `p1_y` (number): Y component of first vector 
- `p1_z` (number): Z component of first vector
- `p2_x` (number): X component of second vector
- `p2_y` (number): Y component of second vector
- `p2_z` (number): Z component of second vector

**Returns:**
- (number, number, number): The sum vector components (x, y, z)

**Example:**
```lua
local x, y, z = Vec3Util_Add(1, 2, 3, 4, 5, 6)
-- Result: x=5, y=7, z=9
```

### Vec3Util_Sub(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z) {#vec3util-sub}

**Status:** `stable`

**Description:**
Subtracts the second 3D vector from the first vector component-wise.

**Parameters:**
- `p1_x` (number): X component of first vector
- `p1_y` (number): Y component of first vector
- `p1_z` (number): Z component of first vector
- `p2_x` (number): X component of second vector
- `p2_y` (number): Y component of second vector
- `p2_z` (number): Z component of second vector

**Returns:**
- (number, number, number): The difference vector components (x, y, z)

**Example:**
```lua
local x, y, z = Vec3Util_Sub(5, 7, 9, 1, 2, 3)
-- Result: x=4, y=5, z=6
```

### Vec3Util_Scale(p1_x, p1_y, p1_z, scale) {#vec3util-scale}

**Status:** `stable`

**Description:**
Scales a 3D vector by a scalar value.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_y` (number): Y component of vector
- `p1_z` (number): Z component of vector
- `scale` (number): Scalar multiplier

**Returns:**
- (number, number, number): The scaled vector components (x, y, z)

**Example:**
```lua
local x, y, z = Vec3Util_Scale(1, 2, 3, 2.5)
-- Result: x=2.5, y=5, z=7.5
```

### Vec3Util_LengthSq(p1_x, p1_y, p1_z) {#vec3util-lengthsq}

**Status:** `stable`

**Description:**
Calculates the squared length (magnitude) of a 3D vector. This is more efficient than calculating the actual length when comparing distances or when the exact length is not needed.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_y` (number): Y component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number): The squared length of the vector

**Example:**
```lua
local lengthSq = Vec3Util_LengthSq(3, 4, 5)
-- Result: 50 (3² + 4² + 5² = 9 + 16 + 25 = 50)
```

### Vec3Util_Length(p1_x, p1_y, p1_z) {#vec3util-length}

**Status:** `stable`

**Description:**
Calculates the length (magnitude) of a 3D vector.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_y` (number): Y component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number): The length of the vector

**Example:**
```lua
local length = Vec3Util_Length(3, 4, 5)
-- Result: 7.071... (√50)
```

### Vec3Util_DistSq(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z) {#vec3util-distsq}

**Status:** `stable`

**Description:**
Calculates the squared distance between two 3D points. More efficient than calculating actual distance for comparison purposes.

**Parameters:**
- `p1_x` (number): X coordinate of first point
- `p1_y` (number): Y coordinate of first point
- `p1_z` (number): Z coordinate of first point
- `p2_x` (number): X coordinate of second point
- `p2_y` (number): Y coordinate of second point
- `p2_z` (number): Z coordinate of second point

**Returns:**
- (number): The squared distance between the points

**Example:**
```lua
local distSq = Vec3Util_DistSq(0, 0, 0, 3, 4, 5)
-- Result: 50 (same as length squared in this case)
```

### Vec3Util_Dist(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z) {#vec3util-dist}

**Status:** `stable`

**Description:**
Calculates the actual distance between two 3D points.

**Parameters:**
- `p1_x` (number): X coordinate of first point
- `p1_y` (number): Y coordinate of first point
- `p1_z` (number): Z coordinate of first point
- `p2_x` (number): X coordinate of second point
- `p2_y` (number): Y coordinate of second point
- `p2_z` (number): Z coordinate of second point

**Returns:**
- (number): The distance between the points

**Example:**
```lua
local distance = Vec3Util_Dist(0, 0, 0, 3, 4, 5)
-- Result: 7.071... (√50)
```

### Vec3Util_Dot(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z) {#vec3util-dot}

**Status:** `stable`

**Description:**
Calculates the dot product of two 3D vectors. The dot product is useful for determining the angle between vectors and for projection calculations.

**Parameters:**
- `p1_x` (number): X component of first vector
- `p1_y` (number): Y component of first vector
- `p1_z` (number): Z component of first vector
- `p2_x` (number): X component of second vector
- `p2_y` (number): Y component of second vector
- `p2_z` (number): Z component of second vector

**Returns:**
- (number): The dot product of the two vectors

**Example:**
```lua
local dot = Vec3Util_Dot(1, 0, 0, 0, 1, 0)
-- Result: 0 (perpendicular vectors)

local dot2 = Vec3Util_Dot(1, 2, 3, 4, 5, 6)
-- Result: 32 (1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32)
```

### Vec3Util_Lerp(p1_x, p1_y, p1_z, p2_x, p2_y, p2_z, percent) {#vec3util-lerp}

**Status:** `stable`

**Description:**
Performs linear interpolation between two 3D vectors.

**Parameters:**
- `p1_x` (number): X component of start vector
- `p1_y` (number): Y component of start vector
- `p1_z` (number): Z component of start vector
- `p2_x` (number): X component of end vector
- `p2_y` (number): Y component of end vector
- `p2_z` (number): Z component of end vector
- `percent` (number): Interpolation factor (0.0 to 1.0)

**Returns:**
- (number, number, number): The interpolated vector components (x, y, z)

**Example:**
```lua
-- Interpolate halfway between two points
local x, y, z = Vec3Util_Lerp(0, 0, 0, 10, 20, 30, 0.5)
-- Result: x=5, y=10, z=15

-- Get the start point (percent = 0)
local x2, y2, z2 = Vec3Util_Lerp(0, 0, 0, 10, 20, 30, 0.0)
-- Result: x2=0, y2=0, z2=0
```

### Vec3Util_Normalize(p1_x, p1_y, p1_z) {#vec3util-normalize}

**Status:** `stable`

**Description:**
Normalizes a 3D vector to unit length (length = 1). The resulting vector points in the same direction but has a magnitude of 1.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_y` (number): Y component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number, number, number): The normalized vector components (x, y, z)

**Example:**
```lua
local x, y, z = Vec3Util_Normalize(3, 4, 5)
-- Result: x≈0.424, y≈0.566, z≈0.707 (unit vector in same direction)
```

### Vec3Util_NormalAndLength(p1_x, p1_y, p1_z) {#vec3util-normalandlength}

**Status:** `stable`

**Description:**
Normalizes a 3D vector and returns both the normalized vector and its original length. This is more efficient than calling normalize and length separately.

**Parameters:**
- `p1_x` (number): X component of vector
- `p1_y` (number): Y component of vector
- `p1_z` (number): Z component of vector

**Returns:**
- (number, number, number, number): The normalized vector components (x, y, z) and the original length

**Example:**
```lua
local norm_x, norm_y, norm_z, length = Vec3Util_NormalAndLength(3, 4, 5)
-- Result: norm_x≈0.424, norm_y≈0.566, norm_z≈0.707, length≈7.071
```

## Performance Considerations

These utility functions are designed for high-performance scenarios where:

- Object creation overhead needs to be minimized
- Large numbers of vector calculations are performed
- Memory allocation should be reduced
- Function call overhead should be minimal

For general-purpose vector operations where performance is less critical, consider using the [Vector3 class](./vector3.md) which provides a more object-oriented interface.

## Common Usage Patterns

### Distance Checking
```lua
-- Check if two points are within a certain distance
local maxDistSq = MAX_RANGE * MAX_RANGE
if Vec3Util_DistSq(x1, y1, z1, x2, y2, z2) <= maxDistSq then
    -- Points are within range
end
```

### Direction Calculation
```lua
-- Calculate direction from point A to point B
local dir_x, dir_y, dir_z = Vec3Util_Sub(target_x, target_y, target_z, start_x, start_y, start_z)
local norm_x, norm_y, norm_z = Vec3Util_Normalize(dir_x, dir_y, dir_z)
```

### Interpolation Animation
```lua
-- Smooth movement between two positions
local current_x, current_y, current_z = Vec3Util_Lerp(start_x, start_y, start_z, end_x, end_y, end_z, progress)
```

## Related Modules

- [VecUtil](./vecutil.md): 2D vector utility functions for XZ plane operations
- [Vector3](./vector3.md): Object-oriented 3D vector class with operator overloading
- [MathUtil](./mathutil.md): Additional mathematical utility functions
