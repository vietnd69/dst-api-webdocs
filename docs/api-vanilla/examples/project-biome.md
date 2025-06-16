---
id: project-biome
title: New Biome Project
sidebar_position: 15
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# New Biome Project

This tutorial guides you through creating a complete mod that adds a new biome to Don't Starve Together. We'll create a Crystal Forest biome with unique terrain, vegetation, resources, and creatures.

## Project Overview

By the end of this tutorial, you'll have created:

- A custom biome with unique ground textures
- Special vegetation and resources that spawn in the biome
- Custom creatures that inhabit the biome
- Integration with the existing world generation system

## Prerequisites

- Intermediate understanding of Lua programming
- Familiarity with Don't Starve Together modding
- Basic knowledge of world generation
- Understanding of prefabs and components

## Project Structure

```
CrystalForestMod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   ├── map/
│   │   ├── rooms/
│   │   │   └── crystal_forest.lua
│   │   └── tasks/
│   │       └── crystal_forest_task.lua
│   └── prefabs/
│       ├── crystal_tree.lua
│       ├── crystal_rock.lua
│       └── crystal_deer.lua
└── anim/
    ├── crystal_ground.zip
    ├── crystal_tree.zip
    └── crystal_deer.zip
```

## Step 1: Setting Up the Mod

First, let's create the basic mod structure and files:

### modinfo.lua

```lua
name = "Crystal Forest Biome"
description = "Adds a beautiful Crystal Forest biome with unique resources and creatures."
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
        name = "BIOME_SIZE",
        label = "Biome Size",
        options = {
            {description = "Small", data = 0.5},
            {description = "Medium", data = 1.0},
            {description = "Large", data = 1.5}
        },
        default = 1.0
    },
    {
        name = "CRYSTAL_ABUNDANCE",
        label = "Crystal Abundance",
        options = {
            {description = "Sparse", data = 0.5},
            {description = "Normal", data = 1.0},
            {description = "Abundant", data = 1.5}
        },
        default = 1.0
    }
}
```

### modmain.lua

```lua
-- Assets to preload
Assets = {
    -- Ground textures
    Asset("IMAGE", "levels/textures/crystal_ground.tex"),
    Asset("IMAGE", "levels/textures/crystal_noise.tex"),
    
    -- Minimap icons
    Asset("IMAGE", "minimap/crystal_tree.tex"),
    Asset("ATLAS", "minimap/crystal_tree.xml"),
    Asset("IMAGE", "minimap/crystal_rock.tex"),
    Asset("ATLAS", "minimap/crystal_rock.xml"),
}

-- Prefabs to register
PrefabFiles = {
    "crystal_tree",
    "crystal_rock",
    "crystal_deer",
}

-- Configuration
local BIOME_SIZE = GetModConfigData("BIOME_SIZE")
local CRYSTAL_ABUNDANCE = GetModConfigData("CRYSTAL_ABUNDANCE")

-- Add the new ground type
local GROUND = GLOBAL.GROUND
local GROUND_NAMES = GLOBAL.STRINGS.NAMES.GROUND
local GROUND_TILES = GLOBAL.GROUND_TILES

-- Register new ground type
GROUND.CRYSTAL = #GROUND_TILES + 1
GROUND_NAMES.CRYSTAL = "Crystal Ground"
GROUND_TILES[GROUND.CRYSTAL] = "crystal_ground"

-- Add the ground assets
AddGamePostInit(function()
    local GroundAtlas = GLOBAL.resolvefilepath("levels/textures/ground_noise.xml")
    local GroundImage = GLOBAL.resolvefilepath("levels/textures/ground_noise.tex")
    
    -- Add our custom ground
    GLOBAL.TheWorld.components.groundcreep:AddGroundDef(
        GROUND.CRYSTAL,
        GroundAtlas,
        GroundImage,
        "levels/textures/crystal_noise.tex",
        "crystal_ground"
    )
end)

-- Add the custom rooms and tasks to world generation
modimport("scripts/map/rooms/crystal_forest.lua")
modimport("scripts/map/tasks/crystal_forest_task.lua")

-- Register our custom task with the world generation
AddLevelPreInitAny(function(level)
    if level.location == "forest" then
        -- Add our task to the level
        table.insert(level.tasks, "crystal_forest_task")
        
        -- Adjust task distribution based on mod config
        level.overrides = level.overrides or {}
        level.overrides.task_distribute = level.overrides.task_distribute or {}
        level.overrides.task_distribute.crystal_forest_task = BIOME_SIZE
        
        -- Adjust resource distribution
        level.overrides.crystal_tree = CRYSTAL_ABUNDANCE
        level.overrides.crystal_rock = CRYSTAL_ABUNDANCE
    end
end)

-- Add our custom ground to the tile physics
AddSimPostInit(function()
    for k, v in pairs(GLOBAL.GROUND_FLOORING) do
        if v == GROUND.CRYSTAL then
            GLOBAL.SetGroundFertility(v, 0)
            GLOBAL.SetGroundClass(v, "rocky")
            GLOBAL.SetGroundSpeedMultiplier(v, 1.2)
        end
    end
end)
```

