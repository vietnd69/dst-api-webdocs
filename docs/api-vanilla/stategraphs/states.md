---
id: states
title: States API
sidebar_position: 2
last_updated: 2023-07-06
---

# States API

The States API allows you to define individual states within a stategraph, controlling how entities behave in different situations.

## State Structure

A state is created using the `State` constructor with a table of properties:

```lua
State{
    name = "idle",              -- Unique name for the state
    tags = { "idle", "canrotate" }, -- Tags used for querying state properties
    onenter = function(inst) end,   -- Called when entering the state
    onexit = function(inst) end,    -- Called when exiting the state
    onupdate = function(inst, dt) end, -- Called every frame while in this state
    timeline = {                   -- Timeline of events within the state
        TimeEvent(10*FRAMES, function(inst) end),
        TimeEvent(20*FRAMES, function(inst) end),
    },
}
```

## Key Properties

### name

The unique identifier for the state, used when transitioning between states.

```lua
name = "attack",
```

### tags

Tags are used to categorize states and query state properties. Common tags include:

- `idle`: Entity is in a neutral state
- `moving`: Entity is in motion
- `running`: Entity is running
- `busy`: Entity can't be interrupted
- `attack`: Entity is attacking
- `canrotate`: Entity can change direction while in this state

```lua
tags = { "idle", "canrotate" },
```

### onenter

A function called when the entity enters the state. This is where you typically:
- Play animations
- Start sounds
- Set up timers
- Initialize state variables

```lua
onenter = function(inst)
    inst.AnimState:PlayAnimation("idle_loop", true)
    inst.SoundEmitter:PlaySound("dontstarve/creatures/spider/spider_walk")
    inst.sg:SetTimeout(2 + math.random()*1)
end,
```

### onexit

A function called when the entity exits the state. Use this to:
- Clean up timers
- Stop looping sounds
- Reset variables

```lua
onexit = function(inst)
    inst.SoundEmitter:KillSound("growl")
end,
```

### onupdate

Called every frame while in this state. The `dt` parameter is the time since the last update.

```lua
onupdate = function(inst, dt)
    if inst.components.locomotor:WantsToMoveForward() then
        inst.components.locomotor:WalkForward()
    else
        inst.sg:GoToState("idle")
    end
end,
```

### timeline

A sequence of timed events that occur while in the state. Use `TimeEvent` to define when functions should be called relative to entering the state.

```lua
timeline = {
    TimeEvent(0*FRAMES, function(inst)
        inst.SoundEmitter:PlaySound("dontstarve/wilson/attack_weapon")
    end),
    TimeEvent(8*FRAMES, function(inst)
        inst.components.combat:DoAttack()
    end),
    TimeEvent(12*FRAMES, function(inst)
        inst.sg:RemoveStateTag("attack")
        inst.sg:AddStateTag("idle")
    end),
},
```

### events

A list of events that can be handled while in this state. When an event is triggered, it can cause a state transition.

```lua
events = {
    EventHandler("animover", function(inst)
        inst.sg:GoToState("idle")
    end),
},
```

## State Manipulation

Within a state, you can use these methods to manipulate the current state:

- `inst.sg:GoToState(statename, [data])`: Transition to a new state
- `inst.sg:AddStateTag(tag)`: Add a tag to the current state
- `inst.sg:RemoveStateTag(tag)`: Remove a tag from the current state
- `inst.sg:HasStateTag(tag)`: Check if the current state has a tag
- `inst.sg:SetTimeout(time)`: Set a timeout for the current state

## Common Patterns

### Animation-driven State Transitions

```lua
-- Go to another state when animation finishes
events = {
    EventHandler("animover", function(inst)
        inst.sg:GoToState("idle")
    end),
},
```

### Timeout-driven State Transitions

```lua
-- Set a timeout when entering the state
onenter = function(inst)
    inst.AnimState:PlayAnimation("idle_loop", true)
    inst.sg:SetTimeout(2 + math.random()*1)
end,

-- Define what happens when timeout is reached
ontimeout = function(inst)
    inst.sg:GoToState("alert")
end,
```

### Complex State Logic

```lua
onenter = function(inst)
    inst.AnimState:PlayAnimation("atk")
    inst.components.locomotor:StopMoving()
    inst.sg.statemem.target = inst.components.combat.target
    inst.components.combat:StartAttack()
end,

timeline = {
    TimeEvent(8*FRAMES, function(inst) 
        inst.components.combat:DoAttack(inst.sg.statemem.target) 
    end),
},

events = {
    EventHandler("animover", function(inst)
        inst.sg:GoToState("idle")
    end),
},
``` 
