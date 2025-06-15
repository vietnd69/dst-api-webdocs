---
id: optimization
title: Performance Optimization
sidebar_position: 10
last_updated: 2023-07-06
---

# Performance Optimization Techniques

This guide covers techniques for optimizing your Don't Starve Together mods to ensure they run efficiently without causing lag or performance issues.

## Understanding Performance Concerns

Performance is critical in Don't Starve Together mods for several reasons:

- The game must maintain a steady frame rate across various hardware
- In multiplayer, poor optimization can affect all connected players
- Complex mods can significantly impact server performance
- Performance issues compound when multiple mods are installed

## Key Areas for Optimization

### 1. Update Functions

One of the most common performance issues comes from inefficient update functions that run frequently:

```lua
-- INEFFICIENT: Running expensive operations every frame
function Component:OnUpdate(dt)
    -- This runs every frame (potentially 60 times per second)
    local entities = TheSim:FindEntities(x, y, z, 30, nil, {"INLIMBO"})
    for _, ent in ipairs(entities) do
        -- Complex calculations for each entity
        self:ProcessEntity(ent)
    end
end
```

**Optimization Techniques:**

```lua
-- OPTIMIZED: Using periodic tasks instead of every-frame updates
function Component:Init()
    -- Run expensive operations less frequently
    self.task = self.inst:DoPeriodicTask(0.5, function() 
        local entities = TheSim:FindEntities(x, y, z, 30, nil, {"INLIMBO"})
        for _, ent in ipairs(entities) do
            self:ProcessEntity(ent)
        end
    end)
end
```

### 2. Entity Searches

Finding entities is an expensive operation, especially with large search radii:

```lua
-- INEFFICIENT: Large radius, no necessary tags
local entities = TheSim:FindEntities(x, y, z, 50)
```

**Optimization Techniques:**

```lua
-- OPTIMIZED: Smaller radius, specific tags, excluded tags
local entities = TheSim:FindEntities(x, y, z, 20, {"_combat"}, {"INLIMBO", "player", "wall"})
```

### 3. Event Handling

Excessive event listeners can cause performance issues:

```lua
-- INEFFICIENT: Listening to frequent events on many entities
for i = 1, 1000 do
    local inst = SpawnPrefab("prefab")
    inst:ListenForEvent("entitysleep", OnEntitySleep)
    inst:ListenForEvent("entitywake", OnEntityWake)
    inst:ListenForEvent("onremove", OnRemove)
    -- More event listeners...
end
```

**Optimization Techniques:**

```lua
-- OPTIMIZED: Use component system and targeted events
function MyComponent:OnRemove()
    -- Clean up event listeners when removed
    if self.task then
        self.task:Cancel()
        self.task = nil
    end
    
    if self.eventhook then
        self.inst:RemoveEventCallback("entitysleep", self.eventhook)
        self.eventhook = nil
    end
end
```

### 4. Memory Management

Poor memory management can lead to leaks and degraded performance:

```lua
-- INEFFICIENT: Creating new tables constantly
function OnUpdate()
    local data = {}
    -- Fill data
    return data
end
```

**Optimization Techniques:**

```lua
-- OPTIMIZED: Reuse tables
local data_pool = {}

function GetDataFromPool()
    local t = table.remove(data_pool) or {}
    return t
end

function RecycleData(t)
    table.clear(t)
    table.insert(data_pool, t)
end
```

### 5. Network Optimization

Networking is a critical area for optimization in multiplayer games:

```lua
-- INEFFICIENT: Sending updates too frequently
function Component:OnUpdate()
    if TheWorld.ismastersim then
        -- Send full state every frame
        SendModRPCToClient(GetClientModRPC("MyMod", "SyncData"), player.userid, self.inst.GUID, json.encode(self.data))
    end
end
```

**Optimization Techniques:**

```lua
-- OPTIMIZED: Throttle updates and only send changes
function Component:Init()
    self.last_sync_time = 0
    self.dirty = false
    
    self.inst:DoPeriodicTask(0.1, function()
        if TheWorld.ismastersim and self.dirty and (self.last_sync_time + 0.5) < GetTime() then
            -- Only send if data changed and not too recently
            SendModRPCToClient(GetClientModRPC("MyMod", "SyncData"), player.userid, self.inst.GUID, json.encode(self.data))
            self.last_sync_time = GetTime()
            self.dirty = false
        end
    end)
end

function Component:SetValue(key, value)
    if self.data[key] ~= value then
        self.data[key] = value
        self.dirty = true
    end
end
```

