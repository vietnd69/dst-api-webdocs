---
id: case-forge
title: Case Study - The Forge Mod
sidebar_position: 2
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Case Study: The Forge Mod

This case study examines "ReForged" - a fan-made mod that recreates and extends "The Forge" event from Don't Starve Together. The Forge was originally a limited-time official event created by Klei Entertainment. This mod implementation demonstrates advanced techniques for creating a complete game mode with custom mechanics, prefabs, components, and UI elements.
- [Gitlab](https://gitlab.com/forged-forge/forge)
- [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=1938752683)

## Overview

The Forge mod converts Don't Starve Together into a combat-focused arena game mode where players fight waves of enemies and bosses. Key features include:

- Custom game mode with distinct rules (no hunger/sanity, combat focus)
- Wave-based enemy system with custom AI and behaviors
- Unique weapons and armor with special abilities
- Custom UI and HUD elements
- Achievement and stat tracking systems
- Extensive configuration options

## Code Structure

The mod follows a well-organized structure:

```
forge/
├── scripts/
│   ├── components/         # Custom components
│   ├── forge_data/         # Core data modules
│   │   ├── prefabs/        # Custom prefabs
│   │   └── components/     # Event-specific components
│   ├── _common_functions.lua  # Shared utility functions 
│   ├── forge_main.lua      # Main mod code
│   ├── forge_combat.lua    # Combat system
│   ├── forge_tuning.lua    # Game balance values
│   └── forge_prefab.lua    # Prefab creation helpers
├── anim/                   # Custom animations
├── images/                 # Images and textures
├── modinfo.lua             # Mod configuration
└── modmain.lua             # Mod entry point
```

## Technical Implementation

### Custom Components

The Forge implements numerous custom components to support its unique gameplay:

```lua
-- Example: Rechargeable Component (for special weapon abilities)
function Rechargeable:SetRechargeTime(time)
    self.maxcharge = time
    self.charge = time
    self.inst:StartUpdatingComponent(self)
    self:OnUpdate(0)
end

function Rechargeable:SetOnReadyFn(fn)
    self.onready = fn
end
```

Key components include:
- `rechargeable` - For abilities with cooldowns
- `buffable` - For applying status effects
- `stat_tracker` - For tracking player performance
- `aoespell` - For area-of-effect abilities
- `corpsereviver` - For player revive mechanics

### Combat System Extensions

The mod significantly extends the base game's combat system to support advanced mechanics:

```lua
-- Adding damage types
_G.TUNING.FORGE.DAMAGETYPES = {
    PHYSICAL = 1,
    MAGIC = 2,
    SOUND = 3,
    GAS = 4,
    LIQUID = 5
}

-- Adding damage buffs
function Combat:AddDamageBuff(buffname, data, recieved, remove_old_buff)
    if remove_old_buff and self:HasDamageBuff(buffname, recieved) then
        self:RemoveDamageBuff(buffname, recieved)
    end
    if not self:HasDamageBuff(buffname, recieved) then
        local buff = type(data) == "number" and {buff = data} or data
        self.damagebuffs[recieved and "recieved" or "dealt"][buffname] = buff
    end
end
```

### Wave Management

Enemy waves are controlled through a sophisticated wave system:

```lua
-- Wave definition example (simplified)
waves = {
    {
        name = "Crocommanders",
        count = 6,
        prefabs = {"crocommander"},
    },
    {
        name = "Pit Pigs",
        count = 6,
        prefabs = {"pitpig"},
        health_override = 200,
    },
    {
        name = "Boarrior",
        count = 1,
        prefabs = {"boarrior"},
        arena_override = "arena2",
    }
}
```

### Custom UI

The mod implements extensive UI modifications for the unique game mode:

```lua
-- UI customization example
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local ImageButton = require "widgets/imagebutton"

-- Patching existing UI classes
for class, fn in pairs(ForgeUI) do
    AddClassPostConstruct(class, fn)
end
```

### Server-Client Communication

The mod uses a robust networking layer to synchronize game state:

```lua
-- Setting up network components
for classif, fn in pairs(ForgeNetworking) do
    AddPrefabPostInit(classif.."_classified", fn)
end

-- Custom command for player location pinging
AddUserCommand("pinglocation", {
    prettyname = STRINGS.REFORGED.USERCOMMANDS.PING_LOCATION_TITLE,
    desc = STRINGS.REFORGED.USERCOMMANDS.PING_LOCATION_DESC,
    permission = COMMAND_PERMISSION.USER,
    params = {"location"},
    paramsoptional = {false},
    serverfn = function(params, caller)
        if TheWorld then
            TheWorld.net.components.command_manager:UpdateCommandCooldownForUser("pinglocation", caller.userid)
            local lavaarenaeventstate = TheWorld.net.components.lavaarenaeventstate
            if lavaarenaeventstate and lavaarenaeventstate.in_progress:value() then
                local player = GetPlayer(caller.userid)
                if player and not (player.ping_banner and player.ping_banner:IsValid()) then
                    banner = SpawnPrefab("rf_ping_banner")
                    local pos = params.location and ConvertTableToPoint(ConvertStringToTable(params.location))
                    if pos then
                        banner.Transform:SetPosition(pos.x, pos.y, pos.z)
                        player.ping_banner = banner
                    end
                end
            end
        end
    end,
})
```

## API Usage Highlights

### Component System

The Forge mod makes extensive use of the component system, both by extending existing components and creating new ones:

```lua
-- Extending the combat component
AddComponentPostInit("combat", function(self)
    self.damage_override = nil
    self.damagetype = nil
    self.damagebuffs = { dealt = {}, recieved = {} }
    
    -- Adding new methods
    function self:SetDamageType(damagetype)
        self.damagetype = damagetype
    end
    
    -- Overriding existing methods
    local _oldGetAttackRange = self.GetAttackRange
    function self:GetAttackRange()
        local weapon = self:GetWeapon()
        if weapon and weapon.components.weapon:CanAltAttack() then
            return weapon.components.weapon.altattackrange
        else
            return _oldGetAttackRange(self)
        end
    end
})
```

### Prefab Creation

The mod introduces a custom helper function `ForgePrefab()` for creating prefabs that integrate with the mod's systems:

```lua
-- ForgePrefab helper function
ForgePrefab = function(name, fn, assets, deps, force_path_search, category, is_mod, atlas, image, mod_icon, stats, abilities, swap_build, swap_data)
    -- Creates a Prefab and adds it to the forge item list
    -- to be displayed in the admin/debug menu.
end
```

### Event System

The mod leverages the event system for coordinating gameplay elements:

```lua
inst:ListenForEvent("playeractivated", function(inst, player)
    if _G.ThePlayer == player then
        UserCommands.RunUserCommand("updateusersfriends", 
            {total_friends = GetFriendCount()}, 
            _G.TheNet:GetClientTableForUser(_G.TheNet:GetUserID()))
    end
end)
```

### World State Management

The mod uses TheWorld to manage game state across clients:

```lua
AddPrefabPostInit("lavaarena", function(inst)
    if not _G.TheNet:IsDedicated() then
        inst:ListenForEvent("playeractivated", function(inst, player)
            if _G.ThePlayer == player then
                UserCommands.RunUserCommand("updateusersfriends", 
                    {total_friends = GetFriendCount()}, 
                    _G.TheNet:GetClientTableForUser(_G.TheNet:GetUserID()))
            end
        end)
    end
end)
```

## Key Lessons

### 1. Component-Based Architecture

The mod demonstrates the power of DST's component system by:
- Extending existing components like `combat` to add new functionality
- Creating specialized components for specific features
- Separating concerns into focused components

### 2. Network Synchronization

Effective multiplayer experience requires careful attention to:
- Synchronized state between server and clients
- Efficient network usage by only sending necessary data
- Using the classified networking pattern for sensitive data

### 3. Game Mode Customization

Creating a complete game mode involves:
- Modifying core game mechanics (hunger, sanity, damage)
- Creating custom UI for mode-specific information
- Managing game progression through waves and stages

### 4. Code Organization

The mod demonstrates good practices in code organization:
- Separating functionality into logical modules
- Using common utility functions
- Keeping configuration separate from implementation

## Conclusion

The Forge mod showcases advanced techniques for creating a complex game mode in Don't Starve Together. By studying its implementation, developers can learn how to effectively use DST's API to create rich, interactive experiences while maintaining good performance and code organization.

## See Also

- [Component System](../core/component-system.md) - For understanding how components work
- [Event System](../core/event-system.md) - For event handling as used in this mod
- [Network System](../core/network-system.md) - For multiplayer synchronization
- [Combat Component](../components/combat.md) - The base component extended in this mod
- [Custom Component Example](custom-component.md) - For learning how to create custom components
