---
id: stategraph
title: Stategraph
description: Manages state machines for entities, including state transitions, event handling, timelines, and networking support for client prediction in DST.
tags: [ai, state, network, animation]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ee6b53b4
system_scope: entity
---

# Stategraph

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Stategraph` implements a hierarchical state machine system for entities, enabling complex behavior through state definitions, transition rules, event handlers, and timeline-based timing events (e.g., animations, sound triggers). It serves as the backbone for character and entity AI, supporting state transitions, tag management, and server-client prediction logic via the `StateGraphInstance` class. The system integrates with entity components (especially `playercontroller`), network replication, and modding hooks via `ModManager`.

Key responsibilities:
- Maintaining active state machines via `StateGraphInstance` attached to entities.
- Scheduling state updates via a tick-based scheduler (`updaters`, `tickwaiters`, `hibernaters`).
- Handling buffered and immediate events (`PushEvent`, `HandleEvents`).
- Managing state tags and mapping them to entity tags (e.g., `busy`, `invisible`).
- Supporting client-side prediction with server state validation.

## Usage example
```lua
-- Define states and transitions
local stategraph = StateGraph("my_sg", {
    State({
        name = "idle",
        onenter = function(inst) inst.AnimState:PlayAnimation("idle") end,
        onupdate = function(inst, dt) ... end,
        tags = {"idle", "moving"},
        events = {
            EventHandler("action", function(inst, data) ... return "walk" end),
        },
        timeline = {
            SoundFrameEvent(10, "mysound"),
        }
    }),
    State({
        name = "walk",
        onenter = function(inst) inst.AnimState:PlayAnimation("walk", true) end,
    })
})

-- Attach to an entity
local sgi = StateGraphInstance(stategraph, inst)
inst.sg = sgi
inst.sg:Start()

-- Trigger a state transition
inst.sg:PushEvent("action")
inst.sg:GoToState("walk")
```

## Dependencies & tags
**Components used:**  
- `playercontroller` — accessed via `self.inst.components.playercontroller` for remote prediction and fast-forward logic.

**Tags:**  
Maps internal state tags to entity tags via `SGTagsToEntTags` (e.g., `busy`, `invisible`, `idle`, `working`, `flight`). Tags are added/removed via `inst:AddTag(k)`/`inst:RemoveTag(k)` on master simulation or non-networked entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `instances` | table | `{}` | Global registry mapping each `StateGraphInstance` to its current scheduling list (e.g., `updaters`, `hibernaters`). |
| `updaters` | table | `{}` | List of stategraph instances scheduled for updates this tick. |
| `tickwaiters` | table | `{}` | Map of `tick → {instances}` for delayed wakeups. |
| `hibernaters` | table | `{}` | List of stategraph instances that are currently hibernating. |
| `haveEvents` | table | `{}` | Set of stategraph instances with buffered events pending `HandleEvents`. |

## Main functions
### `StateGraphWrangler:Update(current_tick)`
*   **Description:** Advances the state machine scheduler for the given tick. Processes waiting events, runs `onupdate` logic, and reschedules stategraphs for sleep/wake/hibernate based on timeline/timer states. Calls `UpdateEvents()` to dispatch buffered events.
*   **Parameters:** `current_tick` (number) — current simulation tick time.
*   **Returns:** Nothing.
*   **Error states:** Skips updates for invalid or stopped stategraphs (`k.stopped` or `k.inst:IsValid()`).

### `StateGraphInstance:GoToState(statename, params)`
*   **Description:** Transitions to the specified state, calling `onexit` of the current state and `onenter` of the new state. Applies tag changes to the entity and pushes a `"newstate"` event.
*   **Parameters:**  
  - `statename` (string) — name of the target state.  
  - `params` (table, optional) — data passed to `onenter`.  
*   **Returns:** Nothing.
*   **Error states:** Silently returns (with a console print) if `statename` is invalid.

### `StateGraphInstance:PushEvent(event, data)`
*   **Description:** Buffers an event to be processed in the next `HandleEvents()` call. Attaches the current state name to `data.state`.
*   **Parameters:**  
  - `event` (string) — event name.  
  - `data` (table, optional) — event payload.  
*   **Returns:** Nothing.

### `StateGraphInstance:Update()`
*   **Description:** Performs one frame of state logic: updates `timeinstate`, processes timelines (`TimeEvent`s), checks timeouts, and calls `onupdate`. Returns a suggested sleep duration.
*   **Parameters:** None.
*   **Returns:**  
  - `nil` — sleep indefinitely (hibernate).  
  - `0` — wake immediately.  
  - `number > 0` — delay in seconds before next update.

### `StateGraphInstance:Start(hibernate)`
*   **Description:** Activates the stategraph, adding it to `SGManager`'s scheduling lists.
*   **Parameters:** `hibernate` (boolean) — whether to start in hibernated state.
*   **Returns:** Nothing.

### `StateGraphInstance:Stop()`
*   **Description:** Deactivates the stategraph, clearing buffered events and removing from scheduling lists. Calls `OnStop` if defined (used for limbo transitions).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StateGraphInstance:ServerStateMatches()`
*   **Description:** For clients, checks if the server's state matches the client's predicted state using `player_classified` data.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if server state matches client state.

### `StateGraphInstance:FastForward(time)`
*   **Description:** Adjusts `lastupdatetime` to fast-forward state progress by `time` seconds. Used during client prediction correction.
*   **Parameters:** `time` (number) — time in seconds to advance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** Events are handled via `StateGraphInstance:HandleEvents()`, which dispatches buffered events to:
  - `self.currentstate.events[eventname]` (state-local handlers).
  - `self.sg.events[eventname]` (graph-global handlers).
- **Pushes:** `"newstate"` — fired in `GoToState` after transition is complete. Payload: `{statename = ...}`.