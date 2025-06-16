---
id: creatures
title: Creature Prefabs
sidebar_position: 3
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Creature Prefabs

Creature prefabs define the non-player entities that populate the world of Don't Starve Together, including animals, monsters, bosses, and other living beings.

## Creature Creation

Creatures in Don't Starve Together are entities that typically have components like health, locomotion, combat, and AI brains. Here's a typical structure for a creature prefab:

```lua
local assets = {
    Asset("ANIM", "anim/beefalo_basic.zip"),
    Asset("ANIM", "anim/beefalo_actions.zip"),
    Asset("SOUND", "sound/beefalo.fsb"),
}

local prefabs = {
    "meat",
    "poop",
    "beefalowool",
    "horn",
}

-- Define the creature's brain (AI logic)
local brain = require("brains/beefalobrain")

-- Define loot table (what drops when killed)
SetSharedLootTable("beefalo", {
    {"meat",            1.00},
    {"meat",            1.00},
    {"meat",            1.00},
    {"beefalowool",     1.00},
    {"horn",            0.33},
})

-- Define creature sounds
local sounds = {
    walk = "dontstarve/beefalo/walk",
    grunt = "dontstarve/beefalo/grunt",
    yell = "dontstarve/beefalo/yell",
    swish = "dontstarve/beefalo/tail_swish",
    curious = "dontstarve/beefalo/curious",
    angry = "dontstarve/beefalo/angry",
    sleep = "dontstarve/beefalo/sleep",
}

-- Main creation function
local function fn()
    local inst = CreateEntity()

    -- Add required engine components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddDynamicShadow()
    inst.entity:AddNetwork()

    -- Configure physics
    MakeCharacterPhysics(inst, 100, .5)

    -- Configure animations
    inst.AnimState:SetBank("beefalo")
    inst.AnimState:SetBuild("beefalo_build")
    inst.AnimState:PlayAnimation("idle_loop", true)

    -- Add tags for identification and optimization
    inst:AddTag("animal")
    inst:AddTag("beefalo")
    inst:AddTag("largecreature")

    -- Network setup
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add game components
    inst:AddComponent("health")
    inst:AddComponent("combat")
    inst:AddComponent("lootdropper")
    inst:AddComponent("locomotor")
    inst:AddComponent("eater")
    inst:AddComponent("sleeper")
    inst:AddComponent("herdmember")
    
    -- Configure components
    inst.components.health:SetMaxHealth(500)
    inst.components.combat:SetDefaultDamage(40)
    inst.components.locomotor.walkspeed = 2
    inst.components.lootdropper:SetChanceLootTable("beefalo")
    
    -- Set up AI brain
    inst:SetBrain(brain)
    
    -- Set up state graph (animation/behavior states)
    inst:SetStateGraph("SGBeefalo")
    
    return inst
end

return Prefab("beefalo", fn, assets, prefabs)
```

## Core Creature Components

Most creatures have the following essential components:

| Component | Purpose |
|-----------|---------|
| `health` | Manages creature's health and death |
| `combat` | Handles attacking and being attacked |
| `lootdropper` | Controls what items drop when killed |
| `locomotor` | Manages movement and pathfinding |
| `eater` | Allows creature to consume food |
| `sleeper` | Controls sleep behavior and cycles |

## AI Behavior

Creatures use brain scripts and state graphs to define their behavior:

```lua
-- Set up the brain (AI logic)
inst:SetBrain(brain)

-- Set up the state graph (states and transitions)
inst:SetStateGraph("SGBeefalo")
```

The brain file (e.g., `beefalobrain.lua`) contains the decision-making logic using behavior trees:

```lua
local BeefaloBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
end)

function BeefaloBrain:OnStart()
    local root = PriorityNode({
        WhileNode(function() return self.inst.components.combat.target ~= nil end, "AttackTarget",
            ChaseAndAttack(self.inst, MAX_CHASE_TIME, MAX_CHASE_DIST)),
        WhileNode(function() return self.inst.components.hauntable ~= nil and self.inst.components.hauntable.panic end, "PanicHaunted",
            Panic(self.inst)),
        IfNode(function() return self.inst.components.herdmember and self.inst.components.herdmember:GetHerd() ~= nil end, "HasHerd",
            Follow(self.inst, function() return self.inst.components.herdmember ~= nil and self.inst.components.herdmember:GetHerd() end, MIN_FOLLOW_DIST, MAX_FOLLOW_DIST, MED_FOLLOW_DIST)),
        Wander(self.inst, function() return self.inst.components.knownlocations:GetLocation("herd") end, MAX_WANDER_DIST, {minwalktime=MAX_WANDER_TIME})
    }, .25)
    
    self.bt = BT(self.inst, root)
end

return BeefaloBrain
```

## State Graphs

State graphs define the states and transitions for animations and behavior:

```lua
-- Example state from SGBeefalo.lua
local states = {
    State{
        name = "idle",
        tags = {"idle", "canrotate"},
        
        onenter = function(inst)
            inst.Physics:Stop()
            inst.AnimState:PlayAnimation("idle_loop", true)
        end,
    },
    
    State{
        name = "walk",
        tags = {"moving", "canrotate"},
        
        onenter = function(inst)
            inst.components.locomotor:WalkForward()
            inst.AnimState:PlayAnimation("walk", true)
        end,
    },
    
    State{
        name = "attack",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.components.combat:StartAttack()
            inst.Physics:Stop()
            inst.AnimState:PlayAnimation("atk")
        end,
        
        timeline = {
            TimeEvent(15*FRAMES, function(inst) inst.components.combat:DoAttack() end),
        },
        
        events = {
            EventHandler("animover", function(inst) inst.sg:GoToState("idle") end),
        },
    },
}
```

## Creature Categories

Don't Starve Together features several categories of creatures:

### Animals

Neutral or passive creatures that often provide resources:
- Beefalo
- Rabbits
- Birds
- Koalefants

### Monsters

Hostile creatures that attack the player:
- Spiders
- Hounds
- Tentacles
- Shadow Creatures

### Bosses

Powerful creatures with special mechanics:
- Deerclops
- Bearger
- Dragonfly
- Ancient Guardian

## Example: Beefalo Prefab

Beefalo are large, passive animals that can be domesticated:

```lua
-- Configure base health and combat
inst.components.health:SetMaxHealth(500)
inst.components.combat:SetDefaultDamage(40)
inst.components.combat:SetRetargetFunction(3, RetargetFn)

-- Set up beefalo-specific components
inst:AddComponent("domesticatable")
inst.components.domesticatable:SetDomesticationTrigger(OnDomesticationTrigger)
inst.components.domesticatable:SetMinObedience(TUNING.BEEFALO_MIN_OBEDIENCE)

-- Make rideable when domesticated
inst:AddComponent("rideable")
inst.components.rideable:SetRequiredObedience(TUNING.BEEFALO_OBEDIENCE_WOBY)
inst.components.rideable:SetSaddleable(true)

-- Set up mating and reproduction
inst:AddComponent("herdmember")
inst:AddComponent("mateable")
inst.components.mateable:SetMateSearchRange(TUNING.BEEFALO_MATING_RANGE)
```

## Specialized Creature Behaviors

Many creatures have unique behaviors implemented through custom components:

```lua
-- Spider webspitting
inst:AddComponent("webber")
inst.components.webber:SetWebSpitInterval(3, 5)

-- Tentacle ambush behavior
inst:AddComponent("lureplant")
inst.components.lureplant:SetLureInactiveTime(5)

-- Hound pack behavior
inst:AddComponent("periodicspawner")
inst.components.periodicspawner:SetPrefab("hound")
inst.components.periodicspawner:SetRandomTimes(TUNING.HOUNDMOUND_RELEASE_TIME, 5)
``` 
