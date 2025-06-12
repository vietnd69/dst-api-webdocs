---
id: workable
title: Workable Component
sidebar_position: 11
---

# Workable Component

The Workable component allows entities to be worked on with tools, such as chopping trees, mining rocks, or hammering structures.

## Basic Usage

```lua
-- Add a workable component to an entity
local entity = CreateEntity()
entity:AddComponent("workable")

-- Configure the workable component
local workable = entity.components.workable
workable:SetWorkAction(ACTIONS.CHOP)
workable:SetWorkLeft(10)
workable:SetOnFinishCallback(OnChopped)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `action` | Action | The action type required to work this entity (CHOP, MINE, DIG, etc.) |
| `workleft` | Number | Amount of work remaining before the work is complete |
| `maxwork` | Number | Maximum amount of work required to complete |
| `savestate` | Boolean | Whether to save work progress when the game is saved |
| `onwork` | Function | Callback when the entity is worked on |
| `onfinish` | Function | Callback when the work is completed |

## Key Methods

```lua
-- Set the action required to work on this entity
workable:SetWorkAction(ACTIONS.MINE)

-- Set how much work is required to complete
workable:SetWorkLeft(20)

-- Set whether this entity makes sound when worked on
workable:SetOnWorkCallback(function(inst, worker, workleft)
    -- Play sound effect when worked on
    inst.SoundEmitter:PlaySound("dontstarve/wilson/use_axe_tree")
end)

-- Set what happens when work is completed
workable:SetOnFinishCallback(function(inst, worker)
    -- Drop loot, play effects, etc.
    inst:Remove()
end)
```

## Work Actions

Common work actions include:

- `ACTIONS.CHOP` - For trees and wooden objects
- `ACTIONS.MINE` - For rocks and mineral deposits
- `ACTIONS.DIG` - For digging up plants or buried objects
- `ACTIONS.HAMMER` - For breaking down structures
- `ACTIONS.HACK` - For hacking through vegetation

## Integration with Other Components

The Workable component often works with:

- `Lootdropper` - For dropping items when work is completed
- `Growable` - For regrowth after being worked on
- `Health` - For damage when being worked on
- `Combat` - For entities that attack when worked on

## Example: Creating a Workable Tree

```lua
local function MakeTree()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    
    -- Make it workable
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.CHOP)
    inst.components.workable:SetWorkLeft(10)
    inst.components.workable:SetOnWorkCallback(function(inst)
        inst.SoundEmitter:PlaySound("dontstarve/wilson/use_axe_tree")
    end)
    inst.components.workable:SetOnFinishCallback(function(inst, worker)
        inst.SoundEmitter:PlaySound("dontstarve/forest/treefall")
        inst:Remove()
    end)
    
    return inst
end
``` 