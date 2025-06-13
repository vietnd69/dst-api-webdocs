---
id: animation-snippets
title: Animation Snippets
sidebar_position: 5
---

# Animation Snippets

This page provides reusable code snippets for working with animations in Don't Starve Together mods.

## Basic Animation Usage

### Setting Up Animations

```lua
-- Basic animation setup
function SetupAnimations(inst)
    -- Set animation bank and build
    inst.AnimState:SetBank("spear")
    inst.AnimState:SetBuild("spear")
    
    -- Play default animation
    inst.AnimState:PlayAnimation("idle")
end

-- Example usage in a prefab
local function fn()
    local inst = CreateEntity()
    
    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Setup animations
    SetupAnimations(inst)
    
    return inst
end
```

## Animation Playback Control

```lua
-- Play a single animation once
inst.AnimState:PlayAnimation("attack")

-- Play an animation and loop it
inst.AnimState:PlayAnimation("idle_loop", true)

-- Queue an animation to play after the current one finishes
inst.AnimState:PushAnimation("idle", true) -- true for looping

-- Get current animation name
local current_anim = inst.AnimState:GetCurrentAnimationName()

-- Check if animation is finished
local is_done = inst.AnimState:AnimDone()

-- Set animation playback rate (1 is normal speed)
inst.AnimState:SetTime(0) -- Reset to beginning
inst.AnimState:SetRate(2) -- Play at 2x speed
```

## Animation Events and Callbacks

```lua
-- Using timeline events in a state graph
State {
    name = "attack",
    tags = {"attack", "busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("attack")
    end,
    
    timeline = {
        -- At frame 10, play a sound
        TimeEvent(10*FRAMES, function(inst)
            inst.SoundEmitter:PlaySound("dontstarve/wilson/attack_weapon")
        end),
        
        -- At frame 15, apply damage
        TimeEvent(15*FRAMES, function(inst)
            inst.components.combat:DoAttack()
        end),
        
        -- At frame 25, spawn an effect
        TimeEvent(25*FRAMES, function(inst)
            local fx = SpawnPrefab("impact")
            fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
        end),
    },
    
    events = {
        EventHandler("animover", function(inst)
            inst.sg:GoToState("idle")
        end),
    },
}

-- Listening for animation-related events outside of a state graph
inst:ListenForEvent("animover", function(inst)
    print("Animation finished: " .. inst.AnimState:GetCurrentAnimationName())
end)
```

## Symbol Manipulation

```lua
-- Override a specific symbol with another build's symbol
inst.AnimState:OverrideSymbol("swap_object", "spear", "swap_spear")

-- Hide and show specific symbols
inst.AnimState:Hide("ARM_normal")
inst.AnimState:Show("ARM_carry")

-- Clear symbol overrides
inst.AnimState:ClearOverrideSymbol("swap_object")

-- Add and remove symbol modifiers
inst.AnimState:AddSymbolModifier("symbol_name", "MODIFIERNAME")
inst.AnimState:RemoveSymbolModifier("symbol_name", "MODIFIERNAME")
```

## Animation Blending and Transforms

```lua
-- Set blend mode for transparency
inst.AnimState:SetBloomEffectHandle("shaders/anim.ksh")

-- Set layer for rendering order (higher numbers render on top)
inst.AnimState:SetLayer(LAYER.BACKGROUND)
inst.AnimState:SetSortOrder(3)

-- Set facing direction (4 or 8 direction mode)
inst.AnimState:SetFinalOffset(1) -- Z-offset for rendering
inst.AnimState:SetOrientation(ANIM_ORIENTATION.OnGround)
inst.AnimState:SetFacing(FACING_RIGHT)

-- Scale and position adjustments
inst.AnimState:SetScale(1.2, 1.2, 1.2)
inst.AnimState:SetRotation(45) -- Degrees
```

## Custom Animation Effects

