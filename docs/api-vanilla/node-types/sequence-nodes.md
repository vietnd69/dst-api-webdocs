---
id: sequence-nodes
title: Sequence Nodes
sidebar_position: 6
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Sequence Nodes

*API Version: 619045*

Sequence Nodes are essential components in Don't Starve Together's behavior tree system that execute child nodes in order until one fails or all succeed. They act as a logical "AND" operation, executing each child node sequentially and only succeeding if all children succeed.

## Sequence Node properties and methods

Sequence Nodes provide the following key properties and methods:

- **Properties**
  - `inst` - Reference to the entity this node controls
  - `children` - Array of child nodes to execute in sequence
  - `current_child` - Index of the currently executing child node
  - `status` - Current execution status of the node

- **Methods**
  - `Visit()` - Evaluates the sequence node and its children
  - `Stop()` - Stops execution of this node and all children
  - `Reset()` - Resets this node and all children to READY state

## Properties

### inst: Entity `[readonly]`

A reference to the entity that this sequence node is controlling.

```lua
-- Access the sequence node's entity
local health = sequence_node.inst.components.health
```

---

### children: `Array<BehaviorNode>` `[readonly]`

List of child nodes to execute in sequence. Children are executed in the order they appear in this array.

```lua
-- Create sequence node with ordered steps
local sequence_node = SequenceNode(inst, {
    FindFood(inst),         -- First find food
    GoToFood(inst),         -- Then go to it
    EatFood(inst)           -- Finally eat it
})

-- Access a specific child
local first_child = sequence_node.children[1]
```

---

### current_child: number `[readonly]`

Index of the currently executing child node in the children array. This value starts at 1 and increments as each child succeeds.

```lua
-- Check which step we're on
print("Currently executing step " .. sequence_node.current_child .. " of " .. #sequence_node.children)
```

---

### status: 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE' `[readonly]`

The current execution status of the sequence node:

- **READY**: Node is ready to begin executing children
- **RUNNING**: Node is currently executing one of its children
- **SUCCESS**: All child nodes have executed successfully
- **FAILURE**: One of the child nodes has failed

```lua
-- Check the current status
if sequence_node.status == SUCCESS then
    print("All sequence steps completed successfully")
elseif sequence_node.status == FAILURE then
    print("Sequence failed at step " .. sequence_node.current_child)
end
```

---

## Methods

### Visit(): 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE'

Evaluates the sequence node by executing children in order until one fails or all succeed.

```lua
function MySequence:Visit()
    if self.status == READY then
        self.status = RUNNING
        self.current_child = 1
        self.children[self.current_child]:Start()
    end

    if self.status == RUNNING then
        local status = self.children[self.current_child]:Visit()
        
        if status == SUCCESS then
            -- This child succeeded, move to next one
            self.current_child = self.current_child + 1
            
            if self.current_child <= #self.children then
                -- Start the next child
                self.children[self.current_child]:Start()
            else
                -- All children succeeded
                self.status = SUCCESS
            end
        elseif status == FAILURE then
            -- As soon as one child fails, the whole sequence fails
            self.status = FAILURE
        end
    end
    
    return self.status
end
```

---

### Stop(): void

Stops execution of this sequence node and all its children.

```lua
function MySequence:Stop()
    for i = 1, #self.children do
        self.children[i]:Stop()
    end
    self.status = READY
    self.current_child = 1
end
```

---

### Reset(): void

Resets the sequence node and all its children to READY state.

```lua
function MySequence:Reset()
    for i = 1, #self.children do
        self.children[i]:Reset()
    end
    self.status = READY
    self.current_child = 1
end
```

---

## States

SequenceNode can be in one of four states:

### 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE'

- **READY**: Node is ready to begin execution
- **RUNNING**: Node is currently executing a child node
- **SUCCESS**: All child nodes have executed successfully
- **FAILURE**: A child node has failed, stopping execution

```lua
-- Check current sequence status
if sequence_node.status == SUCCESS then
    print("Entire sequence completed successfully")
elseif sequence_node.status == FAILURE then
    print("Sequence failed during execution")
end
```

## Built-in Sequence Nodes

Don't Starve Together includes several pre-defined sequence nodes:

### SequenceNode(inst: Entity, children: `Array<BehaviorNode>`): SequenceNode

The basic sequence node that executes children in order until one fails or all succeed.

- **inst**: Entity the node controls
- **children**: Array of child nodes to execute in sequence

```lua
-- Find, go to, and eat food
local node = SequenceNode(inst, {
    FindFood(inst, {"fruit", "veggie"}, 20),
    GoToEntity(inst, function() return inst.components.eater.foodtarget end, 1),
    DoAction(inst, function(inst) 
        return inst.components.eater:Eat(inst.components.eater.foodtarget)
    end)
})
```

---

### DoWhileNode(inst: Entity, condition_fn: Function, children: `Array<BehaviorNode>`): SequenceNode

