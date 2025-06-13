---
id: stategraph-system
title: State Graph System
sidebar_position: 5
---

# State Graph System

The State Graph System in Don't Starve Together manages entity behaviors through finite state machines. It controls animations, actions, and transitions between different states, providing a structured way to handle complex entity behaviors.

## What is a State Graph?

A state graph is a collection of states and transitions that define how an entity behaves in different situations. Each state represents a specific behavior or animation, and transitions define how the entity moves between states based on events or conditions.

## Basic Structure

```lua
-- Create a state graph
local states = {
    -- Define states
}

local events = {
    -- Define common events
}

local fn = function(inst)
    -- Initialize the state graph
    local sg = StateGraph("myentity")
    
    -- Add states
    for k, v in pairs(states) do
        sg:AddState(v)
    end
    
    -- Add events
    for k, v in pairs(events) do
        sg:AddEvent(v)
    end
    
    -- Set initial state
    sg:SetStartState("idle")
    
    -- Handle action overrides
    sg.actionhandlers = {
        -- Define action handlers
    }
    
    return sg
end

return StateGraph("myentity", fn)
```

## States

States are the building blocks of a state graph. Each state defines:

```lua
State {
    name = "idle",                    -- Unique state name
    tags = {"idle", "canrotate"},     -- Tags for state identification
    
    onenter = function(inst)          -- Called when entering the state
        inst.AnimState:PlayAnimation("idle_loop", true)
    end,
    
    onupdate = function(inst)         -- Called every frame while in this state
        -- Perform continuous logic
    end,
    
    onexit = function(inst)           -- Called when exiting the state
        -- Clean up
    end,
    
    timeline = {                      -- Timeline events at specific animation frames
        TimeEvent(10*FRAMES, function(inst)
            inst.SoundEmitter:PlaySound("sound/effect")
        end),
        TimeEvent(20*FRAMES, function(inst)
            inst.components.combat:DoAttack()
        end),
    },
    
    events = {                        -- Event handlers for state transitions
        EventHandler("attacked", function(inst)
            return "hit"  -- Transition to "hit" state
        end),
        EventHandler("animover", function(inst)
            if not inst.AnimState:IsLooping() then
                return "idle"  -- Return to idle when animation finishes
            end
        end),
    },
}
```

## Events

Events are triggers that can cause state transitions:

```lua
CommonEvents = {
    CommonHandlers.OnLocomote(true, false),  -- Walking events
    CommonHandlers.OnAttacked(),             -- Attack response
    CommonHandlers.OnDeath(),                -- Death handling
    EventHandler("doattack", function(inst)  -- Custom attack event
        return "attack"
    end),
}
```

## Action Handlers

Action handlers define how the state graph responds to player actions:

```lua
ActionHandler(ACTIONS.CHOP, function(inst)
    return "chop"  -- Go to chop state when CHOP action is performed
end),

ActionHandler(ACTIONS.PICKUP, function(inst)
    return "pickup"  -- Go to pickup state when PICKUP action is performed
end)
```

## Common State Graph Patterns

### Character State Graphs

Character state graphs typically include states for:

```lua
-- Locomotion states
State { name = "idle" }
State { name = "run" }
State { name = "walk" }

-- Action states
State { name = "eat" }
State { name = "chop" }
State { name = "mine" }

-- Reaction states
State { name = "hit" }  -- When damaged
State { name = "death" }
State { name = "electrocute" }

-- Special states
State { name = "transform" }
State { name = "teleport" }
```

### Creature State Graphs

Creature state graphs often include:

```lua
-- Locomotion
State { name = "idle" }
State { name = "walk" }

-- Combat
State { name = "attack" }
State { name = "hit" }
State { name = "death" }

-- Special behaviors
State { name = "sleep" }
State { name = "taunt" }
State { name = "spawn" }
```

## Using State Graphs

To assign a state graph to an entity:

```lua
function MakeMyEntity()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    
    -- Set the state graph
    inst:SetStateGraph("SGMyEntity")
    
    return inst
end
```

## Timeline Events

Timeline events trigger at specific animation frames:

```lua
timeline = {
    -- Play sound effect at frame 5
    TimeEvent(5*FRAMES, function(inst)
        inst.SoundEmitter:PlaySound("dontstarve/sound/hit")
    end),
    
    -- Apply damage at frame 15
    TimeEvent(15*FRAMES, function(inst)
        inst.components.combat:DoAttack()
    end),
    
    -- Spawn effect at frame 25
    TimeEvent(25*FRAMES, function(inst)
        SpawnPrefab("fx_impact").Transform:SetPosition(inst.Transform:GetWorldPosition())
    end),
}
```

## Best Practices

When working with state graphs:

1. **Keep States Focused**: Each state should handle a single behavior or animation
2. **Use Tags for State Identification**: Tags like "busy" or "attack" help identify entity state
3. **Handle Animation Events**: Use timeline events to synchronize effects with animations
4. **Clean Up in onexit**: Ensure any temporary effects or variables are properly reset
5. **Use Common Handlers**: Leverage CommonHandlers for standard behaviors
6. **Test State Transitions**: Ensure all states have proper transitions and don't get stuck 