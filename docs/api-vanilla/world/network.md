---
id: network
title: Network and World Synchronization
sidebar_position: 3
---

# Network and World Synchronization

This document covers how networking functions specifically in the context of the world system in Don't Starve Together, focusing on world state synchronization, shard communication, and related networking concepts.

## World Network Structure

In Don't Starve Together, the world consists of separate "shards" (server instances) that can communicate with each other:

```
┌─────────────────┐     ┌─────────────────┐
│  Master Shard   │◄────┤ Secondary Shard │
│  (Surface)      │     │  (Caves)        │
└───────┬─────────┘     └─────────────────┘
        │               ┌─────────────────┐
        └──────────────►│ Secondary Shard │
                        │  (Ruins)        │
                        └─────────────────┘
```

## World State Synchronization

The world state in DST is managed by the `WorldState` component, which synchronizes crucial environmental information to all connected clients.

### WorldState Variables

```lua
-- In world prefab initialization
if not TheWorld.ismastersim then
    return inst
end

inst:AddComponent("worldstate")
local worldstate = inst.components.worldstate

-- Initialize network variables for world state
worldstate.data.phase = "day"
worldstate.data.cycles = 0
worldstate.data.temperature = 20
worldstate.data.season = "autumn"
worldstate.data.iswinter = false
worldstate.data.isspring = false
worldstate.data.issummer = false
worldstate.data.isautumn = true
worldstate.data.elapseddaysinseason = 0
worldstate.data.remainingdaysinseason = 20
worldstate.data.issnowing = false
worldstate.data.snowlevel = 0
worldstate.data.israining = false
worldstate.data.precipitationrate = 0
worldstate.data.moisture = 0
worldstate.data.moistureceil = 100
worldstate.data.moisturefloor = 0
worldstate.data.moisturerate = 0
worldstate.data.pop = 0
worldstate.data.wet = false
```

### Accessing WorldState

Clients and server can access the world state through `TheWorld.state`:

```lua
-- Check if it's night time
if TheWorld.state.phase == "night" then
    -- Do night-specific behavior
end

-- Check current season
if TheWorld.state.issummer then
    -- Apply summer-specific effects
end

-- Get current temperature
local world_temp = TheWorld.state.temperature

-- Check weather conditions
if TheWorld.state.israining or TheWorld.state.issnowing then
    -- Take shelter
end
```

## Shard Communication

For multi-shard setups (like Surface + Caves), DST provides shard communication mechanisms.

### Shard Entity Registration

```lua
-- Register an entity for cross-shard tracking
TheWorld:RegisterShard("player_house", inst)

-- Get an entity registered in another shard
local house = TheWorld:GetShard("player_house")
```

### Shard RPC Communication

```lua
-- Send RPC from one shard to another
SendWorldRPCToShard(WorldRPC.Shard.ExampleRPC, target_shard_id, param1, param2)

-- Add handler for cross-shard RPC
AddShardRPCHandler("Shard", "ExampleRPC", function(shardid, param1, param2)
    print("Received RPC from shard " .. shardid)
end)
```

### Player Migration Between Shards

```lua
-- Server code to migrate a player to another shard
-- (e.g., when entering a cave entrance)
if player.components.shard_player ~= nil then
    -- Store important data for transfer
    player.components.shard_player:SetMigrationData({
        health = player.components.health.currenthealth,
        inventory_items = SerializeInventory(player.components.inventory),
        -- Other important player data
    })
    
    -- Send player to target shard
    player.components.shard_player:DoMigration(target_shard_id)
end
```

## World Network Events

TheWorld entity broadcasts network events that components and entities can listen for:

```lua
-- Listen for day/night cycle changes
inst:ListenForEvent("phasechanged", function(world, data)
    if data.newphase == "day" then
        -- Morning behavior
    elseif data.newphase == "dusk" then
        -- Evening behavior
    elseif data.newphase == "night" then
        -- Night behavior
    end
end, TheWorld)

-- Listen for season changes
inst:ListenForEvent("seasonchanged", function(world, data)
    if data.season == "winter" then
        -- Winter preparation
    end
end, TheWorld)

-- Listen for weather changes
inst:ListenForEvent("weatherchanged", function(world, data)
    if data.israining then
        -- React to rain starting
    end
end, TheWorld)
```

