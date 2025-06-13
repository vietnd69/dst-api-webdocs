---
id: project-tools
title: Custom Tool Set Project
sidebar_position: 14
---

# Custom Tool Set Project

This tutorial guides you through creating a complete mod that adds a set of custom tools to Don't Starve Together. We'll create three new tools: a Golden Axe, a Gem Pickaxe, and a Magical Shovel, each with unique properties and abilities.

## Project Overview

By the end of this tutorial, you'll have created:

- A Golden Axe that chops trees faster and has higher durability
- A Gem Pickaxe that mines resources with a chance for bonus drops
- A Magical Shovel that has a chance to spawn rare items when digging

## Prerequisites

- Basic understanding of Lua programming
- Familiarity with Don't Starve Together modding setup
- Knowledge of prefabs and components

## Project Structure

```
MyToolsMod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   └── prefabs/
│       ├── goldenaxe.lua
│       ├── gempickaxe.lua
│       └── magicalshovel.lua
└── images/
    └── inventoryimages/
        ├── goldenaxe.tex
        ├── gempickaxe.tex
        └── magicalshovel.tex
```

## Step 1: Setting Up the Mod

First, let's create the basic mod structure and files:

### modinfo.lua

```lua
name = "Custom Tool Set"
description = "Adds three new powerful tools to the game: Golden Axe, Gem Pickaxe, and Magical Shovel."
author = "Your Name"
version = "1.0.0"

-- Compatible with Don't Starve Together
dst_compatible = true
dont_starve_compatible = false
reign_of_giants_compatible = false

-- Tags to help users find the mod
all_clients_require_mod = true
client_only_mod = false

-- Icon and priority
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Mod configuration options
configuration_options = {
    {
        name = "TOOL_DURABILITY",
        label = "Tool Durability",
        options = {
            {description = "Low", data = 0.75},
            {description = "Normal", data = 1.0},
            {description = "High", data = 1.5},
            {description = "Very High", data = 2.0}
        },
        default = 1.0
    },
    {
        name = "SPECIAL_EFFECTS",
        label = "Special Effects",
        options = {
            {description = "Disabled", data = false},
            {description = "Enabled", data = true}
        },
        default = true
    }
}
```

### modmain.lua

```lua
-- Assets to preload
Assets = {
    Asset("IMAGE", "images/inventoryimages/goldenaxe.tex"),
    Asset("ATLAS", "images/inventoryimages/goldenaxe.xml"),
    Asset("IMAGE", "images/inventoryimages/gempickaxe.tex"),
    Asset("ATLAS", "images/inventoryimages/gempickaxe.xml"),
    Asset("IMAGE", "images/inventoryimages/magicalshovel.tex"),
    Asset("ATLAS", "images/inventoryimages/magicalshovel.xml"),
}

-- Prefabs to register
PrefabFiles = {
    "goldenaxe",
    "gempickaxe",
    "magicalshovel",
}

-- Configuration
local TOOL_DURABILITY = GetModConfigData("TOOL_DURABILITY")
local SPECIAL_EFFECTS = GetModConfigData("SPECIAL_EFFECTS")

-- Add recipes
local goldenaxe = Recipe("goldenaxe", 
    {Ingredient("axe", 1), Ingredient("goldnugget", 3)}, 
    RECIPETABS.TOOLS, 
    TECH.SCIENCE_ONE)
goldenaxe.atlas = "images/inventoryimages/goldenaxe.xml"

local gempickaxe = Recipe("gempickaxe", 
    {Ingredient("pickaxe", 1), Ingredient("bluegem", 1), Ingredient("redgem", 1)}, 
    RECIPETABS.TOOLS, 
    TECH.SCIENCE_TWO)
gempickaxe.atlas = "images/inventoryimages/gempickaxe.xml"

local magicalshovel = Recipe("magicalshovel", 
    {Ingredient("shovel", 1), Ingredient("purplegem", 1), Ingredient("nightmarefuel", 5)}, 
    RECIPETABS.TOOLS, 
    TECH.MAGIC_THREE)
magicalshovel.atlas = "images/inventoryimages/magicalshovel.xml"

-- Pass config values to prefabs
GLOBAL.TUNING.CUSTOM_TOOLS = {
    DURABILITY_MULT = TOOL_DURABILITY,
    SPECIAL_EFFECTS = SPECIAL_EFFECTS
}
```

## Step 2: Creating the Golden Axe

Now let's create our first tool, the Golden Axe:

### scripts/prefabs/goldenaxe.lua