Executes a sequence of nodes while a condition remains true.

- **inst**: Entity the node controls
- **condition_fn**: Function that returns true or false
- **children**: Array of child nodes to execute in sequence

```lua
-- Keep gathering resources while inventory has space
local node = DoWhileNode(inst, 
    function() 
        -- Continue while inventory has space
        return not inst.components.inventory:IsFull() 
    end, 
    {
        FindItem(inst, function(item) return item.prefab == "log" end, 10),
        DoAction(inst, function(inst) 
            if inst.finditem then
                return BufferedAction(inst, inst.finditem, ACTIONS.PICKUP)
            end
        end)
    }
)
```

---

### ParallelNodeAny(inst: Entity, children: `Array<BehaviorNode>`): SequenceNode

Executes multiple nodes in parallel and succeeds if any child succeeds.

- **inst**: Entity the node controls
- **children**: Array of child nodes to execute in parallel

```lua
-- Try multiple ways to get food in parallel
local node = ParallelNodeAny(inst, {
    -- Try to find dropped food
    SequenceNode(inst, {
        FindItem(inst, function(item) 
            return item.components.edible ~= nil 
        end, 15),
        DoAction(inst, function(inst) 
            if inst.finditem then
                return BufferedAction(inst, inst.finditem, ACTIONS.PICKUP)
            end
        end)
    }),
    -- Or try to harvest berry bushes
    SequenceNode(inst, {
        FindEntity(inst, 15, function(ent)
            return ent.prefab == "berrybush" and 
                   ent.components.pickable and 
                   ent.components.pickable:CanBePicked()
        end),
        DoAction(inst, function(inst) 
            if inst.findentity then
                return BufferedAction(inst, inst.findentity, ACTIONS.PICK)
            end
        end)
    })
})
```

---

### ParallelNodeAll(inst: Entity, children: `Array<BehaviorNode>`): SequenceNode

Executes multiple nodes in parallel and only succeeds if all children succeed.

- **inst**: Entity the node controls
- **children**: Array of child nodes to execute in parallel

```lua
-- Track multiple conditions simultaneously
local node = ParallelNodeAll(inst, {
    -- Monitor health
    DoAction(inst, function() 
        return inst.components.health:GetPercent() > 0.25 
    end),
    -- Monitor sanity
    DoAction(inst, function() 
        return inst.components.sanity:GetPercent() > 0.25
    end),
    -- Monitor hunger
    DoAction(inst, function() 
        return inst.components.hunger:GetPercent() > 0.15
    end)
})
```

---

## Common Sequence Patterns

Sequence nodes are often used for these common patterns:

### Multi-step Actions

Breaking a complex task into sequential steps:

```lua
-- Break a task into sequential steps
SequenceNode(inst, {
    -- First find a tree
    FindEntity(inst, 20, function(ent) 
        return ent.prefab == "evergreen" and 
               ent.components.workable and 
               ent.components.workable:CanBeWorked() 
    end),
    
    -- Go to the tree
    GoToEntity(inst, function() return inst.findentity end, 1),
    
    -- Chop the tree
    DoAction(inst, function(inst) 
        if inst.findentity then
            return BufferedAction(inst, inst.findentity, ACTIONS.CHOP)
        end
    end),
    
    -- Wait for the tree to fall
    WaitNode(inst, 1),
    
    -- Pick up the logs
    FindItem(inst, function(item) return item.prefab == "log" end, 10),
    DoAction(inst, function(inst) 
        if inst.finditem then
            return BufferedAction(inst, inst.finditem, ACTIONS.PICKUP)
        end
    end)
})
```

### Validation Chains

Checking multiple conditions before taking action:

```lua
-- Check multiple conditions before taking action
SequenceNode(inst, {
    -- Check if it's safe (no monsters nearby)
    DoAction(inst, function()
        local x, y, z = inst.Transform:GetWorldPosition()
        local ents = TheSim:FindEntities(x, y, z, 10, {"monster"})
        return #ents == 0
    end),
    
    -- Check if we have the right tool
    DoAction(inst, function()
        return inst.components.inventory:Has("axe", 1)
    end),
    
    -- Check if our health is high enough
    DoAction(inst, function()
        return inst.components.health:GetPercent() > 0.5
    end),
    
    -- If all checks pass, perform the main action
    DoAction(inst, function() 
        -- Do the actual task
        return true
    end)
})
```

## Creating Custom Sequence Nodes

To create a custom sequence node:

### 1. Derive from BehaviorNode

```lua
local CustomSequence = Class(BehaviorNode, function(self, inst, children, ...)
    BehaviorNode._ctor(self, "CustomSequence")
    self.inst = inst
    self.children = children
    self.current_child = 1
    -- Store other parameters
end)
```

### 2. Implement Visit function