## Step 2: Creating the Biome Rooms

Now let's define the rooms that will make up our Crystal Forest biome:

### scripts/map/rooms/crystal_forest.lua

```lua
require "map/room_functions"

-- Define the Crystal Forest clearing room
AddRoom("CrystalForest_Clearing", {
    colour = {r=0.5, g=0.7, b=0.9, a=0.9},
    value = WORLD_TILES.CRYSTAL,
    tags = {"ExitPiece", "Crystal"},
    contents = {
        distributepercent = 0.12,
        distributeprefabs = {
            crystal_tree = 0.3,
            crystal_rock = 0.2,
            flint = 0.05,
            rocks = 0.05,
            evergreen = 0.1,
            grass = 0.05,
            sapling = 0.1,
            flower = 0.05,
        }
    }
})

-- Define the Crystal Forest dense room
AddRoom("CrystalForest_Dense", {
    colour = {r=0.4, g=0.6, b=0.8, a=0.9},
    value = WORLD_TILES.CRYSTAL,
    tags = {"Crystal"},
    contents = {
        distributepercent = 0.25,
        distributeprefabs = {
            crystal_tree = 0.5,
            crystal_rock = 0.3,
            flint = 0.03,
            rocks = 0.03,
            evergreen = 0.05,
            grass = 0.03,
            sapling = 0.05,
        }
    }
})

-- Define the Crystal Forest glade room
AddRoom("CrystalForest_Glade", {
    colour = {r=0.6, g=0.8, b=1.0, a=0.9},
    value = WORLD_TILES.CRYSTAL,
    tags = {"Crystal"},
    contents = {
        distributepercent = 0.07,
        distributeprefabs = {
            crystal_tree = 0.1,
            crystal_rock = 0.1,
            flower = 0.2,
            grass = 0.1,
            sapling = 0.1,
            carrot_planted = 0.05,
            crystal_deer = 0.03,
        }
    }
})
```

## Step 3: Creating the Biome Task

Now let's define the task that will incorporate our rooms into the world generation:

### scripts/map/tasks/crystal_forest_task.lua

```lua
require "map/tasks"

-- Create a new task for the Crystal Forest biome
AddTask("crystal_forest_task", {
    locks = {LOCKS.NONE},
    keys_given = {KEYS.TIER1},
    room_choices = {
        ["CrystalForest_Clearing"] = 2,
        ["CrystalForest_Dense"] = {2, 3},
        ["CrystalForest_Glade"] = {1, 2},
    },
    room_bg = WORLD_TILES.CRYSTAL,
    background_room = "BGCrystal",
    colour = {r=0.5, g=0.7, b=0.9, a=0.9}
})

-- Create a background room for the biome
AddRoom("BGCrystal", {
    colour = {r=0.5, g=0.7, b=0.9, a=0.9},
    value = WORLD_TILES.CRYSTAL,
    tags = {"Crystal", "RoadPoison"},
    contents = {
        distributepercent = 0.05,
        distributeprefabs = {
            crystal_tree = 0.3,
            crystal_rock = 0.2,
            flint = 0.05,
            rocks = 0.05,
            grass = 0.05,
            sapling = 0.05,
        }
    }
})
```

## Step 4: Creating Custom Prefabs

Now let's create the custom prefabs for our biome:

### scripts/prefabs/crystal_tree.lua

