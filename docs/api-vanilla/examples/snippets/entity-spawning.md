---
id: entity-spawning
title: Entity Spawning Snippets
sidebar_position: 1
---

# Entity Spawning Snippets

This page provides reusable code snippets for spawning entities in Don't Starve Together.

## Basic Entity Spawning

### Spawn a Simple Entity

```lua
-- Spawn a basic entity at the player's position
local function SpawnEntityAtPlayer(prefab)
    local player = ThePlayer
    if player then
        local x, y, z = player.Transform:GetWorldPosition()
        local entity = SpawnPrefab(prefab)
        entity.Transform:SetPosition(x, y, z)
        return entity
    end
    return nil
end

-- Usage
local rabbit = SpawnEntityAtPlayer("rabbit")
```

### Spawn at Specific Position

```lua
-- Spawn an entity at specific coordinates
local function SpawnEntityAt(prefab, x, y, z)
    local entity = SpawnPrefab(prefab)
    entity.Transform:SetPosition(x, y, z)
    return entity
end

-- Usage
local beefalo = SpawnEntityAt("beefalo", 100, 0, 100)
```

## Advanced Entity Spawning

### Spawn with Offset

```lua
-- Spawn an entity with offset from a position
local function SpawnEntityWithOffset(prefab, pos, offset_x, offset_y, offset_z)
    local entity = SpawnPrefab(prefab)
    entity.Transform:SetPosition(pos.x + offset_x, pos.y + offset_y, pos.z + offset_z)
    return entity
end

-- Usage
local player_pos = ThePlayer:GetPosition()
local spider = SpawnEntityWithOffset("spider", player_pos, 5, 0, 5)
```

### Spawn Multiple Entities in a Pattern

```lua
-- Spawn entities in a circle pattern
local function SpawnEntitiesInCircle(prefab, center_pos, radius, count)
    local entities = {}
    local angle_step = 2 * math.pi / count
    
    for i = 1, count do
        local angle = angle_step * i
        local x = center_pos.x + radius * math.cos(angle)
        local z = center_pos.z + radius * math.sin(angle)
        
        local entity = SpawnPrefab(prefab)
        entity.Transform:SetPosition(x, center_pos.y, z)
        table.insert(entities, entity)
    end
    
    return entities
end

-- Usage
local player_pos = ThePlayer:GetPosition()
local hounds = SpawnEntitiesInCircle("hound", player_pos, 10, 5)
```

### Spawn with Components Configuration

```lua
-- Spawn an entity with specific component configurations
local function SpawnConfiguredEntity(prefab, pos, config)
    local entity = SpawnPrefab(prefab)
    entity.Transform:SetPosition(pos:Get())
    
    -- Configure components based on provided config
    if config.health and entity.components.health then
        entity.components.health:SetMaxHealth(config.health)
        entity.components.health:SetPercent(config.health_percent or 1)
    end
    
    if config.combat and entity.components.combat then
        entity.components.combat:SetDefaultDamage(config.combat.damage or 10)
        entity.components.combat:SetAttackPeriod(config.combat.period or 2)
    end
    
    if config.lootdropper and entity.components.lootdropper then
        entity.components.lootdropper:SetLoot(config.lootdropper.loot or {})
    end
    
    return entity
end

-- Usage
local config = {
    health = 200,
    health_percent = 0.5,
    combat = {
        damage = 20,
        period = 3
    },
    lootdropper = {
        loot = {"meat", "meat"}
    }
}

local player_pos = ThePlayer:GetPosition()
local custom_hound = SpawnConfiguredEntity("hound", player_pos, config)
```

## Special Spawning Techniques

### Spawn with Safe Position Finding

```lua
-- Spawn an entity at a safe position near the target
local function SpawnEntityAtSafePosition(prefab, near_pos, min_dist, max_dist)
    local entity = SpawnPrefab(prefab)
    
    -- Try to find a valid spawn position
    local function IsValidSpawnPoint(pt)
        return TheWorld.Map:IsPassableAtPoint(pt.x, pt.y, pt.z) and
               not TheWorld.Map:IsPointNearHole(pt) and
               TheWorld.Map:GetTileAtPoint(pt.x, pt.y, pt.z) ~= GROUND.IMPASSABLE
    end
    
    -- Try several positions
    local theta = math.random() * 2 * math.pi
    local radius = min_dist
    local attempts = 0
    local max_attempts = 20
    
    while attempts < max_attempts do
        radius = min_dist + (max_dist - min_dist) * (attempts / max_attempts)
        local offset = Vector3(radius * math.cos(theta), 0, radius * math.sin(theta))
        local pos = near_pos + offset
        
        if IsValidSpawnPoint(pos) then
            entity.Transform:SetPosition(pos:Get())
            return entity
        end
        
        theta = theta + math.pi * 0.5
        attempts = attempts + 1
    end
    
    -- If no safe position found, use the original position
    entity.Transform:SetPosition(near_pos:Get())
    return entity
end

-- Usage
local player_pos = ThePlayer:GetPosition()
local safe_spider = SpawnEntityAtSafePosition("spider", player_pos, 5, 15)
```

### Spawn with Delayed Activation

