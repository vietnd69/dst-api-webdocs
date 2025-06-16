---
id: resource-usage
title: Reducing Resource Usage
sidebar_position: 11
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Reducing Resource Usage in Mods

This guide focuses on strategies to minimize resource consumption in Don't Starve Together mods, ensuring they run efficiently on a variety of hardware configurations and server environments.

## Understanding Resource Constraints

When developing mods for Don't Starve Together, it's important to consider various resource constraints:

- **Memory Usage**: Excessive memory consumption can lead to game crashes or degraded performance
- **CPU Utilization**: High CPU usage causes frame rate drops and gameplay lag
- **Network Bandwidth**: In multiplayer, network traffic can become a bottleneck
- **File Size**: Large mods take longer to download and may deter players from installing

## Memory Optimization Techniques

### 1. Avoid Table Bloat

Tables in Lua are the primary data structure, but they can consume significant memory if not managed properly:

```lua
-- INEFFICIENT: Creating new tables constantly
function OnUpdate()
    -- This creates a new table every update
    local nearby_entities = {}
    
    -- Fill with data
    for i = 1, 100 do
        nearby_entities[i] = {
            id = i,
            position = {x = i, y = 0, z = i},
            data = "Entity " .. i
        }
    end
    
    -- Process data
    ProcessEntities(nearby_entities)
    
    -- Table becomes garbage after function ends
end
```

**Optimized Approach**:

```lua
-- OPTIMIZED: Reuse tables
local nearby_entities = {} -- Defined once outside the function

function OnUpdate()
    -- Clear the table instead of creating a new one
    for k in pairs(nearby_entities) do
        nearby_entities[k] = nil
    end
    
    -- Fill with data
    for i = 1, 100 do
        nearby_entities[i] = nearby_entities[i] or {} -- Reuse existing subtable if available
        local entity = nearby_entities[i]
        entity.id = i
        entity.position = entity.position or {} -- Reuse position table
        entity.position.x = i
        entity.position.y = 0
        entity.position.z = i
        entity.data = "Entity " .. i
    end
    
    -- Process data
    ProcessEntities(nearby_entities)
    
    -- Table is reused in next update
end
```

### 2. Implement Object Pooling

For frequently created and destroyed objects, use object pooling to reduce memory churn:

```lua
-- Object pool implementation
local ProjectilePool = {
    active = {},
    inactive = {},
}

function ProjectilePool:Get()
    local projectile
    
    if #self.inactive > 0 then
        -- Reuse an inactive projectile
        projectile = table.remove(self.inactive)
    else
        -- Create a new projectile if none available
        projectile = {
            position = {x = 0, y = 0, z = 0},
            velocity = {x = 0, y = 0, z = 0},
            active_time = 0
        }
    end
    
    table.insert(self.active, projectile)
    return projectile
end

function ProjectilePool:Release(projectile)
    for i, p in ipairs(self.active) do
        if p == projectile then
            table.remove(self.active, i)
            table.insert(self.inactive, projectile)
            return
        end
    end
end

-- Usage example
function FireProjectile(start_pos, direction)
    local projectile = ProjectilePool:Get()
    
    -- Reset properties
    projectile.position.x = start_pos.x
    projectile.position.y = start_pos.y
    projectile.position.z = start_pos.z
    
    projectile.velocity.x = direction.x * 10
    projectile.velocity.y = direction.y * 10
    projectile.velocity.z = direction.z * 10
    
    projectile.active_time = 0
end
```

### 3. Use Sparse Data Structures

For large data sets where most entries are empty, use sparse data structures:

```lua
-- INEFFICIENT: Dense grid representation
local world_grid = {}
for x = -1000, 1000 do
    world_grid[x] = {}
    for z = -1000, 1000 do
        world_grid[x][z] = 0 -- Default value
    end
end

-- Set a few values
world_grid[10][20] = 1
world_grid[50][60] = 2
```

**Optimized Approach**:

```lua
-- OPTIMIZED: Sparse grid representation
local world_grid = {}

-- Helper functions
function SetGridValue(grid, x, z, value)
    grid[x] = grid[x] or {}
    grid[x][z] = value
end

function GetGridValue(grid, x, z)
    return (grid[x] and grid[x][z]) or 0 -- Default value
end

-- Set values only where needed
SetGridValue(world_grid, 10, 20, 1)
SetGridValue(world_grid, 50, 60, 2)

-- Get a value
local value = GetGridValue(world_grid, 10, 20) -- Returns 1
local default_value = GetGridValue(world_grid, 5, 5) -- Returns 0
```

### 4. Minimize Closure Creation

