---
title: Buffered Action System
description: Documentation of the Don't Starve Together buffered action system for deferred action execution and validation
sidebar_position: 2
slug: /api-vanilla/core-systems/bufferedaction
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Buffered Action System

The Buffered Action system in Don't Starve Together provides a framework for managing deferred action execution with validation and callback support. This system enables actions to be queued, validated, and executed at the appropriate time while maintaining game state consistency and providing robust error handling.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 675312 | 2025-06-21 | stable | Updated documentation to match current implementation |

## Overview

The buffered action system serves multiple purposes:
- **Action Queuing**: Allows actions to be prepared and executed later
- **State Validation**: Ensures action prerequisites remain valid before execution
- **Callback Management**: Provides success/failure callback mechanisms
- **Parameter Preservation**: Maintains action context and parameters

The system is built around the `BufferedAction` class which encapsulates all necessary information for executing an action while providing validation and callback mechanisms.

## Core Architecture

### BufferedAction Class

The main class that represents a queued action with all its parameters:

```lua
BufferedAction = Class(function(self, doer, target, action, invobject, pos, recipe, distance, forced, rotation, arrivedist)
    self.doer = doer                     -- Entity performing the action
    self.target = target                 -- Target entity or object
    self.action = action                 -- Action definition to execute
    self.invobject = invobject           -- Inventory object being used
    self.pos = pos                       -- Position for action execution
    self.recipe = recipe                 -- Recipe if crafting action
    self.distance = distance             -- Maximum distance for action
    self.forced = forced                 -- Whether action is forced
    self.rotation = rotation             -- Rotation for action
    self.arrivedist = arrivedist         -- Distance when arrived at target
end)
```

### Key Properties

| Property | Type | Description |
|----------|------|-------------|
| `doer` | Entity | The entity performing the action |
| `target` | Entity | The target of the action (can be nil) |
| `action` | Action | The action definition containing execution logic |
| `invobject` | Entity | Inventory item being used in the action |
| `pos` | DynamicPosition | Position where action should be performed |
| `recipe` | String | Recipe name for crafting actions |
| `distance` | Number | Maximum distance for action execution |
| `forced` | Boolean | Whether action bypasses normal restrictions |
| `rotation` | Number | Rotation angle for directional actions |
| `arrivedist` | Number | Distance considered "arrived" at target |

### Internal State Properties

| Property | Description |
|----------|-------------|
| `initialtargetowner` | Original owner of target (for validation) |
| `doerownsobject` | Whether doer owns the inventory object |
| `onsuccess` | Array of success callback functions |
| `onfail` | Array of failure callback functions |
| `options` | Additional action options |
| `autoequipped` | Whether inventory object was auto-equipped |
| `skin` | Skin variant for the action |
| `validfn` | Custom validation function |

## Core Methods

### Action Execution

#### Do Method

Executes the buffered action with validation and callback handling:

```lua
function BufferedAction:Do()
    if not self:IsValid() then
        return false
    end
    
    local success, reason = self.action.fn(self)
    if success then
        if self.invobject ~= nil and self.invobject:IsValid() then
            self.invobject:OnUsedAsItem(self.action, self.doer, self.target)
        end
        self:Succeed()
    else
        self:Fail()
    end
    return success, reason
end
```

**Returns**: `success` (boolean), `reason` (string, optional)

### Validation System

#### IsValid Method

Comprehensive validation of action prerequisites:

```lua
function BufferedAction:IsValid()
    return (self.invobject == nil or self.invobject:IsValid()) and
           (self.doer == nil or (self.doer:IsValid() and 
            (not self.autoequipped or self.doer.replica.inventory:GetActiveItem() == nil))) and
           (self.target == nil or (self.target:IsValid() and 
            self.initialtargetowner == (self.target.components.inventoryitem ~= nil and 
            self.target.components.inventoryitem.owner or nil))) and
           (self.pos == nil or self.pos.walkable_platform == nil or 
            self.pos.walkable_platform:IsValid()) and
           (not self.doerownsobject or (self.doer ~= nil and self.invobject ~= nil and 
            self.invobject.replica.inventoryitem ~= nil and 
            self.invobject.replica.inventoryitem:IsHeldBy(self.doer))) and
           (self.validfn == nil or self.validfn(self)) and
           (not TheWorld.ismastersim or (self.action.validfn == nil or self.action.validfn(self)))
end
```

