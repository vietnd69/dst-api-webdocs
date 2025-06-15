---
id: rpc-system
title: Remote Procedure Call System
sidebar_position: 7
last_updated: 2023-07-06
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

## RPC Lifecycle

Understanding the complete lifecycle of an RPC helps in debugging and optimizing network communication:

### 1. Registration Phase

RPCs must be registered before they can be used:

```lua
-- In modmain.lua (shared by client and server)
MOD_RPC = {
    MyMod = {
        SyncWorldState = 0,
        RequestEntityInfo = 1,
        ReceiveEntityInfo = 2
    }
}

-- Register server-side handlers
AddModRPCHandler("MyMod", "SyncWorldState", OnSyncWorldState)
AddModRPCHandler("MyMod", "RequestEntityInfo", OnRequestEntityInfo)

-- Register client-side handlers
AddClientModRPCHandler("MyMod", "ReceiveEntityInfo", OnReceiveEntityInfo)
```

### 2. Serialization Phase

When an RPC is sent, parameters are serialized:

1. Basic types (numbers, booleans, strings) are directly serialized
2. Entity references are converted to network IDs
3. Vector3 values are split into separate x, y, z components
4. Tables and complex objects cannot be directly serialized

### 3. Network Transmission

The RPC message is transmitted over the network:

1. Client-to-server: Message is sent to the server
2. Server-to-client: Message is sent to specific client(s)
3. Broadcast: Message is sent to all connected clients

### 4. Deserialization Phase

When an RPC is received:

1. The message is deserialized
2. Parameters are converted back to appropriate types
3. Entity references are resolved from network IDs

### 5. Execution Phase

The registered handler function is called with the deserialized parameters.

### 6. Response Phase (Optional)

For request-response patterns, a response RPC may be sent back.

## Error Handling and Reliability

RPCs in Don't Starve Together are not guaranteed to be reliable. Network issues can cause messages to be lost or delayed.

### Handling RPC Failures

```lua
-- Client-side: Implement timeout and retry mechanism
local function RequestWithRetry(attempt)
    attempt = attempt or 1
    
    -- Send request
    SendModRPCToServer(MOD_RPC.MyMod.RequestData)
    
    -- Set up timeout
    if attempt < MAX_RETRIES then
        inst:DoTaskInTime(RETRY_TIMEOUT, function()
            -- If response flag not set, retry
            if not response_received then
                print("RPC request timed out, retrying (attempt " .. attempt + 1 .. ")")
                RequestWithRetry(attempt + 1)
            end
        end)
    else
        print("RPC request failed after " .. MAX_RETRIES .. " attempts")
        -- Handle ultimate failure
        OnRequestFailed()
    end
end

-- When response is received
AddClientModRPCHandler("MyMod", "ResponseData", function(...)
    response_received = true
    -- Handle response
end)
```

### Handling Disconnections

```lua
-- Track connection state
local was_connected = false

local function OnPlayerConnected(inst)
    local is_connected = TheNet:IsConnected()
    
    -- Detect reconnection
    if is_connected and not was_connected then
        print("Reconnected, re-syncing data...")
        -- Re-sync necessary data
        SendModRPCToServer(MOD_RPC.MyMod.RequestFullSync)
    end
    
    was_connected = is_connected
end

-- Listen for connection changes
inst:ListenForEvent("playeractivated", OnPlayerConnected)
inst:ListenForEvent("playerdeactivated", OnPlayerConnected)
```

## Data Serialization Strategies

Since RPCs can only transmit basic data types, complex data structures must be serialized.

### String Serialization

```lua
-- Serialize a table to a string
local function SerializeTable(t)
    local result = {}
    for k, v in pairs(t) do
        if type(v) == "string" then
            table.insert(result, k .. "=" .. v)
        elseif type(v) == "number" or type(v) == "boolean" then
            table.insert(result, k .. "=" .. tostring(v))
        end
    end
    return table.concat(result, "|")
end

-- Deserialize a string back to a table
local function DeserializeTable(str)
    local result = {}
    for pair in string.gmatch(str, "[^|]+") do
        local k, v = string.match(pair, "(.+)=(.+)")
        if k and v then
            -- Try to convert to number if possible
            local num = tonumber(v)
            if num then
                result[k] = num
            elseif v == "true" then
                result[k] = true
            elseif v == "false" then
                result[k] = false
            else
                result[k] = v
            end
        end
    end
    return result
end

-- Using serialization with RPCs
local data = {
    health = 75,
    hunger = 50,
    sanity = 100,
    buffs = "strength|speed",
    is_leader = true
}

-- Send serialized data
SendModRPCToServer(MOD_RPC.MyMod.UpdatePlayerState, SerializeTable(data))

-- Receive and deserialize
AddModRPCHandler("MyMod", "UpdatePlayerState", function(player, data_str)
    local data = DeserializeTable(data_str)
    -- Use data...
end)
```

