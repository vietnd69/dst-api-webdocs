---
id: behavior-tree
title: Behavior Tree
sidebar_position: 2
last_updated: 2023-08-15
version: 624447
---
*Last Update: 2023-08-15*
# Behavior Tree

*API Version: 624447*

The Behavior Tree (BT) is a core AI decision-making structure in Don't Starve Together that organizes nodes into hierarchical trees. It manages the execution of behavior nodes to determine entity actions based on conditions and priorities.

## Behavior Tree properties and methods

Behavior Tree provides the following key properties and methods:

- **Properties**
  - `inst` - Reference to the entity this tree controls
  - `root` - Root node of the behavior tree
  - `currentnode` - The node currently being executed
  - `lastresult` - Result of the last tree evaluation

- **Methods**
  - `Update()` - Evaluates the behavior tree to determine actions
  - `Reset()` - Resets the tree to its initial state
  - `Stop()` - Stops the tree's execution
  - `GetTreeString()` - Returns a string representation of the tree structure

## Properties

### inst: [Entity](entity.md) `[readonly]`

A reference to the entity that this behavior tree is controlling.

```lua
-- Access the behavior tree's entity
local health = behaviorTree.inst.components.health
```

---

### root: [BehaviorNode](behavior-node.md) `[readonly]`

The root node of the behavior tree. This is typically a PriorityNode or SequenceNode that forms the starting point for evaluating the tree.

```lua
-- Create a behavior tree with a root node
local root = PriorityNode(inst, {
    FindFoodNode(inst),
    WanderNode(inst)
})
local behaviorTree = BehaviorTree(inst, root)
```

---

### currentnode: [BehaviorNode](behavior-node.md) `[readonly]`

The node currently being executed in the behavior tree. Updated during tree evaluation.

```lua
-- Check which node is currently active
if behaviorTree.currentnode then
    print("Currently executing: " .. behaviorTree.currentnode.name)
end
```

---

### lastresult: 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE' `[readonly]`

Result of the last tree evaluation. One of READY, RUNNING, SUCCESS, or FAILURE.

```lua
-- Check the last result of the behavior tree update
if behaviorTree.lastresult == RUNNING then
    print("Behavior tree is still running")
elseif behaviorTree.lastresult == SUCCESS then
    print("Behavior tree evaluation succeeded")
elseif behaviorTree.lastresult == FAILURE then
    print("Behavior tree evaluation failed")
end
```

---

## Methods

### Update(): 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE'

Evaluates the behavior tree by visiting the root node and progressing through the tree based on node results. This is typically called each frame or on a schedule for AI-controlled entities.

```lua
function BehaviorTree:Update()
    if not self.root then 
        return FAILURE 
    end

    -- If the tree hasn't started yet, start at the root
    if not self.currentnode then
        self.root:Start()
        self.currentnode = self.root
    end

    -- Visit the current node and get result
    local result = self.currentnode:Visit()
    
    -- If we've reached a terminal state, reset the current node
    if result ~= RUNNING then
        self.currentnode = nil
    end
    
    self.lastresult = result
    return result
end
```

---

### Reset(): `void`

Resets the behavior tree to its initial state, clearing the current node and last result.

```lua
function BehaviorTree:Reset()
    if self.root then
        self.root:Reset()
    end
    self.currentnode = nil
    self.lastresult = nil
end
```

---

### Stop(): `void`

Stops the behavior tree's execution, resetting the current node.

```lua
function BehaviorTree:Stop()
    if self.root then
        self.root:Stop()
    end
    self.currentnode = nil
end
```

---

### GetTreeString(): `string`

Returns a string representation of the tree structure, useful for debugging and visualization.

