---
title: Brain System
description: Documentation of the Don't Starve Together brain system for AI entity control and behavior management
sidebar_position: 1

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Brain System

The Brain system in Don't Starve Together provides centralized AI management for entities, coordinating behavior execution, sleep/wake cycles, and performance optimization. This system serves as the bridge between entity components and behavior trees, enabling sophisticated AI patterns while maintaining optimal game performance.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 675312 | 2025-06-21 | stable | Updated documentation to match current implementation |


## Overview

The brain system serves multiple purposes:
- **AI Coordination**: Manages behavior tree execution for all AI entities
- **Performance Management**: Implements sleep/wake cycles to optimize CPU usage
- **Event Integration**: Provides event-driven behavior triggers
- **Lifecycle Management**: Handles AI startup, shutdown, and cleanup

The system is built around two core classes: `BrainWrangler` for global management and `Brain` for individual entity AI control.

## Core Architecture

### BrainWrangler Class

The global brain manager that coordinates all AI entities:

```lua
BrainWrangler = Class(function(self)
    self.instances = {}        -- All brain instances
    self.updaters = {}         -- Brains currently updating
    self._safe_updaters = {}   -- Safe iteration copy
    self.tickwaiters = {}      -- Brains sleeping until specific tick
    self.hibernaters = {}      -- Hibernating brains
end)
```

#### Global Brain Manager

The system provides a singleton instance for global coordination:

```lua
BrainManager = BrainWrangler()
```

### Brain Class

Individual brain instances that control entity AI:

```lua
Brain = Class(function(self)
    self.inst = nil                -- Entity this brain controls
    self.currentbehaviour = nil    -- Current behavior state
    self.behaviourqueue = {}       -- Queued behaviors
    self.events = {}              -- Event handlers
    self.thinkperiod = nil        -- Update frequency
    self.lastthinktime = nil      -- Last update time
    self.paused = false           -- Pause state
end)
```

## Brain Management

### State Management

The brain system categorizes brains into different states for optimization:

| State | Description | Performance Impact |
|-------|-------------|-------------------|
| **Updaters** | Actively updating brains | High CPU usage |
| **Hibernaters** | Sleeping indefinitely | Minimal CPU usage |
| **Tick Waiters** | Sleeping until specific time | No CPU usage |

### Lifecycle Methods

#### Adding Brain Instances

```lua
function BrainWrangler:AddInstance(inst)
    self.instances[inst] = self.updaters
    self.updaters[inst] = true
end
```

**Usage**: Registers a new brain for active updating.

#### Removing Brain Instances

```lua
function BrainWrangler:RemoveInstance(inst)
    self:SendToList(inst, nil)
    -- Clean up from all lists
    self.updaters[inst] = nil
    self.hibernaters[inst] = nil
    for k,v in pairs(self.tickwaiters) do
        v[inst] = nil
    end
    self.instances[inst] = nil
end
```

**Usage**: Completely removes a brain from the system.

### Sleep and Wake System

#### Wake Brain

```lua
function BrainWrangler:Wake(inst)
    if self.instances[inst] then
        self:SendToList(inst, self.updaters)
    end
end
```

**Usage**: Moves brain from hibernation to active updating.

#### Hibernate Brain

```lua
function BrainWrangler:Hibernate(inst)
    if self.instances[inst] then
        self:SendToList(inst, self.hibernaters)
    end
end
```

**Usage**: Moves brain to hibernation (stops updating).

#### Timed Sleep

```lua
function BrainWrangler:Sleep(inst, time_to_wait)
    local sleep_ticks = time_to_wait/GetTickTime()
    if sleep_ticks == 0 then sleep_ticks = 1 end
    
    local target_tick = math.floor(GetTick() + sleep_ticks)
    
    if target_tick > GetTick() then
        local waiters = self.tickwaiters[target_tick]
        if not waiters then
            waiters = {}
            self.tickwaiters[target_tick] = waiters
        end
        self:SendToList(inst, waiters)
    end
end
```

**Usage**: Sleeps brain for specific duration for performance optimization.

## Brain Update Cycle

### Main Update Loop

The brain manager processes all brains in each game tick:

```lua
function BrainWrangler:Update(current_tick)
    -- Wake up brains that finished sleeping
    local waiters = self.tickwaiters[current_tick]
    if waiters then
        for k,v in pairs(waiters) do
            self.updaters[k] = true
            self.instances[k] = self.updaters
        end
        self.tickwaiters[current_tick] = nil
    end
    
    -- Update active brains safely
    local count = 0
    for k, _ in pairs(self.updaters) do
        if k.inst.entity:IsValid() and not k.inst:IsAsleep() then
            count = count + 1
            self._safe_updaters[count] = k
        end
    end
    
    for i = 1, count do
        local k = self._safe_updaters[i]
        self._safe_updaters[i] = nil
        
        k:OnUpdate()
        local sleep_amount = k:GetSleepTime()
        if sleep_amount then
            if sleep_amount > GetTickTime() then
                self:Sleep(k, sleep_amount)
            end
        else
            self:Hibernate(k)
        end
    end
end
```

### Individual Brain Update

```lua
function Brain:OnUpdate()
    if self.DoUpdate then
        self:DoUpdate()
    end
    
    if self.bt then
        self.bt:Update()
    end
end
```

## Brain Class Methods

### Core Lifecycle

#### Start Brain

```lua
function Brain:Start()
    if self.paused then
        return
    end
    
    if self.OnStart then
        self:OnStart()
    end
    self.stopped = false
    BrainManager:AddInstance(self)
    
    if self.OnInitializationComplete then
        self:OnInitializationComplete()
    end
    
    -- Apply mods
    if self.modpostinitfns then
        for i,modfn in ipairs(self.modpostinitfns) do
            modfn(self)
        end
    end
end
```

**Usage**: Initializes and starts brain execution.

#### Stop Brain

```lua
function Brain:Stop()
    if self.paused then
        return
    end
    
    if self.OnStop then
        self:OnStop()
    end
    if self.bt then
        self.bt:Stop()
    end
    self.stopped = true
    BrainManager:RemoveInstance(self)
end
```

**Usage**: Stops brain execution and cleans up resources.

### Pause and Resume

#### Pause Brain

```lua
function Brain:Pause()
    self.paused = true
    BrainManager:RemoveInstance(self)
end
```

#### Resume Brain

```lua
function Brain:Resume()
    self.paused = false
    BrainManager:AddInstance(self)
end
```

### Performance Control

#### Force Update

```lua
function Brain:ForceUpdate()
    if self.bt then
        self.bt:ForceUpdate()
    end
    BrainManager:Wake(self)
end
```

**Usage**: Forces immediate brain update, bypassing sleep optimization.

#### Get Sleep Time

```lua
function Brain:GetSleepTime()
    if self.bt then
        return self.bt:GetSleepTime()
    end
    return 0
end
```

**Usage**: Returns optimal sleep duration for performance optimization.

### Event System

#### Add Event Handler

```lua
function Brain:AddEventHandler(event, fn)
    self.events[event] = fn
end
```

#### Push Event

```lua
function Brain:PushEvent(event, data)
    local handler = self.events[event]
    if handler then
        handler(data)
    end
end
```

## Implementation Examples

### Basic Brain Setup

```lua
-- Create a simple brain for an entity
local brain = require("brains/pigbrain")

-- Set up entity with brain
inst:AddComponent("brain")
inst.components.brain:SetBrain(brain)

-- The brain will automatically start when the entity spawns
```

### Custom Brain Creation

```lua
-- Define a custom brain
local MyBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
    
    -- Set up behavior tree
    self.bt = BT(inst,
        PriorityNode({
            -- High priority behaviors
            IfNode(function() return inst.components.health:GetPercent() < 0.3 end,
                   "Low Health",
                   ActionNode(function() inst:Flee() end, "Escape")),
            
            -- Default behavior
            ActionNode(function() inst:Wander() end, "Wander")
        })
    )
end)

-- Override lifecycle methods
function MyBrain:OnStart()
    -- Custom initialization
    print("Brain starting for", self.inst)
end

function MyBrain:OnStop()
    -- Custom cleanup
    print("Brain stopping for", self.inst)
end

-- Custom update logic
function MyBrain:DoUpdate()
    -- Additional per-frame logic
    if self.inst:IsNearPlayer() then
        self.inst:PlayAnimation("alert")
    end
end

return MyBrain
```