## Practical Optimization Example: Area Effect System

Let's optimize a system that applies effects to entities in an area:

### Unoptimized Version

```lua
local AreaEffectComponent = Class(function(self, inst)
    self.inst = inst
    self.radius = 10
    self.effect_fn = nil
    
    -- Update every frame
    self.inst:DoTaskInTime(0, function()
        self.updatetask = self.inst:DoPeriodicTask(0, function() self:ApplyEffect() end)
    end)
end)

function AreaEffectComponent:ApplyEffect()
    if not self.effect_fn then return end
    
    -- Find all entities every frame
    local x, y, z = self.inst.Transform:GetWorldPosition()
    local entities = TheSim:FindEntities(x, y, z, self.radius)
    
    -- Process each entity
    for _, ent in ipairs(entities) do
        self.effect_fn(ent)
    end
end
```

### Optimized Version

```lua
local AreaEffectComponent = Class(function(self, inst)
    self.inst = inst
    self.radius = 10
    self.effect_fn = nil
    self.affected_entities = {}
    self.update_frequency = 0.5
    
    -- Start with a small delay to ensure all components are initialized
    self.inst:DoTaskInTime(0.1, function()
        -- Update less frequently
        self.updatetask = self.inst:DoPeriodicTask(self.update_frequency, function() self:UpdateNearbyEntities() end)
    end)
    
    -- Listen for removal to clean up
    self.inst:ListenForEvent("onremove", function() self:OnRemove() end)
end)

function AreaEffectComponent:UpdateNearbyEntities()
    local x, y, z = self.inst.Transform:GetWorldPosition()
    
    -- Use tags to filter entities more efficiently
    local entities = TheSim:FindEntities(x, y, z, self.radius, nil, {"INLIMBO", "notarget"})
    
    -- Track which entities we've seen this update
    local seen_entities = {}
    
    -- Process only entities that need the effect
    for _, ent in ipairs(entities) do
        seen_entities[ent] = true
        
        -- Only apply effect if not already affected
        if not self.affected_entities[ent] and self.effect_fn then
            self.effect_fn(ent)
            self.affected_entities[ent] = true
            
            -- Listen for entity removal to clean up our references
            self.inst:ListenForEvent("onremove", function() 
                self.affected_entities[ent] = nil 
            end, ent)
        end
    end
    
    -- Remove effects from entities no longer in range
    for ent in pairs(self.affected_entities) do
        if not seen_entities[ent] then
            -- Entity left radius, remove effect
            if self.remove_effect_fn then
                self.remove_effect_fn(ent)
            end
            self.affected_entities[ent] = nil
        end
    end
end

function AreaEffectComponent:OnRemove()
    -- Clean up tasks
    if self.updatetask then
        self.updatetask:Cancel()
        self.updatetask = nil
    end
    
    -- Remove effects from all affected entities
    if self.remove_effect_fn then
        for ent in pairs(self.affected_entities) do
            self.remove_effect_fn(ent)
        end
    end
    
    -- Clear table references
    self.affected_entities = {}
end
```

## Profiling and Debugging

To identify performance bottlenecks, use these techniques:

### 1. In-Game Profiling

```lua
-- Add profiling to your mod
local profile_start = os.clock()

-- Code to profile
local result = ExpensiveFunction()

local duration = os.clock() - profile_start
print("Function took " .. duration .. " seconds")
```

### 2. Frame Time Logging

```lua
-- Log frame times to identify spikes
local last_time = GetTime()

AddPriorityPostInit(function()
    -- Add a periodic task to check frame times
    TheWorld:DoPeriodicTask(1, function()
        local current_time = GetTime()
        local frame_count = TheSim:GetFPS()
        print("FPS: " .. frame_count .. ", Average frame time: " .. (1000/frame_count) .. "ms")
        last_time = current_time
    end)
end)
```

### 3. Memory Usage Tracking

