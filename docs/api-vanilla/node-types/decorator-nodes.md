---
id: decorator-nodes
title: Decorator Nodes
sidebar_position: 4
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Decorator Nodes

*API Version: 619045*

Decorator Nodes are specialized behavior tree nodes that modify the behavior of other nodes. They typically wrap a single child node and either change its execution behavior, modify its return value, or control when and how it runs. Decorator nodes are a powerful tool for creating complex behaviors without needing to create entirely new node types.

## Decorator Node properties and methods

Decorator Nodes provide the following key properties and methods:

- **Properties**
  - `inst` - Reference to the entity this node controls
  - `child` - The behavior node being decorated
  - `status` - Current execution status of the node

- **Methods**
  - `Visit()` - Evaluates the decorator and its child node
  - `Stop()` - Stops execution of this node and its child
  - `Reset()` - Resets this node and its child to READY state

## Properties

### inst: Entity `[readonly]`

A reference to the entity that this decorator node is controlling.

```lua
-- Access the decorator node's entity
local health = decorator_node.inst.components.health
```

---

### child: BehaviorNode `[readonly]`

The behavior node that this decorator is modifying.

```lua
-- Create a decorator node with a child
local decorator_node = NotDecorator(inst, Wander(inst))

-- Access the child node
local child_node = decorator_node.child
```

---

### status: 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE' `[readonly]`

The current execution status of the decorator node:

- **READY**: Node is ready to begin execution
- **RUNNING**: Node is currently executing
- **SUCCESS**: Node has completed successfully
- **FAILURE**: Node has failed to complete

```lua
-- Check the current status
if decorator_node.status == SUCCESS then
    print("Decorator node completed successfully")
elseif decorator_node.status == FAILURE then
    print("Decorator node failed")
end
```

---

## Methods

### Visit(): 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE'

Evaluates the decorator node and its child. The specific behavior depends on the type of decorator.

```lua
function DecoratorNode:Visit()
    if self.status == READY then
        self.status = RUNNING
        self.child:Start()
    end
    
    if self.status == RUNNING then
        local status = self.child:Visit()
        
        -- Decorator-specific logic here
        -- This is where the decorator modifies the child's behavior
        
        if status ~= RUNNING then
            self.status = self:ProcessChildResult(status)
        end
    end
    
    return self.status
end
```

---

### Stop(): void

Stops execution of this decorator node and its child.

```lua
function DecoratorNode:Stop()
    self.child:Stop()
    self.status = READY
end
```

---

### Reset(): void

Resets the decorator node and its child to READY state.

```lua
function DecoratorNode:Reset()
    self.child:Reset()
    self.status = READY
end
```

---

## Built-in Decorator Node Types

Don't Starve Together includes several pre-defined decorator node types:

### NotDecorator(inst: Entity, child: BehaviorNode): DecoratorNode

Inverts the result of its child node - SUCCESS becomes FAILURE and vice versa.

- **inst**: Entity the node controls
- **child**: The behavior node to invert

```lua
-- Invert a condition result
local node = NotDecorator(inst, 
    ConditionNode(function() return inst.components.hunger:GetPercent() < 0.5 end)
)
-- Now succeeds when hunger is >= 50% instead of < 50%
```

---

### FailIfRunningDecorator(inst: Entity, child: BehaviorNode): DecoratorNode

Converts RUNNING status to FAILURE, useful for nodes that need immediate results.

- **inst**: Entity the node controls
- **child**: The behavior node to modify

```lua
-- Fail immediately if can't complete in one step
local node = FailIfRunningDecorator(inst, 
    FindFood(inst)
)
```

---

### SuccessIfRunningDecorator(inst: Entity, child: BehaviorNode): DecoratorNode

Converts RUNNING status to SUCCESS, useful for fire-and-forget behaviors.

- **inst**: Entity the node controls
- **child**: The behavior node to modify

```lua
-- Consider it a success as soon as it starts
local node = SuccessIfRunningDecorator(inst, 
    ChaseAndAttack(inst, 10)
)
```

---

### LoopDecorator(inst: Entity, child: BehaviorNode, max_loops?: number): DecoratorNode

Repeatedly executes its child node until it fails or reaches the maximum loop count.

