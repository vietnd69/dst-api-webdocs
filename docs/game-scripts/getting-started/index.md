---
title: Getting Started with DST Lua API
description: Complete guide to Don't Starve Together modding and API usage
sidebar_position: 1
slug: /getting-started
last_updated: 2023-06-15
build_version: 676042
change_status: stable
---

# Getting Started with DST Lua API

Welcome to the Don't Starve Together (DST) Lua API documentation! This comprehensive guide will take you from basic API understanding to creating advanced mods for the game.

## Version History

| Date | Build | Changes |
|------|-------|---------|
| 2023-06-15 | 675312 | Initial documentation |

## Introduction to DST Modding

Don't Starve Together is a multiplayer survival game developed by Klei Entertainment. The game is highly moddable, allowing players and developers to create custom content and modify gameplay through Lua scripting.

### What is the DST Lua API?

The DST Lua API is a comprehensive set of functions, components, and systems that allow modders to interact with the game's core functionality. Through this API, you can:

- Create new items, characters, creatures, and structures
- Modify existing game mechanics and behaviors
- Add new gameplay features and systems
- Create custom UI elements and screens
- Change world generation and environmental features

## Prerequisites

Before diving into DST modding, you should have:

- Basic programming knowledge
- Familiarity with Lua programming language
- Understanding of Don't Starve Together gameplay mechanics
- A copy of Don't Starve Together on Steam
- Text editor for code development
- Steam Workshop access for distribution

## Setting Up Your Modding Environment

### Find Your Mods Directory

1. **Windows**: `C:\Users\[YourUsername]\Documents\Klei\DoNotStarveTogether\mods\`
2. **Mac**: `~/Documents/Klei/DoNotStarveTogether/mods/`
3. **Linux**: `~/.klei/DoNotStarveTogether/mods/`

### Basic Mod Structure

```
my_first_mod/
├── modinfo.lua       # Mod metadata and configuration
├── modmain.lua       # Main entry point for your mod
├── scripts/          # Custom scripts folder
│   ├── prefabs/      # Custom entity definitions
│   └── components/   # Custom component definitions
├── anim/             # Custom animations
└── images/           # Images and icons
    └── inventoryimages/  # Item icons
```

## Understanding the Core Systems

DST's codebase is organized around several core systems:

### Entity-Component System

The game uses an entity-component architecture:

- **Entities**: Base objects in the world (players, creatures, items)
- **Components**: Modular pieces of functionality attached to entities
- **Prefabs**: Templates for creating entities with predefined components

### Script Organization

The API scripts are organized in several key directories:

- **actions.lua**: Defines player actions like chopping, mining, etc.
- **behaviours/**: AI behavior scripts
- **brains/**: AI decision-making scripts
- **components/**: Entity component definitions
- **prefabs/**: Entity template definitions
- **stategraphs/**: State machine definitions for entities

## Your First Mod: Complete Tutorial

### Step 1: Create Mod Directory Structure

Create your mod folder structure in the game's mods directory:

```
mods/
└── your_first_mod/
    ├── modinfo.lua          # Mod metadata and configuration
    ├── modmain.lua          # Main mod entry point
    ├── scripts/
    │   └── prefabs/
    │       └── myitem.lua   # Custom item definition
    └── images/
        └── inventoryimages/
            └── myitem.tex   # Item icon
```

### Step 2: Create modinfo.lua

```lua
-- modinfo.lua - Mod metadata and configuration
name = "My First Mod"
description = "A simple example mod for learning DST modding"
author = "Your Name"
version = "1.0.0"

forumthread = ""
api_version = 10

dst_compatible = true
dont_starve_compatible = false
reign_of_giants_compatible = false

all_clients_require_mod = true
client_only_mod = false

icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Mod configuration options
configuration_options = {
    {
        name = "item_durability",
        label = "Item Durability",
        options = {
            {description = "Low", data = 50},
            {description = "Normal", data = 100},
            {description = "High", data = 150},
        },
        default = 100,
    }
}
```

### Step 3: Create modmain.lua

```lua
-- modmain.lua - Main mod entry point
-- This file is executed when the mod loads

