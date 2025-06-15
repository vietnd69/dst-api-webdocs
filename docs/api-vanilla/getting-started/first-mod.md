---
id: first-mod
title: First mod
sidebar_position: 3
last_updated: 2023-07-06
slug: /api/first-mod
---

# First mod in Don't Starve Together

Creating your first mod for Don't Starve Together (DST) is an exciting way to customize the game experience. This guide will walk you through creating a simple mod, then progressively build toward more complex examples.

## Setting Up Your First Mod

### Basic Folder Structure

Start by creating a folder in the game's mods directory:

```
[Steam Directory]/steamapps/common/Don't Starve Together/mods/my_first_mod/
```

Inside this folder, create these essential files:

```
my_first_mod/
├── modinfo.lua       # Mod metadata and configuration
├── modmain.lua       # Main entry point for the mod
└── preview.tex       # Mod thumbnail image (184x184 pixels)
```

### Creating modinfo.lua

The `modinfo.lua` file contains metadata about your mod:

```lua
name = "My First Mod"
description = "This is my first DST mod!"
author = "Your Name"
version = "1.0.0"

-- Compatible with Don't Starve Together
dst_compatible = true

-- Compatible with Don't Starve
dont_starve_compatible = false
reign_of_giants_compatible = false

-- Character mods need this set to true
all_clients_require_mod = false

-- Server only mods need this set to true
client_only_mod = false

-- If your mod requires libraries or dependencies
server_filter_tags = {"utility"}

-- Mod icon (184x184 PNG)
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Configuration options
configuration_options = {
    {
        name = "difficulty",
        label = "Difficulty",
        options = {
            {description = "Easy", data = "easy"},
            {description = "Normal", data = "normal", hover = "The standard experience"},
            {description = "Hard", data = "hard"}
        },
        default = "normal"
    }
}
```

### Creating modmain.lua

The `modmain.lua` file contains the actual code for your mod:

```lua
-- This is the main file for your mod

-- Import global objects into the mod's environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Print a message when the mod loads
print("Hello from My First Mod!")

-- Access mod configuration
local difficulty = GetModConfigData("difficulty")
print("Selected difficulty: " .. difficulty)
```

## Example 1: Simple Item Mod

Let's create a basic mod that adds a new item to the game. We'll make a "Super Axe" that has increased durability and damage.

### File Structure

```
my_axe_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   └── prefabs/
│       └── superaxe.lua
└── images/
    └── inventoryimages/
        ├── superaxe.png
        └── superaxe.xml
```

### modinfo.lua

```lua
name = "Super Axe"
description = "Adds a powerful axe with increased durability and damage"
author = "Your Name"
version = "1.0.0"

dst_compatible = true
dont_starve_compatible = false
all_clients_require_mod = true
client_only_mod = false

icon_atlas = "modicon.xml"
icon = "modicon.tex"
```

### modmain.lua

```lua
-- Import globals
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add asset files
Assets = {
    Asset("IMAGE", "images/inventoryimages/superaxe.tex"),
    Asset("ATLAS", "images/inventoryimages/superaxe.xml"),
}

-- Register the prefab
PrefabFiles = {
    "superaxe",
}

-- Add recipe
AddRecipe("superaxe", 
    {Ingredient("goldnugget", 2), Ingredient("twigs", 1)}, 
    RECIPETABS.TOOLS, 
    TECH.SCIENCE_ONE, 
    nil, nil, nil, nil, nil, 
    "images/inventoryimages/superaxe.xml", "superaxe.tex")
```

### scripts/prefabs/superaxe.lua

```lua
local assets = {
    Asset("ANIM", "anim/axe.zip"),
    Asset("ANIM", "anim/swap_axe.zip"),
    
    Asset("IMAGE", "images/inventoryimages/superaxe.tex"),
    Asset("ATLAS", "images/inventoryimages/superaxe.xml"),
}

local function onequip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "swap_axe", "swap_axe")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
end

local function onunequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    MakeInventoryPhysics(inst)

    inst.AnimState:SetBank("axe")
    inst.AnimState:SetBuild("axe")
    inst.AnimState:PlayAnimation("idle")

    -- Make it usable by players
    inst:AddTag("sharp")

    -- Setup for clients
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Components
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "superaxe"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/superaxe.xml"

    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.CHOP, 2) -- Chop efficiency multiplier

    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(34) -- Regular axe is 27

    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(200) -- Regular axe is 100
    inst.components.finiteuses:SetUses(200)
    inst.components.finiteuses:SetOnFinished(inst.Remove)
    inst.components.finiteuses:SetConsumption(ACTIONS.CHOP, 1)

    inst:AddComponent("inspectable")

    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(onequip)
    inst.components.equippable:SetOnUnequip(onunequip)

    return inst
end

return Prefab("superaxe", fn, assets)
```

