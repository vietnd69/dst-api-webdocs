---
id: animation-integration
title: Animation Integration
sidebar_position: 7
---

# State Graph Animation Integration

One of the most powerful aspects of the State Graph system in Don't Starve Together is its seamless integration with the animation system. This integration allows developers to create responsive, fluid entity behaviors where gameplay mechanics, visual effects, and sound all work together in perfect harmony.

## Understanding Animation States

Animations in Don't Starve Together are managed through the `AnimState` component. When combined with the State Graph system, each state typically corresponds to one or more animations that represent the visual aspect of that state.

```lua
State{
    name = "idle",
    tags = {"idle", "canrotate"},
    
    onenter = function(inst)
        -- Play an animation when entering this state
        inst.AnimState:PlayAnimation("idle_loop", true)
    end,
}
```

## Animation Playback Methods

The AnimState component provides several methods for playing animations:

```lua
-- Play a single animation (looping optional)
inst.AnimState:PlayAnimation("walk", true)  -- true means loop

-- Queue animations to play in sequence
inst.AnimState:PlayAnimation("attack_pre")
inst.AnimState:PushAnimation("attack_loop", true)  -- will play after attack_pre
inst.AnimState:PushAnimation("attack_pst", false)  -- will play after attack_loop stops

-- Blend between animations for smooth transitions
inst.AnimState:SetTime(0.5)  -- Set time position in the current animation
```

## Animation-Driven State Transitions

One of the most common patterns in stategraphs is to transition to a new state when an animation completes. This is achieved using the `animover` and `animqueueover` events:

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

-- For queued animations, use animqueueover
State{
    name = "elaborate_action",
    tags = {"busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("action_pre")
        inst.AnimState:PushAnimation("action_loop", false)
        inst.AnimState:PushAnimation("action_pst", false)
    end,
    
    events = {
        -- This triggers when all queued animations finish
        EventHandler("animqueueover", function(inst)
            inst.sg:GoToState("idle")
        end),
    },
}
```

## Timeline Events and Animation Frames

The State Graph system provides a powerful way to synchronize code execution with specific animation frames using timeline events. This is crucial for making sure that gameplay mechanics, visual effects, and sounds happen at exactly the right moment in an animation.

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
        
        -- Recovery phase
        TimeEvent(20*FRAMES, function(inst) 
            -- After attack is complete, we can be interrupted
            inst.sg:RemoveStateTag("busy")
        end),
    },
}
```

The `FRAMES` constant represents 1/30 of a second, which is the frame rate of animations in Don't Starve Together. Using `TimeEvent(10*FRAMES, ...)` means "run this function 10 frames (1/3 of a second) after entering the state."

## Multi-Stage Animations

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
        -- How many times to repeat the attack
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

## Animation Blending for Smooth Transitions

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

## Handling Animation Banks and Builds

For entities that can change their appearance, you might need to adjust animation banks and builds in your stategraph:

```lua
State{
    name = "transform",
    tags = {"busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("transform")
    end,
    
    timeline = {
        TimeEvent(15*FRAMES, function(inst)
            -- Midway through the transform animation, change appearance
            inst.AnimState:SetBuild("spider_warrior")
            inst.AnimState:SetBank("spider_warrior")
            
            -- Visual effect at transformation point
            SpawnPrefab("statue_transition").Transform:SetPosition(inst.Transform:GetWorldPosition())
        end),
    },
    
    events = {
        EventHandler("animover", function(inst)
            inst.sg:GoToState("idle")
        end),
    },
}
```

## Syncing Animations with Sound

Sound effects should be precisely timed with animations for maximum impact:

```lua
State{
    name = "walk",
    tags = {"moving", "canrotate"},
    
    onenter = function(inst)
        inst.components.locomotor:WalkForward()
        inst.AnimState:PlayAnimation("walk_loop", true)
    end,
    
    -- Footstep sounds precisely timed to when feet hit the ground
    timeline = {
        TimeEvent(5*FRAMES, function(inst)
            inst.SoundEmitter:PlaySound("dontstarve/movement/run_dirt")
        end),
        TimeEvent(15*FRAMES, function(inst)
            inst.SoundEmitter:PlaySound("dontstarve/movement/run_dirt")
        end),
    },
}
```

## Working with Animation Events

Some animations have built-in events that you can respond to:

```lua
onenter = function(inst)
    inst.AnimState:PlayAnimation("attack")
    -- Listen for a specific animation event
    inst:ListenForEvent("attack_start", function()
        inst.SoundEmitter:PlaySound("dontstarve/creatures/spitter/spit")
    end)
end,
```

## Best Practices for Animation Integration

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

6. **Leverage animation blending for smooth transitions**  
   Use techniques like animation rates, crossfades, and transition states.

7. **Document animation frame numbers**  
   Add comments to indicate which frame numbers correspond to important events in the animation.

## Animation Debugging Tips

When working with stategraphs and animations, these debugging techniques can be helpful:

```lua
-- Print the current animation name and frame
print("Current animation:", inst.AnimState:GetCurrentAnimationName())
print("Current time:", inst.AnimState:GetCurrentAnimationTime())

-- Slow down animations to see exact timing
inst.AnimState:SetRate(0.25)  -- Quarter speed

-- Force immediate transition to a specific animation frame
inst.AnimState:SetTime(0.5)   -- Jump to middle of animation
```

## Conclusion

The integration between State Graphs and animations is what gives Don't Starve Together entities their fluid, responsive feel. By carefully synchronizing code execution with animation frames, you can create entities that not only look good but also have gameplay mechanics that feel perfectly timed and satisfying to interact with.

When creating your own entities, invest time in getting this synchronization right, as it's one of the most noticeable aspects of quality implementation. 