---
id: client-server-synchronization
title: Client-Server Synchronization
sidebar_position: 8
last_updated: 2023-07-06
---

# Client-Server Synchronization

Client-server synchronization is a critical aspect of developing multiplayer mods for Don't Starve Together. This guide covers techniques and best practices for keeping game state synchronized between server and clients.

## Synchronization Fundamentals

In Don't Starve Together's client-server architecture:

- The **server** is authoritative and maintains the "true" game state
- **Clients** receive updates from the server and predict some behaviors
- Synchronization happens through **network variables** and **RPCs**

```lua
-- This diagram represents data flow in DST's network model
-- Server (Authoritative State)
--    ↑↓
-- Network Layer (NetVars, RPCs)
--    ↑↓
-- Clients (Local Representation)
```

## Network Variables

Network variables (NetVars) are the primary method for synchronizing entity state from server to clients.

### Basic NetVar Usage

```lua
-- In entity prefab definition (server-side)
function MakeSyncedEntity()
    local inst = CreateEntity()
    
    -- Add network component (required for synchronization)
    inst.entity:AddNetwork()
    
    -- Add networked variables
    inst.myvalue = net_float(inst.GUID, "myentity.myvalue", "myvaluedirty")
    inst.mystate = net_string(inst.GUID, "myentity.mystate", "mystatedirty")
    
    -- Initial values
    inst.myvalue:set(100)
    inst.mystate:set("idle")
    
    -- Mark entity as ready for replication
    inst.entity:SetPristine()
    
    -- Server-only components below
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add server-only components
    inst:AddComponent("health")
    
    return inst
end
```

### Available NetVar Types

| Type | Function | Description |
|------|----------|-------------|
| `net_byte` | 8-bit integer | Small numbers (0-255) |
| `net_shortint` | 16-bit integer | Medium numbers |
| `net_int` | 32-bit integer | Large integer values |
| `net_float` | Floating point | Decimal values |
| `net_string` | String | Text values |
| `net_bool` | Boolean | True/false values |
| `net_hash` | Hash | For entity references |
| `net_entity` | Entity reference | For direct entity references |
| `net_tinybyte` | 4-bit integer | Very small numbers (0-15) |

### Responding to NetVar Changes

```lua
-- In client code (typically in prefab or component)
local function OnValueDirty(inst)
    -- This is called when myvalue changes on the server
    local new_value = inst.myvalue:value()
    print("Value updated to:", new_value)
    
    -- Update visual representation
    if new_value > 75 then
        inst.AnimState:SetMultColour(0, 1, 0, 1) -- Green
    elseif new_value > 25 then
        inst.AnimState:SetMultColour(1, 1, 0, 1) -- Yellow
    else
        inst.AnimState:SetMultColour(1, 0, 0, 1) -- Red
    end
end

-- Listen for the dirty event
inst:ListenForEvent("myvaluedirty", OnValueDirty)
```

## Replica Components

Replica components are client-side counterparts to server components that expose necessary data to clients.

### Creating a Replica Component

```lua
-- In components/mycomponent_replica.lua
local MyComponentReplica = Class(function(self, inst)
    self.inst = inst
    
    -- Initialize networked values
    self._value = net_float(inst.GUID, "mycomponent._value", "valuechanged")
    self._state = net_string(inst.GUID, "mycomponent._state", "statechanged")
    
    -- If we're on the client, listen for changes
    if not TheWorld.ismastersim then
        inst:ListenForEvent("valuechanged", function(inst) 
            self:OnValueChanged()
        end)
    end
end)

function MyComponentReplica:GetValue()
    return self._value:value()
end

function MyComponentReplica:GetState()
    return self._state:value()
end

function MyComponentReplica:OnValueChanged()
    -- Handle value change on client
    -- This is a good place to trigger visual effects
    local value = self:GetValue()
    self.inst:PushEvent("mycomponent.valuechanged", { value = value })
end

return MyComponentReplica
```

### Linking Server Component with Replica

```lua
-- In components/mycomponent.lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    
    -- Initialize values
    self.value = 100
    self.state = "idle"
    
    -- Create networked values if not already created by replica
    if self.inst.replica.mycomponent == nil then
        self.inst.replica.mycomponent = {}
        self.inst.replica.mycomponent._value = net_float(inst.GUID, "mycomponent._value", "valuechanged")
        self.inst.replica.mycomponent._state = net_string(inst.GUID, "mycomponent._state", "statechanged")
    end
    
    -- Initialize network values
    self:SyncValues()
end)

function MyComponent:SetValue(value)
    self.value = value
    self:SyncValues()
end

function MyComponent:SetState(state)
    self.state = state
    self:SyncValues()
end

function MyComponent:SyncValues()
    -- Only the server should update network values
    if TheWorld.ismastersim then
        self.inst.replica.mycomponent._value:set(self.value)
        self.inst.replica.mycomponent._state:set(self.state)
    end
end

return MyComponent
```

### Registering the Replica

```lua
-- In modmain.lua
AddReplicableComponent("mycomponent")
```

## Bidirectional Communication with RPCs

