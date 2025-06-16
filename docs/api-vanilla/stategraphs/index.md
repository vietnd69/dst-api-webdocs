---
id: stategraphs-overview
title: Stategraphs Overview
sidebar_position: 1
last_updated: 2023-07-06
slug: /api/stategraphs
---
*Last Update: 2023-07-06*
# Stategraphs Overview

Stategraphs are a powerful state machine system that controls entity behavior, animations, and interactions in Don't Starve Together. They provide a structured way to define how entities transition between different states based on events and actions.

## Core Concepts

A stategraph consists of several key components:

- **States**: Defined behaviors that an entity can be in at any given time (e.g., idle, walking, attacking)
- **Events**: Triggers that can cause state transitions (e.g., receiving damage, reaching a target)
- **Transitions**: Rules for moving between states in response to events
- **ActionHandlers**: Special handlers for gameplay actions initiated by the player or AI
- **Timeline Events**: Functions triggered at specific frames during animations

## Architecture Overview

The stategraph system is designed as a finite state machine where:

1. An entity can only be in one state at a time
2. States have entry and exit functions that control behavior
3. Events can trigger transitions between states
4. States can be tagged for easier querying
5. The stategraph maintains its own memory that persists across state transitions

This architecture allows for complex behavior patterns while keeping code organized and maintainable.

## State Graph and Animation System Integration

One of the most powerful aspects of stategraphs is their tight integration with the animation system:

```lua
State{
    name = "attack",
    tags = {"attack", "busy"},
    
    onenter = function(inst)
        -- Play the attack animation when entering this state
        inst.AnimState:PlayAnimation("attack")
        
        -- Configure combat component
        inst.components.combat:StartAttack()
    end,
    
    -- Timeline events synchronize code execution with specific animation frames
    timeline = {
        -- At frame 10, perform the actual attack
        TimeEvent(10*FRAMES, function(inst) 
            inst.components.combat:DoAttack()
            -- Play a sound exactly when the attack animation shows impact
            inst.SoundEmitter:PlaySound("dontstarve/creatures/spider/attack")
        end),
    },
    
    -- When animation finishes, return to idle state
    events = {
        EventHandler("animover", function(inst)
            inst.sg:GoToState("idle")
        end),
    },
}
```

This synchronization ensures that visual feedback, sound effects, and gameplay mechanics all align perfectly.

## Creating a Stategraph

To create a stategraph, you'll need to:

1. Define the states with their enter/exit behaviors and timelines
2. Set up event handlers to respond to game events
3. Define any necessary action handlers
4. Return a StateGraph object

Complete example of a basic stategraph:

```lua
require("stategraphs/commonstates")

local states = {
    -- Define an idle state
    State{
        name = "idle",
        tags = { "idle", "canrotate" },
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle_loop", true)
            inst.components.locomotor:StopMoving()
        end,
    },
    
    -- Define a walk state
    State{
        name = "walk",
        tags = { "moving", "canrotate" },
        onenter = function(inst)
            inst.AnimState:PlayAnimation("walk_loop", true)
            inst.components.locomotor:WalkForward()
        end,
        
        -- Add footstep sounds at specific animation frames
        timeline = {
            TimeEvent(5*FRAMES, function(inst) 
                inst.SoundEmitter:PlaySound("dontstarve/movement/foley/walk_dirt")
            end),
            TimeEvent(15*FRAMES, function(inst) 
                inst.SoundEmitter:PlaySound("dontstarve/movement/foley/walk_dirt")
            end),
        },
    },
    
    -- Define an attack state
    State{
        name = "attack",
        tags = { "attack", "busy" },
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("attack")
        end,
        
        timeline = {
            TimeEvent(8*FRAMES, function(inst) 
                inst.components.combat:DoAttack() 
            end),
        },
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
}

local events = {
    -- Handle movement control
    EventHandler("locomote", function(inst)
        local is_moving = inst.sg:HasStateTag("moving")
        local wants_to_move = inst.components.locomotor:WantsToMoveForward()
        
        if is_moving and not wants_to_move then
            inst.sg:GoToState("idle")
        elseif not is_moving and wants_to_move then
            inst.sg:GoToState("walk")
        end
    end),
    
    -- Handle attack event
    EventHandler("doattack", function(inst, data)
        if not inst.components.health:IsDead() then
            inst.sg:GoToState("attack", data.target)
        end
    end),
    
    -- Handle damage event
    EventHandler("attacked", function(inst)
        if not inst.components.health:IsDead() then
            inst.sg:GoToState("hit")
        end
    end),
}

local actionhandlers = {
    -- Handle attack action
    ActionHandler(ACTIONS.ATTACK, function(inst, action)
        inst:PushEvent("doattack", {target = action.target})
        return true
    end),
}

return StateGraph("myentity", states, events, "idle", actionhandlers)
```