```lua
-- Track memory usage
local function GetMemoryUsage()
    collectgarbage("collect")
    return math.floor(collectgarbage("count"))
end

local initial_memory = GetMemoryUsage()

-- After operations
local current_memory = GetMemoryUsage()
print("Memory change: " .. (current_memory - initial_memory) .. " KB")
```

## Best Practices Checklist

Use this checklist to ensure your mod is optimized:

1. **Update Frequency**
   - [ ] Use appropriate update intervals (not every frame)
   - [ ] Scale update frequency based on importance
   - [ ] Consider using event-based updates instead of periodic when possible

2. **Entity Management**
   - [ ] Limit entity searches with appropriate tags and radius
   - [ ] Cache entity references when appropriate
   - [ ] Clean up references when entities are removed

3. **Memory Usage**
   - [ ] Reuse tables and objects when possible
   - [ ] Clear references in OnRemove functions
   - [ ] Be careful with closures that capture large environments

4. **Network Optimization**
   - [ ] Only send data when it changes
   - [ ] Throttle network updates
   - [ ] Send delta updates instead of full state when possible

5. **Event Handling**
   - [ ] Remove event listeners when no longer needed
   - [ ] Use targeted events instead of global ones
   - [ ] Avoid creating multiple listeners for the same event

## Case Study: Optimizing a Weather Effect Mod

Let's examine a real-world optimization of a weather effect mod:

### Original Implementation

```lua
-- Weather effect that spawns particles and affects players
local WeatherSystem = Class(function(self, inst)
    self.inst = inst
    self.particles = {}
    self.max_particles = 100
    self.player_effect_radius = 30
    
    -- Update particles every frame
    self.inst:DoPeriodicTask(0, function() self:UpdateParticles() end)
    
    -- Apply player effects every frame
    self.inst:DoPeriodicTask(0, function() self:ApplyPlayerEffects() end)
end)

function WeatherSystem:UpdateParticles()
    -- Spawn new particles
    while #self.particles < self.max_particles do
        local particle = self:SpawnParticle()
        table.insert(self.particles, particle)
    end
    
    -- Update all particles
    for i, particle in ipairs(self.particles) do
        if not self:UpdateParticle(particle) then
            particle:Remove()
            table.remove(self.particles, i)
        end
    end
end

function WeatherSystem:ApplyPlayerEffects()
    -- Find all players
    for _, player in ipairs(AllPlayers) do
        -- Apply effects
        self:ApplyEffectToPlayer(player)
    end
end
```

### Optimized Implementation

```lua
local WeatherSystem = Class(function(self, inst)
    self.inst = inst
    self.particles = {}
    self.max_particles = 100
    self.player_effect_radius = 30
    self.particle_batch_size = 5
    self.affected_players = {}
    
    -- Update particles in batches and less frequently
    self.inst:DoPeriodicTask(0.1, function() self:UpdateParticles() end)
    
    -- Apply player effects less frequently
    self.inst:DoPeriodicTask(0.5, function() self:ApplyPlayerEffects() end)
    
    -- Clean up on removal
    self.inst:ListenForEvent("onremove", function() self:OnRemove() end)
end)

function WeatherSystem:UpdateParticles()
    -- Spawn particles in small batches
    local particles_to_spawn = math.min(self.particle_batch_size, self.max_particles - #self.particles)
    for i = 1, particles_to_spawn do
        local particle = self:SpawnParticle()
        table.insert(self.particles, particle)
    end
    
    -- Update only a subset of particles each frame
    local start_index = self.last_updated_index or 1
    local end_index = math.min(start_index + 20, #self.particles)
    
    for i = start_index, end_index do
        local particle = self.particles[i]
        if particle and particle:IsValid() then
            if not self:UpdateParticle(particle) then
                particle:Remove()
                table.remove(self.particles, i)
            end
        else
            table.remove(self.particles, i)
        end
    end
    
    -- Update index for next time
    self.last_updated_index = end_index >= #self.particles and 1 or end_index + 1
end

function WeatherSystem:ApplyPlayerEffects()
    -- Only process players that need updates
    for _, player in ipairs(AllPlayers) do
        local player_id = player.userid
        
        -- Check if player is in the affected area
        if self:IsPlayerInEffectArea(player) then
            -- Only apply if not already affected
            if not self.affected_players[player_id] then
                self:ApplyEffectToPlayer(player)
                self.affected_players[player_id] = true
                
                -- Listen for player leaving
                self.inst:ListenForEvent("onremove", function()
                    self.affected_players[player_id] = nil
                end, player)
            end
        else
            -- Remove effect if player left the area
            if self.affected_players[player_id] then
                self:RemoveEffectFromPlayer(player)
                self.affected_players[player_id] = nil
            end
        end
    end
end

function WeatherSystem:OnRemove()
    -- Clean up all particles
    for _, particle in ipairs(self.particles) do
        if particle:IsValid() then
            particle:Remove()
        end
    end
    self.particles = {}
    
    -- Remove effects from all players
    for player_id, _ in pairs(self.affected_players) do
        local player = UserToPlayer(player_id)
        if player then
            self:RemoveEffectFromPlayer(player)
        end
    end
    self.affected_players = {}
end
```

