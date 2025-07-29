---
id: physics
title: Physics System
description: Physics collision handling, entity launching, and area destruction utilities for Don't Starve Together
sidebar_position: 3

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Physics System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `physics` module provides essential physics-related functionality for Don't Starve Together, including collision detection callbacks, entity launching mechanics, area destruction systems, and collision mask management. This module serves as the bridge between the engine's physics system and Lua gameplay logic, enabling complex interactions between entities and environmental effects.

## Usage Example

```lua
-- Register physics collision callback
PhysicsCollisionCallbacks[entity.GUID] = function(inst, other, ...)
    print("Collision detected between " .. inst.prefab .. " and " .. other.prefab)
end

-- Launch entity with basic parameters
Launch(projectile, launcher, 10)  -- Launch at speed 10

-- Launch with advanced control
Launch2(item, explosion_source, 5, 3, 0.5, 2, 8)  -- Complex launch parameters

-- Create explosion effect with area clearing
LaunchAndClearArea(bomb, 8, 6, 4, 0.3, 1.5)  -- Radius 8, various launch parameters
```

## Collision System

### OnPhysicsCollision(guid1, guid2, world_position_on_a_x, world_position_on_a_y, world_position_on_a_z, world_position_on_b_x, world_position_on_b_y, world_position_on_b_z, world_normal_on_b_x, world_normal_on_b_y, world_normal_on_b_z, lifetime_in_frames) {#on-physics-collision}

**Status:** `stable`

**Description:**
Engine callback function that handles physics collisions between entities. Automatically called by the engine when two physics objects collide, dispatching to registered callback functions for each entity involved.

**Parameters:**
- `guid1` (number): GUID of first entity in collision
- `guid2` (number): GUID of second entity in collision
- `world_position_on_a_x/y/z` (number): World position of collision point on entity A
- `world_position_on_b_x/y/z` (number): World position of collision point on entity B
- `world_normal_on_b_x/y/z` (number): World normal vector on entity B
- `lifetime_in_frames` (number): Duration of collision in frames

**Returns:**
None

**Example:**
```lua
-- Set up collision detection for a projectile
local function SetupProjectileCollision(projectile)
    PhysicsCollisionCallbacks[projectile.GUID] = function(inst, other, 
        pos_a_x, pos_a_y, pos_a_z, 
        pos_b_x, pos_b_y, pos_b_z, 
        normal_x, normal_y, normal_z, 
        lifetime)
        
        print("Projectile hit " .. (other.prefab or "unknown"))
        
        -- Calculate impact force based on collision normal
        local impact_force = math.sqrt(normal_x^2 + normal_y^2 + normal_z^2)
        
        -- Apply damage based on impact
        if other.components.health then
            other.components.health:DoDelta(-10 * impact_force)
        end
        
        -- Create impact effect at collision point
        local fx = SpawnPrefab("impact_fx")
        fx.Transform:SetPosition(pos_a_x, pos_a_y, pos_a_z)
        
        -- Remove projectile on impact
        inst:Remove()
    end
end

-- Clean up collision callback when entity is removed
local function CleanupProjectileCollision(projectile)
    PhysicsCollisionCallbacks[projectile.GUID] = nil
end
```

### PhysicsCollisionCallbacks {#physics-collision-callbacks}

**Status:** `stable`

**Description:**
Global table storing collision callback functions indexed by entity GUID. Register functions here to receive collision notifications for specific entities.

**Structure:**
```lua
PhysicsCollisionCallbacks[entity_guid] = callback_function
```