- **inst**: Entity the node controls
- **child**: The behavior node to loop
- **max_loops**: (Optional) Maximum number of times to loop

```lua
-- Repeat an action up to 5 times
local node = LoopDecorator(inst, 
    DoAction(inst, function() 
        -- Do something
        return true
    end),
    5 -- Maximum 5 loops
)
```

---

### WhileNode(inst: Entity, cond_fn: Function, child: BehaviorNode): DecoratorNode

Executes its child node repeatedly as long as a condition function returns true.

- **inst**: Entity the node controls
- **cond_fn**: Condition function that returns true/false
- **child**: The behavior node to execute while condition is true

```lua
-- Keep eating food while hungry
local node = WhileNode(inst, 
    function() return inst.components.hunger:GetPercent() < 0.9 end,
    EatFood(inst)
)
```

---

### RandomNode(nodes: `Array<{chance: number, node: BehaviorNode}>`): DecoratorNode

Randomly selects from its children nodes, based on weighted probabilities.

- **nodes**: Array of objects with chance (weight) and node properties

```lua
-- Random behavior selection
local node = RandomNode(
    {0.6, Wander(inst)},
    {0.3, DoAction(inst, EatFood)},
    {0.1, RunAway(inst, "character", 5, 8)}
)
```

---

## Common Decorator Patterns

Here are some common ways to use decorator nodes in Don't Starve Together AI:

### Timers and Cooldowns

A decorator that only executes its child after a cooldown period:

```lua
-- Run a behavior only every X seconds
local TimerDecorator = Class(BehaviorNode, function(self, inst, child, cooldown_time)
    BehaviorNode._ctor(self, "TimerDecorator")
    self.inst = inst
    self.child = child
    self.cooldown_time = cooldown_time
    self.last_execution = 0
end)

function TimerDecorator:Visit()
    if self.status == READY then
        -- Check if cooldown has passed
        if (GetTime() - self.last_execution) >= self.cooldown_time then
            self.status = RUNNING
            self.child:Start()
        else
            self.status = FAILURE
            return self.status
        end
    end
    
    if self.status == RUNNING then
        local status = self.child:Visit()
        
        if status ~= RUNNING then
            self.last_execution = GetTime()
            self.status = status
        end
    end
    
    return self.status
end
```

### Condition Limiters

A decorator that only executes its child if a condition is met:

```lua
-- Only execute child node if condition is true
local ConditionalDecorator = Class(BehaviorNode, function(self, inst, child, cond_fn)
    BehaviorNode._ctor(self, "ConditionalDecorator")
    self.inst = inst
    self.child = child
    self.cond_fn = cond_fn
end)

function ConditionalDecorator:Visit()
    if self.status == READY then
        if self.cond_fn(self.inst) then
            self.status = RUNNING
            self.child:Start()
        else
            self.status = FAILURE
            return self.status
        end
    end
    
    if self.status == RUNNING then
        local status = self.child:Visit()
        
        if status ~= RUNNING then
            self.status = status
        end
    end
    
    return self.status
end
```

### Retry Mechanics

A decorator that retries its child multiple times until success:

```lua
-- Try the child node multiple times until success
local RetryDecorator = Class(BehaviorNode, function(self, inst, child, max_attempts)
    BehaviorNode._ctor(self, "RetryDecorator")
    self.inst = inst
    self.child = child
    self.max_attempts = max_attempts
    self.attempts = 0
end)

function RetryDecorator:Visit()
    if self.status == READY then
        self.attempts = 0
        self.status = RUNNING
    end
    
    if self.status == RUNNING then
        if self.attempts >= self.max_attempts then
            self.status = FAILURE
            return self.status
        end
        
        if self.child.status ~= RUNNING then
            self.child:Start()
        end
        
        local status = self.child:Visit()
        
        if status == SUCCESS then
            self.status = SUCCESS
        elseif status == FAILURE then
            self.attempts = self.attempts + 1
            self.child:Stop()
            -- Let it try again in the next Visit
        end
    end
    
    return self.status
end
```

## Creating Custom Decorator Nodes

To create a custom decorator node:

### 1. Derive from BehaviorNode