## Caching and Lazy Loading Techniques

Caching and lazy loading are powerful techniques to improve performance by reducing redundant calculations and delaying resource-intensive operations until they're actually needed.

### Caching Expensive Calculations

Caching stores the results of expensive operations for reuse:

```lua
-- INEFFICIENT: Recalculating values repeatedly
function Component:GetDamageMultiplier(target)
    -- Complex calculation that depends on many factors
    local base = self.base_damage
    local day_mult = TheWorld.state.isday and 1.2 or 0.8
    local health_mult = 1 + (1 - self.inst.components.health:GetPercent()) * 0.5
    local target_resist = target:HasTag("metal") and 0.5 or 1
    
    -- This calculation is performed every time the function is called
    return base * day_mult * health_mult * target_resist
end
```

**Optimized Approach**:

```lua
function Component:Init()
    self.cached_damage_mult = nil
    self.cached_damage_time = 0
    
    -- Listen for events that would invalidate the cache
    self.inst:ListenForEvent("healthdelta", function() self:InvalidateDamageCache() end)
    TheWorld:ListenForEvent("phasechanged", function() self:InvalidateDamageCache() end)
end

function Component:InvalidateDamageCache()
    self.cached_damage_mult = nil
end

function Component:GetDamageMultiplier(target)
    local target_type = target:HasTag("metal") and "metal" or "normal"
    local current_time = GetTime()
    
    -- If cache is valid and less than 1 second old, use it
    if self.cached_damage_mult and 
       self.cached_damage_mult[target_type] and 
       current_time - self.cached_damage_time < 1 then
        return self.cached_damage_mult[target_type]
    end
    
    -- Otherwise recalculate and cache the result
    local base = self.base_damage
    local day_mult = TheWorld.state.isday and 1.2 or 0.8
    local health_mult = 1 + (1 - self.inst.components.health:GetPercent()) * 0.5
    
    -- Create cache table if it doesn't exist
    self.cached_damage_mult = self.cached_damage_mult or {}
    
    -- Cache results for different target types
    self.cached_damage_mult["metal"] = base * day_mult * health_mult * 0.5
    self.cached_damage_mult["normal"] = base * day_mult * health_mult
    self.cached_damage_time = current_time
    
    return self.cached_damage_mult[target_type]
end
```

### Path Caching

For entities that frequently navigate between the same points:

```lua
local PathCache = Class(function(self)
    self.paths = {}
    self.max_paths = 50
    self.path_lifetime = 30  -- seconds before a path is considered stale
end)

function PathCache:GetPathKey(start_x, start_z, end_x, end_z)
    -- Round positions to reduce unique paths
    local grid_size = 4
    local sx = math.floor(start_x / grid_size) * grid_size
    local sz = math.floor(start_z / grid_size) * grid_size
    local ex = math.floor(end_x / grid_size) * grid_size
    local ez = math.floor(end_z / grid_size) * grid_size
    
    return string.format("%d,%d_to_%d,%d", sx, sz, ex, ez)
end

function PathCache:GetPath(start_x, start_z, end_x, end_z)
    local key = self:GetPathKey(start_x, start_z, end_x, end_z)
    
    if self.paths[key] and GetTime() - self.paths[key].time < self.path_lifetime then
        -- Return cached path if it exists and isn't stale
        return self.paths[key].path
    end
    
    -- Path not in cache or stale, calculate new path
    local path = self:CalculatePath(start_x, start_z, end_x, end_z)
    
    -- Store in cache
    self.paths[key] = {
        path = path,
        time = GetTime()
    }
    
    -- Limit cache size
    self:EnforceCacheLimit()
    
    return path
end

function PathCache:EnforceCacheLimit()
    -- If cache exceeds max size, remove oldest entries
    local keys = {}
    for k, v in pairs(self.paths) do
        table.insert(keys, {key = k, time = v.time})
    end
    
    if #keys > self.max_paths then
        -- Sort by time, oldest first
        table.sort(keys, function(a, b) return a.time < b.time end)
        
        -- Remove oldest entries
        for i = 1, #keys - self.max_paths do
            self.paths[keys[i].key] = nil
        end
    end
end

function PathCache:CalculatePath(start_x, start_z, end_x, end_z)
    -- Your pathfinding algorithm here
    -- ...
    
    -- Return calculated path
    return path
end
```

