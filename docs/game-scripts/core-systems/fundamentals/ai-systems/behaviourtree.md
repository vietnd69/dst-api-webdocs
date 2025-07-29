---
title: Behaviour Tree System
description: Documentation of the Don't Starve Together behaviour tree system for AI state management and decision making
sidebar_position: 2
slug: /game-scripts/core-systems/behaviourtree
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Behaviour Tree System

The Behaviour Tree system in Don't Starve Together provides a hierarchical framework for implementing AI decision-making logic. This system enables complex AI behaviors through modular, reusable node structures that can be composed to create sophisticated state machines for entities like mobs, NPCs, and other game objects.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Updated documentation to match current implementation and added missing node types |

## Overview

The behaviour tree system serves multiple purposes:
- **AI Decision Making**: Provides structured approach to entity behavior logic
- **Modular Design**: Enables reusable behavior components across different entities
- **Performance Optimization**: Includes sleep/wake mechanisms for efficient execution
- **Debug Support**: Offers comprehensive debugging and visualization tools

The system is built around a tree structure where each node represents a specific behavior or decision point, allowing for complex AI patterns through simple composition.

## Core Architecture

### Status Constants

The system defines four primary execution states:

```lua
SUCCESS = "SUCCESS"   -- Node completed successfully
FAILED = "FAILED"     -- Node failed to complete
READY = "READY"       -- Node is ready to execute
RUNNING = "RUNNING"   -- Node is currently executing
```

### Main BT Class

The root behavior tree class that manages execution:

```lua
BT = Class(function(self, inst, root)
    self.inst = inst      -- The entity this tree belongs to
    self.root = root      -- The root node of the tree
end)
```

#### Key Methods

| Method | Description |
|--------|-------------|
| `Update()` | Executes one tick of the behavior tree |
| `ForceUpdate()` | Forces immediate update regardless of sleep state |
| `Reset()` | Resets the entire tree to initial state |
| `Stop()` | Stops execution and cleans up resources |
| `GetSleepTime()` | Returns optimal sleep duration for performance |
| `__tostring()` | Returns string representation of tree for debugging |

## Node Types

### Base BehaviourNode

All behavior tree nodes inherit from the base `BehaviourNode` class:

```lua
BehaviourNode = Class(function(self, name, children)
    self.name = name or ""
    self.children = children
    self.status = READY
    self.lastresult = READY
    self.nextupdatetick = 0
    self.id = NODE_COUNT  -- Unique identifier for debugging
    
    -- Set parent references for all children
    if children then
        for i, k in pairs(children) do
            k.parent = self
        end
    end
end)
```

#### Core Node Methods

| Method | Description |
|--------|-------------|
| `Visit()` | Execute the node's primary logic |
| `Reset()` | Reset node and children to READY state |
| `Step()` | Update child nodes after execution |
| `Stop()` | Clean up resources and stop execution |
| `Sleep(t)` | Put node to sleep for specified time |
| `SaveStatus()` | Save current status as last result |
| `GetSleepTime()` | Calculate how long this node should sleep |
| `GetTreeSleepTime()` | Calculate sleep time for entire subtree |
| `GetString()` | Get string representation for debugging |
| `GetTreeString(indent)` | Get formatted tree string with indentation |
| `DBString()` | Get debug string for node-specific information |
| `DoToParents(fn)` | Execute function on all parent nodes |

### Composite Nodes

Composite nodes manage multiple child nodes with different execution strategies.

#### SequenceNode

Executes children in order, failing if any child fails:

```lua
SequenceNode = Class(BehaviourNode, function(self, children)
    BehaviourNode._ctor(self, "Sequence", children)
    self.idx = 1  -- Current child index
end)
```

**Behavior**: Continues to next child only if current child succeeds. Returns FAILED immediately if any child fails.

#### SelectorNode

Executes children in order, succeeding if any child succeeds:

