---
id: networking-snippets
title: Networking Snippets
sidebar_position: 5
last_updated: 2023-07-06
---

# Networking Snippets

This page provides reusable code snippets for implementing networking functionality in Don't Starve Together mods.

## Basic Networking

### Client-Server Communication

```lua
-- Define RPC names in a modmain
local RPC_NAMESPACE = "MyModRPC"

-- Register RPCs
AddModRPCHandler(modname, "ExampleRPC", function(player, value1, value2)
    -- This function runs on the server when the RPC is received
    print("Received RPC from " .. player.name .. " with values: " .. tostring(value1) .. ", " .. tostring(value2))
    
    -- Do something with the values
    if player.components.health then
        player.components.health:DoDelta(value1)
    end
end)

-- Send RPC from client to server
local function SendExampleRPC(value1, value2)
    SendModRPCToServer(MOD_RPC[modname]["ExampleRPC"], value1, value2)
end

-- Example usage:
-- SendExampleRPC(10, "hello")
```

### Networked Variables

```lua
-- In a prefab file, define networked variables
local function fn()
    local inst = CreateEntity()
    
    -- Add standard components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add networked variables
    inst.network_data = {
        value = net_float(inst.GUID, "mymod.value", "valuedirty"),
        state = net_string(inst.GUID, "mymod.state", "statedirty"),
        counter = net_byte(inst.GUID, "mymod.counter", "counterdirty")
    }
    
    -- Set initial values
    inst.network_data.value:set(0)
    inst.network_data.state:set("idle")
    inst.network_data.counter:set(0)
    
    -- Mark entity as networked
    inst:AddTag("networked_entity")
    
    -- Server-only components and logic
    if not TheWorld.ismastersim then
        -- Client-side event handlers for network variable changes
        inst:ListenForEvent("valuedirty", function()
            local value = inst.network_data.value:value()
            -- Do something with the updated value on the client
            print("Value updated to: " .. tostring(value))
        end)
        
        inst:ListenForEvent("statedirty", function()
            local state = inst.network_data.state:value()
            -- Do something with the updated state on the client
            print("State updated to: " .. state)
            
            -- Update animation based on state
            if state == "active" then
                inst.AnimState:PlayAnimation("active")
            else
                inst.AnimState:PlayAnimation("idle")
            end
        end)
        
        inst:ListenForEvent("counterdirty", function()
            local counter = inst.network_data.counter:value()
            -- Do something with the updated counter on the client
            print("Counter updated to: " .. tostring(counter))
        end)
        
        return inst
    end
    
    -- Server-only components
    inst:AddComponent("inspectable")
    
    -- Functions to modify networked values (server-side)
    inst.SetValue = function(inst, value)
        inst.network_data.value:set(value)
    end
    
    inst.SetState = function(inst, state)
        inst.network_data.state:set(state)
    end
    
    inst.IncrementCounter = function(inst)
        local current = inst.network_data.counter:value()
        inst.network_data.counter:set(math.min(current + 1, 255)) -- Max byte value
    end
    
    return inst
end

-- Usage:
-- local entity = SpawnPrefab("my_networked_entity")
-- entity.SetValue(entity, 42)
-- entity.SetState(entity, "active")
-- entity.IncrementCounter(entity)
```

## Advanced Networking

### Server to Client Communication

```lua
-- Define RPC for server to client communication
AddModRPCHandler(modname, "ServerToClientRPC", function(player, entity_id, action, data)
    -- This function runs on the client when the RPC is received from the server
    local entity = Ents[entity_id]
    if entity then
        if action == "effect" then
            -- Spawn a client-side effect
            SpawnPrefab("lightning").Transform:SetPosition(entity:GetPosition():Get())
        elseif action == "message" then
            -- Display a message
            if data and player == ThePlayer then
                local notification = SpawnPrefab("notification")
                notification.text:SetString(data)
                notification.Transform:SetPosition(player.Transform:GetWorldPosition())
            end
        end
    end
end)

-- Send RPC from server to client
local function SendServerToClientRPC(player, entity, action, data)
    if player.userid then
        SendModRPCToClient(MOD_RPC[modname]["ServerToClientRPC"], player.userid, entity.GUID, action, data)
    end
end

-- Example usage (server-side):
-- SendServerToClientRPC(player, entity, "effect", nil)
-- SendServerToClientRPC(player, player, "message", "You found a treasure!")
```

### Syncing Player State

