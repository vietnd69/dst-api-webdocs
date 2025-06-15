---
id: workable
title: Workable
sidebar_position: 15
version: 619045
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

### SetWorkAction

Sets the action required to work on this entity.

```lua
-- Set the action required to work on this entity
workable:SetWorkAction(ACTIONS.MINE)

-- Example of a boulder that requires mining
function MakeBoulder()
    local inst = CreateEntity()
    
    -- Basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    
    -- Add workable component with mining action
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.MINE)
    inst.components.workable:SetWorkLeft(15)
    
    return inst
end
```

### SetWorkLeft

Sets the amount of work remaining before the entity is completely worked.

```lua
-- Set how much work is required to complete
workable:SetWorkLeft(20)

-- Example of a tree with different work requirements based on growth stage
function SetTreeWorkAmount(inst)
    local workable = inst.components.workable
    local growthStage = inst.components.growable:GetStage()
    
    if growthStage == 1 then        -- Sapling
        workable:SetWorkLeft(3)
    elseif growthStage == 2 then    -- Medium tree
        workable:SetWorkLeft(8)
    elseif growthStage == 3 then    -- Full tree
        workable:SetWorkLeft(15)
    end
    
    -- Display a visual indicator of how much work is left
    inst.AnimState:SetMultColor(1, 1, 1, 1)
end
```

### SetOnWorkCallback

Sets the callback function called each time the entity is worked on.

```lua
-- Set whether this entity makes sound when worked on
workable:SetOnWorkCallback(function(inst, worker, workleft)
    -- Play sound effect when worked on
    inst.SoundEmitter:PlaySound("dontstarve/wilson/use_axe_tree")
end)

-- Example of a rock with progressive visual damage
function ConfigureRockWork(inst)
    inst:AddComponent("workable")
    local workable = inst.components.workable
    workable:SetWorkAction(ACTIONS.MINE)
    workable:SetWorkLeft(20)
    
    -- Setup progressive damage visuals
    workable:SetOnWorkCallback(function(inst, worker, workleft)
        -- Play mining sound
        inst.SoundEmitter:PlaySound("dontstarve/common/destroy_stone")
        
        -- Show visual damage based on work progress
        if workleft <= 5 then
            inst.AnimState:PlayAnimation("low")
        elseif workleft <= 10 then
            inst.AnimState:PlayAnimation("med")
        elseif workleft <= 15 then
            inst.AnimState:PlayAnimation("high")
        end
        
        -- Chance to spawn small rocks when hit
        if math.random() < 0.3 then
            local rock = SpawnPrefab("rocks")
            rock.Transform:SetPosition(inst.Transform:GetWorldPosition())
            Launch(rock, inst, 2)
        end
    end)
end
```

### SetOnFinishCallback

Sets the callback function called when the entity is fully worked.

```lua
-- Set what happens when work is completed
workable:SetOnFinishCallback(function(inst, worker)
    -- Drop loot, play effects, etc.
    inst:Remove()
end)

-- Example of a stump that can be dug up after a tree is chopped
function SetupStumpAfterChop(inst)
    -- Called when tree is fully chopped
    inst.components.workable:SetOnFinishCallback(function(inst, worker)
        -- Play fall sound and animation
        inst.SoundEmitter:PlaySound("dontstarve/forest/treefall")
        inst.AnimState:PlayAnimation("falling", false)
        
        -- Schedule stump creation after animation
        inst:DoTaskInTime(0.4, function(inst)
            -- Create stump
            local stump = SpawnPrefab("stump")
            stump.Transform:SetPosition(inst.Transform:GetWorldPosition())
            
            -- Create loot
            local loot = inst.components.lootdropper:DropLoot()
            
            -- Add stump workability for digging
            stump:AddComponent("workable")
            stump.components.workable:SetWorkAction(ACTIONS.DIG)
            stump.components.workable:SetWorkLeft(2)
            stump.components.workable:SetOnFinishCallback(function(stump_inst, digger)
                stump_inst.components.lootdropper:SpawnLootPrefab("twigs")
                stump_inst:Remove()
            end)
            
            -- Remove the original tree
            inst:Remove()
        end)
    end)
end
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

## See also

- [LootDropper Component](lootdropper.md) - For dropping items when work is completed
- [Growable Component](growable.md) - For regrowth after being worked on
- [Health Component](health.md) - For damage when being worked on
- [Combat Component](combat.md) - For entities that attack when worked on
- [Inventory Component](inventory.md) - For storing harvested resources

## Example: Creating a Complex Workable Entity

```lua
local function MakeInteractiveStructure()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    -- Add loot dropper for rewards
    inst:AddComponent("lootdropper")
    inst.components.lootdropper:SetLoot({"boards", "boards", "cutstone"})
    
    -- Add workable component for hammering
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
    inst.components.workable:SetWorkLeft(6)
    
    -- Progressive damage visuals and effects
    inst.components.workable:SetOnWorkCallback(function(inst, worker, workleft)
        -- Play sound
        inst.SoundEmitter:PlaySound("dontstarve/common/destroy_wood")
        
        -- Shake the screen a bit
        worker.components.playercontroller:ShakeCamera(inst, "VERTICAL", 0.1, 0.02, 0.15, 15)
        
        -- Show different damage states
        if workleft <= 2 then
            inst.AnimState:PlayAnimation("hit_high")
            inst.AnimState:PushAnimation("idle_high")
        elseif workleft <= 4 then
            inst.AnimState:PlayAnimation("hit_med")
            inst.AnimState:PushAnimation("idle_med")
        else
            inst.AnimState:PlayAnimation("hit_low")
            inst.AnimState:PushAnimation("idle_low")
        end
    end)
    
    -- Final destruction
    inst.components.workable:SetOnFinishCallback(function(inst, worker)
        -- Play destruction effect
        SpawnPrefab("collapse_small").Transform:SetPosition(inst.Transform:GetWorldPosition())
        inst.SoundEmitter:PlaySound("dontstarve/common/destroy_wood")
        
        -- Drop loot
        inst.components.lootdropper:DropLoot()
        
        -- Remove the structure
        inst:Remove()
    end)
    
    return inst
end
``` 