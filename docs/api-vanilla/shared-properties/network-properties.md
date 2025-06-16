---
id: network-properties
title: Network Properties
sidebar_position: 4
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Network Properties

*API Version: 619045*

Network properties are a set of shared attributes and mechanisms that enable multiplayer functionality in Don't Starve Together. These properties facilitate communication between server and clients, synchronize game state, and ensure consistent gameplay experiences across different machines.

## Core Network Properties

| Property | Type | Description |
|----------|------|-------------|
| `GUID` | Number | Unique identifier for each entity across the network |
| `userid` | String | Unique identifier for each player |
| `ismastersim` | Boolean | Whether the current instance is the authoritative server |
| `ispredicting` | Boolean | Whether the client is currently predicting behaviors |
| `isreplica` | Boolean | Whether a component is the client-side replica version |
| `net_hash` | NetVar | Hash-based network variable, used for referencing entities |
| `net_entity` | NetVar | Entity reference network variable |
| `entity:SetPristine()` | Function | Mark entity as ready for network replication |
| `entity:SetPriority()` | Function | Set network traffic priority for the entity |

## Network Variable Types

Don't Starve Together provides various network variable types to efficiently synchronize different data:

| NetVar Type | Size | Range | Best For |
|-------------|------|-------|---------|
| `net_bool` | 1 bit | true/false | Binary states |
| `net_tinybyte` | 4 bits | 0-15 | Very small values |
| `net_byte` | 8 bits | 0-255 | Small values |
| `net_shortint` | 16 bits | -32,768 to 32,767 | Medium values |
| `net_int` | 32 bits | -2^31 to 2^31-1 | Large integers |
| `net_float` | 32 bits | Floating point | Positions, decimals |
| `net_string` | Variable | Text | Names, states, messages |
| `net_hash` | 32 bits | Entity reference hash | Referencing entities |
| `net_entity` | 32 bits | Direct entity reference | Direct entity references |

## Network Communication Mechanisms

### Server Authority Model

Don't Starve Together uses a strict server authority model:

1. **The server** maintains the authoritative game state
2. **Clients** receive updates from the server and render the state
3. **Clients** send action requests to the server
4. **The server** validates requests and executes valid actions

```lua
-- Example of respecting server authority
function MyComponent:DoSomething(value)
    if not TheWorld.ismastersim then
        -- Client cannot modify state directly
        -- Send request to server instead
        SendModRPCToServer(MOD_RPC.MyMod.RequestAction, self.inst.GUID, value)
        return
    end
    
    -- Server-side logic
    self.value = value
    self:SyncNetworkVars()
end
```

### Network Variables (NetVars)

Network variables automatically sync data from server to clients:

```lua
-- Creating network variables
function MyComponent:ctor(inst)
    self.inst = inst
    
    self.myvalue = net_float(inst.GUID, "mycomponent.myvalue", "myvaluedirty")
    self.mystate = net_string(inst.GUID, "mycomponent.mystate", "mystatedirty")
    
    if not TheWorld.ismastersim then
        -- Client-side event listener for network updates
        inst:ListenForEvent("myvaluedirty", function()
            local new_value = self.myvalue:value()
            -- React to updated value
            self:OnValueChanged(new_value)
        end)
    end
end

-- Updating network variables (server only)
function MyComponent:SetValue(value)
    if not TheWorld.ismastersim then
        return
    end
    
    self.myvalue:set(value)
end
```

### Remote Procedure Calls (RPCs)

RPCs enable communication between clients and server:

```lua
-- Define RPC in modmain.lua
-- Client to server RPC
AddModRPCHandler("MyMod", "RequestAction", function(player, entity_id, action)
    local entity = Ents[entity_id]
    if entity and entity.components.mycomponent then
        entity.components.mycomponent:DoAction(action)
    end
end)

-- Server to client RPC
AddClientModRPCHandler("MyMod", "NotifyEvent", function(event_type, x, y, z)
    SpawnClientEffect(event_type, x, y, z)
end)

-- Sending RPC from client to server
function SendActionRequest(entity, action)
    SendModRPCToServer(MOD_RPC.MyMod.RequestAction, entity.GUID, action)
end

-- Sending RPC from server to client
function NotifyPlayer(player, event_type, position)
    SendModRPCToClient(MOD_RPC.MyMod.NotifyEvent, player.userid, 
                      event_type, position.x, position.y, position.z)
end
```

## Network Component Replication

Components in Don't Starve Together have two versions:

1. **Server Component**: Full implementation with game logic
2. **Client Replica**: Simplified version with network variables

### Component Replica System

```lua
-- Register a component for replication in modmain.lua
AddReplicableComponent("mycomponent")

-- Server Component (components/mycomponent.lua)
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 100
    
    -- Initialize network variables
    if self.inst.replica.mycomponent == nil then
        self.inst.replica.mycomponent = {}
        self.inst.replica.mycomponent._value = net_int(inst.GUID, "mycomponent._value", "valuechanged")
    end
    
    -- Set initial value
    self.inst.replica.mycomponent._value:set(self.value)
end)

-- Client Replica (components/mycomponent_replica.lua)
local MyComponentReplica = Class(function(self, inst)
    self.inst = inst
    
    -- Initialize network variable
    self._value = net_int(inst.GUID, "mycomponent._value", "valuechanged")
    
    -- Set up client-side event handling
    if not TheWorld.ismastersim then
        inst:ListenForEvent("valuechanged", function()
            -- React to value change
            inst:PushEvent("mycomponent.valuechanged", { value = self:GetValue() })
        end)
    end
end)

function MyComponentReplica:GetValue()
    return self._value:value()
end

return MyComponentReplica
```

