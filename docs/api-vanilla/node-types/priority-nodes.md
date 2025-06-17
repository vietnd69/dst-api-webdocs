---
id: priority-nodes
title: Priority Nodes
sidebar_position: 5
last_updated: 2023-08-15
version: 624447
---
*Last Update: 2023-08-15*
# Priority Nodes

*API Version: 624447*

Priority Nodes are specialized behavior tree nodes in Don't Starve Together that execute child nodes in order of priority until one succeeds. They function as a logical "OR" operation, trying each child node in sequence and stopping at the first one that succeeds.

## PriorityNode properties and methods

PriorityNode provides the following key properties and methods:

- **Properties**
  - `inst` - Reference to the entity this node controls
  - `children` - List of child nodes in priority order
  - `period` - Time between re-evaluations in seconds
  - `lasttime` - Last evaluation timestamp
  - `status` - Current execution status of the node

- **Methods**
  - `Visit()` - Evaluates the node and its children
  - `Stop()` - Stops execution of this node and all children
  - `Reset()` - Resets this node and all children to READY state

## Properties

### inst: Entity `[readonly]`

A reference to the entity that this priority node is controlling.

```lua
-- Access the priority node's entity
local health = priority_node.inst.components.health
```

---

### children: `Array<BehaviorNode>` `[readonly]`

List of child nodes in priority order. Children are evaluated in the order they appear in this array, with earlier children having higher priority.

```lua
-- Create priority node with ordered children
local priority_node = PriorityNode(inst, {
    RunAway(inst, "character", 5, 8),  -- Highest priority: run away
    ChaseAndAttack(inst, 10),          -- Medium priority: attack
    Wander(inst)                       -- Lowest priority: wander
})

-- Access a specific child
local first_child = priority_node.children[1]
```

---

### period: number

Time in seconds between re-evaluations of the priority list. If a higher priority node becomes available during execution of a lower priority node, the priority node will wait until the next evaluation period before switching.

```lua
-- Create a priority node that re-evaluates every 0.5 seconds
local priority_node = PriorityNode(inst, {
    RunAway(inst, "character", 5, 8),
    ChaseAndAttack(inst, 10),
    Wander(inst)
}, 0.5)

-- Modify the period
priority_node.period = 1.0  -- Re-evaluate every second
```

---

### lasttime: number `[readonly]`

Timestamp of the last evaluation, used to determine when the next evaluation should occur based on the period.

```lua
-- Check when the last evaluation occurred
local time_since_last_eval = GetTime() - priority_node.lasttime
print("Time since last evaluation: " .. time_since_last_eval .. " seconds")
```

---

### status: 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE' `[readonly]`

The current execution status of the priority node:

- **READY**: Node is ready to begin evaluating children
- **RUNNING**: Node is currently executing one of its children
- **SUCCESS**: A child node has succeeded
- **FAILURE**: All child nodes have failed

```lua
-- Check the current status
if priority_node.status == SUCCESS then
    print("A child node succeeded")
elseif priority_node.status == FAILURE then
    print("All child nodes failed")
end
```

---

## Methods

### Visit(): 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE'

Evaluates the priority node by trying each child in order until one succeeds or all fail.

```lua
function PriorityNode:Visit()
    if self.status == READY then
        self.status = RUNNING
        self.lasttime = GetTime()
        
        -- Try to find a child that can run
        for i, child in ipairs(self.children) do
            child:Start()
            local status = child:Visit()
            
            if status == RUNNING or status == SUCCESS then
                self.current_child = i
                if status == SUCCESS then
                    self.status = SUCCESS
                end
                return self.status
            end
            
            child:Stop()
        end
        
        -- All children failed
        self.status = FAILURE
        return self.status
    end
    
    if self.status == RUNNING then
        -- Check if we should re-evaluate priorities
        local now = GetTime()
        if now - self.lasttime >= self.period then
            self.lasttime = now
            
            -- Try higher priority children first
            for i = 1, self.current_child - 1 do
                self.children[i]:Start()
                local status = self.children[i]:Visit()
                
                if status == RUNNING or status == SUCCESS then
                    -- Higher priority child can run, switch to it
                    self.children[self.current_child]:Stop()
                    self.current_child = i
                    if status == SUCCESS then
                        self.status = SUCCESS
                    end
                    return self.status
                end
                
                self.children[i]:Stop()
            end
        end
        
        -- Continue with current child
        local status = self.children[self.current_child]:Visit()
        
        if status ~= RUNNING then
            self.status = status
        end
    end
    
    return self.status
end
```

---

### Stop(): void

Stops execution of this priority node and all its children.

```lua
function PriorityNode:Stop()
    for i, child in ipairs(self.children) do
        child:Stop()
    end
    self.status = READY
    self.current_child = nil
end
```

---

### Reset(): void

Resets the priority node and all its children to READY state.