```lua
local assets = {
    Asset("ANIM", "anim/crystal_tree.zip"),
    Asset("MINIMAP_IMAGE", "crystal_tree"),
}

local prefabs = {
    "crystal_shard",
    "twigs",
    "log",
}

local function OnChopDown(inst, chopper)
    inst.SoundEmitter:PlaySound("dontstarve/wilson/use_axe_tree")
    inst.AnimState:PlayAnimation("fall")
    
    inst:ListenForEvent("animover", function()
        local crystal = SpawnPrefab("crystal_shard")
        crystal.Transform:SetPosition(inst.Transform:GetWorldPosition())
        
        inst:Remove()
    end)
end

local function OnChop(inst, chopper, chops)
    inst.AnimState:PlayAnimation("chop")
    inst.AnimState:PushAnimation("idle", true)
    inst.SoundEmitter:PlaySound("dontstarve/wilson/use_axe_tree")
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    inst.entity:AddMiniMapEntity()

    inst.MiniMapEntity:SetIcon("crystal_tree.tex")

    MakeObstaclePhysics(inst, 0.25)

    inst.AnimState:SetBank("crystal_tree")
    inst.AnimState:SetBuild("crystal_tree")
    inst.AnimState:PlayAnimation("idle", true)
    
    inst:AddTag("tree")
    inst:AddTag("crystal")
    inst:AddTag("workable")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    inst:AddComponent("inspectable")
    
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.CHOP)
    inst.components.workable:SetWorkLeft(3)
    inst.components.workable:SetOnFinishCallback(OnChopDown)
    inst.components.workable:SetOnWorkCallback(OnChop)

    inst:AddComponent("lootdropper")
    inst.components.lootdropper:AddRandomLoot("crystal_shard", 1.0)
    inst.components.lootdropper:AddRandomLoot("twigs", 0.5)
    inst.components.lootdropper:AddRandomLoot("log", 0.25)
    inst.components.lootdropper:SetLootSetupFn(function(inst)
        inst.components.lootdropper.numrandomloot = math.random(1, 3)
    end)

    MakeHauntableWorkAndIgnite(inst)

    -- Add light
    inst:AddComponent("lighttweener")
    inst.components.lighttweener:StartTween(
        inst.entity:AddLight(),
        0, -- start_radius
        0.8, -- end_radius
        nil, -- start_intensity
        0.6, -- end_intensity
        nil, -- start_falloff
        nil, -- end_falloff
        nil, -- duration
        {1/255*130, 1/255*200, 1/255*255} -- color
    )

    return inst
end

return Prefab("crystal_tree", fn, assets, prefabs)
```

### scripts/prefabs/crystal_rock.lua

```lua
local assets = {
    Asset("ANIM", "anim/crystal_rock.zip"),
    Asset("MINIMAP_IMAGE", "crystal_rock"),
}

local prefabs = {
    "crystal_shard",
    "rocks",
}

local function OnMined(inst, worker, workleft)
    if workleft <= 0 then
        inst.components.lootdropper:DropLoot()
        SpawnPrefab("rock_break_fx").Transform:SetPosition(inst.Transform:GetWorldPosition())
        inst:Remove()
    else
        inst.AnimState:PlayAnimation("hit")
        inst.AnimState:PushAnimation("idle")
    end
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    inst.entity:AddMiniMapEntity()

    inst.MiniMapEntity:SetIcon("crystal_rock.tex")

    MakeObstaclePhysics(inst, 0.5)

    inst.AnimState:SetBank("crystal_rock")
    inst.AnimState:SetBuild("crystal_rock")
    inst.AnimState:PlayAnimation("idle")
    
    inst:AddTag("boulder")
    inst:AddTag("crystal")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    inst:AddComponent("inspectable")
    
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.MINE)
    inst.components.workable:SetWorkLeft(3)
    inst.components.workable:SetOnWorkCallback(OnMined)

    inst:AddComponent("lootdropper")
    inst.components.lootdropper:AddRandomLoot("crystal_shard", 1.0)
    inst.components.lootdropper:AddRandomLoot("rocks", 0.5)
    inst.components.lootdropper:SetLootSetupFn(function(inst)
        inst.components.lootdropper.numrandomloot = math.random(1, 3)
    end)

    MakeHauntableWorkAndIgnite(inst)

    -- Add light
    inst:AddComponent("lighttweener")
    inst.components.lighttweener:StartTween(
        inst.entity:AddLight(),
        0, -- start_radius
        0.6, -- end_radius
        nil, -- start_intensity
        0.5, -- end_intensity
        nil, -- start_falloff
        nil, -- end_falloff
        nil, -- duration
        {1/255*130, 1/255*200, 1/255*255} -- color
    )

    return inst
end

return Prefab("crystal_rock", fn, assets, prefabs)
```

### scripts/prefabs/crystal_deer.lua

