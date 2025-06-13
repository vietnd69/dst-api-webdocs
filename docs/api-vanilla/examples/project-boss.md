---
id: project-boss
title: Custom Boss Project
sidebar_position: 16
---

# Custom Boss Project

This tutorial guides you through creating a complete mod that adds a custom boss to Don't Starve Together. We'll create the "Ancient Guardian," a powerful entity with unique behaviors, attacks, and drops.

## Project Overview

By the end of this tutorial, you'll have created:

- A fully functional boss entity with custom AI
- Special attack patterns and abilities
- Custom animations and sound effects
- Unique loot drops
- Boss-specific game mechanics

## Prerequisites

- Intermediate understanding of Lua programming
- Familiarity with Don't Starve Together modding
- Basic knowledge of state graphs and AI
- Understanding of prefabs and components

## Project Structure

```
AncientGuardianMod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   ├── prefabs/
│   │   ├── ancient_guardian.lua
│   │   ├── ancient_guardian_horn.lua
│   │   └── ancient_essence.lua
│   ├── stategraphs/
│   │   └── SGancient_guardian.lua
│   └── brains/
│       └── ancient_guardian_brain.lua
└── anim/
    └── ancient_guardian.zip
```

## Step 1: Setting Up the Mod

First, let's create the basic mod structure and files:

### modinfo.lua

```lua
name = "Ancient Guardian Boss"
description = "Adds a powerful Ancient Guardian boss with unique abilities and drops."
author = "Your Name"
version = "1.0.0"

-- Compatible with Don't Starve Together
dst_compatible = true
dont_starve_compatible = false
reign_of_giants_compatible = false

-- Tags to help users find the mod
all_clients_require_mod = true
client_only_mod = false

-- Icon and priority
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Mod configuration options
configuration_options = {
    {
        name = "BOSS_HEALTH",
        label = "Boss Health",
        options = {
            {description = "Easy (1000)", data = 1000},
            {description = "Normal (2000)", data = 2000},
            {description = "Hard (3000)", data = 3000},
            {description = "Nightmare (5000)", data = 5000}
        },
        default = 2000
    },
    {
        name = "BOSS_DAMAGE",
        label = "Boss Damage",
        options = {
            {description = "Low", data = 0.75},
            {description = "Normal", data = 1.0},
            {description = "High", data = 1.5},
            {description = "Extreme", data = 2.0}
        },
        default = 1.0
    },
    {
        name = "SPAWN_MODE",
        label = "Spawn Mode",
        options = {
            {description = "Ritual Only", data = "ritual"},
            {description = "Natural Spawn", data = "natural"},
            {description = "Both", data = "both"}
        },
        default = "both"
    }
}
```

### modmain.lua