**Example:**
```lua
-- Advanced collision handling system
local CollisionManager = {}

function CollisionManager:RegisterEntity(entity, collision_type)
    local callback_func
    
    if collision_type == "bouncy" then
        callback_func = function(inst, other, ...)
            -- Bounce off other entities
            local vel_x, vel_y, vel_z = inst.Physics:GetVel()
            inst.Physics:SetVel(-vel_x * 0.8, vel_y, -vel_z * 0.8)
        end
        
    elseif collision_type == "sticky" then
        callback_func = function(inst, other, ...)
            -- Stick to the first thing we hit
            inst.Physics:Stop()
            inst:AddTag("stuck")
        end
        
    elseif collision_type == "explosive" then
        callback_func = function(inst, other, ...)
            -- Explode on any collision
            LaunchAndClearArea(inst, 5, 8, 6, 0.5, 2)
            inst:Remove()
        end
    end
    
    PhysicsCollisionCallbacks[entity.GUID] = callback_func
    
    -- Cleanup when entity is removed
    entity:DoTaskInTime(0, function()
        entity:ListenForEvent("onremove", function()
            PhysicsCollisionCallbacks[entity.GUID] = nil
        end)
    end)
end

-- Usage examples
CollisionManager:RegisterEntity(bouncy_ball, "bouncy")
CollisionManager:RegisterEntity(glue_blob, "sticky")
CollisionManager:RegisterEntity(bomb, "explosive")
```

## Collision Mask Management

### CollisionMaskBatcher {#collision-mask-batcher}

**Status:** `stable`

**Description:**
Helper class for efficiently managing entity collision masks without multiple C++ calls. Allows batching of collision mask operations before committing changes to the Physics component.

#### Constructor

```lua
CollisionMaskBatcher(entormask)
```

**Parameters:**
- `entormask` (Entity|number): Entity to copy mask from, or initial mask value

#### Methods

##### ClearCollisionMask() {#clear-collision-mask}

**Description:**
Clears all collision mask bits.

**Returns:**
- (CollisionMaskBatcher): Self for method chaining

##### SetCollisionMask(...) {#set-collision-mask}

**Description:**
Sets collision mask bits using bitwise OR operation.

**Parameters:**
- `...` (number): Variable number of collision mask constants

**Returns:**
- (CollisionMaskBatcher): Self for method chaining

##### CollidesWith(mask) {#collides-with}

**Description:**
Adds collision mask bits using bitwise OR operation.

**Parameters:**
- `mask` (number): Collision mask to add

**Returns:**
- (CollisionMaskBatcher): Self for method chaining

##### ClearCollidesWith(mask) {#clear-collides-with}

**Description:**
Removes collision mask bits using bitwise AND NOT operation.

**Parameters:**
- `mask` (number): Collision mask to remove

**Returns:**
- (CollisionMaskBatcher): Self for method chaining

##### CommitTo(ent) {#commit-to}

**Description:**
Applies the batched collision mask changes to the entity's Physics component.

**Parameters:**
- `ent` (Entity): Entity to apply collision mask to

**Example:**
```lua
-- Efficient collision mask management for flying creatures
local function SetupFlyingCreature(creature)
    CollisionMaskBatcher(creature)
        :ClearCollisionMask()                    -- Start fresh
        :CollidesWith(COLLISION.GROUND)          -- Collide with ground
        :CollidesWith(COLLISION.OBSTACLES)       -- Collide with obstacles
        :ClearCollidesWith(COLLISION.ITEMS)      -- Don't collide with items
        :CollidesWith(COLLISION.FLYERS)          -- Collide with other flyers
        :CommitTo(creature)                      -- Apply all changes at once
end

-- Dynamic collision mask switching
local function ToggleGhostMode(entity, is_ghost)
    local batcher = CollisionMaskBatcher(entity)
    
    if is_ghost then
        batcher:ClearCollidesWith(COLLISION.GROUND)
               :ClearCollidesWith(COLLISION.OBSTACLES)
               :CollidesWith(COLLISION.GHOSTS)
    else
        batcher:CollidesWith(COLLISION.GROUND)
               :CollidesWith(COLLISION.OBSTACLES)
               :ClearCollidesWith(COLLISION.GHOSTS)
    end
    
    batcher:CommitTo(entity)
end

-- Advanced collision setup for projectiles
local function SetupProjectileCollisions(projectile, projectile_type)
    local batcher = CollisionMaskBatcher(0)  -- Start with empty mask
    
    -- Base collisions for all projectiles
    batcher:CollidesWith(COLLISION.GROUND)
           :CollidesWith(COLLISION.OBSTACLES)
    
    -- Type-specific collisions
    if projectile_type == "magic" then
        batcher:ClearCollidesWith(COLLISION.ITEMS)      -- Pass through items
               :CollidesWith(COLLISION.CHARACTERS)       -- Hit characters
    elseif projectile_type == "physical" then
        batcher:CollidesWith(COLLISION.ITEMS)           -- Interact with items
               :CollidesWith(COLLISION.CHARACTERS)       -- Hit characters
    elseif projectile_type == "ghost" then
        batcher:ClearCollidesWith(COLLISION.GROUND)     -- Pass through ground
               :CollidesWith(COLLISION.GHOSTS)           -- Only hit ghosts
    end
    
    batcher:CommitTo(projectile)
end
```

