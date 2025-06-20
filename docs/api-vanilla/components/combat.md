---
id: combat
title: Combat Component
sidebar_position: 2
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Combat Component

*API Version: 619045*

The Combat component handles all combat mechanics for entities that can attack or be attacked. It manages attack ranges, damage, cooldowns, targeting, and other combat-related behaviors.

## Basic Usage

```lua
-- Add a combat component to an entity
local entity = CreateEntity()
entity:AddComponent("combat")

-- Configure the combat component
local combat = entity.components.combat
combat:SetDefaultDamage(10)
combat:SetAttackPeriod(2)
combat:SetRange(3, 3)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `attackrange` | Number | The maximum distance at which the entity can initiate an attack |
| `hitrange` | Number | The maximum distance at which the entity can hit targets |
| `areahitrange` | Number | The radius for area attacks (nil if no area attacks) |
| `defaultdamage` | Number | Base damage dealt by the entity when attacking |
| `min_attack_period` | Number | Minimum time (in seconds) between attacks |
| `canattack` | Boolean | Whether the entity can currently attack |
| `target` | Entity | The current target of this entity |
| `panic_thresh` | Number | Health percentage that triggers panic behavior |

## Key Methods

### Targeting

```lua
-- Set a target
combat:SetTarget(target_entity)

-- Drop the current target
combat:DropTarget()

-- Check if an entity can be targeted
local can_target = combat:CanTarget(target_entity)

-- Check if a specific entity is the current target
local is_target = combat:TargetIs(target_entity)
```

> **Related functions**: When a target is set with `SetTarget()`, the combat component will often use the [Health Component's](health.md) `IsDead()` to check if the target is still valid. For area attacks affecting multiple targets, each target's health is modified using `health:DoDelta()`.

### Attack Configuration

```lua
-- Set attack period (cooldown between attacks)
combat:SetAttackPeriod(2) -- 2 seconds between attacks

-- Set attack and hit ranges
combat:SetRange(3, 3) -- 3 for both attack and hit range

-- Configure area damage
combat:SetAreaDamage(2, 0.5) -- 2 unit radius, 50% damage to nearby entities

-- Enable or disable area damage
combat:EnableAreaDamage(true)
```

### Attack Management

```lua
-- Initiate an attack on the current target
combat:DoAttack()

-- Check if attack is on cooldown
local in_cooldown = combat:InCooldown()

-- Get remaining cooldown time
local cooldown = combat:GetCooldown()

-- Reset the attack cooldown
combat:ResetCooldown()

-- Restart the cooldown timer
combat:RestartCooldown()
```

> **Related functions**: When an entity has a [Weapon Component](weapon.md) equipped, the Combat component will use the weapon's `GetDamage()` function instead of its own `defaultdamage` value. Advanced weapons may also implement special effects through the `onattack` callback.

### Combat State

```lua
-- Temporarily disable attacks
combat:BlankOutAttacks(2) -- Cannot attack for 2 seconds

-- Make invulnerable
combat:SetInvincible(true)

-- Share target with nearby allies
combat:ShareTarget(target, 10, nil, 3) -- Share with up to 3 allies within 10 units
```

## Events

The Combat component responds to and triggers various events:

- `attacked` - Triggered when the entity is attacked
- `onhitother` - Triggered when the entity successfully hits another entity
- `onmissother` - Triggered when the entity misses an attack
- `killedother` - Triggered when the entity kills another entity

## Integration with Other Components

The Combat component often works with:

- `Health` - For damage calculations and death handling
- `Weapon` - For determining attack damage and effects
- `Inventory` - For equipping weapons that modify combat stats
- `State Graph` - For playing attack animations

## Real-World Examples

For practical implementations of the Combat component in complex mods, see these case studies:

- **[The Forge Mod](../examples/case-forge.md)** - Implements a full combat-focused game mode with custom damage types and buffs:
  ```lua
  -- From The Forge Mod: Adding damage types
  _G.TUNING.FORGE.DAMAGETYPES = {
      PHYSICAL = 1,
      MAGIC = 2,
      SOUND = 3,
      GAS = 4,
      LIQUID = 5
  }
  
  -- Adding damage buffs
  function Combat:AddDamageBuff(buffname, data, recieved, remove_old_buff)
      if remove_old_buff and self:HasDamageBuff(buffname, recieved) then
          self:RemoveDamageBuff(buffname, recieved)
      end
      if not self:HasDamageBuff(buffname, recieved) then
          local buff = type(data) == "number" and {buff = data} or data
          self.damagebuffs[recieved and "recieved" or "dealt"][buffname] = buff
      end
  end
  ```

- **[Island Adventures Core](../examples/case-ia-core.md)** - Shows how to extend the combat component for specialized uses like swimming and sailing.

## See also

- [Health Component](health.md) - For managing entity health and damage
- [Weapon Component](weapon.md) - For weapon damage and effects
- [Inventory Component](inventory.md) - For equipping weapons
- [Armor Component](armor.md) - For damage reduction
- [LootDropper Component](lootdropper.md) - For drops when entities are killed
- [Case Study - The Forge Mod](../examples/case-forge.md) - For an example of extended combat mechanics

## Examples

```lua
-- Create a basic enemy with combat capability
local function MakeEnemy()
    local inst = CreateEntity()
    
    -- Add required components
    inst:AddComponent("health")
    inst:AddComponent("combat")
    
    -- Configure health
    inst.components.health:SetMaxHealth(100)
    
    -- Configure combat
    local combat = inst.components.combat
    combat:SetDefaultDamage(10)
    combat:SetAttackPeriod(3)
    combat:SetRange(2, 3)
    
    -- Add callback when this entity attacks another
    combat.onhitotherfn = function(inst, other, damage)
        -- Do something when hitting other entities
    end
    
    return inst
end
```
