---
id: vector
title: Vector
sidebar_position: 2
---

# Vector

Vector is a data type representing 2D or 3D vectors in space, used for positions, directions, and physics calculations. 

## Overview

In Don't Starve Together, Vector objects are used extensively to represent:
- Positions in the world
- Directions for movement
- Velocities for physics
- Offsets for UI elements

The game primarily uses Vector3 for 3D coordinates, although most gameplay operates on a 2D plane where the Y axis represents height.

## Properties

Vector objects have the following properties:

- **x**: The x-coordinate (horizontal position)
- **y**: The y-coordinate (height, usually 0 in normal gameplay)
- **z**: The z-coordinate (equivalent to the vertical position in a top-down view)

## Creating Vectors

```lua
-- Create a new Vector
local position = Vector3(10, 0, 5)  -- x=10, y=0, z=5

-- Create a zero vector
local zeroVector = Vector3(0, 0, 0)

-- Create a vector from another vector (copying)
local copyVector = Vector3(position.x, position.y, position.z)
```

## Common Methods

### Vector3 Methods

```lua
-- Get the length (magnitude) of the vector
local length = vector:Length()

-- Get the squared length (faster than Length() when only comparing distances)
local sqrLength = vector:LengthSq()

-- Normalize a vector (make it unit length)
local normalized = vector:Normalize()

-- Get the distance between two points
local distance = vector1:Dist(vector2)

-- Get the squared distance between two points (faster)
local sqrDistance = vector1:DistSq(vector2)

-- Dot product of two vectors
local dotProduct = vector1:Dot(vector2)

-- Cross product of two vectors
local crossProduct = vector1:Cross(vector2)
```

## Arithmetic Operations

Vectors support standard arithmetic operations:

```lua
-- Addition
local sum = vector1 + vector2

-- Subtraction
local difference = vector1 - vector2

-- Multiplication by scalar
local scaled = vector * 2.5

-- Division by scalar
local reduced = vector / 2.0
```

## Common Usage Examples

### Movement and Positioning

```lua
-- Move an entity toward a target
local direction = (target_pos - current_pos):Normalize()
local new_pos = current_pos + direction * speed * dt

inst.Transform:SetPosition(new_pos.x, new_pos.y, new_pos.z)

-- Find an entity's position
local pos = inst:GetPosition()

-- Find nearby entities
local ents = TheSim:FindEntities(pos.x, pos.y, pos.z, radius)
```

### Direction and Angle Calculations

```lua
-- Get direction from one entity to another
local dir = target:GetPosition() - inst:GetPosition()
dir:Normalize()

-- Calculate angle from direction vector
local angle = math.atan2(dir.z, dir.x) * RADIANS

-- Set entity facing based on angle
inst.Transform:SetRotation(angle)
```

## Notes

- In DST, Y is generally the "up" axis, but most gameplay takes place on the X-Z plane
- The coordinate system is right-handed
- Vector calculations can be performance-intensive, so consider using squared distances when possible 