Closures that capture large environments can consume significant memory:

```lua
-- INEFFICIENT: Creating many closures that capture the environment
function CreateEntityProcessors(entities)
    local processors = {}
    
    for i, entity in ipairs(entities) do
        -- This creates a new closure for each entity, capturing 'entity'
        processors[i] = function()
            ProcessEntity(entity)
        end
    end
    
    return processors
end
```

**Optimized Approach**:

```lua
-- OPTIMIZED: Use a single function with parameters
function ProcessEntityById(entity_id)
    local entity = entities[entity_id]
    ProcessEntity(entity)
end

function CreateEntityProcessors(entities)
    local processor_ids = {}
    
    for i, entity in ipairs(entities) do
        processor_ids[i] = entity.id
    end
    
    return processor_ids
end

-- Usage
local ids = CreateEntityProcessors(entities)
for _, id in ipairs(ids) do
    ProcessEntityById(id)
end
```

## CPU Optimization Techniques

### 1. Defer Expensive Calculations

Instead of calculating everything immediately, defer calculations until they're needed:

```lua
-- INEFFICIENT: Calculating everything upfront
function UpdateCreature(creature)
    -- Calculate all possible paths
    local paths = CalculateAllPaths(creature)
    
    -- Calculate visibility for all entities
    local visible_entities = CalculateAllVisibleEntities(creature)
    
    -- Calculate all possible interactions
    local possible_interactions = CalculateAllInteractions(creature, visible_entities)
    
    -- Actually decide what to do
    local chosen_action = ChooseBestAction(creature, paths, visible_entities, possible_interactions)
    
    -- Execute just one action
    ExecuteAction(creature, chosen_action)
end
```

**Optimized Approach**:

```lua
-- OPTIMIZED: Calculate only what's needed
function UpdateCreature(creature)
    -- First determine what type of action is needed
    local action_type = DetermineActionType(creature)
    
    if action_type == "MOVE" then
        -- Only calculate paths if moving
        local path = CalculateBestPath(creature)
        ExecuteMovement(creature, path)
    elseif action_type == "INTERACT" then
        -- Only calculate visible entities if interacting
        local visible_entities = CalculateVisibleEntities(creature)
        local target = ChooseInteractionTarget(creature, visible_entities)
        ExecuteInteraction(creature, target)
    elseif action_type == "IDLE" then
        -- Do minimal work for idle creatures
        ExecuteIdleBehavior(creature)
    end
end
```

### 2. Use Lookup Tables for Expensive Calculations

For calculations that are used repeatedly with the same inputs:

```lua
-- INEFFICIENT: Recalculating values repeatedly
function GetDamageMultiplier(weapon_type, target_type)
    -- Complex calculation based on weapon and target types
    return CalculateDamageMultiplier(weapon_type, target_type)
end
```

**Optimized Approach**:

```lua
-- OPTIMIZED: Use lookup tables
local damage_multipliers = {
    sword = {
        spider = 1.5,
        skeleton = 1.0,
        ghost = 0.5,
        -- other target types...
    },
    spear = {
        spider = 1.2,
        skeleton = 1.3,
        ghost = 0.3,
        -- other target types...
    },
    -- other weapon types...
}

function GetDamageMultiplier(weapon_type, target_type)
    -- Fast table lookup instead of calculation
    return (damage_multipliers[weapon_type] and damage_multipliers[weapon_type][target_type]) or 1.0
end
```

### 3. Throttle Update Frequency Based on Importance

Not all systems need to update at the same frequency:

```lua
-- Different update frequencies for different systems
function InitializeUpdateSystem()
    -- Critical systems update frequently
    TheWorld:DoPeriodicTask(0.1, UpdateCriticalSystems)
    
    -- Important but not critical systems
    TheWorld:DoPeriodicTask(0.5, UpdateImportantSystems)
    
    -- Background systems can update slowly
    TheWorld:DoPeriodicTask(1.0, UpdateBackgroundSystems)
    
    -- Very infrequent updates for non-critical systems
    TheWorld:DoPeriodicTask(5.0, UpdateNonCriticalSystems)
end
```

### 4. Implement Dirty Flags

Only update what has changed:

```lua
local StatusComponent = Class(function(self, inst)
    self.inst = inst
    self.values = {
        health = 100,
        hunger = 100,
        sanity = 100
    }
    self.dirty = {
        health = true,
        hunger = true,
        sanity = true
    }
    
    self.inst:DoPeriodicTask(0.5, function() self:Update() end)
end)

function StatusComponent:SetValue(key, value)
    if self.values[key] ~= value then
        self.values[key] = value
        self.dirty[key] = true
    end
end

function StatusComponent:Update()
    -- Only update what has changed
    if self.dirty.health then
        self:UpdateHealthDisplay()
        self.dirty.health = false
    end
    
    if self.dirty.hunger then
        self:UpdateHungerDisplay()
        self.dirty.hunger = false
    end
    
    if self.dirty.sanity then
        self:UpdateSanityDisplay()
        self.dirty.sanity = false
    end
end
```

