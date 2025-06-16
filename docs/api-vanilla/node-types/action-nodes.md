---
id: action-nodes
title: Action Nodes
sidebar_position: 2
last_updated: 2023-08-01
version: 624447
---
*Last Update: 2023-08-01*
# Action Nodes

*API Version: 624447*

Action Nodes are fundamental building blocks in Don't Starve Together's behavior tree system. They define specific actions that entities can perform, forming the "leaves" of behavior trees that drive AI decision-making.

## Basic Usage

```lua
-- Basic action node structure
local MyAction = Class(BehaviorNode, function(self, inst, action_fn)
    BehaviorNode._ctor(self, "MyAction")
    self.inst = inst
    self.action_fn = action_fn
end)

function MyAction:Visit()
    if self.status == READY then
        self.status = RUNNING
    end

    if self.status == RUNNING then
        if self.action_fn(self.inst) then
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
    MyAction(inst, function(inst) 
        -- Do something and return true/false for success/failure
        return inst.components.combat:DoAttack()
    end),
    -- Other nodes
}, 0.5) -- Run every 0.5 seconds
```

## Action Node States

Action nodes can be in one of four states:

| State | Description |
|-------|-------------|
| `READY` | Node is ready to be executed |
| `RUNNING` | Node is currently executing |
| `SUCCESS` | Node has completed successfully |
| `FAILURE` | Node has failed to complete |

## Built-in Action Nodes

Don't Starve Together includes several pre-defined action nodes for common behaviors:

### Movement Actions

```lua
-- Go to target entity
GoToEntity(inst, target_fn, max_distance)

-- Go to specific point
GoToPoint(inst, point_fn)

-- Wander around
Wander(inst, center_point, max_distance, min_time, max_time)

-- Follow entity at distance
Follow(inst, target_fn, min_dist, target_dist, max_dist)

-- Run away from danger
RunAway(inst, threat_fn, threat_distance, safe_distance)
```

### Combat Actions

```lua
-- Chase and attack target
ChaseAndAttack(inst, max_chase_time, give_up_distance)

-- Attack specific target
AttackTarget(inst, target_fn)

-- Find nearest attackable target
FindTarget(inst, distance, canattack_fn, tags)
```

### Other Common Actions

```lua
-- Find and eat food
FindFood(inst, food_tags, distance)

-- Sleep at location
Sleep(inst, sleeptime_fn)

-- Find specific items
FindItem(inst, item_fn, distance)

-- Perform custom action
DoAction(inst, action_fn)
```

## Creating Custom Action Nodes

To create a custom action node:

1. **Derive from BehaviorNode**:
   ```lua
   local CustomAction = Class(BehaviorNode, function(self, inst, ...)
       BehaviorNode._ctor(self, "CustomAction")
       self.inst = inst
       -- Store other parameters
   end)
   ```

2. **Implement Visit function**:
   ```lua
   function CustomAction:Visit()
       if self.status == READY then
           self.status = RUNNING
       end
       
       if self.status == RUNNING then
           -- Implement action logic here
           -- Set status to SUCCESS or FAILURE based on result
       end
       
       return self.status
   end
   ```

3. **Optional: Implement OnStop function**:
   ```lua
   function CustomAction:OnStop()
       -- Clean up any resources or states
   end
   ```

## Example: Patrol Action

```lua
local Patrol = Class(BehaviorNode, function(self, inst, patrol_points, pause_time)
    BehaviorNode._ctor(self, "Patrol")
    self.inst = inst
    self.patrol_points = patrol_points
    self.pause_time = pause_time or 2
    self.current_point = 1
    self.waiting = false
    self.wait_time = 0
end)

function Patrol:Visit()
    if self.status == READY then
        self.status = RUNNING
    end
    
    if self.status == RUNNING then
        if self.waiting then
            self.wait_time = self.wait_time - GetTickTime()
            if self.wait_time <= 0 then
                self.waiting = false
                self.current_point = (self.current_point % #self.patrol_points) + 1
            end
            return self.status
        end
        
        if self.inst.components.locomotor ~= nil then
            local target = self.patrol_points[self.current_point]
            local pos = self.inst:GetPosition()
            
            if distsq(pos.x, pos.z, target.x, target.z) < 1 then
                self.waiting = true
                self.wait_time = self.pause_time
                self.inst.components.locomotor:Stop()
            else
                self.inst.components.locomotor:GoToPoint(target)
            end
            return self.status
        else
            return FAILURE
        end
    end
    
    return self.status
end

function Patrol:OnStop()
    if self.inst.components.locomotor ~= nil then
        self.inst.components.locomotor:Stop()
    end
end
```

## Integration with Other Node Types

Action nodes work with other node types to create complex behaviors:

- **Priority Nodes**: Choose which action to perform based on priority
- **Sequence Nodes**: Perform a series of actions in order
- **Decorator Nodes**: Modify how actions are performed
- **Condition Nodes**: Determine if actions can be performed

```lua
-- Example combining multiple node types
local behavior = PriorityNode(
{
    -- Run away if health is low (Condition + Action)
    IfNode(function() return inst.components.health:GetPercent() < 0.3 end,
        RunAway(inst, function() return FindClosestThreat(inst) end, 10, 15)
    ),
    
    -- Chase and attack if target exists (Condition + Action)
    IfNode(function() return inst.components.combat and inst.components.combat.target end,
        ChaseAndAttack(inst, 10)
    ),
    
    -- Otherwise patrol between points (Action)
    Patrol(inst, {
        Vector3(10, 0, 10),
        Vector3(10, 0, -10),
        Vector3(-10, 0, -10),
        Vector3(-10, 0, 10)
    }, 3)
}, 0.5)
```

## Action Node Performance Considerations

- Keep action logic simple for better performance
- Avoid expensive calculations in frequently called actions
- Use timeouts to prevent infinite action attempts
- Consider using throttled updates for non-critical actions

## See also

- [Brain](brain.md) - For brain implementation using behavior trees
- [Priority Nodes](priority-nodes.md) - For selecting between different actions
- [Condition Nodes](condition-nodes.md) - For conditional action execution
- [Sequence Nodes](sequence-nodes.md) - For executing actions in sequence
- [Decorator Nodes](decorator-nodes.md) - For modifying action behavior
