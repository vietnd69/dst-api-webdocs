---
id: event-system
title: Event System
sidebar_position: 3
last_updated: 2023-07-06
---

# Event System

Don't Starve Together uses an event system to manage and react to game state changes. This system allows entities to register listeners and respond to events from other entities.

The event system is a fundamental part of the game's architecture, enabling communication between different components and entities. It follows a publisher-subscriber pattern, where entities can:
- **Publish (fire) events** when something happens
- **Subscribe (listen) to events** to react when they occur
- **Unsubscribe (remove listeners)** when no longer needed

This approach creates a loosely coupled system where components don't need direct knowledge of each other to interact, making the codebase more modular and easier to extend.

## Registering and Firing Events

The event system has two primary operations: registering event listeners and firing events. These operations form the foundation of event-based communication in the game.

### Key Methods

```lua
-- Register event listener
inst:ListenForEvent(event_name, fn, source)

-- Fire event
inst:PushEvent(event_name, data)
```

Where:
- `event_name`: Name of the event (string) - identifies what happened (e.g., "death", "attacked")
- `fn`: Callback function called when the event occurs - contains the code that should run in response
- `source`: (Optional) Source entity firing the event - if not specified, listens from all sources
- `data`: (Optional) Data sent with the event, usually a table - provides additional context about the event

### How It Works

When you call `ListenForEvent()`, you're essentially saying: "When this specific event happens, run this function." The event system maintains internal tables of registered listeners and notifies them when relevant events occur.

When you call `PushEvent()`, the system checks for all listeners registered for that event and calls their callback functions, passing any provided data.

## Unregistering Events

To prevent memory leaks and ensure proper cleanup, it's important to remove event listeners when they're no longer needed, especially for temporary entities.

```lua
-- Unregister event listener
inst:RemoveEventCallback(event_name, fn, source)

-- Unregister all event listeners
inst:RemoveAllEventCallbacks()
```

When removing a listener, you need to provide the same parameters that were used when registering it: the event name, function reference, and source (if specified). Alternatively, `RemoveAllEventCallbacks()` removes all listeners from an entity at once, which is useful during cleanup operations.

## Usage Examples

The following examples demonstrate common patterns for using the event system in Don't Starve Together.

### Listening to events from the entity itself

One of the most common uses of events is to have an entity react to its own state changes:

```lua
-- Entity listens to "attacked" event from itself
inst:ListenForEvent("attacked", function(inst, data)
    print("Attacked by: " .. tostring(data.attacker))
    print("Damage: " .. tostring(data.damage))
    
    -- Example: Play a unique sound when attacked
    if inst.SoundEmitter then
        inst.SoundEmitter:PlaySound("dontstarve/creatures/monster_hurt")
    end
    
    -- Example: Notify nearby allies
    local x, y, z = inst.Transform:GetWorldPosition()
    local allies = TheSim:FindEntities(x, y, z, 20, {"ally"})
    for _, ally in ipairs(allies) do
        ally:PushEvent("allythreatened", {threatener = data.attacker})
    end
end)
```

In this example, when the entity is attacked:
1. It prints information about the attack
2. Plays a sound effect
3. Notifies nearby allies about the threat

### Listening to events from another entity

You can also listen to events fired by other entities, which is useful for creating interactions between entities:

```lua
-- Entity listens to "death" event from target
inst:ListenForEvent("death", function(target)
    print(target.prefab .. " has died!")
    
    -- Example: Celebrate when target dies
    if inst.components.talker then
        inst.components.talker:Say("I've defeated " .. target:GetDisplayName() .. "!")
    end
    
    -- Example: Grant experience reward
    if inst.components.combat then
        inst.components.combat.externaldamagetakenmultipliers:SetModifier("victory", 0.9, "victory_buff")
        -- Remove the buff after 10 seconds
        inst:DoTaskInTime(10, function() 
            inst.components.combat.externaldamagetakenmultipliers:RemoveModifier("victory") 
        end)
    end
end, target)
```

In this example:
1. The entity listens for when a specific target entity dies
2. Makes the entity "say" something when the target dies
3. Grants a temporary combat buff to the entity

