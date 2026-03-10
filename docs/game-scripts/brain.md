---
id: brain
title: Brain
description: Manages AI behavior logic and state for an entity, including behavior tree execution, event handling, sleep/wake cycles, and integration with the global BrainManager update loop.
tags: [ai, brain, behavior, sleep, update]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: fdb4d2f6
system_scope: brain
---

# Brain

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Brain` is a component-like class responsible for managing AI behavior execution and lifecycle for an entity. It holds references to the current behavior tree (`bt`), maintains a queue of pending behaviors, and handles event-driven responses. It integrates with `BrainManager` (a singleton `BrainWrangler` instance) to participate in the global update cycle—automatically waking, sleeping, or hibernating based on behavior needs. Note: Though named `Brain`, it is used as a standalone class and not registered as a component via `AddComponent`; it is attached directly to entities as a property (e.g., `inst.brain = Brain()`).

## Usage example
```lua
local brain = Brain()
inst.brain = brain
brain.inst = inst
brain.bt = MyBehaviorTree()
brain:_Start_Internal()
brain:AddEventHandler(" attacked", function(data) print("Attacked by", data.inst) end)
brain:PushEvent(" myevent", { value = 42 })
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` or `nil` | `nil` | Reference to the owning entity instance. Must be set manually. |
| `currentbehaviour` | `Behavior` or `nil` | `nil` | Currently active behavior node (deprecated naming; use `bt` instead). |
| `behaviourqueue` | `table` | `{}` | Queue of pending behaviors (deprecated; unused in modern code). |
| `events` | `table` | `{}` | Map of event names to handler functions. |
| `bt` | `BehaviorTree` or `nil` | `nil` | The active behavior tree (assumed, though not initialized in constructor). |
| `thinkperiod` | `number` or `nil` | `nil` | Interval (in seconds) between automatic behavior tree updates. |
| `lastthinktime` | `number` or `nil` | `nil` | Timestamp of last manual think trigger. |
| `paused` | `boolean` | `false` | Whether the brain is paused (excluded from updates but not stopped). |
| `stopped` | `boolean` | `true` | Whether the brain is stopped (fully inactive). |

## Main functions
### `ForceUpdate()`
*   **Description:** Forces immediate update of the behavior tree (if present) and wakes the brain from hibernation or sleep to ensure it runs on the next `BrainManager:Update` cycle.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AddEventHandler(event, fn)`
*   **Description:** Registers an event handler function for a specific event name.
*   **Parameters:** `event` (string) - event identifier; `fn` (function) - callback invoked when event is pushed.
*   **Returns:** Nothing.

### `GetSleepTime()`
*   **Description:** Returns the recommended time (in seconds) the brain can remain idle before needing to run again, based on its behavior tree or default logic.
*   **Parameters:** None.
*   **Returns:** `number` - sleep duration in seconds, or `0` if no behavior tree is present.
*   **Error states:** Returns `0` if `bt` is `nil`.

### `:Start(reason)`
*   **Description:** **Deprecated.** Use `inst:RestartBrain(reason)` instead. Starts the brain if not already active.
*   **Parameters:** `reason` (string) - cause for starting (for debugging/logging).
*   **Returns:** Nothing.

### `:_Start_Internal()`
*   **Description:** Internal method called by the entity to start the brain. Initializes the brain, runs optional lifecycle callbacks, and registers with `BrainManager`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if already started (`stopped == false`).

### `OnUpdate()`
*   **Description:** Called by `BrainManager` during its update loop. Executes the `DoUpdate` hook (if defined) and updates the behavior tree (if present).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `:Stop(reason)`
*   **Description:** **Deprecated.** Use `inst:StopBrain(reason)` instead. Stops the brain.
*   **Parameters:** `reason` (string) - cause for stopping (for debugging/logging).
*   **Returns:** Nothing.

### `:_Stop_Internal()`
*   **Description:** Internal method called by the entity to stop the brain. Runs lifecycle callbacks, stops behavior tree, and unregisters from `BrainManager`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if already stopped (`stopped == true`).

### `PushEvent(event, data)`
*   **Description:** Triggers a named event, invoking any registered handler with the provided data.
*   **Parameters:** `event` (string) - event identifier; `data` (any) - payload passed to the handler.
*   **Returns:** Nothing.
*   **Error states:** No effect if no handler is registered for `event`.

### `Pause()`
*   **Description:** Pauses the brain, removing it from `BrainManager`'s update list but preserving its state.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if already paused.

### `Resume()`
*   **Description:** Resumes a paused brain, re-registering it with `BrainManager`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if not paused.

## Events & listeners
- **Listens to:** None — `Brain` does not register listeners itself, but it supports event handling via `AddEventHandler`/`PushEvent` and delegates to handlers.
- **Pushes:** None — `Brain` does not push events; it only provides the mechanism to send them (`PushEvent`).