-- Add your custom item to the prefab files list
PrefabFiles = {
    "myitem",
}

-- Add item to inventory images
Assets = {
    Asset("ATLAS", "images/inventoryimages/myitem.xml"),
    Asset("IMAGE", "images/inventoryimages/myitem.tex"),
}

-- Add recipe for your item
AddRecipe2("myitem", 
    {Ingredient("twigs", 2), Ingredient("flint", 1)}, 
    TECH.NONE, 
    {
        placer = "myitem_placer",
        min_spacing = 0,
        atlas = "images/inventoryimages/myitem.xml",
        image = "myitem.tex",
    }
)

-- Example of using mod configuration
local config_durability = GetModConfigData("item_durability") or 100
TUNING.MYITEM_DURABILITY = config_durability

-- Debug print to confirm mod loading
modprint("My First Mod loaded successfully!")
```

### Step 4: Create Custom Item Prefab

```lua
-- scripts/prefabs/myitem.lua - Custom item definition
local assets = {
    Asset("ANIM", "anim/myitem.zip"),
    Asset("ATLAS", "images/inventoryimages/myitem.xml"),
    Asset("IMAGE", "images/inventoryimages/myitem.tex"),
}

local function fn()
    local inst = CreateEntity()
    
    -- Add standard entity components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Set up visual appearance
    inst.AnimState:SetBank("myitem")
    inst.AnimState:SetBuild("myitem")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add to inventory item group
    MakeInventoryPhysics(inst)
    
    -- Network entity setup
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add inventory item component
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "myitem"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/myitem.xml"
    
    -- Add inspectable component
    inst:AddComponent("inspectable")
    
    -- Add tool functionality (example: axe)
    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.CHOP)
    
    -- Add finite uses
    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(TUNING.MYITEM_DURABILITY or 100)
    inst.components.finiteuses:SetUses(TUNING.MYITEM_DURABILITY or 100)
    inst.components.finiteuses:SetOnFinished(inst.Remove)
    
    return inst
end

return Prefab("myitem", fn, assets)
```

### Step 5: Testing Your Mod

1. **Enable Debug Mode**: Set `CHEATS_ENABLED = true` in settings
2. **Load the Game**: Start DST and enable your mod
3. **Spawn Test Item**: Use console command `c_give("myitem", 1)`
4. **Test Functionality**: Verify the item works as expected

### Step 6: Common Debugging Commands

```lua
-- Console commands for mod debugging
c_give("myitem", 1)                    -- Give yourself the item
c_spawn("myitem", 5)                   -- Spawn items on ground
c_find("myitem")                       -- Find instances in world
print(TUNING.MYITEM_DURABILITY)       -- Check configuration values
```

## Common Modding Scenarios

### Scenario 1: Creating a Custom Character

```lua
-- modmain.lua for character mod
local require = GLOBAL.require
local STRINGS = GLOBAL.STRINGS

-- Character assets
Assets = {
    Asset("ANIM", "anim/mycharacter.zip"),
    Asset("ANIM", "anim/ghost_mycharacter_build.zip"),
}

-- Add character to game
AddModCharacter("mycharacter", "FEMALE", {
    { type = "normal_skin", play_emotes = true },
    { type = "ghost_skin", anim_bank = "ghost", idle_anim = "idle" }
})

-- Character strings
STRINGS.CHARACTER_NAMES.mycharacter = "My Character"
STRINGS.CHARACTER_DESCRIPTIONS.mycharacter = "A unique character with special abilities"
STRINGS.CHARACTER_QUOTES.mycharacter = "\"I have my own way of doing things.\""

