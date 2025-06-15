---
id: locomotor
title: Locomotor
sidebar_position: 13
version: 619045
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

#### SetWalkSpeed and SetRunSpeed

Set the base walk and run speeds for the entity.

```lua
-- Set base speeds
locomotor:SetWalkSpeed(4)
locomotor:SetRunSpeed(6)

-- Example of setting up speed for different character types
function ConfigureCharacterSpeed(inst, characterType)
    local locomotor = inst.components.locomotor
    
    if characterType == "nimble" then
        locomotor:SetWalkSpeed(5) -- Faster walker
        locomotor:SetRunSpeed(8)  -- Faster runner
    elseif characterType == "heavy" then
        locomotor:SetWalkSpeed(3) -- Slower walker
        locomotor:SetRunSpeed(4.5) -- Slower runner
    else -- standard
        locomotor:SetWalkSpeed(4)
        locomotor:SetRunSpeed(6)
    end
    
    -- Maybe apply character-specific animations
    if characterType == "nimble" then
        -- Faster animation playback for faster characters
        inst.AnimState:SetDeltaTimeMultiplier(1.2)
    end
end
```

#### SetExternalSpeedMultiplier

Applies a named speed multiplier that stacks with other speed effects.

```lua
-- Set external speed multiplier
locomotor:SetExternalSpeedMultiplier("buff_id", 1.3) -- 30% speed boost

-- Remove external speed multiplier
locomotor:RemoveExternalSpeedMultiplier("buff_id")

-- Example of a speed buff system
function ApplySpeedBuff(target, buffAmount, duration)
    if target.components.locomotor ~= nil then
        -- Apply the speed buff
        target.components.locomotor:SetExternalSpeedMultiplier("speed_potion", buffAmount)
        
        -- Visual effect to show the speed buff
        local fx = SpawnPrefab("statue_transition_2")
        fx.entity:SetParent(target.entity)
        fx.Transform:SetPosition(0, 0, 0)
        
        -- Remove the buff after duration
        target:DoTaskInTime(duration, function(inst)
            if inst.components.locomotor ~= nil then
                inst.components.locomotor:RemoveExternalSpeedMultiplier("speed_potion")
                
                -- Visual effect for buff ending
                local endFx = SpawnPrefab("statue_transition")
                endFx.entity:SetParent(inst.entity)
                endFx.Transform:SetPosition(0, 0, 0)
            end
        end)
        
        return true
    end
    
    return false
end
```

#### StartWalking, StartRunning, and Stop

Control the movement state of the entity.

```lua
-- Start/stop movement
locomotor:StartWalking()
locomotor:StartRunning()
locomotor:Stop()

-- Example of player control integration
function SetupPlayerControls(inst)
    -- When sprint key is pressed
    inst:ListenForEvent("sprintkey", function(inst)
        if inst.components.locomotor ~= nil then
            if not inst.components.locomotor.isrunning then
                inst.components.locomotor:StartRunning()
            end
        end
    end)
    
    -- When sprint key is released
    inst:ListenForEvent("sprintkeyup", function(inst)
        if inst.components.locomotor ~= nil and inst.components.locomotor.isrunning then
            inst.components.locomotor:StartWalking()
        end
    end)
    
    -- When stop key is pressed
    inst:ListenForEvent("stopkey", function(inst)
        if inst.components.locomotor ~= nil then
            inst.components.locomotor:Stop()
        end
    end)
end
```

### Movement Modifiers

#### SetSlowMultiplier and SetFastMultiplier

Configure how speed is affected by modifiers.

```lua
-- Set modifiers for different movement types
locomotor:SetSlowMultiplier(0.5) -- Move at 50% speed when slowed
locomotor:SetFastMultiplier(1.5) -- Move at 150% speed when boosted

-- Example of terrain-based movement effects
function ConfigureTerrainMovement(inst)
    local locomotor = inst.components.locomotor
    
    -- Set up base movement modifiers
    locomotor:SetSlowMultiplier(0.6)
    locomotor:SetFastMultiplier(1.4)
    
    -- Update ground speed modifier based on current terrain
    inst:DoPeriodicTask(0.5, function(inst)
        local x, y, z = inst.Transform:GetWorldPosition()
        local tile = TheWorld.Map:GetTileAtPoint(x, 0, z)
        
        if tile == GROUND.ROAD then
            -- Roads are fast
            locomotor.groundspeedmultiplier = 1.3
        elseif tile == GROUND.MUD or tile == GROUND.MARSH then
            -- Mud and marsh are very slow
            locomotor.groundspeedmultiplier = 0.5
        elseif tile == GROUND.ROCKY or tile == GROUND.DIRT then
            -- Rocky and dirt are normal speed
            locomotor.groundspeedmultiplier = 1.0
        elseif tile == GROUND.GRASS then
            -- Grass is slightly faster
            locomotor.groundspeedmultiplier = 1.1
        else
            -- Default ground speed
            locomotor.groundspeedmultiplier = 1.0
        end
    end)
end
```

