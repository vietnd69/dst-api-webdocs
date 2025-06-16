---
id: health-properties
title: Health Properties
sidebar_position: 2
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Health Properties

*API Version: 619045*

Health properties are a set of shared attributes and mechanics that govern how entities manage their health state in Don't Starve Together. These properties span across multiple components but follow consistent patterns for damage, healing, and death mechanics.

## Core Health Properties

| Property | Type | Description |
|----------|------|-------------|
| `currenthealth` | Number | Current health value of the entity |
| `maxhealth` | Number | Maximum possible health value |
| `minhealth` | Number | Minimum health value (usually 0) |
| `invincible` | Boolean | Whether the entity can take damage |
| `vulnerabletoheatdamage` | Boolean | Whether entity takes damage from overheating |
| `vulnerabletocold` | Boolean | Whether entity takes damage from freezing |
| `fire_damage_scale` | Number | Multiplier for fire damage |
| `absorb` | Number | Amount of damage absorption (0-1 range) |
| `playerabsorb` | Number | Damage absorption specifically from player attacks |
| `penalty` | Number | Health penalty (reduces maximum health) |

## Health Interactions

Health properties interact across multiple components to create a cohesive damage and healing system:

### Damage Flow

When an entity takes damage, the process typically follows this flow:

1. **Combat Component** initiates damage via `DoAttack()` or similar functions
2. **Armor Component** (if present) absorbs a percentage of damage via `absorb_percent`
3. **Health Component** applies remaining damage via `DoDelta()`
4. If health reaches zero, death events are triggered

```lua
-- Example damage flow
function ApplyDamage(target, damage, attacker, weapon)
    -- Combat component initiates attack
    if target.components.combat then
        target.components.combat:GetAttacked(attacker, damage, weapon)
    else
        -- Direct health modification if no combat component
        if target.components.health then
            target.components.health:DoDelta(-damage)
        end
    end
end
```

### Protection Mechanics

Protection against damage is handled through several properties:

- **Damage Absorption**: Reduces damage by a percentage (0-1)
- **Invincibility**: Completely prevents damage when true
- **Immunity Tags**: Specific damage types that can be negated
- **Weakness Tags**: Damage types that bypass protection

```lua
-- Example damage reduction calculation
function CalculateReducedDamage(damage, absorb_percent, weakness_mult)
    local reduced_damage = damage * (1 - absorb_percent)
    if weakness_mult then
        reduced_damage = reduced_damage * weakness_mult
    end
    return math.max(0, reduced_damage)
end
```

### Healing Mechanics

Healing can come from multiple sources and is processed through health properties:

- **Direct Healing**: Via `Health:DoDelta(positive_amount)`
- **Food Healing**: Via `Edible.healthvalue`
- **Regeneration**: Automatic healing over time via `StartRegen()`
- **Sleep Healing**: Healing while sleeping

## Health-Related Components

Several components interact with health properties:

| Component | Key Health Interactions |
|-----------|------------------------|
| [Health](../components/health.md) | Core health management (`DoDelta`, `SetMax`, etc.) |
| [Combat](../components/combat.md) | Damage dealing, attack handling |
| [Armor](../components/armor.md) | Damage absorption via `absorb_percent` |
| [Edible](../components/edible.md) | Health restoration via `healthvalue` |
| [Healer](../components/other-components.md) | Direct healing functionality |
| [Spawner](../components/other-components.md) | Respawn mechanics after death |
| [Resurrection](../components/other-components.md) | Return from death with health restoration |

## Health States

Entities can be in various health states:

- **Healthy**: Health above any critical thresholds
- **Critical**: Health below critical threshold (often triggers special behaviors)
- **Dead**: Health at or below zero
- **Invincible**: Cannot take damage regardless of health value
- **Sleeping**: Often has modified health regeneration

## Special Health Mechanics

The Don't Starve Together API implements several special health-related mechanics:

### Health Penalties

Health penalties reduce maximum health while maintaining the same percentage of current health:

```lua
function ApplyHealthPenalty(inst, percent)
    if inst.components.health then
        inst.components.health:SetPenalty(percent)
    end
end
```

### Resurrection and Death Prevention

Some mechanics allow preventing or reversing death:

```lua
function PreventDeath(inst)
    if inst.components.health then
        inst.components.health.preventdeath = true
    end
end

function AllowResurrection(inst)
    if inst.components.health then
        inst.components.health:SetCanMurder(false)
    end
end
```

### Health Visualization

Health properties are often visualized through:

- **Health Badges**: UI elements showing current/max health
- **Health Bars**: Visual indicators above entities
- **Visual Effects**: Blood splatter, healing effects, etc.

## Common Health Events

Health properties trigger several standard events:

- `death` - When an entity dies
- `healthdelta` - When health changes
- `attacked` - When the entity receives damage
- `startfiredamage` / `stopfiredamage` - For fire damage states

## See also

- [Health Component](../components/health.md) - Core component for health management
- [Combat Component](../components/combat.md) - For attack and damage handling
- [Armor Component](../components/armor.md) - For health protection mechanics
- [Edible Component](../components/edible.md) - For health restoration through food
- [Hunger Component](../components/hunger.md) - For another vital stat affecting health