```lua
function BehaviorTree:GetTreeString()
    if not self.root then 
        return "Empty Tree" 
    end
    
    return self:FormatNodeString(self.root, 0)
end

function BehaviorTree:FormatNodeString(node, depth)
    local indent = string.rep("  ", depth)
    local result = indent .. node.name
    
    if node.children then
        for _, child in ipairs(node.children) do
            result = result .. "\n" .. self:FormatNodeString(child, depth + 1)
        end
    end
    
    return result
end

-- Usage:
print(behaviorTree:GetTreeString())
```

---

## Behavior Tree Construction

Behavior trees are constructed by composing various node types:

```lua
local function CreateBehaviorTree(inst)
    return BehaviorTree(inst, 
        PriorityNode({
            -- Flee from danger
            SequenceNode({
                ConditionNode(function() return IsInDanger(inst) end),
                RunAwayNode(inst, "danger", 20, 30)
            }),
            
            -- Get food when hungry
            SequenceNode({
                ConditionNode(function() return IsHungry(inst) end),
                FindFoodNode(inst),
                EatFoodNode(inst)
            }),
            
            -- Default: explore and wander
            PriorityNode({
                ExploreNode(inst),
                WanderNode(inst)
            })
        })
    )
end
```

## Common Tree Structures

Here are some common behavior tree structures used in Don't Starve Together:

### Basic Priority Structure

```lua
PriorityNode({
    EmergencyBehaviorNode(inst),    -- Highest priority
    NeedsBehaviorNode(inst),        -- Medium priority
    WantsBehaviorNode(inst),        -- Low priority
    IdleBehaviorNode(inst)          -- Fallback behavior
})
```

### Sequence with Conditions

```lua
SequenceNode({
    ConditionNode(inst, CheckConditionFunction),
    ActionNode1(inst),
    ActionNode2(inst),
    ActionNode3(inst)
})
```

### Parallel Processing

```lua
ParallelNode({
    MonitorHealthNode(inst),
    MonitorHungerNode(inst),
    MainBehaviorTree(inst)
})
```

## Integration with Brain

Behavior trees are typically used within a Brain component:

```lua
require "behaviortree"

local MyBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
    
    -- Create the behavior tree
    local root = PriorityNode({
        CombatBehavior(inst),
        ForagingBehavior(inst),
        IdleBehavior(inst)
    })
    
    self.bt = BehaviorTree(inst, root)
end)

function MyBrain:OnStart()
    -- Initialize brain state
end

function MyBrain:OnUpdate()
    -- Update the behavior tree
    if self.bt then
        self.bt:Update()
    end
end

return MyBrain
```

## Debugging Behavior Trees

To debug behavior trees:

```lua
-- Print the structure of a behavior tree
function DebugPrintTree(tree)
    print(tree:GetTreeString())
end

-- Monitor the active node during execution
function MonitorActiveNode(tree)
    if tree.currentnode then
        print("Active node: " .. tree.currentnode.name)
        print("Status: " .. tree.lastresult)
    else
        print("No active node")
    end
end

-- Add a debugging decorator to any node
function DebugDecorator(node, name)
    return DecoratorNode(function(child)
        local status = child:Visit()
        print(name .. " returned " .. status)
        return status
    end, node)
end
```

## Performance Considerations

- **Tree Depth**: Keep behavior trees reasonably shallow to prevent performance issues
- **Evaluation Frequency**: Consider different update frequencies for different parts of the tree
- **Caching**: Cache expensive condition checks where appropriate
- **Node Count**: Keep the number of nodes manageable for better performance
- **Reusable Subtrees**: Create reusable behavior subtrees for common behaviors

## See also

- [Brain](brain.md) - Brain component that uses behavior trees
- [Behavior Node](behavior-node.md) - Base class for all behavior tree nodes
- [Priority Nodes](priority-nodes.md) - Nodes that select between different actions
- [Condition Nodes](condition-nodes.md) - Nodes that evaluate conditions
- [Sequence Nodes](sequence-nodes.md) - Nodes that execute actions in sequence
- [Decorator Nodes](decorator-nodes.md) - Nodes that modify other nodes' behavior
