---
id: custom-creatures
title: Creating Custom Creatures
sidebar_position: 5
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Creating Custom Creatures

This guide focuses on creating custom creatures for Don't Starve Together. Custom creatures can add new challenges, pets, allies, or unique monsters to your mod.

## Overview of Creature Creation

Creating a custom creature involves several key components:

1. **Prefab Definition**: The basic entity structure
2. **Visual Assets**: Animations, textures, and effects
3. **Components**: Health, combat, locomotion, etc.
4. **AI Behavior**: Brain and behavior tree implementation
5. **State Graph**: Animation states and transitions
6. **Network Code**: Client-server synchronization

## Basic Creature Structure

Here's a skeleton structure for a basic creature:

```lua
-- In scripts/prefabs/custom_creature.lua
local assets = {
    Asset("ANIM", "anim/custom_creature.zip"),
}

local prefabs = {
    "meat",
    "monster_meat",
}

local function fn()
    local inst = CreateEntity()
    
    -- Basic setup
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddDynamicShadow()
    inst.entity:AddNetwork()
    
    -- Entity properties
    MakeCharacterPhysics(inst, 50, .5)
    
    -- Animation setup
    inst.AnimState:SetBank("custom_creature")
    inst.AnimState:SetBuild("custom_creature")
    inst.AnimState:PlayAnimation("idle")
    
    inst:AddTag("monster")
    inst:AddTag("hostile")
    inst:AddTag("custom_creature")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Components
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(100)
    
    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(20)
    inst.components.combat:SetAttackPeriod(2)
    inst.components.combat:SetRange(2, 3)
    
    inst:AddComponent("lootdropper")
    inst.components.lootdropper:SetLoot({"meat", "monster_meat"})
    
    inst:AddComponent("locomotor")
    inst.components.locomotor.walkspeed = 4
    inst.components.locomotor.runspeed = 6
    
    inst:AddComponent("knownlocations")
    inst:AddComponent("sleeper")
    inst:AddComponent("inspectable")
    
    -- Brain & State Graph
    inst:SetBrain(require("brains/custom_creature_brain"))
    inst:SetStateGraph("SGcustom_creature")
    
    return inst
end

return Prefab("custom_creature", fn, assets, prefabs)
```

## Creating Visual Assets

Visual assets are crucial for your creature. You'll need:

### Animation Files

1. Create a .scml file in Spriter (or another animation tool)
2. Export to Don't Starve's animation format
3. Place in your mod's `anim/` directory

```lua
-- Register animations in your prefab
inst.AnimState:SetBank("custom_creature") -- Bank name
inst.AnimState:SetBuild("custom_creature") -- Build name
inst.AnimState:PlayAnimation("idle") -- Animation name
```

### Animation States

Common animation states to implement:

- `idle`: Default standing animation
- `walk`, `run`: Movement animations
- `hit`: Reaction to being attacked
- `attack`: Attack animation
- `sleep`: Sleeping animation
- `death`: Death animation

## Adding Components

Essential components for creatures:

### Health Component

```lua
inst:AddComponent("health")
inst.components.health:SetMaxHealth(150)
inst.components.health.murdersound = "dontstarve/creatures/myfx/death"
```

### Combat Component

```lua
inst:AddComponent("combat")
inst.components.combat:SetDefaultDamage(20)
inst.components.combat:SetAttackPeriod(3)
inst.components.combat:SetRange(3)
inst.components.combat:SetRetargetFunction(3, RetargetFunction)
```

### Locomotor Component

```lua
inst:AddComponent("locomotor")
inst.components.locomotor.walkspeed = 4
inst.components.locomotor.runspeed = 7
```

### Loot Dropper Component

```lua
inst:AddComponent("lootdropper")
inst.components.lootdropper:AddRandomLoot("meat", 3)
inst.components.lootdropper:AddRandomLoot("monster_meat", 1)
inst.components.lootdropper.numrandomloot = 1
```

## Creating AI with a Brain

The brain controls how your creature makes decisions:

