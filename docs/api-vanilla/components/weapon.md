---
id: weapon
title: Weapon
sidebar_position: 5
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Weapon Component

*API Version: 619045*

The Weapon component defines an item that can be used to attack entities. It manages damage values, attack ranges, and special weapon effects like projectiles and elemental damage.

## Basic Usage

```lua
-- Add a weapon component to an entity
local entity = CreateEntity()
entity:AddComponent("weapon")

-- Configure the weapon component
local weapon = entity.components.weapon
weapon:SetDamage(20)
weapon:SetRange(3, 3)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `damage` | Number | Base damage dealt by the weapon |
| `attackrange` | Number | The maximum distance at which the weapon can initiate an attack |
| `hitrange` | Number | The maximum distance at which the weapon can hit targets |
| `projectile` | String | Prefab name of projectile this weapon launches (if any) |
| `stimuli` | String | Type of damage stimuli (e.g., "electric", "fire") |
| `electric_damage_mult` | Number | Damage multiplier for electric-type weapons |
| `electric_wet_damage_mult` | Number | Additional damage multiplier against wet targets |
| `attackwear` | Number | Amount of durability lost when attacking |

## Key Methods

### Damage Configuration

```lua
-- Set base damage
weapon:SetDamage(25)

-- Set attack and hit ranges
weapon:SetRange(4, 4) -- 4 for both attack and hit range

-- Get damage against a specific target
local damage, special_damage = weapon:GetDamage(attacker, target)
```

### Projectile Configuration

```lua
-- Set weapon to shoot projectiles
weapon:SetProjectile("spear_projectile")

-- Set offset for projectile spawning
weapon:SetProjectileOffset(1.5)

-- Set callback for when projectile is launched
weapon:SetOnProjectileLaunch(function(inst, attacker, target)
    -- Do something when projectile is launched
end)

-- Set callback for after projectile is launched
weapon:SetOnProjectileLaunched(function(inst, attacker, target, projectile)
    -- Do something after projectile is launched and projectile entity exists
end)
```

### Special Damage Types

```lua
-- Set weapon to deal electric damage
weapon:SetElectric(1.5, 2.0) -- 1.5x base damage, 2.0x against wet targets

-- Set custom override for stimulus type
weapon:SetOverrideStimuliFn(function(inst, target)
    -- Return a custom stimulus type based on conditions
    return "fire"
end)
```

### Attack Callbacks

```lua
-- Set callback for when weapon attacks
weapon:SetOnAttack(function(inst, attacker, target)
    -- Do something when this weapon hits a target
end)
```

## Attack Process

When a weapon attacks:

1. The game calls `weapon:GetDamage(attacker, target)` to determine damage
2. If the weapon has durability (FiniteUses component), uses are consumed
3. If `onattack` callback is defined, it's triggered
4. If the weapon has a projectile, it's launched at the target

For projectile weapons:

1. `onprojectilelaunch` callback is triggered (if defined)
2. Projectile prefab is spawned
3. Projectile is launched at the target
4. `onprojectilelaunched` callback is triggered (if defined)

## Integration with Other Components

The Weapon component often works with:

- `Combat` - For attack mechanics
- `Inventory` - For equipping the weapon
- `FiniteUses` - For weapon durability
- `Projectile` - For projectile behavior
- `DamageTypeBonus` - For bonus damage against specific types

## See also

- [Combat Component](combat.md) - For attack mechanics
- [Equippable Component](equippable.md) - For weapons that can be equipped
- [Inventory Component](inventory.md) - For storing and equipping weapons
- [Armor Component](armor.md) - For protection against weapon damage
- [Health Component](health.md) - For receiving weapon damage

## Examples

```lua
-- Create a basic sword
local function MakeSword()
    local inst = CreateEntity()
    
    -- Add required components
    inst:AddComponent("weapon")
    inst:AddComponent("inventoryitem")
    inst:AddComponent("finiteuses")
    
    -- Configure weapon
    local weapon = inst.components.weapon
    weapon:SetDamage(30)
    weapon:SetRange(2, 2)
    
    -- Configure durability
    inst.components.finiteuses:SetMaxUses(150)
    inst.components.finiteuses:SetUses(150)
    
    -- Set attack wear
    weapon.attackwear = 1
    
    return inst
end

-- Create a ranged weapon with projectiles
local function MakeBow()
    local inst = CreateEntity()
    
    -- Add required components
    inst:AddComponent("weapon")
    inst:AddComponent("inventoryitem")
    inst:AddComponent("finiteuses")
    
    -- Configure weapon
    local weapon = inst.components.weapon
    weapon:SetDamage(20)
    weapon:SetRange(8, 8)
    weapon:SetProjectile("arrow")
    
    -- Add special effects when projectile launches
    weapon:SetOnProjectileLaunch(function(inst, attacker, target)
        -- Play sound or animation
    end)
    
    return inst
end

-- Create an elemental weapon
local function MakeElectricWeapon()
    local inst = CreateEntity()
    
    -- Add required components
    inst:AddComponent("weapon")
    inst:AddComponent("inventoryitem")
    
    -- Configure weapon
    local weapon = inst.components.weapon
    weapon:SetDamage(15)
    weapon:SetElectric(1.3, 2.0) -- 1.3x damage, 2.0x against wet targets
    
    -- Add effect when attacking
    weapon:SetOnAttack(function(inst, attacker, target)
        -- Create electric visual effect
        SpawnPrefab("electrichitsparks"):AlignToTarget(target)
    end)
    
    return inst
end
``` 
