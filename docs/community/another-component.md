---
id: another-component
title: Another Component
sidebar_position: 31
version: 619045
---

# Another Component

The Another component is a utility component that provides various helper functions and properties for entity behavior. It helps manage state transitions, temporary effects, and attribute modifications.

## Basic Usage

```lua title="basic_usage.lua"
-- Add an another component to an entity
local entity = CreateEntity()
entity:AddComponent("another")

-- Configure the another component
local another = entity.components.another
another:SetDuration(30)
another:SetModifier(0.25)
another:EnableEffect(true)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `duration` | Number | Duration of the component's effects in seconds |
| `modifier` | Number | Multiplier applied to entity attributes |
| `effect_enabled` | Boolean | Whether the component's effects are active |
| `cooldown` | Number | Cooldown period before effects can be reactivated |
| `stacks` | Number | How many times the effect is stacked |
| `max_stacks` | Number | Maximum possible stacks |
| `oneffectstart` | Function | Callback when effect starts |
| `oneffectend` | Function | Callback when effect ends |

## Key Methods

```lua title="key_methods.lua"
-- Set effect duration
another:SetDuration(60) -- 60 seconds

-- Set attribute modifier
another:SetModifier(0.5) -- 50% modifier

-- Enable or disable effects
another:EnableEffect(true)
another:DisableEffect()

-- Stack effects
another:AddStack()
another:RemoveStack()
another:ClearStacks()

-- Check component state
local is_active = another:IsEffectActive()
local remaining = another:GetRemainingTime()
local stacks = another:GetStacks()

-- Set callbacks
another:SetOnEffectStart(function(inst)
    -- Do something when effect starts
    print("Effect started on " .. inst.name)
end)

another:SetOnEffectEnd(function(inst)
    -- Do something when effect ends
    print("Effect ended on " .. inst.name)
end)
```

## Events

The Another component responds to and triggers various events:

- `effectstart` - Triggered when the effect starts
- `effectend` - Triggered when the effect ends
- `stackadded` - Triggered when a stack is added
- `stackremoved` - Triggered when a stack is removed
- `stackscleared` - Triggered when all stacks are cleared

## Integration with Other Components

The Another component often works with:

- `Health` - For applying health modifications
- `Sanity` - For applying sanity effects
- `Combat` - For applying combat bonuses
- `Hunger` - For modifying hunger rates
- `Locomotor` - For movement speed adjustments

## See also

- [Health Component](health.md) - For health modifications
- [Combat Component](combat.md) - For combat bonuses
- [Sanity Component](sanity.md) - For sanity effects
- [Hunger Component](hunger.md) - For hunger rate modifications
- [Related Component](related-component.md) - For relationship effects

## Example: Creating a Temporary Buff Effect

```lua title="buff_example.lua"
local function MakeBuffApplier()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it an inventory item
    inst:AddComponent("inventoryitem")
    
    -- Make it usable
    inst:AddComponent("usable")
    inst.components.usable:SetOnUseFn(function(inst, user)
        -- When used, apply a buff to the user
        if user.components.another == nil then
            user:AddComponent("another")
        end
        
        local another = user.components.another
        another:SetDuration(30) -- 30 second buff
        another:SetModifier(0.25) -- 25% boost
        another:EnableEffect(true)
        
        -- Apply the actual buff effects
        if user.components.combat ~= nil then
            user.components.combat.externaldamagemultipliers:SetModifier(inst, 1.25)
        end
        
        if user.components.locomotor ~= nil then
            user.components.locomotor:SetExternalSpeedMultiplier(inst, "buff", 1.25)
        end
        
        -- Set up callback for when buff ends
        user.components.another:SetOnEffectEnd(function(user)
            if user.components.combat ~= nil then
                user.components.combat.externaldamagemultipliers:RemoveModifier(inst)
            end
            
            if user.components.locomotor ~= nil then
                user.components.locomotor:RemoveExternalSpeedMultiplier(inst, "buff")
            end
            
            -- Visual feedback that buff ended
            if user.components.talker ~= nil then
                user.components.talker:Say("My power boost has faded!")
            end
        end)
        
        -- Visual feedback that buff started
        if user.components.talker ~= nil then
            user.components.talker:Say("I feel stronger!")
        end
        
        -- Remove the item when used
        inst:Remove()
        return true
    end)
    
    return inst
end
``` 