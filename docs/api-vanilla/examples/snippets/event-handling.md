---
id: event-handling
title: Event Handling Snippets
sidebar_position: 2
last_updated: 2023-07-06
---

# Event Handling Snippets

This page provides reusable code snippets for handling events in Don't Starve Together.

## Basic Event Handling

### Listen for Entity Events

```lua
-- Listen for an event on an entity
local function ListenForEntityEvent(entity, event_name, handler)
    if entity then
        entity:ListenForEvent(event_name, handler)
    end
end

-- Usage
ListenForEntityEvent(ThePlayer, "death", function(inst)
    print("Player died!")
end)
```

### Remove Event Listeners

```lua
-- Listen for an event with the ability to remove the listener
local function CreateRemovableListener(entity, event_name, handler)
    if entity then
        local function wrapped_handler(...)
            handler(...)
        end
        
        entity:ListenForEvent(event_name, wrapped_handler)
        
        -- Return a function that can remove this listener
        return function()
            entity:RemoveEventCallback(event_name, wrapped_handler)
        end
    end
    return function() end -- Return empty function if entity is nil
end

-- Usage
local remove_listener = CreateRemovableListener(ThePlayer, "attacked", function(inst, data)
    print("Player was attacked by " .. tostring(data.attacker))
end)

-- Later, to remove the listener
remove_listener()
```

## World Events

### Listen for Season Changes

```lua
-- Listen for season changes
local function OnSeasonChange(season_handler)
    TheWorld:ListenForEvent("seasonchange", function(world, data)
        local season = data.season
        season_handler(season)
    end)
end

-- Usage
OnSeasonChange(function(season)
    if season == "winter" then
        print("Winter is coming!")
    elseif season == "summer" then
        print("Summer is here!")
    elseif season == "autumn" then
        print("Autumn leaves are falling")
    elseif season == "spring" then
        print("Spring has sprung!")
    end
end)
```

### Listen for Time of Day Changes

```lua
-- Listen for time of day changes
local function OnTimeOfDayChange(day_handler, dusk_handler, night_handler)
    local function CheckTime(inst, phase)
        if phase == "day" and day_handler then
            day_handler()
        elseif phase == "dusk" and dusk_handler then
            dusk_handler()
        elseif phase == "night" and night_handler then
            night_handler()
        end
    end
    
    TheWorld:ListenForEvent("phasechanged", function(inst, phase)
        CheckTime(inst, phase)
    end)
    
    -- Also check immediately
    CheckTime(TheWorld, TheWorld.state.phase)
end

-- Usage
OnTimeOfDayChange(
    function() print("It's daytime!") end,
    function() print("It's dusk!") end,
    function() print("It's night!") end
)
```

### Listen for Weather Events

```lua
-- Listen for weather events
local function OnWeatherChange(handlers)
    -- Lightning
    if handlers.lightning then
        TheWorld:ListenForEvent("lightning", handlers.lightning)
    end
    
    -- Start/Stop Rain
    if handlers.startrain then
        TheWorld:ListenForEvent("startrain", handlers.startrain)
    end
    
    if handlers.stoprain then
        TheWorld:ListenForEvent("stoprain", handlers.stoprain)
    end
    
    -- Start/Stop Snow
    if handlers.startsnow then
        TheWorld:ListenForEvent("startsnow", handlers.startsnow)
    end
    
    if handlers.stopsnow then
        TheWorld:ListenForEvent("stopsnow", handlers.stopsnow)
    end
    
    -- Start/Stop Sandstorm (Desert)
    if handlers.sandstormchanged then
        TheWorld:ListenForEvent("sandstormchanged", handlers.sandstormchanged)
    end
end

-- Usage
OnWeatherChange({
    lightning = function() print("Lightning struck!") end,
    startrain = function() print("It started raining") end,
    stoprain = function() print("Rain stopped") end,
    startsnow = function() print("It started snowing") end,
    stopsnow = function() print("Snow stopped") end,
    sandstormchanged = function(world, data) 
        print("Sandstorm " .. (data.sandstorm and "started" or "stopped"))
    end
})
```

## Player Events

### Listen for Player Health Changes

```lua
-- Listen for player health changes
local function OnPlayerHealthChange(player, threshold_percent, low_handler, high_handler)
    if player and player.components.health then
        player:ListenForEvent("healthdelta", function(inst, data)
            local percent = player.components.health:GetPercent()
            
            if percent <= threshold_percent and low_handler then
                low_handler(percent, data)
            elseif percent > threshold_percent and high_handler then
                high_handler(percent, data)
            end
        end)
    end
end

-- Usage
OnPlayerHealthChange(ThePlayer, 0.3,
    function(percent) print("Health low: " .. math.floor(percent * 100) .. "%") end,
    function(percent) print("Health ok: " .. math.floor(percent * 100) .. "%") end
)
```

### Listen for Player Hunger Changes

