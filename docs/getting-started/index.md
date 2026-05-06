---
title: Getting Started with DST Lua
description: Complete guide to Don't Starve Together modding and API usage
sidebar_position: 1

last_updated: 2026-05-04
build_version: 676042
change_status: stable
---

# Getting Started with DST Lua

Welcome to the Don't Starve Together (DST) Lua API documentation. This guide covers everything from setting up your first mod to advanced scripting patterns.

## Prerequisites

- Basic Lua programming knowledge
- Familiarity with DST gameplay mechanics
- Don't Starve Together installed via Steam

## Setting Up Your Mod Environment

### Mods Directory

| Platform | Path |
|----------|------|
| Windows  | `C:\Users\[Username]\Documents\Klei\DoNotStarveTogether\mods\` |
| macOS    | `~/Documents/Klei/DoNotStarveTogether/mods/` |
| Linux    | `~/.klei/DoNotStarveTogether/mods/` |

### Mod Directory Structure

```
my_mod/
├── modinfo.lua          # Required: metadata and workshop configuration
├── modmain.lua          # Required: entry point, runs on mod load
├── scripts/
│   ├── prefabs/         # Custom entity definitions
│   └── components/      # Custom component definitions
├── anim/                # Custom animations (.zip)
└── images/
    └── inventoryimages/ # Item icons (.tex + .xml)
```

## Core Concepts

### Entity-Component System

DST uses a composition-based entity model:

- **Entities**: Everything in the world — players, creatures, items, structures
- **Components**: Modular behaviors attached to entities (`health`, `combat`, `inventory`, etc.)
- **Prefabs**: Factory functions that create entities with a predefined set of components

### Server / Client Split

DST runs a server simulation alongside a client renderer. All gameplay logic lives on the server:

```lua
local function fn()
    local inst = CreateEntity()

    -- Client + server: visual setup
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst  -- client stops here
    end

    -- Server only: gameplay components
    inst:AddComponent("health")
    inst:AddComponent("inventory")

    return inst
end
```

Never add gameplay components before `SetPristine()` or without the `ismastersim` guard — they will fail to replicate correctly.

## Your First Mod: A Custom Tool

### Step 1: `modinfo.lua`

```lua
name          = "My First Mod"
description   = "A simple custom tool"
author        = "Your Name"
version       = "1.0.0"
api_version   = 10

dst_compatible          = true
dont_starve_compatible  = false
all_clients_require_mod = true
client_only_mod         = false

icon_atlas = "modicon.xml"
icon       = "modicon.tex"

configuration_options = {
    {
        name    = "item_durability",
        label   = "Item Durability",
        options = {
            {description = "Low",    data = 50},
            {description = "Normal", data = 100},
            {description = "High",   data = 150},
        },
        default = 100,
    }
}
```

### Step 2: `modmain.lua`

```lua
PrefabFiles = { "mytool" }

Assets = {
    Asset("ATLAS", "images/inventoryimages/mytool.xml"),
    Asset("IMAGE", "images/inventoryimages/mytool.tex"),
}

AddRecipe2("mytool",
    {Ingredient("twigs", 2), Ingredient("flint", 1)},
    TECH.NONE,
    {
        atlas = "images/inventoryimages/mytool.xml",
        image = "mytool.tex",
    }
)

TUNING.MYTOOL_DURABILITY = GetModConfigData("item_durability") or 100
```

### Step 3: `scripts/prefabs/mytool.lua`

```lua
local assets = {
    Asset("ANIM",  "anim/mytool.zip"),
    Asset("ATLAS", "images/inventoryimages/mytool.xml"),
    Asset("IMAGE", "images/inventoryimages/mytool.tex"),
}

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    inst.AnimState:SetBank("mytool")
    inst.AnimState:SetBuild("mytool")
    inst.AnimState:PlayAnimation("idle")

    MakeInventoryPhysics(inst)

    inst.entity:SetPristine()
    if not TheWorld.ismastersim then return inst end

    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "mytool"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/mytool.xml"

    inst:AddComponent("inspectable")

    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.CHOP)

    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(TUNING.MYTOOL_DURABILITY)
    inst.components.finiteuses:SetUses(TUNING.MYTOOL_DURABILITY)
    inst.components.finiteuses:SetOnFinished(inst.Remove)

    return inst
end