```lua
function CustomSequence:Visit()
    if self.status == READY then
        self.status = RUNNING
        self.current_child = 1
        self.children[self.current_child]:Start()
    end
    
    if self.status == RUNNING then
        local status = self.children[self.current_child]:Visit()
        
        -- Implement custom sequence logic here
        -- Decide how to handle SUCCESS and FAILURE of children
        -- Update self.current_child as needed
    end
    
    return self.status
end
```

### 3. Implement Stop function

```lua
function CustomSequence:Stop()
    for i = 1, #self.children do
        self.children[i]:Stop()
    end
    self.status = READY
    self.current_child = 1
end
```

## Example: Interruptible Sequence

A sequence node that can be interrupted by a condition:

```lua
local InterruptibleSequence = Class(BehaviorNode, function(self, inst, children, interrupt_fn)
    BehaviorNode._ctor(self, "InterruptibleSequence")
    self.inst = inst
    self.children = children
    self.interrupt_fn = interrupt_fn
    self.current_child = 1
end)

function InterruptibleSequence:Visit()
    if self.status == READY then
        self.status = RUNNING
        self.current_child = 1
        self.children[self.current_child]:Start()
    end
    
    if self.status == RUNNING then
        -- Check interrupt condition first
        if self.interrupt_fn and self.interrupt_fn(self.inst) then
            -- Interrupt the sequence
            self.status = FAILURE
            return self.status
        end
        
        local status = self.children[self.current_child]:Visit()
        
        if status == SUCCESS then
            -- This child succeeded, move to next one
            self.current_child = self.current_child + 1
            
            if self.current_child <= #self.children then
                -- Start the next child
                self.children[self.current_child]:Start()
            else
                -- All children succeeded
                self.status = SUCCESS
            end
        elseif status == FAILURE then
            -- As soon as one child fails, the whole sequence fails
            self.status = FAILURE
        end
    end
    
    return self.status
end

function InterruptibleSequence:Stop()
    for i = 1, #self.children do
        self.children[i]:Stop()
    end
    self.status = READY
end

-- Usage
local behavior = InterruptibleSequence(inst,
    {
        FindFood(inst),
        GoToFood(inst),
        EatFood(inst)
    },
    function(inst)
        -- Interrupt if health gets too low or a monster appears
        return inst.components.health:GetPercent() < 0.2 or
               FindEntity(inst, 10, {"monster"}) ~= nil
    end
)
```

## Example: Retry Sequence

A sequence node that retries failed children a certain number of times:

```lua
local RetrySequence = Class(BehaviorNode, function(self, inst, children, max_retries)
    BehaviorNode._ctor(self, "RetrySequence")
    self.inst = inst
    self.children = children
    self.max_retries = max_retries or 3
    self.current_child = 1
    self.retry_count = 0
end)

function RetrySequence:Visit()
    if self.status == READY then
        self.status = RUNNING
        self.current_child = 1
        self.retry_count = 0
        self.children[self.current_child]:Start()
    end
    
    if self.status == RUNNING then
        local status = self.children[self.current_child]:Visit()
        
        if status == SUCCESS then
            -- This child succeeded, move to next one
            self.current_child = self.current_child + 1
            self.retry_count = 0
            
            if self.current_child <= #self.children then
                -- Start the next child
                self.children[self.current_child]:Start()
            else
                -- All children succeeded
                self.status = SUCCESS
            end
        elseif status == FAILURE then
            -- Child failed, try to retry
            self.retry_count = self.retry_count + 1
            
            if self.retry_count <= self.max_retries then
                -- Retry the current child
                self.children[self.current_child]:Stop()
                self.children[self.current_child]:Start()
            else
                -- Max retries exceeded, the sequence fails
                self.status = FAILURE
            end
        end
    end
    
    return self.status
end

function RetrySequence:Stop()
    for i = 1, #self.children do
        self.children[i]:Stop()
    end
    self.status = READY
    self.retry_count = 0
end

-- Usage
local behavior = RetrySequence(inst,
    {
        FindFood(inst),
        GoToFood(inst),
        EatFood(inst)
    },
    2 -- Try each step up to 2 additional times if it fails
)
```

## Performance Considerations

- **Child Order**: Arrange children so that the ones most likely to fail come first, to minimize wasted processing
- **Node Count**: Keep the number of children in a sequence manageable; consider breaking complex sequences into sub-sequences
- **State Management**: Be careful with managing state across sequence steps to prevent side effects
- **Error Handling**: Consider using custom sequence nodes with retry capabilities for critical operations
- **Runtime Costs**: Be aware that deeply nested sequences can have significant runtime costs

## See also

- [Brain](brain.md) - For brain implementation using behavior trees
- [Action Nodes](action-nodes.md) - For nodes that perform actions
- [Priority Nodes](priority-nodes.md) - For selecting between different actions
- [Condition Nodes](condition-nodes.md) - For conditional execution
- [Decorator Nodes](decorator-nodes.md) - For modifying the behavior of other nodes
