---
id: burnable
title: Burnable Component
sidebar_position: 9
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Burnable Component

*API Version: 619045*

The Burnable component allows entities to catch fire, burn, and potentially spread fire to nearby objects.

## Basic Usage

```lua
-- Add a burnable component to an entity
local entity = CreateEntity()
entity:AddComponent("burnable")

-- Configure the burnable component
local burnable = entity.components.burnable
burnable:SetBurnTime(10)
burnable:SetFXLevel(3)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `burning` | Boolean | Whether the entity is currently on fire |
| `burntime` | Number | How long the entity will burn before being extinguished |
| `fxlevel` | Number | The intensity level of the fire effect (1-3) |
| `fxdata` | Table | Configuration for fire effects |
| `canlight` | Boolean | Whether the entity can be set on fire |
| `onignite` | Function | Callback when the entity catches fire |
| `onextinguish` | Function | Callback when the fire is extinguished |
| `onburnt` | Function | Callback when the entity is completely burnt |

## Key Methods

```lua
-- Set burn time
burnable:SetBurnTime(15) -- Burn for 15 seconds

-- Set fire effect level
burnable:SetFXLevel(2) -- Medium-sized fire

-- Light on fire
burnable:Ignite()

-- Extinguish fire
burnable:Extinguish()

-- Check if it's burning
local is_burning = burnable:IsBurning()

-- Make fire spread to nearby objects
burnable:SetOnIgniteFn(function(inst)
    -- Custom ignite behavior
end)
```

## Events

The Burnable component responds to and triggers various events:

- `onignite` - Triggered when the entity catches fire
- `onextinguish` - Triggered when the fire is extinguished
- `onburnt` - Triggered when the entity is completely burnt

## Integration with Other Components

The Burnable component often works with:

- `Propagator` - For spreading fire to nearby objects
- `Fueled` - For fuel consumption during burning
- `Health` - For damage while burning
- `Light` - For generating light while burning

## See also

- [Propagator Component](other-components.md) - For spreading fire to nearby objects
- [Fueled Component](other-components.md) - For fuel consumption during burning
- [Health Component](health.md) - For damage while burning
- [Light Component](other-components.md) - For generating light while burning
- [Cookable Component](cookable.md) - For items that can be cooked by fire 

## Example: Creating a Burnable Object

```lua
local function MakeBurnableObject()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    
    -- Make it burnable
    inst:AddComponent("burnable")
    local burnable = inst.components.burnable
    
    -- Configure burning properties
    burnable:SetBurnTime(10)
    burnable:SetFXLevel(3)
    
    -- Add callbacks for burn events
    burnable:SetOnIgniteFn(function(inst)
        inst.AnimState:PlayAnimation("ignite")
        inst.AnimState:PushAnimation("burning_loop", true)
        inst.SoundEmitter:PlaySound("dontstarve/common/fireAddFuel")
    end)
    
    burnable:SetOnExtinguishFn(function(inst)
        inst.AnimState:PlayAnimation("extinguish")
        inst.AnimState:PushAnimation("idle", true)
        inst.SoundEmitter:PlaySound("dontstarve/common/fireOut")
    end)
    
    burnable:SetOnBurntFn(function(inst)
        inst.AnimState:PlayAnimation("burnt")
        inst:AddTag("burnt")
        inst:RemoveTag("burnable")
    end)
    
    -- Add propagator for spreading fire
    inst:AddComponent("propagator")
    inst.components.propagator.propagaterange = 5
    inst.components.propagator.damagerange = 2
    
    return inst
end
``` 