```lua
-- Listen for player hunger changes
local function OnPlayerHungerChange(player, threshold_percent, low_handler, high_handler)
    if player and player.components.hunger then
        player:ListenForEvent("hungerdelta", function(inst, data)
            local percent = player.components.hunger:GetPercent()
            
            if percent <= threshold_percent and low_handler then
                low_handler(percent, data)
            elseif percent > threshold_percent and high_handler then
                high_handler(percent, data)
            end
        end)
    end
end

-- Usage
OnPlayerHungerChange(ThePlayer, 0.25,
    function(percent) print("Getting hungry: " .. math.floor(percent * 100) .. "%") end,
    function(percent) print("Hunger ok: " .. math.floor(percent * 100) .. "%") end
)
```

### Listen for Player Sanity Changes

```lua
-- Listen for player sanity changes
local function OnPlayerSanityChange(player, threshold_percent, low_handler, high_handler)
    if player and player.components.sanity then
        player:ListenForEvent("sanitydelta", function(inst, data)
            local percent = player.components.sanity:GetPercent()
            
            if percent <= threshold_percent and low_handler then
                low_handler(percent, data)
            elseif percent > threshold_percent and high_handler then
                high_handler(percent, data)
            end
        end)
    end
end

-- Usage
OnPlayerSanityChange(ThePlayer, 0.4,
    function(percent) print("Going insane: " .. math.floor(percent * 100) .. "%") end,
    function(percent) print("Sanity ok: " .. math.floor(percent * 100) .. "%") end
)
```

### Listen for Player Item Actions

```lua
-- Listen for player item actions
local function OnPlayerItemAction(player, action_type, handler)
    if player then
        player:ListenForEvent("performaction", function(inst, data)
            if data and data.action and data.action.id == action_type then
                handler(data.action, data.target)
            end
        end)
    end
end

-- Usage
OnPlayerItemAction(ThePlayer, ACTIONS.CHOP.id, function(action, target)
    print("Player chopped " .. tostring(target))
end)
```

## Combat Events

### Listen for Entity Attacks

```lua
-- Listen for when an entity attacks or is attacked
local function OnEntityCombat(entity, on_attack_handler, on_attacked_handler)
    if entity then
        -- When this entity attacks something
        if on_attack_handler then
            entity:ListenForEvent("onhitother", function(inst, data)
                on_attack_handler(data.target, data.damage, data.weapon)
            end)
        end
        
        -- When this entity is attacked
        if on_attacked_handler then
            entity:ListenForEvent("attacked", function(inst, data)
                on_attacked_handler(data.attacker, data.damage, data.weapon)
            end)
        end
    end
end

-- Usage
OnEntityCombat(ThePlayer,
    function(target, damage) print("Player attacked " .. tostring(target) .. " for " .. tostring(damage) .. " damage") end,
    function(attacker, damage) print("Player was attacked by " .. tostring(attacker) .. " for " .. tostring(damage) .. " damage") end
)
```

### Listen for Entity Death

```lua
-- Listen for entity death
local function OnEntityDeath(entity, handler)
    if entity then
        entity:ListenForEvent("death", function(inst, data)
            local killer = data and data.afflicter or nil
            handler(killer)
        end)
    end
end

-- Usage
OnEntityDeath(ThePlayer, function(killer)
    if killer then
        print("Player was killed by " .. tostring(killer))
    else
        print("Player died")
    end
end)
```

## Inventory Events

### Listen for Item Pickup/Drop

```lua
-- Listen for item pickup and drop events
local function OnInventoryChange(player, item_add_handler, item_lose_handler)
    if player and player.components.inventory then
        if item_add_handler then
            player:ListenForEvent("itemget", function(inst, data)
                item_add_handler(data.item, data.slot)
            end)
        end
        
        if item_lose_handler then
            player:ListenForEvent("itemlose", function(inst, data)
                item_lose_handler(data.prev_item)
            end)
        end
    end
end

-- Usage
OnInventoryChange(ThePlayer,
    function(item) print("Picked up " .. tostring(item.prefab)) end,
    function(item) print("Lost " .. tostring(item.prefab)) end
)
```

### Listen for Equipment Changes

```lua
-- Listen for equipment changes
local function OnEquipmentChange(player, equip_handler, unequip_handler)
    if player then
        if equip_handler then
            player:ListenForEvent("equip", function(inst, data)
                equip_handler(data.item, data.eslot)
            end)
        end
        
        if unequip_handler then
            player:ListenForEvent("unequip", function(inst, data)
                unequip_handler(data.item, data.eslot)
            end)
        end
    end
end

-- Usage
OnEquipmentChange(ThePlayer,
    function(item, slot) print("Equipped " .. tostring(item.prefab) .. " in " .. tostring(slot)) end,
    function(item, slot) print("Unequipped " .. tostring(item.prefab) .. " from " .. tostring(slot)) end
)
```

