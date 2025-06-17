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

## Basic Usage

```lua
-- Basic priority node structure
local PriorityNode = Class(BehaviorNode, function(self, inst, children, period)
    BehaviorNode._ctor(self, "PriorityNode")
    self.inst = inst
    self.children = children
    self.period = period or 0
    self.lasttime = 0
    self.currentchild = nil
end)

-- Used in a behavior tree
local root = PriorityNode(
{
    -- Higher priority actions come first
    RunAway(inst, "character", 4, 6),
    ChaseAndAttack(inst, 10),
    Wander(inst)
}, 0.5) -- Evaluate priority every 0.5 seconds
```

## Priority Node States

Like other behavior nodes, priority nodes can be in one of several states:

| State | Description |
|-------|-------------|
| `READY` | Node is ready to evaluate children |
| `RUNNING` | Node is currently running a child node |
| `SUCCESS` | A child node has succeeded |
| `FAILURE` | All child nodes have failed |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `children` | Array | List of child nodes to execute in priority order |
| `period` | number | Time between re-evaluations of the node (0 = evaluate every frame) |
| `lasttime` | number | Last time the node was evaluated |
| `currentchild` | BehaviorNode | Currently executing child node |

## Key Methods

### PriorityNode:Visit()

Evaluates the priority node, trying each child in order until one succeeds.

#### Returns

- (Status): The status of the priority node (RUNNING, SUCCESS, or FAILURE)

### PriorityNode:Stop()

Stops the priority node and all its children.

### PriorityNode:Reset()

Resets the priority node and all its children to READY state.

## Built-in Priority Node Types

Don't Starve Together includes several specialized priority node implementations:

```lua
-- Standard priority node
PriorityNode(children, period)

-- Loop priority node - returns to first child after reaching the end
LoopPriorityNode(children, period)

-- Weighted priority node - chooses based on weights rather than order
WeightedPriorityNode(weighted_children, period)
```

### PriorityNode

The standard priority node that tries each child in order.

### LoopPriorityNode

Similar to PriorityNode, but loops back to the first child after reaching the end.

### WeightedPriorityNode

Selects children based on weights rather than strict order:

```lua
-- Example weighted priority
local root = WeightedPriorityNode({
    {weight = 5, node = FindFood(inst)},
    {weight = 3, node = ChaseAndAttack(inst, 10)},
    {weight = 1, node = Wander(inst)}
})
```

## Common Patterns

Priority nodes are commonly used for these patterns:

```lua
-- Fallback behavior pattern
PriorityNode({
    -- Try high-priority critical behavior first
    IfNode(function() return inst.components.health:GetPercent() < 0.25 end,
        RunAway(inst, "character", 5, 8)
    ),
    
    -- Medium priority - fulfill needs
    IfNode(function() return inst.components.hunger:GetPercent() < 0.5 end,
        FindAndEatFood(inst)
    ),
    
    -- Low priority - default behavior
    Wander(inst)
})

-- Multiple ways to solve the same problem
PriorityNode({
    -- Try to pick up existing food first
    FindAndPickupFood(inst),
    
    -- If no food exists, try to harvest some
    FindAndHarvestFood(inst),
    
    -- Last resort - hunt for food
    FindAndHuntFood(inst)
})
```

## Creating Custom Priority Nodes

To create a custom priority node:

1. **Derive from BehaviorNode**:
   ```lua
   local CustomPriorityNode = Class(BehaviorNode, function(self, inst, children, ...)
       BehaviorNode._ctor(self, "CustomPriorityNode")
       self.inst = inst
       self.children = children
       -- Initialize additional properties
   end)
   ```

2. **Implement Visit function**:
   ```lua
   function CustomPriorityNode:Visit()
       if self.status == READY then
           self.status = RUNNING
           self.currentchild = nil
       end
       
       if self.status == RUNNING then
           -- Implement custom priority logic here
           -- Try children in order based on your custom rules
       end
       
       return self.status
   end
   ```

3. **Implement Stop function**:
   ```lua
   function CustomPriorityNode:Stop()
       for i, v in ipairs(self.children) do
           v:Stop()
       end
       self.currentchild = nil
       self.status = READY
   end
   ```

## Example: Dynamic Priority Node

