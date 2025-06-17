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

## Action Node properties and methods

Action Nodes provide the following key properties and methods:

- **Properties**
  - `inst` - Reference to the entity this node controls
  - `status` - Current execution status of the node
  - `action_fn` - Function that performs the actual action

- **Methods**
  - `Visit()` - Evaluates the node and executes its action
  - `OnStop()` - Cleans up resources when execution stops

## Properties

### inst: [Entity](entity.md) <span style={{color: "#888"}}>[readonly]</span>

A reference to the entity that this action node is controlling.

```lua
-- Access the action node's entity
local health = action_node.inst.components.health
```

---

### status: 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE' <span style={{color: "#888"}}>[readonly]</span>

The current execution status of the node. Action nodes progress through states as they execute:

- **READY**: Node is ready to be executed
- **RUNNING**: Node is currently executing
- **SUCCESS**: Node has completed successfully
- **FAILURE**: Node has failed to complete

```lua
-- Check the current status
if action_node.status == SUCCESS then
    print("Action completed successfully")
end
```

---

### action_fn: Function <span style={{color: "#888"}}>[readonly]</span>

The function that performs the actual action. It should return true for success and false for failure.

```lua
-- Define an action function
local attack_action = function(inst)
    return inst.components.combat:DoAttack()
end
```

---

## Methods

### Visit(): 'READY' | 'RUNNING' | 'SUCCESS' | 'FAILURE'

Evaluates the node, executes its action, and returns the current status. This is the main method that drives the behavior tree execution.

```lua
-- Custom action node implementation
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
```

---

### OnStop(): void

Called when the node stops execution. Use this to clean up any resources or states.

```lua
function MyAction:OnStop()
    -- Clean up any active states
    self.inst.components.locomotor:Stop()
end
```

---

## Built-in Action Nodes

Don't Starve Together includes several pre-defined action nodes for common behaviors:

### Movement Actions

#### GoToEntity(inst: [Entity](entity.md), target_fn: Function, max_distance: number): ActionNode

Creates a node that moves the entity toward a target entity.

- **inst**: Entity to move
- **target_fn**: Function that returns the target entity
- **max_distance**: Maximum distance to move

```lua
-- Go to nearest player
local go_to_player = GoToEntity(inst, function() 
    return FindClosestPlayer(inst) 
end, 2)
```

---

#### GoToPoint(inst: [Entity](entity.md), point_fn: Function): ActionNode

Creates a node that moves the entity to a specific point.

- **inst**: Entity to move
- **point_fn**: Function that returns a Vector3 position

```lua
-- Go to a specific point
local go_home = GoToPoint(inst, function() 
    return inst.components.homeposition:GetPosition() 
end)
```

---

#### Wander(inst: [Entity](entity.md), center_point: Function, max_distance: number, min_time: number, max_time: number): ActionNode

Creates a node that makes the entity wander around randomly.

- **inst**: Entity to move
- **center_point**: Function that returns the center point to wander around
- **max_distance**: Maximum distance to wander from center
- **min_time**: Minimum time to wander before picking a new point
- **max_time**: Maximum time to wander before picking a new point

```lua
-- Wander around home position
local wander = Wander(inst, function() 
    return inst.components.knownlocations:GetLocation("home") 
end, 20, 2, 6)
```

---

#### Follow(inst: [Entity](entity.md), target_fn: Function, min_dist: number, target_dist: number, max_dist: number): ActionNode

Creates a node that makes the entity follow another entity at a distance.

- **inst**: Entity to move
- **target_fn**: Function that returns the entity to follow
- **min_dist**: Minimum distance to maintain
- **target_dist**: Preferred distance to maintain
- **max_dist**: Maximum distance before giving up

```lua
-- Follow the player at a distance
local follow_player = Follow(inst, function() 
    return FindClosestPlayer(inst) 
end, 2, 4, 10)
```

---

#### RunAway(inst: [Entity](entity.md), threat_fn: Function, threat_distance: number, safe_distance: number): ActionNode

Creates a node that makes the entity run away from threats.

- **inst**: Entity to move
- **threat_fn**: Function that returns the threat to run away from
- **threat_distance**: Distance to detect threats
- **safe_distance**: Distance considered safe

```lua
-- Run away from players
local run_away = RunAway(inst, "player", 5, 10)
```

---

### Combat Actions

#### ChaseAndAttack(inst: [Entity](entity.md), max_chase_time: number, give_up_distance: number): ActionNode

Creates a node that chases and attacks a target.

- **inst**: Entity that will chase and attack
- **max_chase_time**: Maximum time to chase before giving up
- **give_up_distance**: Distance at which to give up chase

```lua
-- Chase and attack targets
local chase = ChaseAndAttack(inst, 10, 20)
```

---

#### AttackTarget(inst: [Entity](entity.md), target_fn: Function): ActionNode

Creates a node that attacks a specific target.

- **inst**: Entity that will attack
- **target_fn**: Function that returns the target to attack

```lua
-- Attack the player
local attack_player = AttackTarget(inst, function() 
    return FindClosestPlayer(inst)
end)
```

---

### FindTarget
```ts
(inst: Entity, distance: number, canattack_fn: Function, tags: Array<string>) => ActionNode

Creates a node that finds and sets a target to attack.

- **inst**: Entity that will search
- **distance**: Search radius
- **canattack_fn**: Function that checks if entity can be attacked
- **tags**: Tags to search for

```lua
-- Find attackable targets
local find_target = FindTarget(inst, 20, 
    function(target) return not target:HasTag("wall") end,
    {"character", "monster"}
)
```

---

## Creating Custom Action Nodes

To create a custom action node:

### 1. Derive from BehaviorNode

```lua
local CustomAction = Class(BehaviorNode, function(self, inst, ...)
    BehaviorNode._ctor(self, "CustomAction")
    self.inst = inst
    -- Store other parameters
end)
```

### 2. Implement Visit function

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

### 3. Implement OnStop function (optional)

```lua
function CustomAction:OnStop()
    -- Clean up any resources or states
end
```

## Example: Patrol Action

Here's a complete example of a custom action node that makes an entity patrol between points:

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

## Performance Considerations

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