## Advanced Event Handling

### Event Debouncing

```lua
-- Create a debounced event handler that only triggers once within a time period
local function CreateDebouncedHandler(delay, handler)
    local timer = nil
    
    return function(...)
        if timer then
            timer:Cancel()
        end
        
        local args = {...}
        timer = TheWorld:DoTaskInTime(delay, function()
            handler(unpack(args))
            timer = nil
        end)
    end
end

-- Usage
local debounced_handler = CreateDebouncedHandler(1, function()
    print("This will only print once per second no matter how often triggered")
end)

-- Can be called multiple times but handler only executes once per second
ThePlayer:ListenForEvent("hungerdelta", debounced_handler)
```

### Event Throttling

```lua
-- Create a throttled event handler that only triggers at most once per time period
local function CreateThrottledHandler(delay, handler)
    local last_time = 0
    
    return function(...)
        local current_time = GetTime()
        if current_time - last_time >= delay then
            last_time = current_time
            handler(...)
        end
    end
end

-- Usage
local throttled_handler = CreateThrottledHandler(5, function()
    print("This will print at most once every 5 seconds")
end)

-- Can be called frequently but handler only executes once every 5 seconds at most
ThePlayer:ListenForEvent("sanitydelta", throttled_handler)
```

### Conditional Event Handling

```lua
-- Create an event handler that only triggers when a condition is met
local function CreateConditionalHandler(condition_fn, handler)
    return function(...)
        if condition_fn(...) then
            handler(...)
        end
    end
end

-- Usage
local night_only_handler = CreateConditionalHandler(
    function() return TheWorld.state.isnight end,
    function() print("This only happens at night") end
)

-- Handler only executes when it's night
TheWorld:ListenForEvent("phasechanged", night_only_handler)
```

### Event Sequence Detection

```lua
-- Detect a sequence of events
local function DetectEventSequence(entity, events, timeout, success_handler)
    local current_step = 1
    local timer = nil
    
    local function reset_sequence()
        current_step = 1
        if timer then
            timer:Cancel()
            timer = nil
        end
    end
    
    local function setup_next_step()
        if current_step <= #events then
            local event_info = events[current_step]
            
            entity:ListenForEvent(event_info.name, function(inst, data)
                if event_info.condition == nil or event_info.condition(inst, data) then
                    -- Remove this listener
                    entity:RemoveEventCallback(event_info.name, setup_next_step)
                    
                    -- Move to next step
                    current_step = current_step + 1
                    
                    -- Reset timer
                    if timer then
                        timer:Cancel()
                    end
                    
                    -- If we completed the sequence
                    if current_step > #events then
                        success_handler()
                        reset_sequence()
                    else
                        -- Set timeout for next step
                        timer = TheWorld:DoTaskInTime(timeout, reset_sequence)
                        setup_next_step()
                    end
                end
            end)
        end
    end
    
    setup_next_step()
    
    -- Return a function to cancel the sequence detection
    return reset_sequence
end

-- Usage: Detect when player chops a tree then mines a rock within 10 seconds
local cancel_detection = DetectEventSequence(ThePlayer, 
    {
        {name = "performaction", condition = function(inst, data) 
            return data.action and data.action.id == ACTIONS.CHOP.id 
        end},
        {name = "performaction", condition = function(inst, data) 
            return data.action and data.action.id == ACTIONS.MINE.id 
        end}
    },
    10,
    function()
        print("Player chopped a tree then mined a rock within 10 seconds!")
    }
)

-- To cancel the detection
-- cancel_detection()
```

## Global Event Bus

```lua
-- Create a simple event bus for global communication
local EventBus = {
    listeners = {}
}

-- Subscribe to an event
function EventBus:Subscribe(event_name, listener)
    self.listeners[event_name] = self.listeners[event_name] or {}
    table.insert(self.listeners[event_name], listener)
    
    -- Return unsubscribe function
    return function()
        self:Unsubscribe(event_name, listener)
    end
end

-- Unsubscribe from an event
function EventBus:Unsubscribe(event_name, listener)
    if self.listeners[event_name] then
        for i, l in ipairs(self.listeners[event_name]) do
            if l == listener then
                table.remove(self.listeners[event_name], i)
                break
            end
        end
    end
end

-- Publish an event
function EventBus:Publish(event_name, ...)
    if self.listeners[event_name] then
        for _, listener in ipairs(self.listeners[event_name]) do
            listener(...)
        end
    end
end

-- Usage
local unsubscribe = EventBus:Subscribe("custom_event", function(message)
    print("Received: " .. message)
end)

-- Trigger the event
EventBus:Publish("custom_event", "Hello World!")

-- Unsubscribe when no longer needed
-- unsubscribe()
```

These snippets provide a foundation for handling various events in Don't Starve Together mods. Adapt them to your specific needs and combine them for more complex event handling behaviors. 
