---
id: prefab-snippets
title: Prefab Snippets
sidebar_position: 7
last_updated: 2023-07-06
---

# Prefab Snippets

This page provides reusable code snippets for creating and customizing prefabs in Don't Starve Together mods.

## Basic Prefab Structure

### Simple Item Prefab

```lua
-- Define a simple item prefab
local assets = {
    Asset("ANIM", "anim/my_item.zip"),
}

local function fn()
    -- Create the entity
    local inst = CreateEntity()
    
    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Set up visuals
    MakeInventoryPhysics(inst)
    
    inst.AnimState:SetBank("my_item")
    inst.AnimState:SetBuild("my_item")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add tags
    inst:AddTag("item")
    
    -- Make it inspectable
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Server-only components
    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "my_item"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/my_item.xml"
    
    -- Make it stackable
    inst:AddComponent("stackable")
    inst.components.stackable.maxsize = 20
    
    -- Add other components as needed
    
    return inst
end

-- Register the prefab
return Prefab("my_item", fn, assets)
```

### Character Prefab

```lua
-- Define a character prefab
local assets = {
    Asset("ANIM", "anim/my_character.zip"),
    Asset("ANIM", "anim/ghost_my_character_build.zip"),
}

local prefabs = {
    "my_character_none",
}

-- Custom starting inventory
local start_inv = {
    "flint",
    "flint",
    "twigs",
    "twigs",
}

-- Custom stats
local stats = {
    health = 150,
    hunger = 150,
    sanity = 200,
}

local function common_postinit(inst)
    -- Minimap icon
    inst.MiniMapEntity:SetIcon("my_character.tex")
    
    -- Tags
    inst:AddTag("my_character_tag")
    
    -- Voice
    inst.soundsname = "wilson"
end

local function master_postinit(inst)
    -- Choose character starting items
    inst.starting_inventory = start_inv
    
    -- Set custom stats
    inst.components.health:SetMaxHealth(stats.health)
    inst.components.hunger:SetMax(stats.hunger)
    inst.components.sanity:SetMax(stats.sanity)
    
    -- Set character-specific component values
    inst.components.combat.damagemultiplier = 1.0
    inst.components.locomotor.walkspeed = 4
    inst.components.locomotor.runspeed = 6
    
    -- Add custom component
    inst:AddComponent("my_special_component")
    
    -- Set up character-specific abilities
    inst:ListenForEvent("ms_becameghost", function(inst)
        -- Do something when character dies
    end)
end

-- Register the character prefab
return MakePlayerCharacter("my_character", prefabs, assets, common_postinit, master_postinit)
```

## Specialized Prefab Types

### Tool Prefab

```lua
-- Define a tool prefab
local assets = {
    Asset("ANIM", "anim/my_tool.zip"),
    Asset("ANIM", "anim/swap_my_tool.zip"),
}

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    MakeInventoryPhysics(inst)
    
    inst.AnimState:SetBank("my_tool")
    inst.AnimState:SetBuild("my_tool")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add tool tag for actions
    inst:AddTag("tool")
    
    -- If it can chop trees
    inst:AddTag("CHOP_tool")
    
    -- If it can mine rocks
    inst:AddTag("MINE_tool")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Basic components
    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    
    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(function(inst, owner)
        owner.AnimState:OverrideSymbol("swap_object", "swap_my_tool", "swap_my_tool")
        owner.AnimState:Show("ARM_carry")
        owner.AnimState:Hide("ARM_normal")
    end)
    
    inst.components.equippable:SetOnUnequip(function(inst, owner)
        owner.AnimState:Hide("ARM_carry")
        owner.AnimState:Show("ARM_normal")
    end)
    
    -- Add tool component
    inst:AddComponent("tool")
    inst.components.tool:SetAction(ACTIONS.CHOP, 1.5) -- 1.5x chop efficiency
    inst.components.tool:SetAction(ACTIONS.MINE, 1.2) -- 1.2x mine efficiency
    
    -- Add weapon component
    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(TUNING.AXE_DAMAGE)
    
    -- Add finite uses
    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(100)
    inst.components.finiteuses:SetUses(100)
    inst.components.finiteuses:SetOnFinished(function(inst)
        inst:Remove()
    end)
    
    -- Connect tool actions to durability loss
    inst.components.finiteuses:SetConsumption(ACTIONS.CHOP, 1)
    inst.components.finiteuses:SetConsumption(ACTIONS.MINE, 1.25)
    
    return inst
end

return Prefab("my_tool", fn, assets)
```