```lua
local assets = {
    Asset("ANIM", "anim/goldenaxe.zip"),
    Asset("ANIM", "anim/swap_goldenaxe.zip"),
    Asset("ATLAS", "images/inventoryimages/goldenaxe.xml"),
    Asset("IMAGE", "images/inventoryimages/goldenaxe.tex"),
}

local function OnFinished(inst)
    inst:Remove()
end

local function OnEquip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "swap_goldenaxe", "swap_goldenaxe")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
end

local function OnUnequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    MakeInventoryPhysics(inst)

    inst.AnimState:SetBank("goldenaxe")
    inst.AnimState:SetBuild("goldenaxe")
    inst.AnimState:PlayAnimation("idle")

    -- Make it a tool and weapon
    inst:AddTag("sharp")
    inst:AddTag("tool")
    inst:AddTag("weapon")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    -- Durability multiplier from config
    local durability_mult = TUNING.CUSTOM_TOOLS.DURABILITY_MULT or 1.0

    -- Add components
    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(TUNING.AXE_DAMAGE * 1.2)

    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.CHOP, 1.5) -- 50% faster chopping

    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(TUNING.AXE_USES * durability_mult * 1.5)
    inst.components.finiteuses:SetUses(TUNING.AXE_USES * durability_mult * 1.5)
    inst.components.finiteuses:SetOnFinished(OnFinished)
    inst.components.finiteuses:SetConsumption(ACTIONS.CHOP, 1)

    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.atlasname = "images/inventoryimages/goldenaxe.xml"

    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(OnEquip)
    inst.components.equippable:SetOnUnequip(OnUnequip)

    -- Special effect: chance to get extra logs
    if TUNING.CUSTOM_TOOLS.SPECIAL_EFFECTS then
        inst:ListenForEvent("working", function(inst, data)
            if data.target and data.target:HasTag("tree") and math.random() < 0.2 then
                -- 20% chance to spawn an extra log
                local log = SpawnPrefab("log")
                if log then
                    log.Transform:SetPosition(data.target.Transform:GetWorldPosition())
                    log.Physics:Teleport(log.Transform:GetWorldPosition())
                end
            end
        end)
    end

    MakeHauntableLaunch(inst)

    return inst
end

return Prefab("goldenaxe", fn, assets)
```

## Step 3: Creating the Gem Pickaxe

Let's create our second tool, the Gem Pickaxe:

### scripts/prefabs/gempickaxe.lua

```lua
local assets = {
    Asset("ANIM", "anim/gempickaxe.zip"),
    Asset("ANIM", "anim/swap_gempickaxe.zip"),
    Asset("ATLAS", "images/inventoryimages/gempickaxe.xml"),
    Asset("IMAGE", "images/inventoryimages/gempickaxe.tex"),
}

local function OnFinished(inst)
    inst:Remove()
end

local function OnEquip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "swap_gempickaxe", "swap_gempickaxe")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
end

local function OnUnequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    MakeInventoryPhysics(inst)

    inst.AnimState:SetBank("gempickaxe")
    inst.AnimState:SetBuild("gempickaxe")
    inst.AnimState:PlayAnimation("idle")

    -- Make it a tool and weapon
    inst:AddTag("sharp")
    inst:AddTag("tool")
    inst:AddTag("weapon")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    -- Durability multiplier from config
    local durability_mult = TUNING.CUSTOM_TOOLS.DURABILITY_MULT or 1.0

    -- Add components
    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(TUNING.PICKAXE_DAMAGE * 1.2)

    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.MINE, 1.3) -- 30% faster mining

    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(TUNING.PICKAXE_USES * durability_mult * 1.5)
    inst.components.finiteuses:SetUses(TUNING.PICKAXE_USES * durability_mult * 1.5)
    inst.components.finiteuses:SetOnFinished(OnFinished)
    inst.components.finiteuses:SetConsumption(ACTIONS.MINE, 1)

    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.atlasname = "images/inventoryimages/gempickaxe.xml"

    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(OnEquip)
    inst.components.equippable:SetOnUnequip(OnUnequip)

    -- Special effect: chance to get bonus gems when mining
    if TUNING.CUSTOM_TOOLS.SPECIAL_EFFECTS then
        inst:ListenForEvent("working", function(inst, data)
            if data.target and data.target:HasTag("boulder") and math.random() < 0.15 then
                -- 15% chance to spawn a random gem
                local gems = {"redgem", "bluegem", "purplegem", "yellowgem", "orangegem", "greengem"}
                local gem = SpawnPrefab(gems[math.random(#gems)])
                if gem then
                    gem.Transform:SetPosition(data.target.Transform:GetWorldPosition())
                    gem.Physics:Teleport(gem.Transform:GetWorldPosition())
                end
            end
        end)
    end

    MakeHauntableLaunch(inst)

    return inst
end

return Prefab("gempickaxe", fn, assets)
```

## Step 4: Creating the Magical Shovel

Finally, let's create our third tool, the Magical Shovel:

### scripts/prefabs/magicalshovel.lua

