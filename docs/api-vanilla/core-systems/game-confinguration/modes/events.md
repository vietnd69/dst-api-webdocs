---
id: events
title: Event System
description: Core event handling system for game events and messaging
sidebar_position: 3
slug: api-vanilla/core-systems/events
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Event System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The event system provides a robust mechanism for handling game events and inter-component communication in Don't Starve Together. It consists of `EventHandler` and `EventProcessor` classes that enable objects to listen for and respond to various game events.

## Usage Example

```lua
-- Create an event processor
local event_processor = EventProcessor()

-- Add an event handler
local handler = event_processor:AddEventHandler("player_died", function(player, cause)
    print("Player", player, "died from", cause)
end)

-- Trigger an event
event_processor:HandleEvent("player_died", ThePlayer, "starvation")

-- Remove the handler when no longer needed
handler:Remove()
```

## Classes

### EventHandler

#### Constructor

##### EventHandler(event, fn, processor) {#eventhandler-constructor}

**Status:** `stable`

**Description:**
Creates a new event handler that links an event name to a callback function within an event processor.

**Parameters:**
- `event` (string): The name of the event to handle
- `fn` (function): The callback function to execute when the event is triggered
- `processor` (EventProcessor): The event processor this handler belongs to

**Returns:**
- (EventHandler): New EventHandler instance

**Example:**
```lua
local function on_player_death(player, cause)
    print("Player died:", player.name, "cause:", cause)
end

local handler = EventHandler("player_died", on_player_death, event_processor)
```

#### Methods

##### handler:Remove() {#eventhandler-remove}

**Status:** `stable`

**Description:**
Removes this event handler from its associated event processor. After calling this method, the handler will no longer respond to events.

**Parameters:**
None

**Returns:**
None

**Example:**
```lua
local handler = event_processor:AddEventHandler("player_died", function() end)
-- Later, when the handler is no longer needed
handler:Remove()
```

### EventProcessor

#### Constructor

##### EventProcessor() {#eventprocessor-constructor}

**Status:** `stable`

**Description:**
Creates a new event processor that can manage multiple event handlers and dispatch events to them.

**Parameters:**
None

**Returns:**
- (EventProcessor): New EventProcessor instance

**Example:**
```lua
local event_processor = EventProcessor()
```

#### Methods

##### event_processor:AddEventHandler(event, fn) {#add-event-handler}

**Status:** `stable`

**Description:**
Adds a new event handler for the specified event. Returns an EventHandler object that can be used to remove the handler later.

**Parameters:**
- `event` (string): The name of the event to listen for
- `fn` (function): The callback function to execute when the event occurs

**Returns:**
- (EventHandler): The created event handler object

**Example:**
```lua
-- Simple event handler
local handler = event_processor:AddEventHandler("item_picked", function(item, player)
    print(player.name, "picked up", item.name)
end)

-- Handler with multiple parameters
local combat_handler = event_processor:AddEventHandler("combat_attack", function(attacker, target, weapon, damage)
    print(attacker.name, "attacked", target.name, "with", weapon.name, "for", damage, "damage")
end)
```

##### event_processor:RemoveHandler(handler) {#remove-handler}

**Status:** `stable`

**Description:**
Removes the specified event handler from this processor. This is typically called internally by the handler's Remove() method.

**Parameters:**
- `handler` (EventHandler): The event handler to remove

**Returns:**
None

**Example:**
```lua
-- Usually called internally by handler:Remove(), but can be called directly
local handler = event_processor:AddEventHandler("test_event", function() end)
event_processor:RemoveHandler(handler)
```

##### event_processor:GetHandlersForEvent(event) {#get-handlers-for-event}

**Status:** `stable`

**Description:**
Returns a table containing all handlers registered for the specified event. The returned table uses handlers as keys with boolean true values.

**Parameters:**
- `event` (string): The event name to get handlers for

**Returns:**
- (table): Table of handlers for the event (may be empty)