#### SetFasterOnRoad and SetTriggersCreep

Configure road and creep interactions.

```lua
-- Set whether entity moves faster on roads
locomotor:SetFasterOnRoad(true)

-- Set whether entity is affected by creep
locomotor:SetTriggersCreep(true)

-- Example of creature-specific movement configuration
function SetupCreatureMovement(inst, creatureType)
    local locomotor = inst.components.locomotor
    
    if creatureType == "spider" then
        -- Spiders create creep but aren't affected by it
        locomotor:SetTriggersCreep(false)
        locomotor:SetFasterOnRoad(false)
        
        -- Spiders are faster on webbing
        inst:ListenForEvent("ontilechanged", function(inst, data)
            if data.tile == GROUND.WEBBING then
                locomotor.groundspeedmultiplier = 1.5
            else
                locomotor.groundspeedmultiplier = 1.0
            end
        end)
    elseif creatureType == "deer" then
        -- Deer are much faster on roads
        locomotor:SetTriggersCreep(true)
        locomotor:SetFasterOnRoad(true)
        locomotor.fastmultiplier = 1.8
    end
end
```

### Pathfinding

#### GoToPoint

Makes the entity move toward a specific point.

```lua
-- Go to a point
locomotor:GoToPoint(Vector3(x, y, z))

-- Example of a patrol system
function SetupPatrolPattern(inst, patrolPoints)
    local currentPatrolIndex = 1
    
    inst:DoPeriodicTask(5, function()
        if inst.components.locomotor ~= nil then
            local targetPoint = patrolPoints[currentPatrolIndex]
            
            -- Move to the next patrol point
            inst.components.locomotor:GoToPoint(targetPoint)
            
            -- Update patrol index for next time
            currentPatrolIndex = currentPatrolIndex % #patrolPoints + 1
            
            -- Optional custom arrival behavior
            inst:DoTaskInTime(4, function(inst)
                -- If close enough to destination, consider it arrived
                local ix, iy, iz = inst.Transform:GetWorldPosition()
                local tx, ty, tz = targetPoint:Get()
                if math.sqrt((ix - tx)^2 + (iz - tz)^2) < 3 then
                    -- Do something on arrival, like play an animation
                    inst.AnimState:PlayAnimation("idle_alert")
                end
            end)
        end
    end)
end

-- Example of a random wandering behavior
function SetupRandomWander(inst, centerPoint, radius)
    inst:DoPeriodicTask(math.random(5, 10), function()
        if inst.components.locomotor ~= nil then
            local cx, cy, cz = centerPoint:Get()
            local angle = math.random() * 2 * math.pi
            local dist = math.random() * radius
            
            local targetPoint = Vector3(cx + math.cos(angle) * dist, 0, cz + math.sin(angle) * dist)
            inst.components.locomotor:GoToPoint(targetPoint)
        end
    end)
end
```

#### GoToEntity

Makes the entity move toward another entity.

```lua
-- Go to an entity
locomotor:GoToEntity(target_entity)

-- Example of an aggressive creature targeting player
function SetupAggressiveBehavior(inst)
    -- Periodically check for targets
    inst:DoPeriodicTask(2, function()
        if inst.components.locomotor ~= nil and not inst.components.combat:HasTarget() then
            -- Look for closest player
            local x, y, z = inst.Transform:GetWorldPosition()
            local player = FindClosestPlayerInRange(x, y, z, 15)
            
            if player ~= nil then
                -- Target player with both locomotor and combat
                inst.components.locomotor:GoToEntity(player)
                inst.components.combat:SetTarget(player)
                
                -- Play aggro animation/sound
                inst.SoundEmitter:PlaySound("dontstarve/creatures/monster/growl")
                inst.AnimState:PlayAnimation("taunt")
                inst.AnimState:PushAnimation("run_loop")
            end
        end
    end)
    
    -- Stop when target is gone
    inst:ListenForEvent("droppedtarget", function(inst)
        inst.components.locomotor:Stop()
    end)
end
```

