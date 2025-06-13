---
id: health
title: Health
sidebar_position: 3
---

# Health Component

The Health component manages an entity's health state, including current and maximum health values, damage handling, regeneration, invincibility, and death triggers.

## Basic Usage

```lua
-- Add a health component to an entity
local entity = CreateEntity()
entity:AddComponent("health")

-- Configure the health component
local health = entity.components.health
health:SetMaxHealth(100)
health:SetPercent(0.5) -- Set to 50% health
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `maxhealth` | Number | Maximum possible health value |
| `minhealth` | Number | Minimum health value (usually 0) |
| `currenthealth` | Number | Current health value |
| `invincible` | Boolean | If true, entity cannot take damage |
| `penalty` | Number | Health penalty (reduces maximum health) |
| `takingfiredamage` | Boolean | If true, entity is currently taking fire damage |
| `fire_damage_scale` | Number | Multiplier for fire damage |
| `absorb` | Number | Deprecated damage absorption value |
| `canmurder` | Boolean | If true, entity can be murdered (e.g., by the Murder action) |
| `canheal` | Boolean | If true, entity can be healed |

## Key Methods

### Health Management

```lua
-- Set maximum health
health:SetMaxHealth(100)

-- Set current health to a specific value
health:SetVal(50, "set_health")

-- Set health as a percentage of maximum
health:SetPercent(0.75) -- Set to 75% of max health

-- Add or remove health
health:DoDelta(10) -- Add 10 health
health:DoDelta(-10) -- Remove 10 health

-- Check if entity is dead
local is_dead = health:IsDead()
```

### Invincibility

```lua
-- Make entity invincible
health:SetInvincible(true)

-- Check if entity is invincible
local is_invincible = health:IsInvincible()
```

### Fire Damage

```lua
-- Apply fire damage
health:DoFireDamage(5, attacker, true)

-- Get fire damage scale
local fire_scale = health:GetFireDamageScale()
```

### Healing and Regeneration

```lua
-- Start health regeneration
health:StartRegen(2, 1) -- Heal 2 health every 1 second

-- Stop health regeneration
health:StopRegen()

-- Add a regeneration source
health:AddRegenSource("regen_buff", 1, 2)

-- Remove a regeneration source
health:RemoveRegenSource("regen_buff")
```

## Health Penalties

```lua
-- Set health penalty
health:SetPenalty(0.25) -- 25% health penalty

-- Remove health penalty
health:RemovePenalty(0.25)

-- Enable/disable health penalties
health:EnablePenalty(true)
```

## Events

The Health component responds to and triggers various events:

- `death` - Triggered when the entity dies
- `healthdelta` - Triggered when health changes
- `attacked` - Triggered when the entity is attacked
- `startfiredamage` - Triggered when the entity starts taking fire damage
- `stopfiredamage` - Triggered when the entity stops taking fire damage
- `invincibletoggle` - Triggered when invincibility is toggled

## Integration with Other Components

The Health component often works with:

- `Combat` - For handling damage from attacks
- `Armor` - For damage reduction
- `Temperature` - For temperature-related damage
- `Hunger` - For hunger-related damage
- `State Graph` - For playing hurt and death animations

## See also

- [Combat Component](combat.md) - For attacking and receiving damage
- [Armor Component](armor.md) - For protection against damage
- [Temperature Component](temperature.md) - For temperature effects that can cause damage
- [Hunger Component](hunger.md) - For hunger effects that can cause damage
- [Sanity Component](sanity.md) - For mental state that can affect health

## Examples

```lua
-- Create a basic entity with health
local function MakeCreature()
    local inst = CreateEntity()
    
    -- Add required components
    inst:AddComponent("health")
    
    -- Configure health
    local health = inst.components.health
    health:SetMaxHealth(200)
    health:StartRegen(1, 5) -- Regenerate 1 health every 5 seconds
    
    -- Add callback for when this entity dies
    inst:ListenForEvent("death", function(inst)
        -- Do something when this entity dies
    end)
    
    return inst
end

-- Create a non-lethal creature (cannot die from hunger or temperature)
local function MakeNonLethalCreature()
    local inst = CreateEntity()
    
    inst:AddComponent("health")
    
    local health = inst.components.health
    health:SetMaxHealth(100)
    
    -- Configure non-lethal settings
    health.nonlethal_temperature = true
    health.nonlethal_hunger = true
    health.nonlethal_pct = 0.05 -- Will not drop below 5% health from non-lethal sources
    
    return inst
end
``` 