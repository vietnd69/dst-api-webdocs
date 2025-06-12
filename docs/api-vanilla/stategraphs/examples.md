---
id: examples
title: Stategraph Examples
sidebar_position: 6
---

# Stategraph Examples

This page provides practical examples of stategraphs for different types of entities in Don't Starve Together. These examples demonstrate how to implement various behaviors and can serve as a starting point for your own creations.

## Animation-Driven Creature Example

This example demonstrates a complete stategraph for a custom creature with proper animation integration. It shows how to synchronize animations, sounds, and gameplay mechanics through the stategraph system:

```lua
-- Require common states to reuse standard behaviors
require("stategraphs/commonstates")

-- Define the state graph for our custom creature
local function CreateCustomCreatureStateGraph()
    local states = {
        -- Idle state - the default state when not doing anything else
        State{
            name = "idle",
            tags = {"idle", "canrotate"},
            
            -- Called when entering this state
            onenter = function(inst)
                -- Play the idle animation - loop it since we might stay idle for a while
                inst.AnimState:PlayAnimation("idle_loop", true)
                -- Stop any movement
                inst.components.locomotor:StopMoving()
            end,
        },

        -- Alert state - when the creature notices a target
        State{
            name = "alert",
            tags = {"idle", "alert", "canrotate"},
            
            onenter = function(inst)
                -- Play a one-shot alert animation
                inst.AnimState:PlayAnimation("alert")
                inst.components.locomotor:StopMoving()
                -- Play an alert sound
                inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/alert")
            end,
            
            -- Called every frame while in this state
            onupdate = function(inst)
                -- If we have a target, face towards it
                if inst.components.combat.target then
                    inst:FacePoint(inst.components.combat.target.Transform:GetWorldPosition())
                end
            end,
            
            -- Events that can happen during this state
            events = {
                -- When the alert animation finishes
                EventHandler("animover", function(inst)
                    -- Check if we have a combat target
                    if inst.components.combat.target then
                        -- If target is too far, chase it
                        local target = inst.components.combat.target
                        local dist = inst:GetDistanceSqToInst(target)
                        
                        if dist > inst.components.combat.attackrange * inst.components.combat.attackrange then
                            inst.sg:GoToState("chase", target)
                        else
                            -- If target is close enough, attack it
                            inst.sg:GoToState("attack", target)
                        end
                    else
                        -- No target, go back to idle
                        inst.sg:GoToState("idle")
                    end
                end),
            },
        },
        
        -- Chase state - when pursuing a target
        State{
            name = "chase",
            tags = {"moving", "running", "canrotate"},
            
            onenter = function(inst, target)
                -- Store target in state memory for reference in other functions
                inst.sg.statemem.target = target
                -- Play run animation (looping)
                inst.AnimState:PlayAnimation("run_loop", true)
                -- Set running speed
                inst.components.locomotor:RunForward()
                -- Play chase sound
                inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/chase_LP", "chase")
            end,
            
            -- Called every frame to update chase behavior
            onupdate = function(inst, dt)
                local target = inst.sg.statemem.target
                if target and target:IsValid() then
                    -- Update chase destination to follow target
                    inst:FacePoint(target.Transform:GetWorldPosition())
                    inst.components.locomotor:GoToPoint(target:GetPosition())
                    
                    -- Check if we're close enough to attack
                    local dist = inst:GetDistanceSqToInst(target)
                    if dist <= inst.components.combat.attackrange * inst.components.combat.attackrange then
                        inst.sg:GoToState("attack", target)
                    end
                else
                    -- Lost target, return to idle
                    inst.sg:GoToState("idle")
                end
            end,
            
            -- When exiting chase state, stop sound effects
            onexit = function(inst)
                inst.SoundEmitter:KillSound("chase")
            end,
            
            -- Add footstep sounds synchronized with animation
            timeline = {
                TimeEvent(5*FRAMES, function(inst) 
                    inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/footstep")
                end),
                TimeEvent(15*FRAMES, function(inst) 
                    inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/footstep")
                end),
            },
        },
        
        -- Attack state - when hitting a target
        State{
            name = "attack",
            tags = {"attack", "busy"},
            
            onenter = function(inst, target)
                -- Store target for reference
                inst.sg.statemem.target = target
                -- Stop movement during attack
                inst.components.locomotor:StopMoving()
                -- Play attack animation (non-looping)
                inst.AnimState:PlayAnimation("attack")
                -- Face target
                if target then
                    inst:FacePoint(target.Transform:GetWorldPosition())
                end
                -- Track whether we've already done damage in this attack
                inst.sg.statemem.damage_done = false
            end,
            
            -- Timeline coordinates effects with the animation
            timeline = {
                -- Wind-up sound at the start of the attack
                TimeEvent(0*FRAMES, function(inst) 
                    inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/attack_pre")
                end),
                
                -- Attack sound at the impact frame
                TimeEvent(10*FRAMES, function(inst) 
                    inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/attack")
                end),
                
                -- Actual attack damage happens exactly at the correct animation frame
                TimeEvent(12*FRAMES, function(inst)
                    if not inst.sg.statemem.damage_done then
                        inst.components.combat:DoAttack(inst.sg.statemem.target)
                        inst.sg.statemem.damage_done = true
                    end
                end),
                
                -- Attack recovery phase
                TimeEvent(20*FRAMES, function(inst) 
                    -- After this time, we can be interrupted
                    inst.sg:RemoveStateTag("busy")
                end),
            },
            
            -- When attack animation is complete
            events = {
                EventHandler("animover", function(inst)
                    -- 50% chance to attack again if target is still in range
                    if inst.sg.statemem.target and 
                       inst.sg.statemem.target:IsValid() and
                       inst:GetDistanceSqToInst(inst.sg.statemem.target) <= inst.components.combat.attackrange * inst.components.combat.attackrange and
                       math.random() < 0.5 then
                        inst.sg:GoToState("attack", inst.sg.statemem.target)
                    else
                        -- Return to alert stance after attack
                        inst.sg:GoToState("alert")
                    end
                end),
            },
        },
        
        -- Hit reaction - when taking damage
        State{
            name = "hit",
            tags = {"hit", "busy"},
            
            onenter = function(inst)
                inst.AnimState:PlayAnimation("hit")
                inst.components.locomotor:StopMoving()
                -- Knockback effect
                inst.Physics:SetMotorVelOverride(-6, 0, 0)
                inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/hurt")
            end,
            
            -- Clear knockback effect after a short time
            timeline = {
                TimeEvent(5*FRAMES, function(inst)
                    inst.Physics:ClearMotorVelOverride()
                end),
                TimeEvent(15*FRAMES, function(inst)
                    -- No longer busy after recovery time
                    inst.sg:RemoveStateTag("busy")
                end),
            },
            
            events = {
                EventHandler("animover", function(inst)
                    -- If health is critical, flee
                    if inst.components.health:GetPercent() < 0.25 then
                        inst.sg:GoToState("flee")
                    -- Otherwise, if we have a target, return to alert
                    elseif inst.components.combat.target then
                        inst.sg:GoToState("alert")
                    else
                        inst.sg:GoToState("idle")
                    end
                end),
            },
        },
        
        -- Flee state - run away when badly hurt
        State{
            name = "flee",
            tags = {"moving", "running", "busy", "fleeing"},
            
            onenter = function(inst)
                inst.AnimState:PlayAnimation("run_loop", true)
                inst.components.locomotor:RunForward()
                inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/flee", "flee")
                
                -- Store flee duration
                inst.sg.statemem.flee_time = 5 + math.random() * 3
                inst.sg.statemem.stop_time = GetTime() + inst.sg.statemem.flee_time
                
                -- Try to flee away from threat
                if inst.components.combat.target then
                    local target = inst.components.combat.target
                    local pos = target:GetPosition()
                    local angle = math.random() * 2 * PI
                    
                    -- Find a point away from the threat
                    local offset = FindWalkableOffset(pos, angle, 15, 10)
                    if offset then
                        inst.components.locomotor:GoToPoint(pos + offset)
                    else
                        -- If can't find offset, just run randomly
                        inst:PushEvent("locomote")
                    end
                else
                    -- If no specific threat, just run randomly
                    inst:PushEvent("locomote")
                end
            end,
            
            onupdate = function(inst)
                -- Check if flee time is over
                if GetTime() >= inst.sg.statemem.stop_time then
                    inst.sg:GoToState("idle")
                    return
                end
                
                -- Continue fleeing away from threat
                if inst.components.combat.target then
                    local target_pos = inst.components.combat.target:GetPosition()
                    local my_pos = inst:GetPosition()
                    local dir = my_pos - target_pos
                    
                    if dir:LengthSq() > 0 then
                        dir:Normalize()
                        local flee_pos = my_pos + dir * 10
                        inst.components.locomotor:GoToPoint(flee_pos)
                    end
                end
            end,
            
            onexit = function(inst)
                inst.SoundEmitter:KillSound("flee")
            end,
            
            timeline = {
                TimeEvent(5*FRAMES, function(inst) 
                    inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/footstep")
                end),
                TimeEvent(15*FRAMES, function(inst) 
                    inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/footstep")
                end),
            },
        },
        
        -- Death state
        State{
            name = "death",
            tags = {"busy", "dead"},
            
            onenter = function(inst)
                inst.AnimState:PlayAnimation("death")
                inst.components.locomotor:StopMoving()
                inst.Physics:ClearCollisionMask()
                inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/death")
                -- Drop loot
                inst.components.lootdropper:DropLoot(inst:GetPosition())
            end,
            
            timeline = {
                -- Spawn particles at key moments of death animation
                TimeEvent(5*FRAMES, function(inst)
                    SpawnPrefab("small_puff").Transform:SetPosition(inst.Transform:GetWorldPosition())
                end),
                TimeEvent(20*FRAMES, function(inst)
                    SpawnPrefab("small_puff").Transform:SetPosition(inst.Transform:GetWorldPosition())
                end),
            },
        },
    }

    local events = {
        -- Standard locomotion event handler
        EventHandler("locomote", function(inst)
            local is_moving = inst.sg:HasStateTag("moving")
            local wants_to_move = inst.components.locomotor:WantsToMoveForward()
            
            -- Don't interrupt certain states
            if inst.sg:HasStateTag("busy") and not inst.sg:HasStateTag("fleeing") then
                return
            end
            
            -- Transition between idle and moving states
            if is_moving and not wants_to_move then
                inst.sg:GoToState("idle")
            elseif not is_moving and wants_to_move then
                inst.sg:GoToState("chase")
            end
        end),
        
        -- Event when a new target is acquired
        EventHandler("newcombattarget", function(inst, data)
            -- Only react if we're idle and not already busy
            if not inst.sg:HasStateTag("busy") and inst.sg:HasStateTag("idle") then
                inst.sg:GoToState("alert")
            end
        end),
        
        -- Event when taking damage
        EventHandler("attacked", function(inst, data)
            if not inst.components.health:IsDead() and not inst.sg:HasStateTag("attack") then
                inst.sg:GoToState("hit")
            end
        end),
        
        -- Event when killed
        EventHandler("death", function(inst)
            inst.sg:GoToState("death")
        end),
    }

    -- Create and return the StateGraph
    return StateGraph("custom_creature", states, events, "idle")
end

return CreateCustomCreatureStateGraph
```

This example demonstrates several important aspects of animation-driven stategraphs:

1. **State-based animation control**: Each state plays specific animations that reflect the entity's behavior.
2. **Animation-driven transitions**: Using the `animover` event to transition between states when animations complete.
3. **Timeline synchronization**: Using `TimeEvent` to synchronize gameplay actions with specific animation frames.
4. **Sound effect integration**: Playing sounds at the right moments in the animation.
5. **State memory**: Using `statemem` to store data that persists during a state.
6. **Tag-based state querying**: Using tags like "busy" to control which states can be interrupted.

When building your own creature stategraphs, follow these steps:

1. **Plan your animation set**: Determine what animations you need (idle, walk, attack, hit, death, etc.)
2. **Create states for each animation**: Make sure each animation has a corresponding state
3. **Define state transitions**: Determine what causes transitions between states
4. **Synchronize game mechanics**: Use timeline events to trigger mechanics at the correct animation frames
5. **Add sound effects**: Place sound effects at appropriate points in the animation
6. **Test thoroughly**: Check all possible state transitions and edge cases

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