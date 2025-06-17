---
id: brain
title: Brain
sidebar_position: 3
last_updated: 2023-08-15
version: 624447
---

*Last Update: 2023-08-15*
# Brain

*API Version: 624447*

The Brain node type controls entity AI decision-making through behavior trees. It serves as the central controller for non-player entities, determining their actions based on behavior tree nodes, events, and world conditions.

## Brain properties and methods

Brain provides the following key properties and methods:

- **Properties**
  - `inst` - Reference to the entity this brain controls
  - `events` - Table of registered event handlers
  - `bt` - The behavior tree that defines decision-making
  - `currentbehaviour` - Name of the currently executing behavior
  - `thinkperiod` - Time between brain updates in seconds

- **Methods**
  - `OnStart()` - Called when the brain starts
  - `OnStop()` - Called when the brain stops
  - `Start()` - Activates the brain
  - `Stop()` - Deactivates the brain
  - `AddEventHandler()` - Registers an event handler

## Properties

### inst: [Entity](entity.md) <span style={{color: "#888"}}>[readonly]</span>

A reference to the entity that this Brain is controlling.

```lua
-- Access the brain's entity
local health = brain.inst.components.health
```

---

### events: Table <span style={{color: "#888"}}>[readonly]</span>

Table of event handlers registered for this brain. Events are used to react to various stimuli in the game world.

```lua
-- View registered events
for event, handler in pairs(brain.events) do
    print("Brain responds to: " .. event)
end
```

---

### bt: [BehaviorTree](behavior-tree.md) <span style={{color: "#888"}}>[readonly]</span>

The behavior tree that defines this brain's decision-making process. The BehaviorTree contains the root node of the behavior tree hierarchy.

```lua
-- Access behavior tree status
local status = brain.bt.root:GetStatus()
```

---

### currentbehaviour: String | null <span style={{color: "#888"}}>[readonly]</span>

The name of the behavior currently being executed, or nil if no behavior is active.

```lua
-- Get current behavior
if brain.currentbehaviour then
    print("Currently executing: " .. brain.currentbehaviour)
else
    print("No behavior currently active")
end
```

---

### thinkperiod: Number

Time between brain updates in seconds. Lower values make the AI more responsive but increase performance cost.

Default value: 0.5 (updates twice per second)

```lua
-- Set more frequent updates for this brain
brain.thinkperiod = 0.25  -- Update 4 times per second
```

---

## Methods

### OnStart(): void

Virtual method called when the brain starts. Override this in your custom brain implementation to set up the behavior tree.

```lua
function MyBrain:OnStart()
    -- Create behavior tree
    local root = PriorityNode({
        AttackWhenHungry(self.inst),
        Wander(self.inst)
    })
    
    self.bt = BT(self.inst, root)
end
```

---

### OnStop(): void

Virtual method called when the brain stops. Override this to clean up any resources or states when the brain deactivates.

```lua
function MyBrain:OnStop()
    -- Clean up any active states
    self.inst.components.combat:SetTarget(nil)
end
```

---

### Start(): void

Activates the brain, initializing the behavior tree and beginning the AI's decision-making process.

```lua
-- Manually start a brain
brain:Start()
```

---

### Stop(): void

Deactivates the brain, stopping all AI behaviors and pausing the behavior tree evaluation.

```lua
-- Manually stop a brain
brain:Stop()
```

---

### AddEventHandler(event: String, fn: Function): void

Registers a handler for the specified event name. The handler will be called when the event occurs.

```lua
-- Add event handler for attacks
brain:AddEventHandler("attacked", function(inst, data)
    -- React to being attacked
    inst.components.combat:SetTarget(data.attacker)
end)
```

---

## Events

Brain nodes respond to these common events:

| Event | Triggered When | Typical Response |
|-------|---------------|------------------|
| `attacked` | Entity is hit by an attack | Set target to attacker |
| `onhitother` | Entity successfully hits another | Continue attacking |
| `newcombattarget` | Combat component acquires target | Switch to attack behavior |
| `entitysleep` | Entity is removed from active world | Pause brain processing |
| `entitywake` | Entity is added to active world | Resume brain processing |

## Usage Examples

### Basic Brain Implementation

```lua
local MyBrain = Class(Brain, function(self, inst)
    -- Initialize brain with the entity
    Brain._ctor(self, inst)
end)

function MyBrain:OnStart()
    -- Create a behavior tree for this brain
    local root = PriorityNode({
        -- Run away from threats
        RunAway(self.inst, "player", 4, 6),
        
        -- Attack targets in range
        ChaseAndAttack(self.inst, 10),
        
        -- Default behavior when nothing else to do
        Wander(self.inst)
    })
    
    -- Set up behavior tree
    self.bt = BT(self.inst, root)
end

-- Register event handlers
function MyBrain:OnInitializationComplete()
    self:AddEventHandler("attacked", function(inst, data)
        -- Remember who attacked us
        self.inst.components.combat:SetTarget(data.attacker)
    end)
end

return MyBrain
```

### Complex Brain with Memory

```lua
local ComplexBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
    
    -- Brain memory for decision making
    self.home_position = inst:GetPosition()
    self.has_target = false
    self.flee_time = 0
end)

function ComplexBrain:OnStart()
    -- Create a more complex behavior tree with state
    local root = PriorityNode({
        -- Flee when health is low
        DoAction(self.inst, function() 
            if self.inst.components.health:GetPercent() < 0.25 then
                self.flee_time = GetTime()
                return true
            end
            return false
        end, "FleeOnLowHealth", function() 
            return RunAway(self.inst, "player", 8, 12) 
        end),
        
        -- Return home after fleeing
        DoAction(self.inst, function()
            if self.flee_time > 0 and GetTime() - self.flee_time > 10 then
                self.flee_time = 0
                return true
            end
            return false
        end, "ReturnHome", function()
            return GoToPoint(self.inst, self.home_position)
        end),
        
        -- Attack nearby enemies
        ChaseAndAttack(self.inst, 15),
        
        -- Wander around home
        Wander(self.inst, function() return self.home_position end, 20)
    })
    
    self.bt = BT(self.inst, root)
end

return ComplexBrain
```

## See also

- [BehaviorNode](behavior-node.md) - Base class for all behavior tree nodes
- [PriorityNode](priority-nodes.md) - Node for selecting behaviors by priority
- [SequenceNode](sequence-nodes.md) - Node for executing behaviors in sequence
