---
id: growable
title: Growable Component
sidebar_position: 12
---

# Growable Component

The Growable component allows entities to grow and change over time through different stages, such as plants maturing or trees growing.

## Basic Usage

```lua
-- Add a growable component to an entity
local entity = CreateEntity()
entity:AddComponent("growable")

-- Configure the growable component
local growable = entity.components.growable
growable:SetStages({
    {name="small", time=TUNING.DAY_TIME_DEFAULT * 2, fn=SetSmall},
    {name="medium", time=TUNING.DAY_TIME_DEFAULT * 3, fn=SetMedium},
    {name="large", time=TUNING.DAY_TIME_DEFAULT * 4, fn=SetLarge}
})
growable:SetStage(1)
growable:StartGrowing()
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `stages` | Table | Array of stages with names, duration, and callbacks |
| `stage` | Number | Current growth stage index |
| `targettime` | Number | Time when the next stage will be reached |
| `pausedfn` | Function | Called when growth is paused |
| `startfn` | Function | Called when growth starts |
| `stagefn` | Function | Called when a new stage is reached |

## Key Methods

```lua
-- Define growth stages
growable:SetStages({
    {name="sprout", time=TUNING.DAY_TIME_DEFAULT, fn=OnSprout},
    {name="small", time=TUNING.DAY_TIME_DEFAULT * 2, fn=OnSmall},
    {name="medium", time=TUNING.DAY_TIME_DEFAULT * 3, fn=OnMedium},
    {name="full", time=TUNING.DAY_TIME_DEFAULT * 2, fn=OnFull}
})

-- Set current stage (1-based index)
growable:SetStage(2) -- Set to second stage

-- Start the growing process
growable:StartGrowing()

-- Pause growing
growable:StopGrowing()

-- Get current stage data
local stage_data = growable:GetCurrentStageData()

-- Jump to next stage
growable:DoGrowth()
```

## Growth Stages

Each growth stage is defined with:
- `name` - Identifier for the stage
- `time` - Duration of this stage before advancing to the next
- `fn` - Function called when this stage is reached

## Integration with Other Components

The Growable component often works with:

- `Pickable` - For harvestable plants at certain growth stages
- `Workable` - For different work requirements at different growth stages
- `Burnable` - For fire behavior that varies by growth stage
- `Lootdropper` - For different drops at different growth stages

## Example: Creating a Growable Plant

```lua
local function MakePlant()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    
    -- Make it growable
    inst:AddComponent("growable")
    inst.components.growable:SetStages({
        {
            name="sprout", 
            time=TUNING.DAY_TIME_DEFAULT, 
            fn=function(inst) 
                inst.AnimState:PlayAnimation("sprout")
            end
        },
        {
            name="small", 
            time=TUNING.DAY_TIME_DEFAULT * 2, 
            fn=function(inst) 
                inst.AnimState:PlayAnimation("small")
            end
        },
        {
            name="full", 
            time=TUNING.DAY_TIME_DEFAULT * 3, 
            fn=function(inst) 
                inst.AnimState:PlayAnimation("full")
                -- Make it pickable at full growth
                inst:AddComponent("pickable")
            end
        }
    })
    
    -- Start at the first stage
    inst.components.growable:SetStage(1)
    inst.components.growable:StartGrowing()
    
    return inst
end
``` 