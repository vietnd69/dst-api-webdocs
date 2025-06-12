---
id: prefabs-overview
title: Prefabs Overview
sidebar_position: 1
slug: /api/prefabs
---

# Prefabs Overview

Prefabs (short for "prefabricated objects") are the fundamental building blocks of all entities in Don't Starve Together. They are templates that define the behavior, appearance, and functionality of game objects.

## What are Prefabs?

Prefabs are Lua scripts that define and construct entities with specific components, properties, and behaviors. Every entity in the game - from characters to creatures, items to structures - is created from a prefab. Prefabs essentially serve as blueprints for spawning entities into the world.

## Creating a Prefab

Prefabs are created using the `Prefab` function, which takes:
1. A prefab name identifier
2. A creation function that returns the entity
3. A list of assets needed by the entity
4. An optional list of dependencies (other prefabs that might be spawned by this prefab)

Here's a basic prefab structure:

```lua
-- Define required assets
local assets = {
    Asset("ANIM", "anim/example.zip"),
    Asset("SOUND", "sound/example.fsb"),
}

-- Define dependencies
local prefabs = {
    "dependency_prefab",
}

-- Main creation function
local function fn()
    -- Create the entity
    local inst = CreateEntity()
    
    -- Add engine components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Set basic properties
    inst.AnimState:SetBank("example")
    inst.AnimState:SetBuild("example")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add tags for optimization
    inst:AddTag("example_tag")
    
    -- Networking setup
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add game components
    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    
    -- Configure components
    inst.components.inventoryitem.imagename = "example"
    
    return inst
end

-- Return the prefab definition
return Prefab("example_prefab", fn, assets, prefabs)
```

## Key Prefab Categories

Don't Starve Together has several major categories of prefabs:

1. **Character Prefabs**: Playable characters like Wilson, Willow, etc.
2. **Creature Prefabs**: Mobs, animals, and monsters that inhabit the world
3. **Item Prefabs**: Tools, weapons, resources, and other collectibles 
4. **Structure Prefabs**: Buildings, crafting stations, and other placeable objects
5. **World Prefabs**: Specialized prefabs that define world generation and mechanics

## Common Prefab Elements

Most prefabs contain several standard elements:

### Assets

Assets define the visual and audio resources needed by the prefab:

```lua
local assets = {
    Asset("ANIM", "anim/spear.zip"),           -- Animation files
    Asset("SOUND", "sound/beefalo.fsb"),       -- Sound files
    Asset("MINIMAP_IMAGE", "beefalo_mini"),    -- Minimap icons
    Asset("SCRIPT", "scripts/prefabs/wilson.lua"), -- Other scripts
}
```

### Network Synchronization

Prefabs use a pristine state mechanism to handle client/server synchronization:

```lua
inst.entity:SetPristine()
if not TheWorld.ismastersim then
    return inst
end
```

Code before this check runs on both client and server, while code after only runs on the server.

### Components

Components provide specific behaviors and functionality to prefabs:

```lua
-- Combat capability
inst:AddComponent("combat")
inst.components.combat:SetDefaultDamage(10)

-- Inventory item behavior
inst:AddComponent("inventoryitem")
inst.components.inventoryitem.imagename = "spear"

-- Weapon behavior
inst:AddComponent("weapon")
inst.components.weapon:SetDamage(TUNING.SPEAR_DAMAGE)

-- Finite uses (durability)
inst:AddComponent("finiteuses")
inst.components.finiteuses:SetMaxUses(100)
inst.components.finiteuses:SetUses(100)
```

## Spawning Prefabs

Prefabs can be spawned into the world using the `SpawnPrefab` function:

```lua
local entity = SpawnPrefab("spear")
entity.Transform:SetPosition(x, y, z)
```

## Loot Tables

Many prefabs define loot tables to determine what items drop when destroyed:

```lua
SetSharedLootTable("beefalo", {
    {"meat",            1.00},
    {"meat",            1.00},
    {"beefalowool",     1.00},
    {"horn",            0.33},
})
```

## Callbacks and Hooks

Prefabs often define callbacks for various events:

```lua
-- Equipment callbacks
local function onequip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "swap_spear", "swap_spear")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
end

local function onunequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
end

-- Attach callbacks to components
inst.components.equippable:SetOnEquip(onequip)
inst.components.equippable:SetOnUnequip(onunequip)
```

## Common Prefab Patterns

### Character Prefabs

Character prefabs typically use the `MakePlayerCharacter` helper function:

```lua
return MakePlayerCharacter("wilson", prefabs, assets, common_postinit, master_postinit)
```

### Item Prefabs

Items often include components like `inventoryitem`, `equippable`, `finiteuses`, and `inspectable`.

### Creatures

Creatures typically include components such as `locomotor`, `combat`, `health`, and `lootdropper`, along with a brain for AI behavior. 