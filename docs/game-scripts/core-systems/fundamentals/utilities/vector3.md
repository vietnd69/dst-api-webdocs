---
id: vector3
title: Vector3
description: Object-oriented 3D vector class with operator overloading and advanced vector operations
sidebar_position: 4
slug: game-scripts/core-systems/vector3
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Vector3

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `Vector3` class provides an object-oriented interface for 3D vector operations with full operator overloading support. It offers a convenient and intuitive way to work with 3D coordinates, directions, and mathematical operations. The class includes advanced features like cross products, normalization, and distance calculations while maintaining a clean, mathematical syntax through operator overloading.

**Alias:** `Point` - The `Point` alias is available for semantic clarity when representing positions rather than directions.

## Usage Example

```lua
-- Create vectors
local pos1 = Vector3(1, 2, 3)
local pos2 = Vector3(4, 5, 6)

-- Use operators for vector math
local sum = pos1 + pos2          -- Vector3(5, 7, 9)
local diff = pos2 - pos1         -- Vector3(3, 3, 3)
local scaled = pos1 * 2          -- Vector3(2, 4, 6)

-- Calculate distance and direction
local distance = pos1:Dist(pos2)
local direction = (pos2 - pos1):GetNormalized()

-- Use as Point alias for clarity
local spawn_point = Point(0, 0, 0)
local player_pos = Point(10, 0, 5)
```

## Constructor

### Vector3(x, y, z) {#vector3-constructor}

**Status:** `stable`

**Description:**
Creates a new Vector3 instance with the specified coordinates.

**Parameters:**
- `x` (number, optional): X coordinate (default: 0)
- `y` (number, optional): Y coordinate (default: 0)
- `z` (number, optional): Z coordinate (default: 0)

**Returns:**
- (Vector3): New Vector3 instance

**Example:**
```lua
local v1 = Vector3()              -- Vector3(0, 0, 0)
local v2 = Vector3(1, 2, 3)       -- Vector3(1, 2, 3)
local v3 = Vector3(5)             -- Vector3(5, 0, 0)

-- Using Point alias
local spawn = Point(0, 0, 0)
local target = Point(10, 0, 5)
```

## Properties

### x, y, z {#vector3-properties}

**Status:** `stable`

**Description:**
Direct access to the vector components.

**Type:** `number`

**Example:**
```lua
local vec = Vector3(1, 2, 3)
print(vec.x)  -- 1
print(vec.y)  -- 2
print(vec.z)  -- 3

-- Modify components
vec.x = 10
vec.y = 20
vec.z = 30
```

## Operators

### Vector3:__add(rhs) {#vector3-add-operator}

**Status:** `stable`

**Description:**
Adds two vectors component-wise using the `+` operator.

**Parameters:**
- `rhs` (Vector3): Right-hand side vector

**Returns:**
- (Vector3): Sum of the two vectors

**Example:**
```lua
local v1 = Vector3(1, 2, 3)
local v2 = Vector3(4, 5, 6)
local result = v1 + v2  -- Vector3(5, 7, 9)
```

### Vector3:__sub(rhs) {#vector3-sub-operator}

**Status:** `stable`

**Description:**
Subtracts the right vector from the left vector using the `-` operator.

**Parameters:**
- `rhs` (Vector3): Right-hand side vector

**Returns:**
- (Vector3): Difference of the two vectors

**Example:**
```lua
local v1 = Vector3(5, 7, 9)
local v2 = Vector3(1, 2, 3)
local result = v1 - v2  -- Vector3(4, 5, 6)
```

### Vector3:__mul(rhs) {#vector3-mul-operator}

**Status:** `stable`

**Description:**
Scales a vector by a scalar value using the `*` operator.

**Parameters:**
- `rhs` (number): Scalar multiplier

**Returns:**
- (Vector3): Scaled vector

**Example:**
```lua
local v = Vector3(1, 2, 3)
local result = v * 2.5  -- Vector3(2.5, 5, 7.5)
```

