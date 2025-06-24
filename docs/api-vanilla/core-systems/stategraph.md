---
id: core-systems-stategraph
title: Stategraph
description: Core state machine system for managing entity behaviors and animations
sidebar_position: 45
slug: api-vanilla/core-systems/stategraph
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Stategraph

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `Stategraph` module provides a comprehensive state machine system for managing entity behaviors, animations, and logic flow in Don't Starve Together. It consists of a hierarchical system where StateGraphs contain States, which define specific behaviors and can handle events, timelines, and transitions.

The system is built around several core classes that work together to provide smooth state transitions, event handling, and timeline-based behavior execution.

## Core Architecture

The stategraph system is organized around these main components:

- **StateGraphWrangler**: Global manager for all stategraph instances
- **StateGraph**: Template defining states, events, and action handlers
- **StateGraphInstance**: Runtime instance of a stategraph attached to an entity
- **State**: Individual behavior state with enter/exit/update functions
- **ActionHandler**: Maps game actions to state transitions
- **EventHandler**: Handles events within states
- **TimeEvent**: Timeline-based events within states

## Usage Example

```lua
-- Basic stategraph creation
local states = {
    State{
        name = "idle",
        tags = {"idle"},
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle")
        end,
        events = {
            EventHandler("attacked", function(inst, data)
                inst.sg:GoToState("hit")
            end),
        },
    },
    
    State{
        name = "hit",
        tags = {"busy"},
        onenter = function(inst)
            inst.AnimState:PlayAnimation("hit")
        end,
        timeline = {
            TimeEvent(0.5, function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
}

local events = {
    EventHandler("death", function(inst)
        inst.sg:GoToState("death")
    end),
}

local actionhandlers = {
    ActionHandler(ACTIONS.ATTACK, "attack"),
}

return StateGraph("example", states, events, "idle", actionhandlers)
```

## Classes

### StateGraphWrangler {#stategraphwrangler}

**Status:** `stable`

**Description:**
Global manager that handles the lifecycle and updates of all stategraph instances. Manages hibernation, sleeping, event processing, and update scheduling.

#### Properties

##### .instances

**Type:** `table`

**Status:** `stable`

**Description:** Map of all registered stategraph instances to their current update lists.

##### .updaters

**Type:** `table`

**Status:** `stable`

**Description:** List of stategraph instances that need updating this frame.

##### .hibernaters

**Type:** `table`

**Status:** `stable`

**Description:** List of hibernated stategraph instances that are not actively updating.

##### .haveEvents

**Type:** `table`

**Status:** `stable`

**Description:** List of stategraph instances that have pending events to process.

#### Methods

##### :AddInstance(inst) {#stategraphwrangler-addinstance}

**Status:** `stable`

**Description:**
Registers a stategraph instance with the manager and adds it to the updaters list.

**Parameters:**
- `inst` (StateGraphInstance): The stategraph instance to register

**Example:**
```lua
SGManager:AddInstance(entity.sg)
```

##### :RemoveInstance(inst) {#stategraphwrangler-removeinstance}

**Status:** `stable`

**Description:**
Unregisters a stategraph instance from the manager and cleans up all references.

**Parameters:**
- `inst` (StateGraphInstance): The stategraph instance to unregister

**Example:**
```lua
SGManager:RemoveInstance(entity.sg)
```

##### :Update(current_tick) {#stategraphwrangler-update}

**Status:** `stable`

**Description:**
Main update function called each frame to process all active stategraph instances.

**Parameters:**
- `current_tick` (number): Current game tick

##### :Sleep(inst, time_to_wait) {#stategraphwrangler-sleep}

**Status:** `stable`

**Description:**
Puts a stategraph instance to sleep for a specified duration.

**Parameters:**
- `inst` (StateGraphInstance): The stategraph instance to sleep
- `time_to_wait` (number): Time in seconds to sleep

##### :Hibernate(inst) {#stategraphwrangler-hibernate}

**Status:** `stable`

**Description:**
Hibernates a stategraph instance, removing it from active updates.

**Parameters:**
- `inst` (StateGraphInstance): The stategraph instance to hibernate

##### :Wake(inst) {#stategraphwrangler-wake}

**Status:** `stable`

**Description:**
Wakes a hibernated stategraph instance and returns it to active updates.