```lua
-- Assets to preload
Assets = {
    Asset("ATLAS", "images/inventoryimages/ancient_guardian_horn.xml"),
    Asset("IMAGE", "images/inventoryimages/ancient_guardian_horn.tex"),
    Asset("ATLAS", "images/inventoryimages/ancient_essence.xml"),
    Asset("IMAGE", "images/inventoryimages/ancient_essence.tex"),
    Asset("SOUND", "sound/ancient_guardian.fsb"),
}

-- Prefabs to register
PrefabFiles = {
    "ancient_guardian",
    "ancient_guardian_horn",
    "ancient_essence",
}

-- Import configuration
local BOSS_HEALTH = GetModConfigData("BOSS_HEALTH")
local BOSS_DAMAGE = GetModConfigData("BOSS_DAMAGE")
local SPAWN_MODE = GetModConfigData("SPAWN_MODE")

-- Make configuration available to prefabs
TUNING.ANCIENT_GUARDIAN = {
    HEALTH = BOSS_HEALTH,
    DAMAGE_MULT = BOSS_DAMAGE,
    SPAWN_MODE = SPAWN_MODE,
}

-- Add recipes for summoning items
local ancient_ritual = Recipe("ancient_ritual_item", 
    {Ingredient("goldnugget", 10), Ingredient("nightmarefuel", 5), Ingredient("purplegem", 1)}, 
    RECIPETABS.MAGIC, 
    TECH.MAGIC_THREE)
ancient_ritual.atlas = "images/inventoryimages/ancient_ritual_item.xml"

-- Add a global function for spawning the boss
GLOBAL.SpawnAncientGuardian = function(pt)
    if pt == nil then
        -- If no position is provided, try to spawn near the player
        local player = GLOBAL.ConsoleCommandPlayer()
        if player then
            pt = player:GetPosition()
            -- Offset the position slightly
            pt = pt + GLOBAL.Vector3(15, 0, 0)
        else
            return false
        end
    end
    
    -- Spawn the boss
    local guardian = GLOBAL.SpawnPrefab("ancient_guardian")
    if guardian then
        guardian.Transform:SetPosition(pt.x, pt.y, pt.z)
        
        -- Spawn effects
        GLOBAL.SpawnPrefab("statue_transition").Transform:SetPosition(pt.x, pt.y, pt.z)
        GLOBAL.SpawnPrefab("statue_transition_2").Transform:SetPosition(pt.x, pt.y, pt.z)
        
        return guardian
    end
    
    return false
end

-- Add boss to the world
AddPrefabPostInit("world", function(inst)
    if SPAWN_MODE == "natural" or SPAWN_MODE == "both" then
        -- Add the boss to the world generation
        if inst.ismastersim then
            inst:DoTaskInTime(5, function()
                -- Spawn the boss in a suitable location after world generation
                local function TrySpawnBoss()
                    local valid_spawns = {}
                    
                    -- Find suitable spawn locations
                    for i, node in ipairs(GLOBAL.TheWorld.topology.nodes) do
                        if node.tags and 
                           (table.contains(node.tags, "Rocky") or 
                            table.contains(node.tags, "Cave")) then
                            table.insert(valid_spawns, node)
                        end
                    end
                    
                    if #valid_spawns > 0 then
                        -- Choose a random valid location
                        local spawn_node = valid_spawns[math.random(#valid_spawns)]
                        local pos = GLOBAL.Vector3(spawn_node.x, 0, spawn_node.y)
                        
                        -- Spawn the boss
                        GLOBAL.SpawnAncientGuardian(pos)
                        return true
                    end
                    
                    return false
                end
                
                -- Try to spawn the boss
                TrySpawnBoss()
            end)
        end
    end
end)

## Step 2: Creating the Boss Prefab

Now let's create the main boss prefab:

### scripts/prefabs/ancient_guardian.lua

```lua
local assets = {
    Asset("ANIM", "anim/ancient_guardian.zip"),
    Asset("SOUND", "sound/ancient_guardian.fsb"),
}

local prefabs = {
    "ancient_guardian_horn",
    "ancient_essence",
    "nightmarefuel",
    "thulecite",
    "thulecite_pieces",
    "purplegem",
}

-- Import the brain and stategraph
local brain = require "brains/ancient_guardian_brain"

-- Special attack definitions
local SLAM_DAMAGE = 100
local CHARGE_DAMAGE = 75
local SWIPE_DAMAGE = 50

-- Sound effects
local sounds = {
    idle = "ancientguardian/idle",
    hurt = "ancientguardian/hurt",
    death = "ancientguardian/death",
    attack = "ancientguardian/attack",
    charge_pre = "ancientguardian/charge_pre",
    charge = "ancientguardian/charge",
    slam = "ancientguardian/slam",
}

-- Function to handle when the boss takes damage
local function OnHit(inst, attacker, damage)
    if inst.components.health:GetPercent() <= 0.5 and not inst.enraged then
        -- Enter enraged state at 50% health
        inst.enraged = true
        inst.AnimState:SetMultColour(0.9, 0.3, 0.3, 1)
        inst.components.combat:SetDefaultDamage(inst.base_damage * 1.5)
        inst.components.locomotor:SetExternalSpeedMultiplier(inst, "enraged", 1.3)
        
        -- Play enrage animation and sound
        inst.AnimState:PlayAnimation("taunt")
        inst.SoundEmitter:PlaySound(sounds.attack, "enrage")
        
        -- Spawn nightmare fuel around the boss
        local pos = inst:GetPosition()
        for i = 1, 5 do
            local offset = Vector3(math.random(-3, 3), 0, math.random(-3, 3))
            local nightmare = SpawnPrefab("nightmarefuel")
            nightmare.Transform:SetPosition((pos + offset):Get())
        end
        
        -- After taunt, return to idle
        inst.AnimState:PushAnimation("idle", true)
    end