While NetVars handle server-to-client synchronization, Remote Procedure Calls (RPCs) enable bidirectional communication.

### Client-to-Server Actions

```lua
-- In modmain.lua
-- Define RPC
MOD_RPC = {
    MyMod = {
        RequestAction = 0,
    }
}

-- Server-side handler
AddModRPCHandler("MyMod", "RequestAction", function(player, target_entity, action_type)
    -- Validate request
    if not player or player:HasTag("playerghost") then
        return
    end
    
    -- Find target entity
    local target = Ents[target_entity]
    if target == nil then
        return
    end
    
    -- Validate distance
    if player:GetDistanceSqToInst(target) > 16 then -- 4 units squared
        return
    end
    
    -- Perform action
    if action_type == "interact" and target.components.mycomponent then
        target.components.mycomponent:Interact(player)
        return true
    end
    
    return false
end)

-- Client-side call
local function RequestAction(entity, action)
    SendModRPCToServer(MOD_RPC.MyMod.RequestAction, entity.GUID, action)
end
```

### Server-to-Client Notifications

```lua
-- In modmain.lua
-- Define RPC
MOD_RPC = {
    MyMod = {
        NotifyEffect = 1,
    }
}

-- Client-side handler
AddClientModRPCHandler("MyMod", "NotifyEffect", function(effect_type, x, y, z)
    -- Spawn client-side effect
    local effect = SpawnPrefab(effect_type .. "_fx")
    if effect then
        effect.Transform:SetPosition(x, y, z)
    end
    
    -- Play sound
    TheFocalPoint.SoundEmitter:PlaySound("dontstarve/common/" .. effect_type)
end)

-- Server-side call
local function NotifyNearbyPlayers(inst, effect_type)
    local x, y, z = inst.Transform:GetWorldPosition()
    
    -- Find players in range
    local players = FindPlayersInRange(x, y, z, 20)
    
    -- Send notification to each nearby player
    for _, player in ipairs(players) do
        SendModRPCToClient(MOD_RPC.MyMod.NotifyEffect, player.userid, effect_type, x, y, z)
    end
end
```

## Common Synchronization Patterns

### Health Synchronization

```lua
-- Server-side health component modification
local function UpdateHealth(inst, amount)
    if inst.components.health then
        inst.components.health:DoDelta(amount)
        
        -- Health component automatically syncs to clients
        -- through the built-in health_replica component
    end
end

-- Client-side health display
local function OnHealthDirty(inst)
    -- Get current health from replica
    local health = inst.replica.health:GetCurrent()
    local max_health = inst.replica.health:GetMax()
    
    -- Update health bar
    local percent = health / max_health
    UpdateHealthBar(inst, percent)
end

inst:ListenForEvent("healthdirty", OnHealthDirty)
```

### Inventory Item Synchronization

```lua
-- Server-side inventory management
function GiveItemToPlayer(player, item_prefab)
    if player.components.inventory then
        local item = SpawnPrefab(item_prefab)
        player.components.inventory:GiveItem(item)
        -- Inventory component handles synchronization
    end
end

-- Client-side inventory update
local function OnInventoryChanged(inst)
    -- This event is triggered when inventory changes
    RefreshInventoryUI(inst)
end

inst:ListenForEvent("itemschanged", OnInventoryChanged)
```

### Animation State Synchronization

```lua
-- Server-side animation control
function PlayAnimation(inst, anim_name)
    inst.AnimState:PlayAnimation(anim_name)
    
    -- Sync animation state to clients
    inst.anim_name:set(anim_name)
    inst.anim_time:set(GetTime())
end

-- Client-side animation handler
local function OnAnimDirty(inst)
    local anim_name = inst.anim_name:value()
    inst.AnimState:PlayAnimation(anim_name)
end

inst:ListenForEvent("animdirty", OnAnimDirty)
```

## Optimizing Synchronization

### Update Frequency Control

```lua
-- Only sync when value changes significantly
function UpdateNetworkedPosition(inst)
    local x, y, z = inst.Transform:GetWorldPosition()
    
    -- Calculate distance from last synced position
    local last_x, last_y, last_z = inst.last_sync_x, inst.last_sync_y, inst.last_sync_z
    local dist_sq = distsq(x, z, last_x, last_z)
    
    -- Only sync if moved more than threshold
    if dist_sq > 0.25 then -- 0.5 units squared
        inst.net_pos_x:set(x)
        inst.net_pos_z:set(z)
        
        inst.last_sync_x = x
        inst.last_sync_z = z
    end
end
```

### Prioritizing Critical Data

```lua
-- Sync critical data immediately
function SyncCriticalState(inst, state)
    inst.net_critical_state:set(state)
    inst.net_critical_time:set(GetTime())
end

-- Batch non-critical updates
local function PeriodicSync(inst)
    -- Collect all changes since last sync
    local changes = {}
    
    -- Add changes to batch
    if inst.appearance_dirty then
        changes.appearance = inst.appearance
        inst.appearance_dirty = false
    end
    
    if inst.effects_dirty then
        changes.effects = inst.active_effects
        inst.effects_dirty = false
    end
    
    -- Encode and sync batch
    if next(changes) ~= nil then
        local encoded = json.encode(changes)
        inst.net_batch_update:set(encoded)
    end
end

inst:DoPeriodicTask(1, PeriodicSync) -- Sync non-critical data every second
```

