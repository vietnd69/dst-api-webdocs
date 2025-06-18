---
id: stategraph
title: Stategraph
sidebar_position: 6
last_updated: 2023-07-06
version: 624447
---
*Last Update: 2023-07-06*
# Stategraph

*API Version: 624447*

Stategraphs control entity animations, sounds, and state-based behaviors in Don't Starve Together. They provide a framework for defining states and transitions between them.

## Stategraph properties and methods

Stategraph provides the following key properties and methods:

- **Properties**
  - `states` - Collection of defined states with their behaviors
  - `events` - Collection of global event handlers
  - `defaultstate` - State the stategraph starts in
  - `currentstate` - The state the stategraph is currently in

- **Methods**
  - `GoToState()` - Transitions to a specified state
  - `HasStateTag()` - Checks if the current state has a specific tag
  - `AddStateTag()` - Adds a tag to the current state
  - `RemoveStateTag()` - Removes a tag from the current state

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

## Methods

### GoToState(statename: `string`, params: `table`): `void`

Transitions the stategraph to the specified state, optionally passing parameters.

```lua
-- Transition to a different state
inst.sg:GoToState("attack")

-- Transition with parameters
inst.sg:GoToState("attack", {target = enemy})
```

---

### HasStateTag(tag: `string`): `boolean`

Checks if the current state has the specified tag.

```lua
-- Check if the current state has a specific tag
if inst.sg:HasStateTag("busy") then
    -- Entity is busy, can't perform actions
    return false
end
```

---

### AddStateTag(tag: `string`): `void`

Adds a tag to the current state.

```lua
-- Add a tag to the current state
inst.sg:AddStateTag("busy")
```

---

### RemoveStateTag(tag: `string`): `void`

Removes a tag from the current state.

```lua
-- Remove a tag from the current state
inst.sg:RemoveStateTag("busy")
```

---

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

## See also

- [Entity](mdc:dst-api-webdocs/docs/api-vanilla/node-types/entity.md) - Entity that stategraphs control
- [AnimState](mdc:dst-api-webdocs/docs/api-vanilla/components/animstate.md) - Animation component used by stategraphs
- [Component](mdc:dst-api-webdocs/docs/api-vanilla/node-types/component.md) - Components that interact with stategraphs 
