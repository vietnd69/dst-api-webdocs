---
id: character-mod
title: Character Mod
sidebar_position: 3
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Creating a Custom Character

This tutorial walks through creating a custom character for Don't Starve Together. We'll create "Frostbite", a winter-themed character with unique abilities related to cold and ice.

## Project Overview

Our character will have these features:
- Unique stats and abilities
- Custom appearance
- Special starting items
- Unique perks related to temperature and ice

## Step 1: Set Up the Mod Structure

Create these folders and files:

```
frostbite_character_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   └── prefabs/
│       ├── frostbite.lua
│       └── frostbite_none.lua
├── anim/
│   └── frostbite.zip
├── bigportraits/
│   ├── frostbite.xml
│   └── frostbite.tex
├── images/
│   ├── avatars/
│   │   ├── avatar_frostbite.xml
│   │   └── avatar_frostbite.tex
│   ├── avatars_mini/
│   │   ├── frostbite.xml
│   │   └── frostbite.tex
│   ├── names_frostbite.xml
│   └── names_frostbite.tex
└── modicon.tex
```

## Step 2: Create the modinfo.lua File

```lua
name = "Frostbite"
description = "A winter explorer with cold resistance and ice abilities"
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
    "character",
}

-- Configuration options
configuration_options = {
    {
        name = "cold_resistance",
        label = "Cold Resistance",
        options = {
            {description = "Low", data = 60},
            {description = "Medium", data = 120, hover = "2 minutes of extra cold resistance"},
            {description = "High", data = 180}
        },
        default = 120
    },
    {
        name = "ice_damage",
        label = "Ice Damage Bonus",
        options = {
            {description = "10%", data = 0.1},
            {description = "25%", data = 0.25},
            {description = "50%", data = 0.5}
        },
        default = 0.25
    }
}
```

## Step 3: Create the modmain.lua File

```lua
-- Import globals into the environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add character assets
Assets = {
    -- Character select screen
    Asset("IMAGE", "bigportraits/frostbite.tex"),
    Asset("ATLAS", "bigportraits/frostbite.xml"),
    
    -- Character avatar in HUD
    Asset("IMAGE", "images/avatars/avatar_frostbite.tex"),
    Asset("ATLAS", "images/avatars/avatar_frostbite.xml"),
    
    -- Mini map icon
    Asset("IMAGE", "images/avatars_mini/frostbite.tex"),
    Asset("ATLAS", "images/avatars_mini/frostbite.xml"),
    
    -- Character select screen name
    Asset("IMAGE", "images/names_frostbite.tex"),
    Asset("ATLAS", "images/names_frostbite.xml"),
}

-- Register the character prefabs
PrefabFiles = {
    "frostbite",
    "frostbite_none",
}

-- Add the character to the game
AddModCharacter("frostbite", "FEMALE")

-- Add character-specific strings
STRINGS.NAMES.FROSTBITE = "Frostbite"
STRINGS.CHARACTER_TITLES.frostbite = "The Winter Explorer"
STRINGS.CHARACTER_DESCRIPTIONS.frostbite = "• Resistant to cold\n• Does extra damage with ice weapons\n• Gets hungry faster in summer"
STRINGS.CHARACTER_QUOTES.frostbite = "\"The cold never bothered me anyway.\""
STRINGS.CHARACTER_ABOUTME.frostbite = "Frostbite is a winter explorer who has adapted to the cold."
STRINGS.CHARACTER_BIOS.frostbite = {
    { title = "Birthday", desc = "January 21" },
    { title = "Favorite Food", desc = "Ice Cream" },
    { title = "Hates", desc = "Summer heat" },
}

-- Add character speech file
AddModCharacterSpeech("frostbite", "speech_frostbite")

-- Add custom speech strings
STRINGS.CHARACTERS.FROSTBITE = require "speech_frostbite"

-- Add ice damage bonus to weapons with the "iceweapon" tag
AddComponentPostInit("weapon", function(self, inst)
    local old_GetDamage = self.GetDamage
    
    function self:GetDamage(attacker, target)
        local damage, stimuli = old_GetDamage(self, attacker, target)
        
        -- Check if the attacker is Frostbite and the weapon has the ice tag
        if attacker and attacker:HasTag("frostbite") and inst:HasTag("iceweapon") then
            local bonus = GetModConfigData("ice_damage") or 0.25
            damage = damage * (1 + bonus)
        end
        
        return damage, stimuli
    end
end)

-- Add cold resistance
AddPlayerPostInit(function(inst)
    if inst.prefab == "frostbite" then
        -- Add cold resistance tag
        inst:AddTag("frostbite")
        
        -- Add temperature resistance
        if inst.components.temperature then
            local old_GetInsulation = inst.components.temperature.GetInsulation
            
            inst.components.temperature.GetInsulation = function(self)
                local winter_insulation, summer_insulation = old_GetInsulation(self)
                local cold_resistance = GetModConfigData("cold_resistance") or 120
                return winter_insulation + cold_resistance, summer_insulation
            end
        end
        
        -- Increase hunger rate in summer
        inst:ListenForEvent("seasonchange", function(src, data)
            if data.season == "summer" then
                inst.components.hunger.hungerrate = 1.5 * TUNING.WILSON_HUNGER_RATE
            else
                inst.components.hunger.hungerrate = TUNING.WILSON_HUNGER_RATE
            end
        end)
    end
end)
```

