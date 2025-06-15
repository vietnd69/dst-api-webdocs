---
id: particle-effects
title: Particle Effects System
sidebar_position: 19
---

# Particle Effects System

Don't Starve Together's particle effects system allows mod creators to add visual effects like fire, smoke, electricity, and environmental effects to their creations. This document explains how to work with the particle system to create engaging visual effects.

## Overview

The particle effects system in DST is composed of several key components:

1. **Particle Emitters**: The source that generates particles
2. **Particle Types**: Different visual appearances for particles
3. **Parameters**: Controls for size, color, lifetime, etc.
4. **Behaviors**: How particles move and change over time
5. **Events**: Triggers for spawning or modifying particles

## Basic Particle Setup

Here's a basic example of creating a simple particle effect:

```lua
-- In scripts/prefabs/my_particle_effect.lua
local assets = {
    Asset("ANIM", "anim/smoke_puff.zip"),
}

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Important for effects
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    inst:AddTag("NOBLOCK")
    
    -- Basic animation setup
    inst.AnimState:SetBank("smoke_puff")
    inst.AnimState:SetBuild("smoke_puff")
    inst.AnimState:PlayAnimation("puff")
    inst.AnimState:SetAddColour(0, 0, 0, 0)
    
    -- Set render queue to ensure it appears above most objects
    inst.AnimState:SetRenderOrder(1)
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Remove when animation finishes
    inst:ListenForEvent("animover", inst.Remove)
    
    -- Don't save this effect
    inst.persists = false
    
    return inst
end

return Prefab("my_particle_effect", fn, assets)
```

## Creating Advanced Particle Effects

### Using the Particle Emitter

For more complex effects, DST provides a particle emitter component:

```lua
local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    -- Add a particle emitter
    inst.entity:AddParticleEmitter()
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Configure the particle emitter
    local emitter = inst.entity:GetParticleEmitter()
    
    -- Set basic parameters
    emitter:SetRenderResources("images/fx/smoke_puff.tex", "rectangular") -- Texture and shader
    emitter:SetMaxNumParticles(20) -- Maximum particles at once
    emitter:SetMaxLifetime(2) -- Maximum particle lifetime
    emitter:SetColourEnvelope(0) -- Use color envelope 0
    emitter:SetScaleEnvelope(1) -- Use scale envelope 1
    emitter:SetBlendMode(BLENDMODE.AlphaBlended) -- Blend mode
    emitter:EnableDepthTest(true) -- Test against scene depth
    
    -- Set color evolution over particle lifetime (envelope 0)
    emitter:AddColourEnvelope(0, 
        {
            { 0, 1, 1, 1, 1 }, -- Time 0: White with full alpha
            { 0.5, 1, 1, 1, 0.5 }, -- Time 0.5: White with half alpha
            { 1, 1, 1, 1, 0 } -- Time 1: White with zero alpha (fade out)
        }
    )
    
    -- Set size evolution (envelope 1)
    emitter:AddScaleEnvelope(1, 
        {
            { 0, 0.5 }, -- Start at half size
            { 0.5, 1 }, -- Grow to full size
            { 1, 0.75 } -- Shrink slightly at end
        }
    )
    
    -- Set rotation parameters
    emitter:SetRotationStatus(true) -- Enable rotation
    emitter:SetRotationRateStatus(true)
    emitter:SetRotationRate(2) -- Rotate at 2 radians per second
    
    -- Set emission parameters
    emitter:SetRadius(0.1) -- Emit within this radius
    emitter:SetEmissionRate(10) -- Particles per second
    
    -- Set velocities
    emitter:SetParticleRotation(0) -- Initial rotation
    emitter:SetVelocity(0, 1, 0) -- Up direction
    emitter:SetVelocitySpread(0.5) -- Random variance
    
    -- Don't save in world
    inst.persists = false
    
    -- Auto-remove after some time
    inst:DoTaskInTime(3, inst.Remove)
    
    return inst
end
```

### Color and Scale Envelopes

Envelopes control how particles change over their lifetime:

```lua
-- Complex color transitions
emitter:AddColourEnvelope(0, 
    {
        { 0, 1, 0, 0, 1 },     -- Start red
        { 0.3, 1, 0.5, 0, 1 },  -- Shift to orange
        { 0.6, 1, 1, 0, 0.8 },  -- Shift to yellow
        { 1, 1, 1, 1, 0 }      -- End white and fade out
    }
)

-- Multiple scale envelopes for different effects
emitter:AddScaleEnvelope(0, 
    {
        { 0, 0.1 },  -- Start tiny
        { 0.2, 1 },  -- Quickly grow to full size
        { 0.8, 1 },  -- Maintain size
        { 1, 0 }     -- Shrink to nothing at end
    }
)

emitter:AddScaleEnvelope(1, 
    {
        { 0, 0.5 },  -- Start at half size
        { 1, 2 }     -- Grow to double size
    }
)
```

### Using Forces

You can apply forces to particles for more dynamic effects:

```lua
-- Apply gravity to particles
emitter:SetAcceleration(0, -9.8, 0)

-- Apply drag/air resistance
emitter:SetDragCoefficient(0.2)
```

## Common Effect Types

### Fire Effect

```lua
local function CreateFireEffect()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddLight()
    inst.entity:AddParticleEmitter()
    inst.entity:AddNetwork()
    
    inst:AddTag("FX")
    inst:AddTag("NOBLOCK")
    
    -- Add light
    inst.Light:SetFalloff(0.5)
    inst.Light:SetIntensity(0.75)
    inst.Light:SetRadius(2)
    inst.Light:SetColour(1, 0.7, 0.3)
    inst.Light:Enable(true)
    
    -- Configure particles
    local emitter = inst.entity:GetParticleEmitter()
    emitter:SetRenderResources("images/fx/fire.tex", "premultiplied")
    emitter:SetMaxNumParticles(12)
    emitter:SetMaxLifetime(0.6)
    emitter:SetColourEnvelope(0)
    emitter:SetScaleEnvelope(0)
    emitter:SetBlendMode(BLENDMODE.AlphaBlended)
    emitter:EnableDepthTest(false)
    
    emitter:AddColourEnvelope(0, 
        {
            { 0, 1, 0.3, 0, 1 },
            { 0.2, 1, 0.5, 0, 1 },
            { 0.4, 1, 0.7, 0, 1 },
            { 1, 1, 1, 0, 0.5 }
        }
    )
    
    emitter:AddScaleEnvelope(0,
        {
            { 0, 0.5 },
            { 0.1, 1 },
            { 1, 0 }
        }
    )
    
    emitter:SetEmissionRate(25)
    emitter:SetVelocity(0, 2, 0)
    emitter:SetVelocitySpread(0.2)
    
    -- Add upward acceleration like real fire
    emitter:SetAcceleration(0, 1, 0)
    
    return inst
end
```

### Smoke Effect

```lua
local function CreateSmokeEffect()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddParticleEmitter()
    inst.entity:AddNetwork()
    
    inst:AddTag("FX")
    inst:AddTag("NOBLOCK")
    
    local emitter = inst.entity:GetParticleEmitter()
    emitter:SetRenderResources("images/fx/smoke.tex", "rectangular")
    emitter:SetMaxNumParticles(15)
    emitter:SetMaxLifetime(3)
    emitter:SetColourEnvelope(0)
    emitter:SetScaleEnvelope(0)
    emitter:SetBlendMode(BLENDMODE.AlphaBlended)
    
    emitter:AddColourEnvelope(0, 
        {
            { 0, 0.5, 0.5, 0.5, 0.5 },
            { 0.2, 0.5, 0.5, 0.5, 0.4 },
            { 1, 0.5, 0.5, 0.5, 0 }
        }
    )
    
    emitter:AddScaleEnvelope(0, 
        {
            { 0, 0.1 },
            { 0.3, 0.5 },
            { 1, 1 }
        }
    )
    
    -- Slower emission for smoke
    emitter:SetEmissionRate(5)
    
    -- Rise slowly
    emitter:SetVelocity(0, 1, 0)
    emitter:SetVelocitySpread(0.5)
    
    -- Rotate smoke particles
    emitter:SetRotationStatus(true)
    emitter:SetRotationRateStatus(true)
    emitter:SetRotationRate(0.2)
    
    return inst
end
```

### Electrical Effect