**Validation Checks**:
- Inventory object validity
- Doer entity validity and equipment state
- Target entity validity and ownership consistency
- Position and platform validity
- Inventory object ownership
- Custom validation functions
- Action-specific validation

#### TestForStart Method

Alias for IsValid method for compatibility:

```lua
BufferedAction.TestForStart = BufferedAction.IsValid
```

### Display and Debug

#### GetActionString Method

Retrieves human-readable action description:

```lua
function BufferedAction:GetActionString()
    local str, overriden = nil, nil
    if self.doer ~= nil and self.doer.ActionStringOverride ~= nil then
        str, overriden = self.doer:ActionStringOverride(self)
    end
    if str ~= nil then
        return str, overriden
    elseif self.action.stroverridefn ~= nil then
        str = self.action.stroverridefn(self)
        if str ~= nil then
            return str, true
        end
    end
    return GetActionString(self.action.id, self.action.strfn ~= nil and self.action.strfn(self) or nil)
end
```

**Priority Order**:
1. Doer-specific action string override
2. Action-specific string override function
3. Standard action string lookup

#### ToString Method

Debug representation of the buffered action:

```lua
function BufferedAction:__tostring()
    return (self:GetActionString().." "..tostring(self.target))
        ..(self.invobject ~= nil and (" With Inv: "..tostring(self.invobject)) or "")
        ..(self.recipe ~= nil and (" Recipe: "..self.recipe) or "")
end
```

### Callback Management

#### AddSuccessAction

Registers callback for successful action execution:

```lua
function BufferedAction:AddSuccessAction(fn)
    table.insert(self.onsuccess, fn)
end
```

#### AddFailAction

Registers callback for failed action execution:

```lua
function BufferedAction:AddFailAction(fn)
    table.insert(self.onfail, fn)
end
```

#### Succeed Method

Executes all success callbacks and cleans up:

```lua
function BufferedAction:Succeed()
    for k, v in pairs(self.onsuccess) do
        v()
    end
    self.onsuccess = {}
    self.onfail = {}
end
```

#### Fail Method

Executes all failure callbacks and cleans up:

```lua
function BufferedAction:Fail()
    for k,v in pairs(self.onfail) do
        v()
    end
    self.onsuccess = {}
    self.onfail = {}
end
```

### Position Management

#### GetActionPoint

Returns static position as Vector3:

```lua
function BufferedAction:GetActionPoint()
    -- returns a Vector3 or nil
    return self.pos ~= nil and self.pos:GetPosition() or nil
end
```

#### GetDynamicActionPoint

Returns dynamic position object:

```lua
function BufferedAction:GetDynamicActionPoint()
    -- returns a DynamicPosition or nil
    return self.pos
end
```

#### SetActionPoint

Sets action position with dynamic positioning:

```lua
function BufferedAction:SetActionPoint(pt)
    self.pos = DynamicPosition(pt)
end
```

## Implementation Examples

### Basic Action Creation

```lua
-- Create a simple action to chop a tree
local action = ACTIONS.CHOP
local tree = GetClosestEntity(player, 10, nil, {"tree"})

local buffered_action = BufferedAction(
    player,      -- doer
    tree,        -- target
    action,      -- action
    nil,         -- invobject (no tool needed)
    nil,         -- pos (use target position)
    nil,         -- recipe
    nil,         -- distance (use action default)
    false        -- forced
)

-- Execute the action
local success = buffered_action:Do()
```

### Tool-Based Action

```lua
-- Create action using a tool
local axe = player.components.inventory:GetActiveItem()
local tree = GetClosestEntity(player, 10, nil, {"tree"})

if axe and axe:HasTag("axe") then
    local buffered_action = BufferedAction(
        player,    -- doer
        tree,      -- target
        ACTIONS.CHOP, -- action
        axe,       -- invobject (tool)
        nil,       -- pos
        nil,       -- recipe
        4,         -- distance (custom range)
        false      -- forced
    )
    
    -- Add callbacks
    buffered_action:AddSuccessAction(function()
        print("Tree chopped successfully!")
    end)
    
    buffered_action:AddFailAction(function()
        print("Failed to chop tree")
    end)
    
    local success = buffered_action:Do()
end
```

### Position-Based Action