## Step 4: Create the Character Prefab

Create `scripts/prefabs/frostbite.lua`:

```lua
local MakePlayerCharacter = require "prefabs/player_common"

local assets = {
    Asset("SCRIPT", "scripts/prefabs/player_common.lua"),
    Asset("ANIM", "anim/frostbite.zip"),
    Asset("SOUND", "sound/willow.fsb"), -- Reuse Willow's sounds for now
}

-- Custom starting inventory
local start_inv = {
    "winterhat", -- Start with a winter hat
    "torch",
    "flint",
    "twigs",
}

-- When the character is revived from ghost
local function onbecamehuman(inst)
    -- Set speed when revived
    inst.components.locomotor:SetExternalSpeedMultiplier(inst, "frostbite_speed_mod", 1)
    
    -- Apply cold resistance
    if inst.components.temperature then
        local cold_resistance = GetModConfigData("cold_resistance") or 120
        inst.components.temperature.inherentinsulation = cold_resistance
    end
end

-- When the character turns into a ghost
local function onbecameghost(inst)
    -- Ghosts are slightly faster
    inst.components.locomotor:SetExternalSpeedMultiplier(inst, "frostbite_speed_mod", 1.1)
    
    -- Remove cold resistance
    if inst.components.temperature then
        inst.components.temperature.inherentinsulation = 0
    end
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

-- Special frost effect when near freezing enemies
local function UpdateFrostAura(inst)
    if inst.components.health:IsDead() or inst:HasTag("playerghost") then return end
    
    local x, y, z = inst.Transform:GetWorldPosition()
    local ents = TheSim:FindEntities(x, y, z, 3, nil, {"player", "companion", "INLIMBO"})
    
    for _, ent in ipairs(ents) do
        if ent.components.temperature and ent ~= inst then
            -- Cool nearby enemies slightly
            ent.components.temperature:DoDelta(-0.5)
            
            -- Visual effect for very cold entities
            if ent.components.temperature:GetCurrent() < 0 then
                local fx = SpawnPrefab("frostbreath")
                if fx then
                    fx.Transform:SetPosition(ent.Transform:GetWorldPosition())
                end
            end
        end
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
    inst.components.hunger.hungerrate = TUNING.WILSON_HUNGER_RATE
    
    -- Temperature resistance
    local cold_resistance = GetModConfigData("cold_resistance") or 120
    inst.components.temperature.inherentinsulation = cold_resistance
    
    -- Add frost aura effect
    inst:DoPeriodicTask(1, UpdateFrostAura)
    
    -- Special perk: Craft ice items without an ice box
    inst:AddTag("icebox_crafter")
    
    -- Load saved data
    inst.OnLoad = onload
    inst.OnNewSpawn = onbecamehuman
end

-- This initializes for both the server and client
local common_postinit = function(inst) 
    -- Minimap icon
    inst.MiniMapEntity:SetIcon("frostbite.tex")
    
    -- Character traits
    inst:AddTag("frostbite")
    inst:AddTag("winterperson")
    
    -- Voice
    inst.soundsname = "willow" -- Use Willow's voice for now
    
    -- Stats display
    inst:AddComponent("talker")
    inst.components.talker.fontsize = 35
    inst.components.talker.font = TALKINGFONT
    inst.components.talker.offset = Vector3(0, -400, 0)
    
    -- Special visual effect: frost breath in winter
    inst:ListenForEvent("seasonchange", function(src, data)
        if data.season == "winter" then
            -- Add frost breath effect in winter
            if not inst._frostbreath_task then
                inst._frostbreath_task = inst:DoPeriodicTask(3, function()
                    if not inst.components.health:IsDead() and not inst:HasTag("playerghost") then
                        local fx = SpawnPrefab("frostbreath")
                        if fx then
                            fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
                        end
                    end
                end)
            end
        else
            -- Remove frost breath effect outside winter
            if inst._frostbreath_task then
                inst._frostbreath_task:Cancel()
                inst._frostbreath_task = nil
            end
        end
    end)
end

-- Return the character function
return MakePlayerCharacter("frostbite", prefabs, assets, common_postinit, master_postinit, start_inv)
```

