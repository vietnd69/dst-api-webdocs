---
id: physics
title: Physics System
sidebar_position: 6
last_updated: 2023-07-12
version: 619045
---
*Last Update: 2023-07-12*
# Physics System

*API Version: 619045*

The Physics system in Don't Starve Together handles physical interactions between entities, including collision detection, movement constraints, and physical forces. It's essential for realistic entity behavior in the game world.

## Basic Usage

```lua
-- Add physics to an entity
entity.entity:AddPhysics()

-- Configure the physics
entity.Physics:SetMass(10)
entity.Physics:SetFriction(0.5)
entity.Physics:SetCollisionGroup(COLLISION.CHARACTERS)
entity.Physics:SetCollisionMask(COLLISION.WORLD + COLLISION.OBSTACLES)
entity.Physics:SetCylinder(0.5, 1)
```

## Core Physics Types

DST supports several types of physics objects:

### Static Physics

Used for immobile objects like structures and terrain features:

```lua
-- Set up static physics
entity.Physics:SetMass(0) -- Infinite mass (immovable)
entity.Physics:SetCollisionGroup(COLLISION.OBSTACLES)
entity.Physics:SetCylinder(1, 2) -- radius, height
```

### Dynamic Physics

Used for objects that should move and be affected by forces:

```lua
-- Set up dynamic physics
entity.Physics:SetMass(10)
entity.Physics:SetFriction(0.7)
entity.Physics:SetDamping(5)
entity.Physics:SetCollisionGroup(COLLISION.CHARACTERS)
entity.Physics:SetCollisionMask(COLLISION.WORLD + COLLISION.OBSTACLES)
entity.Physics:SetCylinder(0.5, 1)
```

### Inventory Physics

Special physics for inventory items:

```lua
-- Common helper function
MakeInventoryPhysics(inst)

-- Manual setup
entity.Physics:SetMass(1)
entity.Physics:SetFriction(0)
entity.Physics:SetDamping(5)
entity.Physics:SetCollisionGroup(COLLISION.ITEMS)
entity.Physics:SetCollisionMask(COLLISION.WORLD)
entity.Physics:SetSphere(0.5)
```

## Collision Management

### Collision Groups and Masks

Collision groups and masks control which objects can collide with each other:

```lua
-- Common collision groups
COLLISION = {
    NONE = 0,
    OBSTACLES = 2^0,  -- Structures, trees, etc.
    CHARACTERS = 2^1, -- Players and creatures
    WORLD = 2^2,      -- Ground and immovable world objects
    ITEMS = 2^3,      -- Pickable items
    GIANTS = 2^4,     -- Boss monsters
    FLYERS = 2^5      -- Flying entities
}

-- Set which group this entity belongs to
entity.Physics:SetCollisionGroup(COLLISION.CHARACTERS)

-- Set which groups this entity collides with
entity.Physics:SetCollisionMask(COLLISION.WORLD + COLLISION.OBSTACLES + COLLISION.CHARACTERS)
```

### Collision Shapes

Different collision shapes can be used for different entity types:

```lua
-- Cylinder shape (most common for characters)
entity.Physics:SetCylinder(0.5, 1) -- radius, height

-- Sphere shape (common for items)
entity.Physics:SetSphere(0.5) -- radius

-- Box shape (for structures)
entity.Physics:SetBox(1, 2, 1) -- width, height, depth

-- Capsule shape (for some creatures)
entity.Physics:SetCapsule(0.5, 1) -- radius, height
```

## Movement and Forces

### Position Control

```lua
-- Teleport physics object (instantaneous movement)
entity.Physics:Teleport(x, y, z)

-- Get current position
local x, y, z = entity.Physics:GetPosition()

-- Stop all movement immediately
entity.Physics:Stop()
```

### Velocity Control

```lua
-- Set velocity directly
entity.Physics:SetVel(x, y, z)

-- Get current velocity
local vx, vy, vz = entity.Physics:GetVelocity()

-- Apply impulse force (immediate velocity change)
entity.Physics:SetMotorVel(5, 0, 0) -- Move right at 5 units/sec
```

### Continuous Forces

```lua
-- Apply continuous force
entity.Physics:ApplyForce(10, 0, 0) -- 10 units force to the right

-- Apply continuous torque (rotational force)
entity.Physics:ApplyTorque(5) -- Rotate with force of 5
```

## Physics Events

Physics can trigger events when certain conditions are met:

```lua
-- Listen for collision events
entity:ListenForEvent("physics_collision", function(inst, data)
    local other = data.other -- The entity we collided with
    local speed = data.speed -- Speed of collision
    
    if speed > 3 then
        -- Handle high-speed collision
    end
end)
```

## Integration with Other Systems

The Physics system works closely with:

- **Transform**: For updating visual position based on physics
- **AnimState**: For aligning visuals with collision shapes
- **Locomotor**: For movement with terrain awareness
- **Combat**: For knockback and collision damage

## Common Use Cases

### Character Movement

```lua
local function SetupPlayerPhysics(inst)
    inst.entity:AddPhysics()
    inst.Physics:SetMass(75)
    inst.Physics:SetFriction(0.1)
    inst.Physics:SetDamping(5)
    inst.Physics:SetCollisionGroup(COLLISION.CHARACTERS)
    inst.Physics:SetCollisionMask(COLLISION.WORLD + COLLISION.OBSTACLES + COLLISION.CHARACTERS)
    inst.Physics:SetCylinder(0.5, 1)
end
```

### Projectile Physics

```lua
local function LaunchProjectile(inst, angle, speed)
    -- Set up physics for a projectile
    inst.entity:AddPhysics()
    inst.Physics:SetMass(1)
    inst.Physics:SetFriction(0)
    inst.Physics:SetDamping(0.5)
    inst.Physics:SetCollisionGroup(COLLISION.ITEMS)
    inst.Physics:SetCollisionMask(COLLISION.WORLD + COLLISION.OBSTACLES + COLLISION.CHARACTERS)
    inst.Physics:SetSphere(0.2)
    
    -- Launch in specified direction
    local vx = speed * math.cos(angle * DEGREES)
    local vz = -speed * math.sin(angle * DEGREES)
    inst.Physics:SetVel(vx, 3, vz) -- Add upward velocity for arc
    
    -- Apply gravity
    inst:DoPeriodicTask(FRAMES, function(inst)
        local vx, vy, vz = inst.Physics:GetVelocity()
        inst.Physics:SetVel(vx, vy - 0.1, vz) -- Apply gravity
    end)
end
```

### Physics Interactions

```lua
-- Knockback effect
local function ApplyKnockback(target, source_pos, force)
    if target.Physics ~= nil then
        local target_pos = target:GetPosition()
        local angle = math.atan2(target_pos.z - source_pos.z, target_pos.x - source_pos.x)
        local vx = force * math.cos(angle)
        local vz = force * math.sin(angle)
        
        target.Physics:SetVel(vx, 2, vz)
    end
end
```

### Sensor Zones

```lua
local function CreateSensorZone(center_pos, radius)
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddPhysics()
    
    -- Make it invisible but with physics
    inst.Transform:SetPosition(center_pos.x, 0, center_pos.z)
    inst.Physics:SetMass(0) -- Immovable
    inst.Physics:SetCollisionGroup(COLLISION.NONE)
    inst.Physics:SetCollisionMask(COLLISION.CHARACTERS) -- Only detect characters
    inst.Physics:SetSphere(radius)
    inst.Physics:SetSensor(true) -- Will detect but not block
    
    -- Set up detection
    inst:DoPeriodicTask(0.1, function(inst)
        local x, y, z = inst.Transform:GetWorldPosition()
        local ents = TheSim:FindEntities(x, y, z, radius, {"player"})
        
        for _, player in ipairs(ents) do
            -- Player is in sensor zone
            if not inst.detected_players[player] then
                -- New entry into zone
                inst.detected_players[player] = true
                inst:PushEvent("player_enter", {player = player})
            end
        end
        
        -- Check for players who left
        for player, _ in pairs(inst.detected_players) do
            if not table.contains(ents, player) then
                -- Player left zone
                inst.detected_players[player] = nil
                inst:PushEvent("player_exit", {player = player})
            end
        end
    end)
    
    inst.detected_players = {}
    
    return inst
end
```

## Performance Considerations

- **Minimize Moving Physics Objects**: Each moving physics object requires computation
- **Use Appropriate Collision Groups**: Avoid unnecessary collision checks
- **Simplify Collision Shapes**: Use simple shapes when possible
- **Limit Continuous Forces**: Apply forces only when necessary
- **Use Sensors for Detection**: Prefer sensors over regular collision for detection zones

## Best Practices

1. **Choose the Right Collision Shape**: Match collision shape to visual appearance
2. **Handle Cleanup**: Reset forces and velocities when switching states
3. **Avoid Physics Overlap**: Multiple physics entities inside each other can cause instability
4. **Balance Realism and Performance**: Use simplified physics when appropriate
5. **Test with Different Clients**: Physics can behave slightly differently between clients

## See also

- [Entity System](entity-system.md) - For the overall entity framework
- [Transform](../shared-properties/transform.md) - For positioning physics entities
- [Locomotor](../components/locomotor.md) - For higher-level movement with physics
- [AnimState](animstate-system.md) - For visual representation of physical entities
- [Network System](network-system.md) - For multiplayer physics considerations