end

-- Function to handle when the boss dies
local function OnDeath(inst)
    -- Play death animation and sound
    inst.AnimState:PlayAnimation("death")
    inst.SoundEmitter:PlaySound(sounds.death)
    
    -- Spawn loot
    local pos = inst:GetPosition()
    
    -- Always drop the horn and essence
    local horn = SpawnPrefab("ancient_guardian_horn")
    horn.Transform:SetPosition(pos:Get())
    
    local essence = SpawnPrefab("ancient_essence")
    essence.Transform:SetPosition(pos:Get())
    
    -- Spawn additional loot
    for i = 1, math.random(3, 6) do
        local loot = SpawnPrefab(
            weighted_random_choice({
                nightmarefuel = 0.4,
                thulecite_pieces = 0.3,
                thulecite = 0.2,
                purplegem = 0.1,
            })
        )
        
        if loot then
            local offset = Vector3(math.random(-2, 2), 0, math.random(-2, 2))
            loot.Transform:SetPosition((pos + offset):Get())
        end
    end
    
    -- Spawn death effect
    SpawnPrefab("statue_transition_2").Transform:SetPosition(pos:Get())
end

-- Function to handle slam attack
local function DoSlamAttack(inst)
    -- Play slam animation and sound
    inst.AnimState:PlayAnimation("atk")
    inst.SoundEmitter:PlaySound(sounds.slam)
    
    -- Wait for the animation to reach the impact frame
    inst:DoTaskInTime(0.5, function()
        -- Apply damage in an area
        local pos = inst:GetPosition()
        local ents = TheSim:FindEntities(pos.x, pos.y, pos.z, 5, {"player", "character"}, {"playerghost", "INLIMBO"})
        
        for _, ent in ipairs(ents) do
            if ent and ent.components.health and not ent.components.health:IsDead() then
                -- Apply damage and knockback
                ent.components.health:DoDelta(-SLAM_DAMAGE * TUNING.ANCIENT_GUARDIAN.DAMAGE_MULT)
                
                -- Knockback effect
                if ent.Physics then
                    local angle = (ent:GetPosition() - pos):GetNormalized()
                    ent.Physics:SetVel(angle.x * 15, 6, angle.z * 15)
                end
                
                -- Screen shake for affected players
                if ent.components.playercontroller then
                    ent.components.playercontroller:ShakeCamera(inst, "FULL", 0.7, 0.02, 1.5, 40)
                end
            end
        end
        
        -- Visual effect
        SpawnPrefab("groundpoundring_fx").Transform:SetPosition(pos:Get())
    end)
    
    -- Return to idle after attack
    inst.AnimState:PushAnimation("idle", true)
end

