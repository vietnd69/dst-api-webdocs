---
id: armor
title: Armor Component
sidebar_position: 14
last_updated: 2023-07-06
version: 619045
---

# Armor Component

The Armor component allows entities to provide protection against damage. It manages damage absorption, durability, and special protection effects.

## Basic Usage

```lua
-- Add an armor component to an entity
local entity = CreateEntity()
entity:AddComponent("armor")

-- Configure the armor component
local armor = entity.components.armor
armor:SetAbsorption(0.8) -- 80% damage absorption
armor:SetMaxCondition(100)
armor:SetCondition(100)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `condition` | Number | Current durability of the armor |
| `maxcondition` | Number | Maximum durability of the armor |
| `absorb_percent` | Number | Percentage of damage absorbed (0-1) |
| `tags` | Table | Tags for specialized protection |
| `weakness` | Table | Damage types this armor is weak against |
| `immunetags` | Table | Damage types this armor provides immunity to |
| `onfinished` | Function | Called when armor breaks |

## Key Methods

```lua
-- Set damage absorption percentage
armor:SetAbsorption(0.8) -- 80% damage absorption

-- Set durability
armor:SetMaxCondition(200)
armor:SetCondition(200)

-- Take damage
local damage_taken = armor:TakeDamage(10)

-- Add immunity to specific damage types
armor:AddImmunity("fire")

-- Add weakness to specific damage types
armor:AddWeakness("electric", 1.5) -- Takes 50% more damage

-- Set callback for when armor breaks
armor:SetOnFinished(function(inst)
    -- Do something when armor breaks
    inst:Remove()
end)
```

> **Related functions**: When an entity with armor is damaged, the [Combat Component](combat.md) calls the armor's `TakeDamage()` function. The armor then calculates damage reduction based on its `absorb_percent` value and any special immunities or weaknesses. The remaining damage is passed to the [Health Component](health.md) via `DoDelta()`.

## Armor Types

Armor can be specialized for different damage types:

- **Physical Armor**: Protects against standard attacks
- **Elemental Armor**: Protects against specific elements (fire, cold, electric)
- **Magical Armor**: Protects against magical/shadow damage
- **Specialized Armor**: Protects against specific enemy types

## Integration with Other Components

The Armor component often works with:

- `Equippable` - For armor that can be worn
- `Inventoryitem` - For armor that can be carried
- `Combat` - For damage calculation
- `Health` - For protecting health
- `FiniteUses` - For armor durability

## See also

- [Combat Component](combat.md) - For damage calculation
- [Equippable Component](equippable.md) - For wearable armor
- [Health Component](health.md) - For health protection
- [Weapon Component](weapon.md) - For offensive counterpart
- [Inventoryitem Component](other-components.md) - For armor as items

## Example: Creating a Basic Armor Item

```lua
local function MakeArmor()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it an inventory item
    inst:AddComponent("inventoryitem")
    
    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable.equipslot = EQUIPSLOTS.BODY
    
    -- Set up equip/unequip visuals
    inst.components.equippable:SetOnEquip(function(inst, owner)
        owner.AnimState:OverrideSymbol("swap_body", "armor_wood", "swap_body")
    end)
    
    inst.components.equippable:SetOnUnequip(function(inst, owner)
        owner.AnimState:ClearOverrideSymbol("swap_body")
    end)
    
    -- Make it armor
    inst:AddComponent("armor")
    inst.components.armor:SetAbsorption(0.8) -- 80% damage absorption
    inst.components.armor:SetMaxCondition(TUNING.ARMORWOOD)
    
    -- Add break effect
    inst.components.armor:SetOnFinished(function(inst)
        -- Play breaking sound
        inst.SoundEmitter:PlaySound("dontstarve/wilson/use_armour_break")
        inst:Remove()
    end)
    
    return inst
end

-- Example of specialized armor
local function MakeFireArmor()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it an inventory item
    inst:AddComponent("inventoryitem")
    
    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable.equipslot = EQUIPSLOTS.BODY
    
    -- Make it armor
    inst:AddComponent("armor")
    inst.components.armor:SetAbsorption(0.6) -- 60% general damage absorption
    inst.components.armor:SetMaxCondition(TUNING.ARMOR_FOOTBALLHAT)
    
    -- Add fire immunity
    inst.components.armor:AddImmunity("fire")
    
    -- Add weakness to water
    inst.components.armor:AddWeakness("water", 2.0) -- Takes double damage from water
    
    return inst
end