```lua
SelectorNode = Class(BehaviourNode, function(self, children)
    BehaviourNode._ctor(self, "Selector", children)
    self.idx = 1  -- Current child index
end)
```

**Behavior**: Continues to next child only if current child fails. Returns SUCCESS immediately if any child succeeds.

#### PriorityNode

Re-evaluates child priority periodically, switching execution as needed:

```lua
PriorityNode = Class(BehaviourNode, function(self, children, period, noscatter)
    BehaviourNode._ctor(self, "Priority", children)
    self.period = period or 1  -- Re-evaluation interval
end)
```

**Behavior**: Higher-priority children can interrupt lower-priority running children.

#### ParallelNode

Executes all children simultaneously:

```lua
ParallelNode = Class(BehaviourNode, function(self, children, name)
    BehaviourNode._ctor(self, name or "Parallel", children)
end)
```

**Behavior**: Succeeds when all children succeed, fails if any child fails.

#### ParallelNodeAny

Parallel node that succeeds when any child completes:

```lua
ParallelNodeAny = Class(ParallelNode, function(self, children)
    ParallelNode._ctor(self, children, "Parallel(Any)")
    self.stoponanycomplete = true
end)
```

**Behavior**: Executes all children simultaneously, succeeds when the first child succeeds or fails.

#### RandomNode

Randomly selects a child to execute:

```lua
RandomNode = Class(BehaviourNode, function(self, children)
    BehaviourNode._ctor(self, "Random", children)
end)
```

**Behavior**: Picks random child on first execution, retries failed children randomly.

#### LoopNode

Repeats execution of children for a specified number of iterations:

```lua
LoopNode = Class(BehaviourNode, function(self, children, maxreps)
    BehaviourNode._ctor(self, "Sequence", children)
    self.idx = 1
    self.maxreps = maxreps
    self.rep = 0
end)
```

**Behavior**: Executes children sequentially, resetting and repeating until `maxreps` is reached or a child fails.

### Leaf Nodes

Leaf nodes perform actual actions or evaluate conditions.

#### ActionNode

Executes a single action function:

```lua
ActionNode = Class(BehaviourNode, function(self, action, name)
    BehaviourNode._ctor(self, name or "ActionNode")
    self.action = action  -- Function to execute
end)
```

#### ConditionNode

Evaluates a boolean condition:

```lua
ConditionNode = Class(BehaviourNode, function(self, fn, name)
    BehaviourNode._ctor(self, name or "Condition")
    self.fn = fn  -- Function that returns boolean
end)
```

#### MultiConditionNode

Evaluates different conditions for start and continue logic:

```lua
MultiConditionNode = Class(BehaviourNode, function(self, start, continue, name)
    BehaviourNode._ctor(self, name or "Condition")
    self.start = start      -- Initial condition function
    self.continue = continue -- Continuing condition function
end)
```

**Behavior**: Uses `start` condition on first execution, then switches to `continue` condition for subsequent evaluations.

#### ConditionWaitNode

Waits until a condition becomes true:

```lua
ConditionWaitNode = Class(BehaviourNode, function(self, fn, name)
    BehaviourNode._ctor(self, name or "Wait")
    self.fn = fn  -- Function that returns boolean
end)
```

**Behavior**: Returns RUNNING until condition becomes true, then returns SUCCESS.

#### WaitNode

Waits for a specified duration:

```lua
WaitNode = Class(BehaviourNode, function(self, time)
    BehaviourNode._ctor(self, "Wait")
    self.wait_time = time  -- Duration to wait
end)
```

### Decorator Nodes

Decorator nodes modify the behavior of a single child node.

#### NotDecorator

Inverts the result of its child:

```lua
NotDecorator = Class(DecoratorNode, function(self, child)
    DecoratorNode._ctor(self, "Not", child)
end)
```

**Behavior**: SUCCESS becomes FAILED, FAILED becomes SUCCESS, RUNNING remains RUNNING.

#### FailIfRunningDecorator

Converts RUNNING status to FAILED:

```lua
FailIfRunningDecorator = Class(DecoratorNode, function(self, child)
    DecoratorNode._ctor(self, "FailIfRunning", child)
end)
```

#### FailIfSuccessDecorator

Converts SUCCESS status to FAILED:

```lua
FailIfSuccessDecorator = Class(DecoratorNode, function(self, child)
    DecoratorNode._ctor(self, "FailIfSuccess", child)
end)
```

### Special Nodes

#### EventNode

Responds to specific entity events:

```lua
EventNode = Class(BehaviourNode, function(self, inst, event, child, priority)
    BehaviourNode._ctor(self, "Event("..event..")", {child})
    self.inst = inst
    self.event = event
    self.priority = priority or 0
end)
```

**Behavior**: Triggers when specified event occurs, executes child node in response.

#### LatchNode

Prevents re-execution for a specified duration:

```lua
LatchNode = Class(BehaviourNode, function(self, inst, latchduration, child)
    BehaviourNode._ctor(self, "Latch ("..tostring(latchduration)..")", {child})
    self.latchduration = latchduration
end)
```

## Utility Functions

### WhileNode

Creates a parallel node that continuously checks a condition:

```lua
function WhileNode(cond, name, node)
    return ParallelNode{
        ConditionNode(cond, name),
        node
    }
end
```

**Usage**: Executes `node` while `cond` remains true. Interrupts immediately if condition fails.

### IfNode

Creates a sequence that executes only if a condition passes:

```lua
function IfNode(cond, name, node)
    return SequenceNode{
        ConditionNode(cond, name),
        node
    }
end
```

**Usage**: Executes `node` only after `cond` succeeds once. Condition not re-checked during execution.

### IfThenDoWhileNode

Advanced conditional execution with different start and continue conditions:

```lua
function IfThenDoWhileNode(ifcond, whilecond, name, node)
    return ParallelNode{
        MultiConditionNode(ifcond, whilecond, name),
        node
    }
end
```

## Implementation Examples

### Basic Mob Behavior

```lua
-- Simple mob that wanders and flees from players
local brain = BT(inst, 
    PriorityNode({
        -- High priority: flee from nearby players
        IfNode(function() return FindClosestPlayer(5) ~= nil end, 
               "See Player", 
               ActionNode(function() RunAway() end, "Flee")),
        
        -- Low priority: wander randomly  
        SequenceNode({
            WaitNode(math.random(2, 5)),
            ActionNode(function() WalkRandomly() end, "Wander")
        })
    })
)
```

### Event-Driven Behavior

```lua
-- Mob that responds to being attacked
local brain = BT(inst,
    PriorityNode({
        -- React to being attacked
        EventNode(inst, "attacked", 
            SequenceNode({
                ActionNode(function() TurnToAttacker() end, "Face Attacker"),
                ActionNode(function() CounterAttack() end, "Fight Back")
            }), 
            10), -- High priority
            
        -- Default behavior
        ActionNode(function() Idle() end, "Idle")
    })
)
```

### Complex State Machine

```lua
-- Advanced mob with multiple states
local brain = BT(inst,
    PriorityNode({
        -- Emergency: low health
        IfNode(function() return inst.components.health:GetPercent() < 0.3 end,
               "Low Health",
               ActionNode(function() FindHealing() end, "Seek Healing")),
        
        -- Combat: Start fighting if enemy seen, continue while able to fight
        IfThenDoWhileNode(
            function() return FindNearbyEnemy() ~= nil end,  -- Start condition
            function() return CanContinueFighting() end,     -- Continue condition
            "Combat State",
            SequenceNode({
                ActionNode(function() MoveToEnemy() end, "Approach"),
                ActionNode(function() Attack() end, "Attack"),
                WaitNode(1.0)  -- Attack cooldown
            })
        ),
        
        -- Maintenance: repair if damaged
        IfNode(function() return NeedsRepair() end,
               "Needs Repair", 
               ActionNode(function() DoRepair() end, "Repair")),
        
        -- Default: patrol area
        LoopNode({
            ActionNode(function() MoveToNextPoint() end, "Move"),
            WaitNode(2.0)
        }, 5)  -- Patrol 5 points then stop
    })
)
```