### Food Prefab

```lua
-- Define a food prefab
local assets = {
    Asset("ANIM", "anim/my_food.zip"),
}

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    MakeInventoryPhysics(inst)
    
    inst.AnimState:SetBank("my_food")
    inst.AnimState:SetBuild("my_food")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add food tag
    inst:AddTag("preparedfood")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Basic components
    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    
    -- Make it edible
    inst:AddComponent("edible")
    inst.components.edible.healthvalue = 20
    inst.components.edible.hungervalue = 37.5
    inst.components.edible.sanityvalue = 15
    inst.components.edible.foodtype = FOODTYPE.VEGGIE
    
    -- Special effect when eaten
    inst.components.edible:SetOnEatenFn(function(inst, eater)
        if eater.components.temperature ~= nil then
            -- Cool down the eater
            eater.components.temperature:SetTemperature(eater.components.temperature:GetCurrent() - 10)
        end
    end)
    
    -- Make it perishable
    inst:AddComponent("perishable")
    inst.components.perishable:SetPerishTime(TUNING.PERISH_MED)
    inst.components.perishable:StartPerishing()
    inst.components.perishable.onperishreplacement = "spoiled_food"
    
    -- Make it stackable
    inst:AddComponent("stackable")
    inst.components.stackable.maxsize = 10
    
    return inst
end

return Prefab("my_food", fn, assets)
```

### Structure Prefab

```lua
-- Define a structure prefab
local assets = {
    Asset("ANIM", "anim/my_structure.zip"),
}

local prefabs = {
    "collapse_small",
}

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    -- Make it a structure
    inst:AddTag("structure")
    
    -- Set up visuals
    inst.AnimState:SetBank("my_structure")
    inst.AnimState:SetBuild("my_structure")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add minimap icon
    inst.entity:AddMiniMapEntity()
    inst.MiniMapEntity:SetIcon("my_structure.tex")
    
    -- Make it collidable
    MakeObstaclePhysics(inst, 0.5)
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Basic components
    inst:AddComponent("inspectable")
    
    -- Make it workable (can be hammered)
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
    inst.components.workable:SetWorkLeft(4)
    inst.components.workable:SetOnFinishCallback(function(inst, worker)
        -- Play destruction effects
        inst.components.lootdropper:DropLoot()
        
        local fx = SpawnPrefab("collapse_small")
        fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
        fx:SetMaterial("wood")
        
        inst:Remove()
    end)
    
    -- Make it drop loot when destroyed
    inst:AddComponent("lootdropper")
    inst.components.lootdropper:SetLoot({"boards", "boards", "twigs"})
    
    -- Make it burnable
    MakeSmallBurnable(inst, TUNING.MED_BURNTIME)
    MakeSmallPropagator(inst)
    
    -- Make it saveable
    inst:AddComponent("hauntable")
    inst.components.hauntable:SetHauntValue(TUNING.HAUNT_TINY)
    
    return inst
end

return Prefab("my_structure", fn, assets)
```

## Advanced Prefab Techniques

### Prefab with Custom Actions

```lua
-- Define a prefab with custom actions
local assets = {
    Asset("ANIM", "anim/my_special_item.zip"),
}

-- Define the custom action in modmain.lua
--[[
local MYACTION = Action({priority=10, mount_valid=true})
MYACTION.str = "Activate"
MYACTION.id = "MYACTION"
MYACTION.fn = function(act)
    if act.target and act.target.components.myactionable then
        return act.target.components.myactionable:DoMyAction(act.doer)
    end
    return false
end

-- Add the action to the component action handler
AddComponentAction("SCENE", "myactionable", function(inst, doer, actions, right)
    if right and inst:HasTag("myactionable") then
        table.insert(actions, ACTIONS.MYACTION)
    end
end)
]]--

-- Create a component for the action
local MyActionable = Class(function(self, inst)
    self.inst = inst
    self.uses = 10
    
    -- Add tag for action filtering
    inst:AddTag("myactionable")
end)

function MyActionable:DoMyAction(doer)
    if self.uses <= 0 then
        return false
    end
    
    -- Do something when action is performed
    self.uses = self.uses - 1
    
    -- Create some effect
    local fx = SpawnPrefab("sparkle")
    fx.Transform:SetPosition(self.inst.Transform:GetWorldPosition())
    
    -- Maybe give the user something
    if doer.components.inventory then
        local reward = SpawnPrefab("goldnugget")
        doer.components.inventory:GiveItem(reward)
    end
    
    -- Remove the item when uses are depleted
    if self.uses <= 0 then
        self.inst:Remove()
    end
    
    return true
end

-- Save/load
function MyActionable:OnSave()
    return {uses = self.uses}
end

function MyActionable:OnLoad(data)
    if data and data.uses then
        self.uses = data.uses
    end
end

-- Prefab function
local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    MakeInventoryPhysics(inst)
    
    inst.AnimState:SetBank("my_special_item")
    inst.AnimState:SetBuild("my_special_item")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add tag for the action
    inst:AddTag("myactionable")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Basic components
    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    
    -- Add our custom component
    inst:AddComponent("myactionable")
    
    return inst
end

return Prefab("my_special_item", fn, assets)
```