```lua
local function CreateElectricalEffect()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddLight()
    inst.entity:AddParticleEmitter()
    inst.entity:AddNetwork()
    
    inst:AddTag("FX")
    inst:AddTag("NOBLOCK")
    
    -- Flickering light
    inst.Light:SetFalloff(0.7)
    inst.Light:SetIntensity(0.8)
    inst.Light:SetRadius(1.5)
    inst.Light:SetColour(0.5, 0.7, 1)
    inst.Light:Enable(true)
    
    local emitter = inst.entity:GetParticleEmitter()
    emitter:SetRenderResources("images/fx/electric.tex", "additive")
    emitter:SetMaxNumParticles(10)
    emitter:SetMaxLifetime(0.3)
    emitter:SetColourEnvelope(0)
    emitter:SetScaleEnvelope(0)
    emitter:SetBlendMode(BLENDMODE.Additive)
    
    -- Blue-white electric color
    emitter:AddColourEnvelope(0, 
        {
            { 0, 0.7, 0.8, 1, 1 },
            { 0.5, 0.5, 0.7, 1, 1 },
            { 1, 0.3, 0.5, 1, 0 }
        }
    )
    
    emitter:AddScaleEnvelope(0, 
        {
            { 0, 0.5 },
            { 0.2, 1 },
            { 1, 0 }
        }
    )
    
    -- Fast and erratic emission for electricity
    emitter:SetEmissionRate(30)
    emitter:SetVelocitySpread(2)
    
    -- Make the light flicker
    inst:DoPeriodicTask(0.05, function()
        inst.Light:SetIntensity(0.5 + math.random() * 0.5)
    end)
    
    return inst
end
```

## Special Effects Using Particle Systems

### Rain Splash Effect

```lua
local function CreateRainSplash()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddParticleEmitter()
    inst.entity:AddNetwork()
    inst.entity:AddSoundEmitter()
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    local emitter = inst.entity:GetParticleEmitter()
    emitter:SetRenderResources("images/fx/rainsplash.tex", "rectangular")
    emitter:SetMaxNumParticles(1) -- Just one splash
    emitter:SetMaxLifetime(0.35)
    emitter:SetColourEnvelope(0)
    emitter:SetScaleEnvelope(0)
    emitter:SetBlendMode(BLENDMODE.AlphaBlended)
    emitter:EnableDepthTest(true)
    
    -- White, fading out
    emitter:AddColourEnvelope(0, 
        {
            { 0, 1, 1, 1, 0.5 },
            { 1, 1, 1, 1, 0 }
        }
    )
    
    -- Start small, expand outward
    emitter:AddScaleEnvelope(0, 
        {
            { 0, 0.1 },
            { 1, 0.5 }
        }
    )
    
    -- Emit just one particle
    emitter:SetEmissionRate(10)
    emitter:SetMaxEmissionTime(0.1)
    
    -- Play a splash sound
    inst.SoundEmitter:PlaySound("dontstarve/rain/raindrop")
    
    -- Remove after effect is done
    inst:DoTaskInTime(0.5, inst.Remove)
    
    return inst
end
```

### Snow Effect

```lua
local function CreateSnowSystem()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddParticleEmitter()
    inst.entity:AddNetwork()
    
    inst:AddTag("FX")
    inst:AddTag("NOBLOCK")
    
    local emitter = inst.entity:GetParticleEmitter()
    emitter:SetRenderResources("images/fx/snowflake.tex", "rectangular")
    emitter:SetMaxNumParticles(1000)
    emitter:SetMaxLifetime(15)
    emitter:SetColourEnvelope(0)
    emitter:SetScaleEnvelope(0)
    emitter:SetBlendMode(BLENDMODE.AlphaBlended)
    emitter:EnableDepthTest(true)
    
    -- White snowflakes
    emitter:AddColourEnvelope(0, 
        {
            { 0, 1, 1, 1, 0.5 }, 
            { 0.8, 1, 1, 1, 0.5 },
            { 1, 1, 1, 1, 0 }
        }
    )
    
    -- Varied snowflake sizes
    emitter:AddScaleEnvelope(0, 
        {
            { 0, 0.2 + math.random() * 0.2 },
            { 1, 0.2 + math.random() * 0.2 }
        }
    )
    
    -- Very wide emission area
    emitter:SetSpawnVectors(30, 5, 30)
    emitter:SetEmissionRate(50)
    
    -- Slow falling with some horizontal drift
    emitter:SetVelocity(0.2, -0.5, 0.2)
    emitter:SetVelocitySpread(1)
    
    -- Rotate snowflakes
    emitter:SetRotationStatus(true)
    emitter:SetRotationRateStatus(true)
    emitter:SetRotationRate(0.5)
    
    return inst
end
```

### Magic Aura Effect