```lua
local assets = {
    Asset("ANIM", "anim/crystal_deer.zip"),
}

local prefabs = {
    "crystal_shard",
    "meat",
}

local brain = require "brains/crystal_deer_brain"

local function OnAttacked(inst, data)
    inst.components.combat:SetTarget(data.attacker)
    inst.components.combat:ShareTarget(data.attacker, 30, function(dude)
        return dude:HasTag("crystal_deer") and not dude:HasTag("player")
    end, 5)
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddDynamicShadow()
    inst.entity:AddNetwork()

    MakeCharacterPhysics(inst, 100, 0.5)

    inst.DynamicShadow:SetSize(1.5, 0.75)
    inst.Transform:SetSixFaced()

    inst.AnimState:SetBank("crystal_deer")
    inst.AnimState:SetBuild("crystal_deer")
    inst.AnimState:PlayAnimation("idle", true)
    
    inst:AddTag("animal")
    inst:AddTag("crystal_deer")
    inst:AddTag("crystal")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    inst:AddComponent("inspectable")
    
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(150)

    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(20)
    inst.components.combat:SetAttackPeriod(2)
    inst.components.combat:SetRetargetFunction(3, function(inst)
        return FindEntity(
            inst,
            20,
            function(guy)
                return inst.components.combat:CanTarget(guy)
            end,
            nil,
            nil,
            {"crystal", "wall"}
        )
    end)

    inst:AddComponent("lootdropper")
    inst.components.lootdropper:AddRandomLoot("meat", 1.0)
    inst.components.lootdropper:AddRandomLoot("crystal_shard", 1.0)
    inst.components.lootdropper:SetLootSetupFn(function(inst)
        inst.components.lootdropper.numrandomloot = math.random(1, 3)
    end)

    inst:AddComponent("locomotor")
    inst.components.locomotor.walkspeed = 4
    inst.components.locomotor.runspeed = 7

    inst:SetStateGraph("SGdeer")
    inst:SetBrain(brain)

    inst:ListenForEvent("attacked", OnAttacked)

    -- Add light
    inst:AddComponent("lighttweener")
    inst.components.lighttweener:StartTween(
        inst.entity:AddLight(),
        0, -- start_radius
        0.7, -- end_radius
        nil, -- start_intensity
        0.5, -- end_intensity
        nil, -- start_falloff
        nil, -- end_falloff
        nil, -- duration
        {1/255*130, 1/255*200, 1/255*255} -- color
    )

    MakeHauntablePanic(inst)

    return inst
end

return Prefab("crystal_deer", fn, assets, prefabs)
```

## Step 5: Creating the Crystal Shard Item

Now let's create the crystal shard item that will be harvested from our biome:

### scripts/prefabs/crystal_shard.lua

```lua
local assets = {
    Asset("ANIM", "anim/crystal_shard.zip"),
    Asset("ATLAS", "images/inventoryimages/crystal_shard.xml"),
    Asset("IMAGE", "images/inventoryimages/crystal_shard.tex"),
}

local function light_on(inst)
    if not inst.components.inventoryitem:IsHeld() then
        inst.components.lighttweener:StartTween(
            inst.entity:AddLight(),
            0, -- start_radius
            0.5, -- end_radius
            nil, -- start_intensity
            0.5, -- end_intensity
            nil, -- start_falloff
            nil, -- end_falloff
            nil, -- duration
            {1/255*130, 1/255*200, 1/255*255} -- color
        )
    end
end

local function light_off(inst)
    inst.components.lighttweener:StartTween(
        inst.entity:AddLight(),
        0.5, -- start_radius
        0, -- end_radius
        0.5, -- start_intensity
        0, -- end_intensity
        nil, -- start_falloff
        nil, -- end_falloff
        nil, -- duration
        {1/255*130, 1/255*200, 1/255*255} -- color
    )
end

local function OnDropped(inst)
    light_on(inst)
end

local function OnPickup(inst)
    light_off(inst)
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    MakeInventoryPhysics(inst)

    inst.AnimState:SetBank("crystal_shard")
    inst.AnimState:SetBuild("crystal_shard")
    inst.AnimState:PlayAnimation("idle")
    
    inst:AddTag("crystal")
    inst:AddTag("molebait")
    inst:AddTag("shiny")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    inst:AddComponent("inspectable")
    
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.atlasname = "images/inventoryimages/crystal_shard.xml"
    inst.components.inventoryitem:SetOnDroppedFn(OnDropped)
    inst.components.inventoryitem:SetOnPickupFn(OnPickup)

    inst:AddComponent("stackable")
    inst.components.stackable.maxsize = 40

    inst:AddComponent("lighttweener")
    light_on(inst)

    -- Add recipe for crystal tools
    MakeHauntableLaunch(inst)

    return inst
end

return Prefab("crystal_shard", fn, assets)
```

## Step 6: Creating the Ground Textures