## Entity Launching Functions

### Launch(inst, launcher, basespeed) {#launch}

**Status:** `stable`

**Description:**
Launches an entity away from a launcher with basic physics parameters. Calculates direction based on relative positions and applies randomized angle variation.

**Parameters:**
- `inst` (Entity): Entity to launch
- `launcher` (Entity): Entity that causes the launch (determines direction)
- `basespeed` (number, optional): Base launch speed (default: 5)

**Returns:**
None

**Example:**
```lua
-- Basic entity launching
local function ExplodeBarrel(barrel)
    local x, y, z = barrel.Transform:GetWorldPosition()
    local nearby_items = TheSim:FindEntities(x, y, z, 3, {"_inventoryitem"})
    
    for _, item in ipairs(nearby_items) do
        if item.Physics and item.Physics:IsActive() then
            Launch(item, barrel, 8)  -- Launch items at speed 8
        end
    end
end

-- Launch items from chest when destroyed
local function OnChestDestroyed(chest)
    if chest.components.container then
        for _, item in pairs(chest.components.container.slots) do
            if item then
                item.Transform:SetPosition(chest.Transform:GetWorldPosition())
                Launch(item, chest, 6)  -- Scatter items
            end
        end
    end
end

-- Simple knockback effect
local function KnockbackEntity(target, source, force)
    if target.Physics and target.Physics:IsActive() then
        Launch(target, source, force or 5)
    end
end
```

### Launch2(inst, launcher, basespeed, speedmult, startheight, startradius, vertical_speed, force_angle) {#launch2}

**Status:** `stable`

**Description:**
Advanced entity launching with comprehensive control over trajectory, starting position, and velocity components. Provides precise control for complex launching scenarios.

**Parameters:**
- `inst` (Entity): Entity to launch
- `launcher` (Entity): Entity that causes the launch
- `basespeed` (number): Base horizontal speed
- `speedmult` (number): Additional random speed multiplier
- `startheight` (number): Starting height (Y position)
- `startradius` (number): Starting distance from launcher
- `vertical_speed` (number, optional): Vertical velocity (default: basespeed * 5 + random)
- `force_angle` (number, optional): Forced launch angle in degrees

**Returns:**
- (number): Launch angle in radians

