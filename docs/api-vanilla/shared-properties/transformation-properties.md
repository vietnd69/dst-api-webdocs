---
id: transformation-properties
title: Transformation Properties
sidebar_position: 5
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Transformation Properties

*API Version: 619045*

Transformation properties are a set of shared attributes and mechanics that define how entities are positioned, oriented, and scaled within the game world of Don't Starve Together. They form the spatial foundation for all entity interactions and visual rendering.

## Core Transformation Properties

| Property | Type | Description |
|----------|------|-------------|
| `Transform` | Component | Core component handling position, rotation, and scale |
| `AnimState` | Component | Manages visual appearance and animations |
| `position` | Vector3 | Entity's 3D coordinates in the world (x, y, z) |
| `rotation` | Number | Orientation angle in degrees (0-360) |
| `scale` | Vector3 | Size multiplier in each dimension (x, y, z) |
| `parent` | Entity | Entity this object is attached to (if any) |
| `facing` | Direction | Default facing direction (usually -Z axis) |
| `collision` | Shape | Physical collision boundary for interactions |

## Coordinate System

Don't Starve Together uses a 3D coordinate system with these characteristics:

- **X-axis**: Positive east, negative west
- **Y-axis**: Positive up, negative down (vertical)
- **Z-axis**: Positive south, negative north
- **Origin**: (0,0,0) is typically at the center of the map
- **Scale**: One unit is approximately one ground tile

```lua
-- Standard positioning example
local x, y, z = 10, 0, -5  -- 10 units east, 5 units north
inst.Transform:SetPosition(x, y, z)
```

## Position Management

Position is the most fundamental transformation property, determining where an entity exists in the world:

### Position Methods

```lua
-- Set absolute world position
inst.Transform:SetPosition(x, y, z)

-- Get current world position
local x, y, z = inst.Transform:GetWorldPosition()

-- Physics-based teleportation (if entity has Physics)
inst.Physics:Teleport(x, y, z)

-- Move relative to current position
local current_x, current_y, current_z = inst.Transform:GetWorldPosition()
inst.Transform:SetPosition(current_x + offset_x, current_y + offset_y, current_z + offset_z)
```

### Position Utilities

```lua
-- Calculate distance between entities
local dist_sq = inst:GetDistanceSqToInst(other_entity)
local dist = math.sqrt(dist_sq)

-- Calculate distance to a point
local dist_sq = inst:GetDistanceSqToPoint(x, y, z)

-- Check if entity is near a point
local is_near = inst:IsNear(Point(x, y, z), radius)
```

## Rotation Management

Rotation defines which direction an entity is facing:

### Rotation Methods

```lua
-- Set rotation angle (in degrees, 0-360)
inst.Transform:SetRotation(angle)

-- Get current rotation angle
local angle = inst.Transform:GetRotation()

-- Face a specific point
local target_x, target_y, target_z = target.Transform:GetWorldPosition()
local current_x, current_y, current_z = inst.Transform:GetWorldPosition()
local dx, dz = target_x - current_x, target_z - current_z
local angle = math.atan2(-dz, dx) * RADIANS
inst.Transform:SetRotation(angle)

-- Rotate incrementally
local current_angle = inst.Transform:GetRotation()
inst.Transform:SetRotation(current_angle + delta_angle)
```

### Rotation Utilities

```lua
-- Get angle to a point
local angle = inst:GetAngleToPoint(x, y, z)

-- Get angle to another entity
local angle = inst:GetAngleToInst(other_entity)

-- Get forward vector based on rotation
local angle_rad = inst.Transform:GetRotation() * DEGREES
local forward_x = math.cos(angle_rad)
local forward_z = -math.sin(angle_rad)
```

## Scale Management

Scale affects the visual and sometimes physical size of entities:

### Scale Methods

