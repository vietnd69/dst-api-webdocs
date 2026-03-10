---
id: update
title: Update
description: Manages the global game update loop, including wall time, simulation time, static ticks, and long updates for non-player entities.
tags: [update, simulation, network, world]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 85e38e2a
system_scope: world
---

# Update

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file provides the core update infrastructure for the game, implementing multiple update phases: `WallUpdate`, `Update`, `PostUpdate`, `PostPhysicsWallUpdate`, and `StaticUpdate`. These functions drive entity updates, RPC handling, UI rendering, camera control, and long-update logic (e.g., during skip-night or world transitions). It interfaces heavily with global systems such as `TheSim`, `TheNet`, `TheCamera`, `TheInput`, and various entity component collections.

## Usage example
This module does not function as a standalone component. Its functions are called by the engine at appropriate times. Modders do not add or invoke this directly; instead, they interact with the update system via hooks or components:

```lua
-- Example: Hook into the WallUpdate loop to add custom logic
local old_wallupdate = WallUpdate
function WallUpdate(dt)
    old_wallupdate(dt)
    -- Custom wall-time logic here
    if TheNet:GetIsServer() and TheWorld:HasTag("forest") then
        -- e.g., trigger ambient weather effect
    end
end
```

## Dependencies & tags
**Components used:**  
- `beard` (reads `.pause`)  
- `container` (indirectly via `GetGrandOwner` chain)  
- `follower` (via `GetLeader`)  
- `hounded` (via `ForceReleaseSpawn`)  
- `inventoryitem` (via `GetGrandOwner`)  
- `updatelooper` (via `UpdateLooper_PostUpdate`)  
- `walkableplatformmanager` (via `PostUpdate`)  

**Tags:** Checks `player`, `playerghost`, and container/follower relationships; no tags added/removed directly.

## Properties
No public properties exposed on a module level — this is a collection of global functions, not a class/component. Internal state (e.g., `last_tick_seen`, `StaticComponentUpdates`) is managed in the module’s local scope.

## Main functions
### `WallUpdate(dt)`
*   **Description:** Runs every frame on wall time (real time), regardless of simulation state. Handles RPC processing, input, UI updates, camera, mixer, and component wall updates. Critical for networked UI, camera control, and non-sim tasks.
*   **Parameters:** `dt` (number) — delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** Skips input update if `SimTearingDown` is true; does not process some effects (e.g., `ShadeEffectUpdate`) when server is paused.

### `PostUpdate(dt)`
*   **Description:** Runs after simulation update, handling deferred post-frame tasks like emitter management and looper post-updates.
*   **Parameters:** `dt` (number) — delta time.
*   **Returns:** Nothing.

### `PostPhysicsWallUpdate(dt)`
*   **Description:** Runs after physics simulation, used to update walkable platform state.
*   **Parameters:** `dt` (number) — delta time.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `TheWorld` or its `walkableplatformmanager` component is missing.

### `StaticUpdate(dt)`
*   **Description:** Runs only when the server is paused (e.g., during long updates or loading), advancing static scheduler tasks and calling `OnStaticUpdate` on relevant components. Processes static tick queues and UI SG events.
*   **Parameters:** `dt` (number) — typically ignored; `OnStaticUpdate` is called with `0`.
*   **Returns:** Nothing.
*   **Error states:** Skips processing if no new static ticks have elapsed; returns early on repeated ticks.

### `Update(dt)`
*   **Description:** Runs once per simulation tick (sim time), driving entity `OnUpdate`, scheduler, state graphs, and brain updates. Fails an assertion if called while the server is paused.
*   **Parameters:** `dt` (number) — delta time in simulation seconds.
*   **Returns:** Nothing.
*   **Error states:** Asserts `not TheNet:IsServerPaused()`. Returns early if `SimShuttingDown` or if no new ticks have elapsed.

### `LongUpdate(dt, ignore_player)`
*   **Description:** Advances long time intervals (e.g., skipping a night or returning from caves). Can optionally exclude player-owned entities. Uses `beard.pause` to suppress beard updates during long updates for players.
*   **Parameters:**  
  - `dt` (number) — time delta to advance (not real dt, but sim time delta).  
  - `ignore_player` (boolean) — if true, skips long updates for entities owned by or directly following players.  
*   **Returns:** Nothing.
*   **Error states:** None documented.

## Events & listeners
This file does not define any event listeners or push events itself; it is responsible for triggering update callbacks on other systems.