---
id: custom-ai
title: Creating Custom AI and Brain Behaviors
sidebar_position: 14
---

# Creating Custom AI and Brain Behaviors

This guide focuses on creating custom AI and brain behaviors for entities in Don't Starve Together. Understanding how to create custom AI allows you to develop unique creatures with complex behaviors that can interact with the game world and players in interesting ways.

## Understanding AI in Don't Starve Together

Don't Starve Together uses a behavior tree system for AI, implemented through the Brain component. The behavior tree consists of various node types that determine how entities make decisions and interact with the world.

### Key Components of AI System

1. **Brain Component**: The main component that manages AI behavior
2. **Behavior Trees**: Hierarchical structures of nodes that define decision-making
3. **Node Types**: Different types of nodes that control behavior flow
4. **Target Selection**: How entities choose what to interact with
5. **State Integration**: How AI decisions translate to StateGraph actions

## Basic Brain Structure

A basic brain implementation includes:

```lua
-- In scripts/brains/examplebrain.lua
require "behaviours/wander"
require "behaviours/follow"
require "behaviours/faceentity"
require "behaviours/chaseandattack"
require "behaviours/runaway"
require "behaviours/doaction"

local ExampleBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
end)

function ExampleBrain:OnStart()
    local root = PriorityNode(
        {
            -- Highest priority: run from danger
            RunAway.Create(self.inst, "character", 5, 8),
            
            -- Next priority: attack if hostile
            ChaseAndAttack(self.inst, 10),
            
            -- Lower priority: follow player
            Follow(self.inst, function() return self.inst.followtarget end, 2, 6),
            
            -- Lowest priority: wander around
            Wander(self.inst)
        }, 1)
    
    self.bt = BT(self.inst, root)
end

return ExampleBrain
```

## Node Types

### Priority Nodes

Priority nodes execute child nodes in order until one succeeds:

```lua
PriorityNode(
    {
        -- Nodes are checked in order until one succeeds
        RunAway.Create(self.inst, "character", 5, 8),
        ChaseAndAttack(self.inst, 10),
        Wander(self.inst)
    }, 1)
```

### Sequence Nodes

Sequence nodes execute child nodes in order until one fails:

```lua
SequenceNode(
    {
        -- All nodes must succeed for the sequence to succeed
        FindFood(self.inst),
        GoToFood(self.inst),
        EatFood(self.inst)
    })
```

### Decorator Nodes

Decorator nodes modify the behavior of their child node:

```lua
-- Invert the result of the child node
NotDecorator(RunAway.Create(self.inst, "character", 5, 8))

-- Only run the child node if a condition is met
IfNode(function() return self.inst.components.hunger:GetPercent() < 0.5 end,
    FindFood(self.inst))

-- Run the child node for a specific time
TimedNode(5, ChaseAndAttack(self.inst, 10))
```

### Condition Nodes

Condition nodes check specific conditions:

```lua
-- Check if entity has a target
IfNode(function() return self.inst.components.combat.target ~= nil end,
    ChaseAndAttack(self.inst, 10))

-- Check time of day
IfNode(function() return TheWorld.state.isday end,
    Wander(self.inst))
```

### Action Nodes

Action nodes perform specific actions:

```lua
-- Find and eat food
DoAction(self.inst, function() 
    local target = FindEntity(self.inst, 20, function(item) 
        return item.components.edible ~= nil 
    end)
    
    if target ~= nil then
        return BufferedAction(self.inst, target, ACTIONS.EAT)
    end
    return nil
end)
```

## Common Behaviors

### Wandering

```lua
-- Basic wandering
Wander(self.inst)

-- Wander with specific parameters
Wander(self.inst, function() return self.inst.components.knownlocations:GetLocation("home") end, 20)
```

### Following

