---
id: sanity
title: Sanity
sidebar_position: 8
last_updated: 2023-07-06
version: 619045
---

# Sanity Component

The Sanity component manages an entity's mental state, including sanity level, effects of insanity, and sanity modifiers.

## Basic Usage

```lua
-- Add a sanity component to an entity
local entity = CreateEntity()
entity:AddComponent("sanity")

-- Configure the sanity component
local sanity = entity.components.sanity
sanity:SetMax(200)
sanity:SetPercent(1) -- Start at full sanity
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `current` | Number | Current sanity value |
| `max` | Number | Maximum sanity value |
| `rate` | Number | Rate at which sanity changes over time |
| `night_drain_mult` | Number | Sanity drain multiplier during nighttime |
| `neg_aura_mult` | Number | Multiplier for negative auras |
| `pos_aura_mult` | Number | Multiplier for positive auras |
| `inducers` | Table | List of sources inducing sanity changes |

## Key Methods

```lua
-- Set maximum sanity
sanity:SetMax(200)

-- Add or remove sanity
sanity:DoDelta(10)  -- Add 10 sanity
sanity:DoDelta(-10) -- Remove 10 sanity

-- Set sanity as a percentage
sanity:SetPercent(0.5) -- Set to 50% of max sanity

-- Add a sanity inducer
sanity:AddSanityAuraImmunity("spiders") -- Immune to spider sanity aura

-- Check if insane
local is_insane = sanity:IsInsane() -- Returns true if below threshold
```

## Events

The Sanity component triggers these events:

- `sanitydelta` - When sanity value changes
- `goinginsane` - When sanity drops below the insanity threshold
- `goingsane` - When sanity rises above the insanity threshold

## Integration with Other Components

The Sanity component often works with:

- `Inventory` - Equipped items can affect sanity
- `Temperature` - Extreme temperatures can affect sanity
- `Hunger` - Hunger state can affect sanity
- `State Graph` - For playing insanity animations

## See also

- [Health Component](health.md) - For another vital stat that works similarly
- [Hunger Component](hunger.md) - For another vital stat that works similarly
- [Temperature Component](temperature.md) - For temperature effects on sanity
- [Equippable Component](equippable.md) - For items that affect sanity when equipped
- [Edible Component](edible.md) - For food that affects sanity when eaten

## Example: Creating an Entity with Custom Sanity

```lua
local function MakeSanityEntity()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add health component
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(150)
    
    -- Configure sanity
    inst:AddComponent("sanity")
    local sanity = inst.components.sanity
    
    -- Custom sanity settings
    sanity:SetMax(200)
    sanity:SetPercent(1.0) -- Start at full sanity
    sanity.night_drain_mult = 1.5 -- More sanity loss at night
    sanity.neg_aura_mult = 0.8 -- Less affected by negative auras
    
    -- Add custom sanity penalties/bonuses
    inst:DoPeriodicTask(1, function(inst)
        if TheWorld.state.isnight and not TheWorld.state.isfullmoon then
            -- Lose sanity faster at night (except during full moons)
            inst.components.sanity:DoDelta(-1/60)
        elseif TheWorld.state.isfullmoon then
            -- Gain sanity during full moon
            inst.components.sanity:DoDelta(2/60)
        end
    end)
    
    -- Listen for sanity changes
    inst:ListenForEvent("sanitydelta", function(inst, data)
        if data.newpercent <= 0.3 and data.oldpercent > 0.3 then
            -- Low sanity effects
            if inst.components.talker ~= nil then
                inst.components.talker:Say("The shadows are coming...")
            end
            
            -- Visual effects
            if inst.SoundEmitter ~= nil then
                inst.SoundEmitter:PlaySound("dontstarve/sanity/gonecrazy_stinger")
            end
        elseif data.newpercent <= 0.15 and data.oldpercent > 0.15 then
            -- Very low sanity effects
            if inst.components.talker ~= nil then
                inst.components.talker:Say("GET OUT OF MY HEAD!")
            end
        elseif data.newpercent > 0.7 and data.oldpercent <= 0.7 then
            -- Recovering sanity
            if inst.components.talker ~= nil then
                inst.components.talker:Say("I feel much better now.")
            end
        end
    end)
    
    return inst
end 