```lua
-- Define a component for syncing player state
local PlayerSync = Class(function(self, inst)
    self.inst = inst
    
    -- Networked variables
    self.level = net_byte(inst.GUID, "playersync.level", "leveldirty")
    self.experience = net_ushortint(inst.GUID, "playersync.experience", "experiencedirty")
    self.skill_points = net_byte(inst.GUID, "playersync.skillpoints", "skillpointsdirty")
    self.abilities = net_string(inst.GUID, "playersync.abilities", "abilitiesdirty")
    
    -- Initialize values
    self.level:set(1)
    self.experience:set(0)
    self.skill_points:set(0)
    self.abilities:set("[]") -- JSON encoded array
    
    -- Listen for changes on client
    if not TheWorld.ismastersim then
        inst:ListenForEvent("leveldirty", function() self:OnLevelChanged() end)
        inst:ListenForEvent("experiencedirty", function() self:OnExperienceChanged() end)
        inst:ListenForEvent("skillpointsdirty", function() self:OnSkillPointsChanged() end)
        inst:ListenForEvent("abilitiesdirty", function() self:OnAbilitiesChanged() end)
    end
end)

-- Server-side methods
function PlayerSync:SetLevel(level)
    if TheWorld.ismastersim then
        self.level:set(level)
        self.inst:PushEvent("levelup", {level = level})
    end
end

function PlayerSync:AddExperience(amount)
    if TheWorld.ismastersim then
        local current = self.experience:value()
        local new_exp = math.min(current + amount, 65535) -- Max ushortint value
        self.experience:set(new_exp)
        
        -- Check for level up
        local level = self.level:value()
        local exp_for_next_level = level * 1000 -- Example formula
        
        if new_exp >= exp_for_next_level and level < 255 then
            self:SetLevel(level + 1)
            self:AddSkillPoints(1)
        end
    end
end

function PlayerSync:AddSkillPoints(amount)
    if TheWorld.ismastersim then
        local current = self.skill_points:value()
        self.skill_points:set(math.min(current + amount, 255))
    end
end

function PlayerSync:UnlockAbility(ability_id)
    if TheWorld.ismastersim then
        local abilities = self:GetAbilities()
        
        -- Check if ability is already unlocked
        for _, id in ipairs(abilities) do
            if id == ability_id then
                return false
            end
        end
        
        -- Add new ability
        table.insert(abilities, ability_id)
        self.abilities:set(json.encode(abilities))
        return true
    end
    return false
end

function PlayerSync:GetAbilities()
    local abilities_json = self.abilities:value()
    local success, abilities = pcall(function() return json.decode(abilities_json) end)
    return success and abilities or {}
end

-- Client-side event handlers
function PlayerSync:OnLevelChanged()
    if not TheWorld.ismastersim then
        local level = self.level:value()
        -- Update client-side UI or effects
        self.inst:PushEvent("levelup_client", {level = level})
    end
end

function PlayerSync:OnExperienceChanged()
    if not TheWorld.ismastersim then
        local experience = self.experience:value()
        -- Update client-side UI
        self.inst:PushEvent("experience_client", {experience = experience})
    end
end

function PlayerSync:OnSkillPointsChanged()
    if not TheWorld.ismastersim then
        local points = self.skill_points:value()
        -- Update client-side UI
        self.inst:PushEvent("skillpoints_client", {points = points})
    end
end

function PlayerSync:OnAbilitiesChanged()
    if not TheWorld.ismastersim then
        local abilities = self:GetAbilities()
        -- Update client-side UI
        self.inst:PushEvent("abilities_client", {abilities = abilities})
    end
end

-- Usage:
-- Add this component to player in player_common_extensions:
-- inst:AddComponent("playersync")
--
-- Server-side:
-- player.components.playersync:AddExperience(100)
-- player.components.playersync:UnlockAbility("fireball")
--
-- Client-side (listen for events):
-- player:ListenForEvent("levelup_client", function(inst, data) 
--     print("Level up to " .. data.level) 
-- end)
```

### Syncing World State