## Example 2: Character Mod

Let's create a simple character mod that adds a new playable character to the game.

### File Structure

```
my_character_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   └── prefabs/
│       ├── mycharacter.lua
│       └── mycharacter_none.lua
├── anim/
│   └── mycharacter.zip
└── bigportraits/
    └── mycharacter.xml
    └── mycharacter.tex
```

### modmain.lua

```lua
-- Import globals
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add assets
Assets = {
    Asset("IMAGE", "bigportraits/mycharacter.tex"),
    Asset("ATLAS", "bigportraits/mycharacter.xml"),
}

-- Add character prefab
PrefabFiles = {
    "mycharacter",
    "mycharacter_none",
}

-- Add character to the game
AddModCharacter("mycharacter", "MALE")

-- Add character-specific strings
STRINGS.NAMES.MYCHARACTER = "My Character"
STRINGS.CHARACTER_TITLES.mycharacter = "The Inventor"
STRINGS.CHARACTER_DESCRIPTIONS.mycharacter = "• Has bonus crafting abilities\n• Starts with special tools\n• Gets hungry faster"
STRINGS.CHARACTER_QUOTES.mycharacter = "\"I'll build something amazing!\""

-- Add speech file
AddModCharacterSpeech("mycharacter", "speech_mycharacter")
```

### scripts/prefabs/mycharacter.lua

```lua
local MakePlayerCharacter = require "prefabs/player_common"

local assets = {
    Asset("SCRIPT", "scripts/prefabs/player_common.lua"),
    Asset("ANIM", "anim/mycharacter.zip"),
}

-- Custom starting inventory
local start_inv = {
    "axe",
    "pickaxe",
}

-- When the character is revived from ghost
local function onbecamehuman(inst)
    -- Set speed when revived
    inst.components.locomotor:SetExternalSpeedMultiplier(inst, "mycharacter_speed_mod", 1)
end

-- When the character turns into a ghost
local function onbecameghost(inst)
    -- Ghosts are slightly faster
    inst.components.locomotor:SetExternalSpeedMultiplier(inst, "mycharacter_speed_mod", 1.1)
end

-- When loading or spawning the character
local function onload(inst)
    inst:ListenForEvent("ms_respawnedfromghost", onbecamehuman)
    inst:ListenForEvent("ms_becameghost", onbecameghost)

    if inst:HasTag("playerghost") then
        onbecameghost(inst)
    else
        onbecamehuman(inst)
    end
end

-- This initializes for the server only
local master_postinit = function(inst)
    -- Set starting inventory
    inst.starting_inventory = start_inv

    -- Stats
    inst.components.health:SetMaxHealth(125) -- Less health (default is 150)
    inst.components.hunger:SetMax(150) -- Same hunger
    inst.components.sanity:SetMax(200) -- More sanity (default is 150)
    
    -- Hunger rate (speed at which character gets hungry)
    inst.components.hunger.hungerrate = 1.25 * TUNING.WILSON_HUNGER_RATE
    
    -- Character specific abilities
    inst.components.builder.science_bonus = 1 -- Bonus tech level
end

-- This initializes for both the server and client
local common_postinit = function(inst) 
    -- Minimap icon
    inst.MiniMapEntity:SetIcon("mycharacter.tex")
    
    -- Character traits
    inst:AddTag("bookbuilder") -- Can craft books
    inst:AddTag("fastbuilder") -- Builds faster
    
    -- Voice
    inst.soundsname = "wilson" -- Use Wilson's voice
end

-- Return the character function
return MakePlayerCharacter("mycharacter", prefabs, assets, common_postinit, master_postinit, start_inv)
```

### scripts/prefabs/mycharacter_none.lua

```lua
return CreatePrefabSkin("mycharacter_none", {
    base_prefab = "mycharacter",
    type = "base",
    assets = {
        Asset("ANIM", "anim/mycharacter.zip"),
    },
    skins = { normal_skin = "mycharacter" },
    skin_tags = { "MYCHARACTER", "CHARACTER" },
    build_name_override = "mycharacter",
    rarity = "Character",
})
```

## Example 3: World Modification Mod

