---
id: workable
title: Workable Component
sidebar_position: 11
last_updated: 2023-07-06
version: 619045
---

# Workable Component

The Workable component allows entities to be affected by tools such as axes, pickaxes, hammers, and other work tools. It manages resource collection, destruction, and work-based interactions.

## Basic Usage

```lua
-- Add a workable component to an entity
local entity = CreateEntity()
entity:AddComponent("workable")

-- Configure the workable component
local workable = entity.components.workable
workable:SetWorkAction(ACTIONS.CHOP)
workable:SetWorkLeft(10)
workable:SetOnFinishCallback(OnFinished)
workable:SetOnWorkCallback(OnWorked)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `action` | ACTIONS | The type of action that can work on this entity (CHOP, MINE, HAMMER, etc.) |
| `workleft` | Number | How much work is required to complete the action |
| `maxwork` | Number | The maximum amount of work (for resetting) |
| `savestate` | Boolean | Whether to save the work state |
| `onwork` | Function | Called when the entity is worked on |
| `onfinish` | Function | Called when the work is completed |
| `workable` | Boolean | Whether the entity can currently be worked on |
| `workmultiplier` | Number | Multiplier for work effectiveness |

## Key Methods

```lua
-- Set the action type
workable:SetWorkAction(ACTIONS.MINE)

-- Set how much work is required
workable:SetWorkLeft(5)

-- Set work callbacks
workable:SetOnWorkCallback(function(inst, worker, workleft)
    -- Do something when worked on
    inst.AnimState:PlayAnimation("hit")
    inst.SoundEmitter:PlaySound("dontstarve/common/destroy_stone")
end)

workable:SetOnFinishCallback(function(inst, worker)
    -- Do something when work is finished
    local loot = SpawnPrefab("rocks")
    loot.Transform:SetPosition(inst.Transform:GetWorldPosition())
    inst:Remove()
end)

-- Work on the entity
workable:WorkedBy(worker, work_effectiveness)

-- Make the entity unworkable
workable:SetWorkable(false)

-- Reset the work required
workable:SetWorkLeft(workable.maxwork)
```

## Common Work Actions

The Workable component supports different action types:

- **ACTIONS.CHOP** - For trees and other wood sources
- **ACTIONS.MINE** - For rocks and minerals
- **ACTIONS.HAMMER** - For structures that can be demolished
- **ACTIONS.DIG** - For diggable objects
- **ACTIONS.NET** - For catching creatures
- **ACTIONS.HARVEST** - For harvesting resources

## Integration with Other Components

The Workable component often works with:

- `LootDropper` - For dropping resources when work is complete
- `Growable` - For renewable resources
- `Health` - For entities that can be damaged by work
- `Combat` - For entities that fight back when worked on
- `StaticGrid` - For placing on the world grid

## Real-World Examples

For practical implementations of the Workable component in mods, see these case studies:

- **[Geometric Placement Mod](../examples/case-geometric.md)** - Shows how workable entities integrate with grid-based placement systems
- **[Island Adventures Gameplay](../examples/case-island-adventures.md)** - Demonstrates specialized workable resources like bamboo and tropical trees

## See also

- [LootDropper Component](lootdropper.md) - For resource drops when work is completed
- [Health Component](health.md) - For damage from working
- [Growable Component](growable.md) - For renewable workable resources
- [Pickable Component](other-components.md) - For resources that can be picked without tools
- [Tool-Related Actions](../core/actions.md) - For actions related to tools

## Example: Creating a Basic Workable Tree

```lua
local function MakeTree()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    
    -- Configure animation
    inst.AnimState:SetBank("tree")
    inst.AnimState:SetBuild("tree_normal")
    inst.AnimState:PlayAnimation("sway1_loop", true)
    
    -- Make it workable
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.CHOP)
    inst.components.workable:SetWorkLeft(10)
    
    -- Set callbacks
    inst.components.workable:SetOnWorkCallback(function(inst, worker, workleft)
        inst.AnimState:PlayAnimation("chop")
        inst.AnimState:PushAnimation("sway1_loop", true)
        
        -- Play sound effect
        inst.SoundEmitter:PlaySound("dontstarve/wilson/use_axe_tree")
    end)
    
    inst.components.workable:SetOnFinishCallback(function(inst, worker)
        -- Change to stump
        inst.AnimState:PlayAnimation("fall")
        
        -- Play sound effects
        inst.SoundEmitter:PlaySound("dontstarve/forest/treefall")
        
        -- Spawn resources
        local pt = inst:GetPosition()
        local log = SpawnPrefab("log")
        local pinecone = SpawnPrefab("pinecone")
        
        if log then
            log.Transform:SetPosition(pt.x, pt.y, pt.z)
        end
        
        if pinecone then
            pinecone.Transform:SetPosition(pt.x, pt.y, pt.z)
        end
        
        -- Remove the tree
        inst:DoTaskInTime(0.5, function() 
            inst:Remove() 
        end)
    end)
    
    return inst
end
``` 