### Lazy Loading Resources

Lazy loading defers loading resources until they're actually needed:

```lua
local AssetManager = Class(function(self)
    self.loaded_assets = {}
    self.loading_assets = {}
    self.callbacks = {}
end)

function AssetManager:GetAsset(name, callback)
    -- If already loaded, return immediately
    if self.loaded_assets[name] then
        if callback then
            callback(self.loaded_assets[name])
        end
        return self.loaded_assets[name]
    end
    
    -- If currently loading, add callback to queue
    if self.loading_assets[name] then
        if callback then
            table.insert(self.callbacks[name], callback)
        end
        return nil
    end
    
    -- Start loading the asset
    self.loading_assets[name] = true
    self.callbacks[name] = self.callbacks[name] or {}
    
    if callback then
        table.insert(self.callbacks[name], callback)
    end
    
    -- Simulate asset loading (in a real mod, this would be TheSim:LoadPrefabs or similar)
    TheWorld:DoTaskInTime(0.1, function()
        -- Asset loaded
        self.loaded_assets[name] = {name = name, data = "asset_data"}
        self.loading_assets[name] = nil
        
        -- Call all waiting callbacks
        for _, cb in ipairs(self.callbacks[name]) do
            cb(self.loaded_assets[name])
        end
        self.callbacks[name] = {}
    end)
    
    return nil
end

function AssetManager:UnloadAsset(name)
    self.loaded_assets[name] = nil
end

-- Usage example
local asset_manager = AssetManager()

-- First request starts loading
asset_manager:GetAsset("special_effect", function(asset)
    print("Asset loaded:", asset.name)
end)

-- Second request will use the same loading operation
asset_manager:GetAsset("special_effect", function(asset)
    print("Also got the asset:", asset.name)
end)
```

### Component State Caching

Cache component states to avoid repeated component lookups:

```lua
-- INEFFICIENT: Checking component states repeatedly
function OnUpdate()
    for _, ent in ipairs(targets) do
        -- These component checks happen every update
        if ent.components.health and not ent.components.health:IsDead() and
           ent.components.combat and ent.components.combat:CanTarget(self.inst) then
            -- Do something with valid target
        end
    end
end

-- OPTIMIZED: Cache component states
function CacheTargetStates()
    self.valid_targets = {}
    
    for _, ent in ipairs(targets) do
        if ent.components.health and not ent.components.health:IsDead() and
           ent.components.combat and ent.components.combat:CanTarget(self.inst) then
            -- Cache the valid target
            self.valid_targets[ent] = true
            
            -- Listen for events that would invalidate this target
            self.inst:ListenForEvent("death", function()
                self.valid_targets[ent] = nil
            end, ent)
        end
    end
end

function OnUpdate()
    -- Use cached valid targets
    for ent in pairs(self.valid_targets) do
        -- Do something with valid target
    end
    
    -- Only rebuild cache occasionally
    self.cache_timer = self.cache_timer - dt
    if self.cache_timer <= 0 then
        self.cache_timer = 2  -- Rebuild cache every 2 seconds
        CacheTargetStates()
    end
end
```

### Deferred Initialization

Defer creating expensive resources until they're needed:

```lua
local ExpensiveComponent = Class(function(self, inst)
    self.inst = inst
    self.initialized = false
    
    -- Don't initialize expensive resources immediately
    -- They'll be created on first use
end)

function ExpensiveComponent:LazyInit()
    if not self.initialized then
        -- Create expensive resources only when first needed
        self.data_structure = self:BuildExpensiveDataStructure()
        self.render_assets = self:LoadExpensiveAssets()
        self.initialized = true
    end
end

function ExpensiveComponent:DoSomething()
    -- Ensure initialization before use
    self:LazyInit()
    
    -- Now use the expensive resources
    -- ...
end

-- Cleanup properly
function ExpensiveComponent:OnRemove()
    if self.initialized then
        -- Only clean up if we actually initialized
        self:CleanupExpensiveResources()
    end
end
```

### Incremental Loading

For very large mods, load content incrementally to avoid freezing the game:

```lua
local ModLoader = Class(function(self)
    self.load_queue = {}
    self.is_loading = false
    self.items_per_batch = 5
end)

function ModLoader:QueueContent(items)
    for _, item in ipairs(items) do
        table.insert(self.load_queue, item)
    end
    
    -- Start loading if not already in progress
    if not self.is_loading then
        self:LoadNextBatch()
    end
end

function ModLoader:LoadNextBatch()
    if #self.load_queue == 0 then
        self.is_loading = false
        if self.on_complete then
            self.on_complete()
        end
        return
    end
    
    self.is_loading = true
    local batch = {}
    
    -- Take a batch of items to load
    for i = 1, math.min(self.items_per_batch, #self.load_queue) do
        table.insert(batch, table.remove(self.load_queue, 1))
    end
    
    -- Load this batch
    for _, item in ipairs(batch) do
        self:LoadItem(item)
    end
    
    -- Schedule next batch
    TheWorld:DoTaskInTime(0.1, function()
        self:LoadNextBatch()
    end)
end

function ModLoader:LoadItem(item)
    -- Load individual item
    print("Loading:", item)
    -- Your loading logic here
end

-- Usage
local loader = ModLoader()
loader.on_complete = function()
    print("All content loaded!")
end

-- Queue 100 items to load
local items = {}
for i = 1, 100 do
    table.insert(items, "item_" .. i)
end

loader:QueueContent(items)
```

Implementing these caching and lazy loading techniques can significantly improve your mod's performance, especially for complex mods with many entities or resource-intensive operations.

## Working with Many Entities

When your mod needs to manage a large number of entities, performance can degrade quickly. Here are specific strategies for optimizing mods that work with many entities:

### Entity Pooling

Instead of constantly creating and destroying entities, reuse them with an entity pool:

```lua
-- Create an entity pool manager
local EntityPool = Class(function(self)
    self.inactive_entities = {}
    self.active_entities = {}
    self.prefab_name = "my_effect"
end)

function EntityPool:GetEntity()
    -- Reuse an inactive entity if available
    if #self.inactive_entities > 0 then
        local entity = table.remove(self.inactive_entities)
        table.insert(self.active_entities, entity)
        entity:Show()
        return entity
    end
    
    -- Create a new entity if needed
    local entity = SpawnPrefab(self.prefab_name)
    table.insert(self.active_entities, entity)
    return entity
end

function EntityPool:ReleaseEntity(entity)
    -- Find and remove from active list
    for i, e in ipairs(self.active_entities) do
        if e == entity then
            table.remove(self.active_entities, i)
            break
        end
    end
    
    -- Hide instead of destroying
    entity:Hide()
    table.insert(self.inactive_entities, entity)
end

function EntityPool:ReleaseAll()
    -- Move all active entities to inactive
    for i = #self.active_entities, 1, -1 do
        local entity = self.active_entities[i]
        table.remove(self.active_entities, i)
        entity:Hide()
        table.insert(self.inactive_entities, entity)
    end
end

function EntityPool:DestroyAll()
    -- Clean up all entities when no longer needed
    for _, entity in ipairs(self.active_entities) do
        entity:Remove()
    end
    self.active_entities = {}
    
    for _, entity in ipairs(self.inactive_entities) do
        entity:Remove()
    end
    self.inactive_entities = {}
end
```

### Spatial Partitioning

For large worlds with many entities, use spatial partitioning to only process entities in relevant areas:

```lua
-- Simple grid-based spatial partitioning
local SpatialGrid = Class(function(self, cell_size)
    self.cell_size = cell_size or 10
    self.grid = {}
end)

function SpatialGrid:GetCellKey(x, z)
    local cell_x = math.floor(x / self.cell_size)
    local cell_z = math.floor(z / self.cell_size)
    return cell_x .. "," .. cell_z
end

function SpatialGrid:AddEntity(entity)
    local x, y, z = entity.Transform:GetWorldPosition()
    local cell_key = self:GetCellKey(x, z)
    
    self.grid[cell_key] = self.grid[cell_key] or {}
    table.insert(self.grid[cell_key], entity)
    
    -- Store the cell key with the entity for quick removal
    entity._grid_cell_key = cell_key
end

function SpatialGrid:RemoveEntity(entity)
    local cell_key = entity._grid_cell_key
    if cell_key and self.grid[cell_key] then
        for i, e in ipairs(self.grid[cell_key]) do
            if e == entity then
                table.remove(self.grid[cell_key], i)
                entity._grid_cell_key = nil
                break
            end
        end
    end
end

function SpatialGrid:GetEntitiesInRadius(x, z, radius)
    local result = {}
    local r_cells = math.ceil(radius / self.cell_size)
    
    local center_x = math.floor(x / self.cell_size)
    local center_z = math.floor(z / self.cell_size)
    
    -- Check cells in a square area (could be optimized to a circle)
    for cell_x = center_x - r_cells, center_x + r_cells do
        for cell_z = center_z - r_cells, center_z + r_cells do
            local cell_key = cell_x .. "," .. cell_z
            if self.grid[cell_key] then
                for _, entity in ipairs(self.grid[cell_key]) do
                    local ex, _, ez = entity.Transform:GetWorldPosition()
                    local dist_sq = (ex - x)^2 + (ez - z)^2
                    if dist_sq <= radius * radius then
                        table.insert(result, entity)
                    end
                end
            end
        end
    end
    
    return result
end

function SpatialGrid:UpdateEntityPosition(entity)
    -- Remove from old cell
    self:RemoveEntity(entity)
    -- Add to new cell
    self:AddEntity(entity)
end
```

### Batched Processing

Process entities in smaller batches over multiple frames:

```lua
local EntityManager = Class(function(self, inst)
    self.inst = inst
    self.entities = {}
    self.batch_size = 20
    self.current_index = 1
    
    -- Process entities in batches
    self.task = self.inst:DoPeriodicTask(0.1, function() self:ProcessBatch() end)
end)

function EntityManager:AddEntity(entity)
    table.insert(self.entities, entity)
end

function EntityManager:ProcessBatch()
    local count = 0
    local start_index = self.current_index
    
    while count < self.batch_size and count < #self.entities do
        local entity_index = ((start_index + count - 1) % #self.entities) + 1
        local entity = self.entities[entity_index]
        
        if entity:IsValid() then
            self:ProcessEntity(entity)
        else
            -- Remove invalid entities
            table.remove(self.entities, entity_index)
            -- Adjust indices to account for removal
            if entity_index <= start_index then
                start_index = math.max(1, start_index - 1)
            end
        end
        
        count = count + 1
    end
    
    -- Update the index for next batch
    self.current_index = ((start_index + count - 1) % #self.entities) + 1
end

function EntityManager:ProcessEntity(entity)
    -- Your processing logic here
end
```

### Level of Detail (LOD)

Implement different levels of detail based on distance from the player:

```lua
function UpdateEntityLOD(entity, player_pos)
    local x, y, z = entity.Transform:GetWorldPosition()
    local dist_sq = (x - player_pos.x)^2 + (z - player_pos.z)^2
    
    if dist_sq < 10*10 then
        -- High detail - full updates
        entity.components.mycomponent:SetUpdateFrequency(0.1)
        entity.components.mycomponent:EnableEffects(true)
    elseif dist_sq < 30*30 then
        -- Medium detail - less frequent updates
        entity.components.mycomponent:SetUpdateFrequency(0.5)
        entity.components.mycomponent:EnableEffects(true)
    else
        -- Low detail - minimal updates, disable effects
        entity.components.mycomponent:SetUpdateFrequency(1.0)
        entity.components.mycomponent:EnableEffects(false)
    end
end

-- Apply LOD to all entities periodically
TheWorld:DoPeriodicTask(1, function()
    if AllPlayers[1] then
        local player_pos = Vector3(AllPlayers[1].Transform:GetWorldPosition())
        
        for _, entity in pairs(my_entities) do
            UpdateEntityLOD(entity, player_pos)
        end
    end
end)
```