**Parameters:**
- `inst` (StateGraphInstance): The stategraph instance to wake

### StateGraph {#stategraph}

**Status:** `stable`

**Description:**
Template class that defines the structure of a state machine, including its states, events, and action handlers.

#### Constructor

```lua
StateGraph(name, states, events, defaultstate, actionhandlers)
```

**Parameters:**
- `name` (string): Unique identifier for this stategraph
- `states` (table): Array of State objects
- `events` (table): Array of EventHandler objects
- `defaultstate` (string): Name of the initial state
- `actionhandlers` (table): Array of ActionHandler objects

#### Properties

##### .name

**Type:** `string`

**Status:** `stable`

**Description:** Unique identifier for this stategraph.

##### .states

**Type:** `table`

**Status:** `stable`

**Description:** Map of state name to State object.

##### .events

**Type:** `table`

**Status:** `stable`

**Description:** Map of event name to EventHandler object.

##### .actionhandlers

**Type:** `table`

**Status:** `stable`

**Description:** Map of action to ActionHandler object.

##### .defaultstate

**Type:** `string`

**Status:** `stable`

**Description:** Name of the default state to enter when starting.

### StateGraphInstance {#stategraphinstance}

**Status:** `stable`

**Description:**
Runtime instance of a StateGraph attached to a specific entity. Manages the current state, handles events, and processes timeline events.

#### Constructor

```lua
StateGraphInstance(stategraph, inst)
```

**Parameters:**
- `stategraph` (StateGraph): The template stategraph to instantiate
- `inst` (Entity): The entity this instance is attached to

#### Properties

##### .currentstate

**Type:** `State`

**Status:** `stable`

**Description:** Currently active state object.

##### .timeinstate

**Type:** `number`

**Status:** `stable`

**Description:** Time in seconds spent in the current state.

##### .tags

**Type:** `table`

**Status:** `stable`

**Description:** Set of tags from the current state.

##### .statemem

**Type:** `table`

**Status:** `stable`

**Description:** Memory table that persists for the duration of the current state.

##### .mem

**Type:** `table`

**Status:** `stable`

**Description:** Memory table that persists across state changes.

#### Methods

##### :GoToState(statename, params) {#stategraphinstance-gotostate}

**Status:** `stable`

**Description:**
Transitions to a new state, calling onexit on the current state and onenter on the new state.

**Parameters:**
- `statename` (string): Name of the state to transition to
- `params` (any): Optional parameters passed to the new state's onenter function

**Example:**
```lua
inst.sg:GoToState("attack", {target = target})
```

##### :HasState(statename) {#stategraphinstance-hasstate}

**Status:** `stable`

**Description:**
Checks if a state with the given name exists in this stategraph.

**Parameters:**
- `statename` (string): Name of the state to check

**Returns:**
- (boolean): True if the state exists

##### :PushEvent(event, data) {#stategraphinstance-pushevent}

**Status:** `stable`

**Description:**
Queues an event to be processed during the next event handling phase.

**Parameters:**
- `event` (string): Name of the event
- `data` (table): Optional event data

**Example:**
```lua
inst.sg:PushEvent("attacked", {attacker = attacker, damage = 10})
```

##### :SetTimeout(time) {#stategraphinstance-settimeout}

**Status:** `stable`

**Description:**
Sets a timeout for the current state. When the timeout expires, the state's ontimeout function is called.

**Parameters:**
- `time` (number): Timeout duration in seconds

**Example:**
```lua
inst.sg:SetTimeout(2.0) -- Timeout after 2 seconds
```

##### :AddStateTag(tag) {#stategraphinstance-addstatetag}

**Status:** `stable`

**Description:**
Adds a tag to the current state and optionally to the entity.

**Parameters:**
- `tag` (string): Tag to add

##### :RemoveStateTag(tag) {#stategraphinstance-removestatetag}

**Status:** `stable`

**Description:**
Removes a tag from the current state and optionally from the entity.

**Parameters:**
- `tag` (string): Tag to remove

##### :HasStateTag(tag) {#stategraphinstance-hasstatetag}

**Status:** `stable`

**Description:**
Checks if the current state has a specific tag.

**Parameters:**
- `tag` (string): Tag to check