## Performance Optimization

### Sleep System

The behavior tree system includes sophisticated sleep mechanisms for performance:

```lua
-- Nodes can sleep to reduce CPU usage
function SomeExpensiveCheck()
    if expensive_condition() then
        return SUCCESS
    else
        -- Sleep for 1 second before checking again
        self:Sleep(1.0)
        return RUNNING
    end
end
```

### Priority-Based Updates

Priority nodes intelligently schedule re-evaluation:

```lua
-- Only re-evaluate priorities every 2 seconds
PriorityNode(children, 2.0)  -- Period = 2 seconds
```

## Debugging Support

### Tree Visualization

The system provides string representation for debugging:

```lua
-- Print current tree state
print(tostring(brain))

-- Output format shows node hierarchy with sleep times:
-- Priority>0.00
--    >Sequence - RUNNING <READY> ()
--       >Condition - SUCCESS <SUCCESS> ()
--       >Action - RUNNING <READY> (doing something)
--    >Wait - READY <READY> ()
```

### Node Identification

Each node has a unique ID for debugging tools:

```lua
-- Access node information
print("Node ID:", node.id)
print("Node Status:", node.status)
print("Last Result:", node.lastresult)
```

## Error Handling

### Graceful Failure

Nodes should handle errors gracefully:

```lua
ActionNode(function()
    if not inst:IsValid() then
        return FAILED
    end
    
    local success = DoAction()
    return success and SUCCESS or FAILED
end, "Safe Action")
```

### Resource Cleanup

Always implement proper cleanup in Stop methods:

```lua
function CustomNode:Stop()
    -- Clean up resources
    if self.timer then
        self.timer:Cancel()
        self.timer = nil
    end
    
    -- Call parent cleanup
    self._base.Stop(self)
end
```

## Integration with Game Systems

### Brain Component

Behavior trees integrate with the brain component:

```lua
-- Set up brain with behavior tree
local brain = require("brains/mybrain")
inst:AddComponent("locomotor")
inst:AddComponent("brain")
inst.components.brain:SetBrain(brain)
```

### Event System

EventNodes automatically integrate with the game's event system:

```lua
-- This will listen for "gohome" events
EventNode(inst, "gohome", 
    ActionNode(function() inst:GoHome() end, "Return Home"))
```

### Component Integration

Behavior trees commonly interact with entity components:

```lua
-- Example using various components
IfNode(function() 
    return inst.components.hunger:GetPercent() < 0.5 
end, "Hungry", 
ActionNode(function()
    local food = inst.components.inventory:FindItem(function(item)
        return item:HasTag("edible")
    end)
    if food then
        inst.components.eater:Eat(food)
    end
end, "Eat Food"))
```

## Best Practices

### Node Composition

- Keep individual nodes simple and focused
- Use composition over complex single nodes
- Prefer shallow trees over deep nesting
- Name nodes descriptively for debugging

### Performance Considerations

- Use appropriate sleep durations for expensive operations
- Implement proper sleep scheduling in custom nodes
- Avoid deep recursion in tree structures
- Cache expensive calculations when possible

### Maintainability

- Document complex behavior trees thoroughly
- Use meaningful names for conditions and actions
- Group related behaviors into reusable subtrees
- Implement proper error handling and cleanup

## Related Systems

- [Brains](../brains/index.md) - Pre-built behavior trees for specific entity types
- [Components](../components/index.md) - System components that behavior trees interact with
- [Actions](./actions.md) - Action system that behavior trees can trigger
- [State Graphs](../stategraphs/index.md) - Animation state machines that work alongside behavior trees

## Status: 🟢 Stable

The Behaviour Tree system is stable and actively used throughout the DST codebase for AI implementation. The API is considered mature and changes are rare.