```lua
-- Set uniform scale (same in all dimensions)
inst.Transform:SetScale(scale)

-- Set non-uniform scale (different for each axis)
inst.Transform:SetScale(x_scale, y_scale, z_scale)

-- Get current scale
local scale = inst.Transform:GetScale()

-- Scale gradually (grow or shrink over time)
inst:DoTaskInTime(0, function(inst)
    inst.Transform:SetScale(0.1, 0.1, 0.1) -- Start small
    
    inst:DoPeriodicTask(0.05, function(inst)
        local current_scale = inst.Transform:GetScale()
        if current_scale < 1.0 then
            inst.Transform:SetScale(current_scale + 0.05)
        end
    end, 0, 18) -- Grow over time
end)
```

## Hierarchy and Parenting

Entities can be attached to create hierarchical relationships:

### Parenting Methods

```lua
-- Attach child to parent
child_entity.entity:SetParent(parent_entity.entity)

-- Detach from parent
child_entity.entity:SetParent(nil)

-- Get parent entity
local parent = child_entity.entity:GetParent()

-- Set local position relative to parent
child_entity.Transform:SetPosition(local_x, local_y, local_z)
```

### Hierarchical Transformations

When entities are parented:
- Child's world position = Parent's position + Child's local position
- Child inherits parent's rotation and scale
- Moving the parent also moves all children
- Removing the parent maintains children's world positions

## Animation Integration

Transformations work closely with the animation system:

```lua
-- Set up animation basics
inst.AnimState:SetBank("character_bank")
inst.AnimState:SetBuild("character_build")
inst.AnimState:PlayAnimation("idle")

-- Override specific symbols with transformed versions
inst.AnimState:OverrideSymbol("swap_object", "swap_hammer", "swap_hammer")

-- Scale animation
inst.AnimState:SetScale(1.2, 1.2)

-- Flip animation horizontally
inst.AnimState:SetScale(-1, 1)
```

## Transformation Events

Several events are triggered by transformation changes:

- `onremove` - When entity is removed from the world
- `onbuilt` - When entity is first built/placed
- `ms_positiondirty` - When position has been changed
- `transform_changed` - Custom event some entities use when transformed
- `animover` - When an animation completes

## Common Transformation Patterns

### Movement and Pathfinding

```lua
-- Basic locomotor movement
inst.components.locomotor:GoToPoint(destination)

-- Follow target
local function UpdateFollowing(inst)
    if inst.follow_target and inst.follow_target:IsValid() then
        local target_x, target_y, target_z = inst.follow_target.Transform:GetWorldPosition()
        local my_x, my_y, my_z = inst.Transform:GetWorldPosition()
        
        local dist_sq = inst:GetDistanceSqToInst(inst.follow_target)
        if dist_sq > min_follow_dist * min_follow_dist then
            inst.components.locomotor:GoToPoint(Point(target_x, target_y, target_z))
        else
            inst.components.locomotor:Stop()
        end
    end
end

inst:DoPeriodicTask(0.5, UpdateFollowing)
```

### Orbiting Behavior

```lua
-- Make entity orbit around a point
local function UpdateOrbit(inst)
    local angle = (inst.orbit_angle or 0) + inst.orbit_speed
    inst.orbit_angle = angle
    
    local orbit_x = inst.orbit_center_x + math.cos(angle * DEGREES) * inst.orbit_radius
    local orbit_z = inst.orbit_center_z + math.sin(angle * DEGREES) * inst.orbit_radius
    
    inst.Transform:SetPosition(orbit_x, inst.orbit_center_y, orbit_z)
end

inst.orbit_center_x, inst.orbit_center_y, inst.orbit_center_z = center_entity.Transform:GetWorldPosition()
inst.orbit_radius = 5
inst.orbit_speed = 2
inst.orbit_angle = 0

inst:DoPeriodicTask(FRAMES, UpdateOrbit)
```

### Visual Effects

```lua
-- Pulsing scale effect
local function PulseScale(inst)
    local s = 1 + 0.1 * math.sin(GetTime() * 3)
    inst.Transform:SetScale(s, s, s)
end

inst:DoPeriodicTask(FRAMES, PulseScale)

-- Spin effect
local function Spin(inst)
    local current_angle = inst.Transform:GetRotation()
    inst.Transform:SetRotation(current_angle + 2)
end

inst:DoPeriodicTask(FRAMES, Spin)
```