### Event-Driven Brain

```lua
local EventBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
    
    -- Set up event handlers
    self:AddEventHandler("attacked", function(data)
        if data.attacker and data.attacker:HasTag("player") then
            self:PushEvent("player_attack", data)
        end
    end)
    
    self:AddEventHandler("player_attack", function(data)
        -- React to player attack
        inst.components.combat:SetTarget(data.attacker)
    end)
    
    -- Behavior tree with event integration
    self.bt = BT(inst,
        PriorityNode({
            -- Event-driven behavior
            EventNode(inst, "player_attack",
                SequenceNode({
                    ActionNode(function() inst:FaceTarget() end, "Face Attacker"),
                    ActionNode(function() inst:Attack() end, "Fight Back")
                }),
                10), -- High priority
            
            -- Default behavior
            ActionNode(function() inst:DoIdle() end, "Idle")
        })
    )
end)

return EventBrain
```

### Performance-Optimized Brain

```lua
local OptimizedBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
    
    -- Set up behavior tree with sleep optimization
    self.bt = BT(inst,
        PriorityNode({
            -- Expensive checks with sleep
            IfNode(function() 
                local result = ExpensivePathfinding()
                if not result then
                    -- Sleep for 2 seconds if no path found
                    inst.components.brain:Sleep(2.0)
                end
                return result
            end, "Pathfind", 
            ActionNode(function() inst:FollowPath() end, "Move")),
            
            -- Low frequency behavior
            SequenceNode({
                WaitNode(5.0), -- Wait 5 seconds between checks
                ConditionNode(function() return inst:NeedsFood() end, "Hungry"),
                ActionNode(function() inst:FindFood() end, "Search Food")
            })
        }, 3.0) -- Re-evaluate priorities every 3 seconds
    )
end)

-- Override to provide custom sleep logic
function OptimizedBrain:GetSleepTime()
    local base_sleep = Brain.GetSleepTime(self)
    
    -- Sleep longer when far from players
    local player = FindClosestPlayer(inst, 20)
    if not player then
        return math.max(base_sleep, 1.0) -- Sleep at least 1 second
    end
    
    return base_sleep
end

return OptimizedBrain
```

## Performance Optimization

### Sleep Strategies

#### Conditional Sleep

```lua
-- Sleep based on entity state
function CustomBrain:GetSleepTime()
    if self.inst:IsAsleep() then
        return 5.0 -- Long sleep when entity is asleep
    elseif not self.inst:HasNearbyPlayers(15) then
        return 2.0 -- Medium sleep when no players nearby
    else
        return 0.1 -- Frequent updates when players are close
    end
end
```

#### Adaptive Sleep

```lua
-- Adjust sleep time based on activity level
function AdaptiveBrain:DoUpdate()
    self.activity_counter = (self.activity_counter or 0) + 1
    
    -- Reset counter periodically
    if self.activity_counter > 100 then
        self.last_activity = self.activity_counter
        self.activity_counter = 0
    end
end

function AdaptiveBrain:GetSleepTime()
    local base_sleep = Brain.GetSleepTime(self)
    
    -- Sleep longer if brain has been inactive
    if self.last_activity and self.last_activity < 10 then
        return math.max(base_sleep, 3.0)
    end
    
    return base_sleep
end
```

### Memory Management

#### Proper Cleanup

```lua
function CustomBrain:OnStop()
    -- Clean up references
    if self.cached_targets then
        self.cached_targets = nil
    end
    
    if self.pathfinder then
        self.pathfinder:Cancel()
        self.pathfinder = nil
    end
    
    -- Call parent cleanup
    Brain.OnStop(self)
end
```

## Integration with Game Systems

### Component Integration

