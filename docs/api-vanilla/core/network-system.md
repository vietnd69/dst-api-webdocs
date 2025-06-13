---
id: network-system
title: Network System
sidebar_position: 6
---

# Network System

The Don't Starve Together network system enables multiplayer functionality by managing communication between server and clients. This document covers the core networking concepts, synchronization mechanisms, and implementation details.

## Overview

Don't Starve Together uses a client-server architecture where:
- The server holds the authoritative game state
- Clients receive updates from the server
- Clients send input actions to the server
- The server processes these actions and broadcasts the results

```
┌────────┐         ┌────────┐
│ Server │◄────────┤ Client │
└───┬────┘         └────────┘
    │              ┌────────┐
    └─────────────►│ Client │
                   └────────┘
```

## Server Authority Model

DST follows a strict server authority model where:

1. All game state is owned by the server (the "master simulation" or "mastersim")
2. Clients only render and predict the game state
3. Clients cannot modify the game state directly
4. Clients request changes via actions, which the server validates and executes

```lua
-- Example of checking for server authority
if TheWorld.ismastersim then
    -- Server-only code
    inst.components.health:SetMaxHealth(100)
else
    -- Client-only code
    -- Cannot modify server components directly
end
```

## Network Variables

Network variables (netvars) are special variables that automatically sync between server and clients:

```lua
-- Basic netvar types
local net_string = require "net_string"
local net_float = require "net_float"
local net_int = require "net_int"
local net_byte = require "net_byte"
local net_bool = require "net_bool"
local net_tinybyte = require "net_tinybyte"
local net_smallbyte = require "net_smallbyte"
local net_hash = require "net_hash"
local net_entity = require "net_entity"
```

### Creating Network Variables

Network variables are initialized with:
1. An entity GUID (to identify the owner)
2. A variable path (for dirty event naming)
3. An optional dirty event name

```lua
function MyComponent:ctor(inst)
    self.inst = inst
    
    -- Network variable with custom dirty event
    self.health = net_float(inst.GUID, "health.current", "healthdirty")
    
    -- Network variable with default dirty event
    self.level = net_int(inst.GUID, "level.value")
    
    -- Listen for dirty events on clients
    if not TheWorld.ismastersim then
        inst:ListenForEvent("healthdirty", function()
            -- Health value changed
            print("Health changed to: " .. self.health:value())
        end)
    end
end
```

### Using Network Variables

```lua
-- Setting a network variable (server only)
if TheWorld.ismastersim then
    self.health:set(100)
end

-- Reading a network variable (server and client)
local current_health = self.health:value()

-- Setting with a dirty callback parameter
self.health:set_local(50) -- Set without triggering dirty events
self.health:set(75, true) -- Force dirty event even if value hasn't changed
```

## Replicated Components

Components in DST exist in two forms:

1. **Server Components**: Full implementation with game logic
2. **Client Replicas**: Simplified versions containing only data needed by clients

### Creating a Component with Replica

Server component:
```lua
-- components/mycomponent.lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 10
    -- Server-only functionality
end)

function MyComponent:SetValue(val)
    self.value = val
    self.inst:PushEvent("valuechanged", {value = val})
end

function MyComponent:GetValue()
    return self.value
end

return MyComponent
```

Client replica:
```lua
-- components/mycomponent_replica.lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    -- Network variable for synchronization
    self._value = net_int(inst.GUID, "mycomponent.value", "valuedirty")
    
    if not TheWorld.ismastersim then
        inst:ListenForEvent("valuedirty", function()
            inst:PushEvent("valuechanged", {value = self:GetValue()})
        end)
    end
end)

function MyComponent:SetValue(val)
    if TheWorld.ismastersim then
        self._value:set(val)
    end
end

function MyComponent:GetValue()
    return self._value:value()
end

return MyComponent
```

### Registering and Using Replicas

```lua
-- In modmain.lua
AddReplicableComponent("mycomponent")

-- In prefab definition
local function fn()
    local inst = CreateEntity()
    
    -- Setup for both server and client
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    -- Mark entity as having completed client setup
    inst.entity:SetPristine()
    
    -- Client setup is complete
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Server-only components
    inst:AddComponent("mycomponent")
    inst.components.mycomponent:SetValue(100)
    
    return inst
end
```

## Remote Procedure Calls (RPCs)

RPCs allow executing functions remotely between server and clients.

### RPC Types

```lua
-- RPC directions
RPC = {
    -- Server to clients
    Broadcast = 0, -- Send to all clients
    Target = 1,    -- Send to a specific client
    
    -- Client to server
    ToServer = 2   -- Send from client to server
}
```

### Defining RPC Messages

RPCs are defined with unique identifiers:

```lua
-- In modmain.lua
MOD_RPC = {
    MyMod = {
        ExampleRPC = 0,
        AnotherRPC = 1
    }
}
```

### Sending RPC Messages

```lua
-- Client sending to server
SendModRPCToServer(MOD_RPC.MyMod.ExampleRPC, param1, param2)

-- Server broadcasting to all clients
SendModRPCToClient(MOD_RPC.MyMod.AnotherRPC, client, param1)

-- Server sending to all clients
SendModRPCToClients(MOD_RPC.MyMod.AnotherRPC, param1)
```

### Handling RPC Messages

```lua
-- In modmain.lua
-- Register handler for client-to-server RPC
AddModRPCHandler("MyMod", "ExampleRPC", function(player, param1, param2)
    -- Handle the RPC from client
    print(player:GetDisplayName() .. " sent RPC with " .. param1)
end)

-- Register handler for server-to-client RPC
AddClientModRPCHandler("MyMod", "AnotherRPC", function(param1)
    -- Handle the RPC from server
    print("Server sent RPC with " .. param1)
end)
```