## Network Bandwidth Optimization

### 1. Prioritize Network Updates

Not all data needs to be synchronized at the same frequency:

```lua
local SyncComponent = Class(function(self, inst)
    self.inst = inst
    self.last_sync = {
        position = 0,
        animation = 0,
        status = 0
    }
    self.sync_frequency = {
        position = 0.1,  -- Position updates frequently
        animation = 0.5, -- Animation state less frequently
        status = 1.0     -- Status updates infrequently
    }
    
    self.inst:DoPeriodicTask(0.1, function() self:TrySyncData() end)
end)

function SyncComponent:TrySyncData()
    local current_time = GetTime()
    
    -- Check if it's time to sync each data type
    if current_time - self.last_sync.position >= self.sync_frequency.position then
        self:SyncPosition()
        self.last_sync.position = current_time
    end
    
    if current_time - self.last_sync.animation >= self.sync_frequency.animation then
        self:SyncAnimation()
        self.last_sync.animation = current_time
    end
    
    if current_time - self.last_sync.status >= self.sync_frequency.status then
        self:SyncStatus()
        self.last_sync.status = current_time
    end
end
```

### 2. Implement Delta Compression

Send only what has changed:

```lua
local NetworkSync = Class(function(self, inst)
    self.inst = inst
    self.last_sent_state = {
        position = {x=0, y=0, z=0},
        health = 100,
        inventory = {}
    }
    
    self.inst:DoPeriodicTask(0.5, function() self:SyncState() end)
end)

function NetworkSync:SyncState()
    local current_state = self:GetCurrentState()
    local delta = self:CalculateDelta(self.last_sent_state, current_state)
    
    -- Only send if there are changes
    if next(delta) ~= nil then
        self:SendStateDelta(delta)
        self.last_sent_state = current_state
    end
end

function NetworkSync:CalculateDelta(old_state, new_state)
    local delta = {}
    
    -- Check position change
    if math.abs(old_state.position.x - new_state.position.x) > 0.1 or
       math.abs(old_state.position.z - new_state.position.z) > 0.1 then
        delta.position = new_state.position
    end
    
    -- Check health change
    if old_state.health ~= new_state.health then
        delta.health = new_state.health
    end
    
    -- Check inventory changes
    for item, count in pairs(new_state.inventory) do
        if old_state.inventory[item] ~= count then
            delta.inventory = delta.inventory or {}
            delta.inventory[item] = count
        end
    end
    
    return delta
end
```

### 3. Batch Network Updates

Group multiple updates into a single network message:

```lua
local NetworkBatcher = Class(function(self, inst)
    self.inst = inst
    self.pending_updates = {}
    self.last_send_time = 0
    self.send_interval = 0.5
    
    self.inst:DoPeriodicTask(0.1, function() self:TrySendBatch() end)
end)

function NetworkBatcher:QueueUpdate(entity_id, data)
    self.pending_updates[entity_id] = self.pending_updates[entity_id] or {}
    
    -- Merge the new data with any existing queued data
    for k, v in pairs(data) do
        self.pending_updates[entity_id][k] = v
    end
end

function NetworkBatcher:TrySendBatch()
    local current_time = GetTime()
    
    -- Send batch if it's time or if we have too many updates
    if current_time - self.last_send_time >= self.send_interval or #self.pending_updates > 10 then
        if next(self.pending_updates) ~= nil then
            self:SendBatch(self.pending_updates)
            self.pending_updates = {}
            self.last_send_time = current_time
        end
    end
end
```

## File Size Optimization

### 1. Optimize Assets

Reduce the size of included assets:

- Compress textures appropriately
- Use audio formats with good compression
- Consider using texture atlases instead of individual images
- Use lower resolution textures for less important elements

### 2. Split Mods into Modules

For large mods, consider splitting into core and optional modules:

```lua
-- In modmain.lua
local function LoadOptionalModule(name)
    local success, module = pcall(require, "modules/" .. name)
    if success then
        print("Loaded optional module: " .. name)
        return module
    else
        print("Optional module not available: " .. name)
        return nil
    end
end

-- Core functionality always loaded
local core = require("modules/core")

-- Optional high-resolution textures
local high_res = LoadOptionalModule("highres")

-- Optional additional content
local expansion = LoadOptionalModule("expansion")
```

