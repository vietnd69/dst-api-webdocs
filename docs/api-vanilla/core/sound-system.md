---
id: sound-system
title: Sound System
sidebar_position: 20
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Sound System

Don't Starve Together's sound system enables developers to add audio feedback to their mods through sound effects, music, and ambient sounds. This document explains how to work with the sound system effectively.

## Overview

The sound system in DST is composed of several key components:

1. **SoundEmitter Component**: Used to play and manage sound effects
2. **Audio Resources**: Sound files that can be played in-game
3. **Sound Banks**: Collections of audio resources
4. **Parameters**: Controls for volume, pitch, and other audio characteristics
5. **Events**: Triggers for playing or stopping sounds

## Basic Sound Setup

### Adding a SoundEmitter Component

The first step in playing sounds is adding a `SoundEmitter` to your entity:

```lua
local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    -- Add a SoundEmitter component
    inst.entity:AddSoundEmitter()
    
    -- Rest of your entity setup...
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Play a sound on creation
    inst.SoundEmitter:PlaySound("dontstarve/common/craftable/chest_craft")
    
    return inst
end
```

### Playing Sounds

The SoundEmitter component provides several methods for playing sounds:

```lua
-- Basic sound playback
inst.SoundEmitter:PlaySound("path/to/sound")

-- Play a sound with a specific volume (0.0 to 1.0)
inst.SoundEmitter:PlaySound("path/to/sound", nil, 0.5)

-- Play a sound with a specific name tag for later reference
inst.SoundEmitter:PlaySound("path/to/loop_sound", "my_loop_sound")

-- Play a sound with volume and pitch adjustment
inst.SoundEmitter:PlaySound("path/to/sound", nil, 0.7, 1.2)
```

### Stopping Sounds

For looping sounds or when you need to stop a sound before it finishes:

```lua
-- Stop a sound by its name tag
inst.SoundEmitter:KillSound("my_loop_sound")

-- Stop all sounds being played by this emitter
inst.SoundEmitter:KillAllSounds()
```

## Advanced Sound Features

### Looping Sounds

To play sounds continuously:

```lua
-- Start a looping sound with a name tag for reference
inst.SoundEmitter:PlaySound("dontstarve/common/fireAddFuel", "fire_loop")

-- Later, stop the looping sound
inst.SoundEmitter:KillSound("fire_loop")
```

### Sound Volume and Fading

You can adjust the volume of sounds and create fade effects:

```lua
-- Play a sound at 50% volume
inst.SoundEmitter:PlaySound("path/to/sound", nil, 0.5)

-- Fade out a looping sound over 2 seconds
inst.SoundEmitter:SetVolume("my_loop_sound", 0.5) -- Set to 50% volume
inst.SoundEmitter:SetVolumeWithFade("my_loop_sound", 0.0, 2) -- Fade to silence over 2 seconds
```

### Positional Audio

For sounds that should come from a specific location:

```lua
-- Play a sound at a specific world position
local x, y, z = inst.Transform:GetWorldPosition()
TheFocalPoint.SoundEmitter:PlaySound("dontstarve/common/destroy_metal", nil, nil, nil, nil, nil, x, y, z)
```

### Sound Parameters

Control various parameters of sound playback:

```lua
-- Play a sound with specific volume and pitch
inst.SoundEmitter:PlaySound("path/to/sound", nil, 0.7, -- volume
                                                 1.2) -- pitch modifier

-- Play a sound with full control
inst.SoundEmitter:PlaySound("path/to/sound", -- sound path
                           "my_sound",      -- sound name
                           0.8,             -- volume
                           1.0,             -- pitch
                           false,           -- is music
                           true)            -- fade in
```

## Integration with Other Systems

### StateGraph Integration

Sound effects are often played during animations using StateGraph events:

```lua
local states = {
    State{
        name = "attack",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("attack")
        end,
        
        timeline = {
            -- Play sound at specific animation frames
            TimeEvent(8*FRAMES, function(inst) 
                inst.SoundEmitter:PlaySound("dontstarve/common/swing")
            end),
            TimeEvent(12*FRAMES, function(inst) 
                inst.SoundEmitter:PlaySound("dontstarve/creatures/enemy/hit") 
            end),
        },
        
        events = {
            EventHandler("animover", function(inst) inst.sg:GoToState("idle") end),
        },
    },
}
```

### Event System Integration

Trigger sounds in response to events:

