---
id: burnable
title: Burnable Component
sidebar_position: 9
---

# Burnable Component

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