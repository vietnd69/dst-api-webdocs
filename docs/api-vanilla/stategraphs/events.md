---
id: events
title: Stategraph Events
sidebar_position: 3
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Stategraph Events

Events are the mechanism that drives state transitions in the stategraph system. They allow entities to respond to game triggers and change their behavior accordingly.

## Event Handlers

Event handlers are created using the `EventHandler` constructor, which takes an event name and a callback function:

```lua
EventHandler("attacked", function(inst, data)
    inst.sg:GoToState("hit")
end)
```

## Common Events

Don't Starve Together has many built-in events that you can listen for:

### Animation Events

- `animover`: Triggered when an animation completes
- `animqueueover`: Triggered when all queued animations complete

```lua
EventHandler("animover", function(inst)
    inst.sg:GoToState("idle")
end)
```

### Combat Events

- `attacked`: Triggered when the entity takes damage
- `death`: Triggered when the entity dies
- `doattack`: Triggered when the entity should perform an attack

```lua
EventHandler("attacked", function(inst, data)
    if not inst.components.health:IsDead() then
        inst.sg:GoToState("hit")
    end
end)

EventHandler("death", function(inst)
    inst.sg:GoToState("death")
end)
```

### Movement Events

- `locomote`: Triggered when the entity's movement parameters change
- `stopmovingdirection`: Triggered when the entity should stop moving
- `step`: Triggered when the entity should make a footstep sound

```lua
EventHandler("locomote", function(inst)
    local is_moving = inst.sg:HasStateTag("moving")
    local should_move = inst.components.locomotor:WantsToMoveForward()
    
    if is_moving and not should_move then
        inst.sg:GoToState("idle")
    elseif not is_moving and should_move then
        inst.sg:GoToState("walk_start")
    end
end)
```

### Status Events

- `freeze`: Triggered when the entity is frozen
- `unfreeze`: Triggered when the entity thaws
- `gotosleep`: Triggered when the entity should go to sleep
- `knockback`: Triggered when the entity is knocked back

```lua
EventHandler("freeze", function(inst)
    if not inst.components.health:IsDead() then
        inst.sg:GoToState("frozen")
    end
end)
```

### Custom Events

You can create and trigger custom events for specific gameplay needs:

```lua
-- Define a handler for a custom event
EventHandler("startspecialability", function(inst, data)
    inst.sg:GoToState("special_ability", data)
end)

-- Trigger the custom event elsewhere in code
inst:PushEvent("startspecialability", {power = 10})
```

## Event Data

Events can include data that provides context about the event:

```lua
EventHandler("attacked", function(inst, data)
    -- data.attacker is the entity that attacked
    -- data.damage is the amount of damage taken
    if data.attacker and data.attacker:HasTag("player") then
        inst.sg:GoToState("player_hit")
    else
        inst.sg:GoToState("monster_hit")
    end
end)
```

## Global Event Handlers

You can define event handlers at the stategraph level to handle events regardless of which state the entity is in:

```lua
local events = {
    EventHandler("death", function(inst)
        inst.sg:GoToState("death")
    end),
    
    EventHandler("attacked", function(inst, data)
        if not inst.components.health:IsDead() then
            inst.sg:GoToState("hit")
        end
    end),
}
```

## State-Specific Event Handlers

You can also define event handlers that only apply when in a specific state:

```lua
State{
    name = "idle",
    tags = {"idle", "canrotate"},
    
    events = {
        EventHandler("attacked", function(inst, data)
            inst.sg:GoToState("hit")
        end),
        
        EventHandler("doattack", function(inst)
            inst.sg:GoToState("attack")
        end),
    },
}
```

## Common Event Handlers

Don't Starve Together includes a library of common event handlers in `commonstates.lua`:

```lua
local events = {
    -- Standard event handlers from CommonHandlers
    CommonHandlers.OnStep(),
    CommonHandlers.OnSleep(),
    CommonHandlers.OnFreeze(),
    CommonHandlers.OnAttacked(),
    CommonHandlers.OnDeath(),
    CommonHandlers.OnLocomote(true, true), -- can_run, can_walk
}
```

This helps maintain consistent behavior across different entities while reducing code duplication. 