**Example:**
```lua
-- Advanced explosion system
local function CreateAdvancedExplosion(center, radius, force)
    local x, y, z = center.Transform:GetWorldPosition()
    local items = TheSim:FindEntities(x, y, z, radius, {"_inventoryitem"})
    
    for _, item in ipairs(items) do
        if item.Physics and item.Physics:IsActive() then
            -- Calculate distance-based parameters
            local distance = center:GetDistanceSqToInst(item)
            local distance_factor = 1 - (distance / (radius * radius))
            
            -- Launch with parameters based on distance
            local launch_angle = Launch2(
                item,                           -- item to launch
                center,                         -- explosion center
                8 * distance_factor,           -- base speed (closer = faster)
                4 * distance_factor,           -- speed multiplier
                0.2,                           -- start slightly above ground
                1,                             -- start 1 unit from center
                12 * distance_factor           -- vertical speed
            )
            
            -- Add spin based on launch angle
            if item.Physics then
                local spin_speed = 5 * distance_factor
                item.Physics:SetAngularVel(spin_speed)
            end
        end
    end
end

-- Catapult system
local function FireCatapult(catapult, projectile, target_pos, power)
    local angle_to_target = catapult:GetAngleToPoint(target_pos:Get())
    
    Launch2(
        projectile,                    -- projectile to fire
        catapult,                      -- catapult as launcher
        power * 0.8,                   -- base speed
        power * 0.4,                   -- speed variation
        2,                             -- start high up
        1.5,                           -- start in front of catapult
        power * 1.2,                   -- high arc
        angle_to_target                -- aim at target
    )
    
    -- Track projectile trajectory
    projectile:DoPeriodicTask(0.1, function()
        local px, py, pz = projectile.Transform:GetWorldPosition()
        if py <= 0.1 then  -- Hit ground
            -- Create impact effect
            LaunchAndClearArea(projectile, 3, 4, 2, 0.1, 0.5)
            projectile:Remove()
        end
    end)
end

-- Volcanic eruption effect
local function CreateVolcanicEruption(volcano, intensity)
    local x, y, z = volcano.Transform:GetWorldPosition()
    
    -- Launch multiple projectiles in sequence
    for i = 1, intensity do
        volcano:DoTaskInTime(i * 0.2, function()
            local rock = SpawnPrefab("volcanic_rock")
            
            local random_angle = math.random() * 360
            Launch2(
                rock,                      -- volcanic rock
                volcano,                   -- volcano center
                15,                        -- high speed
                10,                        -- high variation
                0,                         -- ground level start
                math.random() * 3,         -- varying start radius
                20 + math.random() * 10,   -- very high vertical speed
                random_angle               -- random direction
            )
        end)
    end
end
```

### LaunchAt(inst, launcher, target, speedmult, startheight, startradius, randomangleoffset) {#launch-at}

**Status:** `stable`

**Description:**
Launches an entity toward a specific target with randomized angle offset. Useful for creating targeted attacks or guided projectiles with some inaccuracy.

**Parameters:**
- `inst` (Entity): Entity to launch
- `launcher` (Entity): Entity that causes the launch
- `target` (Entity, optional): Target to aim at (uses camera direction if nil)
- `speedmult` (number, optional): Speed multiplier (default: 1)
- `startheight` (number, optional): Starting height (default: 0.1)
- `startradius` (number, optional): Starting distance from launcher (default: 0)
- `randomangleoffset` (number, optional): Maximum angle offset in degrees (default: 30)

**Returns:**
None