-- Function to handle charge attack
local function StartChargeAttack(inst)
    -- Set up the charge
    inst.AnimState:PlayAnimation("charge_pre")
    inst.SoundEmitter:PlaySound(sounds.charge_pre)
    
    -- Start the charge after the pre-animation
    inst:DoTaskInTime(0.6, function()
        inst.AnimState:PlayAnimation("charge", true)
        inst.SoundEmitter:PlaySound(sounds.charge, "charging")
        inst.components.locomotor:SetExternalSpeedMultiplier(inst, "charging", 2.5)
        
        inst.charging = true
        inst.charge_time = 3 -- Charge for 3 seconds
        
        -- Set up collision damage
        inst.collision_task = inst:DoPeriodicTask(0.1, function()
            if inst.charging then
                local pos = inst:GetPosition()
                local ents = TheSim:FindEntities(pos.x, pos.y, pos.z, 3, {"player", "character"}, {"playerghost", "INLIMBO"})
                
                for _, ent in ipairs(ents) do
                    if ent and ent.components.health and not ent.components.health:IsDead() then
                        -- Apply damage and knockback
                        ent.components.health:DoDelta(-CHARGE_DAMAGE * TUNING.ANCIENT_GUARDIAN.DAMAGE_MULT)
                        
                        -- Knockback effect
                        if ent.Physics then
                            local angle = (ent:GetPosition() - pos):GetNormalized()
                            ent.Physics:SetVel(angle.x * 20, 5, angle.z * 20)
                        end
                    end
                end
            end
        end)
        
        -- End the charge after the duration
        inst:DoTaskInTime(inst.charge_time, function()
            if inst.charging then
                inst.charging = false
                inst.components.locomotor:RemoveExternalSpeedMultiplier(inst, "charging")
                
                if inst.collision_task then
                    inst.collision_task:Cancel()
                    inst.collision_task = nil
                end
                
                inst.SoundEmitter:KillSound("charging")
                inst.AnimState:PlayAnimation("charge_pst")
                inst.AnimState:PushAnimation("idle", true)
            end
        end)
    end)
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddDynamicShadow()
    inst.entity:AddNetwork()

    -- Set up physics
    MakeCharacterPhysics(inst, 500, 1.5)
    inst.Physics:SetCylinder(2, 3)

    -- Set up animation
    inst.AnimState:SetBank("ancient_guardian")
    inst.AnimState:SetBuild("ancient_guardian")
    inst.AnimState:PlayAnimation("idle", true)
    
    -- Set up shadow
    inst.DynamicShadow:SetSize(6, 3.5)
    
    -- Add tags
    inst:AddTag("epic")
    inst:AddTag("monster")
    inst:AddTag("hostile")
    inst:AddTag("ancient_guardian")
    inst:AddTag("largecreature")
    inst:AddTag("boss")

    -- Network variables
    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    -- Add components
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(TUNING.ANCIENT_GUARDIAN.HEALTH)
    inst.components.health.nofadeout = true
    
    inst:AddComponent("combat")
    inst.base_damage = 50 * TUNING.ANCIENT_GUARDIAN.DAMAGE_MULT
    inst.components.combat:SetDefaultDamage(inst.base_damage)
    inst.components.combat:SetAttackPeriod(3)
    inst.components.combat:SetRange(3, 5)
    inst.components.combat:SetRetargetFunction(3, function(inst)
        return FindEntity(
            inst,
            30,
            function(guy) 
                return inst.components.combat:CanTarget(guy)
            end,
            nil,
            nil,
            {"playerghost", "INLIMBO"}
        )
    end)
    
    inst:AddComponent("lootdropper")
    
    inst:AddComponent("inspectable")
    inst.components.inspectable:SetDescription("An ancient stone guardian brought to life with dark energy.")
    
    inst:AddComponent("locomotor")
    inst.components.locomotor.walkspeed = 3
    inst.components.locomotor.runspeed = 5
    
    -- Set up special attacks
    inst.DoSlamAttack = DoSlamAttack
    inst.StartChargeAttack = StartChargeAttack
    
    -- Set up state graph and brain
    inst:SetStateGraph("SGancient_guardian")
    inst:SetBrain(brain)
    
    -- Set up event listeners
    inst:ListenForEvent("attacked", OnHit)
    inst:ListenForEvent("death", OnDeath)
    
    -- Initial setup
    inst.enraged = false
    inst.charging = false
    
    return inst
end

return Prefab("ancient_guardian", fn, assets, prefabs)
```

## Step 3: Creating the State Graph

Now let's create the state graph that will control the boss's behaviors and animations:

### scripts/stategraphs/SGancient_guardian.lua

```lua
require("stategraphs/commonstates")