```lua
-- Create action at specific position
local dig_pos = Vector3(100, 0, 50)
local shovel = player.components.inventory:FindItem(function(item)
    return item:HasTag("shovel")
end)

if shovel then
    local buffered_action = BufferedAction(
        player,           -- doer
        nil,              -- target (no specific target)
        ACTIONS.DIG,      -- action
        shovel,           -- invobject
        dig_pos,          -- pos (specific position)
        nil,              -- recipe
        2,                -- distance
        false             -- forced
    )
    
    if buffered_action:IsValid() then
        local success = buffered_action:Do()
    end
end
```

### Crafting Action

```lua
-- Create crafting action
local recipe_name = "axe"
local science_machine = GetClosestEntity(player, 20, nil, {"prototyper"})

local buffered_action = BufferedAction(
    player,           -- doer
    science_machine,  -- target (crafting station)
    ACTIONS.BUILD,    -- action
    nil,              -- invobject
    nil,              -- pos
    recipe_name,      -- recipe
    3,                -- distance
    false             -- forced
)

-- Validate before execution
if buffered_action:IsValid() then
    local success, reason = buffered_action:Do()
    if not success then
        print("Crafting failed:", reason)
    end
end
```

### Advanced Action with Custom Validation

```lua
-- Action with custom validation logic
local buffered_action = BufferedAction(
    player,
    target,
    ACTIONS.PICKUP,
    nil,
    nil,
    nil,
    2,
    false
)

-- Add custom validation
buffered_action.validfn = function(action)
    -- Only allow pickup during day
    if TheWorld.state.isday then
        return true
    else
        return false, "Can only pickup during day"
    end
end

-- Add sophisticated callbacks
buffered_action:AddSuccessAction(function()
    player.components.talker:Say("Got it!")
end)

buffered_action:AddFailAction(function()
    player.components.talker:Say("Can't pick that up right now")
end)

if buffered_action:IsValid() then
    buffered_action:Do()
end
```

## Integration with Game Systems

### Component Integration

```lua
-- Integration with inventory component
function PerformInventoryAction(player, action_id, target)
    local inventory = player.components.inventory
    local active_item = inventory:GetActiveItem()
    
    local buffered_action = BufferedAction(
        player,
        target,
        ACTIONS[action_id],
        active_item,
        nil, nil, nil, false
    )
    
    -- Validate inventory state
    if active_item and not active_item:IsValid() then
        return false, "Invalid inventory item"
    end
    
    return buffered_action:Do()
end
```

### Locomotor Integration

```lua
-- Action that requires movement
function ActionWithMovement(player, target, action)
    local buffered_action = BufferedAction(
        player, target, action, nil, nil, nil, nil, false
    )
    
    -- Check if player needs to move to target
    local dist = player:GetDistanceSqToInst(target)
    if dist > (buffered_action.distance * buffered_action.distance) then
        -- Queue action after movement
        player.components.locomotor:GoToEntity(target, nil, true)
        
        -- Defer action execution
        player:DoTaskInTime(1.0, function()
            if buffered_action:IsValid() then
                buffered_action:Do()
            end
        end)
    else
        -- Execute immediately
        return buffered_action:Do()
    end
end
```

### State Graph Integration

```lua
-- Action that triggers animation
function AnimatedAction(player, action, target)
    local buffered_action = BufferedAction(
        player, target, action, nil, nil, nil, nil, false
    )
    
    -- Play animation before action
    if player.components.stategraph then
        player.components.stategraph:PushEvent("startaction", {
            action = buffered_action
        })
    end
    
    -- Add animation callback
    buffered_action:AddSuccessAction(function()
        if player.components.stategraph then
            player.components.stategraph:PushEvent("actioncomplete")
        end
    end)
    
    return buffered_action
end
```

## Error Handling and Debugging

### Validation Debugging

```lua
function DebugBufferedAction(buffered_action)
    print("=== Buffered Action Debug ===")
    print("Action:", buffered_action.action.id)
    print("Doer:", buffered_action.doer)
    print("Target:", buffered_action.target)
    print("Inventory Object:", buffered_action.invobject)
    print("Position:", buffered_action.pos)
    print("Recipe:", buffered_action.recipe)
    print("Valid:", buffered_action:IsValid())
    
    -- Test individual validation components
    if buffered_action.doer and not buffered_action.doer:IsValid() then
        print("ERROR: Invalid doer")
    end
    
    if buffered_action.target and not buffered_action.target:IsValid() then
        print("ERROR: Invalid target")
    end
    
    if buffered_action.invobject and not buffered_action.invobject:IsValid() then
        print("ERROR: Invalid inventory object")
    end
end
```

