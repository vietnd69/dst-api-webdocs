---
id: condition-nodes
title: Condition Nodes
sidebar_position: 3
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Condition Nodes

*API Version: 619045*

Condition Nodes are specialized nodes in Don't Starve Together's behavior tree system that evaluate conditions and determine whether other nodes should execute. They act as decision points in AI behavior trees, enabling entities to make choices based on their state and environment.

## Basic Usage

```lua
-- Basic condition node structure
local MyCondition = Class(BehaviorNode, function(self, inst, fn)
    BehaviorNode._ctor(self, "MyCondition")
    self.inst = inst
    self.fn = fn
end)

function MyCondition:Visit()
    if self.status == READY then
        if self.fn(self.inst) then
            self.status = SUCCESS
        else
            self.status = FAILURE
        end
    end
    
    return self.status
end

-- Used in a behavior tree
local root = PriorityNode(
{
    -- Execute child node only if condition is true
    IfNode(function(inst) 
        return inst.components.health:GetPercent() < 0.5 
    end,
        RunAway(inst, "character", TUNING.SCARY_DIST, TUNING.SAFE_DIST)
    ),
    -- Otherwise, execute this branch
    Wander(inst)
}, 0.5) -- Run every 0.5 seconds
```

## Condition Node States

Like other behavior nodes, condition nodes can be in one of several states:

| State | Description |
|-------|-------------|
| `READY` | Node is ready to be evaluated |
| `SUCCESS` | Condition evaluated to true |
| `FAILURE` | Condition evaluated to false |

## Built-in Condition Nodes

Don't Starve Together includes several pre-defined condition nodes:

### IfNode

The most common condition node that evaluates a condition and executes a child node if the condition is true.

```lua
-- Basic format
IfNode(condition_fn, success_node)

-- Example: Run away if health is low
IfNode(function(inst) 
    return inst.components.health:GetPercent() < 0.25 
end,
    RunAway(inst, "character", 6, 8)
)
```

### IfThenElseNode

Executes one node if the condition is true and another if it's false.

```lua
-- Basic format
IfThenElseNode(condition_fn, success_node, failure_node)

-- Example: Run away if health is low, otherwise attack
IfThenElseNode(function(inst) 
    return inst.components.health:GetPercent() < 0.3 
end,
    RunAway(inst, "character", 6, 8),
    ChaseAndAttack(inst, 10)
)
```

### AndNode

Succeeds only if all child nodes succeed.

```lua
-- Example: Multiple conditions must be true
AndNode(
    function(inst) return inst.components.health:GetPercent() > 0.5 end,
    function(inst) return inst.components.hunger:GetPercent() > 0.25 end,
    function(inst) return TheWorld.state.isday end
)
```

### OrNode

Succeeds if any child node succeeds.

```lua
-- Example: At least one condition must be true
OrNode(
    function(inst) return inst.components.health:GetPercent() < 0.25 end,
    function(inst) return inst.components.combat:HasTarget() end,
    function(inst) return TheWorld.state.isnight end
)
```

### NotNode

Inverts the result of its child node.

```lua
-- Example: Invert a condition
NotNode(function(inst) 
    return TheWorld.state.isday 
end)
```

## Common Condition Tests

Here are some commonly used conditions in Don't Starve Together AI:

### Entity State Conditions

```lua
-- Health checks
function(inst) return inst.components.health:GetPercent() < 0.3 end

-- Hunger checks
function(inst) return inst.components.hunger:GetPercent() < 0.25 end

-- Sanity checks
function(inst) return inst.components.sanity:GetPercent() < 0.5 end

-- Combat target checks
function(inst) return inst.components.combat:HasTarget() end

-- Inventory checks
function(inst) return inst.components.inventory:Has("log", 1) end

-- Tag checks
function(inst) return inst:HasTag("player") end
```

### World State Conditions

```lua
-- Time of day checks
function(inst) return TheWorld.state.isday end
function(inst) return TheWorld.state.isdusk end
function(inst) return TheWorld.state.isnight end

-- Season checks
function(inst) return TheWorld.state.issummer end
function(inst) return TheWorld.state.iswinter end
function(inst) return TheWorld.state.isspring end
function(inst) return TheWorld.state.isautumn end

-- Weather checks
function(inst) return TheWorld.state.israining end
function(inst) return TheWorld.state.issnowing end
```

### Spatial Conditions

```lua
-- Distance to target
function(inst) 
    local target = FindClosestPlayerInRange(inst.Transform:GetWorldPosition(), 20)
    return target ~= nil and inst:GetDistanceSqToInst(target) < 100
end

-- Check if on specific terrain
function(inst)
    local x, y, z = inst.Transform:GetWorldPosition()
    local tile = TheWorld.Map:GetTileAtPoint(x, y, z)
    return tile == GROUND.GRASS or tile == GROUND.SAVANNA
end
```