#### Follow

Makes the entity follow another entity while maintaining a certain distance.

```lua
-- Follow an entity at a certain distance
locomotor:Follow(target_entity, min_dist, target_dist, max_dist)

-- Example of a companion pet following the player
function SetupCompanionBehavior(inst, owner)
    if inst.components.locomotor ~= nil then
        -- Start following owner
        inst.components.locomotor:Follow(owner, 2, 3, 6)
        
        -- Adjust speeds based on owner's movement
        inst:ListenForEvent("locomote", function(owner)
            if owner.components.locomotor:WantsToRun() then
                inst.components.locomotor:SetRunSpeed(owner.components.locomotor.runspeed * 1.2)
                inst.components.locomotor:StartRunning()
            else
                inst.components.locomotor:SetWalkSpeed(owner.components.locomotor.walkspeed * 1.1)
                inst.components.locomotor:StartWalking()
            end
        end, owner)
        
        -- Stop following when owner teleports or goes too far
        inst:DoPeriodicTask(1, function(inst)
            local ix, iy, iz = inst.Transform:GetWorldPosition()
            local ox, oy, oz = owner.Transform:GetWorldPosition()
            local dist = math.sqrt((ix - ox)^2 + (iz - oz)^2)
            
            if dist > 20 then
                -- Teleport companion if they get too far from owner
                inst.Physics:Teleport(ox + math.random(-2,2), 0, oz + math.random(-2,2))
                inst.components.locomotor:Stop()
                inst.components.locomotor:Follow(owner, 2, 3, 6)
            elseif dist > 10 then
                -- Run to catch up if getting far
                inst.components.locomotor:StartRunning()
            end
        end)
    end
end

-- Example of a herding behavior with multiple followers
function SetupHerdFollowing(herdLeader, herdMembers)
    -- Each herd member follows the leader
    for i, member in ipairs(herdMembers) do
        if member ~= herdLeader and member.components.locomotor ~= nil then
            -- Stagger follow distances to avoid crowding
            local minDist = 2 + i * 0.5
            local targetDist = 3 + i * 0.5
            local maxDist = 5 + i * 0.5
            
            member.components.locomotor:Follow(herdLeader, minDist, targetDist, maxDist)
            
            -- Match speed with the leader
            member:ListenForEvent("startrunning", function(leader)
                member.components.locomotor:StartRunning()
            end, herdLeader)
            
            member:ListenForEvent("startwalking", function(leader)
                member.components.locomotor:StartWalking()
            end, herdLeader)
        end
    end
end
```

#### PushAwayFrom

Pushes the entity away from a point or entity.

```lua
-- Push entity away from a point
locomotor:PushAwayFrom(Vector3(x, y, z), dist)

-- Example of knockback effect in combat
function ApplyKnockback(target, attacker, power)
    if target.components.locomotor ~= nil then
        local tx, ty, tz = target.Transform:GetWorldPosition()
        local ax, ay, az = attacker.Transform:GetWorldPosition()
        
        -- Calculate direction vector from attacker to target
        local dx, dz = tx - ax, tz - az
        local norm = math.sqrt(dx * dx + dz * dz)
        
        -- Normalize and scale by power
        if norm > 0 then
            dx, dz = dx / norm * power, dz / norm * power
        else
            dx, dz = 0, power -- Default to push north if vectors are the same
        end
        
        -- Apply knockback
        target.components.locomotor:Stop()
        target.components.locomotor:PushAwayFrom(Vector3(ax, ay, az), power)
        
        -- Stun briefly after knockback
        target:DoTaskInTime(0.2, function(inst)
            if inst.components.locomotor ~= nil then
                inst.components.locomotor:Stop()
            end
        end)
    end
end

-- Example of explosion knockback affecting multiple entities
function ExplosionKnockback(center, radius, power)
    local x, y, z = center:Get()
    
    -- Find all entities in radius
    local ents = TheSim:FindEntities(x, y, z, radius, nil, {"INLIMBO"})
    
    for i, v in ipairs(ents) do
        if v.components.locomotor ~= nil then
            -- Calculate distance from explosion
            local vx, vy, vz = v.Transform:GetWorldPosition()
            local dist = math.sqrt((vx - x)^2 + (vz - z)^2)
            
            if dist > 0 then
                -- Scale power based on distance (closer = stronger knockback)
                local scaledPower = power * (1 - dist/radius)
                if scaledPower > 0 then
                    -- Apply knockback
                    v.components.locomotor:PushAwayFrom(center, scaledPower)
                    
                    -- Maybe apply damage too
                    if v.components.health ~= nil then
                        v.components.health:DoDelta(-scaledPower * 5)
                    end
                end
            end
        end
    end
end
```