### 3. Use Runtime Generation

Generate content procedurally instead of storing it:

```lua
-- INEFFICIENT: Storing many pre-made variations
local tree_variations = {
    {branches = {{x=0, y=1}, {x=1, y=2}, {x=-1, y=2}, {x=0.5, y=3}, {x=-0.5, y=3}}},
    {branches = {{x=0, y=1}, {x=2, y=1.5}, {x=-1, y=2}, {x=0, y=3}}},
    {branches = {{x=0, y=1}, {x=1, y=1}, {x=-1, y=1}, {x=0, y=2}, {x=0, y=3}}},
    -- Many more variations...
}
```

**Optimized Approach**:

```lua
-- OPTIMIZED: Generate variations procedurally
function GenerateTreeVariation(seed)
    math.randomseed(seed)
    
    local branches = {{x=0, y=1}} -- Start with trunk
    local branch_count = math.random(3, 6)
    
    for i = 1, branch_count do
        table.insert(branches, {
            x = math.random(-10, 10) / 10,
            y = 1 + math.random(0, 20) / 10
        })
    end
    
    return {branches = branches}
end

-- Generate only when needed
function GetTreeVariation(tree_id)
    return GenerateTreeVariation(tree_id)
end
```

## Practical Example: Optimizing a Weather Mod

Let's look at a practical example of optimizing a weather mod that was consuming too many resources:

### Original Implementation (Resource-Heavy)

```lua
-- Weather effect system with high resource usage
local WeatherSystem = Class(function(self, inst)
    self.inst = inst
    
    -- Track all entities in the world
    self.affected_entities = {}
    
    -- Create many particle effects
    self.particles = {}
    for i = 1, 1000 do
        local particle = SpawnPrefab("weather_particle")
        table.insert(self.particles, particle)
    end
    
    -- Update every entity every frame
    self.inst:DoPeriodicTask(0, function()
        self:UpdateAllEntities()
        self:UpdateAllParticles()
    end)
    
    -- Network sync every frame
    if TheWorld.ismastersim then
        self.inst:DoPeriodicTask(0, function()
            self:SyncToClients()
        end)
    end
end)

function WeatherSystem:UpdateAllEntities()
    -- Find all entities in the world
    local x, y, z = Vector3(ThePlayer.Transform:GetWorldPosition())
    local entities = TheSim:FindEntities(x, y, z, 100)
    
    -- Process every entity
    for _, entity in ipairs(entities) do
        self:ApplyWeatherEffect(entity)
    end
end

function WeatherSystem:UpdateAllParticles()
    -- Update every particle every frame
    for _, particle in ipairs(self.particles) do
        self:UpdateParticle(particle)
    end
end

function WeatherSystem:SyncToClients()
    -- Send full state to all clients
    SendModRPCToClients(GetClientModRPC("WeatherMod", "SyncWeather"), 
                        json.encode(self:GetFullState()))
end
```

### Optimized Implementation

