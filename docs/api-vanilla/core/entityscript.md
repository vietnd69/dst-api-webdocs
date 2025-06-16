---
id: entityscript
title: EntityScript
sidebar_position: 4
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# EntityScript

*API Version: 619045*

EntityScript is the base class for all entities in Don't Starve Together. Every object in the game such as characters, items, structures, and monsters inherits from this class.

## Lifecycle Methods

```lua
-- Get entity save data
entity:GetSaveRecord()

-- Hide entity from players
entity:Hide()

-- Show entity to players
entity:Show()

-- Check if entity is in limbo (temporarily inactive state)
entity:IsInLimbo()

-- Force entity out of limbo
entity:ForceOutOfLimbo(state)

-- Remove entity from scene
entity:RemoveFromScene()

-- Return entity to scene
entity:ReturnToScene()
```

## Component Management

```lua
-- Add component to entity
entity:AddComponent(name) -- name: component name (string)

-- Remove component from entity
entity:RemoveComponent(name) -- name: component name (string)

-- Start updating component
entity:StartUpdatingComponent(cmp, do_static_update)

-- Stop updating component
entity:StopUpdatingComponent(cmp)

-- Stop updating component (delayed)
entity:StopUpdatingComponent_Deferred(cmp)

-- Get component name
entity:GetComponentName(cmp)
```

## Tag System

Tags are the primary way to categorize and identify capabilities of entities in Don't Starve Together.

```lua
-- Add tag to entity
entity:AddTag(tag)

-- Remove tag from entity
entity:RemoveTag(tag)

-- Add or remove tag based on condition
entity:AddOrRemoveTag(tag, condition)

-- Check if entity has specific tag
entity:HasTag(tag) -- tag: string

-- Check if entity has all listed tags
entity:HasTags(...) -- Multiple tags as separate parameters

-- Check if entity has one of the listed tags
entity:HasOneOfTags(...) -- Multiple tags as separate parameters
```

## Child Entity Management

```lua
-- Spawn child entity
entity:SpawnChild(name)

-- Remove child entity
entity:RemoveChild(child)

-- Add child entity
entity:AddChild(child)

-- Remove platform follower
entity:RemovePlatformFollower(child)

-- Add platform follower
entity:AddPlatformFollower(child)

-- Get platform followers list
entity:GetPlatformFollowers()
```

## Entity Properties and Metadata

```lua
-- Get basic entity name
entity:GetBasicDisplayName()

-- Get entity name with adjectives
entity:GetAdjectivedName()

-- Get display name of entity
entity:GetDisplayName()

-- Check if entity is wet
entity:GetIsWet()

-- Check if entity is acid sizzling
entity:IsAcidSizzling()

-- Get entity skin build
entity:GetSkinBuild()

-- Get entity skin name
entity:GetSkinName()

-- Set prefab name for entity
entity:SetPrefabName(name)

-- Set override for prefab name
entity:SetPrefabNameOverride(nameoverride)
```

## Task and Thread Management

```lua
-- Kill all tasks
entity:KillTasks()

-- Start a new thread
entity:StartThread(fn)

-- Run a script
entity:RunScript(name)
```

## Brain and AI Control

```lua
-- Restart brain
entity:RestartBrain()

-- Stop brain
entity:StopBrain()

-- Get brain string information
entity:GetBrainString()

-- Get debug string
entity:GetDebugString()
```

## Miscellaneous

```lua
-- Add inherent action
entity:AddInherentAction(act)

-- Remove inherent action
entity:RemoveInherentAction(act)

-- Get entity lifetime
entity:GetTimeAlive()
```

## Using EntityScript in Mods

When creating a new prefab, you'll receive an EntityScript object:

```lua
local function MyPrefabFn()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add tags
    inst:AddTag("myspecialtag")
    
    -- Setup network
    inst.entity:SetPristine()
    
    -- Client-side code
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add server components
    inst:AddComponent("inventoryitem")
    inst:AddComponent("inspectable")
    
    return inst
end
``` 