## Movement States

The locomotor handles different movement states:

- **Idle**: Not moving
- **Walking**: Moving at walk speed
- **Running**: Moving at run speed
- **Following**: Following another entity
- **Avoiding**: Avoiding obstacles or threats

## Integration with Other Components

### Combat Integration

```lua
-- Example of locomotor integration with combat for chase behavior
function SetupCombatMovement(inst)
    -- When acquiring a new target
    inst:ListenForEvent("newcombattarget", function(inst, data)
        if data.target ~= nil and inst.components.locomotor ~= nil then
            -- Start chasing the target
            inst.components.locomotor:StartRunning()
            inst.components.locomotor:GoToEntity(data.target)
            
            -- Follow target at attack range
            local attackRange = inst.components.combat.attackrange or 3
            inst.components.locomotor:Follow(data.target, attackRange*0.5, attackRange*0.75, attackRange)
        end
    end)
    
    -- When losing a target
    inst:ListenForEvent("droppedtarget", function(inst)
        if inst.components.locomotor ~= nil then
            inst.components.locomotor:Stop()
            -- Maybe wander after losing target
            inst:DoTaskInTime(2, function()
                if inst.components.locomotor ~= nil then
                    inst.components.locomotor:StartWalking()
                    
                    local x, y, z = inst.Transform:GetWorldPosition()
                    local wanderPoint = Vector3(x + math.random(-5, 5), 0, z + math.random(-5, 5))
                    inst.components.locomotor:GoToPoint(wanderPoint)
                end
            end)
        end
    end)
    
    -- Periodic combat update
    inst:DoPeriodicTask(0.5, function()
        local target = inst.components.combat.target
        if target ~= nil and inst.components.locomotor ~= nil then
            -- Get distance to target
            local ix, iy, iz = inst.Transform:GetWorldPosition()
            local tx, ty, tz = target.Transform:GetWorldPosition()
            local dist = math.sqrt((ix - tx)^2 + (iz - tz)^2)
            
            -- If within attack range, stop and attack
            if dist <= inst.components.combat.attackrange then
                inst.components.locomotor:Stop()
                inst.components.combat:DoAttack()
            else
                -- Otherwise continue chase
                inst.components.locomotor:GoToEntity(target)
            end
        end
    end)
end
```

### Health Integration

```lua
-- Example of locomotor integration with health for flee behavior
function SetupFleeWhenInjured(inst)
    -- Track health state
    local oldHealth = 1.0
    
    inst:ListenForEvent("healthdelta", function(inst, data)
        if inst.components.locomotor ~= nil then
            local healthPercent = inst.components.health:GetPercent()
            
            -- Flee when health drops significantly
            if healthPercent < oldHealth and (oldHealth - healthPercent) > 0.2 then
                -- Find direction away from threat
                local threatSource = data.cause or data.afflicter
                if threatSource ~= nil then
                    -- Run away from threat
                    inst.components.locomotor:StartRunning()
                    inst.components.locomotor:PushAwayFrom(threatSource:GetPosition(), 15)
                    
                    -- Stop running after a bit
                    inst:DoTaskInTime(3, function(inst)
                        if inst.components.locomotor ~= nil then
                            inst.components.locomotor:StartWalking()
                        end
                    end)
                end
            end
            
            -- Update old health for next comparison
            oldHealth = healthPercent
            
            -- Move slower when badly injured
            if healthPercent < 0.3 then
                inst.components.locomotor:SetExternalSpeedMultiplier("injured", 0.7)
            else
                inst.components.locomotor:RemoveExternalSpeedMultiplier("injured")
            end
        end
    end)
end
```

### Sanity Integration

