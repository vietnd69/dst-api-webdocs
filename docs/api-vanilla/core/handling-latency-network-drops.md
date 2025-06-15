---
id: handling-latency-network-drops
title: Handling Latency and Network Drops
sidebar_position: 9
---

# Handling Latency and Network Drops

In multiplayer games like Don't Starve Together, network latency and disconnections are inevitable challenges that modders must address. This guide covers techniques for creating mods that gracefully handle network issues while maintaining a smooth player experience.

## Understanding Network Challenges in DST

Don't Starve Together uses a client-server architecture where:

- The **server** is authoritative and maintains the "true" game state
- **Clients** receive updates from the server and predict some behaviors
- Network issues can disrupt this communication flow

Common network problems include:

1. **Latency**: Delay between client actions and server responses
2. **Packet Loss**: Some network messages never arrive
3. **Disconnections**: Temporary or prolonged loss of connection
4. **Desynchronization**: Client and server states diverge

## Detecting Network Issues

### Monitoring Connection Quality

```lua
-- In your mod's main file
local function MonitorNetworkStatus()
    -- Check if we're in a networked game
    if not TheNet:GetIsClient() and not TheNet:GetIsServer() then
        return
    end
    
    -- Get current ping
    local ping = TheNet:GetAveragePing()
    
    -- Classify connection quality
    local connection_quality = "good"
    if ping > 300 then
        connection_quality = "poor"
    elseif ping > 150 then
        connection_quality = "fair"
    end
    
    -- Log or react to connection quality
    print("Current connection quality:", connection_quality, "Ping:", ping)
    
    -- Adjust mod behavior based on connection quality
    if connection_quality == "poor" then
        -- Reduce visual effects, batch updates, etc.
    end
end

-- Run this check periodically
inst:DoPeriodicTask(5, MonitorNetworkStatus)
```

### Detecting Disconnections

```lua
-- Listen for disconnection events
TheWorld:ListenForEvent("ms_playerdisconnected", function(world, player)
    print("Player disconnected:", player.name)
    -- Handle player disconnection
end)

-- Listen for reconnection events
TheWorld:ListenForEvent("ms_playerreconnected", function(world, player)
    print("Player reconnected:", player.name)
    -- Handle player reconnection
end)

-- Listen for server pauses (often indicates network issues)
TheWorld:ListenForEvent("ms_serverpauseddirty", function(world)
    local is_paused = TheNet:GetServerPaused()
    print("Server paused state changed:", is_paused)
end)
```

## Strategies for Handling Latency

### Client-Side Prediction

Client-side prediction allows players to see immediate responses to their actions while waiting for server confirmation:

```lua
-- Example of client-side prediction for movement
local PlayerController = Class(function(self, inst)
    self.inst = inst
    self.predicted_position = Vector3(0, 0, 0)
    self.last_server_position = Vector3(0, 0, 0)
    self.last_input_time = 0
    self.pending_moves = {}
end)

function PlayerController:Move(direction, delta_time)
    -- Record this move
    local move = {
        direction = direction,
        delta_time = delta_time,
        timestamp = GetTime()
    }
    table.insert(self.pending_moves, move)
    
    -- Apply prediction locally
    if not TheWorld.ismastersim then
        -- Update predicted position
        local speed = 4 -- units per second
        local dx = direction.x * speed * delta_time
        local dz = direction.z * speed * delta_time
        
        self.predicted_position.x = self.predicted_position.x + dx
        self.predicted_position.z = self.predicted_position.z + dz
        
        -- Apply predicted position
        self.inst.Transform:SetPosition(self.predicted_position:Get())
    end
    
    -- Send move to server
    SendModRPCToServer(MOD_RPC.MyMod.PlayerMove, direction.x, direction.z, delta_time)
end

-- When server position update arrives
function PlayerController:OnServerPositionUpdate(x, y, z)
    self.last_server_position = Vector3(x, y, z)
    
    -- Calculate error between prediction and reality
    local error_distance = self.predicted_position:Dist(self.last_server_position)
    
    -- If error is significant, correct position
    if error_distance > 2 then
        -- Immediate correction (teleport)
        self.predicted_position = Vector3(x, y, z)
        self.inst.Transform:SetPosition(x, y, z)
        
        -- Clear pending moves that have been resolved
        self:ClearPendingMoves()
    else if error_distance > 0.5 then
        -- Smooth correction (interpolate)
        self:SmoothCorrection()
    end
end
```

### Input Buffering

Input buffering helps maintain responsiveness during latency spikes:

```lua
local InputBuffer = Class(function(self, inst)
    self.inst = inst
    self.buffer = {}
    self.buffer_size = 10 -- Maximum buffered inputs
    self.processing = false
end)

function InputBuffer:AddInput(input_type, data)
    if #self.buffer >= self.buffer_size then
        -- Buffer full, remove oldest input
        table.remove(self.buffer, 1)
    end
    
    -- Add new input to buffer
    table.insert(self.buffer, {
        type = input_type,
        data = data,
        timestamp = GetTime()
    })
    
    -- Try to process buffer
    self:ProcessBuffer()
end

function InputBuffer:ProcessBuffer()
    if self.processing then return end
    
    self.processing = true
    
    while #self.buffer > 0 do
        local input = table.remove(self.buffer, 1)
        
        -- Check if input is still valid (not too old)
        if GetTime() - input.timestamp < 1.0 then
            -- Process the input
            if input.type == "attack" then
                self:ProcessAttack(input.data)
            elseif input.type == "use_item" then
                self:ProcessItemUse(input.data)
            end
        end
    end
    
    self.processing = false
end
```

### Action Queueing

Action queueing ensures that player commands are executed in sequence, even with network delays:

```lua
local ActionQueue = Class(function(self, inst)
    self.inst = inst
    self.queue = {}
    self.executing = false
end)

function ActionQueue:PushAction(action, target)
    -- Add action to queue
    table.insert(self.queue, {
        action = action,
        target = target,
        timestamp = GetTime()
    })
    
    -- Try to execute next action
    self:TryExecuteNext()
end

function ActionQueue:TryExecuteNext()
    if self.executing or #self.queue == 0 then
        return
    end
    
    self.executing = true
    local action_data = table.remove(self.queue, 1)
    
    -- Execute the action
    if action_data.action == "harvest" then
        self:ExecuteHarvest(action_data.target, function()
            -- Action completed callback
            self.executing = false
            self:TryExecuteNext() -- Try next action
        end)
    elseif action_data.action == "attack" then
        self:ExecuteAttack(action_data.target, function()
            -- Action completed callback
            self.executing = false
            self:TryExecuteNext() -- Try next action
        end)
    end
end
```

## Handling Network Drops

### State Saving and Recovery

Implement state saving to recover from disconnections:

```lua
-- Save important state periodically
local function SaveModState(inst)
    if not TheWorld.ismastersim then return end
    
    local state = {
        version = MOD_VERSION,
        timestamp = GetTime(),
        player_states = {},
        world_state = {
            day = TheWorld.state.cycles,
            season = TheWorld.state.season
        }
    }
    
    -- Save state for each player
    for i, player in ipairs(AllPlayers) do
        if player.userid then
            state.player_states[player.userid] = {
                position = { player.Transform:GetWorldPosition() },
                health = player.components.health.currenthealth,
                inventory_items = GetPlayerInventoryItems(player)
            }
        end
    end
    
    -- Save to mod storage
    SaveModData(state)
end

-- Set up periodic saving
TheWorld:DoPeriodicTask(60, SaveModState) -- Save every minute

-- Try to restore state on reconnection
local function TryRestoreState(player)
    if not player.userid then return false end
    
    local state = LoadModData()
    if not state or not state.player_states or not state.player_states[player.userid] then
        return false
    end
    
    local player_state = state.player_states[player.userid]
    
    -- Check if state is still valid (not too old)
    if GetTime() - state.timestamp > MAX_STATE_AGE then
        return false
    end
    
    -- Restore player state
    if player_state.position then
        player.Transform:SetPosition(unpack(player_state.position))
    end
    
    if player_state.health and player.components.health then
        player.components.health:SetVal(player_state.health)
    end
    
    -- Restore inventory if needed
    if player_state.inventory_items then
        RestorePlayerInventory(player, player_state.inventory_items)
    end
    
    return true
end

-- Listen for player spawns (including reconnections)
TheWorld:ListenForEvent("ms_playerspawn", function(world, player)
    TryRestoreState(player)
end)
```

### Graceful Degradation

Design your mod to function with reduced features during connection issues:

```lua
-- Check connection before performing network-intensive operations
local function PerformComplexNetworkOperation()
    local ping = TheNet:GetAveragePing()
    
    if ping > 300 then
        -- Connection is poor, use simplified version
        PerformSimplifiedOperation()
    else
        -- Connection is good, use full version
        PerformFullOperation()
    end
end

-- Example of degrading visual quality based on network performance
local function UpdateVisualEffects()
    local ping = TheNet:GetAveragePing()
    
    if ping > 300 then
        -- Reduce particle effects
        MAX_PARTICLES = 10
        PARTICLE_DETAIL = "LOW"
    elseif ping > 150 then
        -- Medium quality
        MAX_PARTICLES = 30
        PARTICLE_DETAIL = "MEDIUM"
    else
        -- Full quality
        MAX_PARTICLES = 50
        PARTICLE_DETAIL = "HIGH"
    end
    
    -- Apply settings
    UpdateParticleSystem(MAX_PARTICLES, PARTICLE_DETAIL)
end
```

### Reconnection Handling

Implement proper reconnection logic:

```lua
-- Track connection state
local was_connected = false
local pending_actions = {}
local last_known_position = nil

local function OnConnectionChanged()
    local is_connected = TheNet:IsConnected()
    
    if is_connected and not was_connected then
        -- Just reconnected
        print("Reconnected to server")
        
        -- Resync critical data
        SendModRPCToServer(MOD_RPC.MyMod.RequestFullSync)
        
        -- Replay any pending actions
        for _, action in ipairs(pending_actions) do
            SendModRPCToServer(MOD_RPC.MyMod.PerformAction, 
                action.type, action.target, action.data)
        end
        pending_actions = {}
        
    elseif not is_connected and was_connected then
        -- Just disconnected
        print("Disconnected from server")
        
        -- Save current position
        if ThePlayer then
            last_known_position = Vector3(ThePlayer.Transform:GetWorldPosition())
        end
    end
    
    was_connected = is_connected
end

-- Listen for connection changes
TheNet:ListenForEvent("connectionchanged", OnConnectionChanged)
```

## Testing Network Conditions

### Simulating Network Issues

For testing how your mod handles network problems:

```lua
-- Network condition simulator
local NetworkSimulator = Class(function(self)
    self.enabled = false
    self.latency = 0
    self.packet_loss = 0
    self.original_send_fn = nil
end)

function NetworkSimulator:Enable()
    if self.enabled then return end
    
    self.enabled = true
    
    -- Save original network send function
    self.original_send_fn = SendModRPCToServer
    
    -- Override with our simulated version
    _G.SendModRPCToServer = function(...)
        local args = {...}
        
        -- Simulate packet loss
        if math.random() < self.packet_loss then
            print("NetworkSimulator: Dropped packet")
            return
        end
        
        -- Simulate latency
        if self.latency > 0 then
            local delay = self.latency * (0.8 + math.random() * 0.4) -- Add some variance
            ThePlayer:DoTaskInTime(delay, function()
                self.original_send_fn(unpack(args))
            end)
        else
            self.original_send_fn(unpack(args))
        end
    end
end

function NetworkSimulator:Disable()
    if not self.enabled then return end
    
    self.enabled = false
    
    -- Restore original function
    if self.original_send_fn then
        _G.SendModRPCToServer = self.original_send_fn
        self.original_send_fn = nil
    end
end

function NetworkSimulator:SetLatency(ms)
    self.latency = ms / 1000 -- Convert to seconds
end

function NetworkSimulator:SetPacketLoss(percentage)
    self.packet_loss = percentage / 100
end

-- Usage example (in development only!)
local network_sim = NetworkSimulator()
network_sim:Enable()
network_sim:SetLatency(200) -- 200ms latency
network_sim:SetPacketLoss(5) -- 5% packet loss
```

### Testing Different Network Scenarios

```lua
-- Test scenarios for different network conditions
local function TestNetworkScenarios()
    local scenarios = {
        {name = "Good Connection", latency = 50, packet_loss = 0},
        {name = "Moderate Latency", latency = 150, packet_loss = 1},
        {name = "High Latency", latency = 300, packet_loss = 2},
        {name = "Very Poor Connection", latency = 500, packet_loss = 10}
    }
    
    local current_scenario = 1
    
    -- Function to apply next scenario
    local function ApplyNextScenario()
        if current_scenario > #scenarios then
            network_sim:Disable()
            print("Network testing complete")
            return
        end
        
        local scenario = scenarios[current_scenario]
        print("Testing scenario:", scenario.name)
        network_sim:SetLatency(scenario.latency)
        network_sim:SetPacketLoss(scenario.packet_loss)
        
        -- Move to next scenario after delay
        ThePlayer:DoTaskInTime(30, function()
            current_scenario = current_scenario + 1
            ApplyNextScenario()
        end)
    end
    
    -- Start testing
    network_sim:Enable()
    ApplyNextScenario()
end
```

## Best Practices

1. **Always validate on the server**: Never trust client data that could be affected by network issues
2. **Use prediction wisely**: Predict common actions but be ready to correct when server data arrives
3. **Implement timeouts**: Don't wait indefinitely for network responses
4. **Provide feedback**: Let players know when network issues are affecting gameplay
5. **Batch network messages**: Combine multiple small updates into larger, less frequent ones
6. **Prioritize critical data**: Ensure important game state updates are sent reliably
7. **Design for disconnections**: Make sure your mod can handle players dropping and reconnecting
8. **Test with poor connections**: Regularly test your mod under various network conditions

## See also

- [Client-Server Synchronization](client-server-synchronization.md) - For synchronization techniques
- [RPC System](rpc-system.md) - For communication between client and server
- [Network System](network-system.md) - For core networking concepts
- [Security Considerations in Networking](security-considerations-networking.md) - For network security best practices
- [Network Bandwidth Optimization](network-bandwidth-optimization.md) - For optimizing network usage 