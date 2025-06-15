---
id: network-bandwidth-optimization
title: Network Bandwidth Optimization
sidebar_position: 11
---

# Network Bandwidth Optimization

Optimizing network bandwidth usage is crucial for creating multiplayer mods that perform well even on slower connections. This guide covers techniques and best practices for reducing network traffic in Don't Starve Together mods.

## Understanding Bandwidth Constraints

Don't Starve Together's multiplayer experience can be affected by:

- Limited player bandwidth (especially in rural areas or developing regions)
- Server bandwidth limitations (particularly on dedicated servers)
- Increased latency when bandwidth is saturated
- Packet loss when network buffers overflow

Efficient bandwidth usage improves the experience for all players by reducing lag, stuttering, and disconnections.

## Measuring Bandwidth Usage

Before optimizing, it's important to measure your mod's bandwidth consumption:

```lua
-- In-game console commands for bandwidth monitoring
c_bandwidth() -- Toggles bandwidth usage display
c_netprofile() -- Shows detailed network profiling information

-- Programmatic bandwidth monitoring
local function LogBandwidthUsage()
    print("Bandwidth In: " .. TheSim:GetBandwidthIn() .. " KB/s")
    print("Bandwidth Out: " .. TheSim:GetBandwidthOut() .. " KB/s")
end

-- Check bandwidth usage every 10 seconds
inst:DoPeriodicTask(10, LogBandwidthUsage)
```

## Optimization Techniques

### 1. Use Appropriate NetVar Types

Choose the smallest data type that can represent your values:

```lua
-- INEFFICIENT: Using larger types than needed
self.small_number = net_int(inst.GUID, "component.small_number") -- 32 bits

-- OPTIMIZED: Using appropriate sized types
self.small_number = net_byte(inst.GUID, "component.small_number") -- 8 bits
self.tiny_number = net_tinybyte(inst.GUID, "component.tiny_number") -- 4 bits
```

NetVar Type Size Comparison:
| Type | Size | Range | Best For |
|------|------|-------|----------|
| `net_tinybyte` | 4 bits | 0-15 | Tiny counters, small states |
| `net_byte` | 8 bits | 0-255 | Small counters, item counts |
| `net_shortint` | 16 bits | -32,768 to 32,767 | Medium-sized values |
| `net_int` | 32 bits | -2^31 to 2^31-1 | Large numbers |
| `net_float` | 32 bits | Floating point | Positions, decimals |
| `net_bool` | 1 bit | true/false | Binary states |

### 2. Batch Updates

Combine multiple updates into a single network message:

```lua
-- INEFFICIENT: Sending multiple separate updates
function UpdateStats(health, hunger, sanity)
    self.net_health:set(health) -- Triggers network message
    self.net_hunger:set(hunger) -- Triggers another network message
    self.net_sanity:set(sanity) -- Triggers a third network message
end

-- OPTIMIZED: Batching updates together
function UpdateStats(health, hunger, sanity)
    -- Start batching
    self.inst:StartUpdatingComponent(self)
    
    -- Set all values (no network messages sent yet)
    self.net_health:set_local(health)
    self.net_hunger:set_local(hunger)
    self.net_sanity:set_local(sanity)
    
    -- Send a single network update with all changes
    self.inst:StopUpdatingComponent(self)
end
```

### 3. Delta Compression

Send only the changes instead of full state:

```lua
-- INEFFICIENT: Sending full inventory state
function SyncInventory(inventory)
    self.net_inventory:set(json.encode(inventory)) -- Sends entire inventory
end

-- OPTIMIZED: Sending only changes
function SyncInventoryChanges(slot, item)
    self.net_inventory_slot:set(slot)
    self.net_inventory_item:set(item and item.prefab or "")
end
```

### 4. Prioritize Network Traffic

Assign priorities to network messages based on importance:

```lua
-- Set entity network priority
inst.entity:SetPriority(NETWORK_PRIORITY.HIGH) -- For important entities

-- Lower priority for cosmetic entities
decorative_entity.entity:SetPriority(NETWORK_PRIORITY.LOW)

-- Available priority levels
-- NETWORK_PRIORITY.CRITICAL (0) - Must be delivered immediately
-- NETWORK_PRIORITY.HIGH (1) - Important for gameplay
-- NETWORK_PRIORITY.MEDIUM (2) - Standard priority
-- NETWORK_PRIORITY.LOW (3) - Can be delayed if needed
```

### 5. Relevance-Based Filtering

Only send updates to players who need the information:

```lua
-- INEFFICIENT: Broadcasting to all clients
SendModRPCToClients(MOD_RPC.MyMod.EffectEvent, x, y, z, effect_type)

-- OPTIMIZED: Send only to nearby players
local function SendToRelevantPlayers(x, y, z, effect_type)
    local range_sq = 40 * 40 -- Only players within 40 units need this update
    
    for i, player in ipairs(AllPlayers) do
        local px, py, pz = player.Transform:GetWorldPosition()
        local dist_sq = distsq(x, z, px, pz)
        
        if dist_sq <= range_sq then
            -- Only send to players in range
            SendModRPCToClient(MOD_RPC.MyMod.EffectEvent, player.userid, x, y, z, effect_type)
        end
    end
end
```

### 6. Update Frequency Control

Limit how often you send updates:

```lua
-- INEFFICIENT: Updating position every frame
local function UpdatePosition(inst)
    inst.net_position:set(Vector3(inst.Transform:GetWorldPosition()))
end
inst:DoPeriodicTask(0, UpdatePosition) -- Every frame

-- OPTIMIZED: Updating position at reasonable intervals
local function UpdatePosition(inst)
    local x, y, z = inst.Transform:GetWorldPosition()
    
    -- Only update if position changed significantly
    if inst._last_sent_x == nil or 
       math.abs(inst._last_sent_x - x) > 0.5 or
       math.abs(inst._last_sent_z - z) > 0.5 then
        
        inst.net_position:set(Vector3(x, y, z))
        inst._last_sent_x = x
        inst._last_sent_z = z
    end
end
inst:DoPeriodicTask(0.2, UpdatePosition) -- 5 times per second maximum
```

### 7. Compression Techniques

Compress data before sending when appropriate:

```lua
-- INEFFICIENT: Sending raw string data
self.net_large_data:set(large_string_data)

-- OPTIMIZED: Sending compressed data
local function CompressString(str)
    -- Simple run-length encoding for repeated characters
    local result = ""
    local count = 1
    local last_char = string.sub(str, 1, 1)
    
    for i = 2, #str do
        local char = string.sub(str, i, i)
        if char == last_char then
            count = count + 1
        else
            if count > 3 then
                result = result .. "#" .. count .. last_char
            else
                result = result .. string.rep(last_char, count)
            end
            count = 1
            last_char = char
        end
    end
    
    -- Handle the last character
    if count > 3 then
        result = result .. "#" .. count .. last_char
    else
        result = result .. string.rep(last_char, count)
    end
    
    return result
end

-- Send compressed data
self.net_large_data:set(CompressString(large_string_data))
```

## Advanced Optimization Strategies

### 1. Level of Detail (LOD) for Network Updates

Vary the update frequency based on distance:

```lua
function UpdateEntityNetwork(inst)
    local player = ThePlayer
    if not player then return end
    
    local x, y, z = inst.Transform:GetWorldPosition()
    local px, py, pz = player.Transform:GetWorldPosition()
    local dist_sq = distsq(x, z, px, pz)
    
    -- Determine update frequency based on distance
    local update_frequency
    if dist_sq < 10*10 then -- Very close
        update_frequency = 0.1 -- Update 10 times per second
    elseif dist_sq < 30*30 then -- Medium distance
        update_frequency = 0.5 -- Update twice per second
    else -- Far away
        update_frequency = 2.0 -- Update every 2 seconds
    end
    
    -- Schedule next update
    inst._network_task = inst:DoTaskInTime(update_frequency, UpdateEntityNetwork)
end
```