```lua
-- Example of locomotor affected by sanity
function SetupSanityMovement(inst)
    inst:DoPeriodicTask(1, function()
        if inst.components.locomotor ~= nil and inst.components.sanity ~= nil then
            local sanityPercent = inst.components.sanity:GetPercent()
            
            -- Movement becomes erratic at low sanity
            if sanityPercent < 0.3 then
                -- Random chance to twitch/change direction
                if math.random() < 0.3 then
                    -- Stop briefly
                    inst.components.locomotor:Stop()
                    
                    -- Then go in a random direction
                    inst:DoTaskInTime(0.3, function()
                        if inst.components.locomotor ~= nil then
                            local x, y, z = inst.Transform:GetWorldPosition()
                            local angle = math.random() * 2 * math.pi
                            local point = Vector3(x + math.cos(angle) * 3, 0, z + math.sin(angle) * 3)
                            inst.components.locomotor:StartWalking()
                            inst.components.locomotor:GoToPoint(point)
                        end
                    end)
                end
                
                -- Vision warping effect (simulated by irregular speed)
                local warpFactor = 0.7 + math.sin(GetTime() * 5) * 0.3
                inst.components.locomotor:SetExternalSpeedMultiplier("sanity", warpFactor)
            else
                -- Normal movement at higher sanity
                inst.components.locomotor:RemoveExternalSpeedMultiplier("sanity")
            end
        end
    end)
end
```

## See also

- [Combat Component](combat.md) - For movement during combat
- [Physics Component](other-components.md) - For physical collision during movement
- [State Graph System](../core/stategraph-system.md) - For animation states during movement
- [Equippable Component](equippable.md) - For items that affect movement speed
- [Temperature Component](temperature.md) - For temperature effects on movement

## Example: Creating a Comprehensive Movement Entity

```lua
local function MakeAdvancedMovingEntity()
    local inst = CreateEntity()
    
    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddPhysics()
    inst.entity:AddDynamicShadow()
    inst.entity:AddSoundEmitter()
    
    -- Setup physics
    inst.Physics:SetMass(10)
    inst.Physics:SetFriction(0.1)
    inst.Physics:SetDamping(5)
    inst.Physics:SetCollisionGroup(COLLISION.CHARACTERS)
    inst.Physics:SetCollisionMask(COLLISION.WORLD + COLLISION.OBSTACLES + COLLISION.CHARACTERS)
    inst.Physics:SetCylinder(0.5, 1)
    
    -- Add locomotor for movement
    inst:AddComponent("locomotor")
    local locomotor = inst.components.locomotor
    locomotor:SetSlowMultiplier(0.6)
    locomotor:SetTriggersCreep(true)
    locomotor:SetFasterOnRoad(true)
    locomotor:SetWalkSpeed(4)
    locomotor:SetRunSpeed(7)
    
    -- Add state graph for animations
    inst:SetStateGraph("SGcreature")
    
    -- Add custom patrol behavior
    local patrolPoints = {
        Vector3(10, 0, 10),
        Vector3(-10, 0, 10),
        Vector3(-10, 0, -10),
        Vector3(10, 0, -10)
    }
    
    local currentPatrolIndex = 1
    local isPatrolling = true
    
    -- Function to go to next patrol point
    local function GoToNextPatrolPoint()
        if isPatrolling and inst.components.locomotor ~= nil then
            local targetPoint = patrolPoints[currentPatrolIndex]
            inst.components.locomotor:GoToPoint(targetPoint)
            
            -- Update patrol index for next time
            currentPatrolIndex = currentPatrolIndex % #patrolPoints + 1
        end
    end
    
    -- Start patrolling and periodically check if reached destination
    inst:DoTaskInTime(1, GoToNextPatrolPoint)
    
    inst:DoPeriodicTask(1, function()
        if isPatrolling and inst.components.locomotor ~= nil then
            local x, y, z = inst.Transform:GetWorldPosition()
            local targetPoint = patrolPoints[currentPatrolIndex - 1 > 0 and currentPatrolIndex - 1 or #patrolPoints]
            local tx, ty, tz = targetPoint:Get()
            
            if math.sqrt((x - tx)^2 + (z - tz)^2) < 2 then
                -- Reached destination, wait a bit then go to next point
                inst.components.locomotor:Stop()
                inst:DoTaskInTime(2, GoToNextPatrolPoint)
            end
        end
    end)
    
    -- Add detection of players for aggressive behavior
    inst:DoPeriodicTask(2, function()
        if inst.components.locomotor ~= nil then
            local x, y, z = inst.Transform:GetWorldPosition()
            local player = FindClosestPlayerInRange(x, y, z, 10)
            
            if player ~= nil then
                -- Stop patrolling and chase player
                isPatrolling = false
                inst.components.locomotor:StartRunning()
                inst.components.locomotor:GoToEntity(player)
                
                -- Resume patrol after losing interest
                inst:DoTaskInTime(10, function()
                    if inst.components.locomotor ~= nil then
                        isPatrolling = true
                        GoToNextPatrolPoint()
                    end
                end)
            end
        end
    end)
    
    return inst
end 