-- Character-specific stats
AddPlayerPostInit(function(inst)
    if inst.prefab == "mycharacter" then
        -- Custom starting items
        inst.components.inventory:GiveItem(SpawnPrefab("mystartingitem"))
        
        -- Custom stats
        inst.components.health:SetMaxHealth(120)
        inst.components.sanity:SetMax(180)
        inst.components.hunger:SetMax(140)
    end
end)
```

### Scenario 2: Adding Custom Recipes and Crafting

```lua
-- Custom crafting station
AddRecipe2("mycraftingstation",
    {Ingredient("boards", 4), Ingredient("rope", 2)},
    TECH.SCIENCE_ONE,
    {
        placer = "mycraftingstation_placer",
        atlas = "images/inventoryimages/mycraftingstation.xml",
        image = "mycraftingstation.tex",
    },
    {"STRUCTURES", "CRAFTING"}
)

-- Recipe that requires custom station
AddRecipe2("advanceditem",
    {Ingredient("gold", 2), Ingredient("gears", 1)},
    TECH.MYCUSTOMTECH,
    {
        builder_tag = "mycraftingstation",  -- Requires being near custom station
        atlas = "images/inventoryimages/advanceditem.xml",
        image = "advanceditem.tex",
    }
)

-- Add new tech level
TECH.MYCUSTOMTECH = {MYCUSTOMTECH = 1}
```

### Scenario 3: World Generation Modifications

```lua
-- Add custom world generation content
AddRoomPreInit("Forest", function(room)
    -- Add custom prefab to forest rooms
    room.contents.distributeprefabs = room.contents.distributeprefabs or {}
    table.insert(room.contents.distributeprefabs, "mycustomprefab")
end)

-- Add custom biome
AddLevel({
    id = "MYCUSTOMLEVEL",
    name = "My Custom World",
    desc = "A world with custom features",
    location = "forest",
    version = 2,
    overrides = {
        {"world_size", "default"},
        {"season_start", "autumn"},
        {"mycustomsetting", "enabled"}
    }
})
```

### Scenario 4: Custom Components and Behaviors

```lua
-- scripts/components/mycustomcomponent.lua
local MyCustomComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 0
    self.max_value = 100
end)

function MyCustomComponent:SetValue(value)
    self.value = math.max(0, math.min(value, self.max_value))
    self.inst:PushEvent("valuechanged", {value = self.value})
end

function MyCustomComponent:OnSave()
    return {value = self.value}
end

function MyCustomComponent:OnLoad(data)
    if data and data.value then
        self.value = data.value
    end
end

return MyCustomComponent

-- Using the component in modmain.lua
AddComponentPostInit("inventoryitem", function(self)
    -- Add custom functionality to all inventory items
    if self.inst.prefab == "myspecialitem" then
        self.inst:AddComponent("mycustomcomponent")
    end
end)
```

## Steam Workshop Integration

### Preparing Your Mod for Workshop

#### Mod Validation Checklist
- [ ] **modinfo.lua complete**: All required fields filled correctly
- [ ] **Assets optimized**: Images compressed, animations efficient
- [ ] **Code tested**: No error messages in console
- [ ] **Compatibility verified**: Works with base game and common mods
- [ ] **Description written**: Clear explanation of mod features

#### Workshop Upload Process

1. **In-Game Upload**:
   ```
   Main Menu → Workshop → Upload Mod → Select your mod folder
   ```

2. **Steam Workshop Page**:
   - Add detailed description
   - Include screenshots/videos
   - Set appropriate tags
   - Choose visibility settings

### Workshop Best Practices

#### Naming Conventions
```lua
-- Clear, descriptive mod names
name = "Enhanced Farming Tools"  -- Good
name = "AwesomeMod123"          -- Avoid

-- Consistent prefab naming
"enhanced_hoe"     -- Mod-specific prefix
"enhanced_watering_can"
"enhanced_fertilizer"
```

## Debugging and Troubleshooting

### Essential Debugging Tools

#### Console Commands for Mod Development

```lua
-- Basic mod debugging commands
c_give("myitem", 1)                    -- Give item to player
c_spawn("myitem", 10)                  -- Spawn items at cursor
c_find("myitem")                       -- Find all instances in world
c_sel()                                -- Select entity under mouse
c_reset()                              -- Reset selected entity