This mod changes aspects of the world generation and adds custom features to the environment.

### modmain.lua

```lua
-- Import globals
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add more berry bushes to the world
AddPrefabPostInit("world", function(inst)
    if not GLOBAL.TheWorld.ismastersim then return end
    
    inst:DoTaskInTime(0.1, function()
        -- Only run on the master shard (overworld)
        if inst:HasTag("cave") then return end
        
        -- Spawn 20 extra berry bushes
        for i = 1, 20 do
            -- Find a valid spawn position
            local x, y, z = inst:GetRandomPoint()
            if x and z then
                -- Spawn the berry bush
                local bush = GLOBAL.SpawnPrefab("berrybush")
                bush.Transform:SetPosition(x, y, z)
            end
        end
        
        print("Added extra berry bushes to the world")
    end)
end)

-- Make nights shorter
AddComponentPostInit("clock", function(clock)
    -- Adjust night length
    clock:SetNightLength(0.75 * TUNING.NIGHT_TIME_DEFAULT)
    
    print("Made nights shorter")
end)

-- Make all creatures move faster
AddComponentPostInit("locomotor", function(locomotor)
    local old_SetExternalSpeedMultiplier = locomotor.SetExternalSpeedMultiplier
    
    function locomotor:SetExternalSpeedMultiplier(source, name, mult)
        -- Call original function with a speed boost
        if source:HasTag("monster") then
            return old_SetExternalSpeedMultiplier(self, source, name, mult * 1.2)
        else
            return old_SetExternalSpeedMultiplier(self, source, name, mult)
        end
    end
end)
```

## Example 4: Complex Gameplay Mod

This example shows a more complex mod that adds a complete gameplay system - a magical crafting table that transforms items.

### File Structure

```
magic_crafting_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   ├── prefabs/
│   │   └── magic_table.lua
│   └── components/
│       └── itemtransformer.lua
├── anim/
│   └── magic_table.zip
└── images/
    └── inventoryimages/
        ├── magic_table.png
        └── magic_table.xml
```

### modmain.lua

```lua
-- Import globals
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add assets
Assets = {
    Asset("IMAGE", "images/inventoryimages/magic_table.tex"),
    Asset("ATLAS", "images/inventoryimages/magic_table.xml"),
}

-- Register prefabs
PrefabFiles = {
    "magic_table",
}

-- Register custom component
local ItemTransformer = require("components/itemtransformer")
AddComponentPostInit("itemtransformer", ItemTransformer)

-- Add recipe
AddRecipe("magic_table", 
    {
        Ingredient("boards", 2),
        Ingredient("purplegem", 1),
        Ingredient("nightmarefuel", 3)
    }, 
    RECIPETABS.MAGIC, 
    TECH.MAGIC_THREE, 
    nil, nil, nil, nil, nil, 
    "images/inventoryimages/magic_table.xml", "magic_table.tex")

-- Define transformation recipes
GLOBAL.MAGIC_TRANSFORMATIONS = {
    -- Basic resources
    {
        ingredient = "log",
        result = "charcoal",
        count = 2
    },
    {
        ingredient = "rocks",
        result = "goldnugget",
        count = 1
    },
    -- Foods
    {
        ingredient = "carrot",
        result = "meat",
        count = 1
    },
    -- Special items
    {
        ingredient = "nightmarefuel",
        result = "purplegem",
        count = 1,
        sanity_cost = 15
    }
}

-- Add custom action
local TRANSFORM = Action({priority=10})
TRANSFORM.id = "TRANSFORM"
TRANSFORM.str = "Transform"
TRANSFORM.fn = function(act)
    if act.target and act.target.components.itemtransformer and act.doer and act.invobject then
        return act.target.components.itemtransformer:Transform(act.doer, act.invobject)
    end
    return false
end
AddAction(TRANSFORM)

-- Add action handler
AddComponentAction("USEITEM", "inventoryitem", function(inst, doer, target, actions, right)
    if target:HasTag("magic_table") and right then
        table.insert(actions, ACTIONS.TRANSFORM)
    end
end)

-- Add strings
STRINGS.ACTIONS.TRANSFORM = "Transform"
STRINGS.NAMES.MAGIC_TABLE = "Magic Transformation Table"
STRINGS.CHARACTERS.GENERIC.DESCRIBE.MAGIC_TABLE = "I can transform items with this."
```

### scripts/components/itemtransformer.lua

