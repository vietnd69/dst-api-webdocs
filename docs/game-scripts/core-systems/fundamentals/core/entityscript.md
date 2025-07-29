---
id: entityscript
title: EntityScript
description: Core class representing all game entities and their behavior management system
sidebar_position: 3

last_updated: 2025-01-27
build_version: 676042
change_status: stable
---

# EntityScript

## Version History
| Build Version | Change Date | Change Type | Description |
|---|---|---|---|
| 676042 | 2025-01-27 | stable | Current version |

## Overview

The `EntityScript` class is the core foundation of all game entities in Don't Starve Together. It wraps the low-level `Entity` object and provides high-level functionality for managing components, events, state graphs, AI brains, networking, and persistence. Every prefab instance in the game is an EntityScript that handles the entity's lifecycle from creation to destruction.

## Usage Example

```lua
-- Creating a new entity with EntityScript functionality
local inst = CreateEntity()
local entityscript = EntityScript(inst)

-- Adding components
inst:AddComponent("health")
inst:AddComponent("inventory")

-- Setting up events
inst:ListenForEvent("death", function() print("Entity died!") end)

-- Managing state
inst:SetStateGraph("SGplayer")
```

## Class Constructor

### EntityScript(entity) {#constructor}

**Status:** `stable`

**Description:**
Creates a new EntityScript instance that wraps the provided Entity object and initializes all core systems.

**Parameters:**
- `entity` (Entity): The low-level Entity object to wrap

**Properties Initialized:**
- `entity`: Reference to the wrapped Entity object
- `components`: Table of attached components
- `GUID`: Unique identifier for this entity
- `spawntime`: Time when entity was created
- `persists`: Whether entity should be saved/loaded
- `inlimbo`: Whether entity is currently in limbo (inactive)

## Core Properties

### inst.GUID

**Type:** `number`

**Status:** `stable`

**Description:** Unique identifier for this entity instance across the game world.

### inst.spawntime

**Type:** `number`

**Status:** `stable`

**Description:** Game time when this entity was created, used for calculating age.

### inst.persists

**Type:** `boolean`

**Status:** `stable`

**Description:** Whether this entity should be saved to disk and persist between game sessions.

### inst.inlimbo

**Type:** `boolean`

**Status:** `stable`

**Description:** Whether this entity is currently in limbo (inactive/paused state).

### inst.prefab

**Type:** `string`

**Status:** `stable`

**Description:** The prefab name this entity was spawned from.

### inst.components

**Type:** `table`

**Status:** `stable`

**Description:** Table containing all components attached to this entity, indexed by component name.

## Component Management

### inst:AddComponent(name) {#add-component}

**Status:** `stable`

**Description:**
Adds a component to the entity. Components provide specific functionality like health, inventory, or movement.

**Parameters:**
- `name` (string): Name of the component to add

**Returns:**
- (Component): The newly added component instance

**Example:**
```lua
local health_component = inst:AddComponent("health")
health_component:SetMaxHealth(100)
```

**Version History:**
- Available since initial implementation

### inst:RemoveComponent(name) {#remove-component}

**Status:** `stable`

**Description:**
Removes a component from the entity and cleans up all associated functionality.

**Parameters:**
- `name` (string): Name of the component to remove

**Example:**
```lua
inst:RemoveComponent("health")
```

## Event System

### inst:ListenForEvent(event, fn, source) {#listen-for-event}

**Status:** `stable`

**Description:**
Registers a function to be called when a specific event is triggered on this or another entity.

**Parameters:**
- `event` (string): Name of the event to listen for
- `fn` (function): Function to call when event occurs
- `source` (EntityScript, optional): Entity to listen to (defaults to self)

**Example:**
```lua
inst:ListenForEvent("death", function(inst, data)
    print("Entity died with data:", data)
end)
```

### inst:RemoveEventCallback(event, fn, source) {#remove-event-callback}

**Status:** `stable`

**Description:**
Removes a previously registered event listener.

**Parameters:**
- `event` (string): Name of the event
- `fn` (function): The exact function that was registered
- `source` (EntityScript, optional): Source entity (defaults to self)

### inst:PushEvent(event, data) {#push-event}

**Status:** `stable`

**Description:**
Triggers an event on this entity, calling all registered listeners.

**Parameters:**
- `event` (string): Name of the event to trigger
- `data` (any, optional): Data to pass to event handlers

**Example:**
```lua
inst:PushEvent("attacked", {attacker = player, damage = 25})
```

## Task Management

### inst:DoTaskInTime(time, fn, ...) {#do-task-in-time}

**Status:** `stable`

**Description:**
Schedules a function to be executed after a specified delay.