-- Advanced debugging
c_findnext("myitem")                   -- Find next instance
c_gonext("myitem")                     -- Teleport to next instance
c_regenerateworld()                    -- Regenerate world with mods
c_dumptable(inst.components)           -- Dump component data
```

#### Mod-Specific Debug Functions

```lua
-- Error handling and debug output
modprint("Debug message:", variable)   -- Debug-only print
moderror("Error occurred!")            -- Mod error reporting
modassert(condition, "Must be true")   -- Mod assertion

-- Configuration debugging
local config = GetModConfigData("setting_name")
print("Config value:", config)

-- Component inspection
local function DebugEntity(inst)
    print("Entity:", inst.prefab)
    print("Valid:", inst:IsValid())
    print("Components:", table.concat(inst.components, ", "))
    
    if inst.components.health then
        print("Health:", inst.components.health.currenthealth)
    end
end
```

### Common Issues and Solutions

#### Issue 1: Mod Not Loading

**Symptoms:** Mod doesn't appear in mod list, no debug output

**Solutions:**
1. Fix modinfo.lua syntax - ensure all required fields are present
2. Check file permissions - ensure mod files are readable
3. Verify directory structure - follow exact naming conventions
4. Review console errors - look for Lua syntax errors

#### Issue 2: Items Not Working

**Symptoms:** c_give() fails, items have no functionality, recipes don't work

**Solutions:**
1. Verify prefab files are in PrefabFiles list
2. Check component setup - validate all required components
3. Test recipe ingredients - ensure all exist and are available
4. Review asset paths - verify all references are correct

#### Issue 3: Multiplayer Problems

**Symptoms:** Works in single-player but not multiplayer

**Solutions:**
1. Proper network setup - use inst.entity:SetPristine() correctly
2. Server-client separation - check TheWorld.ismastersim appropriately  
3. RPC implementation - use proper mod RPC handlers for custom data

## Performance Optimization

### Efficient Entity Management

```lua
-- Pool pattern for frequently spawned/removed entities
local entity_pool = {}

local function GetPooledEntity(prefab)
    if entity_pool[prefab] and #entity_pool[prefab] > 0 then
        return table.remove(entity_pool[prefab])
    else
        return SpawnPrefab(prefab)
    end
end
```

### Memory-Efficient Data Structures

```lua
-- Use weak references for temporary data
local temporary_data = setmetatable({}, {__mode = "k"})

-- Efficient caching with limits
local cache = {}
local cache_limit = 100

local function CacheData(key, data)
    if #cache >= cache_limit then
        table.remove(cache, 1)
    end
    cache[key] = data
end
```

## Next Steps

Now that you understand the basics, you can explore:

- [Core Systems](../core-systems/index.md): Learn about the fundamental systems that power DST
- [Mod Support](../core-systems/mod-support/index.md): Advanced mod infrastructure and tools
- [Components](../components/index.md): Study the component system for adding behaviors to entities
- [Game Mechanics](../game-mechanics/index.md): Understand how key game systems function

## Resources and Community

- [Klei Forums](https://forums.kleientertainment.com/forums/forum/26-dont-starve-together-mods-and-tools/): Official forums for DST modding
- [DST Modding Wiki](https://dontstarvemodding.fandom.com/wiki/Don%27t_Starve_Modding_Wiki): Community-maintained wiki with modding resources
- [Steam Workshop](https://steamcommunity.com/app/322330/workshop/): Browse existing mods for inspiration

## API Documentation Structure

This documentation is organized by system and functionality:

- **Getting Started**: Introduction, setup guides, and comprehensive tutorials
- **Core Systems**: Fundamental game systems including mod support infrastructure
- **Components**: Entity components and their functionality
- **Game Mechanics**: Key gameplay systems like health, hunger, and sanity
- **World Management**: World generation, seasons, and environment

Use the sidebar navigation to explore the different sections of the API documentation.
