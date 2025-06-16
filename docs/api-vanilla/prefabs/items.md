---
id: items
title: Item Prefabs
sidebar_position: 4
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Item Prefabs

Item prefabs define the collectible objects that players can interact with, carry in their inventory, equip, and use in Don't Starve Together.

## Item Creation

Items in Don't Starve Together are defined as prefabs that typically include components like `inventoryitem`, along with other specialized components based on the item's functionality. Here's a typical structure for an item prefab:

```lua
local assets = {
    Asset("ANIM", "anim/spear.zip"),         -- Main item animation
    Asset("ANIM", "anim/swap_spear.zip"),    -- Animation when equipped
}

-- Optional dependencies
local prefabs = {
    "spear_fx",
}

-- Equipment functions
local function onequip(inst, owner)
    -- Change owner's appearance when equipped
    owner.AnimState:OverrideSymbol("swap_object", "swap_spear", "swap_spear")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
end

local function onunequip(inst, owner)
    -- Restore owner's appearance when unequipped
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
end

-- Main creation function
local function fn()
    local inst = CreateEntity()

    -- Add required engine components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    -- Configure physics
    MakeInventoryPhysics(inst)

    -- Configure animations
    inst.AnimState:SetBank("spear")
    inst.AnimState:SetBuild("spear")
    inst.AnimState:PlayAnimation("idle")

    -- Add tags for identification and optimization
    inst:AddTag("sharp")
    inst:AddTag("pointy")
    inst:AddTag("weapon")

    -- Configure inventory floating properties
    MakeInventoryFloatable(inst, "med", 0.05, {1.1, 0.5, 1.1}, true, -9)

    -- Network setup
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add game components
    inst:AddComponent("weapon")
    inst:AddComponent("finiteuses")
    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    inst:AddComponent("equippable")
    
    -- Configure components
    inst.components.weapon:SetDamage(TUNING.SPEAR_DAMAGE)
    inst.components.finiteuses:SetMaxUses(TUNING.SPEAR_USES)
    inst.components.finiteuses:SetUses(TUNING.SPEAR_USES)
    inst.components.finiteuses:SetOnFinished(inst.Remove)
    inst.components.equippable:SetOnEquip(onequip)
    inst.components.equippable:SetOnUnequip(onunequip)
    
    -- Add special behaviors
    MakeHauntableLaunch(inst)
    
    return inst
end

return Prefab("spear", fn, assets, prefabs)
```

## Core Item Components

Most items have several common components:

| Component | Purpose |
|-----------|---------|
| `inventoryitem` | Makes the item collectible and storable in inventory |
| `inspectable` | Allows the item to be examined by players |
| `equippable` | Allows the item to be equipped in a slot (optional) |
| `finiteuses` | Gives the item durability/limited uses (optional) |
| `stackable` | Allows multiple instances to stack (optional) |

## Item Categories

Items in Don't Starve Together fall into several categories:

### Tools and Weapons

Items used for gathering resources or combat:

```lua
-- Tool configuration
inst:AddComponent("tool")
inst.components.tool:SetAction(ACTIONS.CHOP, 1) -- Axe for chopping

-- Weapon configuration
inst:AddComponent("weapon")
inst.components.weapon:SetDamage(34)
inst.components.weapon:SetRange(0.5, 1.5)
```

### Food and Consumables

Items that can be eaten or used up:

```lua
-- Food configuration
inst:AddComponent("edible")
inst.components.edible.foodtype = FOODTYPE.VEGGIE
inst.components.edible.healthvalue = 1
inst.components.edible.hungervalue = 12.5
inst.components.edible.sanityvalue = 0

-- Perishable configuration
inst:AddComponent("perishable")
inst.components.perishable:SetPerishTime(TUNING.PERISH_FAST)
inst.components.perishable:StartPerishing()
```

### Armor and Clothing

Protective items that reduce damage or provide insulation:

```lua
-- Armor configuration
inst:AddComponent("armor")
inst.components.armor:InitCondition(TUNING.ARMORGRASS, TUNING.ARMORGRASS_ABSORPTION)

-- Insulator configuration
inst:AddComponent("insulator")
inst.components.insulator:SetInsulation(TUNING.INSULATION_MED)
```

