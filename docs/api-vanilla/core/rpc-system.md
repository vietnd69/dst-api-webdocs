---
id: rpc-system
title: Remote Procedure Call System
sidebar_position: 7
---

# Remote Procedure Call System

Remote Procedure Calls (RPCs) are a core feature of Don't Starve Together's networking architecture, enabling bidirectional communication between server and clients. Unlike network variables which are unidirectional (server to client), RPCs allow clients to send commands to the server and the server to send commands to specific clients.

## RPC Overview

RPCs serve several key purposes in Don't Starve Together:

1. **Client-to-Server Communication**: Allow players to request actions (attacks, crafting, etc.)
2. **Server-to-Client Communication**: Enable the server to trigger visual effects, sounds, or UI updates
3. **Command Broadcasting**: Send information to all clients simultaneously
4. **Targeted Messages**: Deliver information to specific clients

## RPC Directions

```lua
-- RPC direction constants
RPC = {
    Broadcast = 0,  -- Server to all clients
    Target = 1,     -- Server to specific client
    ToServer = 2    -- Client to server
}
```

## Built-in RPC Categories

Don't Starve Together organizes RPCs into several categories:

```lua
-- Main RPC categories
MAIN_RPC = {
    PlayerActionPickup = 0,
    PlayerActionPickupStack = 1,
    PlayerActionPickupHalf = 2,
    PlayerActionDropItem = 3,
    PlayerActionDropItemFromContainer = 4,
    -- Many more actions...
}

-- World RPC categories
WORLD_RPC = {
    Thunderstrike = 0,
    Extinguish = 1,
    PushExplosion = 2,
    -- More world effects...
}

-- Character RPC categories
CHARACTER_RPC = {
    SetBuffEnabled = 0,
    SetBuffLevel = 1,
    -- Character-specific actions...
}
```

## Defining Custom RPCs

For mods, you can define your own RPC messages:

```lua
-- In modmain.lua
MOD_RPC = {
    MyMod = {
        DoSpecialAttack = 0,
        RequestData = 1,
        UpdateUI = 2,
        -- Additional RPCs...
    }
}

-- Name conventions are important:
-- ModName = your mod's folder name
-- ActionName = descriptive name for the RPC
```

## Sending RPCs

### Client to Server

```lua
-- Basic client-to-server RPC
SendModRPCToServer(MOD_RPC.MyMod.DoSpecialAttack, target_entity, damage_multiplier)

-- Client requesting data from server
SendModRPCToServer(MOD_RPC.MyMod.RequestData, "player_stats")

-- Client informing server of a selection
SendModRPCToServer(MOD_RPC.MyMod.SelectOption, option_id)
```

### Server to Specific Client

```lua
-- Send RPC to a specific client (by userid/player entity)
SendModRPCToClient(MOD_RPC.MyMod.UpdateUI, player, "health", current_health, max_health)

-- Send RPC to client with additional parameters
SendModRPCToClient(MOD_RPC.MyMod.ShowEffect, player, effect_name, x, y, z, scale)
```

### Server to All Clients

```lua
-- Broadcast RPC to all clients
SendModRPCToClients(MOD_RPC.MyMod.WorldEvent, "earthquake", intensity, duration)

-- Broadcast position-based effect
local x, y, z = inst.Transform:GetWorldPosition()
SendModRPCToClients(MOD_RPC.MyMod.SpawnEffect, "explosion", x, y, z)
```

## Handling RPCs

### Client-to-Server Handlers

```lua
-- In modmain.lua (server-side handler)
AddModRPCHandler("MyMod", "DoSpecialAttack", function(player, target, multiplier)
    -- Validate player can perform this action
    if player.components.health:IsDead() or player:HasTag("playerghost") then
        return
    end
    
    -- Find target entity
    local target_ent = Ents[target]
    if target_ent == nil then
        return
    end
    
    -- Execute the action
    if player.components.combat ~= nil then
        local damage = player.components.combat.defaultdamage * multiplier
        player.components.combat:DoAttack(target_ent, nil, nil, nil, damage)
    end
end)
```

### Server-to-Client Handlers