```lua
-- Follow a specific target
Follow(self.inst, function() return self.inst.followtarget end, 2, 6)

-- Follow player when friendly
Follow(self.inst, function() 
    local player = FindClosestPlayer(self.inst:GetPosition())
    return (player ~= nil and self.inst.components.follower:GetLeader() == player) and player or nil
end, 2, 6)
```

### Combat

```lua
-- Chase and attack enemies
ChaseAndAttack(self.inst, 10, 20)

-- Run away from threats
RunAway.Create(self.inst, "character", 5, 8)

-- Attack only certain targets
ChaseAndAttack(self.inst, 10, 20, function(target)
    return target:HasTag("monster")
end)
```

### Foraging

```lua
-- Find and collect items
DoAction(self.inst, function() 
    local target = FindEntity(self.inst, 20, function(item) 
        return item.components.inventoryitem ~= nil and item.components.inventoryitem.canbepickedup
    end)
    
    if target ~= nil then
        return BufferedAction(self.inst, target, ACTIONS.PICKUP)
    end
    return nil
end)
```

## Advanced AI Techniques

### Memory and Knowledge

```lua
-- Remember locations
if self.inst.components.knownlocations == nil then
    self.inst:AddComponent("knownlocations")
end
self.inst.components.knownlocations:RememberLocation("home", self.inst:GetPosition())

-- Use remembered locations
Wander(self.inst, function() 
    return self.inst.components.knownlocations:GetLocation("home") 
end, 20)
```

### Time-based Behaviors

```lua
-- Different behaviors based on time of day
PriorityNode({
    IfNode(function() return TheWorld.state.isday end, 
        Wander(self.inst)),
    IfNode(function() return TheWorld.state.isnight end,
        RunAway.Create(self.inst, "character", 5, 8))
}, 1)
```

### Group Behaviors

```lua
-- Find nearby allies
local function FindAllies(inst)
    return FindEntities(inst:GetPosition(), 20, nil, nil, {"player"}, {inst.prefab})
end

-- Follow group leader
Follow(self.inst, function()
    local allies = FindAllies(self.inst)
    if #allies > 0 then
        -- Find the ally furthest from home
        local home = self.inst.components.knownlocations:GetLocation("home")
        local leader = nil
        local max_dist = 0
        
        for _, ally in ipairs(allies) do
            local dist = home:Dist(ally:GetPosition())
            if dist > max_dist then
                max_dist = dist
                leader = ally
            end
        end
        
        return leader
    end
    return nil
end, 2, 6)
```

### State-based Decision Making

```lua
-- Different behaviors based on internal state
PriorityNode({
    IfNode(function() return self.inst.components.hunger:GetPercent() < 0.25 end,
        FindFood(self.inst)),
    IfNode(function() return self.inst.components.health:GetPercent() < 0.5 end,
        RunAway.Create(self.inst, "character", 5, 8)),
    IfNode(function() return self.inst.components.combat.target ~= nil end,
        ChaseAndAttack(self.inst, 10))
}, 1)
```

## Integration with StateGraph

AI decisions need to trigger appropriate state changes:

```lua
-- In stategraphs/SGexample.lua
local states = {
    State{
        name = "idle",
        tags = {"idle", "canrotate"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle_loop", true)
        end,
    },
    
    State{
        name = "attack",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.components.combat:StartAttack()
            inst.AnimState:PlayAnimation("attack")
        end,
        
        timeline = {
            TimeEvent(10*FRAMES, function(inst) inst.components.combat:DoAttack() end),
        },
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
}
```

## Complete Example: Custom Creature with AI

Let's create a complete example of a custom creature with AI:

```lua
-- In scripts/prefabs/friendlycreature.lua
local assets = {
    Asset("ANIM", "anim/friendlycreature.zip"),
}

local function OnAttacked(inst, data)
    -- Make creature run from attacker
    inst.components.combat:SetTarget(data.attacker)
    inst:PushEvent("panic", {attacker = data.attacker})
end

local function OnNewTarget(inst, data)
    -- React to new combat target
    if data.target ~= nil then
        inst:PushEvent("hostile", {target = data.target})
    end
end

local function RetargetFn(inst)
    -- Only target creatures that attacked first
    return FindEntity(
        inst,
        TUNING.PIG_TARGET_DIST,
        function(guy)
            return inst.components.combat:CanTarget(guy) and 
                   guy:HasTag("monster") and 
                   not guy:HasTag("friendlycreature")
        end,
        {"character"}
    )
end

local function KeepTargetFn(inst, target)
    -- Keep targeting while in range and target is alive
    return inst.components.combat:CanTarget(target) and 
           inst:GetDistanceSqToInst(target) <= TUNING.PIG_KEEP_TARGET_DIST * TUNING.PIG_KEEP_TARGET_DIST
end

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddDynamicShadow()
    inst.entity:AddNetwork()
    
    MakeCharacterPhysics(inst, 50, .5)
    
    inst.AnimState:SetBank("friendlycreature")
    inst.AnimState:SetBuild("friendlycreature")
    inst.AnimState:PlayAnimation("idle_loop", true)
    
    inst:AddTag("character")
    inst:AddTag("friendlycreature")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add components
    inst:AddComponent("locomotor")
    inst.components.locomotor.walkspeed = 3
    inst.components.locomotor.runspeed = 5
    
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(100)
    
    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(10)
    inst.components.combat:SetAttackPeriod(2)
    inst.components.combat:SetRetargetFunction(3, RetargetFn)
    inst.components.combat:SetKeepTargetFunction(KeepTargetFn)
    
    inst:AddComponent("follower")
    
    inst:AddComponent("knownlocations")
    
    inst:ListenForEvent("attacked", OnAttacked)
    inst:ListenForEvent("newcombattarget", OnNewTarget)
    
    -- Add brain
    inst:SetBrain(require("brains/friendlycreaturbrain"))
    
    -- Add stategraph
    inst:SetStateGraph("SGfriendlycreature")
    
    return inst
end

return Prefab("friendlycreature", fn, assets)
```

Now let's create the brain for this creature:

```lua
-- In scripts/brains/friendlycreaturbrain.lua
require "behaviours/wander"
require "behaviours/follow"
require "behaviours/faceentity"
require "behaviours/chaseandattack"
require "behaviours/runaway"
require "behaviours/doaction"
require "behaviours/findclosest"

local MIN_FOLLOW_DIST = 2
local MAX_FOLLOW_DIST = 6
local TARGET_FOLLOW_DIST = 3

local WANDER_DIST = 20

local FriendlyCreatureBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
end)

local function GetFaceTargetFn(inst)
    -- Face player when nearby
    local target = FindClosestPlayer(inst:GetPosition())
    return target ~= nil and not target:HasTag("notarget") and target or nil
end

local function GetFollowTarget(inst)
    -- Follow player if they've fed the creature
    local target = inst.components.follower.leader
    return target ~= nil and target:IsValid() and not target:HasTag("notarget") and target or nil
end

local function GetHomePos(inst)
    -- Return to home position when idle
    return inst.components.knownlocations:GetLocation("home")
end

function FriendlyCreatureBrain:OnStart()
    local root = PriorityNode({
        -- Run when attacked
        WhileNode(function() return self.inst.components.health.takingfiredamage end, "OnFire", Panic(self.inst)),
        
        -- Run from threats
        RunAway.Create(self.inst, "character", 5, 8, function(target) 
            return target:HasTag("monster") and target.components.combat and target.components.combat.target == self.inst 
        end),
        
        -- Attack enemies
        WhileNode(function() return self.inst.components.combat.target ~= nil end, "AttackEnemy",
            ChaseAndAttack(self.inst, 10, 20)),
        
        -- Follow leader
        Follow(self.inst, GetFollowTarget, MIN_FOLLOW_DIST, TARGET_FOLLOW_DIST, MAX_FOLLOW_DIST),
        
        -- Face player when nearby
        FaceEntity(self.inst, GetFaceTargetFn, GetFaceTargetFn),
        
        -- Wander around home
        Wander(self.inst, GetHomePos, WANDER_DIST)
    }, .25)
    
    self.bt = BT(self.inst, root)
end

return FriendlyCreatureBrain
```

