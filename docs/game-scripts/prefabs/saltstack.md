---
id: saltstack
title: Saltstack
description: A renewable, growable water obstacle that yields salt rocks and rock items when mined, and regrows over time.
tags: [environment, renewable, obstacle]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 68092cd1
system_scope: environment
---

# Saltstack

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`saltstack` is an environmental prefab representing a growable salt pillar in the ocean. It functions as a renewable resource node with four growth stages, interacting with physics (acting as a water obstacle and floating object), work systems (mining), and a growth timer. It supports dynamic state transitions triggered by mining (decreasing work left) and automated regrowth. Its behavior is tightly coupled with the `floater`, `workable`, `lootdropper`, and `worldsettingstimer` components.

## Usage example
```lua
local inst = SpawnPrefab("saltstack")
inst.Transform:SetPosition(0, 0, 0)
-- Growth and mining occur automatically via components
-- To simulate mining:
inst.components.workable:WorkedBy(some_worker, 5)
-- To force regrowth (if below full size):
inst.components.worldsettingstimer:StartTimer("growth", 1)
```

## Dependencies & tags
**Components used:** `floater`, `workable`, `lootdropper`, `worldsettingstimer`, `inspectable`  
**Tags:** `ignorewalkableplatforms`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stackid` | number | `1`–`3` | Determines visual variant (`1`, `2`, or `3`), affecting animation bank/build and floater scale. |
| `workstage` | number | `4` | Current growth stage: `1` = mined out (no colliders), `2` = low, `3` = medium, `4` = full. |
| `workstageprevious` | number | `4` | Tracks previous stage for transition logic (e.g., anim direction and loot dropping). |
| `boat_collided` | boolean? | `nil` | Temporary flag used during boat collision handling to defer physics collider removal. |

## Main functions
### `UpdateState(inst, workleft, loading_in)`
*   **Description:** Updates the saltstack’s visual and physical state based on `workleft`. Handles stage transitions, animation changes, physics colliders (added/removed), layer changes (water vs. world), and floater events.
*   **Parameters:**  
    `inst` (entity instance) — The saltstack instance.  
    `workleft` (number) — Current remaining work to fully mine.  
    `loading_in` (boolean) — If `true`, suppresses loot dropping during load (prevents re-dropping on world restore).  
*   **Returns:** Nothing.  
*   **Error states:** No explicit error handling; relies on valid `workleft` ranges.

### `StartGrowthTimer(inst)`
*   **Description:** Configures and starts the growth timer using tunable frequency and variance, adjusted by `REGROWTH_TIME_MULTIPLIER`.
*   **Parameters:**  
    `inst` (entity instance) — The saltstack instance.  
*   **Returns:** Nothing.  
*   **Error states:** None; always replaces the `"growth"` timer.

### `Grow(inst)`
*   **Description:** Attempts to increment the saltstack’s growth stage if no platform is intersecting it. Increases `workleft` to the next stage’s threshold.
*   **Parameters:**  
    `inst` (entity instance) — The saltstack instance.  
*   **Returns:** Nothing.  
*   **Error states:** If a platform is intersecting, no growth occurs.

### `OnCollide(inst, data)`
*   **Description:** Handles collisions with boats: computes impact damage and performs mining via the `workable` component.
*   **Parameters:**  
    `inst` (entity instance) — The saltstack instance.  
    `data` (table) — Collision event data containing `other` (the boat) and hit velocity info.  
*   **Returns:** Nothing.  
*   **Error states:** Skips damage if no `boatphysics` component is present on `data.other`.

### `SetupStack(inst, stackid)`
*   **Description:** Applies the visual identity (`bank`, `build`, scale, size) based on `stackid`.
*   **Parameters:**  
    `inst` (entity instance) — The saltstack instance.  
    `stackid` (number?) — Optional override for visual variant (`1`, `2`, or `3`). Defaults to random if `nil`.  
*   **Returns:** Nothing.

### `getstatusfn(inst, viewer)`
*   **Description:** Returns a status string for inspection UI based on current `workstage`.
*   **Parameters:**  
    `inst` (entity instance) — The saltstack instance.  
    `viewer` (entity) — The inspecting entity (unused).  
*   **Returns:** `"MINED_OUT"`, `"GROWING"`, or `"GENERIC"` (string).

### `DropLoots(inst, lower, upper)`
*   **Description:** Drops loot for all stages in the given range using associated loot tables.
*   **Parameters:**  
    `inst` (entity instance) — The saltstack instance.  
    `lower` (number?) — Starting index into `loottables`; defaults to `1`.  
    `upper` (number?) — Ending index; defaults to `#loottables`.  
*   **Returns:** Nothing.

### `OnWork(inst, worker, workleft, numworks)`
*   **Description:** Callback invoked by the `workable` component after mining. Restarts the growth timer and updates state.
*   **Parameters:**  
    `inst` (entity instance) — The saltstack instance.  
    `worker` (entity) — The mining entity.  
    `workleft` (number) — Remaining work after the mine action.  
    `numworks` (number) — Number of work units applied.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `timerdone` — Triggers `Grow` via `ontimerdonefn` when the growth timer completes.  
  `on_collide` — Triggers `OnCollide` when the saltstack is hit by a moving boat.  
- **Pushes:** None directly, but events like `floater_startfloating` and `floater_stopfloating` are pushed via the `floater` component on state changes.