## Entity Synchronization

Entities synchronize between server and client through several mechanisms:

### Entity Setup for Networking

```lua
local function CreateNetworkedEntity()
    local inst = CreateEntity()
    
    -- Essential for networking
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    -- Tag for classification
    inst:AddTag("networked")
    
    -- Network variables visible to clients
    inst.displayname = net_string(inst.GUID, "displayname", "displaynamedirty")
    
    -- Mark entity setup as complete for clients
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        -- Client-only code
        inst:ListenForEvent("displaynamedirty", OnNameChanged)
        return inst
    end
    
    -- Server-only components and setup
    inst.components.named:SetName("EntityName")
    
    return inst
end
```

### Entity Ownership

Some entities can be "owned" by clients for more responsive interaction:

```lua
-- Give client authority over an entity
inst.Network:SetClassifiedTarget(client)

-- Give server back authority
inst.Network:SetClassifiedTarget(nil)
```

## Optimizing Network Usage

DST provides several methods to optimize network traffic:

### Batch Updates

```lua
-- Group multiple updates to reduce network messages
inst.components.container:StartUpdating()
-- Make multiple changes
inst.components.container:GiveItem(item1)
inst.components.container:GiveItem(item2)
inst.components.container:GiveItem(item3)
-- Send a single update
inst.components.container:StopUpdating()
```

### Priority Systems

```lua
-- Network priority levels
NETWORK_PRIORITY = {
    CRITICAL = 0,  -- Must be delivered immediately
    HIGH = 1,      -- Important for gameplay
    MEDIUM = 2,    -- Standard priority
    LOW = 3        -- Can be delayed if needed
}

-- Set entity network priority
inst.entity:SetPriority(NETWORK_PRIORITY.HIGH)
```

### Relevance Checking

```lua
-- Only sync with nearby players
local x, y, z = inst.Transform:GetWorldPosition()
local players = FindPlayersInRange(x, y, z, TUNING.MAX_SYNC_DISTANCE)
for _, player in ipairs(players) do
    SendModRPCToClient(MOD_RPC.MyMod.AnotherRPC, player.userid, param1)
end
```

## Advanced Networking Techniques

### Client Prediction

Client prediction helps reduce perceived latency:

```lua
-- In locomotor component
if TheWorld.ismastersim then
    -- Server: Set actual position
    self.inst.Transform:SetPosition(x, y, z)
else
    -- Client: Predict position based on input
    local predicted_x = start_x + (speed * dt * direction_x)
    local predicted_z = start_z + (speed * dt * direction_z)
    self.inst.Transform:SetPosition(predicted_x, y, predicted_z)
end
```

### Server Reconciliation

When server corrections arrive, clients must reconcile differences:

```lua
-- Listen for position correction from server
inst:ListenForEvent("onpositionupdate", function(inst, data)
    -- Smoothly move to correct position
    inst:DoTaskInTime(0.1, function()
        inst.Transform:SetPosition(data.x, data.y, data.z)
    end)
end)
```

### Network Debugging

Tools for diagnosing network issues:

```lua
-- Print network statistics
print("Network Statistics:")
print("Bandwidth In: " .. TheSim:GetBandwidthIn())
print("Bandwidth Out: " .. TheSim:GetBandwidthOut())
print("Packet Loss: " .. TheSim:GetPacketLoss())

-- Show network entities
c_countallnetwork() -- Console command

-- Track bandwidth usage
c_bandwidth() -- Console command
```

## Example: Synchronized Item Chest

Complete example of a chest with synchronized inventory:

```lua
local function MakeNetworkedChest()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Visual setup
    inst.AnimState:SetBank("chest")
    inst.AnimState:SetBuild("treasure_chest")
    inst.AnimState:PlayAnimation("closed")
    
    -- Tags for identification
    inst:AddTag("chest")
    inst:AddTag("structure")
    
    -- Network variables for UI
    inst.openlid = net_bool(inst.GUID, "chest.openlid", "openlidchest")
    
    inst.entity:SetPristine()
    
    -- Client-side handlers
    if not TheWorld.ismastersim then
        -- Handle lid animation on clients
        inst:ListenForEvent("openlidchest", function()
            if inst.openlid:value() then
                inst.AnimState:PlayAnimation("open")
            else
                inst.AnimState:PlayAnimation("closed")
            end
        end)
        return inst
    end
    
    -- Server-side components
    inst:AddComponent("container")
    inst.components.container:SetNumSlots(9)
    
    -- UI configuration
    inst.components.container.widgetslotpos = {}
    for y = 0, 2 do
        for x = 0, 2 do
            table.insert(inst.components.container.widgetslotpos, 
                Vector3(80*x-80*2/2, 80*y-80*2/2, 0))
        end
    end
    inst.components.container.widgetanimbank = "ui_chest_3x3"
    inst.components.container.widgetanimbuild = "ui_chest_3x3"
    
    -- Connect container events to network variables
    inst:ListenForEvent("onopen", function()
        inst.openlid:set(true)
    end)
    
    inst:ListenForEvent("onclose", function()
        inst.openlid:set(false)
    end)
    
    return inst
end
```

## Network Limitations and Best Practices

1. **Minimize Synchronization**: Only sync what clients absolutely need
2. **Use Appropriate Data Types**: Smaller data types use less bandwidth
3. **Batch Updates**: Group related changes together
4. **Prioritize Critical Data**: Use network priorities appropriately
5. **Consider Latency**: Design systems that are resilient to latency
6. **Avoid Client Authority**: Remember the server is always authoritative
7. **Test with Artificial Latency**: Use network condition simulators 