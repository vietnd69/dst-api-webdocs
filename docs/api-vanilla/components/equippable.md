---
id: equippable
title: Equippable
sidebar_position: 26
---

# Equippable Component

The Equippable component allows items to be equipped by entities with an inventory. It manages equipment slots, equip/unequip callbacks, and equipment effects.

## Basic Usage

```lua
-- Add an equippable component to an entity
local entity = CreateEntity()
entity:AddComponent("equippable")

-- Configure the equippable component
local equippable = entity.components.equippable
equippable.equipslot = EQUIPSLOTS.HANDS
equippable:SetOnEquip(OnEquip)
equippable:SetOnUnequip(OnUnequip)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `equipslot` | String | The slot this item equips into (HANDS, HEAD, BODY) |
| `isequipped` | Boolean | Whether the item is currently equipped |
| `owner` | Entity | The entity that has this item equipped |
| `walkspeedmult` | Number | Walking speed multiplier when equipped |
| `dapperness` | Number | Sanity gain/loss rate when equipped |
| `restrictedtag` | String | Tag required to equip this item |
| `insulated` | Boolean | Whether this item insulates against electricity |
| `equippedmoisture` | Number | Moisture added to wearer |
| `poisonimmunity` | Boolean | Whether this grants poison immunity |
| `dryingrate` | Number | How quickly this item dries the wearer |
| `bonusmaxsanity` | Number | Additional max sanity when equipped |

## Key Methods

### Equip Callbacks

```lua
-- Set callback for when item is equipped
equippable:SetOnEquip(function(inst, owner)
    -- Do something when equipped
    owner.AnimState:OverrideSymbol("swap_object", "swap_axe", "swap_axe")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
end)

-- Set callback for when item is unequipped
equippable:SetOnUnequip(function(inst, owner)
    -- Do something when unequipped
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
end)
```

### Equipment Properties

```lua
-- Set walk speed modifier
equippable.walkspeedmult = 1.2 -- 20% faster walking

-- Set sanity effect
equippable.dapperness = TUNING.DAPPERNESS_MED -- Gain sanity over time

-- Set item as insulated
equippable.insulated = true
```

## Equipment Slots

The standard equipment slots are:

- `EQUIPSLOTS.HANDS` - Hand slot for tools and weapons
- `EQUIPSLOTS.HEAD` - Head slot for hats and helmets
- `EQUIPSLOTS.BODY` - Body slot for clothing and armor
- `EQUIPSLOTS.BACK` - Back slot for backpacks (from the Hamlet DLC)

Custom slots can be defined for mods.

## Integration with Other Components

The Equippable component often works with:

- `Inventory` - For equipping/unequipping items
- `Armor` - For items that provide protection
- `Weapon` - For items that can be used to attack
- `Insulator` - For temperature protection
- `Waterproofer` - For rain protection
- `Fueled` - For items that degrade with use

## Example: Creating an Equippable Weapon

```lua
local function MakeWeapon()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it an inventory item
    inst:AddComponent("inventoryitem")
    
    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable.equipslot = EQUIPSLOTS.HANDS
    
    -- Set up equip/unequip visuals
    inst.components.equippable:SetOnEquip(function(inst, owner)
        owner.AnimState:OverrideSymbol("swap_object", "swap_spear", "swap_spear")
        owner.AnimState:Show("ARM_carry")
        owner.AnimState:Hide("ARM_normal")
    end)
    
    inst.components.equippable:SetOnUnequip(function(inst, owner)
        owner.AnimState:Hide("ARM_carry")
        owner.AnimState:Show("ARM_normal")
    end)
    
    -- Make it a weapon
    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(TUNING.SPEAR_DAMAGE)
    
    return inst
end

-- Example of an equippable hat
local function MakeHat()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it an inventory item
    inst:AddComponent("inventoryitem")
    
    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable.equipslot = EQUIPSLOTS.HEAD
    inst.components.equippable.dapperness = TUNING.DAPPERNESS_SMALL
    
    -- Set up equip/unequip visuals
    inst.components.equippable:SetOnEquip(function(inst, owner)
        owner.AnimState:OverrideSymbol("swap_hat", "swap_tophat", "swap_tophat")
        owner.AnimState:Show("HAT")
        owner.AnimState:Show("HAT_HAIR")
        owner.AnimState:Hide("HAIR_NOHAT")
        owner.AnimState:Hide("HAIR")
    end)
    
    inst.components.equippable:SetOnUnequip(function(inst, owner)
        owner.AnimState:ClearOverrideSymbol("swap_hat")
        owner.AnimState:Hide("HAT")
        owner.AnimState:Hide("HAT_HAIR")
        owner.AnimState:Show("HAIR_NOHAT")
        owner.AnimState:Show("HAIR")
    end)
    
    -- Add insulation
    inst:AddComponent("insulator")
    inst.components.insulator:SetInsulation(TUNING.INSULATION_SMALL)
    
    return inst
end
``` 