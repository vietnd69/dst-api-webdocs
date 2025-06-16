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

## Basic Usage

```lua
-- Basic decorator node structure
local MyDecorator = Class(BehaviorNode, function(self, inst, child, param)
    BehaviorNode._ctor(self, "MyDecorator")
    self.inst = inst
    self.child = child
    self.param = param
end)

function MyDecorator:Visit()
    if self.status == READY then
        self.status = RUNNING
        self.child:Start()
    end

    if self.status == RUNNING then
        local status = self.child:Visit()
        
        -- Modify the child node's result or behavior
        if status == SUCCESS or status == FAILURE then
            -- Apply decorator logic
            self.status = self:ModifyResult(status)
        end
    end
    
    return self.status
end

function MyDecorator:ModifyResult(status)
    -- This is where the decorator modifies the result
    if self.param then
        return SUCCESS
    else
        return status
    end
end

-- Used in a behavior tree
local root = PriorityNode(
{
    -- Apply a decorator to a node
    MyDecorator(inst, 
        DoAction(inst, SomeAction), 
        true
    ),
    -- Other nodes
}, 0.5) -- Run every 0.5 seconds
```

## Decorator Node States

Decorator nodes can be in the same states as other behavior nodes:

| State | Description |
|-------|-------------|
| `READY` | Node is ready to be executed |
| `RUNNING` | Node is currently executing |
| `SUCCESS` | Node has completed successfully |
| `FAILURE` | Node has failed to complete |

## Built-in Decorator Nodes

Don't Starve Together includes several pre-defined decorator nodes:

### NotDecorator

Inverts the result of its child node - SUCCESS becomes FAILURE and vice versa.

```lua
-- Basic format
NotDecorator(child_node)

-- Example: Invert the result of an action
NotDecorator(
    DoAction(inst, function()
        return inst.components.hunger:GetPercent() > 0.5
    end)
)
```

### FailIfRunningDecorator

Returns FAILURE if the child is still RUNNING after a certain time.

```lua
-- Basic format
FailIfRunningDecorator(child_node, max_time)

-- Example: Fail if action is taking too long
FailIfRunningDecorator(
    GoToEntity(inst, function() return FindClosestFood(inst) end, 1), 
    5 -- Fail if taking more than 5 seconds
)
```

### LoopNode

Repeatedly executes the child node, either forever or a specific number of times.

```lua
-- Basic format for infinite loop
LoopNode(child_node)

-- Basic format for specific iterations
LoopNode(child_node, max_loops)

-- Example: Try to find food 3 times
LoopNode(
    FindFood(inst, {"fruit", "veggie"}, 20),
    3
)
```

### SuccessIfRunningDecorator

Returns SUCCESS if the child node is still RUNNING.

```lua
-- Basic format
SuccessIfRunningDecorator(child_node)

-- Example: Consider it a success if we're still chasing the target
SuccessIfRunningDecorator(
    ChaseAndAttack(inst, 10)
)
```

### RandomNode

Randomly selects from its children nodes, based on weighted probabilities.

```lua
-- Basic format
RandomNode(
    {chance1, node1},
    {chance2, node2},
    ...
)

-- Example: Random behavior selection
RandomNode(
    {0.6, Wander(inst)},
    {0.3, DoAction(inst, EatFood)},
    {0.1, RunAway(inst, "character", 5, 8)}
)
```

## Common Decorator Patterns

Here are some common ways to use decorator nodes in Don't Starve Together AI:

### Timers and Cooldowns

```lua
-- Run a behavior only every X seconds
TimerDecorator = Class(BehaviorNode, function(self, inst, child, cooldown_time)
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

```lua
-- Only execute child node if condition is true
ConditionalDecorator = Class(BehaviorNode, function(self, inst, child, cond_fn)
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

```lua
-- Try the child node multiple times until success
RetryDecorator = Class(BehaviorNode, function(self, inst, child, max_attempts)
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

1. **Derive from BehaviorNode**:
   ```lua
   local CustomDecorator = Class(BehaviorNode, function(self, inst, child, ...)
       BehaviorNode._ctor(self, "CustomDecorator")
       self.inst = inst
       self.child = child
       -- Store other parameters
   end)
   ```

2. **Implement Visit function**:
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

3. **Optional: Implement Stop and Reset functions**:
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

```lua
-- A decorator that has a percentage chance of executing its child node
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

-- Usage in a behavior tree
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

```lua
-- A decorator that logs success/failure statistics
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

## Integration with Other Node Types

Decorator nodes work with other node types to create complex behaviors:

```lua
-- Complex behavior tree with decorators
local behavior = PriorityNode(
{
    -- Only try to find food every 10 seconds
    TimerDecorator(
        FindAndEatFood(inst),
        10
    ),
    
    -- Try attacking up to 3 times when target is present
    IfNode(function() return inst.components.combat:HasTarget() end,
        RetryDecorator(
            AttackTarget(inst, function() return inst.components.combat.target end),
            3
        )
    ),
    
    -- 75% chance to run away at night, otherwise keep wandering
    IfNode(function() return TheWorld.state.isnight end,
        ProbabilityDecorator(
            RunAway(inst, "character", 10, 15),
            0.75
        )
    ),
    
    -- Track wandering success/failure
    TrackingDecorator(
        Wander(inst),
        "wander_tracking"
    )
}, 0.5)
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