```lua
local ItemTransformer = Class(function(self, inst)
    self.inst = inst
    self.transforming = false
    self.transform_time = 3
end)

function ItemTransformer:Transform(doer, item)
    if self.transforming then
        return false, "BUSY"
    end
    
    -- Find matching transformation recipe
    local recipe = nil
    for _, r in ipairs(MAGIC_TRANSFORMATIONS) do
        if r.ingredient == item.prefab then
            recipe = r
            break
        end
    end
    
    if not recipe then
        return false, "NORECIPE"
    end
    
    -- Check sanity cost
    if recipe.sanity_cost and doer.components.sanity then
        if doer.components.sanity.current < recipe.sanity_cost then
            return false, "NOSANITY"
        end
    end
    
    -- Start transformation
    self.transforming = true
    
    -- Remove the ingredient
    if item.components.stackable then
        item.components.stackable:Get():Remove()
    else
        item:Remove()
    end
    
    -- Play effects
    if self.inst.AnimState then
        self.inst.AnimState:PlayAnimation("transform")
    end
    
    if self.inst.SoundEmitter then
        self.inst.SoundEmitter:PlaySound("dontstarve/common/researchmachine_lvl3_run", "transforming")
    end
    
    -- Apply sanity cost
    if recipe.sanity_cost and doer.components.sanity then
        doer.components.sanity:DoDelta(-recipe.sanity_cost)
    end
    
    -- Complete transformation after delay
    self.inst:DoTaskInTime(self.transform_time, function()
        if self.inst.SoundEmitter then
            self.inst.SoundEmitter:KillSound("transforming")
            self.inst.SoundEmitter:PlaySound("dontstarve/common/researchmachine_lvl3_ding")
        end
        
        -- Create result items
        local count = recipe.count or 1
        for i = 1, count do
            local result = SpawnPrefab(recipe.result)
            if result then
                if doer.components.inventory then
                    doer.components.inventory:GiveItem(result)
                else
                    result.Transform:SetPosition(self.inst.Transform:GetWorldPosition())
                end
            end
        end
        
        -- Reset state
        self.transforming = false
        
        if self.inst.AnimState then
            self.inst.AnimState:PlayAnimation("idle")
        end
    end)
    
    return true
end

function ItemTransformer:OnSave()
    return {
        transforming = self.transforming
    }
end

function ItemTransformer:OnLoad(data)
    if data then
        self.transforming = data.transforming or false
    end
end

return ItemTransformer
```

### scripts/prefabs/magic_table.lua

```lua
local assets = {
    Asset("ANIM", "anim/magic_table.zip"),
    Asset("IMAGE", "images/inventoryimages/magic_table.tex"),
    Asset("ATLAS", "images/inventoryimages/magic_table.xml"),
}

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddMiniMapEntity()
    inst.entity:AddNetwork()

    MakeObstaclePhysics(inst, 0.5)

    inst.MiniMapEntity:SetIcon("magic_table.tex")

    inst.AnimState:SetBank("magic_table")
    inst.AnimState:SetBuild("magic_table")
    inst.AnimState:PlayAnimation("idle")

    inst:AddTag("structure")
    inst:AddTag("magic")
    inst:AddTag("magic_table")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    inst:AddComponent("inspectable")
    
    inst:AddComponent("lootdropper")
    
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
    inst.components.workable:SetWorkLeft(4)
    inst.components.workable:SetOnFinishCallback(function(inst, worker)
        inst.components.lootdropper:DropLoot()
        local fx = SpawnPrefab("collapse_small")
        fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
        fx:SetMaterial("wood")
        inst:Remove()
    end)

    inst:AddComponent("itemtransformer")

    return inst
end

return Prefab("magic_table", fn, assets)
```

## Example 5: Popular Mod Case Study - "Geometric Placement"

One of the most popular DST mods is "Geometric Placement," which helps players place structures in a grid-like pattern. Let's analyze a simplified version of how it works:

### Key Features

1. Grid-based placement visualization
2. Rotation controls
3. Snapping to grid
4. Custom keybindings

### Implementation Highlights

