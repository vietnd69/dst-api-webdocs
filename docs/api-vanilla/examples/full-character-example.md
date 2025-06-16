---
id: full-character-example
title: Full Character Example
sidebar_position: 3
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Full Character Example

This guide provides a complete example of creating a custom character for Don't Starve Together. We'll create a character named "Woodie Jr." who has unique abilities related to trees and woodcutting.

## Project Structure

A complete character mod typically has the following structure:

```
modmain.lua
modinfo.lua
scripts/
  prefabs/
    woodiejr.lua
    woodiejr_none.lua
  components/
    woodcutter.lua
anim/
  woodiejr.zip
  woodiejr_avatar.xml
  woodiejr_avatar.tex
images/
  avatars/
    avatar_woodiejr.tex
    avatar_woodiejr.xml
  bigportraits/
    woodiejr.tex
    woodiejr.xml
  map_icons/
    woodiejr.tex
    woodiejr.xml
  selectscreen_portraits/
    woodiejr.tex
    woodiejr.xml
  selectscreen_portraits/
    woodiejr_silho.tex
    woodiejr_silho.xml
bigportraits/
  woodiejr.xml
  woodiejr.tex
```

## Step 1: Create modinfo.lua

The `modinfo.lua` file contains metadata about your mod:

```lua
name = "Woodie Jr."
description = "A young lumberjack with tree-related abilities."
author = "Your Name"
version = "1.0.0"

-- Compatible with Don't Starve Together
dst_compatible = true
dont_starve_compatible = false
reign_of_giants_compatible = false
shipwrecked_compatible = false

-- Character mods need to be client and server compatible
client_only_mod = false
all_clients_require_mod = true

-- Icon for the mod
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Character selection screen
server_filter_tags = {"character", "woodiejr"}

-- Configuration options
configuration_options = {
    {
        name = "WOODCUTTING_BONUS",
        label = "Woodcutting Bonus",
        options = {
            {description = "25%", data = 0.25},
            {description = "50%", data = 0.5, default = true},
            {description = "75%", data = 0.75},
        },
        default = 0.5,
    },
}
```

## Step 2: Create modmain.lua

The `modmain.lua` file is the entry point of your mod:

```lua
-- Assets to preload
Assets = {
    -- Character-specific assets
    Asset("IMAGE", "images/saveslot_portraits/woodiejr.tex"),
    Asset("ATLAS", "images/saveslot_portraits/woodiejr.xml"),

    Asset("IMAGE", "images/selectscreen_portraits/woodiejr.tex"),
    Asset("ATLAS", "images/selectscreen_portraits/woodiejr.xml"),
    Asset("IMAGE", "images/selectscreen_portraits/woodiejr_silho.tex"),
    Asset("ATLAS", "images/selectscreen_portraits/woodiejr_silho.xml"),

    Asset("IMAGE", "bigportraits/woodiejr.tex"),
    Asset("ATLAS", "bigportraits/woodiejr.xml"),

    Asset("IMAGE", "images/map_icons/woodiejr.tex"),
    Asset("ATLAS", "images/map_icons/woodiejr.xml"),

    Asset("IMAGE", "images/avatars/avatar_woodiejr.tex"),
    Asset("ATLAS", "images/avatars/avatar_woodiejr.xml"),

    -- Character-specific animation files
    Asset("ANIM", "anim/woodiejr.zip"),
}

-- Add character to mod character list
AddModCharacter("woodiejr", "MALE")

-- Configuration
local WOODCUTTING_BONUS = GetModConfigData("WOODCUTTING_BONUS")

-- Add custom strings
STRINGS.NAMES.WOODIEJR = "Woodie Jr."
STRINGS.CHARACTER_TITLES.woodiejr = "The Young Lumberjack"
STRINGS.CHARACTER_DESCRIPTIONS.woodiejr = "• Has a special affinity for trees\n• Cuts trees faster\n• Takes less damage from falling trees\n• Gets hungry faster when not near trees"
STRINGS.CHARACTER_QUOTES.woodiejr = "\"I'm gonna be the best lumberjack ever!\""
STRINGS.CHARACTER_SURVIVABILITY.woodiejr = "Slim"

-- Character-specific speech
STRINGS.CHARACTERS.WOODIEJR = require "speech_woodiejr"

-- Add custom recipes
local RECIPETABS = GLOBAL.RECIPETABS
local TECH = GLOBAL.TECH
local Recipe = GLOBAL.Recipe
local Ingredient = GLOBAL.Ingredient

-- Add a special axe recipe for Woodie Jr.
Recipe("junior_axe", 
    {Ingredient("twigs", 1), Ingredient("flint", 1)}, 
    RECIPETABS.TOOLS, 
    TECH.NONE, 
    nil, nil, nil, nil, "woodiejr")

-- Add character-specific tuning
TUNING.WOODIEJR_HUNGER_RATE = TUNING.WILSON_HUNGER_RATE * 1.25
TUNING.WOODIEJR_WOODCUTTING_BONUS = WOODCUTTING_BONUS

-- Add character-specific component postinit
AddComponentPostInit("woodcutter", function(self, inst)
    if inst:HasTag("woodiejr") then
        self.efficiency = self.efficiency * (1 + TUNING.WOODIEJR_WOODCUTTING_BONUS)
    end
end)

-- Add character-specific prefab postinit
AddPrefabPostInit("treeguard", function(inst)
    inst:AddComponent("friendlevels")
    
    local function OnAttacked(inst, data)
        if data.attacker and data.attacker:HasTag("woodiejr") then
            -- Woodie Jr. has a chance to pacify treeguards
            if math.random() < 0.5 then
                inst.components.combat:SetTarget(nil)
                inst:PushEvent("makefriend", {player = data.attacker})
            end
        end
    end
    
    inst:ListenForEvent("attacked", OnAttacked)
end)
```

