---
id: case-regorgeitaled
title: Case Study - Re-Gorge-itated Mod
sidebar_position: 5
---

# Case Study: Re-Gorge-itated Mod

This case study examines the implementation of the Re-Gorge-itated mod, which brings back and expands "The Gorge" limited-time event in Don't Starve Together as a permanent, feature-rich game mode.
- [Gitlab](https://gitlab.com/CunningFox146/regorgeitaled)
- [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=1918927570)

## Overview

Re-Gorge-itated (a play on "The Gorge" and "rejuvenated") is a total conversion mod that recreates and enhances the original Gorge event from Don't Starve Together. The Gorge was a limited-time community event where players had to work together to appease the Eternal Gnaw by cooking and offering food. This mod not only recreates that experience but significantly expands it with:

1. Multiple game modes with various difficulty levels and mechanics
2. Enhanced character abilities tailored for The Gorge gameplay
3. Voting systems and community features
4. Special event integrations (Winter's Feast, Halloween)
5. Customizable server settings and gameplay options

## Key Components

### Game Mode Architecture

The mod implements a custom game mode system that expands on the original Gorge event:

```lua
GorgeGameModes = {
    modes = {
        { id = "default", icon = "default.tex" },
        { id = "darkness", icon = "darkness.tex" },
        { id = "endless", icon = "endless.tex" },
        { id = "no_sweat", icon = "no_sweat.tex" },
        { id = "sandbox", icon = "sandbox.tex" },
        { id = "hungry", icon = "hungry.tex" },
        { id = "sick", icon = "sick.tex" },
        { id = "scaling", icon = "scaling.tex" },
        { id = "thieves", icon = "thieves.tex" },
        { id = "rush", icon = "rush.tex" },
        { id = "hard", icon = "hard.tex" },
        { id = "confusion", icon = "confusion.tex" },
        { id = "murder_mystery", icon = "murder_mystery.tex" },
        { id = "moon_curse", icon = "moon_curse.tex" },
    },
}
```

Each game mode provides unique mechanics and challenges:
- **Endless Mode**: Play indefinitely without losing
- **Murder Mystery**: One player is secretly chosen as a murderer
- **Moon Curse**: Influenced by lunar mechanics
- **Confusion**: Item appearances are randomized

### Cooking and Recipe System

The mod recreates and expands The Gorge's cooking system with hundreds of recipes:

```lua
-- From gorge_cooking.lua
function StartCooking(inst, doer)
    if inst.components.container and inst.components.container:GetItemInSlot(1) ~= nil then
        local recipe = FindMatchingRecipe(inst)
        
        if recipe ~= nil then
            -- Recipe found, start cooking process
            local cook_time = recipe.cooktime or 1
            inst.components.cookable:Cook(doer, recipe, cook_time)
            return true
        else
            -- No matching recipe, food will burn
            inst.components.cookable:Cook(doer, nil, 2)
            return true
        end
    end
    return false
end
```

### Character Ability System

The mod implements a custom perk system that adds gorge-specific abilities to each character:

```lua
-- From gorge_perks.lua
GORGE_POWERS = {
    willow = 2,
    wolfgang = 2,
    wendy = 2,
    wx78 = 2,
    wathgrithr = 2,
    webber = 2,
    walter = 2,
}
```

Each character has unique abilities:
- **Wickerbottom**: Starts with fertilizer books
- **Maxwell**: Has shadow book
- **Wanda**: Starts with pocket watch
- **Willow**: Increases campfire fuel efficiency
- **Wolfgang**: Variable speed based on mightiness

### Voting System

The mod implements a sophisticated voting system for community decision-making:

```lua
-- UI integration for votes
inst._isvoted = net_bool(inst.GUID, "quagmire_vote._isvoted")
inst._isskippedvote = net_bool(inst.GUID, "quagmire_vote._isskippedvote")
inst._votecount = net_byte(inst.GUID, "quagmire_vote._votecount")

-- Vote processing
if GORGE_SETTINGS.KICKS_ENABLED then
    if owner.admin then
        UserCommands.RunUserCommand("kick", { user = listing.userid }, owner)
    else
        UserCommands.RunUserCommand("lobbyvote", { cmd = "kick", data = listing.userid }, owner)
    end
end
```

Players can vote on:
- Kicking other players
- Changing game modes
- Character abilities/perks

### UI Customization

The mod significantly modifies the game's UI to support The Gorge gameplay:

```lua
-- Customizing player listing UI
menv.AddClassPostConstruct("widgets/redux/playerlist", function(self)
    local _BuildPlayerList = self.BuildPlayerList
    self.BuildPlayerList = function(self, players, nextWidgets, ...)
        _BuildPlayerList(self, players, nextWidgets, ...)
        
        -- Add kick buttons and developer markers
        local widgets_list = self.scroll_list:GetListWidgets()
        
        -- Modify each player listing
        for i, listing in ipairs(widgets_list) do
            -- UI modifications and additions
        end
    end
end)
```

### World State Management

The mod tracks the state of the game world and the Eternal Gnaw's hunger level:

```lua
GOATMUM_STATES = {
    IDLE = 0,
    START = 1,
    WELCOME = 2,
    WAIT_FOR_PURCHASE = 3,
    SNACKRIFICE = 4,
    GAMELOST = 5,
    GAMEWON = 6
}
```

### Special Events Integration

The mod incorporates seasonal events from the main game:

```lua
GORGE_EVENT = GORGE_SETTINGS.SPECIALEVENTS_ENABLED and 
    (os.date("%m") <= "02" and SPECIAL_EVENTS.WINTERS_FEAST) or 
    (GORGE_SETTINGS.SPECIALEVENTS_ENABLED and WORLD_SPECIAL_EVENT) or 
    SPECIAL_EVENTS.NONE

-- Winter's Feast effect application
if GORGE_EVENT == SPECIAL_EVENTS.WINTERS_FEAST then
    if inst.components.frostybreather then
        inst.components.frostybreather:SetOffsetFn(function() 
            return Vector3(.3, 1.15, 0) 
        end)
        inst.components.frostybreather:Enable()
        inst.components.frostybreather:StartBreath()
    end
end
```

## Implementation Details

### Mod Configuration

The mod provides extensive configuration options:

```lua
configuration_options = {
    -- Voting options
    Config("kick", "Enable kick votes", "Players can vote to kick others in lobby", opt_def, true),
    Config("gamemode", "Enable game modes", "Players can vote to change current game mode", opt_def, true),
    Config("perks", "Enable changeable character's ability", "Players can choose their character's abilities", opt_def, true),
    
    -- Gameplay options
    Config("fixed_gamemode", "Fixed game mode", "The server will run only this game mode", opt_def, false),
    Config("specialevents", "Enable Special Events", "Change Special Events: Winter Feast, Halloween Nights.", opt_def, false),
    Config("changablefemusic", "Change music in lobby", "Tired of The Gorge Theme? Change it to the new one!", opt_def, true),
}
```

### Network Synchronization

The mod implements custom network synchronization for multiplayer:

```lua
-- Network variables for voting system
inst._isvoted = net_bool(inst.GUID, "quagmire_vote._isvoted")
inst._isskippedvote = net_bool(inst.GUID, "quagmire_vote._isskippedvote")
inst._votecount = net_byte(inst.GUID, "quagmire_vote._votecount")

-- Synchronizing food preparation
function SyncGorgeRecipeBook(player)
    if not TheWorld.ismastersim then
        SendModRPCToServer(MOD_RPC.ReGorgeitated.SyncRecipeBook)
        return
    end
    
    -- Server-side processing
    for i = 1, #all_recipes do
        local recipe = all_recipes[i]
        if player.components.quagmire_recipebook and recipe.id then
            player.components.quagmire_recipebook:LearnRecipe(recipe.id)
        end
    end
end
```

### Mod Compatibility

The mod includes compatibility systems for other mods:

```lua
-- Disabling incompatible systems
local skilltreedefs = require "prefabs/skilltree_defs"
for characterprefab, skills in pairs(skilltreedefs.SKILLTREE_DEFS) do
    skilltreedefs.SKILLTREE_DEFS[characterprefab] = nil
end

-- Compatibility with modded characters
menv.modimport("scripts/regorge/mod_compatibility.lua")

-- Patching official characters
if not table.contains(NO_PATCH_CHARACTERS, inst.prefab) and HasEventData(inst.prefab) then
    event_server_data("quagmire", "prefabs/" .. inst.prefab).master_postinit(inst)
end
```

## Technical Innovations

### Custom Game Logic

The mod introduces several technical innovations:

1. **Component Overrides**: Modifies core game components to fit The Gorge gameplay
   ```lua
   menv.AddComponentPostInit("skilltreeupdater", function(self)
       local original_AddSkillXP = self.AddSkillXP
       self.AddSkillXP = function(amount, prefab, fromrpc)
           TheSkillTree.ignorexp = true -- disable notifications
           original_AddSkillXP(self, amount, prefab, fromrpc)
       end
   end)
   ```

2. **Custom Components**: Creates new components specific to The Gorge
   ```lua
   inst:AddComponent("quagmire_recipebook")
   inst:AddComponent("quagmire_shopper")
   ```

3. **Character Ability Integration**: Makes standard character abilities work within The Gorge context
   ```lua
   if characterType == "nimble" then
       locomotor:SetWalkSpeed(5) -- Faster walker
       locomotor:SetRunSpeed(8)  -- Faster runner
   elseif characterType == "heavy" then
       locomotor:SetWalkSpeed(3) -- Slower walker
       locomotor:SetRunSpeed(4.5) -- Slower runner
   end
   ```

4. **UI Modifications**: Extensively customizes the UI for The Gorge experience
   ```lua
   local _FestivalNumberBadge = TEMPLATES.FestivalNumberBadge
   TEMPLATES.FestivalNumberBadge = function(festival, ...)
       return _FestivalNumberBadge("quagmire", ...)
   end
   ```

## Learning Points

### Event Recreation

The mod demonstrates how to recreate official limited-time events with expanded functionality:

1. **Research**: Study the original event's mechanics and assets
2. **Adaptation**: Make appropriate adjustments for standalone play
3. **Expansion**: Add new features that enhance the original experience
4. **Configuration**: Provide customization options for various play styles

### Game Mode Implementation

The mod showcases techniques for creating multiple game modes within a single mod:

1. **Mode Definition**: Clear structure for defining different modes
2. **Parameter Control**: Tuning gameplay parameters based on selected mode
3. **UI Integration**: Visual indicators and mode selection tools
4. **State Management**: Managing different world states based on mode

### Networking and Multiplayer

The mod demonstrates excellent practices for networked multiplayer gameplay:

1. **Voting Systems**: Synchronized voting mechanisms
2. **Data Synchronization**: Keeping game state synchronized across clients
3. **Authority Control**: Server-side validation with client-side prediction
4. **Player Interactions**: Special interactions between players (like Murder Mystery mode)

## See Also

- [Component System](../core/component-system.md) - For understanding how components work and how they're modified in this mod
- [Network System](../core/network-system.md) - For details on network synchronization used in voting and game state
- [UI System](../core/ui-system.md) - For creating and modifying UI elements as done in this mod
- [Event System](../core/event-system.md) - For event handling used throughout the mod
- [World State](../core/worldstate.md) - For managing global game state similar to The Gorge's hunger mechanics
- [Custom Game Mode Example](custom-game-mode.md) - For more examples of creating custom game modes