```lua
-- Play a sound when the entity is attacked
inst:ListenForEvent("attacked", function(inst, data)
    inst.SoundEmitter:PlaySound("dontstarve/creatures/generic/hurt")
end)

-- Play different sounds based on actions
inst:ListenForEvent("working", function(inst, data)
    if data.target and data.target:HasTag("tree") then
        inst.SoundEmitter:PlaySound("dontstarve/wilson/use_axe_tree")
    elseif data.target and data.target:HasTag("rock") then
        inst.SoundEmitter:PlaySound("dontstarve/wilson/use_pick_rock")
    end
end)
```

## Common Sound Practices

### Sound Assets Declaration

When creating a prefab that uses custom sounds, include them in the assets:

```lua
local assets = {
    -- Texture assets
    Asset("ANIM", "anim/my_item.zip"),
    
    -- Sound assets
    Asset("SOUND", "sound/my_mod_sounds.fsb"),
}

local function fn()
    local inst = CreateEntity()
    
    -- ... entity setup ...
    inst.entity:AddSoundEmitter()
    
    -- ... more setup ...
    
    return inst
end

return Prefab("my_item", fn, assets)
```

### Audio Feedback for User Interactions

Provide audio feedback for UI and gameplay interactions:

```lua
-- In UI button click handlers
OnClick = function(self)
    TheFrontEnd:GetSound():PlaySound("dontstarve/HUD/click_move")
    -- rest of click handling...
end

-- For item interactions
function MyItem:OnUse(doer)
    if self.inst.components.finiteuses and not self.inst.components.finiteuses:IsFull() then
        self.inst.SoundEmitter:PlaySound("dontstarve/common/use_repair")
    end
end
```

### Environmental Sound Effects

Create immersive environments with ambient sounds:

```lua
-- Ambient sound that plays continuously
local function StartAmbientSound(inst)
    if not inst:IsAsleep() then
        inst.SoundEmitter:PlaySound("dontstarve/common/campfire", "fire")
        inst.SoundEmitter:SetVolume("fire", 0.2)
    end
end

local function StopAmbientSound(inst)
    inst.SoundEmitter:KillSound("fire")
end

-- Connect to game sleep/wake cycle
inst:ListenForEvent("entitysleep", StopAmbientSound)
inst:ListenForEvent("entitywake", StartAmbientSound)

-- Start sounds initially
StartAmbientSound(inst)
```

## Performance Considerations

When working with sounds, keep these performance tips in mind:

1. **Sound Pooling**: Limit concurrent sounds of the same type
   ```lua
   -- Check if similar sound is already playing
   if not inst.SoundEmitter:PlayingSound("footstep") then
       inst.SoundEmitter:PlaySound("dontstarve/movement/run_dirt", "footstep")
   end
   ```

2. **Distance-Based Sound**: Don't play sounds that are too far from the player
   ```lua
   local function ShouldPlaySound(inst)
       local player = ThePlayer
       if player then
           local dist = inst:GetDistanceSqToPoint(player.Transform:GetWorldPosition())
           return dist < MAX_SOUND_RANGE_SQ
       end
       return false
   end
   ```

3. **Sound Cleanup**: Always clear sounds when entities are removed
   ```lua
   local function OnRemove(inst)
       inst.SoundEmitter:KillAllSounds()
   end
   
   inst:ListenForEvent("onremove", OnRemove)
   ```

## Commonly Used Sound Paths

Here are some commonly used sound paths in Don't Starve Together:

### Player Actions
- `"dontstarve/wilson/use_axe_tree"` - Chopping trees
- `"dontstarve/wilson/use_pick_rock"` - Mining rocks
- `"dontstarve/wilson/dig"` - Digging

### Entity Sounds
- `"dontstarve/creatures/generic/hurt"` - Generic hurt sound
- `"dontstarve/creatures/generic/die"` - Generic death sound
- `"dontstarve/creatures/generic/eat"` - Eating sound

### Interface Sounds
- `"dontstarve/HUD/click_move"` - UI click sound
- `"dontstarve/HUD/craft_open"` - Opening crafting menu
- `"dontstarve/HUD/craft_close"` - Closing crafting menu

### Environmental Sounds
- `"dontstarve/common/fire"` - Fire burning loop
- `"dontstarve/rain/rain_on"` - Rain beginning
- `"dontstarve/common/together/fire/fireout"` - Fire going out

## See Also

- [Particle Effects System](particle-effects.md) - For visual effects to pair with sounds
- [Stategraph System](stategraph-system.md) - For coordinating sounds with animations
- [Entity System](entity-system.md) - For understanding entity components
- [Event System](event-system.md) - For triggering sounds based on game events

By mastering the sound system in Don't Starve Together, you can create immersive audio experiences that provide important feedback and enhance the atmosphere of your mods. 
