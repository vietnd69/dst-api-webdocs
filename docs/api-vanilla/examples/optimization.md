---
id: optimization
title: Performance Optimization
sidebar_position: 10
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

## Conclusion

Optimizing your mods is essential for providing a good experience to players. By following these techniques, you can create complex mods that run efficiently even on lower-end hardware and servers.

Remember these key principles:
- Only update what needs updating, when it needs updating
- Be mindful of expensive operations like entity searches
- Clean up after yourself to prevent memory leaks
- Use network bandwidth efficiently
- Profile your code to identify bottlenecks

By applying these optimization techniques, you'll create mods that players can enjoy without sacrificing performance. 