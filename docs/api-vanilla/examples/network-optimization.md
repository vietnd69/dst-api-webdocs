---
id: network-optimization
title: Optimizing Network Traffic
sidebar_position: 12
---

# Optimizing Network Traffic in Multiplayer

This guide focuses on strategies to optimize network traffic in Don't Starve Together mods, ensuring smooth multiplayer experiences even with many players or on connections with limited bandwidth.

## Understanding Network Constraints

When developing multiplayer mods for Don't Starve Together, network optimization is critical because:

- **Bandwidth Limitations**: Players may have limited internet connections
- **Latency Issues**: High network traffic increases perceived lag
- **Server Performance**: Excessive network traffic impacts server performance
- **Player Count Scaling**: Network usage multiplies with each additional player

## Network Architecture Overview

Don't Starve Together uses a client-server architecture where:

```
┌────────┐         ┌────────┐
│ Server │◄────────┤ Client │
└───┬────┘         └────────┘
    │              ┌────────┐
    └─────────────►│ Client │
                   └────────┘
```

- The server is authoritative (controls the game state)
- Clients send inputs to the server
- The server validates and processes inputs
- The server sends state updates to clients

## Key Network Optimization Techniques

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
        position = 0.1,  -- Position updates frequently (every 0.1s)
        animation = 0.5, -- Animation state less frequently (every 0.5s)
        status = 1.0     -- Status updates infrequently (every 1.0s)
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

### 2. Delta Compression

Send only what has changed instead of complete state:

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
    
    -- Check position change (only if significant)
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

function NetworkSync:SendStateDelta(delta)
    -- Convert delta to a compact format
    local compressed_data = json.encode(delta)
    
    -- Send to clients
    if TheWorld.ismastersim then
        SendModRPCToClients(GetClientModRPC("MyMod", "SyncDelta"), compressed_data)
    end
end
```

### 3. Relevance-Based Filtering

Only send updates to players who need them:

```lua
function SyncEntityToRelevantPlayers(entity, data)
    if not TheWorld.ismastersim then return end
    
    local x, y, z = entity.Transform:GetWorldPosition()
    local relevant_radius = 30 -- Only players within 30 units need updates
    
    for _, player in ipairs(AllPlayers) do
        local px, py, pz = player.Transform:GetWorldPosition()
        local dist_sq = (x - px)^2 + (z - pz)^2
        
        if dist_sq <= relevant_radius * relevant_radius then
            -- This player is close enough to need updates
            SendModRPCToClient(GetClientModRPC("MyMod", "EntityUpdate"), 
                              player.userid, entity.GUID, json.encode(data))
        end
    end