For the biome to have a unique appearance, we need to create custom ground textures:

1. Create `levels/textures/crystal_ground.tex` - This is the base texture for the ground
2. Create `levels/textures/crystal_noise.tex` - This is the noise texture that adds variation

You'll need to use an image editor to create these textures, then convert them to the game's format using the Don't Starve Tools.

## Step 7: Creating the Crystal Deer Brain

Let's create a simple AI for our crystal deer:

### scripts/brains/crystal_deer_brain.lua

```lua
require "behaviours/wander"
require "behaviours/runaway"
require "behaviours/doaction"
require "behaviours/panic"

local CrystalDeerBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
end)

local MIN_FOLLOW_DIST = 5
local TARGET_FOLLOW_DIST = 7
local MAX_FOLLOW_DIST = 10
local WANDER_DIST = 20

local function GetFaceTargetFn(inst)
    return inst.components.combat.target
end

local function KeepFaceTargetFn(inst, target)
    return inst.components.combat:TargetIs(target) and 
           inst.components.combat:InCooldown()
end

function CrystalDeerBrain:OnStart()
    local root = PriorityNode(
    {
        WhileNode(function() return self.inst.components.health.takingfiredamage end, "OnFire", Panic(self.inst)),
        
        ChaseAndAttack(self.inst, 10),
        
        RunAway(self.inst, "player", MIN_FOLLOW_DIST, TARGET_FOLLOW_DIST, function(hunter) 
            return hunter:HasTag("player") and not hunter:HasTag("notarget") 
        end, nil, true),
        
        FaceEntity(self.inst, GetFaceTargetFn, KeepFaceTargetFn),
        
        Wander(self.inst, function() 
            local pos = self.inst:GetPosition()
            return pos
        end, WANDER_DIST)
    }, .25)
    
    self.bt = BT(self.inst, root)
end

return CrystalDeerBrain
```

## Step 8: Adding Recipes for Crystal Items

Let's add some recipes to make use of the crystal shards:

### Add to modmain.lua

```lua
-- Add recipes for crystal items
local crystal_axe = Recipe("crystal_axe", 
    {Ingredient("twigs", 2), Ingredient("crystal_shard", 3)}, 
    RECIPETABS.TOOLS, 
    TECH.SCIENCE_ONE)
crystal_axe.atlas = "images/inventoryimages/crystal_axe.xml"

local crystal_pickaxe = Recipe("crystal_pickaxe", 
    {Ingredient("twigs", 2), Ingredient("crystal_shard", 3)}, 
    RECIPETABS.TOOLS, 
    TECH.SCIENCE_ONE)
crystal_pickaxe.atlas = "images/inventoryimages/crystal_pickaxe.xml"

local crystal_spear = Recipe("crystal_spear", 
    {Ingredient("twigs", 2), Ingredient("crystal_shard", 2), Ingredient("rope", 1)}, 
    RECIPETABS.WAR, 
    TECH.SCIENCE_ONE)
crystal_spear.atlas = "images/inventoryimages/crystal_spear.xml"
```

## Step 9: Testing and Debugging

To test your mod:

1. Place your mod folder in the Don't Starve Together mods directory
2. Enable the mod in the game's mod menu
3. Start a new game and explore to find your Crystal Forest biome
4. Test the various features of your biome

### Common Issues and Solutions:

- **Biome Not Generating**: Check your task and room definitions
- **Missing Textures**: Ensure all texture files are in the correct format and location
- **Prefab Errors**: Check for syntax errors in your prefab definitions
- **AI Issues**: Debug your brain logic if creatures behave unexpectedly

## Step 10: Publishing Your Mod

Once your mod is working correctly, you can publish it to the Steam Workshop:

1. Create a `modicon.tex` and `modicon.xml` (512x512 pixels) for your mod
2. Update your modinfo.lua with a detailed description
3. Use the in-game mod uploader or the Don't Starve Mod Tools on Steam
4. Provide clear instructions and screenshots in your Workshop description

## Extending the Mod

Here are some ideas for extending this mod:

- Add more crystal-themed creatures
- Create special weather effects in the biome
- Add unique gameplay mechanics tied to the crystal theme
- Create a crystal-themed boss
- Add special events that only occur in the Crystal Forest

## Conclusion

Congratulations! You've created a complete mod that adds a new biome to Don't Starve Together. This project demonstrates many important modding concepts:

- World generation and room creation
- Custom ground textures
- Creating unique resources and creatures
- AI programming
- Integrating with the existing game systems

Use what you've learned here as a foundation for creating more complex world modifications in the future!
