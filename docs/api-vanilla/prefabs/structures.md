---
id: structures
title: Structure Prefabs
sidebar_position: 5
last_updated: 2023-07-06
---

# Structure Prefabs

Structure prefabs define the buildings, crafting stations, and other placeable objects that players can construct and interact with in Don't Starve Together.

## Structure Creation

Structures in Don't Starve Together are defined as prefabs that typically include components like `workable`, `prototyper`, and other specialized components based on the structure's functionality. Here's a typical structure for a structure prefab:

```lua
local assets = {
    Asset("ANIM", "anim/firepit.zip"),
    Asset("ANIM", "anim/firepit_fire.zip"),
    Asset("SOUND", "sound/common.fsb"),
}

local prefabs = {
    "campfirefire",
    "collapse_small",
    "ash",
}

-- Main creation function
local function fn()
    local inst = CreateEntity()

    -- Add required engine components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()

    -- Configure physics
    MakeObstaclePhysics(inst, .3)

    -- Configure animations
    inst.AnimState:SetBank("firepit")
    inst.AnimState:SetBuild("firepit")
    inst.AnimState:PlayAnimation("idle")

    -- Add tags for identification and optimization
    inst:AddTag("structure")
    inst:AddTag("fire")
    inst:AddTag("campfire")

    -- Network setup
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add game components
    inst:AddComponent("inspectable")
    inst:AddComponent("lootdropper")
    inst:AddComponent("workable")
    inst:AddComponent("cooker")
    inst:AddComponent("fueled")
    inst:AddComponent("heater")
    inst:AddComponent("light")
    
    -- Configure components
    inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
    inst.components.workable:SetWorkLeft(4)
    inst.components.workable:SetOnFinishCallback(onhammered)
    inst.components.workable:SetOnWorkCallback(onhit)
    
    inst.components.fueled:SetSections(4)
    inst.components.fueled:InitializeFuelLevel(TUNING.FIREPIT_FUEL_MAX)
    inst.components.fueled:SetTakeFuelFn(ontakefuel)
    inst.components.fueled:SetUpdateFn(onupdatefueled)
    inst.components.fueled:SetSectionCallback(onfuelchange)
    inst.components.fueled:SetDepletedFn(onextinguish)
    
    inst.components.heater:SetThermics(true, true)
    inst.components.heater:SetHeaterRadius(TUNING.FIREPIT_HEAT_RADIUS)
    
    -- Add special behaviors
    MakeHauntableIgnite(inst)
    
    return inst
end

return Prefab("firepit", fn, assets, prefabs)
```

## Core Structure Components

Most structures have several common components:

| Component | Purpose |
|-----------|---------|
| `workable` | Allows the structure to be worked on (hammered, mined, etc.) |
| `inspectable` | Allows the structure to be examined by players |
| `lootdropper` | Controls what items drop when the structure is destroyed |
| `savedrotation` | Preserves rotation when the game is saved |
| `physics` | Handles collision with other entities |

## Structure Categories

Structures in Don't Starve Together fall into several categories:

### Crafting Stations

Structures that allow crafting specific items:

```lua
-- Prototyper component for crafting stations
inst:AddComponent("prototyper")
inst.components.prototyper.trees = TUNING.PROTOTYPER_TREES.SCIENCEMACHINE
```

### Resource Processors

Structures that transform resources:

```lua
-- Stewer component for cooking crockpot recipes
inst:AddComponent("stewer")
inst.components.stewer:SetCookingTime(TUNING.CROCKPOT_COOK_TIME)
inst.components.stewer:SetNumSlots(4)

-- Dryer component for drying meat
inst:AddComponent("dryer")
inst.components.dryer:SetDryTime(TUNING.MEAT_DRY_TIME)
inst.components.dryer:SetStartDryingFn(startdryfn)
inst.components.dryer:SetDoneDryingFn(donedryfn)
```

### Light Sources

Structures that provide light:

```lua
-- Light component
inst:AddComponent("light")
inst.components.light:SetRadius(TUNING.FIREPIT_LIGHT_RADIUS)
inst.components.light:SetFalloff(TUNING.FIREPIT_LIGHT_FALLOFF)
inst.components.light:SetIntensity(TUNING.FIREPIT_LIGHT_INTENSITY)
inst.components.light:SetColour(255/255, 255/255, 192/255)
inst.components.light:Enable(false)

-- Fueled component for light sources
inst:AddComponent("fueled")
inst.components.fueled:SetSections(4)
inst.components.fueled:InitializeFuelLevel(TUNING.FIREPIT_FUEL_MAX)
```

### Storage

Structures that store items:

```lua
-- Container component
inst:AddComponent("container")
inst.components.container:WidgetSetup("chest")
inst.components.container.onopenfn = onopen
inst.components.container.onclosefn = onclose
```

## Placement System

Structures often use the placer system for placement previews:

```lua
-- Create a placer prefab
local function placer_postinit_fn(inst)
    -- Show valid/invalid placement
    inst.AnimState:SetLightOverride(1)
    inst.AnimState:PlayAnimation("idle")
    
    -- Add placement test functions
    inst.components.placer:AddSnapping(function(pt, ...)
        return FindWalkableOffset(pt, ...)
    end)
end

-- Define placer in main prefab
return Prefab("firepit", fn, assets, prefabs),
       MakePlacer("firepit_placer", "firepit", "firepit", "idle", nil, nil, nil, nil, nil, nil, placer_postinit_fn)
```

For an in-depth analysis of how the placement system can be enhanced with grid-based positioning, see the [Geometric Placement mod case study](/docs/api-vanilla/examples/case-geometric), which demonstrates advanced techniques for modifying placement behavior.

## Building Phases

Many structures have construction phases:

```lua
-- Define multiple phases
local PHASE_NAMES = { "COMPLETE", "STUFFED", "EMBERS", "ASHES" }

-- Phase transition function
local function OnPhaseChanged(inst, phase)
    if phase == "COMPLETE" then
        inst.AnimState:PlayAnimation("idle")
        inst.components.cooker:Enable(true)
    elseif phase == "STUFFED" then
        inst.AnimState:PlayAnimation("stuffed")
        inst.components.cooker:Enable(false)
    elseif phase == "EMBERS" then
        inst.AnimState:PlayAnimation("embers")
        inst.components.cooker:Enable(false)
    elseif phase == "ASHES" then
        inst.AnimState:PlayAnimation("ashes")
        inst.components.cooker:Enable(false)
    end
end
```

## Working and Destruction

Structures can be worked on (hammered, mined) using the `workable` component:

```lua
-- Configure workable component
inst:AddComponent("workable")
inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
inst.components.workable:SetWorkLeft(4)  -- Number of hits to destroy
inst.components.workable:SetOnFinishCallback(onhammered)  -- Called when destroyed
inst.components.workable:SetOnWorkCallback(onhit)  -- Called on each hit

-- Example destruction callback
local function onhammered(inst, worker)
    inst.components.lootdropper:DropLoot()
    
    -- Visual/audio effects
    local fx = SpawnPrefab("collapse_small")
    fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
    fx:SetMaterial("wood")
    
    inst:Remove()
end
```

## Example: Firepit Structure Prefab

The firepit is a basic structure that demonstrates many common patterns:

```lua
-- Light and heat based on fuel level
local function onfuelchange(inst)
    local fueled = inst.components.fueled
    local heatpct = fueled:GetPercent()
    
    -- Update light radius and intensity
    inst.components.light:SetRadius(TUNING.FIREPIT_LIGHT_RADIUS * heatpct)
    inst.components.light:SetIntensity(TUNING.FIREPIT_LIGHT_INTENSITY * heatpct)
    
    -- Update heat radius
    inst.components.heater:SetThermics(true, true)
    inst.components.heater:SetHeatRadius(TUNING.FIREPIT_HEAT_RADIUS * heatpct)
    
    -- Update animation based on fuel level
    if fueled:IsEmpty() then
        inst.AnimState:PlayAnimation("dead")
        inst.components.light:Enable(false)
    else
        if fueled:GetPercent() <= 0.25 then
            inst.AnimState:PlayAnimation("low")
        elseif fueled:GetPercent() <= 0.5 then
            inst.AnimState:PlayAnimation("med")
        else
            inst.AnimState:PlayAnimation("high")
        end
        inst.components.light:Enable(true)
    end
end

-- Fuel handling
local function ontakefuel(inst)
    inst.SoundEmitter:PlaySound("dontstarve/common/fireAddFuel")
    
    -- Start a "sizzle" sound when wet ingredients are added
    if inst.components.fueled.wetness > 0 then
        inst.SoundEmitter:PlaySound("dontstarve/common/fireWetFuel")
    end
end
```

## Specialized Structure Behaviors

Many structures have unique behaviors implemented through specialized components:

```lua
-- Ice Flingomatic for extinguishing fires
inst:AddComponent("waterprojector")
inst.components.waterprojector:SetRange(TUNING.ICEHAT_PROJECTILE_RANGE)

-- Lightning Rod for lightning protection
inst:AddComponent("lightningrod")
inst.components.lightningrod:SetOnStruckFn(onstruck)

-- Teleporter for moving between locations
inst:AddComponent("teleporter")
inst.components.teleporter.targetTeleporter = GetTargetTeleporter
```

## Structure Interaction

Structures often have specialized interaction actions:

```lua
-- Interactable component for actions
inst:AddComponent("activatable")
inst.components.activatable.OnActivate = OnActivate
inst.components.activatable.ActivateVerb = STRINGS.ACTIONS.ACTIVATE.GENERIC

-- Trading component for structures that accept items
inst:AddComponent("trader")
inst.components.trader:SetAcceptTest(ShouldAcceptItem)
inst.components.trader.onaccept = OnGetItem
``` 
