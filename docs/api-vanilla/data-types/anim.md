---
id: anim
title: Anim
sidebar_position: 4
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Anim

*API Version: 619045*

Anim is a data type representing animation sequences in Don't Starve Together. It manages how entities animate visually, handling animation playback, blending, and transitions.

## Overview

In Don't Starve Together, animations are a core aspect of the game's visual presentation. The Anim data type and associated AnimState component work together to:

- Play character and entity animations
- Sequence multiple animations together
- Handle animation transitions and looping
- Control animation timing and playback rate
- Modify visual appearance through symbol overrides and color adjustments

Animations in DST are typically defined in animation banks (.zip files) that contain the animation data and build files that define the visual appearance.

## Properties

Animations have the following key properties:

| Property | Type | Description |
|----------|------|-------------|
| `animname` | String | The name of the animation (e.g., "idle", "walk_loop") |
| `loop` | Boolean | Whether the animation should loop continuously |
| `rate` | Number | Playback speed multiplier (default: 1.0) |
| `frame` | Number | Current frame of animation |
| `symbols` | Table | Collection of visual elements that make up the animation |

## Core Methods

### Playing and Queuing Animations

```lua
-- Play an animation immediately
AnimState:PlayAnimation(animname, loop)

-- Queue an animation to play after the current one completes
AnimState:PushAnimation(animname, loop)

-- Check if the current animation has finished playing
local isDone = AnimState:AnimDone()

-- Get the name of the currently playing animation
local currentAnim = AnimState:GetCurrentAnimationName()
```

### Animation Control

```lua
-- Set the animation playback rate (speed)
AnimState:SetRate(rate)  -- 1.0 is normal speed, 2.0 is double speed

-- Set the current time position within the animation
AnimState:SetTime(time)  -- Set to specific time in seconds
AnimState:SetFrame(frame)  -- Set to specific frame number

-- Pause and resume animation
AnimState:Pause()
AnimState:Resume()

-- Set animation blend mode
AnimState:SetBloomEffectHandle("shaders/anim.ksh")
```

### Symbol Manipulation

```lua
-- Override specific animation symbols
AnimState:OverrideSymbol(symbol, build, replacement_symbol)

-- Hide or show specific parts of an animation
AnimState:Hide(symbol)
AnimState:Show(symbol)

-- Clear a symbol override
AnimState:ClearOverrideSymbol(symbol)

-- Apply or remove symbol modifiers
AnimState:AddSymbolModifier(symbol, modifier)
AnimState:RemoveSymbolModifier(symbol, modifier)
```

### Visual Effects

```lua
-- Apply color tinting
AnimState:SetMultColour(r, g, b, a)  -- Values from 0-1

-- Apply additive color
AnimState:SetAddColour(r, g, b, a)  -- Values from 0-1

-- Reset colors to default
AnimState:SetMultColour(1, 1, 1, 1)
AnimState:SetAddColour(0, 0, 0, 0)

-- Apply scaling
AnimState:SetScale(x, y, z)

-- Set orientation and facing
AnimState:SetFacing(FACING_RIGHT)  -- or FACING_LEFT, etc.
AnimState:SetOrientation(ANIM_ORIENTATION.OnGround)
```

## Animation Setup

Before playing animations, you need to set the animation bank and build:

```lua
-- Set up animations for an entity
function SetupAnimations(inst, bank, build)
    inst.AnimState:SetBank(bank)
    inst.AnimState:SetBuild(build)
    inst.AnimState:PlayAnimation("idle")
end

-- Example usage
local function CreateItem()
    local inst = CreateEntity()
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    
    SetupAnimations(inst, "spear", "spear")
    
    return inst
end
```

## Integration with State Graphs

Animations typically integrate with the State Graph system to manage entity states and transitions:

```lua
local states = {
    State {
        name = "attack",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("attack")
        end,
        
        timeline = {
            -- Execute actions at specific animation frames
            TimeEvent(10*FRAMES, function(inst)
                inst.SoundEmitter:PlaySound("dontstarve/wilson/attack_weapon")
            end),
            
            TimeEvent(15*FRAMES, function(inst)
                inst.components.combat:DoAttack()
            end),
        },
        
        events = {
            -- Transition to idle state when animation completes
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    }
}
```

## Animation Events

Animations can trigger events that other systems can listen for:

```lua
-- Listen for animation completion
inst:ListenForEvent("animover", function(inst)
    print("Animation " .. inst.AnimState:GetCurrentAnimationName() .. " finished")
end)

-- Listen for specific animation frame events
inst:ListenForEvent("animtimeevent", function(inst, data)
    if data.animname == "attack" and data.timename == "attack_strike" then
        inst.components.combat:DoAttack()
    end
end)
```

## Common Animation Patterns

### Animation Sequences

```lua
-- Create a sequence of animations that play one after another
function PlayAttackSequence(inst)
    inst.AnimState:PlayAnimation("attack_pre")
    inst.AnimState:PushAnimation("attack_loop", true)
    
    inst:DoTaskInTime(1.0, function()
        inst.AnimState:PlayAnimation("attack_pst")
        inst.AnimState:PushAnimation("idle", true)
    end)
end
```

### Animation Transitions

```lua
-- Smoothly transition between states with appropriate animations
function TransitionToState(inst, new_state)
    if inst.current_state == "idle" and new_state == "walk" then
        inst.AnimState:PlayAnimation("idle_to_walk")
        inst.AnimState:PushAnimation("walk_loop", true)
    elseif inst.current_state == "walk" and new_state == "run" then
        inst.AnimState:PlayAnimation("walk_to_run")
        inst.AnimState:PushAnimation("run_loop", true)
    elseif inst.current_state == "walk" and new_state == "idle" then
        inst.AnimState:PlayAnimation("walk_to_idle")
        inst.AnimState:PushAnimation("idle_loop", true)
    end
    
    inst.current_state = new_state
end
```

## Animation Builds and Banks

Animation data is stored in two main file types:

1. **Animation Banks** (.zip): Define skeleton, frames, and keyframes
2. **Build Files** (.zip): Define the visual appearance, textures, and symbols

```lua
-- Setting up animations from specific banks and builds
inst.AnimState:SetBank("character_wilson")  -- Defines animation structure
inst.AnimState:SetBuild("wilson")  -- Defines visual appearance
```

## See also

- [AnimState Component](../core/animstate-system.md) - Core component for managing animations
- [State Graph System](../stategraphs/index.md) - System that works with animations for entity behavior
- [Timeline Events](../stategraphs/events.md) - Triggering events at specific animation frames
- [Common States](../stategraphs/commonstates.md) - Reusable animation-driven states
- [Animation Integration](../stategraphs/animation-integration.md) - Connecting animations to other systems

## Example: Creating an Entity with Complex Animations

```lua
local function CreateAnimatedEntity()
    local inst = CreateEntity()
    
    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    
    -- Set up animations
    inst.AnimState:SetBank("spider")
    inst.AnimState:SetBuild("spider_build")
    inst.AnimState:PlayAnimation("idle", true)
    
    -- Create a function to handle animation-driven effects
    inst.PlayAttackAnimation = function()
        inst.AnimState:PlayAnimation("atk")
        
        -- Create a flash effect at a specific frame
        inst:DoTaskInTime(10*FRAMES, function()
            local fx = SpawnPrefab("attackflash")
            fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
        end)
        
        -- Play sound at specific frame
        inst:DoTaskInTime(5*FRAMES, function()
            inst.SoundEmitter:PlaySound("dontstarve/creatures/spider/attack")
        end)
        
        -- Return to idle when done
        inst:ListenForEvent("animover", function(inst)
            if inst.AnimState:GetCurrentAnimationName() == "atk" then
                inst.AnimState:PlayAnimation("idle", true)
            end
        end)
    end
    
    return inst
end
```