## Using Stategraphs

To use a stategraph with an entity:

```lua
function MakeMyEntity()
    -- Create the entity
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    -- Add required components for behavior
    inst:AddComponent("locomotor")
    inst:AddComponent("combat")
    inst:AddComponent("health")
    
    -- Set the stategraph
    inst:SetStateGraph("SGmyentity")
    
    -- Initialize animation
    inst.AnimState:SetBank("spider")
    inst.AnimState:SetBuild("spider")
    inst.AnimState:PlayAnimation("idle_loop", true)
    
    return inst
end
```

## Stategraph and Animation Best Practices

When creating stategraphs with animations:

1. **Match Timeline Events to Animation Keyframes**: For best results, timeline events should correspond to specific animation keyframes

2. **Use Animation Callbacks**: The `animover` and `animqueueover` events are essential for proper state transitions

3. **Organize Multi-part Animations**: For complex actions, use multiple states:
   ```lua
   -- Example of multi-part animation states
   State{ name = "attack_pre", onenter = function(inst) inst.AnimState:PlayAnimation("attack_pre") end },
   State{ name = "attack_loop", onenter = function(inst) inst.AnimState:PlayAnimation("attack_loop") end },
   State{ name = "attack_pst", onenter = function(inst) inst.AnimState:PlayAnimation("attack_pst") end },
   ```

4. **Leverage Animation Blending**: For smooth transitions
   ```lua
   inst.AnimState:PlayAnimation("walk_pre")
   inst.AnimState:PushAnimation("walk_loop", true)
   ```

5. **Synchronize Sound Effects**: Use timeline events to perfectly time sound effects with animations

## Common States and Handlers

Don't Starve Together provides reusable states and handlers in `commonstates.lua`, which you can use to implement standard behaviors like:

- Walking/running
- Attacking
- Taking damage
- Sleeping
- Freezing

This module helps maintain consistency across different entities while reducing code duplication. 

## Advanced Stategraph Features

### State Memory

States can store temporary data in the `statemem` table:

```lua
onenter = function(inst, target)
    inst.sg.statemem.target = target  -- Store target for use in timeline
end,

timeline = {
    TimeEvent(10*FRAMES, function(inst)
        if inst.sg.statemem.target and inst.sg.statemem.target:IsValid() then
            inst.components.combat:DoAttack(inst.sg.statemem.target)
        end
    end),
}
```

### State Tags

Tags provide a way to categorize states and query their properties:

```lua
-- Add tags when defining a state
State{
    name = "attack",
    tags = {"attack", "busy", "cannotinterrupt"},
    -- state definition...
}

-- Check for tags anywhere in code
if inst.sg:HasStateTag("busy") then
    -- Entity is in a busy state
end

-- Dynamically add/remove tags during a state
onenter = function(inst)
    inst.sg:AddStateTag("abouttoattack")
end,

timeline = {
    TimeEvent(10*FRAMES, function(inst)
        inst.sg:RemoveStateTag("abouttoattack")
        inst.sg:AddStateTag("attackdone")
    end),
}
```

### State Timeouts

States can automatically transition after a timeout:

```lua
State{
    name = "alert",
    tags = {"idle", "alert"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("alert_loop", true)
        inst.sg:SetTimeout(5)  -- 5 second timeout
    end,
    
    ontimeout = function(inst)
        inst.sg:GoToState("idle")
    end,
}
```

## Conclusion

The stategraph system is a powerful way to define entity behavior in Don't Starve Together. By organizing code into states, events, and transitions, it creates readable, maintainable behavior definitions that seamlessly integrate with the animation system. Whether you're creating simple interactive objects or complex creatures with advanced AI, understanding stategraphs is essential for effective DST modding. 