return Prefab("mytool", fn, assets)
```

### Step 4: Test In-Game

Enable your mod in the DST mod list, then use the in-game console (`~`):

```lua
c_give("mytool", 1)         -- spawn into your inventory
c_spawn("mytool", 5)        -- drop on ground at cursor
c_dumptable(inst.components) -- inspect a selected entity's components
```

## Common Modding Patterns

### Custom Character

```lua
-- modmain.lua
Assets = {
    Asset("ANIM", "anim/mycharacter.zip"),
    Asset("ANIM", "anim/ghost_mycharacter_build.zip"),
}

AddModCharacter("mycharacter", "FEMALE")

STRINGS.CHARACTER_NAMES.mycharacter       = "Aria"
STRINGS.CHARACTER_DESCRIPTIONS.mycharacter = "She knows things others don't."
STRINGS.CHARACTER_QUOTES.mycharacter      = [["Knowledge is survival."]]

AddPlayerPostInit(function(inst)
    if inst.prefab ~= "mycharacter" then return end

    inst.components.health:SetMaxHealth(120)
    inst.components.sanity:SetMax(200)
    inst.components.hunger:SetMax(140)
end)
```

### Custom Component

```lua
-- scripts/components/tracker.lua
local Tracker = Class(function(self, inst)
    self.inst  = inst
    self.value = 0
    self.max   = 100
end)

function Tracker:SetValue(v)
    self.value = math.clamp(v, 0, self.max)
    self.inst:PushEvent("trackerchanged", {value = self.value})
end

function Tracker:OnSave()
    return {value = self.value}
end

function Tracker:OnLoad(data)
    if data then self.value = data.value or 0 end
end

return Tracker
```

### Event Communication

Components coordinate through events rather than direct calls:

```lua
-- Producer: fires event when state changes
inst.components.health:SetOnDelta(function(inst, data)
    inst:PushEvent("healthchanged", data)
end)

-- Consumer: reacts without coupling to health directly
inst:ListenForEvent("healthchanged", function(inst, data)
    if data.newpercent < 0.25 then
        inst:AddTag("lowhealth")
        inst.components.talker:Say("I need healing!")
    end
end)
```

### World Generation Hook

```lua
AddRoomPreInit("Forest", function(room)
    room.contents.distributeprefabs = room.contents.distributeprefabs or {}
    table.insert(room.contents.distributeprefabs, "mycustomprefab")
end)
```

## Debugging

### Console Commands

```lua
c_give("prefab", n)         -- give item to player
c_spawn("prefab", n)        -- spawn at cursor
c_find("prefab")            -- list all instances
c_sel()                     -- select entity under cursor
c_gonext("prefab")          -- teleport to next instance
c_regenerateworld()         -- force world regen (tests world gen hooks)
```

### Mod Debug Helpers

```lua
modprint("value:", myvar)          -- prints only when mod debug is on
moderror("something went wrong")   -- logs as mod error
modassert(condition, "message")    -- crashes loudly on bad state
```

### Common Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Mod not in list | `modinfo.lua` syntax error | Check for missing commas, unclosed strings |
| `c_give()` fails | Prefab not in `PrefabFiles` | Add prefab name to `PrefabFiles` table in `modmain.lua` |
| Works offline, breaks online | Component added outside `ismastersim` guard | Move all gameplay components after `SetPristine()` + `ismastersim` check |
| Recipe not appearing | Wrong `TECH` level or missing tech unlock | Verify `TECH.*` values and station requirements |

## Steam Workshop

### Pre-Upload Checklist

- [ ] All `modinfo.lua` required fields are filled
- [ ] No Lua errors in the in-game console
- [ ] Tested in both single-player and multiplayer
- [ ] Images are compressed and assets are correctly referenced
- [ ] `all_clients_require_mod` set correctly for your mod type

### Upload

```
Main Menu → Mods → Upload Mod → Select your mod folder
```

Name your prefabs with a mod-specific prefix to avoid conflicts with other mods:

```lua
-- Good: unique prefix prevents collisions
"mymod_enhanced_hoe"
"mymod_water_barrel"

-- Avoid: generic names that other mods may also use
"hoe"
"barrel"
```

## Resources

- [Klei Forums — Mods & Tools](https://forums.kleientertainment.com/forums/forum/26-dont-starve-together-mods-and-tools/)
- [Steam Workshop](https://steamcommunity.com/app/322330/workshop/)
- [DST Scripts Fork](https://github.com/vietnd69/dst-scripts) — cleaned-up, regularly updated source reference