```lua
-- Define a component for syncing world state
local WorldSync = Class(function(self, inst)
    self.inst = inst
    
    -- Networked variables
    self.day_cycle = net_string(inst.GUID, "worldsync.daycycle", "daycycledirty")
    self.weather_state = net_string(inst.GUID, "worldsync.weather", "weatherdirty")
    self.event_active = net_bool(inst.GUID, "worldsync.event", "eventdirty")
    self.event_data = net_string(inst.GUID, "worldsync.eventdata", "eventdatadirty")
    
    -- Initialize values
    self.day_cycle:set("day")
    self.weather_state:set("clear")
    self.event_active:set(false)
    self.event_data:set("{}")
    
    -- Listen for changes on client
    if not TheWorld.ismastersim then
        inst:ListenForEvent("daycycledirty", function() self:OnDayCycleChanged() end)
        inst:ListenForEvent("weatherdirty", function() self:OnWeatherChanged() end)
        inst:ListenForEvent("eventdirty", function() self:OnEventActiveChanged() end)
        inst:ListenForEvent("eventdatadirty", function() self:OnEventDataChanged() end)
    end
end)

-- Server-side methods
function WorldSync:SetDayCycle(cycle)
    if TheWorld.ismastersim then
        self.day_cycle:set(cycle)
    end
end

function WorldSync:SetWeather(weather)
    if TheWorld.ismastersim then
        self.weather_state:set(weather)
    end
end

function WorldSync:StartEvent(event_type, data)
    if TheWorld.ismastersim then
        self.event_active:set(true)
        
        local event_data = {
            type = event_type,
            start_time = GetTime(),
            duration = data.duration or 60,
            intensity = data.intensity or 1,
            position = data.position and {x = data.position.x, y = data.position.y, z = data.position.z} or nil
        }
        
        self.event_data:set(json.encode(event_data))
    end
end

function WorldSync:StopEvent()
    if TheWorld.ismastersim then
        self.event_active:set(false)
        self.event_data:set("{}")
    end
end

-- Client-side event handlers
function WorldSync:OnDayCycleChanged()
    if not TheWorld.ismastersim then
        local cycle = self.day_cycle:value()
        -- Update client-side effects
        self.inst:PushEvent("daycycle_client", {cycle = cycle})
    end
end

function WorldSync:OnWeatherChanged()
    if not TheWorld.ismastersim then
        local weather = self.weather_state:value()
        -- Update client-side effects
        self.inst:PushEvent("weather_client", {weather = weather})
    end
end

function WorldSync:OnEventActiveChanged()
    if not TheWorld.ismastersim then
        local active = self.event_active:value()
        -- Update client-side effects
        self.inst:PushEvent("event_active_client", {active = active})
    end
end

function WorldSync:OnEventDataChanged()
    if not TheWorld.ismastersim then
        local data_json = self.event_data:value()
        local success, data = pcall(function() return json.decode(data_json) end)
        
        if success and data then
            -- Update client-side effects
            self.inst:PushEvent("event_data_client", {data = data})
        end
    end
end

function WorldSync:GetEventData()
    local data_json = self.event_data:value()
    local success, data = pcall(function() return json.decode(data_json) end)
    return success and data or {}
end

-- Usage:
-- Add this component to TheWorld in modmain:
-- AddPrefabPostInit("world", function(inst)
--     inst:AddComponent("worldsync")
-- end)
--
-- Server-side:
-- TheWorld.components.worldsync:SetWeather("rain")
-- TheWorld.components.worldsync:StartEvent("meteor_shower", {duration = 120, intensity = 2})
--
-- Client-side (listen for events):
-- TheWorld:ListenForEvent("weather_client", function(inst, data) 
--     print("Weather changed to " .. data.weather) 
-- end)
```

## Networking Best Practices

### Optimizing Network Traffic

```lua
-- Tips for optimizing network traffic

-- 1. Use appropriate network variable types
-- Choose the smallest data type that can hold your data:
local small_number = net_byte(inst.GUID, "mymod.smallnumber") -- 0-255
local medium_number = net_ushortint(inst.GUID, "mymod.mediumnumber") -- 0-65535
local large_number = net_uint(inst.GUID, "mymod.largenumber") -- 0-4294967295
local decimal = net_float(inst.GUID, "mymod.decimal") -- Floating point number

-- 2. Batch updates when possible
-- Bad: Sending many small updates
function BadUpdate(inst)
    inst.net_var1:set(1)
    inst.net_var2:set(2)
    inst.net_var3:set(3)
    inst.net_var4:set(4)
end

-- Good: Batch updates into a single network message
function GoodUpdate(inst)
    local data = {
        var1 = 1,
        var2 = 2,
        var3 = 3,
        var4 = 4
    }
    inst.net_data:set(json.encode(data))
end

-- 3. Throttle updates for fast-changing values
function ThrottledUpdate(inst)
    if inst.last_sync_time == nil or GetTime() - inst.last_sync_time > 0.5 then
        inst.net_position:set(inst.Transform:GetWorldPosition())
        inst.last_sync_time = GetTime()
    end
end

-- 4. Use dirty flags to trigger updates only when needed
function UpdateOnlyWhenNeeded(inst, value)
    if inst.current_value ~= value then
        inst.current_value = value
        inst.net_value:set(value)
    end
end
```