## Step 3: Create Character Prefab

Create the file `scripts/prefabs/woodiejr.lua`:

```lua
local MakePlayerCharacter = require "prefabs/player_common"

local assets = {
    Asset("SCRIPT", "scripts/prefabs/player_common.lua"),
}

-- Custom starting inventory
local start_inv = {
    "junior_axe",
    "pinecone",
}

-- When the character is revived from ghost
local function onbecamehuman(inst)
    -- Set speed when reviving from ghost (optional)
    inst.components.locomotor:SetExternalSpeedMultiplier(inst, "woodiejr_speed_mod", 1)
}

local function onbecameghost(inst)
    -- Remove speed modifier when becoming a ghost
    inst.components.locomotor:RemoveExternalSpeedMultiplier(inst, "woodiejr_speed_mod")
}

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

-- This function customizes the character's stats
local function CustomizationFn(inst)
    -- choose which sounds this character will play
    inst.soundsname = "woodie"
    
    -- Minimap icon
    inst.MiniMapEntity:SetIcon("woodiejr.tex")
    
    -- Add character-specific tags
    inst:AddTag("woodiejr")
    inst:AddTag("treefriend")
    
    -- Stats    
    inst.components.health:SetMaxHealth(150)
    inst.components.hunger:SetMax(150)
    inst.components.sanity:SetMax(200)
    
    -- Hunger rate changes based on proximity to trees
    inst:DoPeriodicTask(1, function()
        local x, y, z = inst.Transform:GetWorldPosition()
        local ents = TheSim:FindEntities(x, y, z, 10, {"tree"})
        
        if #ents >= 3 then
            -- Near trees, normal hunger rate
            inst.components.hunger.hungerrate = TUNING.WILSON_HUNGER_RATE
        else
            -- Away from trees, higher hunger rate
            inst.components.hunger.hungerrate = TUNING.WOODIEJR_HUNGER_RATE
        end
    end)
    
    -- Tree damage resistance
    inst:ListenForEvent("attacked", function(inst, data)
        if data.attacker and data.attacker:HasTag("tree") then
            -- Take 50% less damage from trees
            data.damage = data.damage * 0.5
        end
    end)
    
    -- Better at chopping
    inst:ListenForEvent("equip", function(inst, data)
        if data.item and data.item.components.tool and data.item.components.tool:CanDoAction(ACTIONS.CHOP) then
            -- Apply woodcutting speed bonus
            inst.components.worker:SetEfficiencyMultiplier(ACTIONS.CHOP, 1 + TUNING.WOODIEJR_WOODCUTTING_BONUS)
        end
    end)
    
    inst:ListenForEvent("unequip", function(inst, data)
        if data.item and data.item.components.tool and data.item.components.tool:CanDoAction(ACTIONS.CHOP) then
            -- Remove woodcutting speed bonus
            inst.components.worker:SetEfficiencyMultiplier(ACTIONS.CHOP, 1)
        end
    end)
    
    -- Add a custom component if needed
    if not inst.components.woodcutter then
        inst:AddComponent("woodcutter")
    end
end

-- This initializes for the server only
local master_postinit = function(inst)
    -- Set starting inventory
    inst.starting_inventory = start_inv
    
    -- Choose character's stats
    inst.CustomizationFn = CustomizationFn
    
    -- Set up character
    if inst.components.eater then
        -- Make character vegetarian
        inst.components.eater:SetDiet({FOODTYPE.VEGGIE}, {FOODTYPE.MEAT})
    end
    
    -- Uncomment to add character-specific crafting recipes
    -- inst:AddComponent("builder")
    -- inst.components.builder.bonus_tech_level = { SCIENCE = 1 }
    
    -- Register event listeners
    inst:ListenForEvent("onhitother", function(inst, data)
        if data.target and data.target:HasTag("tree") and not data.target:HasTag("stump") then
            -- Chance to get extra logs when chopping
            if math.random() < TUNING.WOODIEJR_WOODCUTTING_BONUS then
                local log = SpawnPrefab("log")
                if log then
                    log.Transform:SetPosition(data.target.Transform:GetWorldPosition())
                    log.components.inventoryitem:OnDropped()
                end
            end
        end
    end)
}

-- This initializes for the client only
local client_postinit = function(inst)
    -- Set up character portraits
    inst:ListenForEvent("setowner", function()
        -- Choose character's skin
        inst:SetPrefabNameOverride("woodiejr")
        
        -- Set up character's animations
        local skin_name = inst:GetSkinName()
        if skin_name == nil then
            -- Default skin
            inst.components.playeravatardata:SetData("woodiejr")
        else
            -- Custom skin if available
            inst.components.playeravatardata:SetData(skin_name)
        end
    end)
end

-- Create the character
return MakePlayerCharacter("woodiejr", prefabs, assets, common_postinit, master_postinit, client_postinit)
```

