---
id: recipe-mod
title: Recipe Mod
sidebar_position: 4
last_updated: 2023-07-06
---

# Creating Custom Recipes

This tutorial walks through creating custom crafting recipes for Don't Starve Together. We'll create several types of recipes with varying complexity and requirements.

## Project Overview

We'll create a mod that adds these recipes:
- Basic tool recipe (Enhanced Axe)
- Advanced equipment recipe (Frost Armor)
- Character-specific recipe (Willow's Fire Staff)
- Tech-locked recipe (requiring specific crafting stations)
- Recipe with custom crafting category

## Step 1: Set Up the Mod Structure

Create these folders and files:

```
custom_recipes_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   └── prefabs/
│       ├── enhanced_axe.lua
│       ├── frost_armor.lua
│       └── fire_staff.lua
└── images/
    └── inventoryimages/
        ├── enhanced_axe.tex
        ├── enhanced_axe.xml
        ├── frost_armor.tex
        ├── frost_armor.xml
        ├── fire_staff.tex
        └── fire_staff.xml
```

## Step 2: Create the modinfo.lua File

```lua
name = "Custom Recipes"
description = "Adds several new craftable items to the game"
author = "Your Name"
version = "1.0.0"

-- Compatible with Don't Starve Together
dst_compatible = true

-- Not compatible with Don't Starve
dont_starve_compatible = false
reign_of_giants_compatible = false

-- This mod is required on clients
all_clients_require_mod = true

-- This mod is not a client-only mod
client_only_mod = false

-- Icon displayed in the server list
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Tags that describe your mod
server_filter_tags = {
    "crafting",
    "items"
}

-- Configuration options
configuration_options = {
    {
        name = "recipe_difficulty",
        label = "Recipe Difficulty",
        options = {
            {description = "Easy", data = "easy"},
            {description = "Normal", data = "normal"},
            {description = "Hard", data = "hard"}
        },
        default = "normal"
    },
    {
        name = "character_recipes",
        label = "Character-Specific Recipes",
        options = {
            {description = "Enabled", data = true},
            {description = "Disabled", data = false}
        },
        default = true
    }
}
```

## Step 3: Create the modmain.lua File

```lua
-- Import globals into the environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add asset files
Assets = {
    -- Inventory images
    Asset("IMAGE", "images/inventoryimages/enhanced_axe.tex"),
    Asset("ATLAS", "images/inventoryimages/enhanced_axe.xml"),
    Asset("IMAGE", "images/inventoryimages/frost_armor.tex"),
    Asset("ATLAS", "images/inventoryimages/frost_armor.xml"),
    Asset("IMAGE", "images/inventoryimages/fire_staff.tex"),
    Asset("ATLAS", "images/inventoryimages/fire_staff.xml"),
}

-- Register prefabs
PrefabFiles = {
    "enhanced_axe",
    "frost_armor",
    "fire_staff",
}

-- Add custom strings
STRINGS.NAMES.ENHANCED_AXE = "Enhanced Axe"
STRINGS.RECIPE_DESC.ENHANCED_AXE = "Chops trees faster and lasts longer."
STRINGS.CHARACTERS.GENERIC.DESCRIBE.ENHANCED_AXE = "This axe feels much sturdier."

STRINGS.NAMES.FROST_ARMOR = "Frost Armor"
STRINGS.RECIPE_DESC.FROST_ARMOR = "Provides protection and cold resistance."
STRINGS.CHARACTERS.GENERIC.DESCRIBE.FROST_ARMOR = "It's cold to the touch but keeps me warm."

STRINGS.NAMES.FIRE_STAFF = "Fire Staff"
STRINGS.RECIPE_DESC.FIRE_STAFF = "Willow's special fire staff."
STRINGS.CHARACTERS.GENERIC.DESCRIBE.FIRE_STAFF = "It radiates heat."
STRINGS.CHARACTERS.WILLOW.DESCRIBE.FIRE_STAFF = "My very own fire maker!"

-- Get recipe difficulty from mod settings
local difficulty = GetModConfigData("recipe_difficulty")
local character_recipes = GetModConfigData("character_recipes")

-- Define ingredient sets based on difficulty
local ingredient_sets = {
    easy = {
        enhanced_axe = {Ingredient("twigs", 2), Ingredient("flint", 2), Ingredient("goldnugget", 1)},
        frost_armor = {Ingredient("silk", 3), Ingredient("ice", 5), Ingredient("bluegem", 1)},
        fire_staff = {Ingredient("twigs", 2), Ingredient("charcoal", 2), Ingredient("redgem", 1)}
    },
    normal = {
        enhanced_axe = {Ingredient("twigs", 3), Ingredient("flint", 3), Ingredient("goldnugget", 2)},
        frost_armor = {Ingredient("silk", 6), Ingredient("ice", 8), Ingredient("bluegem", 2)},
        fire_staff = {Ingredient("twigs", 4), Ingredient("charcoal", 4), Ingredient("redgem", 2)}
    },
    hard = {
        enhanced_axe = {Ingredient("twigs", 4), Ingredient("flint", 4), Ingredient("goldnugget", 3)},
        frost_armor = {Ingredient("silk", 8), Ingredient("ice", 10), Ingredient("bluegem", 3)},
        fire_staff = {Ingredient("twigs", 6), Ingredient("charcoal", 6), Ingredient("redgem", 3)}
    }
}

-- Get the appropriate ingredient set
local ingredients = ingredient_sets[difficulty]

-- 1. Basic Tool Recipe (Enhanced Axe)
AddRecipe("enhanced_axe", 
    ingredients.enhanced_axe, 
    GLOBAL.RECIPETABS.TOOLS,  -- Add to Tools tab
    GLOBAL.TECH.SCIENCE_ONE,  -- Requires Science Machine
    nil, nil, nil, nil, nil,  -- Default values for other parameters
    "images/inventoryimages/enhanced_axe.xml")

-- 2. Advanced Equipment Recipe (Frost Armor)
AddRecipe("frost_armor", 
    ingredients.frost_armor, 
    GLOBAL.RECIPETABS.SURVIVAL,  -- Add to Survival tab
    GLOBAL.TECH.SCIENCE_TWO,     -- Requires Alchemy Engine
    nil, nil, nil, nil, nil, 
    "images/inventoryimages/frost_armor.xml")

-- 3. Character-specific Recipe (Willow's Fire Staff)
if character_recipes then
    AddRecipe("fire_staff", 
        ingredients.fire_staff, 
        GLOBAL.RECIPETABS.MAGIC,  -- Add to Magic tab
        GLOBAL.TECH.MAGIC_TWO,    -- Requires Prestihatitator
        nil, nil, nil, "willow",  -- Only Willow can craft this
        nil, 
        "images/inventoryimages/fire_staff.xml")
end

-- 4. Create a Custom Crafting Tab
GLOBAL.RECIPETABS.CUSTOMCRAFTING = {str = "CUSTOMCRAFTING", sort = 999, icon = "tab_crafting.tex", icon_atlas = "images/hud.xml"}

-- 5. Add a recipe to the custom tab
AddRecipe("berries", 
    {Ingredient("seeds", 1)}, 
    GLOBAL.RECIPETABS.CUSTOMCRAFTING,  -- Add to our custom tab
    GLOBAL.TECH.NONE,                  -- No tech requirement
    nil, nil, nil, nil, nil)

-- 6. Add a recipe with multiple tech requirements
AddRecipe("bluegem", 
    {Ingredient("ice", 10), Ingredient("nitre", 2)}, 
    GLOBAL.RECIPETABS.REFINE,  -- Add to Refine tab
    {GLOBAL.TECH.SCIENCE_TWO, GLOBAL.TECH.MAGIC_TWO},  -- Requires BOTH Alchemy Engine AND Prestihatitator
    nil, nil, nil, nil, nil)

-- 7. Add a recipe with a custom placer
AddRecipe("researchlab2", 
    {Ingredient("boards", 4), Ingredient("cutstone", 2), Ingredient("goldnugget", 1)}, 
    GLOBAL.RECIPETABS.SCIENCE,  -- Add to Science tab
    GLOBAL.TECH.SCIENCE_ONE,    -- Requires Science Machine
    "researchlab2_placer",      -- Use the alchemy engine placer
    nil, nil, nil, nil)

-- 8. Add a recipe with a custom builder tag requirement
AddRecipe("purplegem", 
    {Ingredient("redgem", 1), Ingredient("bluegem", 1)}, 
    GLOBAL.RECIPETABS.MAGIC,  -- Add to Magic tab
    GLOBAL.TECH.MAGIC_THREE,  -- Requires Shadow Manipulator
    nil, nil, nil, nil, "gem_alchemist")  -- Requires "gem_alchemist" tag

-- Add the gem_alchemist tag to Wickerbottom
AddPrefabPostInit("wickerbottom", function(inst)
    inst:AddTag("gem_alchemist")
end)

-- 9. Add a recipe that unlocks for everyone after a specific action
AddRecipe("nightmarefuel", 
    {Ingredient("petals_evil", 3)}, 
    GLOBAL.RECIPETABS.MAGIC,  -- Add to Magic tab
    GLOBAL.TECH.MAGIC_TWO,    -- Requires Prestihatitator
    nil, nil, nil, nil, nil)

-- Lock the recipe initially
AddPrefabPostInit("world", function(inst)
    if GLOBAL.TheWorld.ismastersim then
        inst:DoTaskInTime(0, function()
            for _, player in ipairs(GLOBAL.AllPlayers) do
                player.components.builder:UnlockRecipe("nightmarefuel")
            end
        end)
    end
end)

-- 10. Add a recipe with a custom action when crafted
AddRecipe("telestaff", 
    {Ingredient("nightmarefuel", 4), Ingredient("purplegem", 2), Ingredient("livinglog", 2)}, 
    GLOBAL.RECIPETABS.MAGIC,  -- Add to Magic tab
    GLOBAL.TECH.MAGIC_THREE,  -- Requires Shadow Manipulator
    nil, nil, nil, nil, nil)

-- Add a custom action when the telestaff is crafted
AddComponentPostInit("builder", function(self)
    local OldDoBuild = self.DoBuild
    self.DoBuild = function(self, recname, ...)
        local result = OldDoBuild(self, recname, ...)
        
        if recname == "telestaff" and result then
            -- Do something special when telestaff is crafted
            self.inst.components.sanity:DoDelta(-15)  -- Cost sanity to craft
            self.inst:PushEvent("learnedteleportation")  -- Custom event
            
            -- Spawn a special effect
            local fx = GLOBAL.SpawnPrefab("collapse_small")
            fx.Transform:SetPosition(self.inst.Transform:GetWorldPosition())
        end
        
        return result
    end
end)
```

## Step 4: Create the Enhanced Axe Prefab

Create `scripts/prefabs/enhanced_axe.lua`:

```lua
local assets = {
    Asset("ANIM", "anim/axe.zip"),  -- Reuse axe animation
    Asset("ANIM", "anim/swap_axe.zip"),
    
    Asset("IMAGE", "images/inventoryimages/enhanced_axe.tex"),
    Asset("ATLAS", "images/inventoryimages/enhanced_axe.xml"),
}

-- Function called when the axe is equipped
local function onequip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "swap_axe", "swap_axe")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
    
    -- Apply a gold tint to the axe when equipped
    owner.AnimState:SetMultColour(1, 0.9, 0.5, 1)
end

-- Function called when the axe is unequipped
local function onunequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
    owner.AnimState:SetMultColour(1, 1, 1, 1)
end

-- Main function to create the enhanced axe
local function fn()
    -- Create the entity
    local inst = CreateEntity()

    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    -- Set up physics
    MakeInventoryPhysics(inst)

    -- Set up animation
    inst.AnimState:SetBank("axe")
    inst.AnimState:SetBuild("axe")
    inst.AnimState:PlayAnimation("idle")
    
    -- Apply a gold tint to the axe
    inst.AnimState:SetMultColour(1, 0.9, 0.5, 1)

    -- Add tags
    inst:AddTag("sharp")
    inst:AddTag("tool")

    -- Make the entity pristine for networking
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add components
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "enhanced_axe"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/enhanced_axe.xml"

    -- Make it work as a tool
    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.CHOP, 1.5) -- 50% faster chopping

    -- Make it work as a weapon
    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(27.2) -- 20% more damage than regular axe

    -- Add durability
    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(150) -- 50% more uses than regular axe
    inst.components.finiteuses:SetUses(150)
    inst.components.finiteuses:SetOnFinished(inst.Remove)
    inst.components.finiteuses:SetConsumption(ACTIONS.CHOP, 1)

    -- Make it inspectable
    inst:AddComponent("inspectable")

    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(onequip)
    inst.components.equippable:SetOnUnequip(onunequip)

    return inst
end

-- Register the prefab
return Prefab("enhanced_axe", fn, assets)
```

## Step 5: Create the Frost Armor Prefab

Create `scripts/prefabs/frost_armor.lua`:

```lua
local assets = {
    Asset("ANIM", "anim/armor_marble.zip"),  -- Reuse marble armor animation
    
    Asset("IMAGE", "images/inventoryimages/frost_armor.tex"),
    Asset("ATLAS", "images/inventoryimages/frost_armor.xml"),
}

-- Function called when the armor is equipped
local function onequip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_body", "armor_marble", "swap_body")
    
    -- Apply a blue tint to the armor
    owner.AnimState:SetMultColour(0.7, 0.8, 1, 1)
    
    -- Add cold resistance when equipped
    if owner.components.temperature ~= nil then
        owner.components.temperature:SetModifier("frost_armor", 80)
    end
    
    -- Add a frost aura effect
    if not inst.frost_task then
        inst.frost_task = inst:DoPeriodicTask(2, function()
            -- Create frost breath effect
            local fx = SpawnPrefab("frostbreath")
            if fx then
                fx.Transform:SetPosition(owner.Transform:GetWorldPosition())
            end
            
            -- Cool nearby enemies
            local x, y, z = owner.Transform:GetWorldPosition()
            local ents = TheSim:FindEntities(x, y, z, 3, {"_combat"}, {"player", "companion", "INLIMBO"})
            
            for _, ent in ipairs(ents) do
                if ent.components.temperature then
                    ent.components.temperature:DoDelta(-1)
                end
            end
        end)
    end
end

-- Function called when the armor is unequipped
local function onunequip(inst, owner)
    owner.AnimState:ClearOverrideSymbol("swap_body")
    owner.AnimState:SetMultColour(1, 1, 1, 1)
    
    -- Remove cold resistance
    if owner.components.temperature ~= nil then
        owner.components.temperature:RemoveModifier("frost_armor")
    end
    
    -- Remove frost aura effect
    if inst.frost_task then
        inst.frost_task:Cancel()
        inst.frost_task = nil
    end
end

-- Main function to create the frost armor
local function fn()
    -- Create the entity
    local inst = CreateEntity()

    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    -- Set up physics
    MakeInventoryPhysics(inst)

    -- Set up animation
    inst.AnimState:SetBank("armor_marble")
    inst.AnimState:SetBuild("armor_marble")
    inst.AnimState:PlayAnimation("anim")
    
    -- Apply a blue tint to the armor
    inst.AnimState:SetMultColour(0.7, 0.8, 1, 1)

    -- Add tags
    inst:AddTag("armor")

    -- Make the entity pristine for networking
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add components
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "frost_armor"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/frost_armor.xml"

    -- Make it work as armor
    inst:AddComponent("armor")
    inst.components.armor:InitCondition(600, 0.8)  -- 600 durability, 80% damage absorption
    
    -- Add insulation
    inst:AddComponent("insulator")
    inst.components.insulator:SetInsulation(240)  -- 4 minutes of insulation
    
    -- Make it inspectable
    inst:AddComponent("inspectable")

    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable.equipslot = EQUIPSLOTS.BODY
    inst.components.equippable:SetOnEquip(onequip)
    inst.components.equippable:SetOnUnequip(onunequip)

    return inst
end

-- Register the prefab
return Prefab("frost_armor", fn, assets)
```

## Step 6: Create the Fire Staff Prefab

Create `scripts/prefabs/fire_staff.lua`:

```lua
local assets = {
    Asset("ANIM", "anim/firestaff.zip"),  -- Reuse firestaff animation
    Asset("ANIM", "anim/swap_firestaff.zip"),
    
    Asset("IMAGE", "images/inventoryimages/fire_staff.tex"),
    Asset("ATLAS", "images/inventoryimages/fire_staff.xml"),
}

-- Function to spawn fire when the staff is used
local function onuse(inst, target, pos)
    -- Create a campfire at the target position
    local fire = SpawnPrefab("campfire")
    fire.Transform:SetPosition(pos:Get())
    
    -- Make the fire last longer for Willow
    if inst.components.finiteuses and inst.components.inventoryitem.owner and 
       inst.components.inventoryitem.owner.prefab == "willow" then
        fire.components.fueled:SetPercent(1)  -- Full fuel
        fire.components.fueled.rate = fire.components.fueled.rate * 0.5  -- Burns half as fast
    end
    
    -- Create a fire effect
    local fx = SpawnPrefab("firering_fx")
    fx.Transform:SetPosition(pos:Get())
    
    -- Use up some durability
    if inst.components.finiteuses then
        inst.components.finiteuses:Use(1)
    end
    
    return true
end

-- Function called when the staff is equipped
local function onequip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "swap_firestaff", "swap_firestaff")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
    
    -- Add a light when equipped
    if inst.components.lighttweener == nil then
        inst:AddComponent("lighttweener")
        inst.components.lighttweener:StartTween(inst.entity:AddLight(), 0, 0.7, 0.5, {255/255, 160/255, 80/255}, 0, function() end)
    end
    
    -- Special effect for Willow
    if owner.prefab == "willow" then
        owner.components.sanity:SetInducedInsanityFn(function() return false end)  -- Prevent insanity near fire
    end
end

-- Function called when the staff is unequipped
local function onunequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
    
    -- Remove the light when unequipped
    if inst.components.lighttweener then
        inst:RemoveComponent("lighttweener")
        inst.entity:RemoveLight()
    end
    
    -- Remove special effect for Willow
    if owner.prefab == "willow" then
        owner.components.sanity:SetInducedInsanityFn(nil)
    end
end

-- Main function to create the fire staff
local function fn()
    -- Create the entity
    local inst = CreateEntity()

    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    -- Set up physics
    MakeInventoryPhysics(inst)

    -- Set up animation
    inst.AnimState:SetBank("firestaff")
    inst.AnimState:SetBuild("firestaff")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add a reddish tint
    inst.AnimState:SetMultColour(1, 0.8, 0.8, 1)

    -- Add tags
    inst:AddTag("willow_craftable")  -- Custom tag for Willow

    -- Make the entity pristine for networking
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add components
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "fire_staff"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/fire_staff.xml"

    -- Make it usable
    inst:AddComponent("spellcaster")
    inst.components.spellcaster:SetSpellFn(onuse)
    inst.components.spellcaster.canuseonpoint = true
    
    -- Add durability
    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(20)
    inst.components.finiteuses:SetUses(20)
    inst.components.finiteuses:SetOnFinished(inst.Remove)
    
    -- Make it inspectable
    inst:AddComponent("inspectable")

    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(onequip)
    inst.components.equippable:SetOnUnequip(onunequip)

    return inst
end

-- Register the prefab
return Prefab("fire_staff", fn, assets)
```

## Step 7: Create Inventory Images

For each item, you'll need to create inventory images:

1. Create 64x64 pixel images for each item
2. Save them in the `images/inventoryimages/` directory
3. Convert them to TEX/XML format using a TEX converter tool

## Step 8: Testing Your Recipes

1. Launch Don't Starve Together
2. Enable your mod in the Mods menu
3. Start a new game
4. Test the recipes by:
   - Crafting the Enhanced Axe at a Science Machine
   - Crafting the Frost Armor at an Alchemy Engine
   - Playing as Willow to craft the Fire Staff
   - Testing the custom crafting tab

## Customization Options

Here are some ways to enhance your recipes:

### Add Tech Tree Requirements

```lua
-- Require multiple tech levels
AddRecipe("teleportato_ring", 
    {Ingredient("goldnugget", 20), Ingredient("purplegem", 3)}, 
    GLOBAL.RECIPETABS.ANCIENT, 
    {GLOBAL.TECH.ANCIENT_FOUR, GLOBAL.TECH.MAGIC_THREE},  -- Requires BOTH Ancient and Magic tech
    nil, nil, nil, nil, nil)
```

### Add Season-Specific Recipes

```lua
-- Make a recipe only available in winter
AddPrefabPostInit("world", function(inst)
    if GLOBAL.TheWorld.ismastersim then
        inst:ListenForEvent("seasonchange", function(inst, data)
            for _, player in ipairs(GLOBAL.AllPlayers) do
                if data.season == "winter" then
                    player.components.builder:AddRecipe("winterhat")
                else
                    player.components.builder:RemoveRecipe("winterhat")
                end
            end
        end)
    end
end)
```

### Add Recipes That Unlock With Game Progress

```lua
-- Unlock a recipe when the player kills a boss
AddPrefabPostInit("player", function(inst)
    inst:ListenForEvent("killed", function(inst, data)
        if data.victim and data.victim:HasTag("epic") then
            -- Killed a boss, unlock a special recipe
            inst.components.builder:UnlockRecipe("staff_tornado")
        end
    end)
end)
```

## Common Issues and Solutions

### Problem: Recipe doesn't appear in crafting menu
**Solution**: Check that you've specified the correct tech level and crafting tab

### Problem: Character-specific recipe is available to everyone
**Solution**: Double-check the character name parameter in AddRecipe

### Problem: Custom tab doesn't appear
**Solution**: Ensure you've defined the tab correctly and added at least one recipe to it

### Problem: Crafted item doesn't have the correct properties
**Solution**: Check your prefab file for errors in component initialization:

```lua
-- Add error handling to critical functions
local function onequip(inst, owner)
    if not owner or not owner.AnimState then
        return
    end
    
    -- Rest of the function...
end
```

## Next Steps

Now that you've created custom recipes, you can:

1. **Create Recipe Books**: Items that teach players new recipes when used
2. **Add Crafting Animations**: Custom animations when crafting specific items
3. **Create Tech Tree Mods**: Add entirely new tech trees and crafting stations
4. **Add Recipe Filtering**: Create custom categories and filters for recipes

For more advanced recipe creation, check out the [Custom Component](custom-component.md) tutorial to learn how to add entirely new crafting behaviors. 