### Instanced Rendering

For visual effects, use instanced rendering when possible:

```lua
-- Create a single master entity that manages many visual instances
local EffectManager = Class(function(self, inst)
    self.inst = inst
    self.positions = {}
    self.max_instances = 100
    
    -- Set up the master effect
    self.fx_entity = SpawnPrefab("my_effect_master")
    
    -- Update instance positions
    self.inst:DoPeriodicTask(0.1, function() self:UpdateInstances() end)
end)

function EffectManager:AddEffectAt(x, y, z)
    if #self.positions >= self.max_instances then
        -- Reuse the oldest position
        table.remove(self.positions, 1)
    end
    
    table.insert(self.positions, Vector3(x, y, z))
end

function EffectManager:UpdateInstances()
    -- Send positions to the master effect entity
    if self.fx_entity.components.instancedeffects then
        self.fx_entity.components.instancedeffects:SetPositions(self.positions)
    end
end
```

### Entity Culling

Only process entities that are relevant to the current game state:

```lua
function ShouldProcessEntity(entity)
    -- Skip entities that are sleeping or in limbo
    if entity:IsAsleep() or entity:HasTag("INLIMBO") then
        return false
    end
    
    -- Skip entities too far from any player
    local closest_dist_sq = math.huge
    local x, y, z = entity.Transform:GetWorldPosition()
    
    for _, player in ipairs(AllPlayers) do
        local px, py, pz = player.Transform:GetWorldPosition()
        local dist_sq = (x - px)^2 + (z - pz)^2
        closest_dist_sq = math.min(closest_dist_sq, dist_sq)
    end
    
    -- Only process if within 50 units of a player
    return closest_dist_sq < 50*50
end

-- Apply culling to entity updates
TheWorld:DoPeriodicTask(0.2, function()
    for _, entity in pairs(my_entities) do
        entity.components.mycomponent.enabled = ShouldProcessEntity(entity)
    end
end)
```

### Centralized Manager

Use a centralized manager instead of individual component updates:

```lua
-- Create a global manager for a specific entity type
local MyEntityManager = Class(function(self, inst)
    self.inst = inst
    self.entities = {}
    
    -- Process all entities at once
    self.inst:DoPeriodicTask(0.2, function() self:UpdateAll() end)
end)

function MyEntityManager:Register(entity)
    self.entities[entity] = true
    
    entity:ListenForEvent("onremove", function()
        self.entities[entity] = nil
    end)
end

function MyEntityManager:UpdateAll()
    local player_positions = {}
    for _, player in ipairs(AllPlayers) do
        table.insert(player_positions, Vector3(player.Transform:GetWorldPosition()))
    end
    
    -- Process all entities with shared data
    for entity in pairs(self.entities) do
        if entity:IsValid() then
            self:ProcessEntity(entity, player_positions)
        else
            self.entities[entity] = nil
        end
    end
end

function MyEntityManager:ProcessEntity(entity, player_positions)
    -- Shared processing logic
end

-- Create the global manager
AddPrefabPostInit("world", function(inst)
    if TheWorld.ismastersim then
        TheWorld.my_entity_manager = MyEntityManager(inst)
    end
end)

-- Register entities with the manager
AddPrefabPostInit("my_entity", function(inst)
    if TheWorld.ismastersim and TheWorld.my_entity_manager then
        TheWorld.my_entity_manager:Register(inst)
    end
end)
```

By implementing these strategies, your mod can efficiently handle hundreds or even thousands of entities without causing significant performance issues.

## Conclusion

Optimizing your mods is essential for providing a good experience to players. By following these techniques, you can create complex mods that run efficiently even on lower-end hardware and servers.

Remember these key principles:
- Only update what needs updating, when it needs updating
- Be mindful of expensive operations like entity searches
- Clean up after yourself to prevent memory leaks
- Use network bandwidth efficiently
- Profile your code to identify bottlenecks

By applying these optimization techniques, you'll create mods that players can enjoy without sacrificing performance. 