```lua
-- modmain.lua (simplified version of Geometric Placement)

-- Import globals
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Configuration
local GRID_SIZE = GetModConfigData("grid_size") or 1
local ENABLE_BY_DEFAULT = GetModConfigData("enable_by_default") or true

-- State variables
local ENABLED = ENABLE_BY_DEFAULT
local CURRENT_ROTATION = 0
local PLACER_INST = nil

-- Key bindings
local KEY_TOGGLE = GetModConfigData("key_toggle") or KEY_G
local KEY_ROTATE = GetModConfigData("key_rotate") or KEY_R

-- Helper functions
local function SnapToGrid(x, y, z)
    -- Snap coordinates to nearest grid point
    local grid_x = math.floor((x + GRID_SIZE/2) / GRID_SIZE) * GRID_SIZE
    local grid_z = math.floor((z + GRID_SIZE/2) / GRID_SIZE) * GRID_SIZE
    return grid_x, y, grid_z
end

local function RotatePoint(x, z, angle)
    -- Rotate a point around origin
    local rad = math.rad(angle)
    local cos_angle = math.cos(rad)
    local sin_angle = math.sin(rad)
    return x * cos_angle - z * sin_angle, x * sin_angle + z * cos_angle
end

-- Override placer positioning
AddClassPostConstruct("components/placer", function(self)
    local old_OnUpdate = self.OnUpdate
    
    function self:OnUpdate(dt)
        -- Call original update
        old_OnUpdate(self, dt)
        
        -- Skip if geometric placement is disabled
        if not ENABLED then return end
        
        -- Store reference to current placer
        PLACER_INST = self.inst
        
        -- Get current position
        local x, y, z = self.inst.Transform:GetWorldPosition()
        
        -- Apply grid snapping
        local grid_x, grid_y, grid_z = SnapToGrid(x, y, z)
        
        -- Apply rotation if needed
        if CURRENT_ROTATION ~= 0 then
            -- Adjust based on rotation
            local offset_x, offset_z = RotatePoint(self.offset.x, self.offset.z, CURRENT_ROTATION)
            grid_x = grid_x + offset_x
            grid_z = grid_z + offset_z
        end
        
        -- Set the new position
        self.inst.Transform:SetPosition(grid_x, grid_y, grid_z)
        
        -- Update visual indicator
        if self.inst.DrawGrid then
            self.inst:DrawGrid(GRID_SIZE, CURRENT_ROTATION)
        end
    end
end)

-- Add grid visualization to placers
AddPrefabPostInit("placer", function(inst)
    if not GLOBAL.TheWorld.ismastersim then return end
    
    -- Function to draw grid lines
    inst.DrawGrid = function(inst, size, rotation)
        -- Clear previous grid
        inst.gridpoints = inst.gridpoints or {}
        for _, point in ipairs(inst.gridpoints) do
            point:Remove()
        end
        inst.gridpoints = {}
        
        -- Draw new grid (simplified)
        for x = -2, 2 do
            for z = -2, 2 do
                if x == 0 and z == 0 then
                    -- Skip center point
                    goto continue
                end
                
                -- Create grid point indicator
                local point = SpawnPrefab("gridpoint")
                local pos_x, pos_z = RotatePoint(x * size, z * size, rotation)
                point.Transform:SetPosition(inst.Transform:GetWorldPosition() + pos_x, 0, pos_z)
                table.insert(inst.gridpoints, point)
                
                ::continue::
            end
        end
    end
end)

-- Handle key presses
TheInput:AddKeyHandler(function(key, down)
    if down then
        if key == KEY_TOGGLE then
            -- Toggle geometric placement
            ENABLED = not ENABLED
            GLOBAL.ThePlayer.HUD.controls.crafttabs:ShowPopup(ENABLED and "Geometric Placement: ON" or "Geometric Placement: OFF")
            return true
        elseif key == KEY_ROTATE and ENABLED and PLACER_INST then
            -- Rotate placement
            CURRENT_ROTATION = (CURRENT_ROTATION + 90) % 360
            return true
        end
    end
    return false
end)
```

This simplified example demonstrates the core concepts behind the Geometric Placement mod, showing how it:

1. Overrides the placer component to modify structure placement
2. Adds visual indicators for the grid
3. Implements rotation functionality
4. Handles key bindings for user interaction

## Tips for Mod Development

1. **Start Small**: Begin with simple modifications before attempting complex features
2. **Study Existing Mods**: Learn from popular mods in the Steam Workshop
3. **Use Print Statements**: Add `print()` calls to debug your code
4. **Test Thoroughly**: Check your mod in different game scenarios
5. **Version Control**: Use Git to track changes to your mod
6. **Document Your Code**: Add comments to explain complex logic
7. **Optimize Performance**: Be mindful of performance impact, especially in frequently called functions
8. **Share Your Work**: Get feedback from the DST modding community

By following these examples and tips, you'll be well on your way to creating your own Don't Starve Together mods, from simple items to complex gameplay systems.