## Handling Synchronization Edge Cases

### Late-Joining Players

```lua
-- When a player joins, send them the current state
local function OnPlayerJoined(world, player)
    -- Find all important entities that need immediate sync
    local critical_entities = FindEntities(...)
    
    for _, entity in ipairs(critical_entities) do
        if entity.components.syncmanager then
            -- Force a full sync to the new player
            entity.components.syncmanager:SyncToPlayer(player)
        end
    end
end

TheWorld:ListenForEvent("ms_playerspawn", OnPlayerJoined)
```

### Handling Disconnections

```lua
-- Save important player state on disconnect
local function OnPlayerLeft(world, player)
    if player.userid then
        -- Store persistent data
        if player.components.persistentdata then
            player.components.persistentdata:Save()
        end
        
        -- Clean up any player-specific entities
        local linked_entities = player.linked_entities or {}
        for _, entity in pairs(linked_entities) do
            if entity:IsValid() then
                entity:Remove()
            end
        end
    end
end

TheWorld:ListenForEvent("ms_playerleft", OnPlayerLeft)
```

### Recovering from Desync

```lua
-- Client can detect potential desync
local function CheckForDesync(inst)
    local server_state = inst.replica.syncmanager:GetServerState()
    local client_state = CalculateLocalState(inst)
    
    if math.abs(server_state - client_state) > DESYNC_THRESHOLD then
        -- Detected desync, request full resync
        SendModRPCToServer(MOD_RPC.MyMod.RequestResync, inst.GUID)
        print("Desync detected, requesting resync")
    end
end

-- Server handles resync requests
AddModRPCHandler("MyMod", "RequestResync", function(player, entity_id)
    local entity = Ents[entity_id]
    if entity and entity.components.syncmanager then
        entity.components.syncmanager:FullResync(player)
    end
end)
```

## Complete Example: Synchronized Custom Entity

Here's a complete example of a custom entity with synchronized state:

```lua
-- prefabs/mysyncedentity.lua

local assets = {
    Asset("ANIM", "anim/myentity.zip"),
}

-- Shared initialization (runs on both client and server)
local function fn()
    local inst = CreateEntity()
    
    -- Basic entity setup
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    -- Setup animations
    inst.AnimState:SetBank("myentity")
    inst.AnimState:SetBuild("myentity")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add networked variables
    inst.current_state = net_string(inst.GUID, "mysyncedentity.state", "statedirty")
    inst.energy_level = net_byte(inst.GUID, "mysyncedentity.energy", "energydirty")
    inst.owner_id = net_string(inst.GUID, "mysyncedentity.owner", "ownerdirty")
    
    -- Initialize network values
    inst.current_state:set("idle")
    inst.energy_level:set(100)
    inst.owner_id:set("")
    
    -- Client-side event handlers
    if not TheWorld.ismastersim then
        -- Handle state changes
        inst:ListenForEvent("statedirty", function(inst)
            local state = inst.current_state:value()
            inst.AnimState:PlayAnimation(state)
        end)
        
        -- Handle energy changes
        inst:ListenForEvent("energydirty", function(inst)
            local energy = inst.energy_level:value()
            -- Update visual effects based on energy
            local intensity = energy / 100
            inst.AnimState:SetMultColour(1, intensity, intensity, 1)
        end)
    end
    
    -- Mark entity as ready for replication
    inst.entity:SetPristine()
    
    -- Server-only components and logic below
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add server-only components
    inst:AddComponent("inspectable")
    
    -- Custom component for this entity
    inst:AddComponent("energymanager")
    inst.components.energymanager:SetMax(100)
    inst.components.energymanager:SetCurrent(100)
    
    -- Update networked values when energy changes
    inst:ListenForEvent("energychange", function(inst, data)
        inst.energy_level:set(math.floor(data.current))
    end)
    
    -- Set owner when picked up
    inst:ListenForEvent("onpickup", function(inst, data)
        if data.owner and data.owner.userid then
            inst.owner_id:set(data.owner.userid)
        end
    end)
    
    -- Change state
    inst.SetState = function(inst, state)
        inst.current_state:set(state)
        inst.AnimState:PlayAnimation(state)
    end
    
    -- Periodic energy consumption
    inst:DoPeriodicTask(1, function(inst)
        if inst.components.energymanager then
            inst.components.energymanager:DoDelta(-1)
        end
    end)
    
    return inst
end

return Prefab("mysyncedentity", fn, assets)
```

## See also

- [RPC System](rpc-system.md) - For detailed information on Remote Procedure Calls
- [Network System](network-system.md) - For core networking concepts
- [Entity System](entity-system.md) - For entity creation and management
- [Component System](component-system.md) - For component architecture
- [Examples](../examples/networking-mod.md) - For complete networking examples