end
```

### 4. Message Batching

Group multiple updates into a single network message:

```lua
local NetworkBatcher = Class(function(self, inst)
    self.inst = inst
    self.pending_updates = {}
    self.last_send_time = 0
    self.send_interval = 0.5 -- Send batch every 0.5 seconds
    
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
    if current_time - self.last_send_time >= self.send_interval or 
       table.count(self.pending_updates) > 10 then
        if next(self.pending_updates) ~= nil then
            self:SendBatch(self.pending_updates)
            self.pending_updates = {}
            self.last_send_time = current_time
        end
    end
end

function NetworkBatcher:SendBatch(batch)
    -- Convert batch to a compact format
    local compressed_batch = json.encode(batch)
    
    -- Send to all clients
    if TheWorld.ismastersim then
        SendModRPCToClients(GetClientModRPC("MyMod", "BatchUpdate"), compressed_batch)
    end
end
```

### 5. Compression Techniques

Reduce the size of transmitted data:

```lua
-- Quantize floating point values to reduce precision
function QuantizePosition(x, y, z)
    -- Round to nearest 0.1 units
    return {
        x = math.floor(x * 10 + 0.5) / 10,
        y = math.floor(y * 10 + 0.5) / 10,
        z = math.floor(z * 10 + 0.5) / 10
    }
end

-- Use integer indices instead of string keys
local KEY_MAPPING = {
    position = 1,
    rotation = 2,
    health = 3,
    hunger = 4,
    sanity = 5
}

function CompressData(data)
    local compressed = {}
    
    for key, value in pairs(data) do
        local index = KEY_MAPPING[key]
        if index then
            compressed[index] = value
        end
    end
    
    return compressed
end

function DecompressData(compressed)
    local data = {}
    
    for index, value in pairs(compressed) do
        for key, map_index in pairs(KEY_MAPPING) do
            if map_index == index then
                data[key] = value
                break
            end
        end
    end
    
    return data
end
```

### 6. Adaptive Sync Rates

Adjust synchronization frequency based on conditions:

```lua
local AdaptiveSync = Class(function(self, inst)
    self.inst = inst
    self.base_sync_interval = 0.5
    self.current_sync_interval = 0.5
    self.last_sync_time = 0
    self.importance = 1.0 -- 0.0 to 1.0
    
    self.inst:DoPeriodicTask(0.1, function() self:Update() end)
end)

function AdaptiveSync:Update()
    local current_time = GetTime()
    
    -- Adjust sync rate based on factors
    self:AdjustSyncRate()
    
    -- Check if it's time to sync
    if current_time - self.last_sync_time >= self.current_sync_interval then
        self:SyncData()
        self.last_sync_time = current_time
    end
end

function AdaptiveSync:AdjustSyncRate()
    -- Base factors that affect sync rate
    local distance_factor = self:GetPlayerDistanceFactor()
    local activity_factor = self:GetActivityFactor()
    local performance_factor = self:GetPerformanceFactor()
    
    -- Calculate new sync interval
    local adjusted_importance = self.importance * distance_factor * activity_factor
    
    -- Clamp between 0.1 and 2.0 seconds
    self.current_sync_interval = math.clamp(
        self.base_sync_interval / adjusted_importance * performance_factor,
        0.1,
        2.0
    )
end

function AdaptiveSync:GetPlayerDistanceFactor()
    -- Return 1.0 if players are nearby, decreasing to 0.2 as they get farther away
    local closest_dist_sq = self:GetClosestPlayerDistanceSq()
    local max_dist_sq = 30 * 30
    
    if closest_dist_sq > max_dist_sq then
        return 0.2 -- Far away, sync less frequently
    else
        -- Linear falloff from 1.0 to 0.2
        return 1.0 - (0.8 * closest_dist_sq / max_dist_sq)
    end
end
```

### 7. Network Priority Levels

Assign priority levels to different types of network traffic:

```lua
-- Network priority constants
local NETWORK_PRIORITY = {
    CRITICAL = 0,  -- Must be delivered immediately (player death, etc.)
    HIGH = 1,      -- Important for gameplay (combat, interaction)
    MEDIUM = 2,    -- Standard priority (movement, animations)
    LOW = 3        -- Can be delayed if needed (cosmetic effects)
}

-- Set entity network priority
function SetEntityNetworkPriority(entity, priority)
    entity.entity:SetPriority(priority)
end

-- Example usage
function OnCombatStart(inst)
    -- Increase network priority during combat
    SetEntityNetworkPriority(inst, NETWORK_PRIORITY.HIGH)
    
    -- Reset after combat ends
    inst:DoTaskInTime(5, function()
        SetEntityNetworkPriority(inst, NETWORK_PRIORITY.MEDIUM)
    end)
end
```

## Advanced Network Optimization Strategies

### 1. Client-Side Prediction

Reduce perceived latency by predicting outcomes on the client:

```lua
-- Client-side movement prediction
local function PredictMovement(inst, direction, speed, dt)
    if not TheWorld.ismastersim then
        -- Client-side prediction
        local x, y, z = inst.Transform:GetWorldPosition()
        local predicted_x = x + direction.x * speed * dt
        local predicted_z = z + direction.z * speed * dt
        
        -- Apply predicted position
        inst.Transform:SetPosition(predicted_x, y, predicted_z)
        
        -- Remember we're using prediction
        inst.using_prediction = true
    end
end

-- Handle server correction
local function OnPositionCorrection(inst, correct_x, correct_y, correct_z)
    if inst.using_prediction then
        local current_x, current_y, current_z = inst.Transform:GetWorldPosition()
        local distance_sq = (current_x - correct_x)^2 + (current_z - correct_z)^2
        
        if distance_sq > 4 then
            -- Large correction needed, snap to correct position
            inst.Transform:SetPosition(correct_x, correct_y, correct_z)
        else
            -- Small correction, smoothly interpolate
            inst:DoTaskInTime(0.1, function()
                inst.Transform:SetPosition(correct_x, correct_y, correct_z)
            end)
        end
    end
end
```

### 2. Level of Detail for Network Sync

Adjust detail level based on distance:

```lua
function SyncEntityWithLOD(entity, player)
    local x, y, z = entity.Transform:GetWorldPosition()
    local px, py, pz = player.Transform:GetWorldPosition()
    local dist_sq = (x - px)^2 + (z - pz)^2
    
    local data = {}
    
    if dist_sq < 10*10 then
        -- Close range: high detail
        data = {
            position = {x=x, y=y, z=z},
            rotation = entity.Transform:GetRotation(),
            animation = entity.AnimState:GetCurrentAnimationName(),
            health = entity.components.health:GetPercent(),
            effects = GetEntityEffects(entity),
            items = GetEntityItems(entity)
        }
    elseif dist_sq < 30*30 then
        -- Medium range: medium detail
        data = {
            position = {x=x, y=y, z=z},
            rotation = entity.Transform:GetRotation(),
            animation = entity.AnimState:GetCurrentAnimationName(),
            health = entity.components.health:GetPercent()
        }
    else
        -- Far range: minimal detail
        data = {
            position = {x=x, y=y, z=z},
            health = entity.components.health:GetPercent() < 0.5 -- Just send a boolean flag for low health
        }
    end
    
    SendModRPCToClient(GetClientModRPC("MyMod", "EntityUpdate"), 
                      player.userid, entity.GUID, json.encode(data))
end
```

### 3. Event-Based Synchronization

Only sync when important events occur:

```lua
-- Instead of periodic updates, sync on important events
function SetupEventBasedSync(entity)
    if not TheWorld.ismastersim then return end
    
    -- Sync when health changes significantly
    entity:ListenForEvent("healthdelta", function(inst, data)
        if math.abs(data.delta) > 5 or -- Large change
           inst.components.health:GetPercent() < 0.25 then -- Low health
            SyncHealthToClients(inst)
        end
    end)
    
    -- Sync when animation changes
    local old_play_anim = entity.AnimState.PlayAnimation
    entity.AnimState.PlayAnimation = function(anim_state, anim_name, ...)
        old_play_anim(anim_state, anim_name, ...)
        SyncAnimationToClients(entity, anim_name)
    end
    
    -- Sync when inventory changes
    entity:ListenForEvent("itemget", function(inst, data)
        SyncInventoryToClients(inst)
    end)
    
    entity:ListenForEvent("itemlose", function(inst, data)
        SyncInventoryToClients(inst)
    end)
end
```

### 4. Network Throttling

Prevent network spam during intense activity:

```lua
local NetworkThrottler = Class(function(self, inst)
    self.inst = inst
    self.message_counts = {}
    self.last_reset = GetTime()
    self.reset_interval = 1.0 -- Reset counters every second
    self.max_messages = {
        position = 10,  -- Max 10 position updates per second
        animation = 5,  -- Max 5 animation updates per second
        effect = 3      -- Max 3 effect updates per second
    }
    
    self.inst:DoPeriodicTask(0.1, function() self:Update() end)
end)

function NetworkThrottler:Update()
    local current_time = GetTime()
    
    -- Reset counters periodically
    if current_time - self.last_reset >= self.reset_interval then
        self.message_counts = {}
        self.last_reset = current_time
    end
end

function NetworkThrottler:CanSendMessage(message_type)
    -- Initialize counter if needed
    self.message_counts[message_type] = self.message_counts[message_type] or 0
    
    -- Check if we've hit the limit
    if self.message_counts[message_type] >= self.max_messages[message_type] then
        return false
    end
    
    -- Increment counter and allow message
    self.message_counts[message_type] = self.message_counts[message_type] + 1
    return true
end

-- Usage example
function TrySendPositionUpdate(entity, position)
    if entity.network_throttler:CanSendMessage("position") then
        SendPositionUpdate(entity, position)
    end
end
```

## Case Study: Optimizing a Boss Fight Mod

Let's look at a practical example of optimizing network traffic for a mod that adds a complex boss fight:

### Unoptimized Version

```lua
-- Unoptimized boss fight networking
local function CreateBossFight()
    local boss = SpawnPrefab("my_custom_boss")
    
    -- Update all clients constantly with full state
    boss:DoPeriodicTask(0, function()
        if TheWorld.ismastersim then
            -- Send complete state every frame
            local x, y, z = boss.Transform:GetWorldPosition()
            local health = boss.components.health:GetPercent()
            local phase = boss.current_phase
            local targets = {}
            
            -- Include all target data
            for i, target in ipairs(boss.targets) do
                table.insert(targets, {
                    id = target.GUID,
                    x = target.Transform:GetWorldPosition()
                })
            end
            
            -- Send all special effects
            for i, effect in ipairs(boss.active_effects) do
                local ex, ey, ez = effect.Transform:GetWorldPosition()
                SendModRPCToClients(GetClientModRPC("BossMod", "SpawnEffect"), 
                                   effect.prefab, ex, ey, ez)
            end
            
            -- Send complete boss state
            SendModRPCToClients(GetClientModRPC("BossMod", "UpdateBoss"), 
                               boss.GUID, x, y, z, health, phase, json.encode(targets))
        end
    end)
    
    return boss
end
```

### Optimized Version

```lua
-- Optimized boss fight networking
local function CreateBossFight()
    local boss = SpawnPrefab("my_custom_boss")
    
    if TheWorld.ismastersim then
        -- Initialize network optimization components
        boss.network_sync = {
            last_position = {x=0, y=0, z=0},
            last_health = 1.0,
            last_phase = 1,
            last_sync_time = {
                position = 0,
                health = 0,
                phase = 0,
                targets = 0,
                effects = 0
            },
            sync_intervals = {
                position = 0.1,  -- Sync position 10 times per second
                health = 0.5,    -- Sync health twice per second
                phase = 0,       -- Sync phase immediately when changed
                targets = 1.0,   -- Sync targets once per second
                effects = 0      -- Sync effects immediately when they occur
            },
            dirty = {
                position = true,
                health = true,
                phase = true,
                targets = true
            }
        }
        
        -- Periodic sync task
        boss:DoPeriodicTask(0.1, function() BossSyncTask(boss) end)
        
        -- Event-based synchronization
        boss:ListenForEvent("healthdelta", function(inst, data)
            -- Mark health as dirty if it changed significantly
            if math.abs(data.delta) > 0.05 then
                inst.network_sync.dirty.health = true
            end
        end)
        
        -- Phase change events
        boss.SetPhase = function(self, phase)
            if self.current_phase ~= phase then
                self.current_phase = phase
                self.network_sync.dirty.phase = true
                
                -- Phase changes are important - sync immediately
                SyncBossPhase(self)
            end
        end
        
        -- Effect spawning
        boss.SpawnEffect = function(self, effect_name, x, y, z)
            -- Spawn locally
            local effect = SpawnPrefab(effect_name)
            effect.Transform:SetPosition(x, y, z)
            
            -- Send to clients immediately - effects are important for visual feedback
            SendModRPCToClients(GetClientModRPC("BossMod", "SpawnEffect"), 
                               effect_name, x, y, z)
            
            return effect
        end
    end
    
    return boss
end

function BossSyncTask(boss)
    if not TheWorld.ismastersim then return end
    
    local current_time = GetTime()
    local sync = boss.network_sync
    
    -- Check position updates
    if sync.dirty.position and 
       current_time - sync.last_sync_time.position >= sync.sync_intervals.position then
        SyncBossPosition(boss)
        sync.last_sync_time.position = current_time
        sync.dirty.position = false
    end
    
    -- Check health updates
    if sync.dirty.health and 
       current_time - sync.last_sync_time.health >= sync.sync_intervals.health then
        SyncBossHealth(boss)
        sync.last_sync_time.health = current_time
        sync.dirty.health = false
    end
    
    -- Check target updates
    if sync.dirty.targets and 
       current_time - sync.last_sync_time.targets >= sync.sync_intervals.targets then
        SyncBossTargets(boss)
        sync.last_sync_time.targets = current_time
        sync.dirty.targets = false
    end
    
    -- Position is always considered dirty for continuous movement
    sync.dirty.position = true
end

function SyncBossPosition(boss)
    local x, y, z = boss.Transform:GetWorldPosition()
    local last = boss.network_sync.last_position
    
    -- Only sync if position changed significantly
    if math.abs(x - last.x) > 0.1 or math.abs(z - last.z) > 0.1 then
        SendModRPCToClients(GetClientModRPC("BossMod", "UpdateBossPosition"), 
                           boss.GUID, x, y, z)
        
        boss.network_sync.last_position = {x=x, y=y, z=z}
    end
end

function SyncBossHealth(boss)
    local health = boss.components.health:GetPercent()
    
    -- Only sync if health changed significantly
    if math.abs(health - boss.network_sync.last_health) > 0.01 then
        SendModRPCToClients(GetClientModRPC("BossMod", "UpdateBossHealth"), 
                           boss.GUID, health)
        
        boss.network_sync.last_health = health
    end
end

function SyncBossPhase(boss)
    SendModRPCToClients(GetClientModRPC("BossMod", "UpdateBossPhase"), 
                       boss.GUID, boss.current_phase)
    
    boss.network_sync.last_phase = boss.current_phase
}