### Vector3:__div(rhs) {#vector3-div-operator}

**Status:** `stable`

**Description:**
Divides a vector by a scalar value using the `/` operator.

**Parameters:**
- `rhs` (number): Scalar divisor

**Returns:**
- (Vector3): Divided vector

**Example:**
```lua
local v = Vector3(10, 20, 30)
local result = v / 2  -- Vector3(5, 10, 15)
```

### Vector3:__unm() {#vector3-unm-operator}

**Status:** `stable`

**Description:**
Negates a vector using the unary `-` operator.

**Returns:**
- (Vector3): Negated vector

**Example:**
```lua
local v = Vector3(1, -2, 3)
local result = -v  -- Vector3(-1, 2, -3)
```

### Vector3:__eq(rhs) {#vector3-eq-operator}

**Status:** `stable`

**Description:**
Compares two vectors for equality using the `==` operator.

**Parameters:**
- `rhs` (Vector3): Right-hand side vector

**Returns:**
- (boolean): True if vectors are equal

**Example:**
```lua
local v1 = Vector3(1, 2, 3)
local v2 = Vector3(1, 2, 3)
local v3 = Vector3(1, 2, 4)

print(v1 == v2)  -- true
print(v1 == v3)  -- false
```

### Vector3:__tostring() {#vector3-tostring-operator}

**Status:** `stable`

**Description:**
Converts vector to string representation for debugging and display.

**Returns:**
- (string): Formatted string representation

**Example:**
```lua
local v = Vector3(1.234, 2.567, 3.890)
print(tostring(v))  -- "(1.23, 2.57, 3.89)"
print(v)            -- Same as above
```

## Methods

### Vector3:Dot(rhs) {#vector3-dot}

**Status:** `stable`

**Description:**
Calculates the dot product of two vectors. Useful for determining angles between vectors and projection calculations.

**Parameters:**
- `rhs` (Vector3): Right-hand side vector

**Returns:**
- (number): Dot product result

**Example:**
```lua
local v1 = Vector3(1, 0, 0)
local v2 = Vector3(0, 1, 0)
local dot = v1:Dot(v2)  -- 0 (perpendicular vectors)

local v3 = Vector3(1, 2, 3)
local v4 = Vector3(4, 5, 6)
local dot2 = v3:Dot(v4)  -- 32 (1*4 + 2*5 + 3*6)
```

### Vector3:Cross(rhs) {#vector3-cross}

**Status:** `stable`

**Description:**
Calculates the cross product of two vectors. The result is a vector perpendicular to both input vectors.

**Parameters:**
- `rhs` (Vector3): Right-hand side vector

**Returns:**
- (Vector3): Cross product result vector

**Example:**
```lua
local v1 = Vector3(1, 0, 0)
local v2 = Vector3(0, 1, 0)
local cross = v1:Cross(v2)  -- Vector3(0, 0, 1) - points up
```

### Vector3:DistSq(other) {#vector3-distsq}

**Status:** `stable`

**Description:**
Calculates the squared distance between two vectors. More efficient than calculating actual distance when comparing distances.

**Parameters:**
- `other` (Vector3): Other vector to measure distance to

**Returns:**
- (number): Squared distance

**Example:**
```lua
local pos1 = Vector3(0, 0, 0)
local pos2 = Vector3(3, 4, 0)
local distSq = pos1:DistSq(pos2)  -- 25 (3² + 4² = 25)
```

### Vector3:Dist(other) {#vector3-dist}

**Status:** `stable`

**Description:**
Calculates the actual distance between two vectors.

**Parameters:**
- `other` (Vector3): Other vector to measure distance to

**Returns:**
- (number): Distance

**Example:**
```lua
local pos1 = Vector3(0, 0, 0)
local pos2 = Vector3(3, 4, 0)
local distance = pos1:Dist(pos2)  -- 5
```