And finally, the stategraph:

```lua
-- In scripts/stategraphs/SGfriendlycreature.lua
require("stategraphs/commonstates")

local events = {
    CommonHandlers.OnLocomote(true, true),
    CommonHandlers.OnFreeze(),
    CommonHandlers.OnAttack(),
    CommonHandlers.OnAttacked(),
    CommonHandlers.OnDeath(),
    
    EventHandler("panic", function(inst)
        if not inst.components.health:IsDead() and not inst.sg:HasStateTag("busy") then
            inst.sg:GoToState("panic")
        end
    end),
    
    EventHandler("hostile", function(inst)
        if not inst.components.health:IsDead() and not inst.sg:HasStateTag("busy") then
            inst.sg:GoToState("taunt")
        end
    end),
}

local states = {
    State{
        name = "idle",
        tags = {"idle", "canrotate"},
        
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("idle_loop", true)
        end,
    },
    
    State{
        name = "walk",
        tags = {"moving", "canrotate"},
        
        onenter = function(inst)
            inst.components.locomotor:WalkForward()
            inst.AnimState:PlayAnimation("walk_loop", true)
        end,
    },
    
    State{
        name = "run",
        tags = {"moving", "running", "canrotate"},
        
        onenter = function(inst)
            inst.components.locomotor:RunForward()
            inst.AnimState:PlayAnimation("run_loop", true)
        end,
    },
    
    State{
        name = "taunt",
        tags = {"busy"},
        
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("taunt")
            inst.SoundEmitter:PlaySound("dontstarve/creatures/friendlycreature/taunt")
        end,
        
        events = {
            EventHandler("animover", function(inst) inst.sg:GoToState("idle") end),
        },
    },
    
    State{
        name = "panic",
        tags = {"busy"},
        
        onenter = function(inst)
            inst.components.locomotor:StopMoving()
            inst.AnimState:PlayAnimation("panic")
            inst.SoundEmitter:PlaySound("dontstarve/creatures/friendlycreature/panic")
        end,
        
        events = {
            EventHandler("animover", function(inst) inst.sg:GoToState("run") end),
        },
    },
}

-- Add common states
CommonStates.AddCombatStates(states,
    {
        hittimeline = {
            TimeEvent(0, function(inst) inst.SoundEmitter:PlaySound("dontstarve/creatures/friendlycreature/hurt") end),
        },
        deathtimeline = {
            TimeEvent(0, function(inst) inst.SoundEmitter:PlaySound("dontstarve/creatures/friendlycreature/death") end),
        },
    })

CommonStates.AddFrozenStates(states)

return StateGraph("friendlycreature", states, events, "idle")
```

## Creating Custom Brain Behaviors

To create custom behaviors not provided by the default behavior nodes:

```lua
-- In scripts/behaviours/mybehavior.lua
local MyBehavior = Class(BehaviorNode, function(self, inst, findTargetFn, maxDist, minDist)
    BehaviorNode._ctor(self, "MyBehavior")
    self.inst = inst
    self.findTargetFn = findTargetFn
    self.maxDist = maxDist or 10
    self.minDist = minDist or 2
    self.status = READY
end)

function MyBehavior:Visit()
    if self.status == READY then
        -- Find target
        self.target = self.findTargetFn(self.inst)
        
        if self.target == nil then
            self.status = FAILED
            return
        end
        
        self.status = RUNNING
    end
    
    if self.status == RUNNING then
        -- Check if target is still valid
        if not self.target:IsValid() then
            self.status = FAILED
            return
        end
        
        -- Get distance to target
        local dist = self.inst:GetDistanceSqToInst(self.target)
        
        if dist > self.maxDist * self.maxDist then
            -- Too far, move closer
            self.inst.components.locomotor:GoToEntity(self.target)
        elseif dist < self.minDist * self.minDist then
            -- Too close, back away
            self.inst.components.locomotor:RunAway(self.target, self.minDist)
        else
            -- Just right, perform action
            self:PerformAction()
            self.status = SUCCESS
            return
        end
        
        self.status = RUNNING
        return
    end
end

function MyBehavior:PerformAction()
    -- Override this in subclasses
    print("Performing custom behavior")
end

function MyBehavior:Reset()
    self.target = nil
    self.status = READY
end

return MyBehavior
```