local events = {
    EventHandler("attacked", function(inst)
        if not (inst.sg:HasStateTag("busy") or inst.sg:HasStateTag("attack") or inst.sg:HasStateTag("charging")) then
            inst.sg:GoToState("hit")
        end
    end),
    EventHandler("death", function(inst)
        inst.sg:GoToState("death")
    end),
    EventHandler("doattack", function(inst, data)
        if not (inst.sg:HasStateTag("busy") or inst.sg:HasStateTag("attack")) then
            -- Choose between different attack types
            local attack_type = math.random(1, 10)
            
            if attack_type <= 5 then
                -- Regular attack (50% chance)
                inst.sg:GoToState("attack")
            elseif attack_type <= 8 then
                -- Slam attack (30% chance)
                inst.sg:GoToState("slam")
            else
                -- Charge attack (20% chance)
                inst.sg:GoToState("charge_pre")
            end
        end
    end),
}

local states = {
    State {
        name = "idle",
        tags = {"idle", "canrotate"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle", true)
            inst.Physics:Stop()
        end,
    },
    
    State {
        name = "taunt",
        tags = {"busy"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("taunt")
            inst.Physics:Stop()
            inst.SoundEmitter:PlaySound("ancientguardian/attack")
        end,
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
    
    State {
        name = "hit",
        tags = {"busy"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("hit")
            inst.Physics:Stop()
            inst.SoundEmitter:PlaySound("ancientguardian/hurt")
        end,
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
    
    State {
        name = "death",
        tags = {"busy"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("death")
            inst.Physics:Stop()
            inst.components.locomotor:StopMoving()
            RemovePhysicsColliders(inst)
            inst.SoundEmitter:PlaySound("ancientguardian/death")
        end,
    },
    
    State {
        name = "attack",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("atk")
            inst.Physics:Stop()
            inst.components.locomotor:StopMoving()
            inst.SoundEmitter:PlaySound("ancientguardian/attack")
        end,
        
        timeline = {
            TimeEvent(20*FRAMES, function(inst)
                inst.components.combat:DoAttack()
            end),
        },
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
    
    State {
        name = "slam",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.DoSlamAttack(inst)
            inst.Physics:Stop()
            inst.components.locomotor:StopMoving()
        end,
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
    
    State {
        name = "charge_pre",
        tags = {"attack", "busy", "charging"},
        
        onenter = function(inst)
            inst.StartChargeAttack(inst)
            inst.Physics:Stop()
            inst.components.locomotor:StopMoving()
        end,
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("charge")
            end),
        },
    },
    
    State {
        name = "charge",
        tags = {"attack", "busy", "charging", "moving"},
        
        onenter = function(inst)
            inst.components.locomotor:RunForward()
        end,
        
        onupdate = function(inst)
            -- Keep running forward during charge
            inst.components.locomotor:RunForward()
            
            -- Check for obstacles
            local pos = inst:GetPosition()
            local ahead = pos + (inst.Transform:GetRotation():ToVector3() * 2)
            
            -- If we hit a solid obstacle, end the charge
            if TheWorld.Map:IsVisualGroundAtPoint(ahead.x, ahead.y, ahead.z) == false then
                inst.sg:GoToState("charge_pst")
            end
        end,
        
        onexit = function(inst)
            -- In case we exit the state without properly ending the charge
            if inst.charging then
                inst.charging = false
                inst.components.locomotor:RemoveExternalSpeedMultiplier(inst, "charging")
                
                if inst.collision_task then
                    inst.collision_task:Cancel()
                    inst.collision_task = nil
                end
                
                inst.SoundEmitter:KillSound("charging")
            end
        end,
    },
    
    State {
        name = "charge_pst",
        tags = {"busy"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("charge_pst")
            inst.Physics:Stop()
            inst.components.locomotor:StopMoving()
        end,
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
}

-- Add walking and running states from CommonStates
CommonStates.AddWalkStates(states, {
    walktimeline = {
        TimeEvent(0, function(inst) inst.SoundEmitter:PlaySound("ancientguardian/walk") end),
        TimeEvent(12*FRAMES, function(inst) inst.SoundEmitter:PlaySound("ancientguardian/walk") end),
    },
})

CommonStates.AddRunStates(states, {
    runtimeline = {
        TimeEvent(0, function(inst) inst.SoundEmitter:PlaySound("ancientguardian/walk") end),
        TimeEvent(10*FRAMES, function(inst) inst.SoundEmitter:PlaySound("ancientguardian/walk") end),
    },
})

return StateGraph("ancient_guardian", states, events, "idle")
```

## Step 4: Creating the AI Brain

Now let's create the brain that will control the boss's decision making:

### scripts/brains/ancient_guardian_brain.lua

```lua
require "behaviours/wander"
require "behaviours/chaseandattack"
require "behaviours/standstill"
require "behaviours/runaway"
require "behaviours/doaction"
require "behaviours/attackwall"

local AncientGuardianBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
end)

-- Parameters for behaviors
local MAX_CHASE_TIME = 10
local MAX_CHASE_DIST = 40
local WANDER_DIST = 20
local SEE_PLAYER_DIST = 30
local AGGRO_DIST = 15

-- Function to find nearby players
local function GetPlayerTarget(inst)
    local nearest_player = nil
    local nearest_dist = SEE_PLAYER_DIST * SEE_PLAYER_DIST
    
    for i, v in ipairs(AllPlayers) do
        if v and v:IsValid() and not v:HasTag("playerghost") then
            local dist = inst:GetDistanceSqToInst(v)
            if dist < nearest_dist then
                nearest_dist = dist
                nearest_player = v
            end
        end
    end
    
    -- If player is close enough to aggro, return them as target
    if nearest_player and inst:GetDistanceSqToInst(nearest_player) < AGGRO_DIST * AGGRO_DIST then
        return nearest_player
    end
    
    return nil
end

-- Function to check if the boss should use a special attack
local function ShouldSpecialAttack(inst)
    -- Only use special attacks if enraged or at random times
    if inst.enraged or math.random() < 0.2 then
        if inst.components.combat.target ~= nil then
            -- Make sure target is valid
            if inst.components.combat.target:IsValid() and not inst.components.combat.target:HasTag("playerghost") then
                -- Check if target is in range
                local dist = inst:GetDistanceSqToInst(inst.components.combat.target)
                if dist < 100 then -- 10 units squared
                    return true
                end
            end
        end
    end
    
    return false
end

function AncientGuardianBrain:OnStart()
    local root = PriorityNode({
        -- If we have a wall in the way, attack it
        AttackWall(self.inst),
        
        -- If we should do a special attack, do it
        WhileNode(function() return ShouldSpecialAttack(self.inst) end, "Special Attack",
            ActionNode(function() 
                -- The actual attack type is chosen in the stategraph
                self.inst:PushEvent("doattack") 
                return SUCCESS 
            end)),
        
        -- Chase and attack any player that gets too close
        ChaseAndAttack(self.inst, MAX_CHASE_TIME, MAX_CHASE_DIST),
        
        -- Look for players to target
        WhileNode(function() return self.inst.components.combat.target == nil end, "Find Target",
            ActionNode(function()
                local target = GetPlayerTarget(self.inst)
                if target ~= nil then
                    self.inst.components.combat:SetTarget(target)
                end
                return SUCCESS
            end)),
        
        -- If nothing else to do, wander around
        Wander(self.inst, function() 
            -- Try to stay near the original spawn point if we have one
            if self.inst.spawn_point ~= nil then
                return self.inst.spawn_point
            end
            return self.inst:GetPosition()
        end, WANDER_DIST),
    }, .25)
    
    self.bt = BT(self.inst, root)
end

function AncientGuardianBrain:OnUpdate()
    -- Special behavior when enraged
    if self.inst.enraged then
        -- If we have a target, occasionally taunt
        if self.inst.components.combat.target ~= nil and math.random() < 0.01 then
            self.inst:PushEvent("taunt")
        end
    end
end

return AncientGuardianBrain
```

## Step 5: Creating the Loot Items

Now let's create the special items that the boss will drop when defeated:

### scripts/prefabs/ancient_guardian_horn.lua

```lua
local assets = {
    Asset("ANIM", "anim/ancient_guardian_horn.zip"),
    Asset("ATLAS", "images/inventoryimages/ancient_guardian_horn.xml"),
    Asset("IMAGE", "images/inventoryimages/ancient_guardian_horn.tex"),
}

local function OnEquip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "ancient_guardian_horn", "swap_ancient_guardian_horn")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
    
    -- Grant bonuses when equipped
    if owner.components.combat ~= nil then
        owner.components.combat.externaldamagemultipliers:SetModifier(inst, 1.25)
    end
    
    if owner.components.locomotor ~= nil then
        owner.components.locomotor:SetExternalSpeedMultiplier(inst, "ancient_horn", 1.1)
    end
end

local function OnUnequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
    
    -- Remove bonuses when unequipped
    if owner.components.combat ~= nil then
        owner.components.combat.externaldamagemultipliers:RemoveModifier(inst)
    end
    
    if owner.components.locomotor ~= nil then
        owner.components.locomotor:RemoveExternalSpeedMultiplier(inst, "ancient_horn")
    end
end

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    MakeInventoryPhysics(inst)

    inst.AnimState:SetBank("ancient_guardian_horn")
    inst.AnimState:SetBuild("ancient_guardian_horn")
    inst.AnimState:PlayAnimation("idle")

    -- Make it a weapon
    inst:AddTag("sharp")
    inst:AddTag("weapon")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    -- Add components
    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(60)
    inst.components.weapon:SetRange(1.2)
    
    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(200)
    inst.components.finiteuses:SetUses(200)
    inst.components.finiteuses:SetOnFinished(function(inst) inst:Remove() end)
    
    inst:AddComponent("inspectable")
    inst.components.inspectable:SetDescription("A massive horn from the Ancient Guardian. It's imbued with power.")
    
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.atlasname = "images/inventoryimages/ancient_guardian_horn.xml"
    
    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(OnEquip)
    inst.components.equippable:SetOnUnequip(OnUnequip)
    
    -- Special ability: Ground slam
    inst:AddComponent("aoetargeting")
    inst.components.aoetargeting.reticule.reticuleprefab = "reticuleaoe"
    inst.components.aoetargeting.reticule.pingprefab = "reticuleaoeping"
    inst.components.aoetargeting.reticule.targetfn = function() return inst:GetPosition() end
    inst.components.aoetargeting.reticule.validcolour = { 1, .75, 0, 1 }
    inst.components.aoetargeting.reticule.invalidcolour = { .5, 0, 0, 1 }
    inst.components.aoetargeting.reticule.ease = true
    inst.components.aoetargeting.reticule.mouseenabled = true
    
    -- Add special attack function
    inst.GroundSlam = function(inst, pos)
        -- Create visual effect
        SpawnPrefab("groundpoundring_fx").Transform:SetPosition(pos:Get())
        
        -- Play sound effect
        inst.SoundEmitter:PlaySound("ancientguardian/slam")
        
        -- Apply damage to nearby entities
        local ents = TheSim:FindEntities(pos.x, pos.y, pos.z, 5, nil, {"player", "playerghost", "INLIMBO"})
        
        for _, ent in ipairs(ents) do
            if ent and ent.components.health and not ent.components.health:IsDead() then
                -- Apply damage
                ent.components.health:DoDelta(-30)
                
                -- Knockback effect
                if ent.Physics then
                    local angle = (ent:GetPosition() - pos):GetNormalized()
                    ent.Physics:SetVel(angle.x * 10, 5, angle.z * 10)
                end
            end
        end
        
        -- Use durability
        inst.components.finiteuses:Use(5)
    end
    
    -- Add special attack action
    inst:AddComponent("spellcaster")
    inst.components.spellcaster:SetSpellFn(function(inst, pos)
        inst.GroundSlam(inst, pos)
        return true
    end)
    inst.components.spellcaster.canuseonpoint = true
    inst.components.spellcaster.canusefrominventory = false
    
    MakeHauntableLaunch(inst)

    return inst
end

return Prefab("ancient_guardian_horn", fn, assets)
```

### scripts/prefabs/ancient_essence.lua

```lua
local assets = {
    Asset("ANIM", "anim/ancient_essence.zip"),
    Asset("ATLAS", "images/inventoryimages/ancient_essence.xml"),
    Asset("IMAGE", "images/inventoryimages/ancient_essence.tex"),
}

local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    inst.entity:AddLight()

    MakeInventoryPhysics(inst)

    inst.AnimState:SetBank("ancient_essence")
    inst.AnimState:SetBuild("ancient_essence")
    inst.AnimState:PlayAnimation("idle", true)
    
    -- Add light
    inst.Light:SetFalloff(0.7)
    inst.Light:SetIntensity(0.5)
    inst.Light:SetRadius(1)
    inst.Light:SetColour(0.5, 0.8, 1)
    inst.Light:Enable(true)
    
    -- Add tags
    inst:AddTag("ancient")
    inst:AddTag("molebait")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    -- Add components
    inst:AddComponent("inspectable")
    inst.components.inspectable:SetDescription("A mysterious essence from the Ancient Guardian. It pulses with energy.")
    
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.atlasname = "images/inventoryimages/ancient_essence.xml"
    
    inst:AddComponent("stackable")
    inst.components.stackable.maxsize = 20
    
    -- Add fuel component for magic items
    inst:AddComponent("fuel")
    inst.components.fuel.fueltype = FUELTYPE.NIGHTMARE
    inst.components.fuel.fuelvalue = TUNING.LARGE_FUEL
    
    -- Add tradable component
    inst:AddComponent("tradable")
    inst.components.tradable.goldvalue = 10
    
    -- Special effect: Sanity aura when carried
    inst:AddComponent("equippable")
    inst.components.equippable.equipslot = EQUIPSLOTS.BODY
    
    inst:AddComponent("sanityaura")
    inst.components.sanityaura.aura = TUNING.SANITYAURA_TINY
    
    MakeHauntableLaunch(inst)

    return inst
end

return Prefab("ancient_essence", fn, assets)
```

## Step 6: Testing and Debugging

To test your mod:

1. Place your mod folder in the Don't Starve Together mods directory
2. Enable the mod in the game's mod menu
3. Start a new game and use the console command `c_spawn("ancient_guardian")` to spawn the boss
4. Test the boss's behaviors, attacks, and drops

### Common Issues and Solutions:

- **Animation Errors**: Ensure all animation files are properly created and referenced
- **AI Not Working**: Check for errors in the brain file and make sure behavior functions are properly defined
- **Special Attacks Not Working**: Verify that the stategraph is correctly handling the attack events
- **Loot Not Dropping**: Check that the OnDeath function is properly spawning the loot items
- **Performance Issues**: If the boss causes lag, consider optimizing the special effects or collision checks

### Debugging Tips:

- Use `print()` statements to track the execution flow of your code
- Check the log file for error messages
- Use the console command `c_select()` to inspect entity properties
- Use `c_godmode()` to test boss behaviors without dying

## Step 7: Extending the Mod

Here are some ideas for extending this mod:

- Add a ritual altar that players can build to summon the boss
- Create additional boss phases with new attack patterns
- Add special environmental effects when the boss is enraged
- Create a quest system related to the boss
- Add more unique loot items with special abilities
- Create minions that the boss can summon during the fight

## Conclusion

Congratulations! You've created a complete mod that adds a custom boss to Don't Starve Together. This project demonstrates many important modding concepts:

- Creating complex entities with custom AI
- Implementing special attacks and abilities
- Using state graphs for entity behavior
- Creating custom items with unique effects
- Integrating with the game's existing systems

This boss mod provides a challenging new encounter for players and rewards them with powerful unique items. You can expand on this foundation to create even more complex boss encounters or integrate this boss into a larger mod with additional content.

Remember to thoroughly test your mod before publishing it to ensure a smooth experience for players. Consider gathering feedback from players to refine and improve your boss's mechanics and balance.

## Additional Resources

- [Don't Starve Together Modding Wiki](https://dontstarve.fandom.com/wiki/Modding_Guides)
- [Klei Entertainment Forums](https://forums.kleientertainment.com/forums/forum/79-dont-starve-together-beta-modding/)
- [Don't Starve Together Lua API Documentation](https://dontstarveapi.com/)
- [State Graph Documentation](https://dontstarve.fandom.com/wiki/State_Graph)