```lua
local function CreateMagicAura(target)
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddParticleEmitter()
    inst.entity:AddFollower()
    inst.entity:AddNetwork()
    
    inst:AddTag("FX")
    inst:AddTag("NOBLOCK")
    
    -- Follow the target entity
    if target ~= nil then
        inst.Follower:FollowSymbol(target.GUID, "body", 0, 0, 0)
    end
    
    local emitter = inst.entity:GetParticleEmitter()
    emitter:SetRenderResources("images/fx/sparkle.tex", "additive")
    emitter:SetMaxNumParticles(30)
    emitter:SetMaxLifetime(2)
    emitter:SetColourEnvelope(0)
    emitter:SetScaleEnvelope(0)
    emitter:SetBlendMode(BLENDMODE.Additive)
    
    -- Purple magic color
    emitter:AddColourEnvelope(0, 
        {
            { 0, 0.7, 0, 1, 0 },
            { 0.1, 0.7, 0, 1, 1 },
            { 0.8, 0.7, 0, 1, 0.8 },
            { 1, 0.7, 0, 1, 0 }
        }
    )
    
    emitter:AddScaleEnvelope(0, 
        {
            { 0, 0 },
            { 0.1, 0.2 },
            { 0.8, 0.2 },
            { 1, 0 }
        }
    )
    
    -- Emit in a spherical pattern around the target
    emitter:SetSphereEmitter(0.8)
    emitter:SetEmissionRate(15)
    
    -- Particles orbit around target
    emitter:SetOwnerVelocity(true)
    
    -- Set a random motion for each particle
    emitter:SetRandomVelocity(3)
    
    return inst
end
```

## Performance Considerations

When working with particle effects, keep these performance tips in mind:

1. **Particle Count**: Limit the maximum number of particles
   ```lua
   emitter:SetMaxNumParticles(30) -- Keep this reasonable
   ```

2. **Lifetime**: Use appropriate lifetimes for effects
   ```lua
   emitter:SetMaxLifetime(2) -- 2 seconds is often sufficient
   ```

3. **Emission Rate**: Control how many particles spawn per second
   ```lua
   emitter:SetEmissionRate(10) -- Lower is better for performance
   ```

4. **LOD (Level of Detail)**: Reduce particles at distance
   ```lua
   emitter:EnableDistanceLOD(true)
   emitter:SetDistanceLODParams(10, 20) -- Start reducing at 10, none by 20
   ```

5. **Cleanup**: Always remove effects when no longer needed
   ```lua
   inst:DoTaskInTime(3, inst.Remove)
   ```

## Integration with Other Systems

### Weather System Integration

```lua
-- Integrate particle effects with the weather system
local function UpdateWeatherParticles(inst)
    local emitter = inst.entity:GetParticleEmitter()
    
    if TheWorld.state.israining then
        -- More particles during rain
        emitter:SetEmissionRate(30)
        -- Faster particles
        emitter:SetAcceleration(0, -12, 0)
    elseif TheWorld.state.issnowing then
        -- Switch to snow particles
        emitter:SetRenderResources("images/fx/snowflake.tex", "rectangular")
        -- Different motion for snow
        emitter:SetAcceleration(0, -2, 0)
        emitter:SetVelocitySpread(2)
    else
        -- Default state
        emitter:SetEmissionRate(10)
        emitter:SetAcceleration(0, -9.8, 0)
    end
end

-- Watch for weather changes
inst:WatchWorldState("israining", UpdateWeatherParticles)
inst:WatchWorldState("issnowing", UpdateWeatherParticles)
```

### Combat System Integration

```lua
-- Create hit effect when attacked
local function OnAttacked(inst, data)
    local x, y, z = inst.Transform:GetWorldPosition()
    
    local fx = SpawnPrefab("hit_sparks")
    fx.Transform:SetPosition(x, y + 1, z)
    
    -- Point particles in direction away from attacker
    if data.attacker ~= nil then
        local angle = inst:GetAngleToPoint(data.attacker.Transform:GetWorldPosition())
        fx.Transform:SetRotation(angle)
    end
end

inst:ListenForEvent("attacked", OnAttacked)
```

## See also

- [Custom Weather Effects](../examples/custom-weather-effects.md) - For more complex weather implementations
- [Stategraph System](stategraph-system.md) - For animation state management
- [Light Component](../components/other-components.md) - For adding light to particle effects
- [Sound System](../core/sound-system.md) - For adding audio to effects

By mastering the particle system in Don't Starve Together, you can create visually impressive effects that enhance the atmosphere and feedback in your mods. 