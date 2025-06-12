---
id: network-system
title: Network System
sidebar_position: 5
---

# Network System

The Network System in Don't Starve Together manages multiplayer communication, ensuring game state is properly synchronized between the server and all connected clients.

## Client-Server Architecture

DST uses a client-server architecture where:

- **Server**: Holds the authoritative game state and runs all game logic
- **Clients**: Receive updates from the server and send player inputs
- **Dedicated Server**: A server-only instance that doesn't render the game

Understanding this separation is crucial for creating mods that work correctly in multiplayer.

## Networked Entities

In multiplayer, entities exist in two forms:

1. **Master Entity** (server-side): Contains all components and logic
2. **Client Entity** (client-side): Contains visual components and replicated data

### Entity Replication

When creating networked entities:

```lua
local function fn()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    
    -- Add network component - required for multiplayer
    inst.entity:AddNetwork()
    
    -- Initialize client-side components and properties
    inst.AnimState:SetBank("myentity")
    inst.AnimState:SetBuild("myentity")
    inst.AnimState:PlayAnimation("idle")
    
    -- Mark entity as pristine (finished client setup)
    inst.entity:SetPristine()
    
    -- Return early for client instances
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add server-only components
    inst:AddComponent("health")
    inst:AddComponent("combat")
    
    return inst
end
```

## Network Variables

Network variables are special variables that automatically synchronize between server and clients:

```lua
-- In component initialization
function MyComponent:Init(inst)
    self.inst = inst
    
    -- Define network variables with:
    -- 1. Entity GUID
    -- 2. Network path
    -- 3. Dirty event name
    self.value = net_int(inst.GUID, "mycomponent.value", "valuedirty")
    self.active = net_bool(inst.GUID, "mycomponent.active", "activedirty")
    self.name = net_string(inst.GUID, "mycomponent.name", "namedirty")
    self.target = net_entity(inst.GUID, "mycomponent.target", "targetdirty")
}

-- Setter function that works on server
function MyComponent:SetValue(val)
    if TheWorld.ismastersim then
        self.value:set(val)  -- This triggers network synchronization
    end
end

-- Getter function that works on both server and client
function MyComponent:GetValue()
    return self.value:value()
end
```

Available network variable types include:

- `net_byte`: 8-bit integer
- `net_shortint`: 16-bit integer
- `net_int`: 32-bit integer
- `net_uint`: Unsigned 32-bit integer
- `net_float`: Floating-point number
- `net_string`: String
- `net_bool`: Boolean
- `net_hash`: Hash value
- `net_entity`: Entity reference

## Component Replication

For components that need client-side functionality, create replica components:

```lua
-- Server component (components/mycomponent.lua)
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 0
    self.netvalue = net_int(inst.GUID, "mycomponent.value", "valuedirty")
end)

function MyComponent:SetValue(val)
    self.value = val
    self.netvalue:set(val)
end

-- Client replica (components/mycomponent_replica.lua)
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self._value = net_int(inst.GUID, "mycomponent.value", "valuedirty")
    
    if not TheWorld.ismastersim then
        inst:ListenForEvent("valuedirty", function()
            -- React to value changes on client
            local val = self:GetValue()
            -- Update visual effects, play sounds, etc.
        end)
    end
end)

function MyComponent:GetValue()
    return self._value:value()
end
```

Register replicated components in your mod:

```lua
-- In modmain.lua
AddReplicableComponent("mycomponent")
```

## Remote Procedure Calls (RPCs)

RPCs allow you to send commands between client and server:

```lua
-- Define RPC handler in modmain.lua
AddModRPCHandler("MyMod", "DoAction", function(player, target, value)
    -- This runs on the server when called from client
    print(player.name .. " requested action on " .. target.prefab)
    
    -- Perform action with server authority
    if target.components.mycomponent then
        target.components.mycomponent:DoSomething(value)
    end
end)

-- Call the RPC from client to server
SendModRPCToServer(MOD_RPC.MyMod.DoAction, TheInput:GetWorldEntityUnderMouse(), 42)
```

## Authority Checking

Always check for server authority before modifying game state:

```lua
-- Only modify game state on the server
if TheWorld.ismastersim then
    inst.components.health:SetMaxHealth(100)
    inst.components.combat:SetDefaultDamage(10)
end

-- Read-only operations are safe on client
local health_percent = inst.components.health:GetPercent()
```

## Network Events

Network variables trigger events when their values change:

```lua
-- Listen for network variable changes (usually on client)
inst:ListenForEvent("valuedirty", function()
    local current_value = self._value:value()
    -- Update UI or visuals based on new value
end)
```

## Best Practices

When working with the network system:

1. **Minimize Network Traffic**: Only synchronize essential data
2. **Check Authority**: Always check `TheWorld.ismastersim` before modifying game state
3. **Use Efficient Types**: Choose the smallest network variable type that fits your needs
4. **Batch Updates**: Group related updates to minimize network messages
5. **Create Proper Replicas**: For complex components, create dedicated replica components
6. **Validate Client Input**: Always validate data received from clients on the server
7. **Test in Multiplayer**: Regularly test your mod with multiple clients to catch networking issues 