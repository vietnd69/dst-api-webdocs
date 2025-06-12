---
id: examples
title: Stategraph Examples
sidebar_position: 6
---

# Stategraph Examples

This page provides practical examples of stategraphs for different types of entities in Don't Starve Together. These examples demonstrate how to implement various behaviors and can serve as a starting point for your own creations.

## Basic Creature Stategraph

This example shows a simple creature with basic movement, attacking, and taking damage:

```lua
require("stategraphs/commonstates")

local states = {
    -- Basic states from CommonStates
    CommonStates.AddIdle(),
    CommonStates.AddWalk(),
    CommonStates.AddRun(),
    CommonStates.AddFrozen(),
    CommonStates.AddHitState(),
    CommonStates.AddDeathState(),
    
    -- Custom attack state
    State{
        name = "attack",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("attack")
            inst.SoundEmitter:PlaySound("dontstarve/creatures/spider/attack")
        end,
        
        timeline = {
            TimeEvent(10*FRAMES, function(inst) 
                inst.components.combat:DoAttack()
                inst.SoundEmitter:PlaySound("dontstarve/creatures/spider/attackimpact")
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
    -- Standard event handlers
    CommonHandlers.OnLocomote(true, true),
    CommonHandlers.OnAttack(),
    CommonHandlers.OnAttacked(),
    CommonHandlers.OnDeath(),
    CommonHandlers.OnFreeze(),
    
    -- Custom event for special behavior
    EventHandler("special", function(inst)
        if not inst.components.health:IsDead() then
            inst.sg:GoToState("special_ability")
        end
    end),
}

local actionhandlers = {
    ActionHandler(ACTIONS.EAT, function(inst, action)
        if not inst.components.health:IsDead() then
            inst.sg:GoToState("eat", action.target)
            return true
        end
        return false
    end),
}

return StateGraph("mycreature", states, events, "idle", actionhandlers)
```

## Player-Like Entity

This example shows a stategraph for an entity that has player-like behaviors:

```lua
require("stategraphs/commonstates")

local states = {
    -- Basic movement states
    State{
        name = "idle",
        tags = {"idle", "canrotate"},
        
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("idle_loop", true)
        end,
    },
    
    State{
        name = "walk_start",
        tags = {"moving", "canrotate"},
        
        onenter = function(inst)
            inst.components.locomotor:WalkForward()
            inst.AnimState:PlayAnimation("walk_pre")
        end,
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("walk")
            end),
        },
    },
    
    State{
        name = "walk",
        tags = {"moving", "canrotate"},
        
        onenter = function(inst)
            inst.components.locomotor:WalkForward()
            inst.AnimState:PlayAnimation("walk_loop", true)
        end,
        
        timeline = {
            TimeEvent(5*FRAMES, function(inst)
                inst.SoundEmitter:PlaySound("dontstarve/movement/walk_dirt")
            end),
            TimeEvent(15*FRAMES, function(inst)
                inst.SoundEmitter:PlaySound("dontstarve/movement/walk_dirt")
            end),
        },
    },
    
    State{
        name = "walk_stop",
        tags = {"canrotate"},
        
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("walk_pst")
        end,
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
    
    -- Tool usage states
    State{
        name = "chop",
        tags = {"busy", "chopping"},
        
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("chop_pre")
            inst.AnimState:PushAnimation("chop_loop", false)
            inst.AnimState:PushAnimation("chop_pst", false)
        end,
        
        timeline = {
            TimeEvent(13*FRAMES, function(inst)
                inst:PerformBufferedAction()
                inst.SoundEmitter:PlaySound("dontstarve/wilson/use_axe_tree")
            end),
        },
        
        events = {
            EventHandler("animqueueover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
}

local events = {
    EventHandler("locomote", function(inst)
        local is_moving = inst.sg:HasStateTag("moving")
        local wants_to_move = inst.components.locomotor:WantsToMoveForward()
        
        if is_moving and not wants_to_move then
            inst.sg:GoToState("walk_stop")
        elseif not is_moving and wants_to_move then
            inst.sg:GoToState("walk_start")
        end
    end),
    
    EventHandler("attacked", function(inst, data)
        if not inst.components.health:IsDead() then
            inst.sg:GoToState("hit")
        end
    end),
    
    EventHandler("death", function(inst)
        inst.sg:GoToState("death")
    end),
}

local actionhandlers = {
    ActionHandler(ACTIONS.CHOP, function(inst, action)
        if not inst.sg:HasStateTag("busy") then
            inst.sg:GoToState("chop")
            return true
        end
        return false
    end),
    
    ActionHandler(ACTIONS.MINE, function(inst, action)
        if not inst.sg:HasStateTag("busy") then
            inst.sg:GoToState("mine")
            return true
        end
        return false
    end),
}

return StateGraph("mycharacter", states, events, "idle", actionhandlers)
```

## Static Structure with Animation

This example shows a stategraph for a static structure that has different visual states:

```lua
local states = {
    State{
        name = "idle",
        tags = {"idle"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle")
        end,
    },
    
    State{
        name = "open",
        tags = {"busy"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("open")
            inst.SoundEmitter:PlaySound("dontstarve/common/chest_open")
        end,
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("open_idle")
            end),
        },
    },
    
    State{
        name = "open_idle",
        tags = {"idle", "open"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("open_idle")
        end,
    },
    
    State{
        name = "close",
        tags = {"busy"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("close")
            inst.SoundEmitter:PlaySound("dontstarve/common/chest_close")
        end,
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
}

local events = {
    EventHandler("open", function(inst)
        if not inst.sg:HasStateTag("open") then
            inst.sg:GoToState("open")
        end
    end),
    
    EventHandler("close", function(inst)
        if inst.sg:HasStateTag("open") then
            inst.sg:GoToState("close")
        end
    end),
}

return StateGraph("mystructure", states, events, "idle")
```

## Boss Monster with Phases

This example shows a stategraph for a boss monster with different combat phases:

```lua
require("stategraphs/commonstates")

local phases = {
    NORMAL = 1,
    ENRAGED = 2,
    DEFENSIVE = 3,
}

local states = {
    -- Basic states
    CommonStates.AddIdle(),
    CommonStates.AddWalk(),
    CommonStates.AddFrozen(),
    
    -- Phase transition states
    State{
        name = "phase_transition",
        tags = {"busy", "noattack", "canmove"},
        
        onenter = function(inst, data)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("transform")
            
            if data and data.phase then
                inst.sg.statemem.next_phase = data.phase
            else
                inst.sg.statemem.next_phase = phases.ENRAGED
            end
            
            inst.SoundEmitter:PlaySound("dontstarve/creatures/boss/transform")
        end,
        
        timeline = {
            TimeEvent(15*FRAMES, function(inst)
                local fx = SpawnPrefab("statue_transition")
                fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
            end),
            
            TimeEvent(30*FRAMES, function(inst)
                inst.current_phase = inst.sg.statemem.next_phase
                if inst.current_phase == phases.ENRAGED then
                    inst.components.combat.damagemultiplier = 2
                    inst.components.locomotor.walkspeed = inst.components.locomotor.walkspeed * 1.5
                elseif inst.current_phase == phases.DEFENSIVE then
                    inst.components.health:SetAbsorptionAmount(0.5)
                    inst.components.combat.damagemultiplier = 0.75
                end
            end),
        },
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
    
    -- Combat states specific to each phase
    State{
        name = "attack_normal",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("attack1")
        end,
        
        timeline = {
            TimeEvent(20*FRAMES, function(inst)
                inst.components.combat:DoAttack()
                inst.SoundEmitter:PlaySound("dontstarve/creatures/boss/attack")
            end),
        },
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
    
    State{
        name = "attack_enraged",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("attack2")
        end,
        
        timeline = {
            TimeEvent(15*FRAMES, function(inst)
                inst.components.combat:DoAttack()
                inst.SoundEmitter:PlaySound("dontstarve/creatures/boss/attack_enraged")
            end),
            TimeEvent(25*FRAMES, function(inst)
                inst.components.combat:DoAttack()
            end),
            TimeEvent(35*FRAMES, function(inst)
                inst.components.combat:DoAttack()
            end),
        },
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
    
    State{
        name = "attack_defensive",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("attack3")
            inst.SoundEmitter:PlaySound("dontstarve/creatures/boss/attack_defensive_pre")
        end,
        
        timeline = {
            TimeEvent(10*FRAMES, function(inst)
                SpawnPrefab("groundpound_fx").Transform:SetPosition(inst.Transform:GetWorldPosition())
                inst.components.groundpounder:GroundPound()
                inst.SoundEmitter:PlaySound("dontstarve/creatures/boss/groundpound")
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
    CommonHandlers.OnLocomote(true, false),
    CommonHandlers.OnFreeze(),
    
    EventHandler("doattack", function(inst, data)
        if not inst.components.health:IsDead() then
            if inst.current_phase == phases.NORMAL then
                inst.sg:GoToState("attack_normal")
            elseif inst.current_phase == phases.ENRAGED then
                inst.sg:GoToState("attack_enraged")
            elseif inst.current_phase == phases.DEFENSIVE then
                inst.sg:GoToState("attack_defensive")
            end
        end
    end),
    
    EventHandler("attacked", function(inst, data)
        if not inst.components.health:IsDead() and not inst.sg:HasStateTag("busy") then
            inst.sg:GoToState("hit")
        end
    end),
    
    EventHandler("death", function(inst)
        inst.sg:GoToState("death")
    end),
    
    EventHandler("phasechange", function(inst, data)
        if not inst.sg:HasStateTag("busy") then
            inst.sg:GoToState("phase_transition", data)
        end
    end),
}

return StateGraph("bossentity", states, events, "idle")
```

These examples demonstrate how to implement different types of entities with stategraphs. You can use them as a starting point and customize them to fit your specific needs. 