### Resources

Basic materials used for crafting:

```lua
-- Stackable configuration (for resources)
inst:AddComponent("stackable")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM

-- Fuel configuration
inst:AddComponent("fuel")
inst.components.fuel.fuelvalue = TUNING.SMALL_FUEL
```

## Equipment System

Equipment items use the `equippable` component and equipment callbacks:

```lua
-- Add equippable component
inst:AddComponent("equippable")

-- Configure equipment slot
inst.components.equippable.equipslot = EQUIPSLOTS.HEAD  -- or HANDS, BODY

-- Set callbacks
inst.components.equippable:SetOnEquip(onequip)
inst.components.equippable:SetOnUnequip(onunequip)

-- Equipment effects
inst.components.equippable.walkspeedmult = 1.25  -- Speed bonus
inst.components.equippable.dapperness = TUNING.DAPPERNESS_MED  -- Sanity effect
```

## Durability System

Items with limited uses implement the `finiteuses` component:

```lua
-- Add finite uses component
inst:AddComponent("finiteuses")

-- Configure durability
inst.components.finiteuses:SetMaxUses(100)
inst.components.finiteuses:SetUses(100)
inst.components.finiteuses:SetOnFinished(inst.Remove)  -- What happens when used up

-- Configure use consumption
inst.components.finiteuses:SetConsumption(ACTIONS.CHOP, 1)  -- Uses 1 durability per chop
```

## Stackable Items

Resources and some consumables can stack using the `stackable` component:

```lua
-- Add stackable component
inst:AddComponent("stackable")

-- Configure stack size
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM  -- typically 40
```

## Item Visual Representation

Items have animations for different states:

```lua
-- Idle animation in world or inventory
inst.AnimState:PlayAnimation("idle")

-- When equipped (swap animations)
owner.AnimState:OverrideSymbol("swap_object", "swap_spear", "swap_spear")

-- Special visual effects
local fx = SpawnPrefab("torch_fire")
fx.entity:SetParent(inst.entity)
fx.Transform:SetPosition(0, 0, 0)
```

## Example: Spear Item Prefab

The spear is a basic weapon that demonstrates many common item patterns:

```lua
-- Weapon component defines damage
inst:AddComponent("weapon")
inst.components.weapon:SetDamage(TUNING.SPEAR_DAMAGE)

-- Finite uses component defines durability
inst:AddComponent("finiteuses")
inst.components.finiteuses:SetMaxUses(TUNING.SPEAR_USES)
inst.components.finiteuses:SetUses(TUNING.SPEAR_USES)
inst.components.finiteuses:SetOnFinished(inst.Remove)

-- Equippable component defines how it looks when equipped
inst:AddComponent("equippable")
inst.components.equippable:SetOnEquip(onequip)
inst.components.equippable:SetOnUnequip(onunequip)
```

## Specialized Item Behaviors

Many items have unique behaviors implemented through specialized components:

```lua
-- A book that can be read
inst:AddComponent("book")
inst.components.book:SetOnRead(onread)
inst.components.book:SetReadSanity(TUNING.SANITY_HUGE)

-- A light source
inst:AddComponent("lighter")
inst.components.lighter:SetOnLightFn(onlight)

-- A tool that can perform actions
inst:AddComponent("tool")
inst.components.tool:SetAction(ACTIONS.HAMMER, 1)

-- A container that can store items
inst:AddComponent("container")
inst.components.container:WidgetSetup("backpack")
```

## Item Tags

Tags are used for quick identification and optimization:

```lua
-- Common item tags
inst:AddTag("sharp")     -- Can cut things
inst:AddTag("weapon")    -- Used as a weapon
inst:AddTag("heavy")     -- Causes heavy lifting state
inst:AddTag("cooker")    -- Can cook food
inst:AddTag("frozen")    -- Is frozen
inst:AddTag("irreplaceable")  -- Cannot be replaced when destroyed
``` 