## Transformation-Related Components

Several components interact with transformation properties:

| Component | Key Transformation Interactions |
|-----------|--------------------------------|
| `Transform` | Core component for all spatial properties |
| `AnimState` | Visual appearance and animations |
| `Locomotor` | Movement with pathfinding and collision avoidance |
| `Physics` | Physical collisions and forces |
| `Follower` | For entities that follow other entities |
| `Knownlocations` | Tracking important locations (home, etc.) |
| `Walkableplatform` | For surfaces that can be walked on |
| `Grouplocation` | Group movement behaviors |

## Special Transformation Mechanics

### Entity Spawning

```lua
-- Spawn entity at a specific position
local function SpawnAtPosition(prefab, x, y, z)
    local inst = SpawnPrefab(prefab)
    if inst then
        inst.Transform:SetPosition(x, y, z)
    end
    return inst
end

-- Spawn entity near another entity
local function SpawnNearEntity(prefab, target, radius)
    local x, y, z = target.Transform:GetWorldPosition()
    
    -- Find random point in circle
    local angle = math.random() * 2 * PI
    local offset_x = math.cos(angle) * radius
    local offset_z = math.sin(angle) * radius
    
    return SpawnAtPosition(prefab, x + offset_x, y, z + offset_z)
end
```

### Camera Transformation

```lua
-- Focus camera on entity
TheCamera:SetTarget(entity)

-- Set custom camera position
TheCamera:SetCustomLocation(Vector3(x, y, z))

-- Pan camera
local function PanCamera(start_pos, end_pos, duration)
    local start_time = GetTime()
    local end_time = start_time + duration
    
    local function UpdateCameraPos()
        local current_time = GetTime()
        if current_time >= end_time then
            TheCamera:SetCustomLocation(end_pos)
            return true
        end
        
        local t = (current_time - start_time) / duration
        local smooth_t = t * t * (3 - 2 * t)  -- Smoothstep interpolation
        local current_pos = LerpVector3(start_pos, end_pos, smooth_t)
        
        TheCamera:SetCustomLocation(current_pos)
        return false
    end
    
    StartThread(function()
        while not UpdateCameraPos() do
            Sleep(FRAMES)
        end
    end)
end
```

### Local vs. World Coordinates

```lua
-- Convert local to world coordinates (for parented entities)
function LocalToWorldPosition(parent, local_x, local_y, local_z)
    local parent_x, parent_y, parent_z = parent.Transform:GetWorldPosition()
    local angle_rad = parent.Transform:GetRotation() * DEGREES
    local world_x = parent_x + local_x * math.cos(angle_rad) - local_z * math.sin(angle_rad)
    local world_z = parent_z + local_x * math.sin(angle_rad) + local_z * math.cos(angle_rad)
    return world_x, parent_y + local_y, world_z
end
```

## Performance Considerations

- **Minimize Frequent Updates**: Avoid updating transformation properties every frame if possible
- **Batch Transformations**: Combine position and rotation changes when appropriate
- **Use Appropriate Techniques**: Choose the right transformation approach for the task
  - Use `Transform` for visual positioning
  - Use `Physics:Teleport()` for entities with physics
  - Use `parent-child` relationships for grouped movements
- **Limit Scale Operations**: Scale changes are more expensive than position changes
- **Consider Animation Cost**: Complex animation overrides can impact performance

## See also

- [Transform](transform.md) - Detailed documentation of the Transform component
- [AnimState](../core/animstate-system.md) - For visual transformation integration
- [Physics](../core/physics.md) - For physics-based transformations
- [Position Management](../core/entity-system.md) - For more about entity positioning
- [Entity Spawning](../examples/snippets/entity-spawning.md) - For entity creation and placement
- [Locomotor](../components/locomotor.md) - For entity movement with pathfinding