## Step 5: Create the Character Skin File

Create `scripts/prefabs/frostbite_none.lua`:

```lua
return CreatePrefabSkin("frostbite_none", {
    base_prefab = "frostbite",
    type = "base",
    assets = {
        Asset("ANIM", "anim/frostbite.zip"),
    },
    skins = { normal_skin = "frostbite" },
    skin_tags = { "FROSTBITE", "CHARACTER" },
    build_name_override = "frostbite",
    rarity = "Character",
})
```

## Step 6: Create the Speech File

Create a new file `speech_frostbite.lua` in the mod's root directory:

```lua
return {
    -- Generic responses
    ACTIONFAIL = {
        SHAVE = {
            AWAKEBEEFALO = "I'm not going to try that while it's awake.",
            GENERIC = "I can't shave that!",
            NOBITS = "There's nothing left to shave.",
        },
        STORE = {
            GENERIC = "It's full.",
            NOTALLOWED = "That doesn't go there.",
            INUSE = "Someone beat me to it.",
        },
    },
    
    -- Character-specific dialogue
    DESCRIBE = {
        EVERGREEN = "A bit of winter in any season.",
        EVERGREEN_SPARSE = "It's barely hanging on to life.",
        WINTER_TREE = "The best kind of tree.",
        BEEFALO = "It's so woolly and warm.",
        CAMPFIRE = {
            EMBERS = "I should add something before it goes out.",
            GENERIC = "A welcome source of warmth.",
            HIGH = "That's a bit too warm for my taste.",
            LOW = "The fire's getting a bit low.",
            NORMAL = "Nice and cozy.",
            OUT = "Well, that's done.",
        },
        COLDFIRE = {
            EMBERS = "I should add something before it goes out.",
            GENERIC = "Ah, refreshing.",
            HIGH = "Delightfully cold!",
            LOW = "The fire's getting a bit low.",
            NORMAL = "Nice and cool.",
            OUT = "Well, that's done.",
        },
        ICEBOX = "Feels like home!",
        WINTERHAT = "It's not like I need it, but it's still nice.",
        WINTEROMETER = "I can tell the temperature just fine without it.",
    },
    
    -- Announce strings
    ANNOUNCE_COLD = "Just how I like it!",
    ANNOUNCE_HOT = "Too... hot...!",
    ANNOUNCE_HOUNDS = "Something's coming... something with teeth.",
    ANNOUNCE_HUNGRY = "I need food.",
    ANNOUNCE_DUSK = "The cold night approaches.",
    
    -- Combat related
    COMBAT_QUIT = {
        GENERIC = "I'll get you next time!",
    },
    
    -- Weather related
    ANNOUNCE_SNOWED_ON = "A pleasant dusting of snow!",
    ANNOUNCE_SNOWBALL_DODGE = "You'll have to try harder than that!",
    ANNOUNCE_COLD_RESIST = "The cold is my ally.",
    ANNOUNCE_HAIL_RESIST = "Ice cannot harm me.",
    
    -- Exclusive to Frostbite
    ANNOUNCE_FROST_AURA = "I can feel the chill spreading from me.",
    ANNOUNCE_ICE_CRAFT = "I know the secrets of ice.",
}
```

