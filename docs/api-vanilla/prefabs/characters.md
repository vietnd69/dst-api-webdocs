---
id: characters
title: Character Prefabs
sidebar_position: 2
last_updated: 2023-07-06
---

# Character Prefabs

Character prefabs define the playable characters in Don't Starve Together. Each character has unique abilities, stats, and gameplay mechanics that differentiate them from one another.

## Character Creation

All playable characters are created using the `MakePlayerCharacter` function from the `player_common.lua` module. This function handles the common setup for all player characters, while allowing each character to define their unique aspects.

A typical character prefab structure looks like this:

```lua
local MakePlayerCharacter = require("prefabs/player_common")

local assets = {
    -- Character-specific assets
    Asset("ANIM", "anim/player_basic.zip"),
    Asset("ANIM", "anim/player_idles_wilson.zip"),
    -- Other assets...
}

local prefabs = {
    -- Character-specific prefabs
    "beardhair",  -- Wilson-specific
}

-- Items the character starts with
local start_inv = {}
for k, v in pairs(TUNING.GAMEMODE_STARTING_ITEMS) do
    start_inv[string.lower(k)] = v.WILSON  -- Replace WILSON with the character name
end

-- Common initialization (runs on both client and server)
local function common_postinit(inst)
    -- Add character-specific tags
    inst:AddTag("bearded")     -- Wilson-specific
    
    -- Set up character-specific network variables and client-side behaviors
    -- This runs on both client and server
}

-- Master (server-side) initialization
local function master_postinit(inst)
    -- Set starting inventory
    inst.starting_inventory = start_inv[TheNet:GetServerGameMode()]
    
    -- Add and configure character-specific components
    inst:AddComponent("beard")
    
    -- Set up character-specific stats
    inst.components.health:SetMaxHealth(150)
    inst.components.hunger:SetMax(150)
    inst.components.sanity:SetMax(200)
    
    -- Add special abilities and behaviors
}

-- Return the character prefab
return MakePlayerCharacter("wilson", prefabs, assets, common_postinit, master_postinit)
```

## Core Character Properties

All characters have these base properties:

| Property | Description |
|----------|-------------|
| Health | The character's maximum health points |
| Hunger | The character's maximum hunger points |
| Sanity | The character's maximum sanity points |
| Damage Multiplier | Affects damage dealt by the character |
| Hunger Rate | How quickly the character gets hungry |
| Night Vision | Whether the character can see better at night |
| Diet | What types of food the character can eat |

## Unique Character Mechanics

Characters often have unique components, tags, or mechanics that define their gameplay:

```lua
-- Wilson's beard mechanics
inst:AddComponent("beard")
inst.components.beard.insulation_factor = TUNING.WILSON_BEARD_INSULATION_FACTOR
inst.components.beard:AddCallback(BEARD_DAYS[1], OnGrowShortBeard)
inst.components.beard:AddCallback(BEARD_DAYS[2], OnGrowMediumBeard)
inst.components.beard:AddCallback(BEARD_DAYS[3], OnGrowLongBeard)

-- Willow's fire immunity
inst.components.health.fire_damage_scale = 0
inst:AddComponent("pyromaniac")

-- Wolfgang's mighty form
inst:AddComponent("strongman")
inst.components.strongman:SetStrengthMultiplier(1.5)
```

## Character Animation

Characters use various animation states to represent their actions:

```lua
-- Set up character animation
inst.AnimState:SetBank("wilson")
inst.AnimState:SetBuild("wilson")
inst.AnimState:PlayAnimation("idle")

-- Custom idle animations
inst.AnimState:AddOverrideBuild("player_idles_wilson")
```

## Character-specific Events

Characters often have event handlers for unique gameplay mechanics:

```lua
-- Listen for events
inst:ListenForEvent("startfiredamage", OnStartFireDamage)
inst:ListenForEvent("stopfiredamage", OnStopFireDamage)
inst:ListenForEvent("hungerdelta", OnHungerDelta)
```

## Skill Trees

In newer updates, characters have skill trees that provide progression paths:

```lua
-- Initialize skill tree
inst:AddComponent("skilltreeupdater")
inst.components.skilltreeupdater:SetSkillTreeFn("wilson")
```

## Starting Items

Characters usually have default starting items defined in their prefab:

```lua
-- Default starting items for all game modes
local start_inv = {
    default = {
        "flint",
        "flint",
        "twigs",
        "twigs",
    },
    -- Game mode specific items
    survival = {
        "flint",
        "flint",
        "twigs",
        "twigs",
    },
}
```

## Example: Wilson's Character Prefab

Wilson is the default character and has a beard mechanic that provides insulation against cold:

```lua
local function master_postinit(inst)
    -- Starting items
    inst.starting_inventory = start_inv[TheNet:GetServerGameMode()]

    -- Custom idle animation
    inst.customidleanim = "idle_wilson"

    -- Food affinity (bonus from specific foods)
    inst.components.foodaffinity:AddPrefabAffinity("baconeggs", TUNING.AFFINITY_15_CALORIES_HUGE)

    -- Beard mechanic
    inst:AddComponent("beard")
    inst.components.beard.onreset = OnResetBeard
    inst.components.beard.prize = "beardhair"
    inst.components.beard.is_skinnable = true
    inst.components.beard:AddCallback(BEARD_DAYS[1], OnGrowShortBeard)
    inst.components.beard:AddCallback(BEARD_DAYS[2], OnGrowMediumBeard)
    inst.components.beard:AddCallback(BEARD_DAYS[3], OnGrowLongBeard)

    -- Drop beard contents on death
    inst.EmptyBeard = EmptyBeard
    inst:ListenForEvent("death", EmptyBeard)

    -- Handle when beard is shaved
    inst:ListenForEvent("shaved", OnShaved)
end
``` 