**Example:**
```lua
local handlers = event_processor:GetHandlersForEvent("player_died")
local count = 0
for handler, _ in pairs(handlers) do
    count = count + 1
end
print("Number of handlers for player_died:", count)
```

##### event_processor:HandleEvent(event, ...) {#handle-event}

**Status:** `stable`

**Description:**
Triggers all registered handlers for the specified event, passing any additional arguments to each handler function.

**Parameters:**
- `event` (string): The name of the event to trigger
- `...` (any): Additional arguments to pass to the event handlers

**Returns:**
None

**Example:**
```lua
-- Trigger a simple event
event_processor:HandleEvent("game_started")

-- Trigger event with data
event_processor:HandleEvent("player_damaged", ThePlayer, 25, "fire")

-- Trigger event with complex data
local item_data = {name = "log", quantity = 5, durability = 100}
event_processor:HandleEvent("item_crafted", ThePlayer, item_data)
```

## Common Usage Patterns

### Entity Event Handling

Most game entities use event processors to handle various state changes:

```lua
-- Typical entity setup
local entity = CreateEntity()
entity.event_processor = EventProcessor()

-- Add health change handler
entity.event_processor:AddEventHandler("health_changed", function(old_health, new_health)
    if new_health <= 0 then
        entity:TriggerDeath()
    end
end)

-- Add inventory change handler
entity.event_processor:AddEventHandler("item_added", function(item, slot)
    entity:UpdateCarryCapacity()
end)
```

### Component Communication

Events provide loose coupling between game components:

```lua
-- Health component triggers event
local health_component = entity.components.health
health_component.event_processor:HandleEvent("health_delta", -10, "poison")

-- Combat component listens for health events
local combat_handler = health_component.event_processor:AddEventHandler("health_delta", function(delta, source)
    if source == "combat" and delta < 0 then
        entity:PlayHitEffect()
    end
end)
```

### Temporary Event Handling

For temporary event listeners that need cleanup:

```lua
local function setup_temporary_handler(duration)
    local handler = event_processor:AddEventHandler("player_moved", function(x, y, z)
        print("Player is at:", x, y, z)
    end)
    
    -- Remove handler after duration
    ThePlayer:DoTaskInTime(duration, function()
        handler:Remove()
        print("Movement tracking stopped")
    end)
end

setup_temporary_handler(30) -- Track for 30 seconds
```

## Performance Considerations

### Handler Management

- **Remove unused handlers**: Always clean up event handlers when they're no longer needed
- **Avoid excessive handlers**: Too many handlers for frequent events can impact performance
- **Use specific events**: Prefer specific event names over generic ones to reduce unnecessary callbacks

### Event Frequency

```lua
-- Good: Specific, infrequent events
event_processor:HandleEvent("player_level_up", new_level)
event_processor:HandleEvent("boss_defeated", boss_name)

-- Be careful: High-frequency events
event_processor:HandleEvent("player_moved", x, y, z) -- Called every frame
event_processor:HandleEvent("combat_tick", damage) -- Called very frequently
```

## Error Handling

Event handlers should include error handling to prevent one failing handler from affecting others:

```lua
event_processor:AddEventHandler("risky_operation", function(data)
    local success, error_msg = pcall(function()
        -- Potentially failing operation
        process_complex_data(data)
    end)
    
    if not success then
        print("Event handler error:", error_msg)
    end
end)
```

## Integration with Game Systems

### Entity Framework

Most game entities include an event processor for handling state changes and inter-component communication.

### Component System

Components use events to communicate changes without tight coupling, allowing for flexible and modular game logic.

### Networking

Events can be used to trigger network synchronization when important game state changes occur.

## Related Modules

- [Entity Script](./entityscript.md): Entity framework that commonly uses event processors
- [Components](./components/index.md): Game components that communicate via events
- [Stategraphs](../stategraphs/index.md): State machines that trigger events on state changes
- [Brain System](./brain.md): AI brains that respond to game events