## Creating Custom Condition Nodes

To create a custom condition node:

1. **Derive from BehaviorNode**:
   ```lua
   local CustomCondition = Class(BehaviorNode, function(self, inst, ...)
       BehaviorNode._ctor(self, "CustomCondition")
       self.inst = inst
       -- Store other parameters
   end)
   ```

2. **Implement Visit function**:
   ```lua
   function CustomCondition:Visit()
       if self.status == READY then
           -- Evaluate condition and set status
           if SomeCondition() then
               self.status = SUCCESS
           else
               self.status = FAILURE
           end
       end
       
       return self.status
   end
   ```

## Example: Time-Based Condition Node

```lua
-- A condition node that succeeds at certain times of day
local TimeCondition = Class(BehaviorNode, function(self, inst, daytime, dusktime, nighttime)
    BehaviorNode._ctor(self, "TimeCondition")
    self.inst = inst
    self.daytime = daytime or false
    self.dusktime = dusktime or false
    self.nighttime = nighttime or false
end)

function TimeCondition:Visit()
    if self.status == READY then
        if (TheWorld.state.isday and self.daytime) or
           (TheWorld.state.isdusk and self.dusktime) or
           (TheWorld.state.isnight and self.nighttime) then
            self.status = SUCCESS
        else
            self.status = FAILURE
        end
    end
    
    return self.status
end

-- Usage in a behavior tree
local behavior = PriorityNode(
{
    IfNode(TimeCondition(inst, false, false, true),  -- Only true at night
        DoAction(inst, function()
            -- Do night-specific behavior
            return true
        end)
    ),
    IfNode(TimeCondition(inst, true, false, false),  -- Only true during day
        DoAction(inst, function()
            -- Do day-specific behavior
            return true
        end)
    ),
}, 0.5)
```

## Example: Advanced Safety Condition

```lua
-- A condition that evaluates if an entity is in danger
local SafetyCondition = Class(BehaviorNode, function(self, inst, danger_dist)
    BehaviorNode._ctor(self, "SafetyCondition")
    self.inst = inst
    self.danger_dist = danger_dist or 10
end)

function SafetyCondition:Visit()
    if self.status == READY then
        -- Check for threats
        local x, y, z = self.inst.Transform:GetWorldPosition()
        local threats = {}
        
        -- Check for monsters
        local ents = TheSim:FindEntities(x, y, z, self.danger_dist, {"monster"})
        for _, ent in ipairs(ents) do
            if ent ~= self.inst and ent:IsValid() and
               ent.components.combat and ent.components.combat:TargetIs(self.inst) then
                table.insert(threats, ent)
            end
        end
        
        -- Check for fires
        local fires = TheSim:FindEntities(x, y, z, self.danger_dist, {"fire"})
        for _, fire in ipairs(fires) do
            if fire:IsValid() then
                table.insert(threats, fire)
            end
        end
        
        -- Set result based on threats
        if #threats > 0 then
            self.status = FAILURE  -- Not safe
        else
            self.status = SUCCESS  -- Safe
        end
    end
    
    return self.status
end
```

## Integration with Other Node Types

Condition nodes work with other node types to create complex behaviors:

```lua
-- Complex behavior tree with conditions
local behavior = PriorityNode(
{
    -- If health is low, find food
    IfNode(function() 
        return inst.components.health:GetPercent() < 0.5 
    end,
        PriorityNode({
            -- First try to find healing items
            FindAndEatFood(inst, {"healing"}),
            -- Otherwise run away from threats
            RunAway(inst, "monster", 10, 15)
        }, 0.5)
    ),
    
    -- If hungry, find food
    IfNode(function() 
        return inst.components.hunger:GetPercent() < 0.25 
    end,
        FindAndEatFood(inst)
    ),
    
    -- If it's night, go home
    IfNode(function() 
        return TheWorld.state.isnight 
    end,
        GoHome(inst)
    ),
    
    -- Otherwise wander around
    Wander(inst)
}, 0.5)
```

## Performance Considerations

- Keep condition functions simple and efficient
- Cache expensive calculations when possible
- Use simpler conditions for frequently evaluated nodes
- Consider using timeouts for conditions that don't need to be checked every frame

## See also

- [Brain](brain.md) - For brain implementation using behavior trees
- [Action Nodes](action-nodes.md) - For nodes that perform actions based on conditions
- [Priority Nodes](priority-nodes.md) - For selecting between different actions
- [Sequence Nodes](sequence-nodes.md) - For executing actions in sequence
- [Decorator Nodes](decorator-nodes.md) - For modifying node behavior
