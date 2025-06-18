---
id: behavior-node
title: Behavior Node
sidebar_position: 1
last_updated: 2023-08-15
version: 624447
---
*Last Update: 2023-08-15*
# Behavior Node

*API Version: 624447*

The BehaviorNode is the base class for all behavior tree nodes in Don't Starve Together. It provides the foundation for AI decision-making through behavior trees, serving as the building block for all specialized node types.

## Behavior Node properties and methods

BehaviorNode provides the following key properties and methods:

- **Properties**
  - `name` - Descriptive name of the node
  - `status` - Current execution status
  - `children` - Child nodes (for nodes that support children)
  - `inst` - Entity instance that the node controls

- **Methods**
  - `Visit()` - Core execution method, runs the node's logic
  - `Start()` - Initializes the node before first execution
  - `Stop()` - Stops the node's execution
  - `Reset()` - Resets the node to its initial state

## Properties

### name: `string` `[readonly]`

A descriptive name for the node. Used primarily for debugging and logging.

```lua
-- Create a node with a descriptive name
local BehaviorNode = Class(function(self, name)
    self.name = name
    self.children = {}
    self.status = READY
end)

-- Access the node name
print("Currently executing node: " .. node.name)
```

---

### status: 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE' `[readonly]`

The current execution status of the node:

- **READY**: Node is ready to be executed
- **RUNNING**: Node is currently executing
- **SUCCESS**: Node has completed successfully
- **FAILURE**: Node has failed to complete

```lua
-- Check node status
if node.status == RUNNING then
    print("Node is still running")
elseif node.status == SUCCESS then
    print("Node completed successfully")
elseif node.status == FAILURE then
    print("Node failed")
end
```

---

### children: `Array<BehaviorNode>` `[readonly]`

List of child nodes for nodes that support children (like sequence and priority nodes).

```lua
-- Access children of a node
if #node.children > 0 then
    for i, child in ipairs(node.children) do
        print("Child " .. i .. ": " .. child.name)
    end
end
```

---

### inst: [Entity](entity.md) `[readonly]`

Reference to the entity that this behavior node is controlling.

```lua
-- Access the entity through the behavior node
local x, y, z = node.inst.Transform:GetWorldPosition()
```

---

## Methods

### Visit(): 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE'

The core execution method of a behavior node. This is where the node's logic is performed. It should return the node's status after execution.

```lua
function BehaviorNode:Visit()
    if self.status == READY then
        self.status = RUNNING
        -- Initialize node-specific logic
    end
    
    if self.status == RUNNING then
        -- Perform the node's behavior
        local result = self:DoAction()
        
        if result then
            self.status = SUCCESS
        else
            self.status = FAILURE
        end
    end
    
    return self.status
end
```

---

### Start(): `void`

Initializes the node before its first execution. Typically sets the status to RUNNING and performs any necessary setup.

```lua
function BehaviorNode:Start()
    self.status = RUNNING
    -- Perform any initialization logic
end
```

---

### Stop(): `void`

Stops the node's execution. Resets the status to READY and cleans up any resources.

```lua
function BehaviorNode:Stop()
    -- Perform any cleanup logic
    self.status = READY
end
```

---

### Reset(): `void`

Resets the node to its initial state. Similar to Stop, but may perform additional reset logic.

```lua
function BehaviorNode:Reset()
    self:Stop() -- Usually calls Stop
    -- Perform any additional reset logic
end
```

---

## Node Status Constants

BehaviorNode defines four status constants:

### 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE'

These constants represent the possible execution states of a behavior node.

```lua
-- Global behavior node status constants
READY = "READY"       -- Node is ready to execute
RUNNING = "RUNNING"   -- Node is currently executing
SUCCESS = "SUCCESS"   -- Node completed successfully
FAILURE = "FAILURE"   -- Node failed to complete
```

## Creating Custom Behavior Nodes

To create a custom behavior node, derive from the BehaviorNode class:

```lua
local MyCustomNode = Class(BehaviorNode, function(self, inst, param)
    BehaviorNode._ctor(self, "MyCustomNode")
    self.inst = inst
    self.param = param
end)

function MyCustomNode:Visit()
    if self.status == READY then
        self.status = RUNNING
    end
    
    if self.status == RUNNING then
        -- Custom logic here
        if SomeCondition(self.inst, self.param) then
            self.status = SUCCESS
        else
            self.status = FAILURE
        end
    end
    
    return self.status
end

function MyCustomNode:Stop()
    -- Custom cleanup
    self.status = READY
end

return MyCustomNode
```

## Usage in Behavior Trees

BehaviorNode is used as the base class for all nodes in behavior trees:

```lua
local root = PriorityNode({
    SequenceNode({
        ConditionNode(function() return HasTarget(inst) end),
        ChaseAndAttackNode(inst)
    }),
    SequenceNode({
        FindFoodNode(inst),
        EatFoodNode(inst)
    }),
    WanderNode(inst)
})

-- Use in a brain
function MyBrain:OnStart()
    self.bt = BT(self.inst, root)
end

function MyBrain:OnUpdate()
    self.bt:Update()
end
```

## Common Behavior Node Types

Several specialized behavior node types inherit from BehaviorNode:

- **ActionNode**: Executes a specific action
- **ConditionNode**: Evaluates a condition to determine success or failure
- **PriorityNode**: Tries child nodes in order until one succeeds
- **SequenceNode**: Executes child nodes in sequence until one fails or all succeed
- **DecoratorNode**: Modifies the behavior of another node

## Performance Considerations

- **Complexity**: The complexity of a behavior tree increases with the number of nodes
- **Depth**: Deep trees can be expensive to evaluate
- **Frequency**: Consider how often different parts of the tree need to be evaluated
- **Caching**: Cache results when possible to avoid redundant calculations
- **Early Returns**: Return early when a result is determined to avoid unnecessary processing

## See also

- [Brain](brain.md) - Brain component that uses behavior trees
- [Action Nodes](action-nodes.md) - Nodes that perform actions
- [Priority Nodes](priority-nodes.md) - Nodes that select between different options
- [Sequence Nodes](sequence-nodes.md) - Nodes that execute actions in sequence
- [Decorator Nodes](decorator-nodes.md) - Nodes that modify other nodes' behavior
- [Condition Nodes](condition-nodes.md) - Nodes that evaluate conditions