### 2. Predictive Modeling

Let clients predict behavior to reduce updates:

```lua
-- Server sends initial velocity and lets clients predict movement
function StartProjectile(inst, angle, speed)
    if TheWorld.ismastersim then
        -- Send initial state
        inst.net_angle:set(angle)
        inst.net_speed:set(speed)
        inst.net_start_time:set(GetTime())
        inst.net_start_pos:set(Vector3(inst.Transform:GetWorldPosition()))
        
        -- Server still updates actual position
        inst:StartUpdatingComponent(self)
    else
        -- Client predicts position based on physics
        inst:DoPeriodicTask(0, function()
            local angle = inst.net_angle:value()
            local speed = inst.net_speed:value()
            local start_time = inst.net_start_time:value()
            local start_pos = inst.net_start_pos:value()
            
            local time_elapsed = GetTime() - start_time
            local dist = speed * time_elapsed
            
            local dx = math.cos(angle) * dist
            local dz = math.sin(angle) * dist
            
            inst.Transform:SetPosition(start_pos.x + dx, start_pos.y, start_pos.z + dz)
        end)
    end
end
```

### 3. Event Filtering

Only send events that matter to gameplay:

```lua
-- INEFFICIENT: Sending all animation events
function PlayAnimation(inst, anim_name)
    inst.AnimState:PlayAnimation(anim_name)
    
    if TheWorld.ismastersim then
        -- Send every animation to clients
        inst.net_anim:set(anim_name)
    end
end

-- OPTIMIZED: Only send gameplay-relevant animations
local IMPORTANT_ANIMATIONS = {
    "attack", "hit", "death", "special_ability"
}

function PlayAnimation(inst, anim_name)
    inst.AnimState:PlayAnimation(anim_name)
    
    if TheWorld.ismastersim and table.contains(IMPORTANT_ANIMATIONS, anim_name) then
        -- Only send important animations
        inst.net_anim:set(anim_name)
    end
end
```

### 4. Bandwidth Budgeting

Allocate bandwidth based on entity importance:

```lua
-- Define bandwidth priorities for different entity types
local BANDWIDTH_PRIORITIES = {
    player = 1,      -- Highest priority
    monster = 2,
    projectile = 2,
    structure = 3,
    resource = 3,
    decoration = 4,  -- Lowest priority
}

-- Set entity network priority based on type
function SetEntityNetworkPriority(inst)
    local entity_type = inst:HasTag("player") and "player" or
                        inst:HasTag("monster") and "monster" or
                        inst:HasTag("projectile") and "projectile" or
                        inst:HasTag("structure") and "structure" or
                        inst:HasTag("resource") and "resource" or
                        "decoration"
    
    local priority = BANDWIDTH_PRIORITIES[entity_type] or NETWORK_PRIORITY.MEDIUM
    inst.entity:SetPriority(priority)
end
```

## Bandwidth Optimization Checklist

When optimizing your mod's network usage, consider these questions:

1. **Data Types**: Am I using the smallest possible data types for my values?
2. **Update Frequency**: Am I sending updates only when necessary?
3. **Batching**: Am I combining related updates into single messages?
4. **Relevance**: Am I only sending data to players who need it?
5. **Compression**: For large data, am I using compression techniques?
6. **Prediction**: Can clients predict some behavior to reduce updates?
7. **Prioritization**: Have I assigned appropriate priorities to network traffic?
8. **Testing**: Have I tested my mod under bandwidth-constrained conditions?

## Testing Network Optimization

To verify your optimizations:

```lua
-- Console command to simulate network conditions
c_simulatenetwork(latency, packet_loss_send, packet_loss_receive)

-- Example: Test with 200ms latency and 5% packet loss
c_simulatenetwork(200, 0.05, 0.05)

-- Reset to normal
c_simulatenetwork()
```

By implementing these bandwidth optimization techniques, your mod will perform better across a wide range of network conditions, providing a smoother experience for all players. 