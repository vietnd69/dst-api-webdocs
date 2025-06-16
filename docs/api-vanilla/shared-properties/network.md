---
id: network
title: Network
sidebar_position: 4
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Network

Network is a common property that manages data synchronization between server and client in the multiplayer system. It is a crucial component for creating entities that properly function in Don't Starve Together's client-server architecture.

## Overview

Don't Starve Together uses a client-server networking model where:
- The server (master simulation) maintains the authoritative game state
- Clients receive updates from the server and send input to the server
- Network components handle the synchronization of entity data

The Network property is essential for any entity that needs to be visible and interactive across all clients in a multiplayer game.

## Adding Network to an Entity

The Network component must be added during entity creation:

```lua
local function CreateNetworkedEntity()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    
    -- Add network component
    inst.entity:AddNetwork()
    
    -- Complete network initialization
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Server-only code here
    
    return inst
end
```

## Network Architecture

### Server vs. Client Code

In networked entities, code is organized into server (master simulation) and client sections:

```lua
local function MyPrefab()
    local inst = CreateEntity()
    
    -- Components required by both client and server
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Networked properties setup
    inst:AddTag("networked_tag")
    
    inst.entity:SetPristine()
    
    -- Early return for clients
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Server-only components and logic
    inst:AddComponent("inventoryitem")
    
    return inst
end
```

## Networking Entity Data

### Basic Networking

Only certain types of data are automatically synchronized:

1. Transform position and rotation
2. AnimState animations and visual states
3. Entity tags added before `SetPristine()`
4. Explicit network variables

### Network Variables

To synchronize custom data between server and clients:

```lua
-- Create a networked variable (server code)
inst.bird_type = net_string(inst.GUID, "bird.type", "bird_type_dirty")

-- Set the value (server only)
inst.bird_type:set("crow")

-- Listen for changes (client code)
inst:ListenForEvent("bird_type_dirty", OnBirdTypeDirty)
```

## NetWorking Components

Don't Starve Together provides specialized components for networking:

### NetComponents

Wrapper components that handle network synchronization for you:

```lua
-- Add a networked component
inst:AddComponent("container")
inst.components.container:WidgetSetup("backpack")

-- These components handle their own networking
```

### Classified Entities

For complex data structures, classified entities are used:

```lua
-- Create a classified entity for private data
local classified = SpawnPrefab("myentity_classified")
classified.entity:SetParent(inst.entity)
classified.Network:SetClassifiedTarget(inst)
classified:AddTag("CLASSIFIED")

inst.classified = classified
```

## Network Optimization

### Network Priority

Control how frequently an entity is updated:

```lua
-- Set network update priority
inst:AddComponent("networkproximityfader")
```

### Dormant Entities

Entities far from players can become dormant:

```lua
-- Make entity go dormant when far from players
inst:AddComponent("knownlocations")
```

## Common Networking Patterns

### Master Simulation Check

Always check if code is running on the server:

```lua
if TheWorld.ismastersim then
    -- Server-only code
end
```

### Event Handling Across Network

Events can be sent across the network:

```lua
-- Server pushing events to clients
TheWorld:PushEvent("my_global_event", {data = value})

-- Server-to-client targeted events
SendRPCToClient(CLIENT_RPC.DoSomething, player.userid, ...)
```

## Debugging Network Issues

### Common Issues

1. Client-server desynchronization
2. Missing network component
3. Not initializing network with SetPristine()
4. Modifying client-side data that should be server-authoritative

### Debug Tools

```lua
-- Print entity network status
print(inst, "has network:", inst.entity:HasNetwork())

-- View network statistics
c_printnetnumber() -- Console command
```

## Example: Fully Networked Entity

```lua
-- Server-client synchronized entity
local function MyNetworkedEntity()
    local inst = CreateEntity()
    
    -- Basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    -- Setup animation
    inst.AnimState:SetBank("myentity")
    inst.AnimState:SetBuild("myentity")
    inst.AnimState:PlayAnimation("idle")
    
    -- Networked tags
    inst:AddTag("myentity")
    
    -- Networked variables
    inst.entity_state = net_string(inst.GUID, "myentity.state", "state_dirty")
    
    -- Complete network initialization
    inst.entity:SetPristine()
    
    -- Client-side handlers
    if not TheWorld.ismastersim then
        inst:ListenForEvent("state_dirty", function(inst)
            local state = inst.entity_state:value()
            inst.AnimState:PlayAnimation(state)
        end)
        
        return inst
    end
    
    -- Server-only components
    inst:AddComponent("inspectable")
    
    -- Server-side state control
    inst.SetState = function(inst, state)
        inst.entity_state:set(state)
        inst.AnimState:PlayAnimation(state)
    end
    
    -- Initial state
    inst.entity_state:set("idle")
    
    return inst
end

return Prefab("mynetworkedentity", MyNetworkedEntity)
``` 