```lua
local assets = {
    Asset("ANIM", "anim/magicalshovel.zip"),
    Asset("ANIM", "anim/swap_magicalshovel.zip"),
    Asset("ATLAS", "images/inventoryimages/magicalshovel.xml"),
    Asset("IMAGE", "images/inventoryimages/magicalshovel.tex"),
}

local function OnFinished(inst)
    inst:Remove()
end

local function OnEquip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "swap_magicalshovel", "swap_magicalshovel")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
end

local function OnUnequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    MakeInventoryPhysics(inst)

    inst.AnimState:SetBank("magicalshovel")
    inst.AnimState:SetBuild("magicalshovel")
    inst.AnimState:PlayAnimation("idle")

    -- Make it a tool and weapon
    inst:AddTag("sharp")
    inst:AddTag("tool")
    inst:AddTag("weapon")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    -- Durability multiplier from config
    local durability_mult = TUNING.CUSTOM_TOOLS.DURABILITY_MULT or 1.0

    -- Add components
    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(TUNING.SHOVEL_DAMAGE * 1.2)

    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.DIG, 1.4) -- 40% faster digging

    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(TUNING.SHOVEL_USES * durability_mult * 1.5)
    inst.components.finiteuses:SetUses(TUNING.SHOVEL_USES * durability_mult * 1.5)
    inst.components.finiteuses:SetOnFinished(OnFinished)
    inst.components.finiteuses:SetConsumption(ACTIONS.DIG, 1)

    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.atlasname = "images/inventoryimages/magicalshovel.xml"

    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(OnEquip)
    inst.components.equippable:SetOnUnequip(OnUnequip)

    -- Special effect: chance to find rare items when digging
    if TUNING.CUSTOM_TOOLS.SPECIAL_EFFECTS then
        inst:ListenForEvent("working", function(inst, data)
            if data.target and data.action == ACTIONS.DIG and math.random() < 0.1 then
                -- 10% chance to spawn a rare item
                local rare_items = {
                    "trinket_1", "trinket_2", "trinket_3", 
                    "goldnugget", "redgem", "bluegem", 
                    "gears", "thulecite_pieces"
                }
                local item = SpawnPrefab(rare_items[math.random(#rare_items)])
                if item then
                    item.Transform:SetPosition(data.target.Transform:GetWorldPosition())
                    item.Physics:Teleport(item.Transform:GetWorldPosition())
                    
                    -- Add a visual effect
                    local fx = SpawnPrefab("lavaarena_player_revive_from_corpse_fx")
                    if fx then
                        fx.Transform:SetPosition(item.Transform:GetWorldPosition())
                    end
                end
            end
        end)
    end

    MakeHauntableLaunch(inst)

    return inst
end

return Prefab("magicalshovel", fn, assets)
```

## Step 5: Creating the Art Assets

For this mod to work properly, you'll need to create the following art assets:

1. **Inventory Images**:
   - `images/inventoryimages/goldenaxe.tex` and `.xml`
   - `images/inventoryimages/gempickaxe.tex` and `.xml`
   - `images/inventoryimages/magicalshovel.tex` and `.xml`

2. **Animation Files**:
   - `anim/goldenaxe.zip` and `anim/swap_goldenaxe.zip`
   - `anim/gempickaxe.zip` and `anim/swap_gempickaxe.zip`
   - `anim/magicalshovel.zip` and `anim/swap_magicalshovel.zip`

You can create these using Spriter and then export them to the appropriate formats. Alternatively, you can modify existing game assets as a starting point.

## Step 6: Testing and Debugging

To test your mod:

1. Place your mod folder in the Don't Starve Together mods directory
2. Enable the mod in the game's mod menu
3. Start a new game and check if you can craft the tools
4. Test each tool's functionality and special effects

### Common Issues and Solutions:

- **Missing Assets**: Ensure all art assets are properly named and placed in the correct directories
- **Recipe Not Appearing**: Check that your recipes are correctly registered in modmain.lua
- **Special Effects Not Working**: Verify that the event listeners are properly set up
- **Animation Issues**: Check that your animation files are correctly formatted and referenced

## Step 7: Publishing Your Mod

Once your mod is working correctly, you can publish it to the Steam Workshop:

1. Create a `modicon.tex` and `modicon.xml` (512x512 pixels) for your mod
2. Update your modinfo.lua with a detailed description
3. Use the in-game mod uploader or the Don't Starve Mod Tools on Steam
4. Provide clear instructions and screenshots in your Workshop description

## Extending the Mod

Here are some ideas for extending this mod:

- Add more tools with different special effects
- Create tool upgrades that require the custom tools as ingredients
- Add special animations or particle effects when using the tools
- Create a custom tech tree for more advanced tools
- Add compatibility with other popular mods

## Conclusion

Congratulations! You've created a complete mod that adds three unique tools to Don't Starve Together. This project demonstrates many important modding concepts:

- Creating custom prefabs
- Adding recipes
- Working with components
- Implementing special effects
- Using mod configuration options

Use what you've learned here as a foundation for creating more complex mods in the future!