```lua
-- In modmain.lua (client-side handler)
AddClientModRPCHandler("MyMod", "UpdateUI", function(health_name, current, maximum)
    -- Update UI element with new health value
    if health_name == "health" then
        UpdateHealthBar(current, maximum)
    elseif health_name == "sanity" then
        UpdateSanityBar(current, maximum)
    elseif health_name == "hunger" then
        UpdateHungerBar(current, maximum)
    end
end)

-- Handler for visual effects
AddClientModRPCHandler("MyMod", "ShowEffect", function(effect_name, x, y, z, scale)
    -- Spawn a client-side visual effect
    local fx = SpawnPrefab(effect_name)
    if fx ~= nil then
        fx.Transform:SetPosition(x, y, z)
        if scale ~= nil then
            fx.Transform:SetScale(scale, scale, scale)
        end
    end
end)
```

## RPC Parameter Types

RPCs support several parameter types:

```lua
-- Supported RPC parameter types
-- Number (float/integer)
SendModRPCToServer(MOD_RPC.MyMod.Example, 42, 3.14)

-- Boolean
SendModRPCToServer(MOD_RPC.MyMod.Example, true, false)

-- String
SendModRPCToServer(MOD_RPC.MyMod.Example, "player_name", "action_type")

-- Entity references (as EntityScript or EntityID)
SendModRPCToServer(MOD_RPC.MyMod.Example, target_entity, target_entity.entity:GetGUID())

-- Vector3 (as three separate parameters)
local x, y, z = inst.Transform:GetWorldPosition()
SendModRPCToServer(MOD_RPC.MyMod.Example, x, y, z)
```

## Common RPC Patterns

### Request-Response Pattern

```lua
-- Client requesting data
-- 1. Define RPCs
MOD_RPC = {
    MyMod = {
        RequestPlayerData = 0,
        ReceivePlayerData = 1,
    }
}

-- 2. Client sends request
SendModRPCToServer(MOD_RPC.MyMod.RequestPlayerData, target_player.userid)

-- 3. Server handles request and responds
AddModRPCHandler("MyMod", "RequestPlayerData", function(player, target_userid)
    -- Find target player
    local target = nil
    for _, v in ipairs(AllPlayers) do
        if v.userid == target_userid then
            target = v
            break
        end
    end
    
    if target ~= nil then
        -- Collect data
        local data = {
            health = target.components.health.currenthealth,
            sanity = target.components.sanity.current,
            hunger = target.components.hunger.current,
        }
        
        -- Send response back to requesting client
        SendModRPCToClient(MOD_RPC.MyMod.ReceivePlayerData, player, 
            target.userid, data.health, data.sanity, data.hunger)
    end
end)

-- 4. Client handles response
AddClientModRPCHandler("MyMod", "ReceivePlayerData", function(userid, health, sanity, hunger)
    -- Update UI with received data
    UpdatePlayerStatusDisplay(userid, health, sanity, hunger)
end)
```

### Action Confirmation Pattern

```lua
-- 1. Define RPCs
MOD_RPC = {
    MyMod = {
        AttemptSpecialAction = 0,
        ConfirmSpecialAction = 1,
    }
}

-- 2. Client requests action
SendModRPCToServer(MOD_RPC.MyMod.AttemptSpecialAction, target_position.x, target_position.z)

-- 3. Server validates and confirms
AddModRPCHandler("MyMod", "AttemptSpecialAction", function(player, x, z)
    -- Check if player can perform action
    if not CanPerformSpecialAction(player, x, z) then
        return
    end
    
    -- Perform the action
    local success = DoSpecialAction(player, x, z)
    
    -- Confirm back to client
    SendModRPCToClient(MOD_RPC.MyMod.ConfirmSpecialAction, player, success, x, z)
end)

-- 4. Client handles confirmation
AddClientModRPCHandler("MyMod", "ConfirmSpecialAction", function(success, x, z)
    if success then
        -- Play success effects
        SpawnPrefab("special_action_fx").Transform:SetPosition(x, 0, z)
    else
        -- Play failure animation
        ThePlayer.AnimState:PlayAnimation("special_action_fail")
    end
end)
```

## Advanced RPC Techniques

### RPC Batching

For multiple related updates:

```lua
-- Instead of multiple RPCs:
SendModRPCToClient(MOD_RPC.MyMod.UpdateStat, player, "health", 100)
SendModRPCToClient(MOD_RPC.MyMod.UpdateStat, player, "sanity", 200)
SendModRPCToClient(MOD_RPC.MyMod.UpdateStat, player, "hunger", 150)

-- Use a single batched RPC:
SendModRPCToClient(MOD_RPC.MyMod.UpdateAllStats, player, 100, 200, 150)
```

### Area-Based RPC Broadcasting

Send RPCs only to nearby players:

```lua
-- Find players within range of an effect
local x, y, z = inst.Transform:GetWorldPosition()
local nearby_players = FindPlayersInRange(x, y, z, TUNING.MAX_RPC_RANGE)

-- Send RPC only to nearby players
for _, player in ipairs(nearby_players) do
    SendModRPCToClient(MOD_RPC.MyMod.LocalEffect, player, "earthquake", x, y, z)
end
```

### RPC Rate Limiting

Prevent RPC spam:

```lua
-- Client-side rate limiting
local last_request_time = 0

local function TryRequestAction()
    local current_time = GetTime()
    if current_time - last_request_time < MIN_REQUEST_INTERVAL then
        return false
    end
    
    last_request_time = current_time
    SendModRPCToServer(MOD_RPC.MyMod.RequestAction)
    return true
end

-- Server-side rate limiting
local player_request_times = {}

AddModRPCHandler("MyMod", "RequestAction", function(player)
    local userid = player.userid
    local current_time = GetTime()
    
    if player_request_times[userid] and 
       current_time - player_request_times[userid] < MIN_REQUEST_INTERVAL then
        -- Ignore too-frequent requests
        return
    end
    
    player_request_times[userid] = current_time
    -- Process the request
end)
```

## Security Considerations

When implementing RPCs, always consider security:

1. **Validate Permissions**: Check if player has permission to perform action
2. **Verify Input**: Validate all RPC parameters before using them
3. **Check Entity Ownership**: Ensure player is authorized to control an entity
4. **Implement Rate Limiting**: Prevent RPC spam attacks
5. **Don't Trust Clients**: Always validate actions on the server

```lua
-- Example of secure RPC handling
AddModRPCHandler("MyMod", "HarvestCrop", function(player, crop_entity)
    -- Validate crop exists
    local crop = Ents[crop_entity]
    if crop == nil then return end
    
    -- Check distance (prevent cheating)
    local player_x, player_y, player_z = player.Transform:GetWorldPosition()
    local crop_x, crop_y, crop_z = crop.Transform:GetWorldPosition()
    local dist_sq = distsq(player_x, player_z, crop_x, crop_z)
    
    if dist_sq > TUNING.MAX_HARVEST_DISTANCE * TUNING.MAX_HARVEST_DISTANCE then
        return -- Too far away
    end
    
    -- Check if crop is ready
    if not crop.components.crop.mature then
        return -- Not ready for harvest
    end
    
    -- All checks passed, allow harvest
    crop.components.crop:Harvest(player)
end)
```

## Debugging RPCs

### Logging RPC Traffic

```lua
-- Add debug logging to RPC handlers
AddModRPCHandler("MyMod", "ExampleRPC", function(player, ...)
    local args = {...}
    print("Received ExampleRPC from " .. player:GetDisplayName())
    for i, arg in ipairs(args) do
        print("  Arg " .. i .. ": " .. tostring(arg))
    end
    
    -- Process RPC normally
end)
```

### Tracing RPC Performance

```lua
-- Measure RPC processing time
AddModRPCHandler("MyMod", "HeavyProcessing", function(player, ...)
    local start_time = GetTimeReal()
    
    -- Normal processing
    local result = DoHeavyProcessing(...)
    
    local end_time = GetTimeReal()
    print("HeavyProcessing RPC took " .. (end_time - start_time) * 1000 .. " ms")
    
    return result
end)
```

## Best Practices

1. **Use Appropriate Direction**: Choose the correct RPC direction for your needs
2. **Minimize RPC Count**: Batch related operations into single RPCs
3. **Validate All Input**: Never trust client-sent RPC parameters
4. **Check Permissions**: Verify player can perform the requested action
5. **Handle Failures Gracefully**: Provide feedback when RPCs can't be processed
6. **Document Your RPCs**: Keep clear documentation of each RPC's purpose and parameters
7. **Consistent Naming**: Use clear, consistent naming for your RPC identifiers 