## Step 7: Create Character Animations

For a complete character mod, you'll need to create the following animation files:

1. **Character Animation**: `anim/frostbite.zip`
   - This contains the character's in-game animations
   - You can start by modifying an existing character's animations

2. **Selection Portrait**: `bigportraits/frostbite.tex` and `bigportraits/frostbite.xml`
   - 300x450 pixel image for the character selection screen

3. **Avatar**: `images/avatars/avatar_frostbite.tex` and `images/avatars/avatar_frostbite.xml`
   - 64x64 pixel image for the HUD

4. **Mini Map Icon**: `images/avatars_mini/frostbite.tex` and `images/avatars_mini/frostbite.xml`
   - 32x32 pixel image for the mini map

5. **Character Name**: `images/names_frostbite.tex` and `images/names_frostbite.xml`
   - Image with the character's name for the selection screen

## Step 8: Testing Your Character

1. Launch Don't Starve Together
2. Enable your mod in the Mods menu
3. Start a new game and select Frostbite
4. Test the character by:
   - Checking the starting inventory
   - Testing cold resistance in winter
   - Using ice weapons to see the damage bonus
   - Observing hunger rate changes in summer

## Customization Options

Here are some ways to enhance your character:

### Add Custom Recipes

```lua
-- In modmain.lua
-- Add a custom recipe that only Frostbite can craft
AddRecipe("ice_staff", 
    {
        Ingredient("twigs", 2),
        Ingredient("bluegem", 1)
    }, 
    GLOBAL.RECIPETABS.MAGIC, 
    GLOBAL.TECH.NONE, -- No science machine needed
    nil, nil, nil, "frostbite", -- Only Frostbite can craft this
    nil, 
    "images/inventoryimages/ice_staff.xml", "ice_staff.tex")
```

### Add Special Abilities

For more unique abilities, you can add custom components or modify existing ones:

```lua
-- In frostbite.lua, add to master_postinit
-- Special ability: Create ice crystals when at low temperature
inst:ListenForEvent("temperaturechange", function(inst)
    if inst.components.temperature:GetCurrent() < 0 then
        -- Spawn ice crystals around the player
        local x, y, z = inst.Transform:GetWorldPosition()
        local theta = math.random() * 2 * PI
        local radius = math.random(2, 3)
        local offset_x = radius * math.cos(theta)
        local offset_z = radius * math.sin(theta)
        
        local ice = SpawnPrefab("ice")
        if ice then
            ice.Transform:SetPosition(x + offset_x, 0, z + offset_z)
        end
    end
end)
```

### Add Custom Animations

For truly unique animations, you'll need to create custom animation files:

1. Use Spriter to create custom animations
2. Export as a zip file
3. Place in the `anim` folder
4. Update the prefab file to use your custom animations

## Common Issues and Solutions

### Problem: Character doesn't appear in the selection screen
**Solution**: Check that all required assets are properly named and in the correct folders

### Problem: Character appears but with missing textures
**Solution**: Verify that animation files are correctly formatted and referenced

### Problem: Special abilities don't work
**Solution**: Add debug prints to check if your event listeners and functions are being called

### Problem: Game crashes when selecting the character
**Solution**: Check for errors in your prefab file, particularly in the postinit functions:

```lua
-- Add error handling to critical functions
local function onbecamehuman(inst)
    if not inst or not inst.components or not inst.components.locomotor then
        return
    end
    
    -- Rest of the function...
end
```

## Next Steps

Now that you've created a basic character, you can:

1. **Create Custom Animations**: Design unique animations for your character
2. **Add Special Abilities**: Develop more complex and unique abilities
3. **Create Custom Items**: Add character-specific items and tools
4. **Add Custom Sound Effects**: Record unique voice lines for your character

For more advanced character creation, check out the [Custom Component](custom-component.md) tutorial to learn how to add entirely new behaviors to your character. 