### Firing events with data

You can fire custom events with additional data to communicate between different parts of your code:

```lua
-- Fire "customaction" event with data
inst:PushEvent("customaction", { 
    target = target_entity, 
    value = 10,
    location = Vector3(inst.Transform:GetWorldPosition()),
    success = true
})
```

This pattern is particularly useful when:
- You need to communicate between different components on the same entity
- You want to broadcast information to multiple listeners
- You want to decouple the action trigger from the action handler

## Common Events

Don't Starve Together has numerous built-in events that you can listen for in your mods. Below are some of the most frequently used events organized by category. Understanding these events allows you to respond to various game situations effectively.

### Combat Events

Combat events are triggered during fights and interactions between entities that can deal or receive damage.

```lua
-- When entity is attacked
-- data: { attacker, damage, damageresolved, original_damage, weapon, stimuli, spdamage, redirected, noimpactsound }
inst:ListenForEvent("attacked", function(inst, data)
    -- The 'data' table contains detailed information about the attack
    local attacker = data.attacker -- Entity that performed the attack
    local damage = data.damage -- Final damage after all modifiers
    local original_damage = data.original_damage -- Damage before modifiers
    
    -- Example: Apply a counter-effect when attacked by spiders
    if attacker and attacker:HasTag("spider") then
        attacker:PushEvent("attacked", {attacker = inst, damage = damage * 0.5})
    end
end)

-- When entity dies
inst:ListenForEvent("death", function(inst)
    -- This is often used for:
    -- - Playing death animations or sounds
    -- - Dropping special loot
    -- - Triggering world events
    
    -- Example: Spawn flies when a monster dies
    for i = 1, 3 do
        local fly = SpawnPrefab("fly")
        local x, y, z = inst.Transform:GetWorldPosition()
        fly.Transform:SetPosition(x + math.random(-2, 2), y, z + math.random(-2, 2))
    end
end)

-- When entity damages another entity
inst:ListenForEvent("onhitother", function(inst, data)
    -- data contains: target, damage, stimuli, etc.
    local target = data.target
    local damage = data.damage
    
    -- Example: Apply a burning effect on hit
    if inst.components.burnable and inst.components.burnable:IsBurning() and
       target.components.burnable and not target.components.burnable:IsBurning() then
        target.components.burnable:Ignite()
    end
end)
```

### Character Events

Character events relate to player characters and their stats, providing ways to respond to changes in hunger, health, sanity, and equipment.

```lua
-- When character's hunger changes
inst:ListenForEvent("hungerdelta", function(inst, data)
    -- data.newpercent - new hunger percentage
    -- data.oldpercent - previous hunger percentage
    -- data.delta - amount changed
    
    -- Example: Make the character move slower when very hungry
    if data.newpercent < 0.2 and inst.components.locomotor then
        inst.components.locomotor:SetExternalSpeedMultiplier("hunger_penalty", 0.7)
    elseif data.newpercent >= 0.2 and inst.components.locomotor then
        inst.components.locomotor:RemoveExternalSpeedMultiplier("hunger_penalty")
    end
end)

-- When character's health changes
inst:ListenForEvent("healthdelta", function(inst, data)
    -- Similar structure to hungerdelta
    -- Example: Create a visual effect when health is very low
    if data.newpercent < 0.1 then
        local fx = SpawnPrefab("hitsparks")
        fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
    end
end)

-- When character's sanity changes
inst:ListenForEvent("sanitydelta", function(inst, data)
    -- Similar structure to hungerdelta
end)

-- When character equips item
inst:ListenForEvent("equip", function(inst, data)
    -- data.item - the equipped item
    -- data.eslot - equipment slot
    
    -- Example: Apply special effect for a specific item
    if data.item.prefab == "nightsword" then
        inst.components.sanity.night_drain_mult = 1.5
    end
end)

-- When character unequips item
inst:ListenForEvent("unequip", function(inst, data)
    -- data.item - the unequipped item
    -- data.eslot - equipment slot
    
    -- Example: Remove special effect when unequipping
    if data.item.prefab == "nightsword" then
        inst.components.sanity.night_drain_mult = 1.0
    end
end)
```