**Returns:**
- (boolean): True if the tag is present

##### :HasAnyStateTag(...) {#stategraphinstance-hasanystatetag}

**Status:** `stable`

**Description:**
Checks if the current state has any of the specified tags.

**Parameters:**
- `...` (string): Tags to check for

**Returns:**
- (boolean): True if any of the tags are present

**Example:**
```lua
if inst.sg:HasAnyStateTag("busy", "working") then
    -- Entity is busy
end
```

##### :GetTimeInState() {#stategraphinstance-gettimeinstate}

**Status:** `stable`

**Description:**
Returns the time spent in the current state.

**Returns:**
- (number): Time in seconds

##### :StartAction(bufferedaction) {#stategraphinstance-startaction}

**Status:** `stable`

**Description:**
Attempts to start an action by finding an appropriate action handler.

**Parameters:**
- `bufferedaction` (BufferedAction): The action to start

**Returns:**
- (boolean): True if an action handler was found and executed

##### :Start() {#stategraphinstance-start}

**Status:** `stable`

**Description:**
Starts the stategraph instance and registers it with the global manager.

##### :Stop() {#stategraphinstance-stop}

**Status:** `stable`

**Description:**
Stops the stategraph instance and unregisters it from the global manager.

### State {#state}

**Status:** `stable`

**Description:**
Defines a single state within a stategraph, including its behavior, events, timeline, and tags.

#### Constructor

```lua
State{
    name = "statename",
    tags = {"tag1", "tag2"},
    onenter = function(inst, params) end,
    onexit = function(inst) end,
    onupdate = function(inst, dt) end,
    ontimeout = function(inst) end,
    events = {EventHandler(...)},
    timeline = {TimeEvent(...)}
}
```

#### Properties

##### .name

**Type:** `string`

**Status:** `stable`

**Description:** Unique name identifying this state within its stategraph.

##### .tags

**Type:** `table`

**Status:** `stable`

**Description:** Set of tags that define this state's properties.

##### .onenter

**Type:** `function`

**Status:** `stable`

**Description:** Function called when entering this state.

##### .onexit

**Type:** `function`

**Status:** `stable`

**Description:** Function called when leaving this state.

##### .onupdate

**Type:** `function`

**Status:** `stable`

**Description:** Function called every frame while in this state.

##### .ontimeout

**Type:** `function`

**Status:** `stable`

**Description:** Function called when the state timeout expires.

##### .events

**Type:** `table`

**Status:** `stable`

**Description:** Map of event handlers specific to this state.

##### .timeline

**Type:** `table`

**Status:** `stable`

**Description:** Array of TimeEvent objects executed at specific times.

### ActionHandler {#actionhandler}

**Status:** `stable`

**Description:**
Maps game actions to state transitions with optional conditions.

#### Constructor

```lua
ActionHandler(action, state, condition)
```

**Parameters:**
- `action` (Action): The action that triggers this handler
- `state` (string|function): Target state name or function returning state name
- `condition` (function): Optional condition function

**Example:**
```lua
ActionHandler(ACTIONS.CHOP, "chopping", function(inst)
    return inst.components.worker ~= nil
end)
```

### EventHandler {#eventhandler}

**Status:** `stable`

**Description:**
Handles specific events within states or globally across the stategraph.

#### Constructor

```lua
EventHandler(name, fn)
```

**Parameters:**
- `name` (string): Name of the event to handle
- `fn` (function): Function to call when the event occurs

**Example:**
```lua
EventHandler("attacked", function(inst, data)
    inst.sg:GoToState("hit")
end)
```

### TimeEvent {#timeevent}

**Status:** `stable`

**Description:**
Executes a function at a specific time within a state's timeline.

#### Constructor

```lua
TimeEvent(time, fn)
```

**Parameters:**
- `time` (number): Time in seconds when to execute the function
- `fn` (function): Function to execute

**Example:**
```lua
TimeEvent(0.5, function(inst)
    inst.SoundEmitter:PlaySound("dontstarve/creatures/attack")
end)
```

## Helper Functions

### FrameEvent(frame, fn) {#frameevent}

**Status:** `stable`

**Description:**
Creates a TimeEvent based on frame count instead of seconds.

**Parameters:**
- `frame` (number): Frame number when to execute
- `fn` (function): Function to execute