**Parameters:**
- `time` (number): Delay in seconds
- `fn` (function): Function to execute
- `...`: Additional arguments to pass to the function

**Returns:**
- (Task): Task object that can be cancelled

**Example:**
```lua
local task = inst:DoTaskInTime(5, function()
    print("This runs after 5 seconds")
end)
```

### inst:DoPeriodicTask(time, fn, initialdelay, ...) {#do-periodic-task}

**Status:** `stable`

**Description:**
Schedules a function to be executed repeatedly at regular intervals.

**Parameters:**
- `time` (number): Interval between executions in seconds
- `fn` (function): Function to execute
- `initialdelay` (number, optional): Initial delay before first execution
- `...`: Additional arguments to pass to the function

**Returns:**
- (Task): Task object that can be cancelled

**Example:**
```lua
local periodic = inst:DoPeriodicTask(1, function()
    print("This runs every second")
end, 2) -- Start after 2 seconds
```

### inst:CancelAllPendingTasks() {#cancel-all-pending-tasks}

**Status:** `stable`

**Description:**
Cancels all scheduled tasks for this entity.

## State Management

### inst:SetStateGraph(name) {#set-state-graph}

**Status:** `stable`

**Description:**
Assigns a state graph to control this entity's animation and behavior states.

**Parameters:**
- `name` (string): Name of the state graph file

**Returns:**
- (StateGraphInstance): The created state graph instance

**Example:**
```lua
inst:SetStateGraph("SGplayer")
```

### inst:SetBrain(brainfn) {#set-brain}

**Status:** `stable`

**Description:**
Assigns an AI brain function to control this entity's autonomous behavior.

**Parameters:**
- `brainfn` (function): Function that returns a brain instance

**Example:**
```lua
inst:SetBrain(require("brains/pigbrain"))
```

## Position and Physics

### inst:GetPosition() {#get-position}

**Status:** `stable`

**Description:**
Gets the current world position of the entity.

**Returns:**
- (Point): Position as a Point object

**Example:**
```lua
local pos = inst:GetPosition()
print("Entity is at:", pos.x, pos.z)
```

### inst:GetDistanceSqToInst(inst) {#get-distance-sq-to-inst}

**Status:** `stable`

**Description:**
Calculates the squared distance to another entity (more efficient than actual distance).

**Parameters:**
- `inst` (EntityScript): Target entity

**Returns:**
- (number): Squared distance

**Example:**
```lua
local dist_sq = inst:GetDistanceSqToInst(target)
if dist_sq < 9 then -- Within 3 units
    print("Target is close!")
end
```

### inst:IsNear(otherinst, dist) {#is-near}

**Status:** `stable`

**Description:**
Checks if this entity is within a certain distance of another entity.

**Parameters:**
- `otherinst` (EntityScript): Target entity
- `dist` (number): Maximum distance

**Returns:**
- (boolean): True if within distance

**Example:**
```lua
if inst:IsNear(player, 5) then
    print("Player is nearby!")
end
```

### inst:FacePoint(x, y, z) {#face-point}

**Status:** `stable`

**Description:**
Rotates the entity to face a specific world position.

**Parameters:**
- `x` (number): X coordinate
- `y` (number): Y coordinate (optional)
- `z` (number): Z coordinate

**Example:**
```lua
inst:FacePoint(player.Transform:GetWorldPosition())
```

## Limbo Management

### inst:RemoveFromScene() {#remove-from-scene}

**Status:** `stable`

**Description:**
Removes the entity from active simulation, placing it in limbo. The entity becomes inactive but remains in memory.

**Example:**
```lua
inst:RemoveFromScene() -- Entity enters limbo
```

### inst:ReturnToScene() {#return-to-scene}

**Status:** `stable`

**Description:**
Returns the entity from limbo to active simulation.

**Example:**
```lua
inst:ReturnToScene() -- Entity exits limbo
```

### inst:IsInLimbo() {#is-in-limbo}

**Status:** `stable`

**Description:**
Checks if the entity is currently in limbo.

**Returns:**
- (boolean): True if in limbo

## Tag System

### inst:AddTag(tag) {#add-tag}

**Status:** `stable`

**Description:**
Adds a tag to this entity for identification and filtering.

**Parameters:**
- `tag` (string): Tag to add

**Example:**
```lua
inst:AddTag("player")
inst:AddTag("fireimmune")
```

### inst:RemoveTag(tag) {#remove-tag}

**Status:** `stable`

**Description:**
Removes a tag from this entity.

**Parameters:**
- `tag` (string): Tag to remove

### inst:HasTag(tag) {#has-tag}

**Status:** `stable`

