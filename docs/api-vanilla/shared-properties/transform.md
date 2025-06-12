---
id: transform
title: Transform
sidebar_position: 3
---

# Transform

Transform is a common property that manages an entity's position, rotation, and scale in 3D space. It is one of the core building blocks of every entity in Don't Starve Together.

## Overview

Every entity in Don't Starve Together requires a Transform component to exist in the game world. The Transform component provides functionality to:

- Position entities in the 3D world
- Rotate entities around their axis
- Scale entities to different sizes
- Track and update entity movement

## Adding Transform to an Entity

The Transform component is added to an entity during its creation:

```lua
local function CreateMyEntity()
    local inst = CreateEntity()
    
    -- Add the Transform component
    inst.entity:AddTransform()
    
    -- Other components...
    
    return inst
end
```

## Position Management

### Setting Position

```lua
-- Set the entity's position in the world
inst.Transform:SetPosition(x, y, z)

-- Teleport the entity (used with Physics component)
inst.Physics:Teleport(x, y, z)
```

### Getting Position

```lua
-- Get the entity's current world position
local x, y, z = inst.Transform:GetWorldPosition()

-- Create a point at the entity's position
local point = Point(inst.Transform:GetWorldPosition())

-- Create a Vector3 at the entity's position
local position = Vector3(inst.Transform:GetWorldPosition())
```

### Position Utility Functions

```lua
-- Get the squared distance between two entities
local distsq = inst:GetDistanceSqToInst(other_entity)

-- Get the squared distance to a point
local distsq = inst:GetDistanceSqToPoint(x, y, z)

-- Check if entity is near a point
local is_near = inst:IsNear(point, radius)
```

## Rotation Management

### Setting Rotation

```lua
-- Set rotation in degrees (0-360)
inst.Transform:SetRotation(degrees)

-- Rotate to face a point
local angle = inst:GetAngleToPoint(x, y, z)
inst.Transform:SetRotation(angle)
```

### Getting Rotation

```lua
-- Get current rotation in degrees
local rotation = inst.Transform:GetRotation()

-- Get rotation as a unit direction vector
local direction = TheCamera:GetRightVec()
```

### Rotation Utility Functions

```lua
-- Get angle between entity and a point
local angle = inst:GetAngleToPoint(x, y, z)

-- Get angle between two entities
local angle = inst:GetAngleToInst(other_entity)
```

## Scale Management

```lua
-- Set uniform scale
inst.Transform:SetScale(scale)

-- Set different scale for each axis
inst.Transform:SetScale(x_scale, y_scale, z_scale)

-- Get current scale
local scale = inst.Transform:GetScale()
```

## Parent-Child Relationships

Entities can be attached to other entities to create hierarchies:

```lua
-- Make child_entity follow parent_entity's transform
child_entity.Transform:SetPosition(0, 0, 0)
child_entity.entity:SetParent(parent_entity.entity)

-- Detach from parent
child_entity.entity:SetParent(nil)
```

## Common Patterns

### Following Another Entity

```lua
-- Make an entity follow another entity
local function OnUpdate(inst)
    if inst.follow_target and inst.follow_target:IsValid() then
        local x, y, z = inst.follow_target.Transform:GetWorldPosition()
        inst.Transform:SetPosition(x, y, z)
    end
end

inst:DoPeriodicTask(0, OnUpdate)
```

### Moving in a Direction

```lua
-- Move in the direction the entity is facing
local function MoveForward(inst, speed)
    local angle_rad = inst.Transform:GetRotation() * DEGREES
    local dx = math.cos(angle_rad) * speed
    local dz = -math.sin(angle_rad) * speed
    
    local x, y, z = inst.Transform:GetWorldPosition()
    inst.Transform:SetPosition(x + dx, y, z + dz)
end
```

## Performance Considerations

- Transform operations are computationally efficient but can impact performance when used extensively
- Avoid unnecessary position updates in Update or DoPeriodicTask loops
- Batch transform operations when possible
- Consider using Physics for complex movement logic

## Technical Details

Transform is implemented at the engine level and is one of the fundamental components in the game's entity system. While most functionality is exposed to Lua, some advanced features may only be accessible through C++ code.

## Example: Creating a Moving Entity

```lua
local function MoveEntity()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Movement logic
    inst.speed = 5
    
    inst:DoPeriodicTask(FRAMES, function(inst)
        local x, y, z = inst.Transform:GetWorldPosition()
        local angle_rad = inst.Transform:GetRotation() * DEGREES
        local dx = math.cos(angle_rad) * inst.speed * FRAMES
        local dz = -math.sin(angle_rad) * inst.speed * FRAMES
        
        inst.Transform:SetPosition(x + dx, y, z + dz)
    end)
    
    return inst
end

return Prefab("moving_entity", MoveEntity)
``` 