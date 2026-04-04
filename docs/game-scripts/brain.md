---
id: brain
title: Brain
description: Manages AI behavior trees and scheduling for entity intelligence.
tags: [ai, brain, scheduling, entity]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: fdb4d2f6
system_scope: brain
---

# Brain

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
The `brain.lua` file defines the core artificial intelligence system for entities. It consists of two main classes: `Brain`, which represents the behavior logic attached to a specific entity, and `BrainWrangler`, which manages the global update loop, scheduling, and hibernation states for all active brains. The `BrainManager` global instance handles ticking brains based on sleep timers or activity status, ensuring AI only processes when necessary to optimize performance.

## Usage example
```lua
local Brain = require("brain")

-- Create a custom brain by extending the base class
local MyBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
    self.inst = inst
    -- Initialize behavior tree here
end)

function MyBrain:OnUpdate()
    -- Custom update logic
    print("Brain thinking...")
end

-- Attach to an entity (typically via RunBrain helper)
local inst = SpawnPrefab("beefalo")
inst.brain = MyBrain(inst)
inst.brain:_Start_Internal()
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance associated with this brain. |
| `currentbehaviour` | any | `nil` | Tracks the currently active behavior node. |
| `behaviourqueue` | table | `{}` | Queue for pending behavior actions. |
| `events` | table | `{}` | Internal table mapping event names to handler functions. |
| `thinkperiod` | any | `nil` | Configuration for thinking intervals. |
| `lastthinktime` | any | `nil` | Timestamp of the last update cycle. |
| `paused` | boolean | `false` | Indicates if the brain is currently paused. |
| `stopped` | boolean | `true` | Indicates if the brain has been stopped. |

## Main functions
### `BrainWrangler:AddInstance(inst)`
*   **Description:** Registers a brain instance to the active updaters list.
*   **Parameters:** `inst` (table) - The brain object to add.
*   **Returns:** Nothing.

### `BrainWrangler:RemoveInstance(inst)`
*   **Description:** Completely removes a brain from all management lists (updaters, hibernaters, tickwaiters).
*   **Parameters:** `inst` (table) - The brain object to remove.
*   **Returns:** Nothing.

### `BrainWrangler:Sleep(inst, time_to_wait)`
*   **Description:** Schedules a brain to wake up after a specific duration. Moves the brain to a tickwaiter list.
*   **Parameters:** `inst` (table) - The brain object. `time_to_wait` (number) - Duration in seconds.
*   **Returns:** Nothing.

### `BrainWrangler:Wake(inst)`
*   **Description:** Moves a brain from hibernation or sleep back to the active updaters list.
*   **Parameters:** `inst` (table) - The brain object.
*   **Returns:** Nothing.

### `Brain:ForceUpdate()`
*   **Description:** Forces an immediate update on the behavior tree and wakes the brain manager.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Brain:AddEventHandler(event, fn)`
*   **Description:** Registers a callback function for a custom internal event name.
*   **Parameters:** `event` (string) - The event identifier. `fn` (function) - The callback to execute.
*   **Returns:** Nothing.

### `Brain:GetSleepTime()`
*   **Description:** Queries the behavior tree for the recommended sleep duration.
*   **Parameters:** None.
*   **Returns:** `number` - Time in seconds, or `0` if no behavior tree is attached.

### `Brain:Pause()`
*   **Description:** Pauses the brain update loop and removes it from the manager without stopping it completely.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Brain:Resume()`
*   **Description:** Resumes a paused brain and re-adds it to the manager.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Brain:_Start_Internal()`
*   **Description:** Internal initialization called by EntityScript. Triggers `OnStart` and adds to manager.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `self.stopped` is `false`.

### `Brain:_Stop_Internal()`
*   **Description:** Internal teardown called by EntityScript. Triggers `OnStop` and removes from manager.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `self.stopped` is `true`.

### `Brain:PushEvent(event, data)`
*   **Description:** Triggers internal event handlers registered via `AddEventHandler`.
*   **Parameters:** `event` (string) - The event identifier. `data` (any) - Data passed to the handler.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** Internal events registered via `AddEventHandler(event, fn)`.
- **Pushes:** Internal events triggered via `PushEvent(event, data)`.
- **Note:** These are specific to the `Brain` object table and do not interact with the global entity event system (`inst:ListenForEvent`).