## Step 4: Create No-Character Variant

Create the file `scripts/prefabs/woodiejr_none.lua`:

```lua
local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    
    --[[Non-networked entity]]
    inst.entity:SetCanSleep(false)
    inst.persists = false
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    return inst
end

return Prefab("woodiejr_none", fn)
```

## Step 5: Create Custom Component

Create the file `scripts/components/woodcutter.lua`:

```lua
local Woodcutter = Class(function(self, inst)
    self.inst = inst
    self.efficiency = 1.0
    self.tree_friend_level = 0
    self.trees_chopped = 0
end)

function Woodcutter:OnChopTree(tree)
    self.trees_chopped = self.trees_chopped + 1
    
    -- Every 10 trees chopped increases tree friend level
    if self.trees_chopped >= 10 then
        self.trees_chopped = 0
        self.tree_friend_level = self.tree_friend_level + 1
        
        -- Announce milestone
        if self.inst.components.talker then
            self.inst.components.talker:Say("I've become a better friend to the trees!")
        end
        
        -- Increase woodcutting efficiency
        self.efficiency = 1.0 + (self.tree_friend_level * 0.05)
    end
    
    -- Chance to get tree seeds
    if math.random() < 0.3 + (self.tree_friend_level * 0.05) then
        local seed
        if tree:HasTag("evergreen") then
            seed = SpawnPrefab("pinecone")
        elseif tree:HasTag("deciduoustree") then
            seed = SpawnPrefab("acorn")
        elseif tree:HasTag("mushtree") then
            seed = SpawnPrefab("spore_medium")
        end
        
        if seed then
            self.inst.components.inventory:GiveItem(seed)
            if self.inst.components.talker then
                self.inst.components.talker:Say("A gift from the forest!")
            end
        end
    end
end

function Woodcutter:GetEfficiency()
    return self.efficiency
end

function Woodcutter:GetTreeFriendLevel()
    return self.tree_friend_level
end

function Woodcutter:OnSave()
    return {
        tree_friend_level = self.tree_friend_level,
        trees_chopped = self.trees_chopped
    }
end

function Woodcutter:OnLoad(data)
    if data then
        self.tree_friend_level = data.tree_friend_level or 0
        self.trees_chopped = data.trees_chopped or 0
        self.efficiency = 1.0 + (self.tree_friend_level * 0.05)
    end
end

return Woodcutter
```

## Step 6: Create Character Speech

Create the file `scripts/speech_woodiejr.lua`:

```lua
return {
    -- Generic speech
    ACTIONFAIL = {
        REPAIR = {
            WRONGPIECE = "That doesn't look right.",
        },
        BUILD = {
            MOUNTED = "I can't build while riding.",
            HASPET = "I've already got a friend.",
        },
    },
    
    -- Character-specific speech
    DESCRIBE = {
        EVERGREEN = {
            GENERIC = "Hello, tree friend!",
            BURNING = "No! The tree is burning!",
            BURNT = "Poor tree...",
            CHOPPED = "Sorry, tree friend. I needed the wood.",
        },
        EVERGREEN_SPARSE = {
            GENERIC = "This tree looks sad.",
            BURNING = "No! The tree is burning!",
            BURNT = "Poor tree...",
            CHOPPED = "Sorry, tree friend. I needed the wood.",
        },
        DECIDUOUSTREE = {
            GENERIC = "What a lovely tree!",
            BURNING = "No! The tree is burning!",
            BURNT = "Poor tree...",
            CHOPPED = "Sorry, tree friend. I needed the wood.",
        },
        AXE = "My trusty tree-cutting friend!",
        LUCY = "Dad's axe talks too much.",
        LOG = "I got some wood!",
        TREEGUARD = "The trees are mad at me!",
        PINECONE = "I should plant this!",
        PINECONE_SAPLING = "Grow big and strong!",
    },
    
    -- Announce when character performs actions
    ANNOUNCE_CHOPPING_TREE = {
        "Chop chop!",
        "Sorry, tree!",
        "I need this wood!",
    },
    ANNOUNCE_PLANTING = {
        "Grow big and strong!",
        "I'll visit you when you're all grown up!",
        "One day you'll be a mighty tree!",
    },
    ANNOUNCE_HUNGRY = "My tummy is rumbling!",
    ANNOUNCE_COLD = "Brrr! I need a campfire!",
    ANNOUNCE_HOT = "Phew! It's hot!",
    
    -- Reactions to finding items
    ANNOUNCE_FOUND_WOOD = "Wood! My favorite!",
    ANNOUNCE_FOUND_PINECONE = "A baby tree!",
    
    -- Character-specific reactions
    ANNOUNCE_NEAR_TREES = "The trees are my friends!",
    ANNOUNCE_AWAY_FROM_TREES = "I miss the trees...",
    
    -- Battlecry
    BATTLECRY = {
        GENERIC = "I'll protect the forest!",
        PIG = "Sorry piggy!",
        PREY = "I don't want to hurt you!",
        SPIDER = "Get away from my trees!",
        TREEGUARD = "Can't we be friends?",
    },
}
```

## Step 7: Create Junior Axe Prefab

Create the file `scripts/prefabs/junior_axe.lua`:

```lua
local assets =
{
    Asset("ANIM", "anim/junior_axe.zip"),
    Asset("ANIM", "anim/swap_junior_axe.zip"),
}

local function onequip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "swap_junior_axe", "swap_axe")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
    
    -- Special bonus for Woodie Jr.
    if owner:HasTag("woodiejr") then
        inst.components.tool:SetEffectiveness(ACTIONS.CHOP, 1.5)
    end
end

local function onunequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
    
    -- Reset effectiveness
    inst.components.tool:SetEffectiveness(ACTIONS.CHOP, 1.0)
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    MakeInventoryPhysics(inst)

    inst.AnimState:SetBank("junior_axe")
    inst.AnimState:SetBuild("junior_axe")
    inst.AnimState:PlayAnimation("idle")

    inst:AddTag("sharp")
    inst:AddTag("tool")

    if not TheWorld.ismastersim then
        return inst
    end

    inst.entity:SetPristine()

    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem:SetSinks(true)

    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.CHOP, 1)

    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(150)
    inst.components.finiteuses:SetUses(150)
    inst.components.finiteuses:SetOnFinished(inst.Remove)
    inst.components.finiteuses:SetConsumption(ACTIONS.CHOP, 1)

    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(20)

    inst:AddComponent("inspectable")

    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(onequip)
    inst.components.equippable:SetOnUnequip(onunequip)

    MakeHauntableLaunch(inst)

    return inst
end

return Prefab("junior_axe", fn, assets)
```

## Step 8: Art Assets

For a complete character, you'll need to create various art assets:

1. Character animations in `anim/woodiejr.zip`
2. Avatar images for the HUD
3. Portrait images for character selection
4. Map icon
5. Silhouette for character selection

These require using Spriter or similar animation tools and image editing software like Photoshop or GIMP.

## Step 9: Testing Your Character

To test your character:

1. Place your mod folder in the Don't Starve Together mods directory
2. Enable the mod in the game's mod menu
3. Start a new game and select your character
4. Test all the character's special abilities and traits

## Common Issues and Troubleshooting

- **Character doesn't appear in selection screen**: Check that all required assets are properly loaded in modmain.lua
- **Animations not working**: Verify that your animation files are correctly formatted and referenced
- **Custom abilities not working**: Check for errors in the console and verify component interactions
- **Speech not appearing**: Make sure speech_woodiejr.lua is properly formatted and required in modmain.lua

## Conclusion

This example demonstrates a complete character mod with:
- Custom stats and abilities
- Special interactions with the environment
- A unique starting item
- Custom speech patterns
- A specialized component for tracking character progression

You can expand on this foundation by adding more unique abilities, custom animations, or additional items specific to your character.