function SyncBossTargets(boss)
    -- Only send minimal target information
    local target_data = {}
    for i, target in ipairs(boss.targets) do
        table.insert(target_data, target.GUID)
    end
    
    SendModRPCToClients(GetClientModRPC("BossMod", "UpdateBossTargets"), 
                       boss.GUID, json.encode(target_data))
}
```

## Measuring and Monitoring Network Usage

To optimize effectively, you need to measure network usage:

```lua
-- Track RPC frequency
local rpc_counters = {}

-- Wrap RPC sending functions to count usage
local original_send_rpc = SendModRPCToClients
SendModRPCToClients = function(rpc, ...)
    -- Count RPC usage
    local rpc_name = GetRPCNameFromID(rpc)
    rpc_counters[rpc_name] = (rpc_counters[rpc_name] or 0) + 1
    
    -- Call original function
    return original_send_rpc(rpc, ...)
end

-- Periodically log RPC usage
TheWorld:DoPeriodicTask(10, function()
    print("RPC Usage Statistics:")
    for name, count in pairs(rpc_counters) do
        print(string.format("  %s: %d calls (%.1f/sec)", 
                           name, count, count/10))
    end
    rpc_counters = {}
end)

-- Console command to show network stats
function c_networkstats()
    print("Network Statistics:")
    print("Bandwidth In: " .. TheSim:GetBandwidthIn() .. " KB/s")
    print("Bandwidth Out: " .. TheSim:GetBandwidthOut() .. " KB/s")
    print("Packet Loss: " .. TheSim:GetPacketLoss() .. "%")