```lua
-- A priority node that dynamically adjusts priorities based on state
local DynamicPriorityNode = Class(BehaviorNode, function(self, inst, children, priority_fn)
    BehaviorNode._ctor(self, "DynamicPriorityNode")
    self.inst = inst
    self.children = children
    self.priority_fn = priority_fn  -- Function that returns ordered indices
    self.currentchild = nil
end)

function DynamicPriorityNode:Visit()
    if self.status == READY then
        self.status = RUNNING
        self.currentchild = nil
    end
    
    if self.status == RUNNING then
        -- Get current priorities
        local priorities = self.priority_fn(self.inst)
        
        if self.currentchild then
            local status = self.currentchild:Visit()
            
            if status == RUNNING then
                return self.status
            else
                if status == SUCCESS then
                    self.status = SUCCESS
                    return self.status
                end
                self.currentchild:Stop()
                self.currentchild = nil
            end
        end
        
        -- Try children in dynamic priority order
        for i = 1, #priorities do
            local idx = priorities[i]
            if idx > 0 and idx <= #self.children then
                local child = self.children[idx]
                child:Start()
                local status = child:Visit()
                
                if status == RUNNING then
                    self.currentchild = child
                    return self.status
                elseif status == SUCCESS then
                    self.status = SUCCESS
                    return self.status
                else
                    child:Stop()
                end
            end
        end
        
        -- If we get here, all children failed
        self.status = FAILURE
    end
    
    return self.status
end

function DynamicPriorityNode:Stop()
    if self.currentchild then
        self.currentchild:Stop()
    end
    
    for i, v in ipairs(self.children) do
        if v ~= self.currentchild then
            v:Stop()
        end
    end
    
    self.currentchild = nil
    self.status = READY
end

-- Example usage
local behavior = DynamicPriorityNode(inst, 
    {
        FindFood(inst),
        ChaseAndAttack(inst, 10),
        Wander(inst)
    },
    function(inst)
        -- Return indices in priority order based on current state
        if inst.components.hunger:GetPercent() < 0.25 then
            return {1, 3, 2}  -- Food, wander, attack
        elseif inst.components.combat:HasTarget() then
            return {2, 1, 3}  -- Attack, food, wander
        else
            return {3, 1, 2}  -- Wander, food, attack
        end
    end
)
```

## Integration with Other Node Types

Priority nodes are often used with other node types to create complex behaviors:

```lua
-- Complex behavior combining multiple node types
local behavior = PriorityNode({
    -- Emergency response
    IfNode(function() 
        return inst.components.health:GetPercent() < 0.3 
    end,
        SequenceNode(inst, {
            FindItem(inst, function(item) 
                return item.prefab == "healing_item" 
            end, 20),
            DoAction(inst, function() 
                return inst.components.health:GetPercent() < 0.3 and
                       inst.components.inventory:Has("healing_item", 1) and
                       inst.components.inventory:GetItemByName("healing_item")
            end)
        })
    ),
    
    -- Combat behavior
    WhileNode(function() 
        return inst.components.combat:HasTarget() and
               inst.components.combat:CanAttack() 
    end,
        "Attack Enemy",
        ChaseAndAttack(inst, 10)
    ),
    
    -- Gathering behavior
    NotDecorator(inst, 
        IfNode(function() 
            return inst.components.inventory:IsFull() 
        end,
            LoopNode(inst, 
                FindAndCollectItems(inst)
            )
        )
    ),
    
    -- Default behavior
    Wander(inst, function() 
        return inst.components.knownlocations:GetLocation("home") 
    end, 20)
}, 0.5)  -- Re-evaluate every 0.5 seconds
```

## Performance Considerations

- **Child Order**: Put most commonly successful nodes first for better performance
- **Evaluation Period**: Use an appropriate period value (not 0) for non-critical priority nodes
- **Child Count**: Keep the number of children manageable; consider nested priority nodes for complex hierarchies
- **Reset State**: Properly handle the reset state for children that may run for multiple frames
- **Stop Method**: Always implement a proper Stop method to clean up resources

## See also

- [Brain](brain.md) - For brain implementation using behavior trees
- [Action Nodes](action-nodes.md) - For nodes that perform actions
- [Condition Nodes](condition-nodes.md) - For conditional execution
- [Sequence Nodes](sequence-nodes.md) - For executing actions in sequence
- [Decorator Nodes](decorator-nodes.md) - For modifying node behavior
