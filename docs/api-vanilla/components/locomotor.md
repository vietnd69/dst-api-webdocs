---
id: locomotor
title: Locomotor
sidebar_position: 20
---

# Locomotor Component

The Locomotor component manages entity movement, including walking, running, and navigation between points. It handles movement speed, pathfinding, and movement state.

## Basic Usage

```lua
-- Add a locomotor component to an entity
local entity = CreateEntity()
entity:AddComponent("locomotor")

-- Configure the locomotor component
local locomotor = entity.components.locomotor
locomotor:SetSlowMultiplier(0.6)
locomotor:SetTriggersCreep(true)
locomotor:SetFasterOnRoad(true)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `walkspeed` | Number | Base walking speed |
| `runspeed` | Number | Base running speed |
| `fasteronroad` | Boolean | Whether entity moves faster on roads |
| `slowmultiplier` | Number | Speed multiplier when slowed (e.g., by terrain) |
| `fastmultiplier` | Number | Speed multiplier when moving quickly |
| `groundspeedmultiplier` | Number | Speed multiplier based on ground type |
| `triggerscreep` | Boolean | Whether movement triggers creep effect |
| `isrunning` | Boolean | Whether entity is currently running |
| `wantstomoveforward` | Boolean | Whether entity wants to move forward |
| `external_speed_multiplier` | Number | Additional speed multiplier from external sources |

## Key Methods

### Movement Control

```lua
-- Set walk and run speeds
locomotor:SetExternalSpeedMultiplier("buff_id", 1.3) -- 30% speed boost

-- Remove external speed multiplier
locomotor:RemoveExternalSpeedMultiplier("buff_id")

-- Set base speeds
locomotor:SetWalkSpeed(4)
locomotor:SetRunSpeed(6)

-- Start/stop movement
locomotor:StartWalking()
locomotor:StartRunning()
locomotor:Stop()

-- Check movement state
local is_moving = locomotor:WantsToMoveForward()
```

### Movement Modifiers

```lua
-- Set modifiers for different movement types
locomotor:SetSlowMultiplier(0.5) -- Move at 50% speed when slowed
locomotor:SetFastMultiplier(1.5) -- Move at 150% speed when boosted

-- Set whether entity moves faster on roads
locomotor:SetFasterOnRoad(true)

-- Set whether entity is affected by creep
locomotor:SetTriggersCreep(true)
```

### Pathfinding

```lua
-- Go to a point
locomotor:GoToPoint(Vector3(x, y, z))

-- Go to an entity
locomotor:GoToEntity(target_entity)

-- Follow an entity at a certain distance
locomotor:Follow(target_entity, min_dist, target_dist, max_dist)

-- Push entity away from a point
locomotor:PushAwayFrom(Vector3(x, y, z), dist)
```

## Movement States

The locomotor handles different movement states:

- **Idle**: Not moving
- **Walking**: Moving at walk speed
- **Running**: Moving at run speed
- **Following**: Following another entity
- **Avoiding**: Avoiding obstacles or threats

## Integration with Other Components

The Locomotor component often works with:

- `PathFinder` - For finding paths through the world
- `PlayerController` - For player-controlled movement
- `Combat` - For approach/retreat combat movement
- `State Graph` - For playing movement animations
- `Physics` - For collision detection during movement

## Example: Creating a Basic Moving Entity

```lua
local function MakeMovingEntity()
    local inst = CreateEntity()
    
    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddPhysics()
    inst:AddComponent("locomotor")
    
    -- Configure locomotor
    local locomotor = inst.components.locomotor
    locomotor:SetWalkSpeed(3)
    locomotor:SetRunSpeed(5)
    locomotor:SetFasterOnRoad(true)
    
    -- Add state graph for animations
    inst:SetStateGraph("SGcreature")
    
    -- Add simple AI to move around
    inst:DoPeriodicTask(5, function()
        local pos = Vector3(math.random(-10, 10), 0, math.random(-10, 10))
        locomotor:GoToPoint(pos)
    end)
    
    return inst
end 