end
```

## Best Practices Checklist

Use this checklist to ensure your mod's network usage is optimized:

1. **Sync Frequency**
   - [ ] Use appropriate sync intervals for different data types
   - [ ] Prioritize critical gameplay data over cosmetic effects
   - [ ] Implement event-based synchronization where possible

2. **Data Efficiency**
   - [ ] Send only changed data (delta updates)
   - [ ] Compress data before sending (reduce precision, use integer keys)
   - [ ] Batch related updates together

3. **Relevance Filtering**
   - [ ] Only send updates to players who need them
   - [ ] Implement distance-based level of detail
   - [ ] Filter out irrelevant information

4. **Network Load Management**
   - [ ] Implement rate limiting for frequent updates
   - [ ] Use network priority levels appropriately
   - [ ] Scale back network usage during high-activity periods

5. **Client-Side Techniques**
   - [ ] Implement client-side prediction where appropriate
   - [ ] Use interpolation for smooth transitions
   - [ ] Cache data to reduce redundant requests

## Conclusion

By implementing these network optimization techniques, your mods will use bandwidth more efficiently and provide a smoother multiplayer experience, especially on servers with many players or for players with limited internet connections.

Remember these key principles:
- Only send what has changed
- Only send to who needs it
- Only send when it matters
- Prioritize gameplay-critical information
- Measure and monitor network usage

## See also

- [Network System](../core/network-system.md) - Core networking concepts
- [RPC System](../core/rpc-system.md) - Remote procedure call system
- [Performance Optimization](optimization.md) - General performance optimization
- [Reducing Resource Usage](resource-usage.md) - Strategies for minimizing resource consumption 