## Map Synchronization

The world's map information is synchronized to clients:

```lua
-- Reveal area for all players
TheWorld.minimap.MiniMap:ShowArea(x, y, z, radius)

-- Reveal area for specific player
player.player_classified.MapExplorer:RevealArea(x, y, z, radius)

-- Check if a position is revealed on player's map
local is_revealed = player.player_classified.MapExplorer:IsExplored(x, y, z)
```

## Time Synchronization

Time in DST is synchronized across all clients:

```lua
-- Get the current server time
local server_time = TheNet:GetServerTimeSeconds()

-- Get server time as a string
local time_str = TheNet:GetServerTimeString()

-- Schedule something based on synchronized time
inst:DoPeriodicTask(1, function()
    local current_time = TheNet:GetServerTimeSeconds()
    -- Do something that needs synchronized timing
end)
```

## World Save Data Networking

When world data is saved, network variables ensure clients have current state:

```lua
-- Server initiating a save
TheWorld:PushEvent("ms_save")

-- Listen for save completion
TheWorld:ListenForEvent("ms_savecomplete", function()
    print("World save completed")
end)

-- Listen for save events on clients
TheWorld:ListenForEvent("ms_save", function()
    -- Client-side preparation for save
    print("World is being saved")
end)
```

## Network Zones and Areas

The world can define network zones for different synchronization priorities:

```lua
-- Define a high-priority network zone
local zone = TheWorld.net.components.netzone:AddZone("playerbase")
zone:SetArea(x, z, radius)
zone:SetPriority(NETWORK_PRIORITY.HIGH)

-- Add entity to a specific zone
TheWorld.net.components.netzone:AddEntityToZone(inst, "playerbase")

-- Check if an entity is in a zone
local in_zone = TheWorld.net.components.netzone:IsEntityInZone(inst, "playerbase")
```

## World Synchronization Best Practices

1. **Use WorldState**: Access world conditions through `TheWorld.state` rather than direct component access
2. **Minimize Shard RPCs**: Cross-shard communication should be minimized as it can be expensive
3. **Prioritize Important Areas**: Set higher network priorities for player bases and important areas
4. **Utilize Update Intervals**: Not all world data needs to sync at the same rate
5. **Be Mindful of Scale**: World-level events reach all clients, so use them judiciously

## Example: Weather System Synchronization

Complete example of synchronizing a custom weather effect:

```lua
-- In world prefab
local function WorldPrefab()
    local inst = CreateEntity()
    
    -- Network components
    inst.entity:AddNetwork()
    
    -- Create networked variables for custom weather
    inst.ashfall_active = net_bool(inst.GUID, "world.ashfall_active", "ashfall_changed")
    inst.ashfall_intensity = net_float(inst.GUID, "world.ashfall_intensity", "ashfall_intensity_changed")
    
    -- Client listeners
    if not TheWorld.ismastersim then
        inst:ListenForEvent("ashfall_changed", function()
            if inst.ashfall_active:value() then
                -- Start client-side ashfall effects
                StartClientAshfallFX(inst.ashfall_intensity:value())
            else
                -- Stop client-side ashfall effects
                StopClientAshfallFX()
            end
        end)
        
        inst:ListenForEvent("ashfall_intensity_changed", function()
            if inst.ashfall_active:value() then
                -- Update client-side effect intensity
                UpdateClientAshfallIntensity(inst.ashfall_intensity:value())
            end
        end)
        
        return inst
    end
    
    -- Server-side components and logic
    inst:AddComponent("ashfallmanager")
    
    -- Connect component to network variables
    local ashfall = inst.components.ashfallmanager
    ashfall:SetCallbacks(
        -- Start callback
        function(intensity)
            inst.ashfall_active:set(true)
            inst.ashfall_intensity:set(intensity)
        end,
        -- Stop callback
        function()
            inst.ashfall_active:set(false)
        end,
        -- Update callback
        function(intensity)
            inst.ashfall_intensity:set(intensity)
        end
    )
    
    return inst
end
``` 