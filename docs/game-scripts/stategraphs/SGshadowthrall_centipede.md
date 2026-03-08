---
id: SGshadowthrall_centipede
title: Sgshadowthrall Centipede
description: Manages the animation, movement, and behavior states for centipede segments of the Shadowthrall mob in DST.
tags: [ai, locomotion, combat, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: d9e8d511
system_scope: entity
---

# Sgshadowthrall Centipede

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This state graph defines the animation-driven behavior and state transitions for centipede segments of the Shadowthrall mob. It handles idle, walk/run, eat, hit, death, and struggle states, coordinating movement via the `locomotor` component and synchronization across segments via `centipedebody`. State tags like `"moving"`, `"running"`, `"struggling"`, and `"busy"` control how segments react to locomotion and combat events.

## Usage example
This state graph is used internally by the Shadowthrall centipede entity and is not directly instantiated by modders. It is returned from the module as a `StateGraph`, typically assigned to the `inst.sg` of centipede prefabs. Example integration (pseudo-code):
```lua
local SG = require("stategraphs/SGshadowthrall_centipede")
local inst = Prefab("shadowthrall_centipede")
inst:AddComponent("centipedebody")
inst:AddComponent("locomotor")
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddComponent("lootdropper")
inst.sg = SG
inst.sg:Start("idle")
```

## Dependencies & tags
**Components used:** `centipedebody`, `combat`, `health`, `locomotor`, `lootdropper`  
**Tags:** Adds `busy`, `canrotate`, `idle`, `moving`, `running`, `struggling`, `nointerrupt`, `forming`, `dead` (indirectly via `dead` state tag); checks `centipede_head`, `busy`, `idle`, `moving`, `running`, `struggling`  
**Common states imported:** `commonstates.lua` (adds void-fall, walk, and run states)

## Properties
No public properties are defined or initialized in the constructor. All logic is encapsulated in state handlers and helper functions.

## Main functions
### `Segment_ClearMovementTasks(body)`
*   **Description:** Cancels pending movement tasks (`start_moving_task`, `stop_moving_task`) to prevent conflicting movement commands during rapid state changes.
*   **Parameters:** `body` (Entity) — centipede segment instance with `DoTaskInTime` and task fields.
*   **Returns:** Nothing.
*   **Error states:** None.

### `Segment_WalkForward(body, should_run)`
*   **Description:** Sets the segment's locomotion to walk or run forward, depending on `should_run`.
*   **Parameters:** `body` (Entity) — segment instance; `should_run` (boolean) — whether to run instead of walk.
*   **Returns:** Nothing.
*   **Error states:** None.

### `Segment_WalkForward_Delay(body, should_run)`
*   **Description:** Schedules `Segment_WalkForward` after a randomized delay (`LOCOMOTE_VARIANCE`) to stagger movement among segments.
*   **Parameters:** `body` (Entity); `should_run` (boolean).
*   **Returns:** Nothing.

### `Segment_Stop(body)`
*   **Description:** Stops locomotion for the segment by calling `locomotor:Stop`.
*   **Parameters:** `body` (Entity).
*   **Returns:** Nothing.

### `Segment_Stop_Delay(body)`
*   **Description:** Schedules `Segment_Stop` after a randomized delay for staggered stop behavior.
*   **Parameters:** `body` (Entity).
*   **Returns:** Nothing.

### `SyncSegment(body, state, randomdelay, excludeotherhead)`
*   **Description:** Sets a segment’s state graph to `state`, optionally with a random delay, and skips execution if `excludeotherhead` is true and the segment is a centipede head.
*   **Parameters:** `body` (Entity); `state` (string) — state name; `randomdelay` (boolean) — whether to add randomness; `excludeotherhead` (boolean).
*   **Returns:** Nothing.

### `SyncSegmentsToState(inst, randomdelay, excludeotherhead)`
*   **Description:** If the instance is the controlling head, propagates its current state to all controlled centipede segments using `SyncSegment`.
*   **Parameters:** `inst` (Entity) — controlling centipede head; `randomdelay` (boolean); `excludeotherhead` (boolean).
*   **Returns:** Nothing.

### `GetDirectionAnim(inst, name)`
*   **Description:** Returns animation name prefixed with `"front_"` or `"back_"` depending on whether the segment is moving backward.
*   **Parameters:** `inst` (Entity); `name` (string) — base animation name.
*   **Returns:** (string) e.g., `"front_walk_loop"`, `"back_walk_pst"`.

### `GoToIdle(inst)`
*   **Description:** convenience helper to transition the state graph to `"idle"`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"death"` — transitions to `"death"` state if the segment has control and is not already dead.
  - `"locomote"` — responds to locomotion requests, transitions to walk/run start/stop states, and synchronizes movement across segments.
  - `"grow_segment"` — transitions to `"grow"` state if not busy.
  - `"start_struggle"` — transitions to `"struggle_pre"` if not struggling.
  - `"OnAttacked"` — handled by `CommonHandlers.OnAttacked()`.
  - `"OnFallInVoid"` — handled by `CommonHandlers.OnFallInVoid()`.
- **Pushes:** No events are directly pushed by this state graph; it responds to external events and uses `inst.sg:GoToState()` for transitions.
