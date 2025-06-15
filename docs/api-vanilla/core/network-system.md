---
id: network-system
title: Network System
sidebar_position: 6
---

# Network System

The Don't Starve Together network system enables multiplayer functionality by managing communication between server and clients. This document covers the core networking concepts, synchronization mechanisms, and implementation details.

For a practical example of advanced networking in a complex mod, see the [The Forge Case Study](../examples/case-forge.md), which demonstrates synchronizing game state, UI elements, and combat mechanics in a multiplayer arena game mode.

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

* **Client to Server**: Actions from client to server
* **Server to Client**: Updates from server to client
* **Server to All Clients**: Broadcasts to all connected clients
* **Shard RPCs**: Communication between different world shards (surface/caves)

### Creating and Using RPCs

```lua
-- Define an RPC handler in modmain.lua
AddModRPCHandler("MyMod", "ExampleRPC", function(player, param1, param2)
    print(string.format("RPC called by %s with params: %s, %s", 
        player.name, tostring(param1), tostring(param2)))
    
    -- Do something with the received data
    if player.components.mycomponent then
        player.components.mycomponent:DoSomething(param1, param2)
    end
end)

-- Trigger the RPC from client code
SendModRPCToServer(MOD_RPC.MyMod.ExampleRPC, "hello", 42)

-- Send an RPC from server to specific client
SendModRPCToClient(MOD_RPC.MyMod.ClientRPC, client, "message")

-- Send an RPC from server to all clients
SendModRPCToAllClients(MOD_RPC.MyMod.BroadcastRPC, "message")
```

## Classified Entities

For complex replicated data, DST often uses "classified" entities - invisible entities that serve as containers for networked variables.

```lua
-- Creating a classified entity
local classified = CreateEntity()
classified.entity:AddNetwork()
classified.entity:Hide()
classified.persists = false

-- Adding network variables
classified.health = net_float(classified.GUID, "health", "healthdirty")
classified.max_health = net_float(classified.GUID, "max_health")

-- Setting up relationships between entities
classified:SetParent(owner)
owner.player_classified = classified

-- Mark as ready for network use
classified.entity:SetPristine()

-- Client-side event handlers
if not TheWorld.ismastersim then
    owner:ListenForEvent("healthdirty", OnHealthDirty, classified)
end
```

## Best Practices

1. **Minimize Network Traffic**: Send only necessary data to reduce bandwidth usage
2. **Prediction**: Implement client-side prediction for smooth gameplay
3. **Authority Validation**: Always validate client requests on the server
4. **Resynchronization**: Provide mechanisms to recover from desync situations
5. **Progressive Loading**: Load and synchronize data progressively for large worlds

## See Also

- [Client-Server Synchronization](client-server-synchronization.md)
- [RPC System](rpc-system.md)
- [Network Bandwidth Optimization](network-bandwidth-optimization.md)
- [Handling Latency](handling-latency-network-drops.md)
- [Security Considerations](security-considerations-networking.md)
- [Global Position CompleteSync Case Study](../examples/case-global-position.md) - Real-world example of advanced networking implementation
- [Re-Gorge-itated Case Study](../examples/case-regorgeitaled.md) - Example of multiplayer voting systems and network synchronization 