## Network States and Optimization

### Network Priorities

Entities can have different network priorities based on importance:

- `NETWORK_PRIORITY.CRITICAL` (0): Must be delivered immediately
- `NETWORK_PRIORITY.HIGH` (1): Important for gameplay
- `NETWORK_PRIORITY.MEDIUM` (2): Standard priority
- `NETWORK_PRIORITY.LOW` (3): Can be delayed if needed

```lua
-- Set entity network priority
entity.entity:SetPriority(NETWORK_PRIORITY.HIGH) -- For important entities

-- Lower priority for cosmetic entities
decorative_entity.entity:SetPriority(NETWORK_PRIORITY.LOW)
```

### Bandwidth Optimization

Techniques for optimizing network usage:

1. **Use appropriate data types**: Choose smallest possible NetVar type
2. **Batch updates**: Combine multiple updates when possible
3. **Update frequency control**: Only send changes when necessary
4. **Relevance filtering**: Only send data to players who need it
5. **Delta compression**: Send only what changed, not full state

```lua
-- Bandwidth optimization example
function OptimizedSync(inst)
    -- Only sync if position changed significantly
    local x, y, z = inst.Transform:GetWorldPosition()
    
    if inst._last_x == nil or 
       math.abs(inst._last_x - x) > 0.5 or
       math.abs(inst._last_z - z) > 0.5 then
        
        inst.net_pos_x:set(x)
        inst.net_pos_z:set(z)
        
        inst._last_x = x
        inst._last_z = z
    end
end

inst:DoPeriodicTask(0.2, OptimizedSync) -- 5 times per second maximum
```

## Network-Related Components

Several components interact with network properties:

| Component | Key Network Interactions |
|-----------|--------------------------|
| `NetworkIdentity` | Manages entity identification across the network |
| `PlayerController` | Handles player input and sends action requests |
| `Combat` | Synchronizes combat state and attacks |
| `Inventory` | Manages item synchronization between players |
| `Container` | Synchronizes container contents |
| `Builder` | Synchronizes crafting and building actions |
| `WorldState` | Synchronizes world conditions across clients |

## Network Events

Network properties trigger several standard events:

- `entityreplicated` - When an entity is first replicated to clients
- `playerjoined` - When a player connects to the server
- `playerleft` - When a player disconnects
- `ms_playerspawn` - When a player spawns in the world
- `networkdisconnect` - When network connection is lost
- Dirty events - Custom events when network variables change

## Special Network Mechanics

### Entity Classification

```lua
-- Mark entity as having completed network setup
inst.entity:SetPristine()

-- Check if on server or client
if not TheWorld.ismastersim then
    -- Client-only code
    return inst
end

-- Server-only code below
inst:AddComponent("mycomponent")
```

### Network Entity Visibility

```lua
-- Make entity invisible but still networked
classified = CreateEntity()
classified.entity:AddNetwork()
classified.entity:Hide()
classified.persists = false

-- Add network variables for data storage
classified.health = net_float(classified.GUID, "health", "healthdirty")
classified.max_health = net_float(classified.GUID, "max_health")

-- Set up parent relationship
classified:SetParent(owner)
owner.player_classified = classified

-- Mark as ready for network use
classified.entity:SetPristine()
```

### Reconciliation and Desync Handling

```lua
-- Detect potential desync
function CheckForDesync(inst)
    local server_state = inst.replica.syncmanager:GetServerState()
    local client_state = CalculateLocalState(inst)
    
    if math.abs(server_state - client_state) > DESYNC_THRESHOLD then
        -- Detected desync, request full resync
        SendModRPCToServer(MOD_RPC.MyMod.RequestResync, inst.GUID)
    end
end

-- Handle resync requests
function PerformFullResync(inst, target_player)
    -- Collect all necessary state
    local state = {
        position = { inst.Transform:GetWorldPosition() },
        health = inst.components.health and inst.components.health.currenthealth or nil,
        inventory = GetInventoryState(inst),
        -- Add other important state
    }
    
    -- Encode and send full state
    local encoded = json.encode(state)
    SendModRPCToClient(MOD_RPC.MyMod.FullResync, target_player.userid, inst.GUID, encoded)
end
```

## See also

- [Network System](../core/network-system.md) - Core networking concepts and implementation
- [Client-Server Synchronization](../core/client-server-synchronization.md) - Detailed synchronization techniques
- [RPC System](../core/rpc-system.md) - For remote procedure calls between server and clients
- [Network Bandwidth Optimization](../core/network-bandwidth-optimization.md) - For optimization techniques
- [Handling Latency](../core/handling-latency-network-drops.md) - For dealing with network delays
- [Security Considerations](../core/security-considerations-networking.md) - Security best practices