**Example:**
```lua
-- Targeted magic missile system
local function FireMagicMissile(caster, target, accuracy)
    local missile = SpawnPrefab("magic_missile")
    
    -- Calculate accuracy (lower offset = higher accuracy)
    local angle_offset = (100 - accuracy) * 0.3  -- 0-30 degrees based on accuracy
    
    LaunchAt(
        missile,        -- magic missile
        caster,         -- spell caster
        target,         -- intended target
        2,              -- medium speed
        1,              -- start at waist height
        0.5,            -- slight offset from caster
        angle_offset    -- accuracy-based spread
    )
    
    -- Add homing behavior after initial launch
    missile:DoPeriodicTask(0.1, function()
        if target and target:IsValid() then
            local missile_pos = missile:GetPosition()
            local target_pos = target:GetPosition()
            local direction = (target_pos - missile_pos):Normalize()
            
            -- Slight course correction
            local current_vel = Vector3(missile.Physics:GetVel())
            local corrected_vel = current_vel + direction * 0.5
            missile.Physics:SetVel(corrected_vel:Get())
        end
    end)
end

-- Area bombardment system
local function BombardArea(artillery, center_target, num_shells, spread_radius)
    for i = 1, num_shells do
        artillery:DoTaskInTime(i * 0.3, function()
            local shell = SpawnPrefab("artillery_shell")
            
            -- Create virtual target around the center
            local angle = (i / num_shells) * 360 * DEGREES
            local spread = math.random() * spread_radius
            local virtual_target = {
                Transform = {
                    GetWorldPosition = function()
                        local cx, cy, cz = center_target.Transform:GetWorldPosition()
                        return cx + math.cos(angle) * spread, cy, cz + math.sin(angle) * spread
                    end
                },
                GetAngleToPoint = function(_, x, y, z)
                    local tx, ty, tz = center_target.Transform:GetWorldPosition()
                    return math.atan2(tz - z, tx - x) * RADIANS
                end
            }
            
            LaunchAt(
                shell,           -- artillery shell
                artillery,       -- artillery piece
                virtual_target,  -- randomized target
                3,               -- high speed
                2,               -- high starting point
                1,               -- start in front of artillery
                15               -- moderate spread for area effect
            )
        end)
    end
end

-- Smart enemy projectile system
local function EnemyRangedAttack(enemy, player_target)
    local projectile = SpawnPrefab("enemy_projectile")
    
    -- Adjust accuracy based on distance and enemy skill
    local distance = enemy:GetDistanceSqToInst(player_target)
    local base_accuracy = 20  -- Base spread
    local distance_penalty = math.sqrt(distance) * 2  -- More spread at distance
    local final_spread = base_accuracy + distance_penalty
    
    LaunchAt(
        projectile,      -- enemy projectile
        enemy,           -- attacking enemy
        player_target,   -- player target
        1.5,             -- moderate speed
        0.8,             -- shoulder height
        0.3,             -- slight forward offset
        final_spread     -- distance-based accuracy
    )
    
    -- Add projectile tracking
    projectile.target = player_target
    projectile:AddTag("enemy_projectile")
end
```

## Area Destruction Functions

### DestroyEntity(ent, destroyer, kill_all_creatures, remove_entity_as_fallback) {#destroy-entity}

**Status:** `stable`

**Description:**
Intelligently destroys an entity using the most appropriate method based on its components and tags. Handles workable objects, pickable items, creatures, and fallback removal.

**Parameters:**
- `ent` (Entity): Entity to destroy
- `destroyer` (Entity): Entity causing the destruction
- `kill_all_creatures` (boolean): Whether to kill creatures with health
- `remove_entity_as_fallback` (boolean): Whether to remove entity if other methods fail

**Returns:**
None

**Special Handling:**
- **Workable entities**: Uses workable component destruction (trees, rocks, etc.)
- **Pickable entities**: Picks items instead of destroying them
- **Creatures**: Kills entities with health if `kill_all_creatures` is true
- **Combat entities**: Kills stationary combat entities
- **Fallback**: Removes entity if `remove_entity_as_fallback` is true

