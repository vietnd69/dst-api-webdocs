---
id: simple-item
title: Simple Item Mod
sidebar_position: 2
last_updated: 2023-07-06
---

# Creating a Simple Custom Item

This tutorial walks through creating a basic custom item for Don't Starve Together: a "Frost Axe" that works like a regular axe but has ice-themed effects and properties.

## Project Overview

We'll create an axe with these features:
- Increased durability compared to a regular axe
- Freezing effect on enemies when used as a weapon
- Custom appearance with ice/frost theme
- Special effect when chopping trees

## Step 1: Set Up the Mod Structure

Create these folders and files:

```
frost_axe_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   └── prefabs/
│       └── frost_axe.lua
└── images/
    └── inventoryimages/
        ├── frost_axe.png
        └── frost_axe.xml
```

## Step 2: Create the modinfo.lua File

```lua
name = "Frost Axe"
description = "Adds a magical axe with freezing properties"
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
    "item",
    "tool"
}

-- Configuration options
configuration_options = {
    {
        name = "frost_damage",
        label = "Frost Damage",
        options = {
            {description = "Low", data = 25},
            {description = "Medium", data = 34, hover = "Default axe damage"},
            {description = "High", data = 42}
        },
        default = 34
    },
    {
        name = "durability",
        label = "Durability",
        options = {
            {description = "Standard", data = 100},
            {description = "Improved", data = 150},
            {description = "Superior", data = 200}
        },
        default = 150
    }
}
```

## Step 3: Create the modmain.lua File

```lua
-- Import globals into the environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add asset files
Assets = {
    -- Inventory image
    Asset("IMAGE", "images/inventoryimages/frost_axe.tex"),
    Asset("ATLAS", "images/inventoryimages/frost_axe.xml"),
}

-- Register the prefab
PrefabFiles = {
    "frost_axe",
}

-- Add recipe to craft the frost axe
AddRecipe("frost_axe", 
    {
        Ingredient("twigs", 1),
        Ingredient("flint", 1),
        Ingredient("bluegem", 1)
    }, 
    GLOBAL.RECIPETABS.TOOLS, 
    GLOBAL.TECH.SCIENCE_ONE, 
    nil, nil, nil, nil, nil, 
    "images/inventoryimages/frost_axe.xml", "frost_axe.tex")

-- Add custom strings
GLOBAL.STRINGS.NAMES.FROST_AXE = "Frost Axe"
GLOBAL.STRINGS.CHARACTERS.GENERIC.DESCRIBE.FROST_AXE = "It's unnaturally cold to the touch."
GLOBAL.STRINGS.RECIPE_DESC.FROST_AXE = "An axe with freezing properties."

-- Add custom tags for the item
AddPrefabPostInit("frost_axe", function(inst)
    inst:AddTag("frostweapon")
end)

-- Add a special effect when chopping trees
AddComponentPostInit("workable", function(self)
    local old_WorkedBy = self.WorkedBy
    
    function self:WorkedBy(worker, numworks, ...)
        local result = old_WorkedBy(self, worker, numworks, ...)
        
        -- Check if the worker is using our frost axe
        if worker and worker.components.inventory then
            local tool = worker.components.inventory:GetEquippedItem(GLOBAL.EQUIPSLOTS.HANDS)
            if tool and tool.prefab == "frost_axe" and self.action == GLOBAL.ACTIONS.CHOP then
                -- Spawn frost effect
                local fx = GLOBAL.SpawnPrefab("icespike_fx_1")
                if fx then
                    fx.Transform:SetPosition(self.inst.Transform:GetWorldPosition())
                end
                
                -- Apply cold to nearby entities
                local x, y, z = self.inst.Transform:GetWorldPosition()
                local ents = GLOBAL.TheSim:FindEntities(x, y, z, 3, nil, {"player", "companion"})
                for _, ent in ipairs(ents) do
                    if ent.components.temperature then
                        ent.components.temperature:DoDelta(-2)
                    end
                end
            end
        end
        
        return result
    end
end)
```

## Step 4: Create the Prefab File

Create `scripts/prefabs/frost_axe.lua`:

```lua
local assets = {
    -- Use the axe animation but we'll recolor it
    Asset("ANIM", "anim/axe.zip"),
    Asset("ANIM", "anim/swap_axe.zip"),
    
    -- Inventory image
    Asset("IMAGE", "images/inventoryimages/frost_axe.tex"),
    Asset("ATLAS", "images/inventoryimages/frost_axe.xml"),
}

-- Function called when the axe is equipped
local function onequip(inst, owner)
    -- Use the regular axe animation for now
    owner.AnimState:OverrideSymbol("swap_object", "swap_axe", "swap_axe")
    
    -- Show the arm holding the tool
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
    
    -- Apply a blue tint to the axe when equipped
    owner.AnimState:SetMultColour(0.8, 0.8, 1, 1)
end

-- Function called when the axe is unequipped
local function onunequip(inst, owner)
    -- Restore normal appearance
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
    owner.AnimState:SetMultColour(1, 1, 1, 1)
end

-- Function called when attacking with the axe
local function onattack(inst, owner, target)
    -- Apply freezing effect if the target has temperature
    if target and target.components.temperature then
        target.components.temperature:DoDelta(-5)
        
        -- Slow the target if it has locomotor
        if target.components.locomotor then
            target.components.locomotor:SetExternalSpeedMultiplier(inst, "frost_axe_slow", 0.7)
            
            -- Remove the slow effect after 3 seconds
            if target._frost_axe_task then
                target._frost_axe_task:Cancel()
            end
            
            target._frost_axe_task = target:DoTaskInTime(3, function()
                target.components.locomotor:RemoveExternalSpeedMultiplier(inst, "frost_axe_slow")
                target._frost_axe_task = nil
            end)
        end
        
        -- Spawn a frost effect
        local fx = SpawnPrefab("frostbreath")
        if fx then
            fx.Transform:SetPosition(target.Transform:GetWorldPosition())
        end
    end
end

-- Main function to create the frost axe
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
    
    -- Apply a blue tint to the axe
    inst.AnimState:SetMultColour(0.7, 0.7, 1, 1)

    -- Add tags
    inst:AddTag("sharp")
    inst:AddTag("tool")
    inst:AddTag("frostweapon")

    -- Make the entity pristine for networking
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add components
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "frost_axe"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/frost_axe.xml"

    -- Make it work as a tool
    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.CHOP, 2) -- Chop efficiency multiplier

    -- Make it work as a weapon
    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(GetModConfigData("frost_damage"))
    inst.components.weapon:SetOnAttack(onattack)

    -- Add durability
    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(GetModConfigData("durability"))
    inst.components.finiteuses:SetUses(GetModConfigData("durability"))
    inst.components.finiteuses:SetOnFinished(inst.Remove)
    inst.components.finiteuses:SetConsumption(ACTIONS.CHOP, 1)

    -- Make it inspectable
    inst:AddComponent("inspectable")

    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(onequip)
    inst.components.equippable:SetOnUnequip(onunequip)

    -- Add a light component for a subtle glow
    inst:AddComponent("lighttweener")
    inst.components.lighttweener:StartTween(
        inst.entity:AddLight(), 
        0, 0.6, 0.6, {80/255, 120/255, 255/255}, 
        0, 
        function() 
            -- After the light is added, make it flicker slightly
            inst:DoPeriodicTask(0.3, function()
                local intensity = 0.5 + math.random() * 0.1
                inst.Light:SetIntensity(intensity)
            end)
        end
    )

    return inst
end

-- Register the prefab
return Prefab("frost_axe", fn, assets)
```

## Step 5: Create the Inventory Image

1. Create a 64x64 pixel image for your frost axe
2. Save it as `images/inventoryimages/frost_axe.png`
3. Use a TEX converter tool to create `frost_axe.tex` and `frost_axe.xml`

## Step 6: Testing Your Mod

1. Launch Don't Starve Together
2. Enable your mod in the Mods menu
3. Start a new game
4. Craft your Frost Axe (requires twigs, flint, and a blue gem)
5. Test the axe by:
   - Chopping trees to see the frost effect
   - Attacking creatures to see the freezing effect
   - Checking the durability as you use it

## Customization Options

Here are some ways to customize your frost axe:

### Change the Recipe

```lua
-- Make it more expensive
AddRecipe("frost_axe", 
    {
        Ingredient("twigs", 2),
        Ingredient("flint", 2),
        Ingredient("bluegem", 2)
    }, 
    GLOBAL.RECIPETABS.MAGIC,  -- Change to magic tab
    GLOBAL.TECH.MAGIC_TWO,    -- Require prestihatitator
    nil, nil, nil, nil, nil, 
    "images/inventoryimages/frost_axe.xml", "frost_axe.tex")
```

### Add a Custom Animation

For a fully custom appearance, create your own animation files:

1. Create `anim/frost_axe.zip` with custom animations
2. Update the prefab file:

```lua
local assets = {
    Asset("ANIM", "anim/frost_axe.zip"),
    Asset("ANIM", "anim/swap_frost_axe.zip"),
    -- Other assets...
}

-- Then in the fn() function:
inst.AnimState:SetBank("frost_axe")
inst.AnimState:SetBuild("frost_axe")
```

### Add More Freezing Effects

Enhance the freezing capabilities:

```lua
-- In the onattack function:
if target and target.components.freezable then
    target.components.freezable:AddColdness(2)
    target.components.freezable:SpawnShatterFX()
end

-- Add a chance to freeze enemies solid
if target and math.random() < 0.1 then  -- 10% chance
    if target.components.freezable then
        target.components.freezable:Freeze(3)  -- Freeze for 3 seconds
    end
end
```

## Common Issues and Solutions

### Problem: Mod doesn't appear in the mod list
**Solution**: Check your folder structure and ensure modinfo.lua is in the root directory

### Problem: Inventory image doesn't show up
**Solution**: Verify the image paths and ensure the TEX/XML files are correctly generated

### Problem: Freezing effect doesn't work
**Solution**: Make sure you're checking for the temperature component before trying to use it

### Problem: Game crashes when using the axe
**Solution**: Add error checking around critical code:

```lua
local function onattack(inst, owner, target)
    if not target then return end
    
    if target.components.temperature then
        target.components.temperature:DoDelta(-5)
    end
    
    -- Rest of the function...
end
```

## Next Steps

Now that you've created a basic custom item, you can:

1. **Add More Effects**: Create additional special abilities for your axe
2. **Create Custom Animations**: Design unique animations for your item
3. **Expand Your Mod**: Add more frost-themed items to create a complete set
4. **Add Sound Effects**: Include custom sounds when the axe is used

For more advanced item creation, check out the [Custom Component](custom-component.md) tutorial to learn how to add entirely new behaviors to your items. 
