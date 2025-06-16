---
id: vector3
title: Vector3
sidebar_position: 2
last_updated: 2023-08-15
version: 619045
---
*Last Update: 2023-08-15*
# Vector3

*API Version: 619045*

Vector3 is a fundamental data type in Don't Starve Together that represents a three-dimensional vector with x, y, and z components. It's used extensively for positions, directions, velocities, and other spatial calculations in the game.

## Basic Usage

```lua
-- Create a new Vector3
local position = Vector3(10, 0, 5)

-- Create a Vector3 at origin (0,0,0)
local origin = Vector3()

-- Access components
local x = position.x
local y = position.y
local z = position.z

-- Get components as separate values
local x, y, z = position:Get()
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | Number | X-coordinate value |
| `y` | Number | Y-coordinate value (height) |
| `z` | Number | Z-coordinate value |

## Key Methods

### Vector Construction

```lua
-- Standard constructor
local vec = Vector3(x, y, z)

-- Create Vector3 from Transform position
local position = Vector3(inst.Transform:GetWorldPosition())

-- Create Vector3 from angle (in radians) and radius
local vec = Vector3FromTheta(theta, radius)
```

### Vector Operations

```lua
-- Dot product
local dot = vec1:Dot(vec2)

-- Cross product
local cross = vec1:Cross(vec2)

-- Vector length (magnitude)
local length = vec:Length()

-- Squared length (more efficient for comparison)
local lengthSq = vec:LengthSq()

-- Normalize vector (modifies original)
vec:Normalize()

-- Get normalized vector (returns new vector)
local normalized = vec:GetNormalized()

-- Get normalized vector and length in one operation
local normalized, length = vec:GetNormalizedAndLength()
```

### Distance Calculations

```lua
-- Distance between vectors
local distance = vec1:Dist(vec2)

-- Squared distance (more efficient for comparison)
local distSq = vec1:DistSq(vec2)
```

### Type Checking and Conversion

```lua
-- Check if object is a Vector3
if obj:IsVector3() then
    -- Object is a Vector3
end

-- Convert value to Vector3
local vec = ToVector3(obj, y, z)
```

> **Related functions**: When working with entities, Vector3 objects are often created from Transform positions using `Vector3(inst.Transform:GetWorldPosition())`. For movement using the [Locomotor Component](../components/locomotor.md), methods like `GoToPoint()` accept Vector3 objects directly to set destinations. User interfaces often use Vector3 for positioning UI elements with the `widgetpos` property.

## Operators

Vector3 supports the following arithmetic operators:

| Operator | Example | Description |
|----------|---------|-------------|
| + | `vec1 + vec2` | Vector addition |
| - | `vec1 - vec2` | Vector subtraction |
| * | `vec * scalar` | Scalar multiplication |
| / | `vec / scalar` | Scalar division |
| unary - | `-vec` | Vector negation |

```lua
-- Vector addition
local sum = Vector3(1, 0, 1) + Vector3(2, 0, 3) -- Results in Vector3(3, 0, 4)

-- Vector subtraction
local direction = target_pos - current_pos -- Creates direction vector

-- Scalar multiplication
local scaled = direction * 5 -- Multiply vector by 5

-- Vector negation
local opposite = -direction -- Reverse direction
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
-- Calculate direction from one point to another
local start_pos = Vector3(inst.Transform:GetWorldPosition())
local target_pos = Vector3(target.Transform:GetWorldPosition())
local direction = (target_pos - start_pos):GetNormalized()

-- Move in a direction
local new_pos = current_pos + direction * speed
inst.Transform:SetPosition(new_pos.x, new_pos.y, new_pos.z)

-- Calculate angle from direction vector (useful for rotation)
local angle = math.atan2(direction.z, direction.x)
```

### Distance Checks

```lua
-- Check if two entities are within range
local pos1 = Vector3(inst1.Transform:GetWorldPosition())
local pos2 = Vector3(inst2.Transform:GetWorldPosition())

if pos1:Dist(pos2) < max_distance then
    -- Entities are within range
end
```

### UI Positioning

```lua
-- Position UI elements using Vector3
container.widgetpos = Vector3(0, 200, 0)

-- Position slot elements in a grid
for y = 0, 2 do
    for x = 0, 2 do
        table.insert(container.widgetslotpos, Vector3(80*x-80*2/2, 80*y-80*2/2, 0))
    end
end
```

## See also

- [Transform](../shared-properties/transform.md) - For entity positions and rotations
- [Locomotor Component](../components/locomotor.md) - For movement using Vector3
- [Vector Utilities](../utils/vector.md) - Additional vector operations
- [Colour](colour.md) - For another common data type in DST
- [UserData](userdata.md) - For core data types in the game engine

## Example: Working with Vector3

```lua
-- Function to find entities within a radius
local function FindEntitiesInRadius(position, radius)
    local x, y, z = position:Get()
    return TheSim:FindEntities(x, y, z, radius, nil, {"INLIMBO"})
end

-- Function to calculate distance between entities
local function GetDistanceBetweenEntities(entity1, entity2)
    local pos1 = Vector3(entity1.Transform:GetWorldPosition())
    local pos2 = Vector3(entity2.Transform:GetWorldPosition())
    return pos1:Dist(pos2)
end

-- Function to move an entity toward a target with pathfinding
local function MoveTowardTarget(entity, target, speed)
    -- Get positions
    local current_pos = Vector3(entity.Transform:GetWorldPosition())
    local target_pos = Vector3(target.Transform:GetWorldPosition())
    
    -- Calculate direction
    local direction = target_pos - current_pos
    local distance = direction:Length()
    
    if distance > 0.1 then
        -- Normalize and scale by speed
        direction:Normalize()
        local move_distance = math.min(speed, distance)
        local new_pos = current_pos + direction * move_distance
        
        -- Move entity
        entity.Transform:SetPosition(new_pos.x, new_pos.y, new_pos.z)
    end
end

-- Function to create a circular arrangement of objects
local function CreateCircleOfObjects(center, radius, prefab, count)
    local objects = {}
    
    for i = 1, count do
        -- Calculate position on circle
        local angle = (i-1) * (2 * math.pi / count)
        local offset = Vector3FromTheta(angle, radius)
        local position = center + offset
        
        -- Spawn object
        local obj = SpawnPrefab(prefab)
        obj.Transform:SetPosition(position.x, position.y, position.z)
        table.insert(objects, obj)
    end
    
    return objects
end
```
