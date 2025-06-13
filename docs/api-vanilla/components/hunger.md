---
id: hunger
title: Hunger
sidebar_position: 7
---

# Hunger Component

The Hunger component manages an entity's hunger state, including maximum hunger, hunger rate, and starvation effects.

## Basic Usage

```lua
-- Add a hunger component to an entity
local entity = CreateEntity()
entity:AddComponent("hunger")

-- Configure the hunger component
local hunger = entity.components.hunger
hunger:SetMax(150)
hunger:SetRate(TUNING.WILSON_HUNGER_RATE)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `current` | Number | Current hunger value |
| `max` | Number | Maximum hunger value |
| `rate` | Number | Rate at which hunger decreases over time |
| `hungerrate` | Number | Multiplier for hunger rate |
| `burning` | Boolean | Whether hunger is currently being consumed |

## Key Methods

```lua
-- Set maximum hunger
hunger:SetMax(200)

-- Set hunger rate
hunger:SetRate(1.5)

-- Add or remove hunger
hunger:DoDelta(10)  -- Add 10 hunger
hunger:DoDelta(-10) -- Remove 10 hunger

-- Set hunger as a percentage
hunger:SetPercent(0.5) -- Set to 50% of max hunger
```

## Events

The Hunger component triggers these events:

- `hungerdelta` - When hunger value changes
- `startstarving` - When entity starts starving
- `stopstarving` - When entity stops starving

## Integration with Other Components

The Hunger component often works with:

- `Health` - For starvation damage
- `Eater` - For consuming food to restore hunger
- `Temperature` - Hunger can affect temperature management 

## See also

- [Health Component](health.md) - For starvation damage
- [Eater Component](eater.md) - For consuming food to restore hunger
- [Edible Component](edible.md) - For food properties that affect hunger
- [Temperature Component](temperature.md) - For hunger effects on temperature
- [Sanity Component](sanity.md) - For another vital stat that works similarly 