```lua
-- Spawn an entity that activates after a delay
local function SpawnDelayedEntity(prefab, pos, delay, activation_fn)
    local entity = SpawnPrefab(prefab)
    entity.Transform:SetPosition(pos:Get())
    
    -- Initially disable the entity if possible
    if entity.components.combat then
        entity.components.combat:SetTarget(nil)
    end
    
    if entity.components.locomotor then
        entity.components.locomotor:Stop()
    end
    
    -- Add a task to activate the entity after delay
    entity:DoTaskInTime(delay, function(inst)
        if activation_fn then
            activation_fn(inst)
        else
            -- Default activation behavior
            if inst.sg then
                inst.sg:GoToState("idle")
            end
            
            if inst.components.sleeper then
                inst.components.sleeper:WakeUp()
            end
        end
    end)
    
    return entity
end

-- Usage
local player_pos = ThePlayer:GetPosition()
local delayed_hound = SpawnDelayedEntity("hound", player_pos, 5, function(inst)
    inst.components.combat:SetTarget(ThePlayer)
end)
```

### Spawn with Network Synchronization

```lua
-- Spawn an entity with proper network synchronization
local function SpawnNetworkedEntity(prefab, pos)
    -- Only the server should spawn the actual entity
    if TheWorld.ismastersim then
        local entity = SpawnPrefab(prefab)
        entity.Transform:SetPosition(pos:Get())
        return entity
    else
        -- On client, we can request the server to spawn
        SendRPCToServer(RPC.SpawnPrefab, prefab, pos.x, pos.y, pos.z)
        return nil
    end
end

-- Server-side RPC handler (add to modmain.lua)
-- AddModRPCHandler("ModName", "SpawnPrefab", function(player, prefab, x, y, z)
--     local entity = SpawnPrefab(prefab)
--     entity.Transform:SetPosition(x, y, z)
-- end)

-- Usage
local player_pos = ThePlayer:GetPosition()
local networked_entity = SpawnNetworkedEntity("rabbit", player_pos)
```

## Spawning Special Effects

### Spawn FX at Entity

```lua
-- Spawn a visual effect at an entity's position
local function SpawnFXAtEntity(fx_prefab, entity, height_offset)
    if entity and entity:IsValid() then
        local x, y, z = entity.Transform:GetWorldPosition()
        local fx = SpawnPrefab(fx_prefab)
        fx.Transform:SetPosition(x, y + (height_offset or 0), z)
        return fx
    end
    return nil
end

-- Usage
local fx = SpawnFXAtEntity("statue_transition", ThePlayer, 1)
```

### Spawn FX with Automatic Cleanup

```lua
-- Spawn a temporary effect that cleans itself up
local function SpawnTemporaryFX(fx_prefab, pos, duration)
    local fx = SpawnPrefab(fx_prefab)
    fx.Transform:SetPosition(pos:Get())
    
    -- Set up automatic removal after duration
    fx:DoTaskInTime(duration, function(inst)
        inst:Remove()
    end)
    
    return fx
end

-- Usage
local player_pos = ThePlayer:GetPosition()
local temp_fx = SpawnTemporaryFX("collapse_small", player_pos, 5)
```

## Spawning Groups and Structures

### Spawn Structure with Surrounding Entities

```lua
-- Spawn a structure with surrounding entities
local function SpawnStructureWithGuards(structure_prefab, guard_prefab, pos, guard_count, radius)
    -- Spawn the main structure
    local structure = SpawnPrefab(structure_prefab)
    structure.Transform:SetPosition(pos:Get())
    
    -- Spawn guards around it
    local guards = {}
    local angle_step = 2 * math.pi / guard_count
    
    for i = 1, guard_count do
        local angle = angle_step * i
        local x = pos.x + radius * math.cos(angle)
        local z = pos.z + radius * math.sin(angle)
        
        local guard = SpawnPrefab(guard_prefab)
        guard.Transform:SetPosition(x, pos.y, z)
        
        -- Make guards protect the structure
        if guard.components.combat then
            guard:ListenForEvent("attacked", function(inst, data)
                if structure:IsValid() and data.attacker and 
                   data.attacker.components.combat then
                    guard.components.combat:SetTarget(data.attacker)
                end
            end, structure)
        end
        
        table.insert(guards, guard)
    end
    
    return structure, guards
end

-- Usage
local player_pos = ThePlayer:GetPosition()
local nest, spiders = SpawnStructureWithGuards("spiderden", "spider", player_pos, 3, 3)
```

### Spawn Linked Entities

```lua
-- Spawn two entities that are linked to each other
local function SpawnLinkedEntities(prefab1, prefab2, pos1, pos2, link_tag)
    local entity1 = SpawnPrefab(prefab1)
    local entity2 = SpawnPrefab(prefab2)
    
    entity1.Transform:SetPosition(pos1:Get())
    entity2.Transform:SetPosition(pos2:Get())
    
    -- Create a link between the entities
    link_tag = link_tag or "linked_entity_" .. tostring(math.random(1000000))
    entity1:AddTag(link_tag)
    entity2:AddTag(link_tag)
    
    entity1.linked_entity = entity2
    entity2.linked_entity = entity1
    
    return entity1, entity2
end

-- Usage
local pos1 = ThePlayer:GetPosition()
local pos2 = pos1 + Vector3(20, 0, 0)
local wormhole1, wormhole2 = SpawnLinkedEntities("wormhole", "wormhole", pos1, pos2, "wormhole_pair_1")
```

These snippets provide a foundation for various entity spawning scenarios in Don't Starve Together mods. Adapt them to your specific needs and combine them for more complex spawning behaviors. 