## Debugging AI

To debug AI behavior:

```lua
-- Add debug visualization
local function OnUpdate(self)
    if CHEATS_ENABLED and self.inst.brain ~= nil and self.inst.brain.bt ~= nil then
        -- Draw lines to targets
        if self.inst.components.combat.target ~= nil then
            TheWorld:PushDebugRender("line", self.inst:GetPosition(), self.inst.components.combat.target:GetPosition(), 1, 0, 0, 1)
        end
        
        if self.inst.components.follower.leader ~= nil then
            TheWorld:PushDebugRender("line", self.inst:GetPosition(), self.inst.components.follower.leader:GetPosition(), 0, 1, 0, 1)
        end
        
        -- Print current behavior
        local currentNode = self.inst.brain.bt:GetCurrentNode()
        if currentNode ~= nil then
            print(string.format("%s current behavior: %s", self.inst.prefab, tostring(currentNode)))
        end
    end
end

-- Add to brain
function FriendlyCreatureBrain:OnStart()
    -- ... existing code ...
    
    -- Add debug update
    if CHEATS_ENABLED then
        self.inst:DoPeriodicTask(1, function() OnUpdate(self) end)
    end
end
```

## Best Practices

1. **Hierarchical Structure**: Organize behaviors in a clear hierarchy with highest priorities first
2. **Reuse Common Behaviors**: Use the built-in behavior nodes when possible
3. **State Integration**: Ensure brain decisions trigger appropriate state changes
4. **Performance**: Keep behavior trees efficient, especially for many entities
5. **Predictability**: Make AI behavior predictable enough for players to learn
6. **Personality**: Give creatures unique behaviors that reflect their character
7. **Debugging**: Include debug options to visualize decision-making

## Troubleshooting

### Common Issues

1. **AI not responding**: Check if the brain is properly attached to the entity
2. **Erratic behavior**: Ensure priority ordering makes sense
3. **Stuck in one state**: Check for conditions that might never resolve
4. **Performance issues**: Simplify complex behavior trees for better performance
5. **Animation mismatches**: Ensure state transitions match AI decisions

### Debugging Tips

```lua
-- Add this to your brain to print the current behavior
self.inst:DoPeriodicTask(1, function()
    if self.bt ~= nil and self.bt.currentnode ~= nil then
        print(string.format("%s is currently: %s", self.inst.prefab, tostring(self.bt.currentnode)))
    end
end)

-- Force a specific behavior for testing
function FriendlyCreatureBrain:OnStart()
    -- For testing, just make it wander
    local root = PriorityNode({
        Wander(self.inst)
    }, 1)
    
    self.bt = BT(self.inst, root)
end
```

## Conclusion

Creating custom AI and brain behaviors allows you to develop unique creatures with complex and interesting behaviors. By combining different node types and integrating with the stategraph system, you can create entities that respond intelligently to the game world and provide engaging experiences for players.

See also:
- [StateGraph System](../core/stategraph-system.md) - For integrating AI with animations
- [Entity System](../core/entity-system.md) - For understanding entity creation
- [Component System](../core/component-system.md) - For components used by AI
- [Custom Creatures](../examples/custom-creatures.md) - For more examples of creature creation
- [Custom Components](custom-component.md) - For creating components used by AI
