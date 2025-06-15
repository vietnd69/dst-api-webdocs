---
id: stategraph
title: Stategraph
sidebar_position: 6
last_updated: 2023-07-06
---

# Stategraph

Stategraphs control entity animations, sounds, and state-based behaviors in Don't Starve Together. They provide a framework for defining states and transitions between them.

## Overview

A stategraph is a finite state machine that defines:
- States: Different modes an entity can be in (idle, walking, attacking)
- Events: Triggers that cause state transitions
- Handlers: Functions that handle specific events in specific states

## Common Stategraph Structure

```lua
local states = 
{
    State{
        name = "idle",
        tags = {"idle", "canrotate"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle_loop", true)
        end,
        
        events = 
        {
            EventHandler("animover", function(inst) 
                return inst.sg:GoToState("idle") 
            end),
            EventHandler("attacked", function(inst) 
                return inst.sg:GoToState("hit") 
            end),
        },
    },
    
    State{
        name = "walk",
        tags = {"moving", "canrotate"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("walk_loop", true)
            inst.components.locomotor:WalkForward()
        end,
        
        onexit = function(inst)
            inst.components.locomotor:StopMoving()
        end,
    },
}

local events = 
{
    EventHandler("locomote", function(inst, data)
        if inst.sg:HasStateTag("moving") then
            if not data.moving then
                inst.sg:GoToState("idle")
            end
        elseif data.moving then
            inst.sg:GoToState("walk")
        end
    end),
}

return StateGraph("entityname", states, events)
```

## State Properties

- `name`: Unique identifier for the state
- `tags`: List of tags used to identify characteristics of the state
- `onenter`: Function called when entering the state
- `onexit`: Function called when exiting the state
- `onupdate`: Function called every frame while in the state
- `timeline`: Timeline for triggering actions at specific animation frames
- `events`: Event handlers specific to this state

## Common State Tags

- `idle`: Entity is not performing any action
- `moving`: Entity is moving
- `busy`: Entity cannot perform other actions
- `attack`: Entity is attacking
- `canrotate`: Entity can change facing direction

## Timeline Example

```lua
timeline = 
{
    TimeEvent(10*FRAMES, function(inst) 
        inst.SoundEmitter:PlaySound("dontstarve/creatures/monster/growl") 
    end),
    TimeEvent(20*FRAMES, function(inst) 
        inst.components.combat:DoAttack() 
    end),
},
```

## Global Events

Events defined at the stategraph level apply to all states unless overridden within a specific state.

## Related Components

- AnimState component
- SoundEmitter component
- Locomotor component 