```lua
function PriorityNode:Reset()
    for i, child in ipairs(self.children) do
        child:Reset()
    end
    self.status = READY
    self.current_child = nil
end
```

---

## Built-in Priority Node Types

Don't Starve Together includes several pre-defined priority node types:

### PriorityNode(inst: Entity, children: `Array<BehaviorNode>`, period?: number): PriorityNode

The basic priority node that executes children in order until one succeeds or all fail.

- **inst**: Entity the node controls
- **children**: Array of child nodes in priority order
- **period**: (Optional) Time in seconds between re-evaluations

```lua
-- Create a priority node with three behaviors
local node = PriorityNode(inst, {
    RunAway(inst, "character", 5, 8),  -- Highest priority
    ChaseAndAttack(inst, 10),          -- Medium priority
    Wander(inst)                       -- Lowest priority
}, 0.5)  -- Re-evaluate priorities every 0.5 seconds
```

---

### BrainPriorityNode(inst: Entity, children: `Array<BehaviorNode>`, period?: number): PriorityNode

A priority node that's specifically designed for use in brain components. It works the same as a regular PriorityNode but includes additional brain-specific functionality.

- **inst**: Entity the node controls
- **children**: Array of child nodes in priority order
- **period**: (Optional) Time in seconds between re-evaluations

```lua
-- Create a brain priority node
local node = BrainPriorityNode(inst, {
    PanicBehavior(inst),
    CombatBehavior(inst),
    ForageBehavior(inst),
    IdleBehavior(inst)
}, 1.0)
```

---

## Common Priority Patterns

Here are some common patterns for using priority nodes:

### Survival Hierarchy

Organizing behaviors by survival importance:

```lua
-- Survival hierarchy with most important behaviors first
local behavior = PriorityNode(inst, {
    -- Emergency behaviors (highest priority)
    SequenceNode(inst, {
        ConditionNode(function() return inst.components.health:GetPercent() < 0.25 end),
        RunAway(inst, "character", 8, 12)
    }),
    
    -- Basic needs
    SequenceNode(inst, {
        ConditionNode(function() return inst.components.hunger:GetPercent() < 0.25 end),
        FindAndEatFood(inst)
    }),
    
    -- Opportunistic behaviors
    SequenceNode(inst, {
        ConditionNode(function() return inst.components.combat:CanTarget() end),
        ChaseAndAttack(inst, 10)
    }),
    
    -- Default behaviors (lowest priority)
    Wander(inst)
})
```

### State-Based Priorities

Switching between different behavior sets based on state:

```lua
-- Different priority sets based on time of day
local behavior = PriorityNode(inst, {
    -- Night-time behaviors
    SequenceNode(inst, {
        ConditionNode(function() return TheWorld.state.isnight end),
        PriorityNode(inst, {
            FindLightSource(inst),
            SleepBehavior(inst),
            StayNearHome(inst, 5)
        })
    }),
    
    -- Day-time behaviors
    PriorityNode(inst, {
        GatherResourcesBehavior(inst),
        ExploreBehavior(inst),
        Wander(inst)
    })
})
```

## Creating Custom Priority Nodes

To create a custom priority node with special behavior:

```lua
local CustomPriorityNode = Class(BehaviorNode, function(self, inst, children, period, custom_param)
    BehaviorNode._ctor(self, "CustomPriorityNode")
    self.inst = inst
    self.children = children
    self.period = period or 0
    self.lasttime = 0
    self.current_child = nil
    self.custom_param = custom_param
end)

function CustomPriorityNode:Visit()
    -- Custom priority logic here
    -- ...
    
    return self.status
end

function CustomPriorityNode:Stop()
    for i, child in ipairs(self.children) do
        child:Stop()
    end
    self.status = READY
    self.current_child = nil
end

-- Usage
local node = CustomPriorityNode(inst, {
    RunAway(inst, "character", 5, 8),
    ChaseAndAttack(inst, 10),
    Wander(inst)
}, 0.5, "custom value")
```

## Performance Considerations

- **Child Order**: Place the most likely to succeed nodes first to avoid unnecessary evaluations
- **Evaluation Period**: Use an appropriate period value - smaller values give more responsive behavior but use more CPU
- **Child Count**: Keep the number of children manageable; consider using sub-priority nodes for complex hierarchies
- **Condition Checks**: Use ConditionNode wrappers for expensive condition checks to avoid evaluating entire sub-trees
- **State Management**: Be careful with state transitions between different priority children

## See also

- [Brain](brain.md) - Brain component that uses behavior trees
- [Behavior Node](behavior-node.md) - Base class for all behavior tree nodes
- [Sequence Nodes](sequence-nodes.md) - Nodes that execute actions in sequence
- [Decorator Nodes](decorator-nodes.md) - Nodes that modify other nodes' behavior
- [Condition Nodes](condition-nodes.md) - Nodes that evaluate conditions