### Vector3:LengthSq() {#vector3-lengthsq}

**Status:** `stable`

**Description:**
Calculates the squared length (magnitude) of the vector. More efficient than calculating actual length for comparisons.

**Returns:**
- (number): Squared length

**Example:**
```lua
local v = Vector3(3, 4, 5)
local lengthSq = v:LengthSq()  -- 50 (3² + 4² + 5²)
```

### Vector3:Length() {#vector3-length}

**Status:** `stable`

**Description:**
Calculates the length (magnitude) of the vector.

**Returns:**
- (number): Length

**Example:**
```lua
local v = Vector3(3, 4, 5)
local length = v:Length()  -- 7.071... (√50)
```

### Vector3:Normalize() {#vector3-normalize}

**Status:** `stable`

**Description:**
Normalizes the vector to unit length in-place. Modifies the original vector and returns it for method chaining.

**Returns:**
- (Vector3): Self (for method chaining)

**Example:**
```lua
local v = Vector3(3, 4, 5)
v:Normalize()  -- v is now a unit vector
print(v:Length())  -- 1.0

-- Method chaining
local dir = Vector3(10, 0, 10):Normalize()
```

### Vector3:GetNormalized() {#vector3-getnormalized}

**Status:** `stable`

**Description:**
Returns a new normalized vector without modifying the original.

**Returns:**
- (Vector3): New normalized vector

**Example:**
```lua
local v = Vector3(3, 4, 5)
local normalized = v:GetNormalized()
-- v is unchanged, normalized is the unit vector
print(v:Length())          -- 7.071...
print(normalized:Length()) -- 1.0
```

### Vector3:GetNormalizedAndLength() {#vector3-getnormalizedandlength}

**Status:** `stable`

**Description:**
Returns both a normalized vector and the original length. More efficient than calling both methods separately.

**Returns:**
- (Vector3, number): Normalized vector and original length

**Example:**
```lua
local v = Vector3(6, 8, 0)
local normalized, length = v:GetNormalizedAndLength()
-- normalized = Vector3(0.6, 0.8, 0), length = 10
```

### Vector3:Get() {#vector3-get}

**Status:** `stable`

**Description:**
Returns the vector components as separate values.

**Returns:**
- (number, number, number): X, Y, Z components

**Example:**
```lua
local v = Vector3(1, 2, 3)
local x, y, z = v:Get()
-- x=1, y=2, z=3
```

### Vector3:IsVector3() {#vector3-isvector3}

**Status:** `stable`

**Description:**
Returns true to identify this object as a Vector3. Used for type checking.

**Returns:**
- (boolean): Always returns true

**Example:**
```lua
local v = Vector3(1, 2, 3)
if v:IsVector3() then
    print("This is a Vector3")
end
```

## Utility Functions

### ToVector3(obj, y, z) {#tovector3}

**Status:** `stable`

**Description:**
Converts various input types to a Vector3 object. Handles nil values, existing Vector3 objects, tables, and individual components.

**Parameters:**
- `obj` (Vector3|table|number|nil): First input (Vector3, table, or X component)
- `y` (number, optional): Y component (if obj is a number)
- `z` (number, optional): Z component (if obj is a number)

**Returns:**
- (Vector3|nil): Converted Vector3 or nil if input was nil

**Example:**
```lua
-- From existing Vector3 (returns same object)
local v1 = Vector3(1, 2, 3)
local v2 = ToVector3(v1)  -- v2 is the same as v1

-- From table
local v3 = ToVector3({4, 5, 6})  -- Vector3(4, 5, 6)

-- From individual components
local v4 = ToVector3(7, 8, 9)    -- Vector3(7, 8, 9)

-- Nil input
local v5 = ToVector3(nil)        -- nil
```

### Vector3FromTheta(theta, radius) {#vector3fromtheta}

**Status:** `stable`

**Description:**
Creates a Vector3 from an angle (theta) and optional radius. Useful for creating direction vectors or circular positioning.