**Example:**
```lua
-- Smart demolition system
local function DemolishArea(center, radius, demolition_type)
    local x, y, z = center.Transform:GetWorldPosition()
    local entities = TheSim:FindEntities(x, y, z, radius)
    
    for _, entity in ipairs(entities) do
        if entity:IsValid() and entity ~= center then
            if demolition_type == "construction" then
                -- Only destroy workable structures, preserve creatures and items
                DestroyEntity(entity, center, false, false)
                
            elseif demolition_type == "natural_disaster" then
                -- Destroy everything including creatures
                DestroyEntity(entity, center, true, true)
                
            elseif demolition_type == "harvest" then
                -- Gentle destruction that preserves items
                DestroyEntity(entity, center, false, false)
                
            elseif demolition_type == "military" then
                -- Aggressive destruction but don't remove non-destroyable entities
                DestroyEntity(entity, center, true, false)
            end
        end
    end
end

-- Earthquake effect
local function CreateEarthquake(epicenter, magnitude, duration)
    local x, y, z = epicenter.Transform:GetWorldPosition()
    local max_radius = magnitude * 5
    
    -- Progressive destruction waves
    for wave = 1, 5 do
        epicenter:DoTaskInTime(wave * (duration / 5), function()
            local wave_radius = (wave / 5) * max_radius
            local entities = TheSim:FindEntities(x, y, z, wave_radius)
            
            for _, entity in ipairs(entities) do
                if entity:IsValid() then
                    -- Higher chance of destruction closer to epicenter
                    local distance = entity:GetDistanceSqToInst(epicenter)
                    local destruction_chance = 1 - (distance / (max_radius * max_radius))
                    
                    if math.random() < destruction_chance then
                        DestroyEntity(entity, epicenter, false, false)
                        
                        -- Add shake effect
                        if entity.AnimState then
                            entity.AnimState:SetOffset(
                                math.random(-0.2, 0.2),
                                0,
                                math.random(-0.2, 0.2)
                            )
                            
                            entity:DoTaskInTime(0.5, function()
                                if entity:IsValid() then
                                    entity.AnimState:SetOffset(0, 0, 0)
                                end
                            end)
                        end
                    end
                end
            end
        end)
    end
end

-- Controlled demolition for base clearing
local function ControlledDemolition(structures, delay_between)
    delay_between = delay_between or 0.5
    
    for i, structure in ipairs(structures) do
        structure:DoTaskInTime(i * delay_between, function()
            if structure:IsValid() then
                -- Create demolition effect
                local fx = SpawnPrefab("demolition_fx")
                fx.Transform:SetPosition(structure.Transform:GetWorldPosition())
                
                -- Destroy with force
                DestroyEntity(structure, structure, false, true)
                
                print("Demolished: " .. (structure.prefab or "unknown"))
            end
        end)
    end
end
```

### LaunchAndClearArea(inst, radius, launch_basespeed, launch_speedmult, launch_startheight, launch_startradius) {#launch-and-clear-area}

**Status:** `stable`

**Description:**
Comprehensive area effect function that destroys entities and launches items within a radius. Creates realistic explosion or impact effects by combining destruction and physics launching.

**Parameters:**
- `inst` (Entity): Central entity causing the effect
- `radius` (number): Effect radius
- `launch_basespeed` (number): Base speed for launched items
- `launch_speedmult` (number): Speed multiplier for launched items
- `launch_startheight` (number): Starting height for launched items
- `launch_startradius` (number): Starting radius for launched items

**Returns:**
None

**Effect Categories:**
- **Destroys**: Workable objects, pickable items, creatures (based on tags)
- **Launches**: Inventory items with physics (excludes locomotor entities)
- **Special**: Deactivates mines before launching