```lua
-- In scripts/brains/custom_creature_brain.lua
require "behaviours/wander"
require "behaviours/chaseandattack"
require "behaviours/panic"
require "behaviours/runaway"

local CustomCreatureBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
end)

function CustomCreatureBrain:OnStart()
    local root = PriorityNode(
        {
            -- Run away when health is low
            WhileNode(function() return self.inst.components.health.takingfiredamage end, "OnFire",
                Panic(self.inst)),
                
            -- Attack nearby targets
            ChaseAndAttack(self.inst, 20, 30),
            
            -- Return to home area
            WhileNode(function() 
                return self.inst.components.knownlocations:GetLocation("home") ~= nil 
            end, "HasHome",
                Wander(self.inst, function() 
                    return self.inst.components.knownlocations:GetLocation("home") 
                end, 20)),
            
            -- Wander randomly
            Wander(self.inst, function() 
                return self.inst:GetPosition() 
            end, 20)
        }, .25)
    
    self.bt = BT(self.inst, root)
end

return CustomCreatureBrain
```

## Creating a State Graph

State graphs define animation states and transitions:

```lua
-- In scripts/stategraphs/SGcustom_creature.lua
require("stategraphs/commonstates")

local events = {
    EventHandler("attacked", function(inst) 
        if not inst.components.health:IsDead() and not 
            inst.sg:HasStateTag("attack") then
            inst.sg:GoToState("hit")
        end
    end),
    EventHandler("death", function(inst) inst.sg:GoToState("death") end),
    EventHandler("doattack", function(inst) 
        if not inst.components.health:IsDead() then
            inst.sg:GoToState("attack") 
        end
    end),
}

local states = {
    State{
        name = "idle",
        tags = {"idle", "canrotate"},
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle", true)
        end,
    },
    
    State{
        name = "walk",
        tags = {"moving", "canrotate"},
        onenter = function(inst)
            inst.AnimState:PlayAnimation("walk", true)
            inst.components.locomotor:WalkForward()
        end,
    },
    
    State{
        name = "attack",
        tags = {"attack", "busy"},
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("attack")
        end,
        timeline = {
            TimeEvent(15*FRAMES, function(inst) 
                inst.components.combat:DoAttack()
                inst.SoundEmitter:PlaySound("dontstarve/creatures/myfx/attack")
            end),
        },
        events = {
            EventHandler("animover", function(inst) inst.sg:GoToState("idle") end),
        },
    },
    
    State{
        name = "hit",
        tags = {"busy"},
        onenter = function(inst)
            inst.AnimState:PlayAnimation("hit")
            inst.SoundEmitter:PlaySound("dontstarve/creatures/myfx/hurt")
            inst.components.locomotor:StopMoving()
        end,
        events = {
            EventHandler("animover", function(inst) inst.sg:GoToState("idle") end),
        },
    },
    
    State{
        name = "death",
        tags = {"busy"},
        onenter = function(inst)
            inst.AnimState:PlayAnimation("death")
            inst.SoundEmitter:PlaySound("dontstarve/creatures/myfx/death")
            inst.components.locomotor:StopMoving()
            RemovePhysicsColliders(inst)
        end,
    },
}

CommonStates.AddSleepStates(states)
CommonStates.AddFrozenStates(states)

return StateGraph("custom_creature", states, events, "idle")
```

## Adding Sounds

Sound effects enhance your creature's presence:

```lua
-- In your prefab function
inst.SoundEmitter:PlaySound("dontstarve/creatures/myfx/idle")

-- In your stategraph
TimeEvent(15*FRAMES, function(inst) 
    inst.SoundEmitter:PlaySound("dontstarve/creatures/myfx/attack")
end),
```

## Special Abilities and Effects

You can add special abilities to make your creature unique:

### Area of Effect Attack

```lua
-- In combat component setup
inst.components.combat:SetAreaDamage(3, 0.8) -- 3 unit radius, 80% damage
```

### Environmental Effects

```lua
-- Create fire or other effects when attacking
local function OnAttack(inst, target)
    if math.random() < 0.3 then -- 30% chance
        local fx = SpawnPrefab("firering_fx")
        fx.Transform:SetPosition(target:GetPosition():Get())
    end
end

inst.components.combat:SetOnHitOtherFn(OnAttack)
```

### Spawning Minions

```lua
local function SpawnMinions(inst, count)
    count = count or 2
    for i = 1, count do
        local angle = math.random() * 2 * PI
        local offset = Vector3(math.cos(angle), 0, math.sin(angle)) * 2
        local pos = inst:GetPosition() + offset
        
        local minion = SpawnPrefab("custom_minion")
        minion.Transform:SetPosition(pos:Get())
        
        -- Link minion to parent
        minion.parent = inst
    end
end
```

## Network Synchronization

For proper client-server synchronization:

```lua
-- Network variables for client/server communication
inst.num_minions = net_smallbyte(inst.GUID, "custom_creature.num_minions", "num_minions_dirty")

-- Handling in the instance setup
if not TheWorld.ismastersim then
    -- Client-side code
    inst:ListenForEvent("num_minions_dirty", function()
        -- Update client-side visuals based on num_minions
    end)
    return inst
else
    -- Server-side code
    inst.SpawnMinions = SpawnMinions
    
    -- Update the network variable when minions change
    inst.UpdateMinionCount = function(inst)
        local count = 0
        -- Count current minions
        for k,v in pairs(Ents) do
            if v.parent == inst and v.prefab == "custom_minion" and not v:IsInLimbo() then
                count = count + 1
            end
        end
        inst.num_minions:set(count)
    end
end
```

## Making Your Creature Spawnable

Add your creature to the world through spawners:

```lua
-- In modmain.lua
AddPrefabPostInit("world", function(inst)
    if inst.ismastersim then
        -- Add creature to monster spawner
        if inst.components.monstertracker then
            inst.components.monstertracker:AddSpawn({
                prefab = "custom_creature",
                basechance = 0.1,
                chancemult = {
                    day = 0.5,  -- Less common during day
                    dusk = 1.0,
                    night = 2.0, -- More common at night
                },
                biases = {
                    forest = 1.0,
                    rocky = 0.8,
                    savanna = 0.2,
                },
                range = {min=2, max=5},  -- How many spawn at once
            })
        end
    end
end)
```

## Custom Creature Examples

### Basic Enemy Example

```lua
local function fn()
    local inst = CreateEntity()
    
    -- Basic setup
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddDynamicShadow()
    inst.entity:AddNetwork()
    
    -- Physics setup
    MakeCharacterPhysics(inst, 50, .5)
    
    -- Animation setup
    inst.AnimState:SetBank("spider")
    inst.AnimState:SetBuild("custom_spider")
    inst.AnimState:PlayAnimation("idle")
    
    inst:AddTag("monster")
    inst:AddTag("hostile")
    inst:AddTag("scarytoprey")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Components
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(75)
    
    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(10)
    inst.components.combat:SetAttackPeriod(3)
    inst.components.combat:SetRange(2)
    
    inst:AddComponent("lootdropper")
    inst.components.lootdropper:AddRandomLoot("monstermeat", 1)
    inst.components.lootdropper:AddRandomLoot("silk", 0.5)
    inst.components.lootdropper.numrandomloot = 1
    
    inst:AddComponent("locomotor")
    inst.components.locomotor.walkspeed = 3
    inst.components.locomotor.runspeed = 5
    
    inst:AddComponent("sleeper")
    inst:AddComponent("inspectable")
    
    -- AI and State Graph
    inst:SetBrain(require("brains/spiderbrain"))
    inst:SetStateGraph("SGspider")
    
    return inst
end
```

### Friendly Creature Example

```lua
local function fn()
    local inst = CreateEntity()
    
    -- Basic setup
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddDynamicShadow()
    inst.entity:AddNetwork()
    
    -- Physics setup
    MakeCharacterPhysics(inst, 10, .25)
    
    -- Animation setup
    inst.AnimState:SetBank("rabbit")
    inst.AnimState:SetBuild("friendly_bunny")
    inst.AnimState:PlayAnimation("idle")
    
    inst:AddTag("animal")
    inst:AddTag("prey")
    inst:AddTag("companion")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Components
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(25)
    
    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(0)
    
    inst:AddComponent("lootdropper")
    inst.components.lootdropper:AddRandomLoot("smallmeat", 1)
    
    inst:AddComponent("locomotor")
    inst.components.locomotor.walkspeed = 5
    inst.components.locomotor.runspeed = 8
    
    inst:AddComponent("follower")
    
    inst:AddComponent("inspectable")
    
    -- Add pettable behavior
    inst:AddComponent("petleash")
    inst.components.petleash:SetOnSpawnFn(function(pet, owner)
        pet.components.follower:SetLeader(owner)
    end)
    
    -- AI and State Graph
    inst:SetBrain(require("brains/friendlybunnybrain"))
    inst:SetStateGraph("SGfriendlybunny")
    
    return inst
end
```

## See also

- [Custom AI](custom-ai.md) - For more details on AI systems
- [Custom Stategraphs and Animations](custom-stategraphs-and-animations.md) - For animation systems
- [Custom Components](custom-component.md) - For creature components

By following this guide, you can create unique creatures that add new gameplay experiences to your Don't Starve Together mod, from simple critters to complex boss monsters. 
