---
id: nightmarelight
title: Nightmarelight
description: Spawns and manages nightmare-type enemies in the Caves during nightmare phases, adjusting light intensity and sanity effects dynamically.
tags: [boss, spawner, environment, boss]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b869fb8c
system_scope: environment
---

# Nightmarelight

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nightmarelight` is a prefab that functions as a boss spawner in the Caves, releasing nightmare entities (e.g., `nightmarebeak`, `ruinsnightmare`) during specific world nightmare phases (`wild`, `dawn`, `warn`). It dynamically adjusts its visual light radius and sanity aura based on the current phase, using a frame-based fade interpolation system. It manages child entity lifecycles, including despawning them when returning to `calm` phase or when killed. The prefab integrates closely with world state, child spawners, sanity, and rift conditions to influence spawn behavior.

## Usage example
This prefab is instantiated automatically by the world during Caves night cycles and should not be manually spawned. Typical modder interaction occurs by listening to its events or modifying `TUNING.NIGHTMARELIGHT_*` values. To extend behavior (e.g., add custom phases), override `TheWorld:WatchWorldState("nightmarephase", ...)` listeners.

```lua
-- Example: Adjust the max children and spawn period for a custom spawn rate
local nightmarelight = SpawnPrefab("nightmarelight")
if nightmarelight and nightmarelight.components.childspawner then
    nightmarelight.components.childspawner:SetMaxChildren(5)
    nightmarelight.components.childspawner:SetSpawnPeriod(20) -- seconds
end
```

## Dependencies & tags
**Components used:**  
`sanityaura`, `childspawner`, `inspectable`, `light`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`  
**Tags:**  
Checks `nightmarephase` world state; does not add or remove tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_lightframe` | `net_smallbyte` | `0` | Current frame of the light fade animation (client/server synced). |
| `_lightradius0` | `net_tinybyte` | `0` | Source light radius for interpolation (client/server synced). |
| `_lightradius1` | `net_tinybyte` | `0` | Target light radius for interpolation (client/server synced). |
| `_lightmaxframe` | number | `30` | Total frames for full fade-in/out (30 for off, 15 for on). |
| `_phasetask` | `task` | `nil` | Delayed phase transition task, canceled on wake/sleep. |
| `_lighttask` | `task` | `nil` | Animation task for light frame updates. |

## Main functions
### `fade_to(inst, rad, instant)`
*   **Description:** Interpolates light radius from current to target `rad`, adjusting animation frames and client/server sync properties. Called internally when phase changes.
*   **Parameters:**  
    `rad` (number) — target light radius (`0`, `3`, or `6`).  
    `instant` (boolean) — if `true`, skips interpolation and sets final values immediately.  
*   **Returns:** Nothing.  
*   **Error states:** No-op if target radius matches current `_lightradius1`.

### `OnNightmarePhaseChanged(inst, phase, instant)`
*   **Description:** Responds to changes in `TheWorld.state.nightmarephase`, scheduling or immediately executing phase state transitions (e.g., `calm`, `warn`, `wild`, `dawn`).
*   **Parameters:**  
    `phase` (string) — new phase name (`"calm"`, `"warn"`, `"wild"`, `"dawn"`).  
    `instant` (boolean) — skip delay and transition immediately (e.g., during sleep/wake).  
*   **Returns:** Nothing.

### `ShowPhaseState(inst, phase, instant)`
*   **Description:** Sets the nightmarelight's visual and behavioral state based on `phase` by invoking the appropriate state function (`states.calm`, `states.warn`, `states.wild`, `states.dawn`).
*   **Parameters:**  
    `phase` (string) — phase name.  
    `instant` (boolean) — whether to play animations instantly.  
*   **Returns:** Nothing.

### `ReturnChildren(inst)`
*   **Description:** On phase return or despawn, clears targeting and loot for child entities and kills them. Used when resetting to `calm` phase.
*   **Parameters:** None.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `lightdirty` — triggers `OnLightDirty` to resume light interpolation.  
- **Pushes:** None directly.  
- **World listeners:**  
  - `nightmarephase` — calls `OnNightmarePhaseChanged` to update phase behavior.  
- **Entity callbacks:**  
  - `OnEntitySleep` — cancels pending phase tasks, kills sounds, forces immediate `nightmarephase` update.  
  - `OnEntityWake` — resumes periodic sounds if in `warn`, `wild`, or `dawn` phases.