### Safe Action Execution

```lua
function SafeExecuteAction(buffered_action)
    local success, error_msg = pcall(function()
        if not buffered_action:IsValid() then
            return false, "Action validation failed"
        end
        
        return buffered_action:Do()
    end)
    
    if not success then
        print("Action execution error:", error_msg)
        buffered_action:Fail()
        return false
    end
    
    return success
end
```

### Action Queue Management

```lua
-- Simple action queue system
local ActionQueue = Class(function(self)
    self.queue = {}
    self.processing = false
end)

function ActionQueue:Add(buffered_action)
    table.insert(self.queue, buffered_action)
end

function ActionQueue:ProcessNext()
    if self.processing or #self.queue == 0 then
        return
    end
    
    self.processing = true
    local action = table.remove(self.queue, 1)
    
    -- Add completion callback to process next action
    action:AddSuccessAction(function()
        self.processing = false
        self:ProcessNext()
    end)
    
    action:AddFailAction(function()
        self.processing = false
        self:ProcessNext()
    end)
    
    if action:IsValid() then
        action:Do()
    else
        action:Fail()
    end
end
```

## Performance Considerations

### Action Validation Optimization

```lua
-- Cache validation results for expensive checks
function OptimizedBufferedAction(doer, target, action, invobject)
    local buffered_action = BufferedAction(doer, target, action, invobject)
    
    -- Cache validation state
    local last_validation_time = 0
    local cached_validity = nil
    
    local original_isvalid = buffered_action.IsValid
    buffered_action.IsValid = function(self)
        local current_time = GetTime()
        
        -- Use cached result if recent
        if current_time - last_validation_time < 0.1 and cached_validity ~= nil then
            return cached_validity
        end
        
        -- Perform full validation
        cached_validity = original_isvalid(self)
        last_validation_time = current_time
        
        return cached_validity
    end
    
    return buffered_action
end
```

### Memory Management

```lua
-- Proper cleanup for long-lived actions
function CreateManagedAction(doer, target, action, invobject)
    local buffered_action = BufferedAction(doer, target, action, invobject)
    
    -- Track for cleanup
    local cleanup_callbacks = {}
    
    local original_succeed = buffered_action.Succeed
    buffered_action.Succeed = function(self)
        original_succeed(self)
        -- Cleanup managed resources
        for _, cleanup in ipairs(cleanup_callbacks) do
            cleanup()
        end
    end
    
    local original_fail = buffered_action.Fail
    buffered_action.Fail = function(self)
        original_fail(self)
        -- Cleanup managed resources
        for _, cleanup in ipairs(cleanup_callbacks) do
            cleanup()
        end
    end
    
    -- Add cleanup function
    buffered_action.AddCleanup = function(self, fn)
        table.insert(cleanup_callbacks, fn)
    end
    
    return buffered_action
end
```

## Best Practices

### Design Guidelines

- **Validate Early**: Always check `IsValid()` before executing actions
- **Use Callbacks**: Leverage success/failure callbacks for robust handling
- **Preserve Context**: Include all necessary information in action creation
- **Handle Failures**: Always provide meaningful failure handling
- **Clean Up**: Ensure callbacks and references are properly cleaned up

### Performance Best Practices

- Cache validation results for expensive checks
- Avoid creating unnecessary buffered actions
- Clean up callback functions to prevent memory leaks
- Use appropriate distance and timing parameters
- Consider using action queues for multiple actions

### Integration Guidelines

- Work with component systems for state validation
- Integrate with locomotor for movement-based actions
- Coordinate with state graphs for animation timing
- Use event system for action completion notifications
- Respect game state for multiplayer compatibility

## Related Systems

- [Actions](./actions.md) - Action definitions that buffered actions execute
- [Components](../components/index.md) - Entity components that actions interact with
- [Brain System](./brain.md) - AI system that uses buffered actions
- [State Graphs](../stategraphs/index.md) - Animation system coordinated with actions

## Status: 🟢 Stable

The Buffered Action system is stable and fundamental to DST's action execution architecture. The API is mature with minimal changes focusing on performance optimizations and edge case handling.