**Example:**
```lua
-- Bomb explosion system
local function CreateBombExplosion(bomb, explosion_power)
    local base_radius = explosion_power * 2
    local launch_speed = explosion_power * 1.5
    
    -- Create visual explosion effect first
    local fx = SpawnPrefab("explosion_fx")
    fx.Transform:SetPosition(bomb.Transform:GetWorldPosition())
    fx.Transform:SetScale(explosion_power, explosion_power, explosion_power)
    
    -- Launch and clear area
    LaunchAndClearArea(
        bomb,                    -- explosion center
        base_radius,             -- destruction radius
        launch_speed,            -- base launch speed
        launch_speed * 0.5,      -- speed variation
        0.5,                     -- items start slightly above ground
        1                        -- items start 1 unit from center
    )
    
    -- Remove the bomb after explosion
    bomb:Remove()
end

-- Meteor impact system
local function MeteorImpact(meteor, impact_force)
    local x, y, z = meteor.Transform:GetWorldPosition()
    
    -- Create crater effect
    local crater = SpawnPrefab("meteor_crater")
    crater.Transform:SetPosition(x, y, z)
    
    -- Multiple impact waves
    for wave = 1, 3 do
        meteor:DoTaskInTime(wave * 0.1, function()
            LaunchAndClearArea(
                meteor,                      -- impact center
                wave * 3,                    -- expanding radius
                impact_force * (4 - wave),   -- decreasing force
                impact_force * (4 - wave),   -- decreasing variation
                wave * 0.2,                  -- increasing height
                wave                         -- increasing start radius
            )
        end)
    end
    
    meteor:Remove()
end

-- Magical explosion with special effects
local function MagicalExplosion(caster, spell_power, element_type)
    local explosion_radius = spell_power * 1.5
    
    -- Pre-explosion effects
    local warning_fx = SpawnPrefab("magic_warning")
    warning_fx.Transform:SetPosition(caster.Transform:GetWorldPosition())
    
    caster:DoTaskInTime(1, function()  -- 1 second warning
        warning_fx:Remove()
        
        -- Main explosion
        LaunchAndClearArea(
            caster,              -- spell center
            explosion_radius,    -- magical radius
            spell_power * 2,     -- magical force
            spell_power,         -- force variation
            1,                   -- magical levitation
            0.5                  -- tight start radius
        )
        
        -- Element-specific aftereffects
        local x, y, z = caster.Transform:GetWorldPosition()
        if element_type == "fire" then
            -- Leave burning patches
            for i = 1, 5 do
                local fire = SpawnPrefab("fire_patch")
                local angle = (i / 5) * 360 * DEGREES
                local distance = explosion_radius * 0.7
                fire.Transform:SetPosition(
                    x + math.cos(angle) * distance,
                    y,
                    z + math.sin(angle) * distance
                )
            end
            
        elseif element_type == "ice" then
            -- Freeze remaining entities
            local survivors = TheSim:FindEntities(x, y, z, explosion_radius * 1.2)
            for _, survivor in ipairs(survivors) do
                if survivor.components.freezable then
                    survivor.components.freezable:AddColdness(100)
                end
            end
            
        elseif element_type == "lightning" then
            -- Chain lightning to nearby entities
            local targets = TheSim:FindEntities(x, y, z, explosion_radius * 2)
            for _, target in ipairs(targets) do
                if target.components.health then
                    local lightning = SpawnPrefab("lightning_fx")
                    lightning.Transform:SetPosition(target.Transform:GetWorldPosition())
                end
            end
        end
    end)
end

-- Building collapse system
local function TriggerBuildingCollapse(building, collapse_direction)
    local x, y, z = building.Transform:GetWorldPosition()
    
    -- Gradual collapse with directional bias
    for stage = 1, 4 do
        building:DoTaskInTime(stage * 0.3, function()
            if building:IsValid() then
                local stage_radius = stage * 2
                local directional_offset = collapse_direction * stage
                
                LaunchAndClearArea(
                    building,                           -- collapse center
                    stage_radius,                       -- expanding destruction
                    5 + stage,                         -- increasing force
                    3,                                 -- consistent variation
                    0.1 * stage,                       -- progressive height
                    1                                  -- consistent start radius
                )
                
                -- Create dust clouds
                local dust = SpawnPrefab("dust_cloud")
                dust.Transform:SetPosition(
                    x + directional_offset.x,
                    y,
                    z + directional_offset.z
                )
            end
        end)
    end
    
    -- Final building removal
    building:DoTaskInTime(1.5, function()
        if building:IsValid() then
            building:Remove()
        end
    end)
end
```

## Constants and Tags

The module references several important constants and tag sets:

### Collision-Related Constants
```lua
-- Used in entity destruction and area clearing
COLLAPSIBLE_WORK_ACTIONS = {
    CHOP = true,      -- Trees and wooden structures
    DIG = true,       -- Buried or planted items
    HAMMER = true,    -- Built structures
    MINE = true,      -- Rocks and mineral deposits
}

COLLAPSIBLE_TAGS = { 
    "_combat", "pickable", "NPC_workable",
    "CHOP_workable", "DIG_workable", 
    "HAMMER_workable", "MINE_workable" 
}

NON_COLLAPSIBLE_TAGS = { 
    "antlion", "groundspike", "flying", "shadow", 
    "ghost", "playerghost", "FX", "NOCLICK", 
    "DECOR", "INLIMBO" 
}

TOSS_MUST_TAGS = { "_inventoryitem" }
TOSS_CANT_TAGS = { "locomotor", "INLIMBO" }
```

## Integration Examples

### Complete Physics-Based Game System

```lua
-- Advanced physics-based interaction system
local PhysicsGameSystem = {}

function PhysicsGameSystem:Initialize()
    self.active_explosions = {}
    self.collision_handlers = {}
    self.launch_effects = {}
end

function PhysicsGameSystem:RegisterExplosive(entity, power, explosion_type)
    entity.explosion_power = power
    entity.explosion_type = explosion_type
    
    -- Register collision callback for detonation
    PhysicsCollisionCallbacks[entity.GUID] = function(inst, other, ...)
        if other.components.health or other:HasTag("structure") then
            self:TriggerExplosion(inst, inst.explosion_power, inst.explosion_type)
        end
    end
end

function PhysicsGameSystem:TriggerExplosion(source, power, explosion_type)
    local explosion_id = source.GUID .. "_" .. GetTime()
    self.active_explosions[explosion_id] = true
    
    if explosion_type == "fragmentation" then
        -- Multiple small explosions
        for i = 1, power do
            source:DoTaskInTime(i * 0.1, function()
                LaunchAndClearArea(source, power * 0.5, power * 2, power, 0.3, 0.8)
            end)
        end
        
    elseif explosion_type == "incendiary" then
        -- Fire-based explosion
        LaunchAndClearArea(source, power * 1.5, power, power * 0.5, 0.2, 1)
        self:CreateFireField(source, power * 2)
        
    elseif explosion_type == "concussive" then
        -- High-force, low-damage explosion
        LaunchAndClearArea(source, power * 2, power * 3, power * 2, 0.8, 1.5)
        
    else
        -- Standard explosion
        LaunchAndClearArea(source, power, power * 1.5, power, 0.4, 1)
    end
    
    self.active_explosions[explosion_id] = nil
end

function PhysicsGameSystem:CreateChainReaction(entities, reaction_delay)
    reaction_delay = reaction_delay or 0.3
    
    for i, entity in ipairs(entities) do
        entity:DoTaskInTime(i * reaction_delay, function()
            if entity:IsValid() and entity.explosion_power then
                self:TriggerExplosion(entity, entity.explosion_power, entity.explosion_type)
            end
        end)
    end
end

return PhysicsGameSystem
```

## Related Modules

- [Collision Constants](./constants.md): COLLISION mask constants used in CollisionMaskBatcher
- [Entity Script](./entityscript.md): Base entity functionality for physics entities
- [Components](../components/): Physics-related components like locomotor and health
- [Debug Tools](./debugtools.md): Physics debugging and visualization tools
- [World Generation](./map/): World physics setup and configuration

## Performance Considerations

- **Collision Callbacks**: Only register callbacks for entities that need them to avoid unnecessary overhead
- **Collision Mask Batching**: Use CollisionMaskBatcher for multiple mask operations to reduce C++ calls
- **Area Effects**: Large radius effects can impact performance - use staged execution for major explosions
- **Physics Queries**: Entity finding operations in large areas should be used judiciously
- **Cleanup**: Always remove collision callbacks when entities are destroyed to prevent memory leaks

## Security and Safety Notes

- **Entity Validation**: Always check if entities are valid before performing physics operations
- **Null Checks**: Verify Physics component exists before calling physics methods
- **Cleanup**: Properly remove collision callbacks to prevent orphaned references
- **Performance**: Limit simultaneous large-scale physics operations to maintain frame rate
