---
id: network
title: Network
sidebar_position: 8
---

# Network

Network nodes handle the synchronization of game state between server and clients in Don't Starve Together's multiplayer environment.

## Overview

Network nodes enable multiplayer functionality by serializing and deserializing game state data, handling replication of entities and their properties, and managing client-server communication.

## Network Components

### NetVars (Network Variables)

NetVars are variables that are automatically synchronized between server and clients:

```lua
-- Defining network variables
self.isopen = net_bool(self.inst.GUID, "chest.isopen", "isopendirty")
self.health = net_float(self.inst.GUID, "health.current", "healthdirty")
self.playername = net_string(self.inst.GUID, "player.name", "namedirty")
```

Common NetVar types:
- `net_bool`: Boolean values
- `net_byte`: Small integer values (0-255)
- `net_shortint`: Short integer values
- `net_int`: Integer values
- `net_float`: Floating point values
- `net_string`: String values
- `net_entity`: Entity references
- `net_hash`: Hash values
- `net_smallbyte`: Very small integer values (0-15)

### Listening for Network Events

```lua
-- On server side
self.isopen:set(true)

-- On client side
self.inst:ListenForEvent("isopendirty", function()
    local isopen = self.isopen:value()
    -- Update client-side presentation based on isopen value
end)
```

## Replication

Replication is the process of synchronizing entity state between server and clients:

```lua
-- Common pattern for component replication
local function OnHealthDelta(inst)
    if not inst.components.health:IsDead() then
        inst.AnimState:SetPercent("hit", 1 - inst.components.health:GetPercent())
    end
end

local function OnIsOpen(inst)
    if inst.isopen:value() then
        inst.AnimState:PlayAnimation("open")
    else
        inst.AnimState:PlayAnimation("close")
    end
end

-- Create client-side representation
local function ClientInit(inst)
    inst:ListenForEvent("healthdirty", OnHealthDelta)
    inst:ListenForEvent("isopendirty", OnIsOpen)
end

-- Create server-side representation
local function MasterInit(inst)
    -- Server-side initialization
end

-- Common initialization
local function SharedInit(inst)
    -- Shared initialization
end

return function(inst)
    SharedInit(inst)
    
    if TheWorld.ismastersim then
        MasterInit(inst)
    else
        ClientInit(inst)
    end
end
```

## RPC (Remote Procedure Calls)

RPCs allow executing functions remotely:

```lua
-- Define an RPC
AddClientModRPCHandler("MyMod", "DoSomething", function(player, arg1, arg2)
    -- Handle the RPC on receiving side
end)

-- Send an RPC
SendModRPCToServer("MyMod", "DoSomething", arg1, arg2)
```

## Network Tags

Some special tags affect network behavior:
- `_master`: Entity exists on server
- `_replica`: Entity's client replica
- `networker`: Entity handles network communication

## Master Simulation

The server is responsible for running the master simulation:

```lua
if TheWorld.ismastersim then
    -- Server-only code
else
    -- Client-only code
end
```

## Related Systems

- Entity replication system
- Event system
- Mod RPC system 