**Description:**
Checks if this entity has a specific tag.

**Parameters:**
- `tag` (string): Tag to check for

**Returns:**
- (boolean): True if entity has the tag

**Example:**
```lua
if inst:HasTag("player") then
    print("This is a player!")
end
```

### inst:HasTags(...) {#has-tags}

**Status:** `stable`

**Description:**
Checks if this entity has all of the specified tags.

**Parameters:**
- `...` (string or table): Tags to check for

**Returns:**
- (boolean): True if entity has all tags

**Example:**
```lua
if inst:HasTags("enemy", "aggressive") then
    print("This is an aggressive enemy!")
end
```

## Display Names

### inst:GetDisplayName() {#get-display-name}

**Status:** `stable`

**Description:**
Gets the full display name for this entity, including adjectives and status modifiers.

**Returns:**
- (string): Complete display name

**Example:**
```lua
local name = inst:GetDisplayName()
-- Returns something like "Wet Spoiled Berries"
```

### inst:GetBasicDisplayName() {#get-basic-display-name}

**Status:** `stable`

**Description:**
Gets the basic display name without status modifiers.

**Returns:**
- (string): Basic name

**Example:**
```lua
local name = inst:GetBasicDisplayName()
-- Returns something like "Berries"
```

## Persistence

### inst:GetPersistData() {#get-persist-data}

**Status:** `stable`

**Description:**
Collects save data from all components for persistence.

**Returns:**
- (table): Save data
- (table): Entity references

### inst:SetPersistData(data, newents) {#set-persist-data}

**Status:** `stable`

**Description:**
Loads save data into the entity and its components.

**Parameters:**
- `data` (table): Save data to load
- `newents` (table): Table of newly created entities

## Lifecycle Management

### inst:Remove() {#remove}

**Status:** `stable`

**Description:**
Permanently removes the entity from the game, cleaning up all resources.

**Example:**
```lua
inst:Remove() -- Entity is destroyed
```

### inst:IsValid() {#is-valid}

**Status:** `stable`

**Description:**
Checks if the entity is still valid and hasn't been removed.

**Returns:**
- (boolean): True if entity is valid

**Example:**
```lua
if inst:IsValid() then
    -- Safe to use inst
end
```

## Debug Information

### inst:GetDebugString() {#get-debug-string}

**Status:** `stable`

**Description:**
Returns a detailed debug string with entity information and component states.

**Returns:**
- (string): Debug information

**Example:**
```lua
print(inst:GetDebugString())
-- Outputs detailed entity information
```

### inst:GetTimeAlive() {#get-time-alive}

**Status:** `stable`

**Description:**
Gets how long this entity has been alive.

**Returns:**
- (number): Time alive in seconds

**Example:**
```lua
local age = inst:GetTimeAlive()
print("Entity has been alive for", age, "seconds")
```

## Events

### "onremove"

**Status:** `stable`

**Description:**
Triggered when the entity is about to be removed from the game.

**Example:**
```lua
inst:ListenForEvent("onremove", function(inst)
    print("Entity is being removed!")
end)
```

### "enterlimbo"

**Status:** `stable`

**Description:**
Triggered when the entity enters limbo (becomes inactive).

### "exitlimbo"

**Status:** `stable`

**Description:**
Triggered when the entity exits limbo (becomes active again).

## Common Usage Patterns

### Component-Based Entity Setup
```lua
local inst = CreateEntity()

-- Add core components
inst:AddComponent("health")
inst:AddComponent("inventory")
inst:AddComponent("locomotor")

-- Set up behavior
inst:SetStateGraph("SGplayer")
inst:SetBrain(require("brains/playerbrain"))

-- Add tags for identification
inst:AddTag("player")
inst:AddTag("character")
```

### Event-Driven Behavior
```lua
-- Listen for health changes
inst:ListenForEvent("healthdelta", function(inst, data)
    if data.newpercent <= 0 then
        inst:PushEvent("death")
    end
end)

-- Schedule periodic actions
inst:DoPeriodicTask(1, function()
    -- Check surroundings every second
end)
```

### Position-Based Logic
```lua
-- Find nearby entities
local x, y, z = inst.Transform:GetWorldPosition()
local nearby = TheSim:FindEntities(x, y, z, 10)

-- Face the nearest player
local player = inst:GetNearestPlayer()
if player then
    inst:FacePoint(player.Transform:GetWorldPosition())
end
```

## Related Modules

- [Components Overview](./index.md): Individual component functionality
- [StateGraphs](../stategraphs/index.md): Animation and state management
- [Events](./events.md): Event system details
- [Class](./class.md): Base class system used by EntityScript