### Prefab with State Graph

```lua
-- Define a prefab with a state graph
local assets = {
    Asset("ANIM", "anim/my_creature.zip"),
}

local prefabs = {
    "meat",
}

-- Create a brain for AI behavior
local brain = require "brains/my_creature_brain"

-- Create state graph for the creature
local states = {
    State {
        name = "idle",
        tags = {"idle", "canrotate"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle_loop", true)
            inst.Physics:Stop()
        end,
    },
    
    State {
        name = "walk",
        tags = {"moving", "canrotate"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("walk_loop", true)
        end,
    },
    
    State {
        name = "attack",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("attack")
            inst.components.combat:StartAttack()
        end,
        
        timeline = {
            TimeEvent(15*FRAMES, function(inst)
                inst.components.combat:DoAttack()
                inst.SoundEmitter:PlaySound("dontstarve/creatures/my_creature/attack")
            end),
        },
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
}

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddDynamicShadow()
    inst.entity:AddNetwork()
    
    -- Set up physics
    MakeCharacterPhysics(inst, 50, 0.5)
    
    -- Set up animations
    inst.AnimState:SetBank("my_creature")
    inst.AnimState:SetBuild("my_creature")
    inst.AnimState:PlayAnimation("idle_loop", true)
    
    -- Add tags
    inst:AddTag("monster")
    inst:AddTag("hostile")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add components
    inst:AddComponent("inspectable")
    
    -- Add locomotion
    inst:AddComponent("locomotor")
    inst.components.locomotor.walkspeed = 3
    inst.components.locomotor.runspeed = 5
    
    -- Add combat
    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(20)
    inst.components.combat:SetAttackPeriod(2)
    inst.components.combat:SetRange(2, 3)
    
    -- Add health
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(200)
    
    -- Add loot
    inst:AddComponent("lootdropper")
    inst.components.lootdropper:SetLoot({"meat", "meat"})
    
    -- Set up state graph
    inst:SetStateGraph("SGmy_creature")
    
    -- Set up AI brain
    inst:SetBrain(brain)
    
    return inst
end

-- Register the prefab
return Prefab("my_creature", fn, assets, prefabs)
```

### Prefab with Network Replication

```lua
-- Define a prefab with network replication
local assets = {
    Asset("ANIM", "anim/my_networked_item.zip"),
}

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    MakeInventoryPhysics(inst)
    
    inst.AnimState:SetBank("my_networked_item")
    inst.AnimState:SetBuild("my_networked_item")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add network variables
    inst.charge_level = net_byte(inst.GUID, "my_networked_item.charge", "chargedirty")
    inst.active = net_bool(inst.GUID, "my_networked_item.active", "activedirty")
    
    -- Initialize network values
    inst.charge_level:set(5)
    inst.active:set(false)
    
    -- Add client-side handlers
    inst:ListenForEvent("chargedirty", function()
        -- Update visual based on charge level
        local charge = inst.charge_level:value()
        inst.AnimState:OverrideSymbol("meter", "my_networked_item", "meter_" .. charge)
    end)
    
    inst:ListenForEvent("activedirty", function()
        -- Update visual based on active state
        if inst.active:value() then
            inst.AnimState:PlayAnimation("active_loop", true)
        else
            inst.AnimState:PlayAnimation("idle")
        end
    end)
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Server-side components
    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    
    -- Add custom component to manage charge
    inst:AddComponent("mychargeableitem")
    inst.components.mychargeableitem.onchargechanged = function(charge)
        inst.charge_level:set(charge)
    end
    
    inst.components.mychargeableitem.onactivated = function(active)
        inst.active:set(active)
    end
    
    return inst
end

return Prefab("my_networked_item", fn, assets)
```

These snippets demonstrate various prefab creation techniques for Don't Starve Together modding. Adapt them to your specific needs when creating custom items, characters, creatures, or structures. 
