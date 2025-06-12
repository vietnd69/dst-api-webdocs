---
id: event-system
title: Event System
sidebar_position: 3
---

# Event System

Don't Starve Together uses an event system to manage and react to game state changes. This system allows entities to register listeners and respond to events from other entities.

## Registering and Firing Events

Two main methods in the event system:

```lua
-- Register event listener
inst:ListenForEvent(event_name, fn, source)

-- Fire event
inst:PushEvent(event_name, data)
```

Where:
- `event_name`: Name of the event (string)
- `fn`: Callback function called when the event occurs
- `source`: (Optional) Source entity firing the event, if not specified, listens from all sources
- `data`: (Optional) Data sent with the event, usually a table

## Unregistering Events

```lua
-- Unregister event listener
inst:RemoveEventCallback(event_name, fn, source)

-- Unregister all event listeners
inst:RemoveAllEventCallbacks()
```

## Usage Examples

### Listening to events from the entity itself

```lua
-- Entity listens to "attacked" event from itself
inst:ListenForEvent("attacked", function(inst, data)
    print("Attacked by: " .. tostring(data.attacker))
    print("Damage: " .. tostring(data.damage))
end)
```

### Listening to events from another entity

```lua
-- Entity listens to "death" event from target
inst:ListenForEvent("death", function(target)
    print(target.prefab .. " has died!")
end, target)
```

### Firing events with data

```lua
-- Fire "customaction" event with data
inst:PushEvent("customaction", { target = target_entity, value = 10 })
```

## Common Events

Here are some common events in Don't Starve Together:

### Combat Events

```lua
-- When entity is attacked
-- data: { attacker, damage, damageresolved, original_damage, weapon, stimuli, spdamage, redirected, noimpactsound }
inst:ListenForEvent("attacked", OnAttacked)

-- When entity dies
inst:ListenForEvent("death", OnDeath)

-- When entity damages another entity
inst:ListenForEvent("onhitother", OnHitOther)
```

### Character Events

```lua
-- When character's hunger changes
inst:ListenForEvent("hungerdelta", OnHungerDelta)

-- When character's health changes
inst:ListenForEvent("healthdelta", OnHealthDelta)

-- When character's sanity changes
inst:ListenForEvent("sanitydelta", OnSanityDelta)

-- When character equips item
inst:ListenForEvent("equip", OnEquip)

-- When character unequips item
inst:ListenForEvent("unequip", OnUnequip)
```

### World Events

```lua
-- When season changes
TheWorld:ListenForEvent("seasonchange", OnSeasonChange)

-- When day/night phase changes
TheWorld:ListenForEvent("phasechanged", OnPhaseChanged)

-- When rain starts/stops
TheWorld:ListenForEvent("rainstart", OnRainStart)
TheWorld:ListenForEvent("rainstop", OnRainStop)
```

### Entity Lifecycle Events

```lua
-- When animation ends
inst:ListenForEvent("animover", OnAnimOver)

-- When entity is burnt
inst:ListenForEvent("burnt", OnBurnt)

-- When entity is destroyed
inst:ListenForEvent("onremove", OnRemove)
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
end)
``` 