---
id: prefab
title: Prefab
sidebar_position: 4
last_updated: 2023-07-06
---

# Prefab

Prefabs are blueprints for creating entities, with predefined components and properties.

## Overview

Prefabs serve as templates for creating entities in the game. They define what components an entity should have, what its initial properties should be, and how it should behave. Prefabs ensure consistency when creating multiple instances of the same type of entity.

## Prefab Structure

A typical prefab definition looks like this:

```lua
local assets = {
    Asset("ANIM", "anim/myitem.zip"),
}

local function fn()
    local inst = CreateEntity()
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    inst:AddTag("myitem")
    
    inst.AnimState:SetBank("myitem")
    inst.AnimState:SetBuild("myitem")
    inst.AnimState:PlayAnimation("idle")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    inst:AddComponent("inventoryitem")
    inst:AddComponent("inspectable")
    
    inst.components.inventoryitem.imagename = "myitem"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/myitem.xml"
    
    return inst
end

return Prefab("myitem", fn, assets)
```

## Key Parts of a Prefab

- **Assets**: Resources needed by the prefab (animations, sounds, etc.)
- **Prefab Function**: Function that constructs the entity
- **Client/Server Separation**: Using `TheWorld.ismastersim` to separate client and server code
- **Component Setup**: Adding and configuring components
- **Animation Setup**: Setting up the visual appearance

## Prefab Registration

Prefabs are registered with the game engine:

```lua
return Prefab("prefabname", fn, assets, prefabs)
```

Parameters:
- `prefabname`: Unique identifier for the prefab
- `fn`: Function that creates and configures the entity
- `assets`: List of assets needed by the prefab
- `prefabs`: List of other prefabs that this prefab depends on

## Spawning Prefabs

Prefabs are spawned into the world with:

```lua
-- Spawn at a specific position
local inst = SpawnPrefab("myitem")
inst.Transform:SetPosition(x, y, z)

-- Spawn as a dropped item
inst = player.components.inventory:DropItem(inst)

-- Spawn and give to player
player.components.inventory:GiveItem(inst)
```

## Prefab Variants

You can create variants of prefabs:

```lua
-- Base prefab with shared functionality
local function basefn()
    -- Common setup
end

-- Specific variant
local function redfn()
    local inst = basefn()
    -- Red-specific setup
    return inst
end

-- Another variant
local function bluefn()
    local inst = basefn()
    -- Blue-specific setup
    return inst
end

return Prefab("myitem", basefn, assets),
       Prefab("myitem_red", redfn, assets),
       Prefab("myitem_blue", bluefn, assets)
```

## Prefab Assets

Assets are resources needed by the prefab:

```lua
local assets = {
    Asset("ANIM", "anim/myitem.zip"),          -- Animation
    Asset("SOUND", "sound/myitem.fsb"),        -- Sound
    Asset("IMAGE", "images/myitem.tex"),       -- Texture
    Asset("ATLAS", "images/myitem.xml"),       -- Atlas
    Asset("SHADER", "shaders/myshader.ksh"),   -- Shader
}
```

## Master Simulation

Prefabs handle client/server separation:

```lua
inst.entity:SetPristine()

if not TheWorld.ismastersim then
    return inst
end

-- Server-only code here
```

The `SetPristine()` call marks the entity as ready for network replication, and the `ismastersim` check ensures server-specific code only runs on the server.

## Related Systems

- Entity system
- Component system
- Asset loading system
- Spawning system 
