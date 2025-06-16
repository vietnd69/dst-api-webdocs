---
id: custom-stategraphs-and-animations
title: Custom Stategraphs and Animations
sidebar_position: 5
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Custom Stategraphs and Animations

This guide covers how to create custom stategraphs and animations for your Don't Starve Together mods. Stategraphs are a powerful state machine system that controls entity behavior, animations, and interactions, while animations provide the visual representation of those behaviors.

## Understanding Stategraphs

Stategraphs are finite state machines that control how entities behave and transition between different states. They provide a structured way to organize complex behaviors and ensure that animations, sound effects, and gameplay mechanics are properly synchronized.

### Core Components of Stategraphs

A stategraph consists of several key components:

1. **States**: Defined behaviors that an entity can be in (e.g., idle, walking, attacking)
2. **Events**: Triggers that cause state transitions (e.g., receiving damage, reaching a target)
3. **Transitions**: Rules for moving between states in response to events
4. **ActionHandlers**: Special handlers for gameplay actions initiated by the player or AI
5. **Timeline Events**: Functions triggered at specific frames during animations

### Basic Stategraph Structure

Here's the basic structure of a stategraph:

```lua
local states = {
    -- Define states here
    State{
        name = "idle",
        tags = {"idle", "canrotate"},
        onenter = function(inst) -- Called when entering this state
            inst.AnimState:PlayAnimation("idle_loop", true)
        end,
        onexit = function(inst) -- Called when exiting this state
            -- Cleanup code here
        end,
        events = {
            -- Define event handlers for this state
            EventHandler("animover", function(inst)
                -- Transition to another state when animation ends
            end),
        },
        timeline = {
            -- Functions to call at specific animation frames
            TimeEvent(10*FRAMES, function(inst)
                -- Do something at frame 10
            end),
        },
    },
    -- More states...
}

local events = {
    -- Global event handlers that apply to all states
    EventHandler("attacked", function(inst)
        if not inst.sg:HasStateTag("busy") then
            inst.sg:GoToState("hit")
        end
    end),
    -- More event handlers...
}

local actionhandlers = {
    -- Handlers for player actions
    ActionHandler(ACTIONS.CHOP, function(inst)
        inst.sg:GoToState("chop")
        return true
    end),
    -- More action handlers...
}

-- Create and return the stategraph
return StateGraph("entity_name", states, events, "idle", actionhandlers)
```

## Creating Custom Animations

Before integrating animations with stategraphs, you need to create the animations themselves. Don't Starve Together uses a specific animation format that requires several steps to create.

### Animation Pipeline Overview

1. **Create Artwork**: Design your character/entity's artwork, separating different parts that need to move independently
2. **Rig and Animate**: Use animation software to rig and animate your character
3. **Export Animations**: Export as sprite sheets or individual frames
4. **Create Build and Bank Files**: Convert your animations into DST's format using Spriter or other tools
5. **Load Animations in Game**: Reference your animations in your mod code

### Animation File Structure

Don't Starve Together uses two main file types for animations:

- **Build Files (.zip)**: Contains the actual artwork/textures
- **Bank Files (.bin)**: Contains the animation data (bone structure, keyframes, etc.)

Both files should have the same name for the game to associate them correctly.

### Setting Up Animations in Code

To use your animations in-game:

```lua
-- In your prefab file
function MyEntity()
    local inst = CreateEntity()
    
    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    
    -- Set up animations
    inst.AnimState:SetBank("my_entity") -- References my_entity.bin
    inst.AnimState:SetBuild("my_entity") -- References my_entity.zip
    inst.AnimState:PlayAnimation("idle")
    
    return inst
end
```

## Integrating Animations with Stategraphs

The power of stategraphs comes from their tight integration with the animation system. This allows you to synchronize code execution with specific animation frames.

### Animation Playback Methods

```lua
-- Play a single animation (looping optional)
inst.AnimState:PlayAnimation("walk", true)  -- true means loop

-- Queue animations to play in sequence
inst.AnimState:PlayAnimation("attack_pre")
inst.AnimState:PushAnimation("attack_loop", true)  -- will play after attack_pre
inst.AnimState:PushAnimation("attack_pst", false)  -- will play after attack_loop stops
```

### Animation-Driven State Transitions

One of the most common patterns is to transition to a new state when an animation completes:

```lua
State{
    name = "attack",
    tags = {"attack", "busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("attack")
    end,
    
    events = {
        -- Transition to idle when the animation finishes
        EventHandler("animover", function(inst)
            inst.sg:GoToState("idle")
        end),
    },
}
```

### Timeline Events and Animation Frames

Timeline events allow you to execute code at specific frames during an animation:

```lua
State{
    name = "attack",
    tags = {"attack", "busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("attack")
    end,
    
    timeline = {
        -- Wind-up sound at the start of the attack
        TimeEvent(0*FRAMES, function(inst) 
            inst.SoundEmitter:PlaySound("dontstarve/creatures/spider/attack_growl")
        end),
        
        -- Actual attack damage happens at a specific frame
        TimeEvent(10*FRAMES, function(inst) 
            -- This is timed to match exactly when the attack animation shows impact
            inst.components.combat:DoAttack()
            -- Impact sound precisely when the attack lands
            inst.SoundEmitter:PlaySound("dontstarve/creatures/spider/attack_impact")
        end),
    },
}
```

The `FRAMES` constant represents 1/30 of a second, which is the frame rate of animations in Don't Starve Together.

## Complete Example: Custom Creature with Stategraph and Animations

Let's create a complete example of a custom creature with its own stategraph and animations:

```lua
-- In modmain.lua
PrefabFiles = {
    "custom_creature",
}

Assets = {
    Asset("ANIM", "anim/custom_creature.zip"),
    Asset("ANIM", "anim/custom_creature_build.zip"),
}

-- In scripts/prefabs/custom_creature.lua
local assets = {
    Asset("ANIM", "anim/custom_creature.zip"),
    Asset("ANIM", "anim/custom_creature_build.zip"),
}

local function fn()
    local inst = CreateEntity()
    
    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    -- Set up physics
    MakeCharacterPhysics(inst, 50, .5)
    
    -- Set up animations
    inst.AnimState:SetBank("custom_creature")
    inst.AnimState:SetBuild("custom_creature_build")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add tags
    inst:AddTag("monster")
    inst:AddTag("hostile")
    
    -- Make the entity pristine for networking
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add components for behavior
    inst:AddComponent("locomotor")
    inst.components.locomotor.walkspeed = 4
    inst.components.locomotor.runspeed = 6
    
    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(20)
    inst.components.combat:SetAttackPeriod(2)
    inst.components.combat:SetRange(2)
    
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(200)
    
    inst:AddComponent("lootdropper")
    inst.components.lootdropper:AddRandomLoot("meat", 3)
    inst.components.lootdropper:AddRandomLoot("monster_meat", 1)
    
    -- Set up AI
    inst:AddComponent("knownlocations")
    
    inst:AddComponent("inspectable")
    
    -- Set up the stategraph
    inst:SetStateGraph("SGcustom_creature")
    
    -- Set up brain
    inst:SetBrain(require("brains/custom_creature_brain"))
    
    return inst
end

return Prefab("custom_creature", fn, assets)
```

Now, let's create the stategraph for our custom creature:

```lua
-- In scripts/stategraphs/SGcustom_creature.lua
require("stategraphs/commonstates")

local function CreateCustomCreatureStateGraph()
    local states = {
        -- Idle state
        State{
            name = "idle",
            tags = {"idle", "canrotate"},
            
            onenter = function(inst)
                inst.AnimState:PlayAnimation("idle", true)
                inst.Physics:Stop()
            end,
        },
        
        -- Walk state
        State{
            name = "walk",
            tags = {"moving", "canrotate"},
            
            onenter = function(inst)
                inst.AnimState:PlayAnimation("walk", true)
                inst.components.locomotor:WalkForward()
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
        
        -- Attack state
        State{
            name = "attack",
            tags = {"attack", "busy"},
            
            onenter = function(inst, target)
                inst.Physics:Stop()
                inst.AnimState:PlayAnimation("attack")
                inst.components.combat:StartAttack()
                inst.sg.statemem.target = target
            end,
            
            timeline = {
                TimeEvent(8*FRAMES, function(inst)
                    inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/attack_pre")
                end),
                TimeEvent(15*FRAMES, function(inst)
                    inst.components.combat:DoAttack(inst.sg.statemem.target)
                    inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/attack")
                end),
            },
            
            events = {
                EventHandler("animover", function(inst)
                    inst.sg:GoToState("idle")
                end),
            },
        },
        
        -- Hit reaction state
        State{
            name = "hit",
            tags = {"hit", "busy"},
            
            onenter = function(inst)
                inst.AnimState:PlayAnimation("hit")
                inst.Physics:Stop()
                inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/hurt")
            end,
            
            events = {
                EventHandler("animover", function(inst)
                    inst.sg:GoToState("idle")
                end),
            },
        },
        
        -- Death state
        State{
            name = "death",
            tags = {"busy"},
            
            onenter = function(inst)
                inst.AnimState:PlayAnimation("death")
                inst.Physics:Stop()
                inst.components.lootdropper:DropLoot(inst:GetPosition())
                inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/death")
            end,
            
            timeline = {
                TimeEvent(10*FRAMES, function(inst)
                    inst.SoundEmitter:PlaySound("dontstarve/creatures/custom_creature/death_voice")
                end),
            },
            
            events = {
                EventHandler("animover", function(inst)
                    inst:Remove()
                end),
            },
        },
    }

    local events = {
        -- Locomotion
        EventHandler("locomote", function(inst)
            if not inst.sg:HasStateTag("busy") then
                local is_moving = inst.sg:HasStateTag("moving")
                local wants_to_move = inst.components.locomotor:WantsToMoveForward()
                
                if is_moving and not wants_to_move then
                    inst.sg:GoToState("idle")
                elseif not is_moving and wants_to_move then
                    inst.sg:GoToState("walk")
                end
            end
        end),
        
        -- Combat
        EventHandler("doattack", function(inst, data)
            if not inst.components.health:IsDead() and not inst.sg:HasStateTag("busy") then
                inst.sg:GoToState("attack", data.target)
            end
        end),
        
        -- Taking damage
        EventHandler("attacked", function(inst)
            if not inst.components.health:IsDead() and not inst.sg:HasStateTag("busy") then
                inst.sg:GoToState("hit")
            end
        end),
        
        -- Death
        EventHandler("death", function(inst)
            inst.sg:GoToState("death")
        end),
    }

    return StateGraph("custom_creature", states, events, "idle")
end

return CreateCustomCreatureStateGraph()
```

