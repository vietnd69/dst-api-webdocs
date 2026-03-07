---
id: rock_ice_temperature
title: Rock Ice Temperature
description: Manages the dynamic stage-based growth and melting of ice boulders in response to local temperature, work, and environmental conditions.
tags: [environment, physics, temperature, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d8277357
system_scope: environment
---

# Rock Ice Temperature

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This prefab implements the logic for `rock_ice_temperature`, a dynamic environmental object that transitions through defined stages (e.g., "tall", "medium", "short", "dryup", "empty") based on temperature, player work (mining), or fire exposure. It interacts with components like `workable`, `lootdropper`, `timer`, and `lunarhailbuildup` to handle gameplay, visual updates, and network synchronization. Stage transitions affect animation, collision, loot drops, and participation in lunar hail mechanics.

## Usage example
```lua
local inst = SpawnPrefab("rock_ice_temperature")
inst.Transform:SetPosition(x, y, z)
inst:SetStage("empty", "melt")  -- Force immediate transition to empty/dried-up state
inst.StartFireMelt()            -- Schedule fire-induced melting in 4 seconds
inst.StopFireMelt()             -- Cancel scheduled fire melting
```

## Dependencies & tags
**Components used:** `lootdropper`, `timer`, `workable`, `inspectable`, `savedscale`, `lunarhailbuildup`
**Tags:** Adds `frozen`, `CLASSIFIED` (only when stage is `"dryup"` or `"empty"`); removes `CLASSIFIED` when transitioning away from those stages.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stage` | string | `"tall"` (initial) | Current stage name: one of `"dryup"`, `"empty"`, `"short"`, `"medium"`, `"tall"`. Controls animation, visibility, work cost, and loot count. |
| `_stage` | net_tinybyte | `4` (0-based index of `"tall"`) | Networked stage index (0-based), synced to clients. |
| `_ismelt` | net_bool | `false` | Networked boolean indicating whether the current stage transition originated from melting. |
| `firemelttask` | task | `nil` | Active delayed task scheduled by `StartFireMelt`; cancels on `StopFireMelt`. |
| `_puddle` | entity | `nil` (server-only) | Client-side child entity (`ice_puddle`) used for ambient animation and effects; nil on dedicated servers. |

## Main functions
### `SetStage(stage, source, snap_to_stage)`
*   **Description:** Transitions the rock to a new stage, updating animation, physics, loot, and lunar hail behavior. Enforces directional progression based on `source` (`"melt"`, `"work"`, `"grow"`) unless `snap_to_stage` is `true`. Prevents invalid growth from `"dryup"` if obstructed.
*   **Parameters:** 
    * `stage` (string) — Target stage name (`"dryup"`, `"empty"`, `"short"`, `"medium"`, `"tall"`).
    * `source` (string) — Origin of transition: `"melt"` (temperature/fire), `"work"` (mining), or `"grow"` (cold).
    * `snap_to_stage` (boolean, optional) — If `true`, jump directly to target stage; otherwise, stepwise progression occurs.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `stage` matches current `inst.stage`, or if progression direction conflicts with `source` and `snap_to_stage` is `false`. Growth from `"dryup"` is blocked if entities (excluding `"locomotor"` and `"FX"`) occupy the tile.

### `StartFireMelt()`
*   **Description:** Schedules a delayed transition to `"dryup"` stage after 4 seconds, cancelling any existing fire-melt task first.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopFireMelt()`
*   **Description:** Cancels any pending fire-melt task and clears `firemelttask`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnWorked(inst, worker, workleft, numworks)`
*   **Description:** Callback invoked when mining completes. Triggers transition to `"empty"` if work is finished, optionally snapping stage based on critical hit (`numworks >= 1000`) or non-character workers. Plays a smash sound at full destruction.
*   **Parameters:** 
    * `inst` — The ice rock entity.
    * `worker` — The entity performing work.
    * `workleft` (number) — Remaining work required before completion.
    * `numworks` (number) — Total work units applied in last hit.
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Timer callback that periodically re-evaluates stage based on local temperature. Increases stage if `GetLocalTemperature(inst) <= 0` (cold), otherwise decreases stage. Loops the timer using `TUNING.ROCK_ICE_TEMPERATURE_GROW_MELT_TIME`.
*   **Parameters:** 
    * `inst` — The ice rock entity.
    * `data` (table) — Timer event data, must include `name == UPDATE_STAGE_TIMERNAME` to be processed.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
    * `"firemelt"` — Triggers `StartFireMelt()`.
    * `"stopfiremelt"` — Triggers `StopFireMelt()`.
    * `"stagedirty"` — Triggers `OnStageDirty()` (client only).
    * `"timerdone"` — Triggers `OnTimerDone()`.
- **Pushes:** `inst:PushEvent("stagedirty")` internally via `SerializeStage()` after stage changes (notified via net updates).