### World Events

World events are fired by `TheWorld` entity and represent global changes like seasons, time of day, or weather conditions.

```lua
-- When season changes
TheWorld:ListenForEvent("seasonchange", function(world, data)
    -- data.season - new season ("winter", "summer", etc.)
    -- data.prev - previous season
    
    -- Example: Prepare all players for winter
    if data.season == "winter" then
        for _, player in ipairs(AllPlayers) do
            if player.components.talker then
                player.components.talker:Say("Winter is coming!")
            end
        end
    end
end)

-- When day/night phase changes
TheWorld:ListenForEvent("phasechanged", function(world, data)
    -- data.newphase - new phase ("day", "dusk", "night")
    -- data.oldphase - previous phase
    
    -- Example: Make creatures more active at night
    if data.newphase == "night" then
        local creatures = TheSim:FindEntities(0, 0, 0, 10000, {"monster"})
        for _, creature in ipairs(creatures) do
            creature:PushEvent("nighttime")
        end
    end
end)

-- When rain starts/stops
TheWorld:ListenForEvent("rainstart", function(world)
    -- Example: Make fire burn less efficiently
    local fires = TheSim:FindEntities(0, 0, 0, 10000, {"fire"})
    for _, fire in ipairs(fires) do
        if fire.components.burnable then
            fire.components.burnable:SetBurnTime(fire.components.burnable.burntime * 0.8)
        end
    end
end)
```

### Entity Lifecycle Events

```lua
-- When animation ends
inst:ListenForEvent("animover", function(inst)
    -- Often used to chain animations or return to idle state
    inst.AnimState:PlayAnimation("idle")
end)

-- When entity is burnt
inst:ListenForEvent("burnt", function(inst)
    -- Handle what happens when entity is burned
    inst.AnimState:PlayAnimation("burnt")
    inst:RemoveComponent("burnable")
end)

-- When entity is destroyed
inst:ListenForEvent("onremove", function(inst)
    -- Clean up any external references or effects
    if inst.task then
        inst.task:Cancel()
    end
end)
```

## Network Events

In multiplayer environments, events are also used to synchronize between server and clients:

```lua
-- Event when network value changes
inst.mynetval = net_bool(inst.GUID, "mynetval", "mynetvaldirty")
inst.mynetval:set(true) -- Will send "mynetvaldirty" event to clients

-- Listen for changes (client-side)
inst:ListenForEvent("mynetvaldirty", function()
    local current_value = inst.mynetval:value()
    -- Handle value change
    if current_value then
        inst.AnimState:PlayAnimation("active")
    else
        inst.AnimState:PlayAnimation("inactive")
    end
end)
```

## Creating Custom Events in Mods

You can create and use custom events in your mod:

```lua
-- In modmain.lua
local MY_EVENTS = {
    "mycustomevent1",
    "mycustomevent2",
}

-- In prefab or component
inst:PushEvent("mycustomevent1", { custom_data = 123 })

-- Listen for custom event
inst:ListenForEvent("mycustomevent1", function(inst, data)
    print("Custom event data: " .. tostring(data.custom_data))
    
    -- React to the custom event
    inst.AnimState:PlayAnimation("special_animation")
    inst.SoundEmitter:PlaySound("dontstarve/custom/sound")
end)
```

For a practical example of using events to trigger functionality, see the [Wormhole Marks case study](../examples/case-wormhole.md). This mod uses the `starttravelsound` event to detect when players use wormholes and trigger the marking system that pairs connected wormholes with matching symbols.

## Best Practices for Event System

When working with the event system:

1. **Clean up listeners**: Always remove event listeners when they're no longer needed to prevent memory leaks
2. **Use descriptive event names**: Choose clear, specific names for custom events
3. **Structure event data**: Organize event data in a consistent way to make handling easier
4. **Avoid excessive events**: Don't overuse events for things that could be direct function calls
5. **Consider performance**: Events with many listeners can impact performance if triggered frequently 