## Advanced Animation Techniques

### Multi-Stage Animations

For complex animations, it's often cleaner to break them into multiple states:

```lua
-- Pre-attack windup
State{
    name = "attack_pre",
    tags = {"attack", "busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("attack_pre")
    end,
    
    events = {
        EventHandler("animover", function(inst)
            inst.sg:GoToState("attack_loop")
        end),
    },
},

-- Attack loop
State{
    name = "attack_loop",
    tags = {"attack", "busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("attack_loop")
        inst.sg.statemem.attack_count = 0
    end,
    
    timeline = {
        TimeEvent(10*FRAMES, function(inst)
            inst.components.combat:DoAttack()
            inst.sg.statemem.attack_count = inst.sg.statemem.attack_count + 1
        end),
    },
    
    events = {
        EventHandler("animover", function(inst)
            if inst.sg.statemem.attack_count >= 3 then
                inst.sg:GoToState("attack_pst")
            else
                inst.AnimState:PlayAnimation("attack_loop")
            end
        end),
    },
},

-- Post-attack recovery
State{
    name = "attack_pst",
    tags = {"busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("attack_pst")
    end,
    
    events = {
        EventHandler("animover", function(inst)
            inst.sg:GoToState("idle")
        end),
    },
},
```

### Animation Blending for Smooth Transitions

To create smoother transitions between states, you can use animation blending techniques:

```lua
-- Blend from walking to running
State{
    name = "walk_to_run",
    tags = {"moving", "running", "canrotate"},
    
    onenter = function(inst)
        -- Start with walk animation but at a higher speed
        inst.AnimState:PlayAnimation("walk_loop", true)
        inst.AnimState:SetRate(1.5)
        
        -- Increase movement speed gradually
        inst.components.locomotor:RunForward()
        
        -- Schedule a transition to the full run state
        inst.sg:SetTimeout(0.5)
    end,
    
    ontimeout = function(inst)
        inst.sg:GoToState("run")
    end,
}
```

### Animation Symbol Overrides

You can override specific parts of an animation to create variations:

```lua
-- Change the head symbol for a different appearance
inst.AnimState:OverrideSymbol("head", "custom_creature_heads", "head_variant2")

-- Restore the original symbol
inst.AnimState:ClearOverrideSymbol("head")
```

## Best Practices

1. **Match timeline events to animation keyframes**  
   Study your animations carefully and place timeline events at the exact frames where they make the most visual sense.

2. **Use state tags to control animation behavior**  
   Tags like "busy" can prevent interruptions during important animations.

3. **Break complex animations into multiple states**  
   For readability and maintainability, divide long sequences into pre/loop/post states.

4. **Test animations at different speeds**  
   Make sure your timeline events still make sense if animation rates change.

5. **Use statemem to store animation context**  
   The state memory table is ideal for tracking information across animation frames.

6. **Document animation frame numbers**  
   Add comments to indicate which frame numbers correspond to important events in the animation.

7. **Reuse common states when possible**  
   Use the `commonstates.lua` module to leverage pre-built states for standard behaviors.

## Conclusion

Creating custom stategraphs and animations is one of the most powerful ways to bring unique entities to life in Don't Starve Together. By mastering the integration between stategraphs and animations, you can create entities with fluid, responsive behaviors that feel right at home in the game world.

The key to successful animation-driven gameplay is careful synchronization between visual elements, sound effects, and gameplay mechanics. When done right, players won't even notice the complex state machine running behind the scenes—they'll just experience a cohesive, polished entity that responds naturally to the game world.