**Parameters:**
- `theta` (number): Angle in radians
- `radius` (number, optional): Distance from origin (default: 1)

**Returns:**
- (Vector3): Vector pointing in the specified direction

**Example:**
```lua
-- Unit vector pointing right (0 radians)
local right = Vector3FromTheta(0)  -- Vector3(1, 0, 0)

-- Unit vector pointing forward (-π/2 radians)
local forward = Vector3FromTheta(-math.pi / 2)  -- Vector3(0, 0, -1)

-- Vector at distance 5 pointing at 45 degrees
local diagonal = Vector3FromTheta(math.pi / 4, 5)
```

## Common Usage Patterns

### Distance-Based Logic
```lua
-- Check if player is within interaction range
local player_pos = Vector3(player.Transform:GetWorldPosition())
local item_pos = Vector3(item.Transform:GetWorldPosition())

local INTERACT_RANGE = 3
if player_pos:Dist(item_pos) <= INTERACT_RANGE then
    -- Player can interact with item
end

-- Optimized version using squared distance
local INTERACT_RANGE_SQ = INTERACT_RANGE * INTERACT_RANGE
if player_pos:DistSq(item_pos) <= INTERACT_RANGE_SQ then
    -- Player can interact with item (more efficient)
end
```

### Direction and Movement
```lua
-- Calculate direction from current position to target
local current_pos = Vector3(inst.Transform:GetWorldPosition())
local target_pos = Vector3(target.Transform:GetWorldPosition())

local direction = (target_pos - current_pos):GetNormalized()
local speed = 5

-- Move towards target
local new_pos = current_pos + direction * speed * dt
inst.Transform:SetPosition(new_pos:Get())
```

### Circular and Orbital Movement
```lua
-- Create circular movement pattern
local center = Vector3(0, 0, 0)
local radius = 10
local time = GetTime()
local speed = 2

local offset = Vector3FromTheta(time * speed, radius)
local position = center + offset
inst.Transform:SetPosition(position:Get())
```

### Vector Math for Physics
```lua
-- Calculate reflection vector (like bouncing ball)
local velocity = Vector3(5, 0, 3)
local surface_normal = Vector3(0, 1, 0)  -- Upward normal

-- Reflect velocity off surface
local reflected = velocity - surface_normal * (2 * velocity:Dot(surface_normal))
```

### Interpolation and Animation
```lua
-- Smooth movement between two points
local start_pos = Vector3(0, 0, 0)
local end_pos = Vector3(10, 5, 8)
local progress = 0.3  -- 30% of the way

local current_pos = start_pos + (end_pos - start_pos) * progress
-- Or using operator overloading for clarity:
local current_pos2 = start_pos * (1 - progress) + end_pos * progress
```

## Performance Considerations

While Vector3 provides convenient object-oriented operations, consider these performance aspects:

- **Object Creation**: Each operation creates new Vector3 objects. For high-frequency calculations, consider using [Vec3Util](./vec3util.md) functions
- **Memory Allocation**: Avoid creating temporary vectors in hot loops when possible
- **Method Chaining**: While convenient, chaining can create intermediate objects

**High-Performance Alternative:**
```lua
-- Instead of this (creates temporary objects):
local result = (pos1 + pos2):GetNormalized() * speed

-- Consider this for hot paths:
local x, y, z = Vec3Util_Add(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z)
local norm_x, norm_y, norm_z = Vec3Util_Normalize(x, y, z)
local final_x, final_y, final_z = Vec3Util_Scale(norm_x, norm_y, norm_z, speed)
```

## Related Modules

- [Vec3Util](./vec3util.md): High-performance 3D vector utility functions
- [VecUtil](./vecutil.md): 2D vector utility functions for XZ plane operations
- [Class](./class.md): Base class system used by Vector3
- [MathUtil](./mathutil.md): Additional mathematical utility functions