```lua
-- Add overlay effect (like wetness)
function ApplyWetEffect(inst)
    inst.AnimState:SetAddColour(0, 0, 0.2, 0)
    inst.AnimState:SetHaunted(false)
end

-- Add color tint
function ApplyTint(inst, r, g, b, a)
    inst.AnimState:SetMultColour(r, g, b, a)
end

-- Make entity flash
function FlashEntity(inst, duration)
    inst.AnimState:SetAddColour(0.2, 0.2, 0.2, 0)
    
    inst:DoTaskInTime(duration, function()
        inst.AnimState:SetAddColour(0, 0, 0, 0)
    end)
end

-- Fade entity in
function FadeIn(inst, duration)
    inst.AnimState:SetMultColour(1, 1, 1, 0)
    
    local start_time = GetTime()
    local task = inst:DoPeriodicTask(FRAMES, function()
        local t = math.min(1, (GetTime() - start_time) / duration)
        inst.AnimState:SetMultColour(1, 1, 1, t)
        
        if t >= 1 then
            if task ~= nil then
                task:Cancel()
                task = nil
            end
        end
    end)
end
```

## Working with Multiple Animations

```lua
-- Switch between different animation sets
function SwitchAnimSet(inst, bank, build)
    inst.AnimState:SetBank(bank)
    inst.AnimState:SetBuild(build)
    inst.AnimState:PlayAnimation("idle")
end

-- Swap between character animations with items
function SetupCharacterAnimations(inst)
    -- Base animations
    inst.AnimState:SetBank("wilson")
    inst.AnimState:SetBuild("wilson")
    
    -- Add animations for holding items
    inst.components.inventory:SetEquippedItem("onequip", function(inst, data)
        local item = data.item
        if item and item.components.equippable then
            if item.components.equippable.equipslot == EQUIPSLOTS.HANDS then
                -- Override hand animation
                inst.AnimState:OverrideSymbol("swap_object", 
                    item.components.equippable.swapbuild or item.prefab, 
                    item.components.equippable.swapsymbol or "swap_object")
                inst.AnimState:Show("ARM_carry")
                inst.AnimState:Hide("ARM_normal")
            end
        end
    end)
    
    -- Remove item animations
    inst:ListenForEvent("unequip", function(inst, data)
        local item = data.item
        if item and item.components.equippable then
            if item.components.equippable.equipslot == EQUIPSLOTS.HANDS then
                -- Restore normal hand animation
                inst.AnimState:ClearOverrideSymbol("swap_object")
                inst.AnimState:Hide("ARM_carry")
                inst.AnimState:Show("ARM_normal")
            end
        end
    end)
end
```

## Animation Integration with Other Systems

```lua
-- Animation-driven sound effects
function SetupAnimationSounds(inst)
    -- Connect animation frames to sound effects
    local function PlayFootstep()
        -- Play different sounds based on ground type
        local ground = TheWorld.Map:GetTileAtPoint(inst.Transform:GetWorldPosition())
        if ground == GROUND.ROCKY then
            inst.SoundEmitter:PlaySound("dontstarve/movement/run_rock")
        elseif ground == GROUND.MARSH then
            inst.SoundEmitter:PlaySound("dontstarve/movement/run_marsh")
        else
            inst.SoundEmitter:PlaySound("dontstarve/movement/run_dirt")
        end
    end
    
    -- Add to state graph
    local states = {
        State{
            name = "run",
            tags = {"moving", "running"},
            
            onenter = function(inst)
                inst.AnimState:PlayAnimation("run_loop", true)
            end,
            
            timeline = {
                TimeEvent(7*FRAMES, PlayFootstep),
                TimeEvent(15*FRAMES, PlayFootstep),
            },
        }
    }
    
    return states
end

-- Animation-driven particle effects
function SpawnFootstepFX(inst)
    -- Spawn particles at feet position
    local x, y, z = inst.Transform:GetWorldPosition()
    local fx = SpawnPrefab("footstep")
    fx.Transform:SetPosition(x, 0, z)
    
    -- Set particle appearance based on ground
    local ground = TheWorld.Map:GetTileAtPoint(x, 0, z)
    if ground == GROUND.DESERT_DIRT then
        fx.AnimState:SetBank("footstep_desert")
        fx.AnimState:SetBuild("footstep_desert")
    else
        fx.AnimState:SetBank("footstep")
        fx.AnimState:SetBuild("footstep")
    end
    
    fx.AnimState:PlayAnimation("idle")
    fx:ListenForEvent("animover", fx.Remove)
end
```

These snippets demonstrate common animation techniques used in Don't Starve Together modding. Adapt them to your specific needs when creating custom entities, characters, or effects.
