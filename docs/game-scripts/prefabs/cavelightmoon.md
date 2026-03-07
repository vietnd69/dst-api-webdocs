---
id: cavelightmoon
title: Cavelightmoon
description: Manages dynamic lighting and spawner behavior for cave moonlight effects, adjusting light parameters based on world state and triggering mob spawns when players are nearby.
tags: [lighting, spawner, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4e7767f8
system_scope: environment
---

# Cavelightmoon

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cavelightmoon` is a prefab template responsible for rendering cave-specific moonlight and optionally spawning molebats when players approach. It dynamically adjusts light radius, intensity, falloff, and color based on the current cave phase (day, dusk, night, fullmoon) and world settings. When configured as a spawner (the default `normalfn` variant), it also listens for player proximity and dispatches molebat allies with a configurable cooldown. It relies on networked state (`net_tinybyte`) to synchronize light phase changes across the client-server boundary.

## Usage example
```lua
-- Instantiate the default spawner variant
local inst = SpawnPrefab("cavelightmoon")

-- Example: adjust spawner behavior at runtime
if inst.components.spawner then
    inst.components.spawner:CancelSpawning()
    inst.components.playerprox:SetDist(8, 15)
    inst.components.playerprox:SetOnPlayerNear(function(self_inst, player)
        -- custom handler if needed
    end)
end
```

## Dependencies & tags
**Components used:** `combat`, `playerprox`, `spawner`, `light`, `animstate`, `transform`, `network`
**Tags:** `daylight`, `FX`, `NOCLICK`, `sinkhole`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `widthscale` | number | `0.7` (normal), `0.4` (small), `0.2` (tiny) | Scales the light radius and visual size; smaller values may disable light in certain phases. |
| `_lightphase` | `net_tinybyte` | — | Networked light phase ID, drives `lightphasedirty` event. |
| `_currentlight`, `_startlight`, `_endlight` | table | `{}` | Internal tables storing lerp state for smooth light transitions. |
| `_lighttask` | `task` | `nil` | Task reference for periodic light updates. |
| `_player_spawn_target` | `Entity` | `nil` | Target player used by the spawner’s `onvacate` callback to direct spawned molebats. |

## Main functions
### `OnUpdateLight(inst, dt)`
*   **Description:** Called periodically to interpolate light properties between start and end phases and update the visual representation. Resets and cancels the task when the transition completes.
*   **Parameters:** `inst` (Entity), `dt` (number, time since last frame).
*   **Returns:** Nothing.
*   **Error states:** None documented; assumes `inst._startlight`, `inst._endlight`, and `inst._currentlight` are properly initialized.

### `OnLightPhaseDirty(inst)`
*   **Description:** Triggered by `lightphasedirty` event (client-side) or world state changes (server-side). Updates light parameters for the new cave phase, beginning a transition if parameters changed.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnCavePhase(inst, cavephase)`
*   **Description:** Server-side callback for `cavephase` world state changes. Determines the effective moonlight phase (including special handling for small lights and full moons) and updates the networked light phase ID.
*   **Parameters:** `inst` (Entity), `cavephase` (string: `"day"`, `"dusk"`, `"night"`).
*   **Returns:** Nothing.

### `OnCaveFullMoon(inst, fullmoon)`
*   **Description:** Server-side callback for `iscavefullmoon` world state changes. Activates the fullmoon light phase when a full moon occurs in the caves.
*   **Parameters:** `inst` (Entity), `fullmoon` (boolean).
*   **Returns:** Nothing.

### `onvacate(inst, child)`
*   **Description:** Spawner callback invoked when a spawned molebat entity vacates this spawner’s space. Instructs the molebat to fall and suggests the last nearby player as its combat target.
*   **Parameters:** `inst` (Entity, the spawner), `child` (Entity, the spawned molebat).
*   **Returns:** Nothing.

### `on_player_near(inst, player)`
*   **Description:** Player proximity callback for spawners. Initiates a new molebat spawn with a random delay (5–10 seconds) if no spawn is pending.
*   **Parameters:** `inst` (Entity, the spawner), `player` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `lightphasedirty` (client) — triggers `OnLightPhaseDirty`.
- **Pushes:** `lightphasedirty` (server) — fired when `_lightphase` changes, to synchronize phase on clients.
- **Listens to world state changes:** `cavephase`, `iscavefullmoon` (server only).
- **World state watched:** `cavephase`, `iscavefullmoon` (server).