```lua
-- Optimized weather system
local WeatherSystem = Class(function(self, inst)
    self.inst = inst
    
    -- Track entities by distance from player
    self.affected_entities = {
        near = {},   -- Updated frequently
        medium = {}, -- Updated less frequently
        far = {}     -- Updated rarely
    }
    
    -- Particle pool
    self.particle_pool = {
        active = {},
        inactive = {},
        max_active = 200 -- Limit active particles
    }
    
    -- Create a smaller initial pool
    for i = 1, 50 do
        local particle = SpawnPrefab("weather_particle")
        particle:Hide()
        table.insert(self.particle_pool.inactive, particle)
    end
    
    -- Update entities at different rates
    self.inst:DoPeriodicTask(0.1, function() self:UpdateNearEntities() end)
    self.inst:DoPeriodicTask(0.5, function() self:UpdateMediumEntities() end)
    self.inst:DoPeriodicTask(2.0, function() self:UpdateFarEntities() end)
    
    -- Update particles in batches
    self.inst:DoPeriodicTask(0.1, function() self:UpdateParticleBatch() end)
    
    -- Network sync with throttling
    if TheWorld.ismastersim then
        self.last_sync = 0
        self.sync_interval = 0.5
        self.dirty = false
        
        self.inst:DoPeriodicTask(0.1, function() self:TrySyncToClients() end)
    end
end)

function WeatherSystem:CategorizeEntity(entity)
    local player = ThePlayer
    if not player then return "far" end
    
    local dist = entity:GetDistanceSqToPoint(player.Transform:GetWorldPosition())
    
    if dist < 20*20 then
        return "near"
    elseif dist < 50*50 then
        return "medium"
    else
        return "far"
    end
end

function WeatherSystem:UpdateEntityCategories()
    local player = ThePlayer
    if not player then return end
    
    -- Only recategorize periodically
    local x, y, z = player.Transform:GetWorldPosition()
    local entities = TheSim:FindEntities(x, y, z, 100, nil, {"INLIMBO"})
    
    -- Clear categories
    self.affected_entities.near = {}
    self.affected_entities.medium = {}
    self.affected_entities.far = {}
    
    -- Categorize entities by distance
    for _, entity in ipairs(entities) do
        local category = self:CategorizeEntity(entity)
        table.insert(self.affected_entities[category], entity)
    end
end

function WeatherSystem:UpdateNearEntities()
    for _, entity in ipairs(self.affected_entities.near) do
        if entity:IsValid() then
            self:ApplyWeatherEffect(entity, 1.0) -- Full effect
        end
    end
end

function WeatherSystem:UpdateMediumEntities()
    for _, entity in ipairs(self.affected_entities.medium) do
        if entity:IsValid() then
            self:ApplyWeatherEffect(entity, 0.7) -- Reduced effect
        end
    end
    
    -- Recategorize entities periodically
    self:UpdateEntityCategories()
end

function WeatherSystem:UpdateFarEntities()
    for _, entity in ipairs(self.affected_entities.far) do
        if entity:IsValid() then
            self:ApplyWeatherEffect(entity, 0.3) -- Minimal effect
        end
    end
end

function WeatherSystem:GetParticle()
    -- Reuse an inactive particle if available
    if #self.particle_pool.inactive > 0 then
        local particle = table.remove(self.particle_pool.inactive)
        particle:Show()
        table.insert(self.particle_pool.active, particle)
        return particle
    end
    
    -- Only create new particles if under the limit
    if #self.particle_pool.active < self.particle_pool.max_active then
        local particle = SpawnPrefab("weather_particle")
        table.insert(self.particle_pool.active, particle)
        return particle
    end
    
    -- Return nil if at the limit
    return nil
end

function WeatherSystem:ReleaseParticle(particle)
    for i, p in ipairs(self.particle_pool.active) do
        if p == particle then
            table.remove(self.particle_pool.active, i)
            particle:Hide()
            table.insert(self.particle_pool.inactive, particle)
            return
        end
    end
end

function WeatherSystem:UpdateParticleBatch()
    -- Process particles in batches
    local batch_size = 20
    local count = 0
    
    for i = 1, math.min(batch_size, #self.particle_pool.active) do
        local particle = self.particle_pool.active[i]
        if particle:IsValid() then
            if not self:UpdateParticle(particle) then
                self:ReleaseParticle(particle)
            end
        else
            self:ReleaseParticle(particle)
        end
        count = count + 1
    end
    
    -- Spawn new particles if needed
    local player = ThePlayer
    if player and count < batch_size then
        local x, y, z = player.Transform:GetWorldPosition()
        for i = 1, math.random(1, 3) do
            local particle = self:GetParticle()
            if particle then
                self:InitializeParticle(particle, x, y, z)
            end
        end
    end
end

function WeatherSystem:TrySyncToClients()
    if not TheWorld.ismastersim then return end
    
    local current_time = GetTime()
    
    -- Only sync if dirty and not too recent
    if self.dirty and current_time - self.last_sync >= self.sync_interval then
        -- Send only changed data
        SendModRPCToClients(GetClientModRPC("WeatherMod", "SyncWeather"), 
                           json.encode(self:GetDeltaState()))
        self.last_sync = current_time
        self.dirty = false
    end
end

function WeatherSystem:MarkDirty()
    self.dirty = true
end
```

## Conclusion

By implementing these resource optimization techniques, your mods will run more efficiently, use less memory, and provide a better experience for players. Remember to:

1. **Measure First**: Profile your mod to identify the biggest resource consumers
2. **Optimize Strategically**: Focus on the areas that will give the biggest improvements
3. **Test Thoroughly**: Ensure optimizations don't introduce new bugs
4. **Balance Performance and Features**: Sometimes it's better to scale back features than to include poorly performing ones

With these approaches, you can create complex, feature-rich mods that still run smoothly on a variety of hardware configurations.

## See also

- [Performance Optimization](optimization.md) - General performance optimization techniques
- [Network System](../core/network-system.md) - More details on networking in DST
- [Event System](../core/event-system.md) - Using events efficiently
- [Entity System](../core/entity-system.md) - Working with entities efficiently 