**Returns:**
- (TimeEvent): TimeEvent object

**Example:**
```lua
FrameEvent(10, function(inst)
    inst.sg:GoToState("idle")
end)
```

### SoundTimeEvent(time, sound_event) {#soundtimeevent}

**Status:** `stable`

**Description:**
Creates a TimeEvent that plays a sound at a specific time.

**Parameters:**
- `time` (number): Time in seconds when to play the sound
- `sound_event` (string): Sound event path

**Returns:**
- (TimeEvent): TimeEvent object that plays the sound

**Example:**
```lua
SoundTimeEvent(0.3, "dontstarve/creatures/footstep")
```

### SoundFrameEvent(frame, sound_event) {#soundframeevent}

**Status:** `stable`

**Description:**
Creates a TimeEvent that plays a sound at a specific frame.

**Parameters:**
- `frame` (number): Frame number when to play the sound
- `sound_event` (string): Sound event path

**Returns:**
- (TimeEvent): TimeEvent object that plays the sound

**Example:**
```lua
SoundFrameEvent(5, "dontstarve/creatures/attack")
```

## Global Variables

### SGManager

**Type:** `StateGraphWrangler`

**Status:** `stable`

**Description:**
Global instance of StateGraphWrangler that manages all stategraph instances in the game.

**Example:**
```lua
-- Add instance to global manager
SGManager:AddInstance(inst.sg)

-- Remove instance from global manager
SGManager:RemoveInstance(inst.sg)
```

## Common State Tags

The following tags have special meaning when used in states:

| Tag | Description |
|-----|-------------|
| `idle` | Entity is idle and available for interactions |
| `busy` | Entity is busy and should not be interrupted |
| `moving` | Entity is in motion |
| `attack` | Entity is performing an attack |
| `working` | Entity is performing work |
| `sleeping` | Entity is sleeping |
| `invisible` | Entity should be treated as invisible |
| `noattack` | Entity cannot be attacked |
| `nopredict` | State should not use client prediction |
| `autopredict` | State should automatically use prediction |

## Best Practices

### State Design
- Keep states focused on a single behavior or animation
- Use descriptive state names that clearly indicate purpose
- Include appropriate tags to communicate state properties
- Use timeline events for precise timing of effects

### Event Handling
- Handle events at the most appropriate level (state vs stategraph)
- Use event data to pass relevant information
- Consider using PushEvent for delayed event processing

### Memory Management
- Use `statemem` for data that should reset between states
- Use `mem` for data that should persist across states
- Clear unused memory to prevent leaks

### Performance
- Minimize onupdate functions when possible
- Use timeline events instead of constant polling
- Hibernate stategraphs when entities are not active

## Common Usage Patterns

### Basic Animation State
```lua
State{
    name = "walk",
    tags = {"moving"},
    onenter = function(inst)
        inst.AnimState:PlayAnimation("walk_loop", true)
    end,
    onexit = function(inst)
        inst.AnimState:Stop()
    end,
}
```

### Timed Action State
```lua
State{
    name = "work",
    tags = {"busy", "working"},
    onenter = function(inst)
        inst.AnimState:PlayAnimation("work")
        inst.sg:SetTimeout(2.0)
    end,
    ontimeout = function(inst)
        inst.sg:GoToState("idle")
    end,
}
```

### Event-Driven State
```lua
State{
    name = "vulnerable",
    tags = {"idle"},
    events = {
        EventHandler("attacked", function(inst, data)
            inst.sg:GoToState("hit", data)
        end),
    },
}
```

### Timeline-Based State
```lua
State{
    name = "attack",
    tags = {"attack", "busy"},
    onenter = function(inst)
        inst.AnimState:PlayAnimation("attack")
    end,
    timeline = {
        TimeEvent(0.2, function(inst)
            inst:PerformBufferedAction()
        end),
        TimeEvent(0.8, function(inst)
            inst.sg:GoToState("idle")
        end),
    },
}
```

## Related Modules

- [AnimState](./animstate.md): Animation control system used by stategraphs
- [BufferedAction](./bufferedaction.md): Action system integrated with stategraphs
- [Events](./events.md): Event system used for communication
- [EntityScript](./entityscript.md): Base entity functionality
