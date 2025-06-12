---
id: vector
title: Vector Utilities
sidebar_position: 2
---

# Vector Utilities

Vector manipulation and mathematics utilities are essential for handling positions, directions, and spatial calculations in Don't Starve Together mods.

## Vector3 Class

The `Vector3` class represents a three-dimensional vector with x, y, and z components.

### Basic Usage

```lua
-- Create a new Vector3
local pos = Vector3(x, y, z)

-- Create a Vector3 at origin (0,0,0)
local origin = Vector3()

-- Access components
local x = pos.x
local y = pos.y
local z = pos.z
```

### Constructors

```lua
-- Standard constructor
local vec = Vector3(x, y, z)

-- Creating from angle (in radians)
local vec = Vector3FromTheta(theta, radius)
```

### Operators

Vector3 supports the following operators:

| Operator | Usage | Description |
|----------|-------|-------------|
| + | `vec1 + vec2` | Vector addition |
| - | `vec1 - vec2` | Vector subtraction |
| * | `vec * scalar` | Scalar multiplication |
| / | `vec / scalar` | Scalar division |
| unary - | `-vec` | Vector negation |

### Methods

#### Vector Operations

```lua
-- Dot product
local dot = vec1:Dot(vec2)

-- Cross product
local cross = vec1:Cross(vec2)

-- Distance between vectors
local distance = vec1:Dist(vec2)

-- Squared distance (more efficient)
local distSq = vec1:DistSq(vec2)

-- Vector length
local length = vec:Length()

-- Squared length (more efficient)
local lengthSq = vec:LengthSq()

-- Normalize vector (modifies original)
vec:Normalize()

-- Get normalized vector (returns new vector)
local norm = vec:GetNormalized()

-- Get normalized vector and length
local norm, length = vec:GetNormalizedAndLength()

-- Get components as separate values
local x, y, z = vec:Get()
```

### Helper Functions

```lua
-- Convert value to Vector3
local vec = ToVector3(obj, y, z)

-- Create Vector3 from angle and radius
local vec = Vector3FromTheta(theta, radius)

-- Check if an object is a Vector3
if obj:IsVector3() then
    -- It's a Vector3
end
```

## Common Use Cases

### Entity Positioning

```lua
-- Get entity position as Vector3
local pos = Vector3(inst.Transform:GetWorldPosition())

-- Move entity to position
inst.Transform:SetPosition(target_pos.x, target_pos.y, target_pos.z)
```

### Direction and Movement

```lua
-- Get direction vector between two points
local dir = (target_pos - start_pos):GetNormalized()

-- Move in a direction
local new_pos = current_pos + dir * speed

-- Get angle from direction vector
local angle = math.atan2(dir.z, dir.x)
```

### Distance Checks

```lua
-- Check if entity is within range
local pos1 = Vector3(inst1.Transform:GetWorldPosition())
local pos2 = Vector3(inst2.Transform:GetWorldPosition())

if pos1:Dist(pos2) < max_distance then
    -- Entities are within range
end
``` 