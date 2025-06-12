---
id: getting-started
title: Introduction DST Modding
sidebar_position: 1
---

# Getting Started with DST Modding

## Introduction

Don't Starve Together (DST) is a survival game designed to be easily modded. The game uses Lua as its primary programming language, allowing you to customize and extend almost every aspect of the game. This guide will help you understand the basic structure of a DST mod and how to get started with mod development.

## Setting Up the Development Environment

Before starting mod development, you need to install the following tools:

1. **Don't Starve Mod Tools**: Can be installed through Steam (Library > Tools > Don't Starve Mod Tools)
2. **Text Editor or IDE**: Any editor that supports Lua such as VS Code, Sublime Text, or Notepad++
3. **Image Editor**: Such as GIMP, Photoshop, or Aseprite for editing textures
4. **Spriter**: Animation software that comes with Don't Starve Mod Tools, used to view and edit animations

### Additional Tools (Optional)

- **TexTools**: Tool for converting between .tex and .png formats
- **KTools**: Toolkit to help work with game animation files
- **BuildRenamer**: Tool to rename build files

## Basic Mod Structure

A basic DST mod includes the following files and directories:

```
modname/
├── modinfo.lua       # Metadata about your mod
├── modmain.lua       # Main entry point for the mod
├── modworldgenmain.lua  # (Optional) For mods that modify world generation
├── scripts/          # Additional Lua scripts for the mod
│   └── prefabs/      # Usually contains new prefabs (characters, items, ...)
├── anim/             # (Optional) Custom animations
├── images/           # (Optional) Images and icons
│   └── inventoryimages/  # Icons displayed in inventory
├── sound/            # (Optional) Custom sound files
└── exported/         # (Optional) Exported art assets
```

### Important Files

#### modinfo.lua

This file contains metadata about your mod, including:

```lua
name = "My First Mod"
description = "This is my first DST mod"
author = "Your Name"
version = "1.0.0"

-- DST compatibility
dst_compatible = true
-- Not compatible with single-player Don't Starve
dont_starve_compatible = false
-- Not compatible with Reign of Giants DLC
reign_of_giants_compatible = false

-- Character mods need to set this to true
all_clients_require_mod = true

-- For mods that only modify client experience
client_only_mod = false

-- Icon displayed in the server list
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Tags for server filtering
server_filter_tags = {"gameplay", "item"}

-- Configuration options
configuration_options = {
    {
        name = "difficulty",
        label = "Difficulty",
        options = {
            {description = "Easy", data = "easy"},
            {description = "Normal", data = "normal"},
            {description = "Hard", data = "hard"}
        },
        default = "normal"
    }
}
```

#### modmain.lua

The main entry point for your mod's code. This is where you add hooks into the game's systems:

```lua
-- Import utilities provided by the engine
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})
local require = GLOBAL.require

-- Hook into the game systems
AddPrefabPostInit("wilson", function(inst)
    -- This code runs after Wilson (or any character) is initialized
    -- You can modify character stats here
    if GLOBAL.TheWorld.ismastersim then
        inst.components.health.maxhealth = 150
    end
end)

-- Add a new crafting recipe
AddRecipe("super_axe", 
    {Ingredient("twigs", 2), Ingredient("flint", 2)}, 
    RECIPETABS.TOOLS, 
    TECH.SCIENCE_ONE, 
    nil, nil, nil, nil, nil, 
    "images/inventoryimages/super_axe.xml", 
    "super_axe.tex")
```

## Server vs Client in DST Modding

When developing mods for DST, it's important to understand the difference between server and client:

### Server-Side Code

The server is responsible for:
- Calculating game logic
- Processing AI
- Managing health, hunger, sanity, and other components
- Controlling the world and entities

Every component must include code to check `TheWorld.ismastersim` before executing code related to game logic:

```lua
if not TheWorld.ismastersim then
    return inst
end

-- Server-side code here
inst.components.health:SetMaxHealth(100)
```

### Client-Side Code

The client is responsible for:
- Displaying images and sounds
- Processing player input
- UI and effects
- Replicas (client versions of components)

## Types of Mods

### Client-Only Mods

These mods only affect the client experience and don't change gameplay for other players. Examples include UI improvements and visual changes.

To mark your mod as client-only:
```lua
-- In modinfo.lua
client_only_mod = true
all_clients_require_mod = false
```

### Server-Side Mods

These mods change gameplay mechanics and typically need to be installed on the server. Sometimes clients also need to have them.

To mark your mod as requiring all clients to have it:
```lua
-- In modinfo.lua
client_only_mod = false
all_clients_require_mod = true
```

### Character Mods

Adding new characters requires special consideration. You'll need to create:

1. Character prefab (in `scripts/prefabs/`)
2. Character stats and abilities
3. Custom animations
4. Speech files

Character mods always require `all_clients_require_mod = true`.

### Prefabs, Components, and StateGraphs

Understanding these three concepts is foundational for developing mods in DST:

1. **Prefabs**: These are "blueprints" for all entities in the game. Each item, character, monster is a prefab.
2. **Components**: These define the behavior of prefabs. Examples: health, combat, inventory.
3. **StateGraphs**: These control animation and states of entities.

## Creating a New Prefab

To create a new item, you need to create a prefab in the `scripts/prefabs/` directory:

```lua
-- scripts/prefabs/super_axe.lua
local assets = {
    Asset("ANIM", "anim/super_axe.zip"),
    Asset("ATLAS", "images/inventoryimages/super_axe.xml"),
    Asset("IMAGE", "images/inventoryimages/super_axe.tex")
}

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    MakeInventoryPhysics(inst)
    
    inst.AnimState:SetBank("super_axe")
    inst.AnimState:SetBuild("super_axe")
    inst.AnimState:PlayAnimation("idle")
    
    inst:AddTag("sharp")
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    inst.entity:SetPristine()
    
    inst:AddComponent("inventoryitem")
    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.CHOP, 2) -- Chop twice as fast
    
    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(200)
    inst.components.finiteuses:SetUses(200)
    inst.components.finiteuses:SetOnFinished(inst.Remove)
    
    inst:AddComponent("inspectable")
    
    return inst
end

return Prefab("super_axe", fn, assets)
```

Register the prefab in modmain.lua:
```lua
PrefabFiles = {
    "super_axe"
}
```

## Components in DST

Components are one of the most important concepts in DST modding. They function as feature modules that can be attached to entities to provide specific functionality.

### Common Components and Their Functions

Below are some common components and their functions:

#### Health Component
```lua
inst:AddComponent("health")
inst.components.health:SetMaxHealth(100)
inst.components.health:SetInvincible(false)
inst.components.health.ondeath = function(inst)
    -- Code to execute when entity dies
end
```

#### Combat Component
```lua
inst:AddComponent("combat")
inst.components.combat:SetDefaultDamage(20)
inst.components.combat:SetAttackPeriod(2) -- Attack every 2 seconds
inst.components.combat:SetRange(3) -- Attack range
```

#### Inventory Component
```lua
inst:AddComponent("inventory")
inst.components.inventory.maxslots = 16
```

#### Hunger Component
```lua
inst:AddComponent("hunger")
inst.components.hunger:SetMax(150)
inst.components.hunger:SetRate(1) -- Rate at which hunger decreases
```

#### Sanity Component
```lua
inst:AddComponent("sanity")
inst.components.sanity:SetMax(200)
inst.components.sanity.night_drain_mult = 0.5 -- Less sanity drain at night
```

### Creating Custom Components

You can create custom components for your mod:

```lua
-- scripts/components/mycomponent.lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 0
end)

function MyComponent:SetValue(val)
    self.value = val
end

function MyComponent:GetValue()
    return self.value
end

return MyComponent
```

Register the component in modmain.lua:
```lua
-- Register custom component
local require = GLOBAL.require
local MyComponent = require("components/mycomponent")
GLOBAL.AddComponentPostInit("mycomponent", MyComponent)
```

## StateGraphs in DST

StateGraphs control how entities move and interact with the world. They define states and transitions between states.

### Basic Structure of a StateGraph

```lua
local states = {
    State{
        name = "idle",
        tags = {"idle"},
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle_loop", true)
        end,
    },
    
    State{
        name = "walk",
        tags = {"moving"},
        onenter = function(inst)
            inst.AnimState:PlayAnimation("walk_loop", true)
        end,
    },
    
    State{
        name = "attack",
        tags = {"attack", "busy"},
        onenter = function(inst)
            inst.AnimState:PlayAnimation("attack")
        end,
        
        timeline = {
            TimeEvent(10*FRAMES, function(inst) 
                inst.components.combat:DoAttack() 
            end),
        },
        
        events = {
            EventHandler("animover", function(inst) 
                inst.sg:GoToState("idle") 
            end),
        },
    },
}

local function CreateStategraph()
    local sg = StateGraph("myentity")
    sg:AddStates(states)
    
    sg.states.idle.events = {
        EventHandler("attacked", function(inst) 
            inst.sg:GoToState("hit") 
        end),
    }
    
    sg:SetInitialState("idle")
    
    return sg
end

return CreateStategraph()
```

### Applying a StateGraph to an Entity

```lua
-- In the prefab file
inst:SetStateGraph("SGmyentity")
```

## Remote Procedure Calls (RPCs)

RPCs allow communication between server and client. They are necessary for mods that change gameplay:

```lua
-- Register RPC in modmain.lua
AddModRPCHandler("MyMod", "MyAction", function(player, target)
    if player and player.components.inventory and target and target:HasTag("mytag") then
        -- Perform action on server
    end
end)

-- Call RPC from client
SendModRPCToServer(MOD_RPC["MyMod"]["MyAction"], target)
```

## Debugging and Testing

DST provides some tools for debugging mods:

```lua
-- Print debug info to console
print("Debug info:", variable)

-- Check if prefab is working
c_spawn("my_prefab") -- Spawn prefab to test in game

-- Refresh mod while playing
c_reset() -- Reset and reload all mods
```

## Publishing Your Mod

When your mod is ready to share:

1. Open Don't Starve Mod Tools
2. Select "Upload Mod"
3. Enter information about your mod
4. Add a preview image (size 512x512 pixels)
5. Upload to Steam Workshop

Remember to update your mod regularly and respond to user feedback to improve your mod.

## References

- [Don't Starve Forums](https://forums.kleientertainment.com/)
- [Don't Starve Modding Wiki](https://dontstarveapi.com/)
- [Don't Starve Mod Tools Documentation](https://forums.kleientertainment.com/files/file/83-dont-starve-mod-tools/)

Good luck with your modding project! Don't hesitate to join the DST modding community to learn and share ideas. 