```lua
local CustomDecorator = Class(BehaviorNode, function(self, inst, child, ...)
    BehaviorNode._ctor(self, "CustomDecorator")
    self.inst = inst
    self.child = child
    -- Store other parameters
end)
```

### 2. Implement Visit function

```lua
function CustomDecorator:Visit()
    if self.status == READY then
        self.status = RUNNING
        self.child:Start()
    end
    
    if self.status == RUNNING then
        local status = self.child:Visit()
        
        -- Here is where you implement your decorator logic
        -- to modify the behavior of the child node
        
        if status ~= RUNNING then
            -- Handle completion
            self.status = self:ProcessChildResult(status)
        end
    end
    
    return self.status
end
```

### 3. Implement Stop and Reset functions

```lua
function CustomDecorator:Stop()
    self.child:Stop()
    self.status = READY
end

function CustomDecorator:Reset()
    self.child:Reset()
    self.status = READY
end
```

## Example: Probability Decorator

A decorator that has a percentage chance of executing its child node:

```lua
local ProbabilityDecorator = Class(BehaviorNode, function(self, inst, child, chance)
    BehaviorNode._ctor(self, "ProbabilityDecorator")
    self.inst = inst
    self.child = child
    self.chance = math.clamp(chance, 0, 1) -- Probability between 0 and 1
end)

function ProbabilityDecorator:Visit()
    if self.status == READY then
        if math.random() <= self.chance then
            self.status = RUNNING
            self.child:Start()
        else
            self.status = FAILURE
            return self.status
        end
    end
    
    if self.status == RUNNING then
        local status = self.child:Visit()
        
        if status ~= RUNNING then
            self.status = status
        end
    end
    
    return self.status
end

function ProbabilityDecorator:Stop()
    self.child:Stop()
    self.status = READY
end

-- Usage example
local behavior = PriorityNode(
{
    -- 50% chance to run away when health is low
    ProbabilityDecorator(
        IfNode(function() return inst.components.health:GetPercent() < 0.3 end,
            RunAway(inst, "character", 5, 8)
        ),
        0.5
    ),
    -- Default behavior
    Wander(inst)
}, 0.5)
```

## Example: Tracking Decorator

A decorator that logs success/failure statistics:

```lua
local TrackingDecorator = Class(BehaviorNode, function(self, inst, child, name)
    BehaviorNode._ctor(self, "TrackingDecorator")
    self.inst = inst
    self.child = child
    self.name = name or "unnamed"
    self.success_count = 0
    self.failure_count = 0
    self.last_status = nil
end)

function TrackingDecorator:Visit()
    if self.status == READY then
        self.status = RUNNING
        self.child:Start()
    end
    
    if self.status == RUNNING then
        local status = self.child:Visit()
        
        if status ~= RUNNING then
            if status == SUCCESS then
                self.success_count = self.success_count + 1
            elseif status == FAILURE then
                self.failure_count = self.failure_count + 1
            end
            
            self.last_status = status
            self.status = status
            
            -- Log statistics
            print(string.format("[%s] Success: %d, Failure: %d, Last Status: %s", 
                self.name, self.success_count, self.failure_count, 
                status == SUCCESS and "SUCCESS" or "FAILURE"))
        end
    end
    
    return self.status
end

function TrackingDecorator:GetStats()
    return {
        name = self.name,
        success = self.success_count,
        failure = self.failure_count,
        total = self.success_count + self.failure_count,
        success_rate = self.success_count / 
            (self.success_count + self.failure_count > 0 and 
             (self.success_count + self.failure_count) or 1)
    }
end
```

## Performance Considerations

- Decorator nodes add an extra layer of function calls, so use them judiciously
- Prefer built-in decorator nodes when available for better performance
- Consider consolidating multiple decorators into a single custom decorator when possible
- Avoid deeply nested chains of decorators if performance is critical
- Use tracking decorators during development but remove them for production

## See also

- [Brain](brain.md) - For brain implementation using behavior trees
- [Action Nodes](action-nodes.md) - For nodes that perform actions
- [Priority Nodes](priority-nodes.md) - For selecting between different actions
- [Condition Nodes](condition-nodes.md) - For conditional execution
- [Sequence Nodes](sequence-nodes.md) - For executing actions in sequence