### Common Networking Patterns

```lua
-- Pattern 1: Syncing inventory items between server and client
local function SyncInventoryItem(item, container, slot)
    -- This would be part of a custom inventory component
    if not item or not container then return end
    
    -- Create a data structure with just the essential information
    local item_data = {
        prefab = item.prefab,
        slot = slot,
        stack_size = item.components.stackable and item.components.stackable:StackSize() or 1,
        percent = item.components.finiteuses and item.components.finiteuses:GetPercent() or 
                 item.components.perishable and item.components.perishable:GetPercent() or 1,
        is_equipped = item.components.equippable and item.components.equippable.isequipped or false
    }
    
    -- Encode and send via network variable
    container.net_inventory_slot_data:set(json.encode(item_data))
    container.net_inventory_update_slot:set(slot)
end

-- Pattern 2: Implementing a cooldown system with network sync
local CooldownManager = Class(function(self, inst)
    self.inst = inst
    
    -- Server-side cooldown tracking
    self.cooldowns = {}
    
    -- Network variables for client display
    self.net_cooldown_id = net_string(inst.GUID, "cooldown.id", "cooldowndirty")
    self.net_cooldown_time = net_float(inst.GUID, "cooldown.time", "cooldowndirty")
    self.net_cooldown_duration = net_float(inst.GUID, "cooldown.duration", "cooldowndirty")
    
    -- Client-side event handler
    if not TheWorld.ismastersim then
        inst:ListenForEvent("cooldowndirty", function() self:OnCooldownDirty() end)
    end
end)

-- Server-side methods
function CooldownManager:StartCooldown(id, duration)
    if not TheWorld.ismastersim then return end
    
    self.cooldowns[id] = {
        start_time = GetTime(),
        duration = duration
    }
    
    -- Sync to client
    self.net_cooldown_id:set(id)
    self.net_cooldown_time:set(GetTime())
    self.net_cooldown_duration:set(duration)
    
    -- Schedule end of cooldown
    self.inst:DoTaskInTime(duration, function()
        self:EndCooldown(id)
    end)
end

function CooldownManager:EndCooldown(id)
    if not TheWorld.ismastersim then return end
    
    self.cooldowns[id] = nil
    
    -- Notify that cooldown ended
    self.inst:PushEvent("cooldown_ended", {id = id})
end

function CooldownManager:IsOnCooldown(id)
    if not TheWorld.ismastersim then return false end
    
    local cooldown = self.cooldowns[id]
    if not cooldown then return false end
    
    return (GetTime() - cooldown.start_time) < cooldown.duration
end

function CooldownManager:GetRemainingTime(id)
    if not TheWorld.ismastersim then return 0 end
    
    local cooldown = self.cooldowns[id]
    if not cooldown then return 0 end
    
    local elapsed = GetTime() - cooldown.start_time
    return math.max(0, cooldown.duration - elapsed)
end

-- Client-side methods
function CooldownManager:OnCooldownDirty()
    if TheWorld.ismastersim then return end
    
    local id = self.net_cooldown_id:value()
    local start_time = self.net_cooldown_time:value()
    local duration = self.net_cooldown_duration:value()
    
    -- Notify client-side systems
    self.inst:PushEvent("cooldown_updated_client", {
        id = id,
        start_time = start_time,
        duration = duration,
        remaining = math.max(0, duration - (GetTime() - start_time))
    })
end

-- Pattern 3: Broadcasting world events to all players
function BroadcastWorldEvent(event_name, data)
    if not TheWorld.ismastersim then return end
    
    -- Encode event data
    local event_data_json = json.encode({
        name = event_name,
        time = GetTime(),
        data = data
    })
    
    -- Set on world network variable
    TheWorld.net_event:set(event_data_json)
    
    -- Also trigger server-side event
    TheWorld:PushEvent(event_name, data)
end

-- Client-side handler for world events
local function OnWorldEventReceived(world)
    if TheWorld.ismastersim then return end
    
    local event_data_json = world.net_event:value()
    local success, event_data = pcall(function() return json.decode(event_data_json) end)
    
    if success and event_data and event_data.name then
        -- Trigger client-side event
        TheWorld:PushEvent(event_data.name .. "_client", event_data.data)
    end
end

-- Usage:
-- BroadcastWorldEvent("boss_spawned", {boss_type = "deerclops", position = {x=10, y=0, z=20}})
--
-- Client-side:
-- TheWorld:ListenForEvent("boss_spawned_client", function(world, data)
--     print("Boss spawned: " .. data.boss_type)
-- end)
``` 