### Chunked Data Transfer

For large data sets that exceed RPC parameter limits:

```lua
-- Client requesting large data
SendModRPCToServer(MOD_RPC.MyMod.RequestLargeData)

-- Server sending data in chunks
AddModRPCHandler("MyMod", "RequestLargeData", function(player)
    local large_data = GenerateLargeData()
    local chunk_size = 10 -- Items per chunk
    
    -- Send total count first
    SendModRPCToClient(MOD_RPC.MyMod.ReceiveLargeDataStart, player, #large_data)
    
    -- Send data in chunks
    for i = 1, #large_data, chunk_size do
        local chunk = {}
        for j = i, math.min(i + chunk_size - 1, #large_data) do
            table.insert(chunk, SerializeItem(large_data[j]))
        end
        
        -- Send chunk with index
        local chunk_index = math.floor((i - 1) / chunk_size) + 1
        SendModRPCToClient(MOD_RPC.MyMod.ReceiveLargeDataChunk, player, 
            chunk_index, table.concat(chunk, ";;"))
    end
    
    -- Signal completion
    SendModRPCToClient(MOD_RPC.MyMod.ReceiveLargeDataEnd, player)
end)

-- Client receiving chunked data
local received_chunks = {}
local total_chunks = 0
local total_items = 0

AddClientModRPCHandler("MyMod", "ReceiveLargeDataStart", function(count)
    total_items = count
    total_chunks = math.ceil(count / 10)
    received_chunks = {}
    print("Starting large data transfer, expecting " .. total_chunks .. " chunks")
end)

AddClientModRPCHandler("MyMod", "ReceiveLargeDataChunk", function(chunk_index, data)
    received_chunks[chunk_index] = data
    print("Received chunk " .. chunk_index .. " of " .. total_chunks)
end)

AddClientModRPCHandler("MyMod", "ReceiveLargeDataEnd", function()
    -- Combine all chunks
    local all_data = {}
    for i = 1, total_chunks do
        if received_chunks[i] then
            local items = string.split(received_chunks[i], ";;")
            for _, item_str in ipairs(items) do
                table.insert(all_data, DeserializeItem(item_str))
            end
        end
    end
    
    -- Process complete data
    ProcessCompleteData(all_data)
end)
```

## Complex Example: Multiplayer Trading System

This example demonstrates a complete trading system between players:

```lua
-- Define RPC messages for trading system
MOD_RPC = {
    TradingMod = {
        -- Client to server
        RequestTrade = 0,
        AcceptTrade = 1,
        DeclineTrade = 2,
        UpdateTradeOffer = 3,
        CancelTrade = 4,
        
        -- Server to client
        TradeRequested = 5,
        TradeAccepted = 6,
        TradeDeclined = 7,
        TradeOfferUpdated = 8,
        TradeCancelled = 9,
        TradeCompleted = 10
    }
}

-- Server-side trade management
local active_trades = {}

-- Client requests trade with another player
AddModRPCHandler("TradingMod", "RequestTrade", function(player, target_userid)
    -- Find target player
    local target = FindPlayerByUserID(target_userid)
    if not target then return end
    
    -- Check if players are close enough
    if not ArePlayersNearby(player, target) then
        -- Inform requesting player they're too far
        SendModRPCToClient(MOD_RPC.TradingMod.TradeDeclined, player, target_userid, "TOO_FAR")
        return
    end
    
    -- Check if either player is already trading
    if active_trades[player.userid] or active_trades[target_userid] then
        SendModRPCToClient(MOD_RPC.TradingMod.TradeDeclined, player, target_userid, "ALREADY_TRADING")
        return
    end
    
    -- Create pending trade
    active_trades[player.userid] = {
        status = "pending",
        partner = target.userid,
        items = {},
        timestamp = GetTime()
    }
    
    active_trades[target_userid] = {
        status = "requested",
        partner = player.userid,
        items = {},
        timestamp = GetTime()
    }
    
    -- Notify target about trade request
    SendModRPCToClient(MOD_RPC.TradingMod.TradeRequested, target, player.userid)
    
    -- Set timeout for trade request
    player:DoTaskInTime(TRADE_REQUEST_TIMEOUT, function()
        if active_trades[player.userid] and active_trades[player.userid].status == "pending" then
            -- Cancel timed-out trade request
            CancelTrade(player.userid, target_userid, "TIMEOUT")
        end
    end)
end)

-- Player accepts trade request
AddModRPCHandler("TradingMod", "AcceptTrade", function(player, requester_userid)
    -- Validate trade request exists
    if not active_trades[player.userid] or 
       active_trades[player.userid].status ~= "requested" or
       active_trades[player.userid].partner ~= requester_userid then
        return
    end
    
    -- Find requester
    local requester = FindPlayerByUserID(requester_userid)
    if not requester then
        CancelTrade(player.userid, requester_userid, "PLAYER_NOT_FOUND")
        return
    end
    
    -- Update trade status
    active_trades[player.userid].status = "active"
    active_trades[requester_userid].status = "active"
    
    -- Notify both players
    SendModRPCToClient(MOD_RPC.TradingMod.TradeAccepted, player, requester_userid)
    SendModRPCToClient(MOD_RPC.TradingMod.TradeAccepted, requester, player.userid)
end)

-- Player updates their trade offer
AddModRPCHandler("TradingMod", "UpdateTradeOffer", function(player, items_json)
    -- Validate player is in active trade
    if not active_trades[player.userid] or active_trades[player.userid].status ~= "active" then
        return
    end
    
    -- Parse items
    local success, items = pcall(function() return json.decode(items_json) end)
    if not success then return end
    
    -- Validate items exist in player's inventory
    local valid_items = ValidateTradeItems(player, items)
    
    -- Update trade offer
    active_trades[player.userid].items = valid_items
    active_trades[player.userid].ready = false
    
    -- Get partner
    local partner = FindPlayerByUserID(active_trades[player.userid].partner)
    if not partner then
        CancelTrade(player.userid, active_trades[player.userid].partner, "PARTNER_NOT_FOUND")
        return
    end
    
    -- Notify partner about updated offer
    local items_str = json.encode(valid_items)
    SendModRPCToClient(MOD_RPC.TradingMod.TradeOfferUpdated, partner, player.userid, items_str)
end)

-- Helper function to execute the trade
local function ExecuteTrade(player1_id, player2_id)
    local player1 = FindPlayerByUserID(player1_id)
    local player2 = FindPlayerByUserID(player2_id)
    
    if not player1 or not player2 then
        CancelTrade(player1_id, player2_id, "PLAYER_NOT_FOUND")
        return false
    end
    
    local trade1 = active_trades[player1_id]
    local trade2 = active_trades[player2_id]
    
    -- Transfer items from player1 to player2
    for _, item_data in ipairs(trade1.items) do
        local item = FindItemInInventory(player1, item_data.id)
        if item then
            TransferItemBetweenPlayers(item, player1, player2)
        end
    end
    
    -- Transfer items from player2 to player1
    for _, item_data in ipairs(trade2.items) do
        local item = FindItemInInventory(player2, item_data.id)
        if item then
            TransferItemBetweenPlayers(item, player2, player1)
        end
    end
    
    -- Notify both players
    SendModRPCToClient(MOD_RPC.TradingMod.TradeCompleted, player1, player2_id)
    SendModRPCToClient(MOD_RPC.TradingMod.TradeCompleted, player2, player1_id)
    
    -- Clear trade data
    active_trades[player1_id] = nil
    active_trades[player2_id] = nil
    
    return true
end

-- Client-side trade UI handling
local trade_ui = nil
local current_trade_partner = nil

-- Handle incoming trade request
AddClientModRPCHandler("TradingMod", "TradeRequested", function(requester_userid)
    -- Find requester name
    local requester_name = GetPlayerNameFromUserID(requester_userid)
    
    -- Show trade request UI
    ShowTradeRequestUI(requester_name, requester_userid)
end)

-- Handle trade acceptance
AddClientModRPCHandler("TradingMod", "TradeAccepted", function(partner_userid)
    -- Open trade UI
    current_trade_partner = partner_userid
    trade_ui = ShowTradeUI(partner_userid)
end)

-- Handle updated trade offer from partner
AddClientModRPCHandler("TradingMod", "TradeOfferUpdated", function(partner_userid, items_json)
    if not trade_ui then return end
    
    -- Parse items
    local success, items = pcall(function() return json.decode(items_json) end)
    if not success then return end
    
    -- Update UI with partner's offer
    trade_ui:UpdatePartnerOffer(items)
end)

-- Handle trade completion
AddClientModRPCHandler("TradingMod", "TradeCompleted", function(partner_userid)
    if not trade_ui then return end
    
    -- Show completion message
    trade_ui:ShowTradeCompleted()
    
    -- Close UI after delay
    ThePlayer:DoTaskInTime(2, function()
        trade_ui:Close()
        trade_ui = nil
        current_trade_partner = nil
    end)
end)

## Best Practices

1. **Use Appropriate Direction**: Choose the correct RPC direction for your needs
2. **Minimize RPC Count**: Batch related operations into single RPCs
3. **Validate All Input**: Never trust client-sent RPC parameters
4. **Check Permissions**: Verify player can perform the requested action
5. **Handle Failures Gracefully**: Provide feedback when RPCs can't be processed
6. **Document Your RPCs**: Keep clear documentation of each RPC's purpose and parameters
7. **Consistent Naming**: Use clear, consistent naming for your RPC identifiers 