```lua
-- Brain that works with multiple components
function ComponentBrain:OnStart()
    -- Validate required components
    if not self.inst.components.health then
        print("Warning: Brain requires health component")
    end
    
    if not self.inst.components.locomotor then
        print("Warning: Brain requires locomotor component")
    end
end

function ComponentBrain:DoUpdate()
    -- Use components safely
    local health = self.inst.components.health
    if health and health:GetPercent() < 0.5 then
        self.low_health = true
    else
        self.low_health = false
    end
end
```

### Entity Event Integration

```lua
-- Automatically listen to entity events
function EventIntegratedBrain:OnStart()
    -- Listen to entity lifecycle events
    self.inst:ListenForEvent("death", function() self:Stop() end)
    self.inst:ListenForEvent("attacked", function(data) 
        self:PushEvent("combat", data) 
    end)
    self.inst:ListenForEvent("itemget", function(data)
        self:PushEvent("inventory_change", data)
    end)
end
```

### Mod Integration

```lua
-- Brain with mod support
function ModdableBrain:OnStart()
    Brain.OnStart(self)
    
    -- Allow mods to add custom initialization
    if self.mod_start_hooks then
        for _, hook in ipairs(self.mod_start_hooks) do
            hook(self)
        end
    end
end

-- Function for mods to register hooks
function ModdableBrain:AddModStartHook(fn)
    self.mod_start_hooks = self.mod_start_hooks or {}
    table.insert(self.mod_start_hooks, fn)
end
```

## Debugging Support

### Debug Information

```lua
function Brain:__tostring()
    if self.bt then
        return string.format("--brain--\nsleep time: %2.2f\n%s", 
                           self:GetSleepTime(), tostring(self.bt))
    end
    return "--brain--"
end
```

### Debug Commands

```lua
-- Console commands for debugging brains
function DebugPrintBrainStats()
    print("=== Brain Statistics ===")
    print("Total instances:", GetTableSize(BrainManager.instances))
    print("Active updaters:", GetTableSize(BrainManager.updaters))
    print("Hibernating:", GetTableSize(BrainManager.hibernaters))
    
    local waiters = 0
    for tick, list in pairs(BrainManager.tickwaiters) do
        waiters = waiters + GetTableSize(list)
    end
    print("Sleeping (tick waiters):", waiters)
end

function DebugBrainEntity(entity)
    if entity and entity.components.brain then
        print("Brain info for", entity)
        print(tostring(entity.components.brain.brain))
    end
end
```

## Error Handling

### Safe Brain Operations

```lua
function SafeBrain:OnUpdate()
    local success, error_msg = pcall(function()
        if self.DoUpdate then
            self:DoUpdate()
        end
        
        if self.bt then
            self.bt:Update()
        end
    end)
    
    if not success then
        print("Brain error:", error_msg)
        -- Attempt recovery or stop brain
        self:Stop()
    end
end
```

### Entity Validation

```lua
function ValidatingBrain:OnUpdate()
    -- Always validate entity before operations
    if not self.inst or not self.inst:IsValid() then
        self:Stop()
        return
    end
    
    Brain.OnUpdate(self)
end
```

## Best Practices

### Design Guidelines

- **Single Responsibility**: Each brain should control one entity's AI
- **Performance Awareness**: Implement appropriate sleep strategies
- **Event-Driven Design**: Use events for reactive behaviors
- **Component Integration**: Work safely with entity components
- **Proper Cleanup**: Always clean up resources in OnStop

### Performance Best Practices

- Use sleep timers for expensive operations
- Implement hibernation for distant/inactive entities
- Cache expensive calculations between updates
- Avoid deep behavior tree nesting
- Profile brain performance regularly

### Maintainability

- Document complex AI logic thoroughly
- Use meaningful names for brain states and behaviors
- Implement proper error handling and recovery
- Provide debug information and visualization
- Test brain behavior across different scenarios

## Related Systems

- [Behaviour Trees](./behaviourtree.md) - Tree structures that brains execute
- [Components](../components/index.md) - Entity components that brains interact with
- [Actions](./actions.md) - Actions that brains can trigger
- [Stategraphs](../stategraphs/index.md) - Animation states coordinated with brains

## Status: 🟢 Stable

The Brain system is stable and fundamental to DST's AI architecture. The API is mature and changes are rare, focusing mainly on performance optimizations and debugging improvements.
